'use client';
// TODO: ORD023 Phase 2 でオーダーリストの行クリック時に詳細編集パネルを表示する際に接続予定

import { Label } from '@/shared/components/atoms/label';
import { Input } from '@/shared/components/atoms/input';
import { Textarea } from '@/shared/components/atoms/textarea';
import { SpecimenUrgencySelector } from '../molecules/SpecimenUrgencySelector';
import type { SpecimenOrderFormItem, OrderPriority } from '../../types/specimen-order-entry.type';

export interface SpecimenOrderDetailPanelProps {
  item: SpecimenOrderFormItem;
  onUpdate: (id: string, patch: Partial<Omit<SpecimenOrderFormItem, 'id'>>) => void;
}

export function SpecimenOrderDetailPanel({ item, onUpdate }: SpecimenOrderDetailPanelProps) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="text-sm font-medium">{item.testName}</div>
      <div className="text-xs text-muted-foreground">{item.orderCode}</div>

      <div className="space-y-1.5">
        <Label className="text-xs">数量</Label>
        <Input
          type="number"
          min={1}
          className="h-8 text-xs w-24"
          value={item.quantity ?? 1}
          onChange={(e) => onUpdate(item.id, { quantity: Number(e.target.value) })}
        />
      </div>

      <SpecimenUrgencySelector
        value={item.priority ?? 'normal'}
        onChange={(priority: OrderPriority) => onUpdate(item.id, { priority })}
      />

      <div className="space-y-1.5">
        <Label className="text-xs">臨床目的</Label>
        <Input
          className="h-8 text-xs"
          placeholder="臨床目的を入力（任意）"
          value={item.clinicalPurpose ?? ''}
          onChange={(e) => onUpdate(item.id, { clinicalPurpose: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">特記事項</Label>
        <Textarea
          className="text-xs resize-none"
          rows={2}
          placeholder="特記事項を入力（任意）"
          value={item.specialInstructions ?? ''}
          onChange={(e) => onUpdate(item.id, { specialInstructions: e.target.value })}
        />
      </div>
    </div>
  );
}
