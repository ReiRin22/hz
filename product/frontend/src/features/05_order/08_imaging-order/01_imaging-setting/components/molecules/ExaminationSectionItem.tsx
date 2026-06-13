'use client';

/**
 * 検査セクションアイテム - ImagingContentPanel用UI部品
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/ExaminationSectionItem.tsx
 */

import { X, Settings } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import type { ExaminationSection } from '../../types';

export interface ExaminationSectionItemProps {
  section: ExaminationSection;
  index: number;
  totalSections: number;
  onRemove: (id: string) => void;
  onOpenSettings: (id: string) => void;
}

export function ExaminationSectionItem({
  section,
  index,
  totalSections,
  onRemove,
  onOpenSettings
}: ExaminationSectionItemProps) {
  return (
    <div className="border border-border rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm">検査詳細 {totalSections > 1 ? `(${index + 1})` : ''}</h3>
        <div className="flex gap-2">
          {/* 2つ目以降のセクションには削除ボタン */}
          {index > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(section.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* 設定済み情報の表示 */}
        {section.bodyParts.length > 0 && (
          <div className="text-sm space-y-1 bg-muted/30 p-3 rounded-md">
            <div className="font-medium">{section.bodyParts.join('・')}</div>
            {section.directions.length > 0 && (
              <div className="text-xs text-muted-foreground">
                撮影方向: {section.directions.join('・')}
              </div>
            )}
            {section.laterality.length > 0 && !section.laterality.includes('Not specified') && (
              <div className="text-xs text-muted-foreground">
                側性: {section.laterality.join('・')}
              </div>
            )}
            {section.positions.length > 0 && (
              <div className="text-xs text-muted-foreground">
                体位: {section.positions.join('・')}
              </div>
            )}
          </div>
        )}

        {/* 詳細設定ボタン */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onOpenSettings(section.id)}
        >
          <Settings className="w-4 h-4 mr-2" />
          詳細設定
        </Button>
      </div>
    </div>
  );
}
