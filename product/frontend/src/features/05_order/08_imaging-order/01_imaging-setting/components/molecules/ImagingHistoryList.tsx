'use client';

/**
 * 画像検査履歴リスト
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/ImagingHistoryList.tsx
 */

import { Badge } from '@/shared/components/atoms/badge';
import type { OrderDetail, PreferredTime } from '../../types/order-shared.types';
import type { ImagingHistoryItem } from '../../hooks/useImagingPanelData';

interface ImagingHistoryListProps {
  historyData: ImagingHistoryItem[];
  onAddOrder?: (order: OrderDetail) => void;
  onSubTabChange?: (tab: 'search' | 'history' | 'sets') => void;
}

export function ImagingHistoryList({
  historyData,
  onAddOrder,
  onSubTabChange
}: ImagingHistoryListProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-3">
        過去の画像検査オーダーから選択
      </div>
      {historyData.map((historyItem) => {
        const handleAddFromHistory = () => {
          const today = new Date().toISOString().split('T')[0];
          const newOrder: OrderDetail = {
            id: `imaging-${crypto.randomUUID()}`,
            name: historyItem.name,
            type: 'imaging',
            modality: historyItem.modality,
            bodyPart: historyItem.bodyPart,
            imagingContent: historyItem.imagingContent,
            protocols: historyItem.protocols,
            position: historyItem.position,
            laterality: historyItem.laterality,
            functionalConditions: historyItem.functionalConditions,
            specialInstructions: historyItem.specialInstructions,
            bodyPartsList: historyItem.bodyPartsList as OrderDetail['bodyPartsList'],
            priority: historyItem.priority,
            preferredTime: historyItem.preferredTime as PreferredTime | undefined,
            preferredDate: today,
            dateUndecided: false,
            preferredTimeSlots: ['即時'],
            useContrast: historyItem.useContrast,
            hasAllergy: historyItem.hasAllergy,
            clinicalPurpose: historyItem.clinicalPurpose,
            symptomTags: historyItem.symptomTags,
            scheduledDate: today
          };

          if (onAddOrder) {
            onAddOrder(newOrder);
          }

          if (onSubTabChange) {
            onSubTabChange('search');
          }
        };

        return (
          <div
            key={historyItem.id}
            className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={handleAddFromHistory}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">{historyItem.name}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(historyItem.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs">
                <span className="text-muted-foreground">検査種別: </span>
                <span>{historyItem.modality}</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">部位: </span>
                <span>{historyItem.bodyPart}</span>
              </div>
              {historyItem.useContrast && (
                <div className="text-xs">
                  <span className="text-muted-foreground">造影剤: </span>
                  <span className="text-red-600">使用</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
