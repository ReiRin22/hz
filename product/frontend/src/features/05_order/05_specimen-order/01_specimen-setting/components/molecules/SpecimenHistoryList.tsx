'use client';

import { useState } from 'react';
import type { SpecimenHistoryItem, SpecimenOrderFormItem } from '../../types/specimen-order-entry.type';

const SPECIMEN_TYPE_LABELS: Record<string, string> = {
  blood: '血液',
  urine: '尿',
  stool: '便',
  other: 'その他',
};

export interface SpecimenHistoryListProps {
  historyData: SpecimenHistoryItem[];
  onAddItem: (item: Omit<SpecimenOrderFormItem, 'id'>) => string | undefined;
  onSubTabChange: (tab: 'search' | 'history' | 'sets') => void;
  confirmedOrderCodes?: string[];
}

export function SpecimenHistoryList({ historyData, onAddItem, onSubTabChange, confirmedOrderCodes = [] }: SpecimenHistoryListProps) {
  const [addError, setAddError] = useState<string | undefined>();

  function handleSelect(item: SpecimenHistoryItem) {
    const error = onAddItem({
      specimenType: item.specimenType,
      orderCode: item.orderCode,
      testName: item.testName,
      category: item.category,
      quantity: item.quantity,
      priority: item.priority,
      clinicalPurpose: item.clinicalPurpose,
      specialInstructions: item.specialInstructions,
    });
    if (error) {
      setAddError(error);
      return;
    }
    setAddError(undefined);
    onSubTabChange('search');
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-3">
        過去の検体検査オーダーから選択
      </div>
      {addError && (
        <p role="alert" className="text-xs text-destructive">{addError}</p>
      )}
      {historyData.map((item) => {
        const isAdded = confirmedOrderCodes.includes(item.orderCode);
        return (
          <div
            key={item.id}
            role="button"
            tabIndex={isAdded ? -1 : 0}
            aria-disabled={isAdded}
            className={`p-3 border border-border rounded-lg transition-colors ${
              isAdded
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-muted/50 cursor-pointer'
            }`}
            onClick={() => { if (!isAdded) handleSelect(item); }}
            onKeyDown={(e) => {
              if (isAdded) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(item);
              }
            }}
          >
            <div className="font-medium text-sm mb-1">{item.testName}</div>
            <div className="text-xs text-muted-foreground mb-1">
              {item.date.replace(/-/g, '/')}
            </div>
            <div className="space-y-0.5">
              <div className="text-xs">
                <span className="text-muted-foreground">検体種別: </span>
                <span>{SPECIMEN_TYPE_LABELS[item.specimenType] ?? item.specimenType}</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">オーダーコード: </span>
                <span>{item.orderCode}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
