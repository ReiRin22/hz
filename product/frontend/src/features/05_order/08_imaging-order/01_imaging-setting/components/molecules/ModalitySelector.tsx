'use client';

/**
 * 検査種別選択コンポーネント
 * UIガイドライン準拠: molecules層
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/ModalitySelector.tsx
 */

import * as React from 'react';
import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import type { ImagingModality } from '../../types';

export interface ModalitySelectorProps {
  /** 選択中の検査種別 */
  value?: ImagingModality;
  /** 検査種別変更時のコールバック */
  onChange: (modality: ImagingModality | undefined) => void;
  /** 無効化フラグ */
  disabled?: boolean;
}

const MODALITY_OPTIONS: { value: ImagingModality; label: string }[] = [
  { value: 'CT検査', label: 'CT検査' },
  { value: 'MRI検査', label: 'MRI検査' },
  { value: 'X線撮影', label: 'X線撮影' },
  { value: '超音波検査', label: '超音波検査' },
  { value: 'マンモグラフィ', label: 'マンモグラフィ' },
  { value: 'その他', label: 'その他' },
];

export const ModalitySelector: React.FC<ModalitySelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">検査種別</Label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as ImagingModality)}
        disabled={disabled}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          {MODALITY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
