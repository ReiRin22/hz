'use client';

/**
 * 造影剤使用選択コンポーネント
 * UIガイドライン準拠: molecules層
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/ContrastAgentSelector.tsx
 */

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Label } from '@/shared/components/atoms/label';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Input } from '@/shared/components/atoms/input';

export interface ContrastAgentSelectorProps {
  /** 造影剤使用フラグ */
  useContrast?: boolean;
  /** アレルギー有無フラグ */
  hasAllergy?: boolean;
  /** 造影剤投与量 */
  contrastDose?: string;
  /** 造影剤注入速度 */
  contrastRate?: string;
  /** 造影剤使用フラグ変更時のコールバック */
  onUseContrastChange: (useContrast: boolean) => void;
  /** アレルギー有無フラグ変更時のコールバック */
  onHasAllergyChange: (hasAllergy: boolean) => void;
  /** 造影剤投与量変更時のコールバック */
  onContrastDoseChange: (dose: string) => void;
  /** 造影剤注入速度変更時のコールバック */
  onContrastRateChange: (rate: string) => void;
}

export const ContrastAgentSelector: React.FC<ContrastAgentSelectorProps> = ({
  useContrast = false,
  hasAllergy = false,
  contrastDose = '',
  contrastRate = '',
  onUseContrastChange,
  onHasAllergyChange,
  onContrastDoseChange,
  onContrastRateChange,
}) => {
  return (
    <div className="space-y-3">
      {/* 造影剤使用 */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="use-contrast"
          checked={useContrast}
          onCheckedChange={(checked) => onUseContrastChange(checked as boolean)}
        />
        <Label htmlFor="use-contrast" className="text-xs cursor-pointer">
          造影剤を使用する
        </Label>
      </div>

      {/* 造影剤使用時の追加項目 */}
      {useContrast && (
        <div className="space-y-3 pl-6 border-l-2 border-amber-500/20">
          {/* アレルギー有無 */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="has-allergy"
              checked={hasAllergy}
              onCheckedChange={(checked) => onHasAllergyChange(checked as boolean)}
            />
            <Label htmlFor="has-allergy" className="text-xs cursor-pointer flex items-center gap-1">
              <AlertTriangle className="size-3 text-amber-600" />
              造影剤アレルギーあり
            </Label>
          </div>

          {/* 造影剤投与量 */}
          <div className="space-y-1.5">
            <Label className="text-xs">造影剤投与量</Label>
            <Input
              type="text"
              value={contrastDose}
              onChange={(e) => onContrastDoseChange(e.target.value)}
              placeholder="例: 100ml"
              className="h-8 text-xs"
            />
          </div>

          {/* 造影剤注入速度 */}
          <div className="space-y-1.5">
            <Label className="text-xs">造影剤注入速度</Label>
            <Input
              type="text"
              value={contrastRate}
              onChange={(e) => onContrastRateChange(e.target.value)}
              placeholder="例: 2ml/s"
              className="h-8 text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};
