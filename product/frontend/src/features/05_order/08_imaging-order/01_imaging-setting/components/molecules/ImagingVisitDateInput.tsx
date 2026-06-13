'use client';

/**
 * 画像検査来院日入力コンポーネント
 * UIガイドライン準拠: molecules層
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/ImagingVisitDateInput.tsx
 */

import * as React from 'react';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Checkbox } from '@/shared/components/atoms/checkbox';

export interface ImagingVisitDateInputProps {
  /** 予定日 */
  scheduledDate?: string;
  /** 日付未定フラグ */
  dateUndecided?: boolean;
  /** 予定日変更時のコールバック */
  onScheduledDateChange: (value: string) => void;
  /** 日付未定フラグ変更時のコールバック */
  onDateUndecidedChange: (value: boolean) => void;
  /** 検査種別（枠未取得/日付未定の表示切替用） */
  modality?: string;
}

export const ImagingVisitDateInput: React.FC<ImagingVisitDateInputProps> = ({
  scheduledDate,
  dateUndecided,
  onScheduledDateChange,
  onDateUndecidedChange,
  modality,
}) => {
  const isCtMriUltrasound = ['CT検査', 'MRI検査', '超音波検査'].includes(modality || '');
  const undecidedLabel = isCtMriUltrasound ? '枠未取得' : '日付未定';

  return (
    <div className="space-y-2">
      <label className="text-xs text-muted-foreground block">実施予定日</label>
      <div className="flex items-center gap-3">
        {/* カレンダー入力 */}
        <Input
          type="date"
          value={dateUndecided ? '' : scheduledDate || ''}
          onChange={(e) => onScheduledDateChange(e.target.value)}
          disabled={dateUndecided}
          className="h-8 text-xs bg-white flex-1"
        />

        {/* 日付未定チェックボックス */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Checkbox
            id="date-undecided"
            checked={dateUndecided || false}
            onCheckedChange={(checked) => onDateUndecidedChange(!!checked)}
          />
          <Label htmlFor="date-undecided" className="text-xs cursor-pointer">
            {undecidedLabel}
          </Label>
        </div>
      </div>
    </div>
  );
};
