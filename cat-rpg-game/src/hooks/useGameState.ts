import { useState, useCallback } from 'react';
import { 
  GameState, 
  Player, 
  GamePhase, 
  Enemy,
  Item,
  Magic,
  Weapon,
  Armor,
  BattleState,
  BattleAction,
} from '../types/game';
import { CHAPTERS } from '../data/story';
import { ALL_MAPS, getMapById } from '../data/maps';
import { MAGIC_SPELLS, CONSUMABLE_ITEMS, WEAPONS, ARMORS } from '../data/items';
import { createEnemy, getRandomEnemyForArea, ENEMY_TEMPLATES } from '../data/enemies';

const INITIAL_PLAYER: Player = {
  id: 'player',
  name: 'ニャン太',
  stats: {
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    attack: 10,
    defense: 5,
    speed: 8,
    level: 1,
    exp: 0,
    expToNext: 100,
  },
  position: { x: 10, y: 10 },
  sprite: 'cat-hero',
  isAlive: true,
  gold: 100,
  inventory: [
    { item: CONSUMABLE_ITEMS[0], quantity: 3 },
    { item: CONSUMABLE_ITEMS[3], quantity: 2 },
  ],
  equipment: {
    weapon: WEAPONS[0],
    armor: ARMORS[0],
    accessory: null,
  },
  learnedMagic: [MAGIC_SPELLS[0], MAGIC_SPELLS[3], MAGIC_SPELLS[9]],
};

