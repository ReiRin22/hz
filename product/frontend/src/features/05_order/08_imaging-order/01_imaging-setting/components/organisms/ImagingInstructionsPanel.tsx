'use client';

/**
 * 画像検査オーダー - 特別指示・測定条件入力パネル
 * UIガイドライン準拠: organisms層
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/organisms/ImagingInstructionsPanel.tsx
 */

import * as React from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Label } from '@/shared/components/atoms/label';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Badge } from '@/shared/components/atoms/badge';
import type { ImagingOrderItem, ImagingContentDetail } from '../../types';
import type { ImagingInstructionsDetail } from '../../types/order-shared.types';
import { specialInstructionsByCategory } from '../../types';

export type { ImagingInstructionsDetail };

export interface ImagingInstructionsPanelProps {
  /** 画像オーダー項目 */
  imagingItem: ImagingOrderItem;
  /** 検査内容詳細 */
  contentDetail: ImagingContentDetail;
  /** 次へボタン押下時のコールバック */
  onNext: (instructionsDetail: ImagingInstructionsDetail) => void;
  /** 戻るボタン押下時のコールバック */
  onBack: () => void;
  /** キャンセルボタン押下時のコールバック */
  onCancel: () => void;
}

// 検査種別ごとの測定条件候補
const measurementConditionsByCategory: Record<string, string[]> = {
  xray: [
    '立位で撮影',
    '臥位で撮影',
    '座位で撮影',
    '荷重位で撮影',
    '吸気時に撮影',
    '呼気時に撮影',
    '最大吸気位',
    '最大呼気位',
    '側臥位で撮影',
    '腹臥位で撮影',
    '仰臥位で撮影',
  ],
  ct: [
    '呼吸停止下で撮影',
    '造影前後で撮影',
    '造影後のみ',
    '造影なし（単純CT）',
    '3D再構成を含む',
    '薄いスライスで撮影',
    '動脈相・静脈相の撮影',
    '遅延相を含む',
    'MPR作成',
    '冠状断・矢状断も作成',
  ],
  mri: [
    '呼吸同期を使用',
    '脂肪抑制を含む',
    '造影前後で撮影',
    '造影後のみ',
    '造影なし',
    'T1強調画像',
    'T2強調画像',
    'FLAIR画像',
    'DWI（拡散強調画像）',
    'MRA（血管撮影）',
    '全身MRI',
    '機能的MRI',
  ],
  ultrasound: [
    '絶食後に実施',
    '充満膀胱で実施',
    '呼吸停止下で観察',
    'カラードップラーを使用',
    'エラストグラフィを含む',
    '体位変換を含む',
    '圧迫法を使用',
    '負荷試験を含む',
  ],
  dexa: ['腰椎で測定', '大腿骨で測定', '前腕で測定', '全身測定', '体組成分析を含む'],
  fluoroscopy: [
    '立位で実施',
    '臥位で実施',
    '体位変換を含む',
    '圧迫法を使用',
    '二重造影法',
    '動画記録を含む',
    'スポット撮影を含む',
  ],
};

