'use client';

import { X } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import type { SpecimenOrderFormItem } from '../../types/specimen-order-entry.type';

export interface SpecimenOrderItemRowProps {
  item: SpecimenOrderFormItem;
  onRemove: (orderCode: string) => void;
}

const SPECIMEN_TYPE_LABELS: Record<string, string> = {
  blood: '血液',
  urine: '尿',
  stool: '便',
  other: 'その他',
};

export function SpecimenOrderItemRow({ item, onRemove }: SpecimenOrderItemRowProps) {
  return (
    <div className="flex items-center justify-between border border-border rounded-md px-3 py-2">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {SPECIMEN_TYPE_LABELS[item.specimenType] ?? item.specimenType}
        </span>
        <span className="font-medium">{item.testName}</span>
        <span className="text-xs text-muted-foreground">{item.orderCode}</span>
        {item.quantity !== undefined && (
          <span className="text-xs text-muted-foreground">×{item.quantity}</span>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item.orderCode)}
        className="h-6 w-6 p-0"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}
