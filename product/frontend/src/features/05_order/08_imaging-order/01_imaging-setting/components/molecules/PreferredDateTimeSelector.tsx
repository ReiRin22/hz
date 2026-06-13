'use client';

/**
 * 希望日時選択コンポーネント
 * UIガイドライン準拠: molecules層
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/PreferredDateTimeSelector.tsx
 */

import * as React from 'react';
import { Label } from '@/shared/components/atoms/label';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Input } from '@/shared/components/atoms/input';
import type { PreferredTimeSlot } from '../../types';

export interface PreferredDateTimeSelectorProps {
  /** 希望日 */
  preferredDate?: string;
  /** 日付未定フラグ */
  dateUndecided?: boolean;
  /** 希望時間帯の配列 */
  preferredTimeSlots?: PreferredTimeSlot[];
  /** 希望日変更時のコールバック */
  onPreferredDateChange: (date: string) => void;
  /** 日付未定フラグ変更時のコールバック */
  onDateUndecidedChange: (undecided: boolean) => void;
  /** 希望時間帯変更時のコールバック */
  onPreferredTimeSlotsChange: (slots: PreferredTimeSlot[]) => void;
  /** 検査種別（ラベル表示の切り替えに使用） */
  modality?: string;
}

const TIME_SLOT_OPTIONS: PreferredTimeSlot[] = ['即時', '午前', '午後'];

export const PreferredDateTimeSelector: React.FC<PreferredDateTimeSelectorProps> = ({
  preferredDate,
  dateUndecided = false,
  preferredTimeSlots = [],
  onPreferredDateChange,
  onDateUndecidedChange,
  onPreferredTimeSlotsChange,
  modality,
}) => {
  // CT・MRI・超音波は「枠未取得」、その他は「日付未定」
  const undecidedLabel =
    modality === 'CT検査' || modality === 'MRI検査' || modality === '超音波検査' ? '枠未取得' : '日付未定';

  const handleTimeSlotToggle = (slot: PreferredTimeSlot) => {
    const newSlots = preferredTimeSlots.includes(slot)
      ? preferredTimeSlots.filter((s) => s !== slot)
      : [...preferredTimeSlots, slot];
    onPreferredTimeSlotsChange(newSlots);
  };

  return (
    <div className="space-y-3">
      {/* 希望日 */}
      <div className="space-y-1.5">
        <Label className="text-xs">希望日</Label>
        <Input
          type="date"
          value={preferredDate || ''}
          onChange={(e) => onPreferredDateChange(e.target.value)}
          disabled={dateUndecided}
          className="h-8 text-xs"
        />
      </div>

      {/* 日付未定 / 枠未取得 */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="date-undecided"
          checked={dateUndecided}
          onCheckedChange={(checked) => onDateUndecidedChange(checked as boolean)}
        />
        <Label htmlFor="date-undecided" className="text-xs cursor-pointer">
          {undecidedLabel}
        </Label>
      </div>

      {/* 希望時間帯 */}
      {!dateUndecided && (
        <div className="space-y-1.5">
          <Label className="text-xs">希望時間帯</Label>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOT_OPTIONS.map((slot) => (
              <div key={slot} className="flex items-center gap-1.5">
                <Checkbox
                  id={`time-slot-${slot}`}
                  checked={preferredTimeSlots.includes(slot)}
                  onCheckedChange={() => handleTimeSlotToggle(slot)}
                />
                <Label htmlFor={`time-slot-${slot}`} className="text-xs cursor-pointer">
                  {slot}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
