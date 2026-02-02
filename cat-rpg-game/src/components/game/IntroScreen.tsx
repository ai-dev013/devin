import { useState, useEffect, useCallback } from 'react';
import { STORY_DIALOGUES } from '@/data/story';

interface IntroScreenProps {
  onComplete: () => void;
  onPlayBgm: (track: string) => void;
}

export function IntroScreen({ onComplete, onPlayBgm }: IntroScreenProps) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showText, setShowText] = useState(false);

  const introDialogues = STORY_DIALOGUES.intro;

  useEffect(() => {
    onPlayBgm('title');
    const timer = setTimeout(() => setShowText(true), 500);
    return () => clearTimeout(timer);
  }, [onPlayBgm]);

  const advanceDialogue = useCallback(() => {
    if (dialogueIndex < introDialogues.length - 1) {
      setShowText(false);
      setTimeout(() => {
        setDialogueIndex(prev => prev + 1);
        setShowText(true);
      }, 300);
    } else {
      onComplete();
    }
  }, [dialogueIndex, introDialogues.length, onComplete]);

  const currentDialogue = introDialogues[dialogueIndex];

  const getSpeakerEmoji = (speaker: string) => {
    switch (speaker) {
      case 'ナレーター': return '📖';
      case '王様': return '👑';
      case 'ニャン太': return '🐱';
      default: return '👤';
    }
  };

  return (
    <div 
      className="w-full h-full min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex flex-col items-center justify-center cursor-pointer"
      onClick={advanceDialogue}
    >
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto p-8 text-center">
        <div className={`transition-opacity duration-500 ${showText ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-8xl mb-8">
            {getSpeakerEmoji(currentDialogue.speaker)}
          </div>

          <div className="text-yellow-400 text-xl mb-4 font-bold">
            {currentDialogue.speaker}
          </div>

          <div className="text-white text-2xl leading-relaxed mb-8">
            {currentDialogue.text}
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {introDialogues.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === dialogueIndex ? 'bg-yellow-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="text-gray-500 text-sm animate-pulse">
          クリックで続ける
        </div>
      </div>
    </div>
  );
}
