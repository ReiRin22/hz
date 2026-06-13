'use client';

import { useState } from 'react';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Button } from '@/shared/components/atoms/button';
import { SpecimenTypeSelector } from '../molecules/SpecimenTypeSelector';
import { SpecimenSetSelector } from '../molecules/SpecimenSetSelector';
import { SpecimenOrderItemRow } from '../molecules/SpecimenOrderItemRow';
import type { SpecimenType, SpecimenSetItem, SpecimenOrderFormItem } from '../../types/specimen-order-entry.type';

type QuickItem = { label: string; item: Omit<SpecimenOrderFormItem, 'id'> };

const QUICK_ITEMS: QuickItem[] = [
  { label: '血算（CBC）', item: { specimenType: 'blood', testName: '血算（CBC）', orderCode: 'CBC' } },
  { label: '尿一般', item: { specimenType: 'urine', testName: '尿一般', orderCode: 'UA' } },
];

export interface SpecimenContentPanelProps {
  sets: SpecimenSetItem[];
  selectedItems: SpecimenOrderFormItem[];
  onAddItem: (item: Omit<SpecimenOrderFormItem, 'id'>) => string | undefined;
  onRemoveItem: (orderCode: string) => void;
}

export function SpecimenContentPanel({
  sets,
  selectedItems,
  onAddItem,
  onRemoveItem,
}: SpecimenContentPanelProps) {
  const [specimenType, setSpecimenType] = useState<SpecimenType | undefined>();
  const [testName, setTestName] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [addError, setAddError] = useState<string | undefined>();

  const handleAddItem = () => {
    if (!specimenType || !testName || !orderCode) return;
    const err = onAddItem({ specimenType, testName, orderCode });
    setAddError(err);
    if (!err) {
      setTestName('');
      setOrderCode('');
    }
  };

  const handleSelectSet = (set: SpecimenSetItem) => {
    let lastError: string | undefined;
    set.items.forEach((item) => {
      const err = onAddItem({
        specimenType: item.specimenType,
        testName: item.testName,
        orderCode: item.orderCode,
        quantity: item.quantity,
        priority: item.priority,
      });
      if (err) lastError = err;
    });
    setAddError(lastError);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap gap-2">
        {QUICK_ITEMS.map(({ label, item }) => (
          <Button
            key={item.orderCode}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setAddError(onAddItem(item))}
          >
            {label}
          </Button>
        ))}
      </div>

      <SpecimenSetSelector sets={sets} onSelectSet={handleSelectSet} />

      <div className="space-y-3 border border-border rounded-lg p-3">
        <Label className="text-xs font-medium">個別追加</Label>
        <SpecimenTypeSelector value={specimenType} onChange={setSpecimenType} />
        <div className="space-y-1.5">
          <Label className="text-xs">検査名</Label>
          <Input
            className="h-8 text-xs"
            placeholder="検査名を入力"
            value={testName}
            onChange={(e) => { setTestName(e.target.value); setAddError(undefined); }}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">オーダーコード</Label>
          <Input
            className="h-8 text-xs"
            placeholder="LAB-XXX-001"
            value={orderCode}
            onChange={(e) => { setOrderCode(e.target.value); setAddError(undefined); }}
          />
        </div>
        {addError && (
          <p className="text-xs text-red-600">{addError}</p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={handleAddItem}
          disabled={!specimenType || !testName || !orderCode}
        >
          追加
        </Button>
      </div>

      {selectedItems.length > 0 && (
        <ScrollArea className="max-h-48">
          <div className="space-y-1.5">
            {selectedItems.map((item) => (
              <SpecimenOrderItemRow key={item.id} item={item} onRemove={onRemoveItem} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
