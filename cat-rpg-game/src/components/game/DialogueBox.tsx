import { Dialogue } from '@/types/game';

interface DialogueBoxProps {
  dialogue: Dialogue;
  onAdvance: () => void;
  isLastDialogue: boolean;
}

const SPEAKER_PORTRAITS: Record<string, string> = {
  'ニャン太': '🐱',
  '王様': '👑',
  '村人': '👨',
  '老人': '👴',
  '店主': '🧑‍💼',
  '宿屋の主人': '🧑‍🍳',
  '旅人': '🧳',
  '鉱夫': '⛏️',
  '山の仙人': '🧙',
  '賢者': '📚',
  '精霊': '✨',
  '闇のオオカミ王': '🐺',
  '闇のクマ王': '🐻',
  '闇竜王ダークネス': '🐉',
  'ナレーター': '📖',
  '謎の声': '❓',
  '城の門番': '🛡️',
  '村人たち': '👥',
  '山の番人': '⛰️',
};

export function DialogueBox({ dialogue, onAdvance, isLastDialogue }: DialogueBoxProps) {
  return (
    <div 
      className="fixed inset-0 flex items-end justify-center p-4 bg-black/50 z-50"
      onClick={onAdvance}
    >
      <div className="w-full max-w-3xl bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border-4 border-gray-600 shadow-2xl overflow-hidden cursor-pointer">
        <div className="flex items-start p-4">
          <div className="flex-shrink-0 w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center mr-4 border-2 border-gray-500">
            <span className="text-4xl">
              {SPEAKER_PORTRAITS[dialogue.speaker] || '👤'}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="text-yellow-400 font-bold text-lg mb-2 border-b border-gray-600 pb-1">
              {dialogue.speaker}
            </div>
            <div className="text-white text-lg leading-relaxed min-h-16">
              {dialogue.text}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700/50 px-4 py-2 flex justify-end items-center">
          <span className="text-gray-400 text-sm animate-pulse">
            {isLastDialogue ? 'クリックで閉じる ▶' : 'クリックで続ける ▶'}
          </span>
        </div>
      </div>
    </div>
  );
}
