import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { STORY_DIALOGUES } from '@/data/story';

interface EndingScreenProps {
  onTitle: () => void;
  onPlayBgm: (track: string) => void;
  gameTime: number;
  playerLevel: number;
}

const CREDITS = [
  { role: 'ゲームデザイン', name: 'Cat Hero Team' },
  { role: 'プログラミング', name: 'Devin AI' },
  { role: 'ストーリー', name: 'Fantasy Writers Guild' },
  { role: 'キャラクターデザイン', name: 'Pixel Art Studio' },
  { role: '音楽', name: 'Mixkit' },
  { role: 'サウンドエフェクト', name: 'Mixkit' },
  { role: 'スペシャルサンクス', name: 'プレイヤーの皆様' },
];

export function EndingScreen({ onTitle, onPlayBgm, gameTime, playerLevel }: EndingScreenProps) {
  const [phase, setPhase] = useState<'story' | 'movie' | 'credits' | 'complete'>('story');
  const [storyIndex, setStoryIndex] = useState(0);
  const [creditIndex, setCreditIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const endingDialogues = STORY_DIALOGUES.ending;

  useEffect(() => {
    onPlayBgm('ending');
  }, [onPlayBgm]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === 'credits') {
      const timer = setInterval(() => {
        setCreditIndex(prev => {
          if (prev >= CREDITS.length - 1) {
            setPhase('complete');
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  const advanceStory = useCallback(() => {
    if (storyIndex < endingDialogues.length - 1) {
      setStoryIndex(prev => prev + 1);
    } else {
      setPhase('movie');
    }
  }, [storyIndex, endingDialogues.length]);

  const skipToEnd = () => {
    setPhase('complete');
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    if (hours > 0) {
      return `${hours}時間${minutes}分${seconds}秒`;
    }
    return `${minutes}分${seconds}秒`;
  };

  return (
    <div className="w-full h-full min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {phase === 'story' && (
        <div 
          className="w-full h-full flex flex-col items-center justify-center p-8 cursor-pointer"
          onClick={advanceStory}
        >
          <div className="max-w-2xl text-center">
            <div className="text-6xl mb-8">
              {endingDialogues[storyIndex].speaker === 'ニャン太' && '🐱'}
              {endingDialogues[storyIndex].speaker === '闇竜王ダークネス' && '🐉'}
              {endingDialogues[storyIndex].speaker === '王様' && '👑'}
              {endingDialogues[storyIndex].speaker === '村人たち' && '👥'}
              {endingDialogues[storyIndex].speaker === 'ナレーター' && '📖'}
            </div>
            
            <div className="text-yellow-400 text-xl mb-4">
              {endingDialogues[storyIndex].speaker}
            </div>
            
            <div className="text-white text-2xl leading-relaxed animate-fadeIn">
              {endingDialogues[storyIndex].text}
            </div>
            
            <div className="text-gray-500 text-sm mt-8 animate-pulse">
              クリックで続ける
            </div>
          </div>
        </div>
      )}

      {phase === 'movie' && (
        <div 
          className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
          onClick={() => setPhase('credits')}
        >
          <div className="relative w-full max-w-4xl aspect-video bg-gradient-to-b from-orange-900 via-yellow-600 to-orange-400 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-9xl mb-4 animate-bounce">🐱</div>
              <div className="text-4xl mb-8">👑</div>
              
              <div className="flex gap-4 text-4xl animate-pulse">
                <span>🎉</span>
                <span>🎊</span>
                <span>✨</span>
                <span>🎉</span>
                <span>🎊</span>
              </div>
              
              <div className="mt-8 text-white text-3xl font-bold text-center">
                王国に平和が戻った！
              </div>
              
              <div className="mt-4 text-yellow-200 text-xl">
                勇者ニャン太の伝説は永遠に語り継がれる...
              </div>
            </div>

            <div className="absolute top-4 left-4 text-white/50 text-sm">
              エンディングムービー
            </div>
          </div>
          
          <div className="text-gray-500 text-sm mt-4 animate-pulse">
            クリックでスキップ
          </div>
        </div>
      )}

      {phase === 'credits' && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-yellow-400 mb-12">
            スタッフクレジット
          </div>
          
          <div className="text-center animate-fadeIn" key={creditIndex}>
            <div className="text-gray-400 text-lg mb-2">
              {CREDITS[creditIndex].role}
            </div>
            <div className="text-white text-2xl font-bold">
              {CREDITS[creditIndex].name}
            </div>
          </div>
          
          <div className="absolute bottom-8 flex gap-2">
            {CREDITS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= creditIndex ? 'bg-yellow-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {phase === 'complete' && (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          <div className="text-6xl mb-8">🏆</div>
          
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4">
            おめでとうございます！
          </h1>
          
          <h2 className="text-2xl text-white mb-8">
            ゲームクリア！
          </h2>
          
          <div className="bg-gray-800/50 rounded-lg p-6 mb-8 text-center">
            <div className="text-gray-400 mb-4">クリアデータ</div>
            <div className="grid grid-cols-2 gap-4 text-white">
              <div>
                <div className="text-gray-400 text-sm">プレイ時間</div>
                <div className="text-xl font-bold">{formatTime(gameTime)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">最終レベル</div>
                <div className="text-xl font-bold">Lv.{playerLevel}</div>
              </div>
            </div>
          </div>
          
          <div className="text-gray-400 text-center mb-8 max-w-md">
            勇者ニャン太は闇竜王を倒し、王国に平和を取り戻しました。
            あなたの冒険は伝説として語り継がれることでしょう。
          </div>
          
          <Button
            onClick={onTitle}
            className="w-64 h-14 text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white shadow-lg"
          >
            タイトルに戻る
          </Button>
          
          <div className="mt-8 text-gray-500 text-sm">
            プレイしていただきありがとうございました！
          </div>
        </div>
      )}

      {showSkip && phase !== 'complete' && (
        <button
          onClick={skipToEnd}
          className="absolute bottom-4 right-4 text-gray-500 hover:text-white text-sm transition-colors"
        >
          スキップ ▶▶
        </button>
      )}
    </div>
  );
}
