import { useCallback, useEffect, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { useAudio } from './hooks/useAudio';
import { useKeyboard, mapKeyToDirection, isConfirmKey, isMenuKey } from './hooks/useKeyboard';
import {
  TitleScreen,
  GameMap,
  BattleScreen,
  DialogueBox,
  StatusPanel,
  GameMenu,
  ShopScreen,
  GameOverScreen,
  EndingScreen,
  IntroScreen,
  ControlsHelp,
} from './components/game';
import { STORY_DIALOGUES } from './data/story';
import { NPC, Item, Weapon, Armor } from './types/game';
import './App.css';

function App() {
  const {
    gameState,
    battleState,
    dialogueQueue,
    currentDialogueIndex,
    setGamePhase,
    startNewGame,
    movePlayer,
    checkForEncounter,
    checkTileEvent,
    triggerTileEvent,
    executeBattleAction,
    executeEnemyTurn,
    endBattle,
    equipItem,
    buyItem,
    showDialogue,
    advanceDialogue,
    selectBattleTarget,
  } = useGameState();

  const { playBgm, playSfx, stopBgm, isMuted, toggleMute } = useAudio();

  const [showMenu, setShowMenu] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [currentShopNpc, setCurrentShopNpc] = useState<NPC | null>(null);
  const [gameTimeCounter, setGameTimeCounter] = useState(0);

  useEffect(() => {
    if (gameState.gamePhase === 'exploration') {
      playBgm(gameState.currentMap.bgm);
    } else if (gameState.gamePhase === 'battle') {
      const isBoss = battleState?.enemies.some(e => e.isBoss);
      playBgm(isBoss ? 'boss' : 'battle');
    }
  }, [gameState.gamePhase, gameState.currentMap.bgm, battleState, playBgm]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.gamePhase === 'exploration') {
      interval = setInterval(() => {
        setGameTimeCounter(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.gamePhase]);

  useEffect(() => {
    if (battleState?.turn === 'enemy' && !battleState.isVictory && !battleState.isDefeat) {
      const timer = setTimeout(() => {
        executeEnemyTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [battleState?.turn, battleState?.isVictory, battleState?.isDefeat, executeEnemyTurn]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gamePhase === 'exploration' && !showMenu && !showShop) {
      const direction = mapKeyToDirection(key);
      if (direction) {
        movePlayer(direction);
        playSfx('cursor');
        
        setTimeout(() => {
          const event = checkTileEvent();
          if (event) {
            if (event.type === 'teleport') {
              playSfx('door');
              triggerTileEvent();
            } else if (event.type === 'item' && !event.triggered) {
              playSfx('chest');
              triggerTileEvent();
            } else if (event.type === 'boss' && !event.triggered) {
              triggerTileEvent();
            } else if (event.type === 'heal') {
              playSfx('heal');
              triggerTileEvent();
            }
          }
          
          if (!event || event.type !== 'boss') {
            checkForEncounter();
          }
        }, 100);
      }

      if (isConfirmKey(key)) {
        const event = checkTileEvent();
        if (event && !event.triggered) {
          triggerTileEvent();
        }
      }

      if (isMenuKey(key)) {
        playSfx('select');
        setShowMenu(true);
      }
    }

    if (gameState.gamePhase === 'dialogue') {
      if (isConfirmKey(key)) {
        playSfx('select');
        advanceDialogue();
      }
    }
  }, [
    gameState.gamePhase,
    showMenu,
    showShop,
    movePlayer,
    checkTileEvent,
    triggerTileEvent,
    checkForEncounter,
    advanceDialogue,
    playSfx,
  ]);

  useKeyboard(handleKeyPress, gameState.gamePhase !== 'title' && gameState.gamePhase !== 'battle');

  const handleStartGame = () => {
    playSfx('select');
    startNewGame();
  };

  const handleIntroComplete = () => {
    showDialogue(STORY_DIALOGUES.chapter1_start);
    setGamePhase('exploration');
  };

  const handleNpcClick = (npc: NPC) => {
    playSfx('select');
    if (npc.isShop && npc.shopItems) {
      setCurrentShopNpc(npc);
      setShowShop(true);
    } else {
      showDialogue(npc.dialogues);
    }
  };

  const handleBuyItem = (item: Item) => {
    buyItem(item);
  };

  const handleCloseShop = () => {
    playSfx('select');
    setShowShop(false);
    setCurrentShopNpc(null);
  };

  const handleCloseMenu = () => {
    playSfx('select');
    setShowMenu(false);
  };

  const handleEquipItem = (item: Weapon | Armor) => {
    equipItem(item);
  };

  const handleUseItem = (item: Item) => {
    if (item.effect.type === 'heal') {
      const healAmount = Math.min(
        item.effect.value,
        gameState.player.stats.maxHp - gameState.player.stats.hp
      );
      if (healAmount > 0) {
        playSfx('heal');
      }
    } else if (item.effect.type === 'healMp') {
      const healAmount = Math.min(
        item.effect.value,
        gameState.player.stats.maxMp - gameState.player.stats.mp
      );
      if (healAmount > 0) {
        playSfx('heal');
      }
    }
  };

  const handleRetry = () => {
    playSfx('select');
    startNewGame();
    setGameTimeCounter(0);
  };

  const handleGoToTitle = () => {
    playSfx('select');
    setGamePhase('title');
    stopBgm();
    setGameTimeCounter(0);
  };

  const handleEndBattle = () => {
    if (battleState?.isVictory) {
      playSfx('levelup');
    }
    endBattle();
  };

  return (
    <div className="w-full h-screen bg-gray-900 overflow-hidden">
      {gameState.gamePhase === 'title' && (
        <TitleScreen onStartGame={handleStartGame} onPlayBgm={playBgm} />
      )}

      {gameState.gamePhase === 'intro' && (
        <IntroScreen onComplete={handleIntroComplete} onPlayBgm={playBgm} />
      )}

      {gameState.gamePhase === 'exploration' && (
        <div className="w-full h-full flex">
          <div className="flex-1 flex items-center justify-center p-4">
            <GameMap
              map={gameState.currentMap}
              playerPosition={gameState.player.position}
              onNpcClick={handleNpcClick}
            />
          </div>

          <div className="w-72 p-4 space-y-4">
            <StatusPanel
              player={gameState.player}
              gameTime={gameTimeCounter}
              currentChapter={gameState.currentChapter.name}
            />
            <ControlsHelp show={true} />
            
            <button
              onClick={toggleMute}
              className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm"
            >
              {isMuted ? '🔇 音声OFF' : '🔊 音声ON'}
            </button>
          </div>
        </div>
      )}

      {gameState.gamePhase === 'battle' && battleState && (
        <BattleScreen
          battleState={battleState}
          onAction={executeBattleAction}
          onSelectTarget={selectBattleTarget}
          onEndBattle={handleEndBattle}
          playSfx={playSfx}
        />
      )}

      {gameState.gamePhase === 'dialogue' && dialogueQueue.length > 0 && (
        <div className="w-full h-full">
          <div className="w-full h-full flex">
            <div className="flex-1 flex items-center justify-center p-4">
              <GameMap
                map={gameState.currentMap}
                playerPosition={gameState.player.position}
              />
            </div>
            <div className="w-72 p-4">
              <StatusPanel
                player={gameState.player}
                gameTime={gameTimeCounter}
                currentChapter={gameState.currentChapter.name}
              />
            </div>
          </div>
          <DialogueBox
            dialogue={dialogueQueue[currentDialogueIndex]}
            onAdvance={advanceDialogue}
            isLastDialogue={currentDialogueIndex === dialogueQueue.length - 1}
          />
        </div>
      )}

      {gameState.gamePhase === 'gameover' && (
        <GameOverScreen
          onRetry={handleRetry}
          onTitle={handleGoToTitle}
          onPlayBgm={playBgm}
        />
      )}

      {gameState.gamePhase === 'ending' && (
        <EndingScreen
          onTitle={handleGoToTitle}
          onPlayBgm={playBgm}
          gameTime={gameTimeCounter}
          playerLevel={gameState.player.stats.level}
        />
      )}

      {showMenu && gameState.gamePhase === 'exploration' && (
        <GameMenu
          player={gameState.player}
          onClose={handleCloseMenu}
          onEquip={handleEquipItem}
          onUseItem={handleUseItem}
          playSfx={playSfx}
        />
      )}

      {showShop && currentShopNpc && (
        <ShopScreen
          player={gameState.player}
          shop={currentShopNpc}
          onBuy={handleBuyItem}
          onClose={handleCloseShop}
          playSfx={playSfx}
        />
      )}
    </div>
  );
}

export default App;
