import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#008000', '#FFC0CB', '#A52A2A', '#808080', '#000080'
];

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Palette className="w-4 h-4 text-gray-500" />
          <div 
            className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
            style={{ backgroundColor: color }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">プリセット</label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className={`w-8 h-8 rounded border-2 ${
                    color === presetColor ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    onChange(presetColor);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">カスタムカラー</label>
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 cursor-pointer"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">HEX値</label>
            <input
              type="text"
              value={color}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(value) || value === '') {
                  onChange(value);
                }
              }}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="#000000"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}