
interface ControlsHelpProps {
  show: boolean;
}

export function ControlsHelp({ show }: ControlsHelpProps) {
  if (!show) return null;

  return (
    <div className="bg-gray-900/90 rounded-lg p-3 border border-gray-700 text-xs">
      <div className="text-gray-400 font-bold mb-2">操作方法</div>
      <div className="space-y-1 text-gray-500">
        <div>↑↓←→ / WASD: 移動</div>
        <div>Enter / Space: 決定・調べる</div>
        <div>M / ESC: メニュー</div>
        <div>I: インベントリ</div>
      </div>
    </div>
  );
}
