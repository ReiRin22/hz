'use client';

import * as React from 'react';
import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import type { SpecimenType } from '../../types/specimen-order-entry.type';

export interface SpecimenTypeSelectorProps {
  value?: SpecimenType;
  onChange: (type: SpecimenType | undefined) => void;
  disabled?: boolean;
}

const SPECIMEN_TYPE_OPTIONS: { value: SpecimenType; label: string }[] = [
  { value: 'blood', label: '血液' },
  { value: 'urine', label: '尿' },
  { value: 'stool', label: '便' },
  { value: 'other', label: 'その他' },
];

export const SpecimenTypeSelector: React.FC<SpecimenTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">検体種別</Label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as SpecimenType)}
        disabled={disabled}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          {SPECIMEN_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
