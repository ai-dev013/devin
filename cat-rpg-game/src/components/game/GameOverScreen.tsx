import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface GameOverScreenProps {
  onRetry: () => void;
  onTitle: () => void;
  onPlayBgm: (track: string) => void;
}

export function GameOverScreen({ onRetry, onTitle, onPlayBgm }: GameOverScreenProps) {
  useEffect(() => {
    onPlayBgm('gameover');
  }, [onPlayBgm]);

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-b from-gray-900 via-red-900 to-black flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-8 animate-pulse">💀</div>
        
        <h1 className="text-6xl font-bold text-red-500 mb-4">
          GAME OVER
        </h1>
        
        <p className="text-gray-400 text-xl mb-12">
          ニャン太は力尽きた...
        </p>

        <div className="space-y-4">
          <Button
            onClick={onRetry}
            className="w-64 h-14 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg"
          >
            最初からやり直す
          </Button>
          
          <div>
            <Button
              onClick={onTitle}
              variant="outline"
              className="w-64 h-12 text-lg border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              タイトルに戻る
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