const INITIAL_GAME_STATE: GameState = {
  player: INITIAL_PLAYER,
  currentMap: ALL_MAPS.village,
  currentChapter: CHAPTERS[0],
  chapters: CHAPTERS,
  gameTime: 0,
  battleCount: 0,
  defeatedBosses: [],
  flags: {},
  gamePhase: 'title',
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [dialogueQueue, setDialogueQueue] = useState<{ speaker: string; text: string }[]>([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [encounterCooldown, setEncounterCooldown] = useState(0);

  const setGamePhase = useCallback((phase: GamePhase) => {
    setGameState(prev => ({ ...prev, gamePhase: phase }));
  }, []);

  const startNewGame = useCallback(() => {
    setGameState({
      ...INITIAL_GAME_STATE,
      player: { ...INITIAL_PLAYER },
      currentMap: { ...ALL_MAPS.village },
      gamePhase: 'intro',
    });
    setBattleState(null);
    setDialogueQueue([]);
    setCurrentDialogueIndex(0);
  }, []);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.gamePhase !== 'exploration') return;

    setGameState(prev => {
      const newPosition = { ...prev.player.position };
      
      switch (direction) {
        case 'up':
          newPosition.y = Math.max(0, newPosition.y - 1);
          break;
        case 'down':
          newPosition.y = Math.min(prev.currentMap.height - 1, newPosition.y + 1);
          break;
        case 'left':
          newPosition.x = Math.max(0, newPosition.x - 1);
          break;
        case 'right':
          newPosition.x = Math.min(prev.currentMap.width - 1, newPosition.x + 1);
          break;
      }

      const tile = prev.currentMap.tiles[newPosition.y]?.[newPosition.x];
      if (!tile || !tile.walkable) {
        return prev;
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          position: newPosition,
        },
        gameTime: prev.gameTime + 1,
      };
    });

    if (encounterCooldown > 0) {
      setEncounterCooldown(prev => prev - 1);
    }
  }, [gameState.gamePhase, encounterCooldown]);

  const checkForEncounter = useCallback(() => {
    if (gameState.gamePhase !== 'exploration') return false;
    if (encounterCooldown > 0) return false;
    
    const mapId = gameState.currentMap.id;
    if (mapId === 'village') return false;

    const encounterRate = mapId === 'darkCastle' ? 0.15 : 0.1;
    
    if (Math.random() < encounterRate) {
      const areaLevel = gameState.currentChapter.id * 3;
      const enemyType = getRandomEnemyForArea(areaLevel);
      const enemyCount = Math.floor(Math.random() * 2) + 1;
      
      const enemies: Enemy[] = [];
      for (let i = 0; i < enemyCount; i++) {
        enemies.push(createEnemy(enemyType, { x: 0, y: 0 }));
      }
      
      startBattle(enemies);
      setEncounterCooldown(5);
      return true;
    }
    
    return false;
  }, [gameState.gamePhase, gameState.currentMap.id, gameState.currentChapter.id, encounterCooldown]);

  const checkTileEvent = useCallback(() => {
    const { position } = gameState.player;
    const tile = gameState.currentMap.tiles[position.y]?.[position.x];
    
    if (!tile?.event || tile.event.triggered) return null;
    
    return tile.event;
  }, [gameState.player.position, gameState.currentMap]);

  const triggerTileEvent = useCallback(() => {
    const event = checkTileEvent();
    if (!event) return;

    const { position } = gameState.player;

    switch (event.type) {
      case 'teleport':
        if (event.data.destination) {
          const newMap = getMapById(event.data.destination.mapId);
          if (newMap) {
            setGameState(prev => ({
              ...prev,
              currentMap: { ...newMap },
              player: {
                ...prev.player,
                position: { ...event.data.destination!.position },
              },
            }));
          }
        }
        break;

      case 'item':
        if (event.data.items) {
          event.data.items.forEach(item => {
            addItemToInventory(item);
          });
          setGameState(prev => {
            const newTiles = [...prev.currentMap.tiles.map(row => [...row])];
            newTiles[position.y][position.x] = {
              ...newTiles[position.y][position.x],
              event: { ...event, triggered: true },
            };
            return {
              ...prev,
              currentMap: { ...prev.currentMap, tiles: newTiles },
            };
          });
        }
        break;

      case 'boss':
        if (event.data.enemies) {
          const bossEnemies = event.data.enemies.map(type => 
            createEnemy(type as keyof typeof ENEMY_TEMPLATES, { x: 0, y: 0 })
          );
          startBattle(bossEnemies, true);
        }
        break;

      case 'heal':
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            stats: {
              ...prev.player.stats,
              hp: prev.player.stats.maxHp,
              mp: prev.player.stats.maxMp,
            },
          },
        }));
        break;
    }
  }, [checkTileEvent, gameState.player.position]);

  const startBattle = useCallback((enemies: Enemy[], isBossBattle: boolean = false) => {
    setBattleState({
      player: { ...gameState.player },
      enemies: enemies.map(e => ({ ...e, stats: { ...e.stats } })),
      turn: 'player',
      currentEnemyIndex: 0,
      selectedAction: null,
      selectedTarget: 0,
      battleLog: [isBossBattle ? 'ボス戦が始まった！' : 'モンスターが現れた！'],
      isVictory: false,
      isDefeat: false,
      rewards: { exp: 0, gold: 0, items: [] },
    });
    setGamePhase('battle');
  }, [gameState.player, setGamePhase]);

  const executeBattleAction = useCallback((action: BattleAction) => {
    if (!battleState || battleState.turn !== 'player') return;

    setBattleState(prev => {
      if (!prev) return null;

      const newState = { ...prev, battleLog: [...prev.battleLog] };
      const player = { ...newState.player, stats: { ...newState.player.stats } };
      const enemies = newState.enemies.map(e => ({ ...e, stats: { ...e.stats } }));

      switch (action.type) {
        case 'attack': {
          const target = enemies[newState.selectedTarget];
          if (target && target.isAlive) {
            const weaponBonus = player.equipment.weapon?.attackBonus || 0;
            const damage = Math.max(1, player.stats.attack + weaponBonus - target.stats.defense);
            target.stats.hp = Math.max(0, target.stats.hp - damage);
            newState.battleLog.push(`${player.name}の攻撃！${target.name}に${damage}のダメージ！`);
            
            if (target.stats.hp <= 0) {
              target.isAlive = false;
              newState.battleLog.push(`${target.name}を倒した！`);
            }
          }
          break;
        }

        case 'magic': {
          const magic = action.magic;
          if (player.stats.mp < magic.mpCost) {
            newState.battleLog.push('MPが足りない！');
            return prev;
          }
          
          player.stats.mp -= magic.mpCost;
          
          if (magic.type === 'healing') {
            const healAmount = Math.min(magic.power, player.stats.maxHp - player.stats.hp);
            player.stats.hp += healAmount;
            newState.battleLog.push(`${magic.name}！HPが${healAmount}回復した！`);
          } else if (magic.type === 'offensive') {
            const magicBonus = player.equipment.weapon?.magicBonus || 0;
            
            if (magic.target === 'all') {
              enemies.forEach(enemy => {
                if (enemy.isAlive) {
                  const damage = Math.max(1, magic.power + magicBonus);
                  enemy.stats.hp = Math.max(0, enemy.stats.hp - damage);
                  newState.battleLog.push(`${magic.name}！${enemy.name}に${damage}のダメージ！`);
                  if (enemy.stats.hp <= 0) {
                    enemy.isAlive = false;
                    newState.battleLog.push(`${enemy.name}を倒した！`);
                  }
                }
              });
            } else {
              const target = enemies[newState.selectedTarget];
              if (target && target.isAlive) {
                const damage = Math.max(1, magic.power + magicBonus);
                target.stats.hp = Math.max(0, target.stats.hp - damage);
                newState.battleLog.push(`${magic.name}！${target.name}に${damage}のダメージ！`);
                if (target.stats.hp <= 0) {
                  target.isAlive = false;
                  newState.battleLog.push(`${target.name}を倒した！`);
                }
              }
            }
          }
          break;
        }

        case 'item': {
          const item = action.item;
          const inventoryItem = player.inventory.find(i => i.item.id === item.id);
          if (!inventoryItem || inventoryItem.quantity <= 0) {
            newState.battleLog.push('アイテムがない！');
            return prev;
          }
          
          inventoryItem.quantity--;
          if (inventoryItem.quantity <= 0) {
            player.inventory = player.inventory.filter(i => i.item.id !== item.id);
          }
          
          if (item.effect.type === 'heal') {
            const healAmount = Math.min(item.effect.value, player.stats.maxHp - player.stats.hp);
            player.stats.hp += healAmount;
            newState.battleLog.push(`${item.name}を使った！HPが${healAmount}回復した！`);
          } else if (item.effect.type === 'healMp') {
            const healAmount = Math.min(item.effect.value, player.stats.maxMp - player.stats.mp);
            player.stats.mp += healAmount;
            newState.battleLog.push(`${item.name}を使った！MPが${healAmount}回復した！`);
          } else if (item.effect.type === 'damage') {
            const target = enemies[newState.selectedTarget];
            if (target && target.isAlive) {
              target.stats.hp = Math.max(0, target.stats.hp - item.effect.value);
              newState.battleLog.push(`${item.name}を使った！${target.name}に${item.effect.value}のダメージ！`);
              if (target.stats.hp <= 0) {
                target.isAlive = false;
                newState.battleLog.push(`${target.name}を倒した！`);
              }
            }
          }
          break;
        }

        case 'defend': {
          newState.battleLog.push(`${player.name}は防御の構えをとった！`);
          break;
        }

        case 'run': {
          const escapeChance = 0.5 + (player.stats.speed / 100);
          if (Math.random() < escapeChance) {
            newState.battleLog.push('逃げ出した！');
            return { ...newState, isVictory: false, isDefeat: false, turn: 'player' };
          } else {
            newState.battleLog.push('逃げられなかった！');
          }
          break;
        }
      }

      newState.player = player;
      newState.enemies = enemies;

      const allEnemiesDead = enemies.every(e => !e.isAlive);
      if (allEnemiesDead) {
        let totalExp = 0;
        let totalGold = 0;
        const droppedItems: Item[] = [];

        enemies.forEach(enemy => {
          totalExp += enemy.expReward;
          totalGold += enemy.goldReward;
          enemy.dropItems.forEach(drop => {
            if (Math.random() < drop.chance) {
              droppedItems.push(drop.item);
            }
          });
        });

        newState.isVictory = true;
        newState.rewards = { exp: totalExp, gold: totalGold, items: droppedItems };
        newState.battleLog.push(`勝利！${totalExp}の経験値と${totalGold}ゴールドを獲得！`);
        
        if (droppedItems.length > 0) {
          droppedItems.forEach(item => {
            newState.battleLog.push(`${item.name}を手に入れた！`);
          });
        }
      } else {
        newState.turn = 'enemy';
      }

      return newState;
    });
  }, [battleState]);

  const executeEnemyTurn = useCallback(() => {
    if (!battleState || battleState.turn !== 'enemy') return;

    setBattleState(prev => {
      if (!prev) return null;

      const newState = { ...prev, battleLog: [...prev.battleLog] };
      const player = { ...newState.player, stats: { ...newState.player.stats } };

      newState.enemies.forEach(enemy => {
        if (!enemy.isAlive) return;

        const damage = Math.max(1, enemy.stats.attack - player.stats.defense - (player.equipment.armor?.defenseBonus || 0));
        player.stats.hp = Math.max(0, player.stats.hp - damage);
        newState.battleLog.push(`${enemy.name}の攻撃！${player.name}に${damage}のダメージ！`);
      });

      newState.player = player;

      if (player.stats.hp <= 0) {
        newState.isDefeat = true;
        newState.battleLog.push(`${player.name}は倒れた...`);
      } else {
        newState.turn = 'player';
      }

      return newState;
    });
  }, [battleState]);

  const endBattle = useCallback(() => {
    if (!battleState) return;

    if (battleState.isVictory) {
      setGameState(prev => {
        const newPlayer = { ...prev.player, stats: { ...prev.player.stats } };
        newPlayer.stats.hp = battleState.player.stats.hp;
        newPlayer.stats.mp = battleState.player.stats.mp;
        newPlayer.gold += battleState.rewards.gold;
        newPlayer.stats.exp += battleState.rewards.exp;
        newPlayer.inventory = [...battleState.player.inventory];

        battleState.rewards.items.forEach(item => {
          const existing = newPlayer.inventory.find(i => i.item.id === item.id);
          if (existing) {
            existing.quantity++;
          } else {
            newPlayer.inventory.push({ item, quantity: 1 });
          }
        });

        while (newPlayer.stats.exp >= newPlayer.stats.expToNext) {
          newPlayer.stats.exp -= newPlayer.stats.expToNext;
          newPlayer.stats.level++;
          newPlayer.stats.maxHp += 10;
          newPlayer.stats.maxMp += 5;
          newPlayer.stats.attack += 3;
          newPlayer.stats.defense += 2;
          newPlayer.stats.speed += 1;
          newPlayer.stats.hp = newPlayer.stats.maxHp;
          newPlayer.stats.mp = newPlayer.stats.maxMp;
          newPlayer.stats.expToNext = Math.floor(newPlayer.stats.expToNext * 1.5);
        }

        const defeatedBoss = battleState.enemies.find(e => e.isBoss);
        const newDefeatedBosses = [...prev.defeatedBosses];
        const newChapters = [...prev.chapters];
        
        if (defeatedBoss) {
          newDefeatedBosses.push(defeatedBoss.type);
          
          if (defeatedBoss.type === 'dragon') {
            return {
              ...prev,
              player: newPlayer,
              defeatedBosses: newDefeatedBosses,
              gamePhase: 'ending' as GamePhase,
            };
          }
          
          const currentChapterIndex = newChapters.findIndex(c => c.id === prev.currentChapter.id);
          if (currentChapterIndex >= 0 && currentChapterIndex < newChapters.length - 1) {
            newChapters[currentChapterIndex] = { ...newChapters[currentChapterIndex], completed: true };
            newChapters[currentChapterIndex + 1] = { ...newChapters[currentChapterIndex + 1], unlocked: true };
          }
        }

        return {
          ...prev,
          player: newPlayer,
          battleCount: prev.battleCount + 1,
          defeatedBosses: newDefeatedBosses,
          chapters: newChapters,
          gamePhase: 'exploration' as GamePhase,
        };
      });
    } else if (battleState.isDefeat) {
      setGamePhase('gameover');
    } else {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          stats: {
            ...prev.player.stats,
            hp: battleState.player.stats.hp,
            mp: battleState.player.stats.mp,
          },
          inventory: [...battleState.player.inventory],
        },
        gamePhase: 'exploration' as GamePhase,
      }));
    }

    setBattleState(null);
  }, [battleState, setGamePhase]);

  const addItemToInventory = useCallback((item: Item) => {
    setGameState(prev => {
      const newInventory = [...prev.player.inventory];
      const existing = newInventory.find(i => i.item.id === item.id);
      
      if (existing) {
        existing.quantity++;
      } else {
        newInventory.push({ item, quantity: 1 });
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          inventory: newInventory,
        },
      };
    });
  }, []);

  const removeItemFromInventory = useCallback((itemId: string, quantity: number = 1) => {
    setGameState(prev => {
      const newInventory = prev.player.inventory
        .map(i => {
          if (i.item.id === itemId) {
            return { ...i, quantity: i.quantity - quantity };
          }
          return i;
        })
        .filter(i => i.quantity > 0);

      return {
        ...prev,
        player: {
          ...prev.player,
          inventory: newInventory,
        },
      };
    });
  }, []);

  const equipItem = useCallback((item: Weapon | Armor) => {
    setGameState(prev => {
      const newEquipment = { ...prev.player.equipment };
      
      if (item.type === 'weapon') {
        newEquipment.weapon = item as Weapon;
      } else if (item.type === 'armor') {
        newEquipment.armor = item as Armor;
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          equipment: newEquipment,
        },
      };
    });
  }, []);

  const learnMagic = useCallback((magic: Magic) => {
    setGameState(prev => {
      if (prev.player.learnedMagic.some(m => m.id === magic.id)) {
        return prev;
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          learnedMagic: [...prev.player.learnedMagic, magic],
        },
      };
    });
  }, []);

  const buyItem = useCallback((item: Item) => {
    setGameState(prev => {
      if (prev.player.gold < item.price) {
        return prev;
      }

      const newInventory = [...prev.player.inventory];
      const existing = newInventory.find(i => i.item.id === item.id);
      
      if (existing) {
        existing.quantity++;
      } else {
        newInventory.push({ item, quantity: 1 });
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          gold: prev.player.gold - item.price,
          inventory: newInventory,
        },
      };
    });
  }, []);

  const restAtInn = useCallback((cost: number) => {
    setGameState(prev => {
      if (prev.player.gold < cost) {
        return prev;
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          gold: prev.player.gold - cost,
          stats: {
            ...prev.player.stats,
            hp: prev.player.stats.maxHp,
            mp: prev.player.stats.maxMp,
          },
        },
      };
    });
  }, []);

  const showDialogue = useCallback((dialogues: { speaker: string; text: string }[]) => {
    setDialogueQueue(dialogues);
    setCurrentDialogueIndex(0);
    setGamePhase('dialogue');
  }, [setGamePhase]);

  const advanceDialogue = useCallback(() => {
    if (currentDialogueIndex < dialogueQueue.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      setDialogueQueue([]);
      setCurrentDialogueIndex(0);
      setGamePhase('exploration');
    }
  }, [currentDialogueIndex, dialogueQueue.length, setGamePhase]);

  const selectBattleTarget = useCallback((targetIndex: number) => {
    setBattleState(prev => {
      if (!prev) return null;
      return { ...prev, selectedTarget: targetIndex };
    });
  }, []);

  return {
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
    startBattle,
    executeBattleAction,
    executeEnemyTurn,
    endBattle,
    addItemToInventory,
    removeItemFromInventory,
    equipItem,
    learnMagic,
    buyItem,
    restAtInn,
    showDialogue,
    advanceDialogue,
    selectBattleTarget,
  };
}
