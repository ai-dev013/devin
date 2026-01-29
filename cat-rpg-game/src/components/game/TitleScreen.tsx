import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface TitleScreenProps {
  onStartGame: () => void;
  onPlayBgm: (track: string) => void;
}

export function TitleScreen({ onStartGame, onPlayBgm }: TitleScreenProps) {
  useEffect(() => {
    onPlayBgm('title');
  }, [onPlayBgm]);

  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4 animate-pulse">
            猫勇者の冒険
          </h1>
          <h2 className="text-2xl text-purple-300 font-semibold">
            Cat Hero's Adventure
          </h2>
        </div>

        <div className="mb-12">
          <div className="text-8xl mb-4 animate-bounce">
            🐱
          </div>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            闇竜王に支配された王国を救うため、
            勇敢な猫の戦士ニャン太が冒険の旅に出る！
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onStartGame}
            className="w-64 h-14 text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            ゲームスタート
          </Button>
          
          <div className="text-gray-400 text-sm mt-8">
            <p>操作方法: 矢印キー/WASD で移動</p>
            <p>Enter/Space で決定 | ESC でメニュー</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 text-gray-500 text-sm">
        © 2024 Cat Hero's Adventure - Action RPG
      </div>
    </div>
  );
}
