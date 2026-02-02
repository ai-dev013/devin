import { Button } from '@/components/ui/button';
import { Player, Item, NPC } from '@/types/game';

interface ShopScreenProps {
  player: Player;
  shop: NPC;
  onBuy: (item: Item) => void;
  onClose: () => void;
  playSfx: (sound: string) => void;
}

export function ShopScreen({ player, shop, onBuy, onClose, playSfx }: ShopScreenProps) {
  const handleBuy = (item: Item) => {
    if (player.gold >= item.price) {
      playSfx('item');
      onBuy(item);
    } else {
      playSfx('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border-4 border-gray-700 w-full max-w-2xl">
        <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧑‍💼</span>
            <div>
              <h2 className="text-xl font-bold text-white">{shop.name}</h2>
              <p className="text-gray-400 text-sm">いらっしゃいませ！</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold">
              💰 {player.gold} G
            </div>
          </div>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="grid gap-3">
            {shop.shopItems?.map(item => {
              const canAfford = player.gold >= item.price;
              const owned = player.inventory.find(i => i.item.id === item.id);
              
              return (
                <div
                  key={item.id}
                  className={`bg-gray-800 rounded-lg p-4 flex items-center justify-between ${
                    !canAfford ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{item.name}</span>
                      {owned && (
                        <span className="text-gray-400 text-sm">(所持: {owned.quantity})</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                      {item.price} G
                    </span>
                    <Button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`${
                        canAfford 
                          ? 'bg-green-600 hover:bg-green-500' 
                          : 'bg-gray-600 cursor-not-allowed'
                      }`}
                    >
                      購入
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <Button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-500"
          >
            店を出る
          </Button>
        </div>
      </div>
    </div>
  );
}
