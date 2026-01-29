import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Player, Item, Weapon, Armor } from '@/types/game';

interface GameMenuProps {
  player: Player;
  onClose: () => void;
  onEquip: (item: Weapon | Armor) => void;
  onUseItem: (item: Item) => void;
  playSfx: (sound: string) => void;
}

type MenuTab = 'status' | 'inventory' | 'equipment' | 'magic';

export function GameMenu({ player, onClose, onEquip, onUseItem, playSfx }: GameMenuProps) {
  const [activeTab, setActiveTab] = useState<MenuTab>('status');

  const handleTabChange = (tab: MenuTab) => {
    playSfx('cursor');
    setActiveTab(tab);
  };

  const handleEquip = (item: Weapon | Armor) => {
    playSfx('item');
    onEquip(item);
  };

  const handleUseItem = (item: Item) => {
    if (item.effect.type === 'heal' && player.stats.hp >= player.stats.maxHp) {
      playSfx('error');
      return;
    }
    if (item.effect.type === 'healMp' && player.stats.mp >= player.stats.maxMp) {
      playSfx('error');
      return;
    }
    playSfx('item');
    onUseItem(item);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border-4 border-gray-700 w-full max-w-4xl max-h-screen overflow-hidden">
        <div className="flex border-b border-gray-700">
          {(['status', 'inventory', 'equipment', 'magic'] as MenuTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-3 px-4 text-sm font-bold transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab === 'status' && '📊 ステータス'}
              {tab === 'inventory' && '🎒 アイテム'}
              {tab === 'equipment' && '⚔️ 装備'}
              {tab === 'magic' && '✨ 魔法'}
            </button>
          ))}
          <button
            onClick={onClose}
            className="px-4 bg-red-600 text-white hover:bg-red-500"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'status' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-6xl">🐱</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{player.name}</h2>
                    <p className="text-yellow-400">レベル {player.stats.level}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-red-400">HP</span>
                      <span className="text-white">{player.stats.hp} / {player.stats.maxHp}</span>
                    </div>
                    <Progress value={(player.stats.hp / player.stats.maxHp) * 100} className="h-4" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-400">MP</span>
                      <span className="text-white">{player.stats.mp} / {player.stats.maxMp}</span>
                    </div>
                    <Progress value={(player.stats.mp / player.stats.maxMp) * 100} className="h-4" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-400">経験値</span>
                      <span className="text-white">{player.stats.exp} / {player.stats.expToNext}</span>
                    </div>
                    <Progress value={(player.stats.exp / player.stats.expToNext) * 100} className="h-3" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-600 pb-2">
                  能力値
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">攻撃力</span>
                    <span className="text-white">
                      {player.stats.attack}
                      {player.equipment.weapon && (
                        <span className="text-green-400"> (+{player.equipment.weapon.attackBonus})</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">防御力</span>
                    <span className="text-white">
                      {player.stats.defense}
                      {player.equipment.armor && (
                        <span className="text-green-400"> (+{player.equipment.armor.defenseBonus})</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">素早さ</span>
                    <span className="text-white">{player.stats.speed}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
                    <span className="text-yellow-500">💰 所持金</span>
                    <span className="text-yellow-400">{player.gold} G</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">所持アイテム</h3>
              {player.inventory.length === 0 ? (
                <p className="text-gray-400 text-center py-8">アイテムを持っていません</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {player.inventory.map(inv => (
                    <div
                      key={inv.item.id}
                      className="bg-gray-800 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-white font-bold">{inv.item.name}</div>
                        <div className="text-gray-400 text-sm">{inv.item.description}</div>
                        <div className="text-yellow-400 text-sm">x{inv.quantity}</div>
                      </div>
                      {inv.item.type === 'consumable' && (
                        <Button
                          onClick={() => handleUseItem(inv.item)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-500"
                        >
                          使う
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">現在の装備</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">武器</div>
                    <div className="text-white font-bold">
                      {player.equipment.weapon?.name || '装備なし'}
                    </div>
                    {player.equipment.weapon && (
                      <div className="text-green-400 text-sm">
                        攻撃力 +{player.equipment.weapon.attackBonus}
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">防具</div>
                    <div className="text-white font-bold">
                      {player.equipment.armor?.name || '装備なし'}
                    </div>
                    {player.equipment.armor && (
                      <div className="text-green-400 text-sm">
                        防御力 +{player.equipment.armor.defenseBonus}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4">装備可能アイテム</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {player.inventory
                    .filter(inv => inv.item.type === 'weapon' || inv.item.type === 'armor')
                    .map(inv => (
                      <div
                        key={inv.item.id}
                        className="bg-gray-800 rounded-lg p-2 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-white text-sm font-bold">{inv.item.name}</div>
                          <div className="text-gray-400 text-xs">
                            {inv.item.type === 'weapon' 
                              ? `攻撃力 +${(inv.item as Weapon).attackBonus}`
                              : `防御力 +${(inv.item as Armor).defenseBonus}`
                            }
                          </div>
                        </div>
                        <Button
                          onClick={() => handleEquip(inv.item as Weapon | Armor)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500"
                        >
                          装備
                        </Button>
                      </div>
                    ))}
                  {player.inventory.filter(inv => inv.item.type === 'weapon' || inv.item.type === 'armor').length === 0 && (
                    <p className="text-gray-400 text-center py-4">装備可能なアイテムがありません</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'magic' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">習得魔法</h3>
              {player.learnedMagic.length === 0 ? (
                <p className="text-gray-400 text-center py-8">魔法を習得していません</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {player.learnedMagic.map(magic => (
                    <div
                      key={magic.id}
                      className="bg-gray-800 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">
                          {magic.element === 'fire' && '🔥'}
                          {magic.element === 'ice' && '❄️'}
                          {magic.element === 'thunder' && '⚡'}
                          {magic.element === 'holy' && '✨'}
                          {magic.element === 'dark' && '🌑'}
                          {magic.element === 'none' && '💫'}
                        </span>
                        <span className="text-white font-bold">{magic.name}</span>
                      </div>
                      <div className="text-gray-400 text-sm">{magic.description}</div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-blue-400">MP: {magic.mpCost}</span>
                        <span className="text-purple-400">
                          {magic.type === 'offensive' && `威力: ${magic.power}`}
                          {magic.type === 'healing' && `回復: ${magic.power}`}
                          {magic.type === 'buff' && 'バフ'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
