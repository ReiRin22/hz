'use client';

/**
 * 画像検査セットリスト
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/ImagingSetsList.tsx
 */

import { useState } from 'react';
import { Badge } from '@/shared/components/atoms/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import type { OrderDetail, PreferredTime } from '../../types/order-shared.types';
import type { ImagingSetItem, ImagingSetType } from '../../hooks/useImagingPanelData';

/** @deprecated ImagingSetType を使用してください */
export type SetType = ImagingSetType;
export type { ImagingSetItem };

export interface ImagingSetsListProps {
  setsData: ImagingSetItem[];
  onAddOrder?: (order: OrderDetail) => void;
  onSubTabChange?: (tab: 'search' | 'history' | 'sets') => void;
  /** BFF fetch で selectedSetType を外部管理する場合に使用 */
  selectedSetType?: SetType;
  onSetTypeChange?: (type: SetType) => void;
}

export function ImagingSetsList({
  setsData,
  onAddOrder,
  onSubTabChange,
  selectedSetType: externalSetType,
  onSetTypeChange,
}: ImagingSetsListProps) {
  const [internalSetType, setInternalSetType] = useState<ImagingSetType>('hospital');

  const selectedSetType = externalSetType ?? internalSetType;
  const handleSetTypeChange = (value: string) => {
    const type = value as ImagingSetType;
    if (onSetTypeChange) {
      onSetTypeChange(type);
    } else {
      setInternalSetType(type);
    }
  };

  // BFF fetch 時はデータが既にフィルタ済みなので全件表示。未接続時は client-side フィルタ
  const filteredSets = externalSetType
    ? setsData
    : setsData.filter(set => set.setType === selectedSetType);

  const handleAddFromSet = (setItem: ImagingSetItem) => {
    const today = new Date().toISOString().split('T')[0];

    setItem.items.forEach((item, index) => {
      const newOrder: OrderDetail = {
        id: `imaging-${crypto.randomUUID()}`,
        name: item.name,
        type: 'imaging',
        modality: item.modality,
        bodyPart: item.bodyPart,
        imagingContent: item.imagingContent,
        protocols: item.protocols,
        position: item.position,
        laterality: item.laterality,
        functionalConditions: item.functionalConditions,
        specialInstructions: item.specialInstructions,
        bodyPartsList: item.bodyPartsList as OrderDetail['bodyPartsList'],
        priority: item.priority,
        preferredTime: item.preferredTime as PreferredTime | undefined,
        preferredDate: today,
        dateUndecided: false,
        preferredTimeSlots: ['即時'],
        useContrast: item.useContrast,
        hasAllergy: item.hasAllergy,
        clinicalPurpose: item.clinicalPurpose,
        symptomTags: item.symptomTags,
        scheduledDate: today
      };

      if (onAddOrder) {
        onAddOrder(newOrder);
      }
    });

    if (onSubTabChange) {
      onSubTabChange('search');
    }
  };

  return (
    <div className="space-y-3">
      <div className="mb-3">
        <Select value={selectedSetType} onValueChange={handleSetTypeChange}>
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
      </div>

      {filteredSets.map((setItem) => (
        <div
          key={setItem.id}
          className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => handleAddFromSet(setItem)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="font-medium text-sm mb-1">{setItem.name}</div>
              <div className="text-xs text-muted-foreground mb-2">
                {setItem.description}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {setItem.items.map((item) => (
                  <Badge key={item.id ?? item.name} variant="outline" className="text-xs">
                    {item.modality}
                  </Badge>
                ))}
                <span className="text-xs text-muted-foreground">
                  {setItem.items.length}件
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
