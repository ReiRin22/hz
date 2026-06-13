'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Badge } from '@/shared/components/atoms/badge';
import type { SpecimenSetItem, SpecimenOrderFormItem } from '../../types/specimen-order-entry.type';
import type { SpecimenSetType } from '../../hooks/useSpecimenPanelData';

export interface SpecimenSetsListProps {
  setsData: SpecimenSetItem[];
  selectedSetType: SpecimenSetType;
  onSetTypeChange: (type: SpecimenSetType) => void;
  onAddItems: (items: Omit<SpecimenOrderFormItem, 'id'>[]) => void;
  onSubTabChange: (tab: 'search' | 'history' | 'sets') => void;
  confirmedOrderCodes?: string[];
}

const SPECIMEN_TYPE_LABELS: Record<string, string> = {
  blood: '血液',
  urine: '尿',
  stool: '便',
  other: 'その他',
};

export function SpecimenSetsList({
  setsData,
  selectedSetType,
  onSetTypeChange,
  onAddItems,
  onSubTabChange,
  confirmedOrderCodes = [],
}: SpecimenSetsListProps) {
  return (
    <div className="space-y-3">
      <Select value={selectedSetType} onValueChange={(v) => onSetTypeChange(v as SpecimenSetType)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="院内共通セット" />
        </SelectTrigger>
        <SelectContent position="popper" className="z-[9999]">
          <SelectItem value="hospital">院内共通セット</SelectItem>
          <SelectItem value="department">診療科セット</SelectItem>
          <SelectItem value="my">Myセット</SelectItem>
          <SelectItem value="regular">定期セット</SelectItem>
        </SelectContent>
      </Select>

      {setsData.map((setItem) => {
        const allAdded = setItem.items.every((item) => confirmedOrderCodes.includes(item.orderCode));
        return (
          <div
            key={setItem.id}
            role="button"
            tabIndex={allAdded ? -1 : 0}
            aria-disabled={allAdded}
            className={`p-3 border border-border rounded-lg transition-colors ${
              allAdded
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-muted/50 cursor-pointer'
            }`}
            onClick={() => {
              if (allAdded) return;
              onAddItems(setItem.items.map(({ id: _id, ...item }) => item));
              onSubTabChange('search');
            }}
            onKeyDown={(e) => {
              if (allAdded) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAddItems(setItem.items.map(({ id: _id, ...item }) => item));
                onSubTabChange('search');
              }
            }}
          >
            <div className="font-medium text-sm mb-1">{setItem.name}</div>
            <div className="text-xs text-muted-foreground mb-2">{setItem.description}</div>
            <div className="flex items-center gap-1 flex-wrap">
              {setItem.items.map((item) => (
                <Badge
                  key={item.orderCode}
                  variant="outline"
                  className={`text-xs ${confirmedOrderCodes.includes(item.orderCode) ? 'line-through' : ''}`}
                >
                  {item.testName}
                </Badge>
              ))}
              <span className="text-xs text-muted-foreground">{setItem.items.length}件</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
