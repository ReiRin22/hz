import { Undo2, Redo2, FlipHorizontal } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';

interface ToolbarPanelProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onFlip: () => void;
}

export default function ToolbarPanel({ onUndo, onRedo, onClear, onFlip }: ToolbarPanelProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onUndo} title="元に戻す">
        <Undo2 className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onRedo} title="やり直し">
        <Redo2 className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onClear}>
        クリア
      </Button>
      <Button variant="outline" size="sm" onClick={onFlip} title="水平反転">
        <FlipHorizontal className="w-4 h-4" />
      </Button>
    </div>
  );
}
