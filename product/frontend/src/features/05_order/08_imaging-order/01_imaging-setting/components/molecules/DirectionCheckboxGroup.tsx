'use client';

/**
 * 撮影方向チェックボックス群 - ImagingContentPanel用UI部品
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/DirectionCheckboxGroup.tsx
 */

import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Label } from '@/shared/components/atoms/label';

export interface DirectionCheckboxGroupProps {
  availableDirections: string[];
  selectedDirections: string[];
  onToggle: (direction: string) => void;
}

export function DirectionCheckboxGroup({
  availableDirections,
  selectedDirections,
  onToggle
}: DirectionCheckboxGroupProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">撮影方向</Label>
      <div className="flex flex-wrap gap-2">
        {availableDirections.map((dir) => (
          <label
            key={dir}
            className="inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Checkbox
              checked={selectedDirections.includes(dir)}
              onCheckedChange={() => onToggle(dir)}
            />
            <span className="text-sm">{dir}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
