'use client';

/**
 * 側性選択 - ImagingContentPanel用UI部品
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/LateralitySelector.tsx
 */

import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';

export interface LateralitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LateralitySelector({
  value,
  onChange
}: LateralitySelectorProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">側性</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="側性を選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Not specified">Not specified</SelectItem>
          <SelectItem value="Left">Left</SelectItem>
          <SelectItem value="Right">Right</SelectItem>
          <SelectItem value="Bilateral">Bilateral</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
