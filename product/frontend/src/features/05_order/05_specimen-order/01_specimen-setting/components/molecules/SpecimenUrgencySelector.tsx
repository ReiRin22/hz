'use client';

import { Button } from '@/shared/components/atoms/button';
import { Label } from '@/shared/components/atoms/label';
import type { OrderPriority } from '../../types/specimen-order-entry.type';

export interface SpecimenUrgencySelectorProps {
  value: OrderPriority;
  onChange: (value: OrderPriority) => void;
}

export function SpecimenUrgencySelector({ value, onChange }: SpecimenUrgencySelectorProps) {
  const options: { value: OrderPriority; label: string; color: string }[] = [
    { value: 'normal', label: '通常', color: 'bg-gray-100 text-gray-800' },
    { value: 'urgent', label: '緊急', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div>
      <Label className="text-xs">優先度</Label>
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
