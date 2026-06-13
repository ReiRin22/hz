'use client';

import { Button } from '@/shared/components/atoms/button';
import { Label } from '@/shared/components/atoms/label';
import type { SpecimenSetItem } from '../../types/specimen-order-entry.type';

export interface SpecimenSetSelectorProps {
  sets: SpecimenSetItem[];
  onSelectSet: (set: SpecimenSetItem) => void;
}

export function SpecimenSetSelector({ sets, onSelectSet }: SpecimenSetSelectorProps) {
  if (sets.length === 0) return null;

  return (
    <div className="border border-border rounded-lg p-3 space-y-2">
      <Label className="text-xs">検体セット</Label>
      <div className="grid grid-cols-2 gap-2">
        {sets.map((set) => (
          <Button
            key={set.id}
            variant="outline"
            size="sm"
            className="h-auto py-3 text-xs flex flex-col items-start gap-1"
            onClick={() => onSelectSet(set)}
          >
            <span className="font-medium">{set.name}</span>
            <span className="text-[10px] text-muted-foreground">{set.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
