import { Progress } from '@/components/ui/progress';
import { Player } from '@/types/game';

interface StatusPanelProps {
  player: Player;
  gameTime: number;
  currentChapter: string;
}

export function StatusPanel({ player, gameTime, currentChapter }: StatusPanelProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900/90 rounded-lg p-4 border-2 border-gray-700 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">🐱</span>
        <div>
          <div className="text-white font-bold text-lg">{player.name}</div>
          <div className="text-yellow-400 text-sm">Lv.{player.stats.level}</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-400">HP</span>
            <span className="text-white">{player.stats.hp}/{player.stats.maxHp}</span>
          </div>
          <Progress 
            value={(player.stats.hp / player.stats.maxHp) * 100} 
            className="h-3 bg-gray-700"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-blue-400">MP</span>
            <span className="text-white">{player.stats.mp}/{player.stats.maxMp}</span>
          </div>
          <Progress 
            value={(player.stats.mp / player.stats.maxMp) * 100} 
            className="h-3 bg-gray-700"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-green-400">EXP</span>
            <span className="text-white">{player.stats.exp}/{player.stats.expToNext}</span>
          </div>
          <Progress 
            value={(player.stats.exp / player.stats.expToNext) * 100} 
            className="h-2 bg-gray-700"
          />
        </div>
      </div>

      <div className="border-t border-gray-700 pt-3 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">攻撃力</span>
          <span className="text-white">
            {player.stats.attack + (player.equipment.weapon?.attackBonus || 0)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">防御力</span>
          <span className="text-white">
            {player.stats.defense + (player.equipment.armor?.defenseBonus || 0)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-yellow-500">💰 ゴールド</span>
          <span className="text-yellow-400">{player.gold}</span>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-3 mt-3">
        <div className="text-xs text-gray-400 mb-1">{currentChapter}</div>
        <div className="text-xs text-gray-500">プレイ時間: {formatTime(gameTime)}</div>
      </div>
    </div>
  );
}
