'use client';

/**
 * 画像オーダー - 詳細入力パネル（Organisms）
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/organisms/ImagingOrderDetailPanel.tsx
 */

import { useState } from 'react';
import { ChevronLeft, X, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Textarea } from '@/shared/components/atoms/textarea';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Badge } from '@/shared/components/atoms/badge';
import { Alert, AlertDescription } from '@/shared/components/atoms/alert';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import type { ImagingOrderDetail, ImagingOrderDetailPanelProps } from '../../types';
import { ExaminationContentSummary } from '../molecules/ExaminationContentSummary';
import { SpecialInstructionsInput } from '../molecules/SpecialInstructionsInput';
import { UrgencySelector } from '../molecules/UrgencySelector';

export function ImagingOrderDetailPanel({
  imagingItem,
  contentDetail,
  onConfirm,
  onCancel,
  onBack,
  onNavigateToScheduling,
  currentPatient,
  initialScheduledDate,
  initialScheduledTime
}: ImagingOrderDetailPanelProps) {
  const modalityName = imagingItem.name;

  // 検査内容を画面表示用に変換
  const bodyPartsList = contentDetail.examinationList.map(item => ({
    bodyPart: item.bodyPart,
    protocol: item.direction,
    laterality: item.laterality,
    position: item.position,
    radiationCondition: item.radiationCondition
  }));

  // オーダー詳細の状態
  const [orderDetail, setOrderDetail] = useState<ImagingOrderDetail>({
    orderingDoctor: '山田 太郎',
    orderDateTime: new Date().toISOString(),
    modality: modalityName,
    bodyPartsList: bodyPartsList,
    clinicalPurpose: '',
    symptomTags: [],
    preferredTime: initialScheduledDate ? 'specific' : 'now',
    scheduledDate: initialScheduledDate || '',
    scheduledTime: initialScheduledTime || '',
    priority: 'normal',
    specialInstructions: '',
    useContrast: false,
    hasAllergy: false,
    egfrValue: ''
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<string[]>([]);

  // 利用可能な特別指示オプション
  const availableSpecialInstructions = [
    '体動に注意',
    '呼吸停止困難',
    '閉所恐怖症',
    '体位制限あり',
    '意思疎通困難'
  ];

  // 特別指示の追加/削除
  const addSpecialInstruction = (instruction: string) => {
    const current = orderDetail.specialInstructions || '';
    if (current.includes(instruction)) {
      const updated = current.split('\n').filter(line => line.trim() !== instruction).join('\n');
      setOrderDetail(prev => ({ ...prev, specialInstructions: updated }));
    } else {
      const updated = current ? `${current}\n${instruction}` : instruction;
      setOrderDetail(prev => ({ ...prev, specialInstructions: updated }));
    }
  };

  // バリデーション
  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!orderDetail.clinicalPurpose.trim()) {
      newErrors.push('臨床目的を入力してください');
    }

    if (orderDetail.preferredTime === 'specific' && !orderDetail.scheduledDate) {
      newErrors.push('希望日時を指定してください');
    }

    if (orderDetail.useContrast && !orderDetail.egfrValue) {
      newErrors.push('造影剤使用時はeGFR値を入力してください');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // 確定処理
  const handleConfirm = () => {
    if (validate()) {
      onConfirm(orderDetail);
    }
  };

  // スケジューリング画面への遷移
  const handleNavigateToScheduling = () => {
    if (onNavigateToScheduling) {
      onNavigateToScheduling(orderDetail);
    }
  };

  // 希望時間オプション
  const timeOptions = [
    { value: 'now', label: '即時' },
    { value: 'morning', label: '午前中' },
    { value: 'afternoon', label: '午後' },
    { value: 'specific', label: '日時指定' },
    { value: 'unscheduled', label: '未定' },
    { value: 'undated', label: '日付未定' }
  ];

  return (
    <div className="w-[350px] h-screen bg-card border-r border-border flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2>画像検査オーダー詳細</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-6">
          {/* エラー表示 */}
          {errors.length > 0 && (
            <Alert variant="destructive" className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* 検査種別セクション */}
          <div className="border border-border rounded-lg p-3 space-y-2">
            <Label>検査種別</Label>
            <div className="bg-muted/50 rounded p-2 text-sm font-medium">
              {modalityName}
            </div>
          </div>

          {/* 検査内容（編集可能） */}
          <ExaminationContentSummary bodyPartsList={bodyPartsList} />

          {/* スケジューリング */}
          <div className="border border-border rounded-lg p-3 space-y-3">
            <Label>希望時間</Label>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={orderDetail.preferredTime === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOrderDetail(prev => ({ ...prev, preferredTime: option.value as ImagingOrderDetail['preferredTime'] }))}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {orderDetail.preferredTime === 'specific' && (
              <div className="space-y-2">
                <div>
                  <Label>希望日</Label>
                  <Input
                    type="date"
                    value={orderDetail.scheduledDate}
                    onChange={(e) => setOrderDetail(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>希望時刻</Label>
                  <Input
                    type="time"
                    value={orderDetail.scheduledTime}
                    onChange={(e) => setOrderDetail(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
                {onNavigateToScheduling && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleNavigateToScheduling}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    空き枠から選択
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* 造影剤（CT/MRIのみ） */}
          {(modalityName.includes('CT') || modalityName.includes('MRI')) && (
            <div className="border border-border rounded-lg p-3 space-y-3">
              <Label>造影剤</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="use-contrast"
                  checked={orderDetail.useContrast || false}
                  onCheckedChange={(checked) => setOrderDetail(prev => ({ ...prev, useContrast: !!checked }))}
                />
                <label htmlFor="use-contrast" className="text-xs cursor-pointer">
                  造影剤を使用する
                </label>
              </div>

              {orderDetail.useContrast && (
                <div className="space-y-3 ml-6 border-l-2 border-blue-200 pl-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="has-allergy"
                      checked={orderDetail.hasAllergy || false}
                      onCheckedChange={(checked) => setOrderDetail(prev => ({ ...prev, hasAllergy: !!checked }))}
                    />
                    <label htmlFor="has-allergy" className="text-xs cursor-pointer">
                      造影剤アレルギーあり
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">eGFR値（ml/min/1.73㎡）</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={orderDetail.egfrValue || ''}
                      onChange={(e) => setOrderDetail(prev => ({ ...prev, egfrValue: e.target.value }))}
                      placeholder="eGFR値を入力"
                      className="h-8 text-xs"
                    />
                  </div>

                  {orderDetail.hasAllergy && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">アレルギー特別指示</Label>
                      <Textarea
                        value={orderDetail.allergySpecialInstructions || ''}
                        onChange={(e) => setOrderDetail(prev => ({ ...prev, allergySpecialInstructions: e.target.value }))}
                        placeholder="アレルギーに関する特別指示を入力"
                        rows={2}
                        className="text-xs"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 臨床目的 */}
          <div>
            <Label>臨床目的</Label>
            <Textarea
              placeholder="検査の目的や臨床症状を入力してください"
              value={orderDetail.clinicalPurpose}
              onChange={(e) => setOrderDetail(prev => ({ ...prev, clinicalPurpose: e.target.value }))}
              rows={3}
            />
          </div>

          {/* 症状タグ */}
          <div>
            <Label>症状タグ（任意）</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['疼痛', '腫脹', '発熱', '外傷', '経過観察', 'スクリーニング'].map((tag) => (
                <Badge
                  key={tag}
                  variant={orderDetail.symptomTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    const updated = orderDetail.symptomTags.includes(tag)
                      ? orderDetail.symptomTags.filter(t => t !== tag)
                      : [...orderDetail.symptomTags, tag];
                    setOrderDetail(prev => ({ ...prev, symptomTags: updated }));
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* 特別指示・機能条件 */}
          <SpecialInstructionsInput
            value={orderDetail.specialInstructions || ''}
            availableInstructions={availableSpecialInstructions}
            onChange={(value) => setOrderDetail(prev => ({ ...prev, specialInstructions: value }))}
            onToggleInstruction={addSpecialInstruction}
          />

          {/* 緊急度 */}
          <UrgencySelector
            value={orderDetail.priority}
            onChange={(value) => setOrderDetail(prev => ({ ...prev, priority: value }))}
          />

          {/* 技師へのメモ */}
          <div>
            <Label>技師へのメモ（任意）</Label>
            <Textarea
              placeholder="技師へのメモがあれば入力してください"
              value={orderDetail.technicianNotes || ''}
              onChange={(e) => setOrderDetail(prev => ({ ...prev, technicianNotes: e.target.value }))}
              rows={2}
            />
          </div>
        </div>
      </ScrollArea>

      {/* フッター */}
      <div className="p-4 border-t border-border flex-shrink-0 space-y-2 bg-background">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            戻る
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
          >
            確定
          </Button>
        </div>
      </div>
    </div>
  );
}