export const ImagingInstructionsPanel: React.FC<ImagingInstructionsPanelProps> = ({
  imagingItem,
  contentDetail,
  onNext,
  onBack,
  onCancel,
}) => {
  const [specialInstructions, setSpecialInstructions] = React.useState('');
  const [measurementConditions, setMeasurementConditions] = React.useState('');

  // カテゴリIDから検査種別名へのマッピング
  const categoryLabels: Record<string, string> = {
    xray: 'X線撮影',
    ct: 'CT検査',
    mri: 'MRI検査',
    ultrasound: '超音波検査',
    dexa: '骨密度測定',
    fluoroscopy: '透視検査',
  };

  // 表示用の検査種別名を取得
  const modalityName = imagingItem.category
    ? categoryLabels[imagingItem.category] || imagingItem.name
    : imagingItem.name;

  // 特別指示候補を追加
  const addSpecialInstruction = (instruction: string) => {
    if (specialInstructions.includes(instruction)) {
      return;
    }
    if (specialInstructions.trim() === '') {
      setSpecialInstructions(instruction);
    } else {
      setSpecialInstructions((prev) => `${prev}\n${instruction}`);
    }
  };

  // 測定条件候補を追加
  const addMeasurementCondition = (condition: string) => {
    if (measurementConditions.includes(condition)) {
      return;
    }
    if (measurementConditions.trim() === '') {
      setMeasurementConditions(condition);
    } else {
      setMeasurementConditions((prev) => `${prev}\n${condition}`);
    }
  };

  const handleNext = () => {
    onNext({
      specialInstructions,
      measurementConditions,
    });
  };

  // 検査内容のサマリーを表示
  const renderExaminationSummary = () => {
    if (!contentDetail.examinationList || contentDetail.examinationList.length === 0) {
      return null;
    }

    // 側性と撮影方向でグループ化
    const grouped = contentDetail.examinationList.reduce(
      (acc, item) => {
        const key = `${item.laterality || 'none'}-${item.direction}`;
        if (!acc[key]) {
          acc[key] = {
            laterality: item.laterality,
            direction: item.direction,
            bodyParts: [],
          };
        }
        acc[key].bodyParts.push(item.bodyPart);
        return acc;
      },
      {} as Record<string, { laterality?: string; direction: string; bodyParts: string[] }>
    );

    return (
      <div className="space-y-2">
        {Object.values(grouped).map((group, index) => (
          <div key={index} className="bg-muted/50 rounded p-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium max-w-[200px]">{group.bodyParts.join('、')}</span>
              {group.laterality &&
                group.laterality !== 'none' &&
                group.laterality !== '指定なし' &&
                group.laterality !== 'Not specified' && (
                  <span className="text-muted-foreground">({group.laterality})</span>
                )}
              <span className="text-muted-foreground">{group.direction}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-[350px] h-full border-r border-border bg-background flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2>特別指示・測定条件</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* スクロール可能なコンテンツエリア */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* 検査種別表示 */}
          <div className="border border-border rounded-lg p-3 space-y-2">
            <Label>検査種別</Label>
            <div className="text-sm font-medium">{modalityName}</div>
          </div>

          {/* 検査内容サマリー */}
          <div className="border border-border rounded-lg p-3 space-y-2">
            <Label>検査内容</Label>
            {renderExaminationSummary()}
          </div>

          {/* 特別指示 */}
          <div className="space-y-2">
            <Label htmlFor="specialInstructions">特別指示</Label>
            <Textarea
              id="specialInstructions"
              placeholder="撮影時の特別な指示があれば入力してください&#10;例：体動困難のため介助が必要&#10;　　ペースメーカー留置あり"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={5}
              className="resize-none"
            />
            {/* 特別指示候補 */}
            {specialInstructionsByCategory[imagingItem.category || ''] && (
              <div className="mt-2">
                {specialInstructionsByCategory[imagingItem.category || ''].map((instruction, index) => (
                  <Badge key={index} className="mr-2 mb-2 cursor-pointer" onClick={() => addSpecialInstruction(instruction)}>
                    {instruction}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 測定条件 */}
          <div className="space-y-2">
            <Label htmlFor="measurementConditions">測定条件</Label>
            <Textarea
              id="measurementConditions"
              placeholder="測定時の条件があれば入力してください&#10;例：吸気時に撮影&#10;　　荷重位で撮影"
              value={measurementConditions}
              onChange={(e) => setMeasurementConditions(e.target.value)}
              rows={5}
              className="resize-none"
            />
            {/* 測定条件候補 */}
            {measurementConditionsByCategory[imagingItem.category || ''] && (
              <div className="mt-2">
                {measurementConditionsByCategory[imagingItem.category || ''].map((condition, index) => (
                  <Badge key={index} className="mr-2 mb-2 cursor-pointer" onClick={() => addMeasurementCondition(condition)}>
                    {condition}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* フッターアクション */}
      <div className="p-4 border-t border-border flex gap-2 flex-shrink-0">
        <Button variant="outline" onClick={onBack} className="flex-1">
          戻る
        </Button>
        <Button onClick={handleNext} className="flex-1">
          次へ（詳細入力）
        </Button>
      </div>
    </div>
  );
};
