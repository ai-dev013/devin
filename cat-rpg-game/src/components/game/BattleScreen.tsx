import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BattleState, BattleAction, Magic, Item } from '@/types/game';

interface BattleScreenProps {
  battleState: BattleState;
  onAction: (action: BattleAction) => void;
  onSelectTarget: (index: number) => void;
  onEndBattle: () => void;
  playSfx: (sound: string) => void;
}

const ENEMY_SPRITES: Record<string, string> = {
  slime: '🟢',
  wolf: '🐺',
  bear: '🐻',
  snake: '🐍',
  bird: '🦅',
  goblin: '👺',
  skeleton: '💀',
  darkWolf: '🐺',
  darkBear: '🐻',
  dragon: '🐉',
};

type BattleMenu = 'main' | 'magic' | 'item' | 'target';

export function BattleScreen({ 
  battleState, 
  onAction, 
  onSelectTarget, 
  onEndBattle,
  playSfx 
}: BattleScreenProps) {
  const [currentMenu, setCurrentMenu] = useState<BattleMenu>('main');
  const [selectedMagic, setSelectedMagic] = useState<Magic | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [animatingAction, setAnimatingAction] = useState(false);

  const { player, enemies, turn, selectedTarget, battleLog, isVictory, isDefeat } = battleState;

  useEffect(() => {
    if (turn === 'enemy' && !isVictory && !isDefeat) {
      setAnimatingAction(true);
      const timer = setTimeout(() => {
        setAnimatingAction(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [turn, isVictory, isDefeat]);

  const handleMainAction = (action: string) => {
    playSfx('select');
    switch (action) {
      case 'attack':
        setCurrentMenu('target');
        break;
      case 'magic':
        setCurrentMenu('magic');
        break;
      case 'item':
        setCurrentMenu('item');
        break;
      case 'defend':
        onAction({ type: 'defend' });
        setCurrentMenu('main');
        break;
      case 'run':
        onAction({ type: 'run' });
        setCurrentMenu('main');
        break;
    }
  };

  const handleMagicSelect = (magic: Magic) => {
    playSfx('select');
    setSelectedMagic(magic);
    if (magic.type === 'healing') {
      playSfx('magic');
      onAction({ type: 'magic', magic });
      setCurrentMenu('main');
      setSelectedMagic(null);
    } else {
      setCurrentMenu('target');
    }
  };

  const handleItemSelect = (item: Item) => {
    playSfx('select');
    setSelectedItem(item);
    if (item.effect.type === 'heal' || item.effect.type === 'healMp') {
      playSfx('item');
      onAction({ type: 'item', item });
      setCurrentMenu('main');
      setSelectedItem(null);
    } else {
      setCurrentMenu('target');
    }
  };

  const handleTargetSelect = (index: number) => {
    playSfx('select');
    onSelectTarget(index);
    
    if (selectedMagic) {
      playSfx('magic');
      onAction({ type: 'magic', magic: selectedMagic });
      setSelectedMagic(null);
    } else if (selectedItem) {
      playSfx('item');
      onAction({ type: 'item', item: selectedItem });
      setSelectedItem(null);
    } else {
      playSfx('attack');
      onAction({ type: 'attack' });
    }
    
    setCurrentMenu('main');
  };

  const handleBack = () => {
    playSfx('cursor');
    setCurrentMenu('main');
    setSelectedMagic(null);
    setSelectedItem(null);
  };

  const aliveEnemies = enemies.filter(e => e.isAlive);

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black flex flex-col">
      <div className="flex-1 p-4">
        <div className="flex justify-center gap-8 mb-8 pt-8">
          {enemies.map((enemy, index) => (
            <div
              key={enemy.id}
              className={`relative p-4 rounded-lg transition-all duration-300 ${
                enemy.isAlive 
                  ? selectedTarget === index 
                    ? 'bg-red-900/50 ring-2 ring-red-500' 
                    : 'bg-gray-800/50'
                  : 'opacity-30'
              } ${currentMenu === 'target' && enemy.isAlive ? 'cursor-pointer hover:bg-red-800/50' : ''}`}
              onClick={() => currentMenu === 'target' && enemy.isAlive && handleTargetSelect(index)}
            >
              <div className="text-6xl mb-2 text-center">
                {enemy.isBoss ? (
                  <span className="animate-pulse">{ENEMY_SPRITES[enemy.type] || '👾'}</span>
                ) : (
                  ENEMY_SPRITES[enemy.type] || '👾'
                )}
              </div>
              <div className="text-center text-white font-bold mb-2">
                {enemy.name}
                {enemy.isBoss && <span className="text-yellow-400 ml-1">★</span>}
              </div>
              <div className="w-32">
                <div className="text-xs text-gray-400 mb-1">HP</div>
                <Progress 
                  value={(enemy.stats.hp / enemy.stats.maxHp) * 100} 
                  className="h-2 bg-gray-700"
                />
                <div className="text-xs text-gray-400 text-right mt-1">
                  {enemy.stats.hp}/{enemy.stats.maxHp}
                </div>
              </div>
              {!enemy.isAlive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">💀</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-800/80 rounded-lg p-4 max-w-2xl mx-auto mb-4">
          <div className="h-24 overflow-y-auto">
            {battleLog.slice(-4).map((log, index) => (
              <p key={index} className="text-white text-sm mb-1 animate-fadeIn">
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border-t-4 border-gray-700 p-4">
        <div className="flex gap-8 max-w-4xl mx-auto">
          <div className="bg-blue-900/50 rounded-lg p-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🐱</span>
              <div>
                <div className="text-white font-bold text-lg">{player.name}</div>
                <div className="text-sm text-gray-300">Lv.{player.stats.level}</div>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>HP</span>
                  <span>{player.stats.hp}/{player.stats.maxHp}</span>
                </div>
                <Progress 
                  value={(player.stats.hp / player.stats.maxHp) * 100} 
                  className="h-3 bg-gray-700"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>MP</span>
                  <span>{player.stats.mp}/{player.stats.maxMp}</span>
                </div>
                <Progress 
                  value={(player.stats.mp / player.stats.maxMp) * 100} 
                  className="h-3 bg-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            {(isVictory || isDefeat) ? (
              <div className="text-center py-4">
                <div className="text-2xl font-bold mb-4">
                  {isVictory ? (
                    <span className="text-yellow-400">勝利！</span>
                  ) : (
                    <span className="text-red-500">敗北...</span>
                  )}
                </div>
                {isVictory && battleState.rewards && (
                  <div className="text-white mb-4">
                    <p>獲得経験値: {battleState.rewards.exp}</p>
                    <p>獲得ゴールド: {battleState.rewards.gold}</p>
                  </div>
                )}
                <Button
                  onClick={onEndBattle}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2"
                >
                  続ける
                </Button>
              </div>
            ) : turn === 'enemy' || animatingAction ? (
              <div className="text-center py-8">
                <div className="text-white text-xl animate-pulse">
                  敵のターン...
                </div>
              </div>
            ) : (
              <>
                {currentMenu === 'main' && (
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => handleMainAction('attack')}
                      className="bg-red-600 hover:bg-red-500 text-white h-12"
                    >
                      ⚔️ 攻撃
                    </Button>
                    <Button
                      onClick={() => handleMainAction('magic')}
                      className="bg-purple-600 hover:bg-purple-500 text-white h-12"
                    >
                      ✨ 魔法
                    </Button>
                    <Button
                      onClick={() => handleMainAction('item')}
                      className="bg-green-600 hover:bg-green-500 text-white h-12"
                    >
                      🎒 アイテム
                    </Button>
                    <Button
                      onClick={() => handleMainAction('defend')}
                      className="bg-blue-600 hover:bg-blue-500 text-white h-12"
                    >
                      🛡️ 防御
                    </Button>
                    <Button
                      onClick={() => handleMainAction('run')}
                      className="bg-gray-600 hover:bg-gray-500 text-white h-12 col-span-2"
                      disabled={enemies.some(e => e.isBoss)}
                    >
                      🏃 逃げる
                    </Button>
                  </div>
                )}

                {currentMenu === 'magic' && (
                  <div className="space-y-2">
                    <div className="text-white text-sm mb-2">魔法を選択:</div>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {player.learnedMagic.map(magic => (
                        <Button
                          key={magic.id}
                          onClick={() => handleMagicSelect(magic)}
                          disabled={player.stats.mp < magic.mpCost}
                          className={`text-left justify-start h-auto py-2 ${
                            player.stats.mp < magic.mpCost 
                              ? 'bg-gray-700 text-gray-500' 
                              : 'bg-purple-700 hover:bg-purple-600 text-white'
                          }`}
                        >
                          <div>
                            <div className="font-bold">{magic.name}</div>
                            <div className="text-xs">MP: {magic.mpCost}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={handleBack}
                      className="w-full bg-gray-600 hover:bg-gray-500 text-white mt-2"
                    >
                      戻る
                    </Button>
                  </div>
                )}

                {currentMenu === 'item' && (
                  <div className="space-y-2">
                    <div className="text-white text-sm mb-2">アイテムを選択:</div>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {player.inventory
                        .filter(inv => inv.item.type === 'consumable')
                        .map(inv => (
                          <Button
                            key={inv.item.id}
                            onClick={() => handleItemSelect(inv.item)}
                            className="bg-green-700 hover:bg-green-600 text-white text-left justify-start h-auto py-2"
                          >
                            <div>
                              <div className="font-bold">{inv.item.name}</div>
                              <div className="text-xs">x{inv.quantity}</div>
                            </div>
                          </Button>
                        ))}
                    </div>
                    {player.inventory.filter(inv => inv.item.type === 'consumable').length === 0 && (
                      <div className="text-gray-400 text-center py-4">
                        使えるアイテムがありません
                      </div>
                    )}
                    <Button
                      onClick={handleBack}
                      className="w-full bg-gray-600 hover:bg-gray-500 text-white mt-2"
                    >
                      戻る
                    </Button>
                  </div>
                )}

                {currentMenu === 'target' && (
                  <div className="space-y-2">
                    <div className="text-white text-sm mb-2">ターゲットを選択:</div>
                    <div className="grid grid-cols-2 gap-2">
                                            {aliveEnemies.map((enemy) => (
                                              <Button
                                                key={enemy.id}
                                                onClick={() => handleTargetSelect(enemies.indexOf(enemy))}
                          className="bg-red-700 hover:bg-red-600 text-white"
                        >
                          {ENEMY_SPRITES[enemy.type]} {enemy.name}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={handleBack}
                      className="w-full bg-gray-600 hover:bg-gray-500 text-white mt-2"
                    >
                      戻る
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
