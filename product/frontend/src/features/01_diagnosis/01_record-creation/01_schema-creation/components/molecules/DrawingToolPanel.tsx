import { Pen, Square, Type, Eraser, Circle, Droplets } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Slider } from '@/shared/components/atoms/slider';
import ColorPickerPanel from './ColorPickerPanel';
import type { DrawTool } from '../../types/schema-creation.types';

interface DrawingToolPanelProps {
  activeTool: DrawTool;
  strokeColor: string;
  penSize: number;
  onToolSelect: (tool: DrawTool) => void;
  onColorChange: (color: string) => void;
  onWidthChange: (size: number) => void;
}

const TOOLS: { type: DrawTool; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { type: 'pen', icon: Pen, label: 'ペン' },
  { type: 'rectangle', icon: Square, label: '四角形' },
  { type: 'circle', icon: Circle, label: '円' },
  { type: 'text', icon: Type, label: 'テキスト' },
  { type: 'spray', icon: Droplets, label: 'スプレー' },
  { type: 'eraser', icon: Eraser, label: '消しゴム' },
];

export default function DrawingToolPanel({
  activeTool,
  strokeColor,
  penSize,
  onToolSelect,
  onColorChange,
  onWidthChange,
}: DrawingToolPanelProps) {
  return (
    <div className="p-4 border-b border-border">
      <h3 className="text-sm font-medium mb-3">ツール</h3>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {TOOLS.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Button
              key={tool.type}
              variant={activeTool === tool.type ? 'default' : 'outline'}
              size="sm"
              className="aspect-square p-2"
              onClick={() => onToolSelect(tool.type)}
              title={tool.label}
            >
              <IconComponent className="w-4 h-4" />
            </Button>
          );
        })}
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">カラー</label>
        <ColorPickerPanel color={strokeColor} onChange={onColorChange} />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">ペン太さ ({penSize} px)</label>
        <Slider
          value={[penSize]}
          onValueChange={(vals) => onWidthChange(vals[0])}
          max={20}
          min={1}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
}
