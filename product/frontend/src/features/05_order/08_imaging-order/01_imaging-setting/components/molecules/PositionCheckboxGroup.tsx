'use client';

/**
 * 体位チェックボックス群 - ImagingContentPanel用UI部品
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/PositionCheckboxGroup.tsx
 */

import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Label } from '@/shared/components/atoms/label';

export interface PositionCheckboxGroupProps {
  selectedPositions: string[];
  onToggle: (position: string) => void;
}

export function PositionCheckboxGroup({
  selectedPositions,
  onToggle
}: PositionCheckboxGroupProps) {
  const positions = ['Not specified', '立位', '臥位', '腹臥位', '側臥位', '座位'];

  return (
    <div className="space-y-1.5">
      <Label className="text-sm">体位</Label>
      <div className="flex flex-wrap gap-2">
        {positions.map((pos) => (
          <label
            key={pos}
            className="inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Checkbox
              checked={selectedPositions.includes(pos)}
              onCheckedChange={() => onToggle(pos)}
            />
            <span className="text-sm">{pos}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
