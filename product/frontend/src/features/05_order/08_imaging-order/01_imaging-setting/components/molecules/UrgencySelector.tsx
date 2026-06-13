'use client';

/**
 * 緊急度選択 - ImagingOrderDetailPanel用UI部品
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/UrgencySelector.tsx
 */

import { Button } from '@/shared/components/atoms/button';
import { Label } from '@/shared/components/atoms/label';

export type UrgencyLevel = 'normal' | 'urgent' | 'stat';

export interface UrgencySelectorProps {
  value: UrgencyLevel;
  onChange: (value: UrgencyLevel) => void;
}

export function UrgencySelector({ value, onChange }: UrgencySelectorProps) {
  const options: { value: UrgencyLevel; label: string; color: string }[] = [
    { value: 'normal', label: '通常', color: 'bg-gray-100 text-gray-800' },
    { value: 'urgent', label: '至急', color: 'bg-orange-100 text-orange-800' },
    { value: 'stat', label: '緊急', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <div>
      <Label>緊急度</Label>
      <div className="flex gap-2 mt-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(option.value)}
            className={value === option.value ? option.color : ''}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
