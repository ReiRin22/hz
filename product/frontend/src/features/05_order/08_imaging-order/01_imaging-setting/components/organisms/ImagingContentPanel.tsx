'use client';

/**
 * 画像オーダー - 検査内容パネル（Organisms）
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/organisms/ImagingContentPanel.tsx
 */

import { useState } from 'react';
import { ArrowRight, Plus, Trash2, Settings } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Label } from '@/shared/components/atoms/label';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Badge } from '@/shared/components/atoms/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import type { ImagingContentPanelProps } from '../../types';
import {
  bodyPartsByCategory,
  directionsByCategory,
  categoryOptions,
  functionalConditionsByCategory,
  presetsByCategory
} from '../../types';
import { ExaminationSectionItem } from '../molecules/ExaminationSectionItem';
import { DirectionCheckboxGroup } from '../molecules/DirectionCheckboxGroup';
import { LateralitySelector } from '../molecules/LateralitySelector';
import { PositionCheckboxGroup } from '../molecules/PositionCheckboxGroup';
import { BodyPartCheckboxGroup } from '../molecules/BodyPartCheckboxGroup';
import { useExaminationSections } from '../../hooks';

export function ImagingContentPanel({
  imagingItem,
  onNext,
  onCancel,
  onNavigateToReservation,
  onNavigateToExamination
}: ImagingContentPanelProps) {
  // 検査種別
  const [selectedCategory, setSelectedCategory] = useState<string>(imagingItem.category || 'xray');

  // 検査種別に応じた部位リストと撮影方向を取得
  const availableBodyParts = selectedCategory ? bodyPartsByCategory[selectedCategory] || [] : [];
  const availableDirections = selectedCategory ? directionsByCategory[selectedCategory] || ['標準'] : ['標準'];
  const defaultDirection = availableDirections.length > 0 ? availableDirections[0] : '標準';

  // カスタムフック: 検査セクション管理
  const {
    sections,
    selectedSectionId,
    updateSection,
    toggleDirection,
    togglePosition,
    removeSection,
    openSlidePanel,
    closeSlidePanel,
    handleNext,
    isNextEnabled,
    setSections
  } = useExaminationSections({
    imagingItem,
    selectedCategory,
    defaultDirection,
    onNext,
    onNavigateToExamination
  });

  // プリセット取得
  const getPresetsByCategory = (category: string) => {
    return presetsByCategory[category] || [];
  };

  // プリセットを適用
  const applyPreset = (preset: {
    id: string;
    name: string;
    description: string;
    bodyParts: string;
    directions: string[];
    laterality: string[];
    radiationCondition: string;
    positions: string[];
    functionalConditions: string[];
  }) => {
    if (sections.length > 0) {
      const firstSectionId = sections[0].id;
      setSections(prev => prev.map(section => {
        if (section.id === firstSectionId) {
          return {
            ...section,
            bodyParts: [preset.bodyParts],
            directions: preset.directions,
            laterality: preset.laterality,
            radiationCondition: preset.radiationCondition,
            positions: preset.positions,
            functionalConditions: preset.functionalConditions
          };
        }
        return section;
      }));
    }
  };

  const selectedSection = sections.find(s => s.id === selectedSectionId);

  return (
    <div className="h-full flex bg-background relative">
      {/* 中央パネル */}
      <div className="w-[350px] h-full border-r border-border bg-background flex flex-col flex-shrink-0">
        {/* ヘッダー */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <h2>検査内容</h2>
        </div>

        {/* スクロール可能なコンテンツエリア */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {/* 検査種別選択 */}
              <div className="border border-border rounded-lg p-3 space-y-2">
                <Label>検査種別</Label>
                <div className="text-base px-3 py-2 bg-muted rounded-md">
                  {categoryOptions.find(opt => opt.value === selectedCategory)?.label || selectedCategory}
                </div>
              </div>

              {/* プリセット選択 */}
              <div className="border border-border rounded-lg p-3 space-y-2">
                <Label>検査プリセット</Label>
                <div className="grid grid-cols-2 gap-2">
                  {getPresetsByCategory(selectedCategory).map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      className="h-auto py-3 text-xs flex flex-col items-start gap-1"
                      onClick={() => applyPreset(preset)}
                    >
                      <span className="font-medium">{preset.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {preset.description}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* 検査内容入力セクション（複数可） */}
              {sections.map((section, index) => (
                <ExaminationSectionItem
                  key={section.id}
                  section={section}
                  index={index}
                  totalSections={sections.length}
                  onRemove={removeSection}
                  onOpenSettings={openSlidePanel}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* フッター：次へボタン */}
        <div className="p-4 border-t border-border flex-shrink-0 space-y-2 bg-background">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1"
              disabled={!isNextEnabled}
            >
              次へ
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* 右スライドパネル */}
      <div
        className={`h-full border-r border-border bg-background flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          selectedSectionId ? 'w-[640px] opacity-100' : 'w-0 opacity-0'
        }`}
      >
        {selectedSection && (
          <>
            {/* ヘッダー */}
            <div className="px-4 py-2 border-b border-border flex-shrink-0 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">画像</Badge>
                  <span className="text-sm text-muted-foreground">1件</span>
                </div>
                <div className="flex gap-1">
                  {/* TODO: Settings / 追加 / 削除 機能実装予定 */}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* サマリーエリア - 白い背景 */}
            <div className="px-4 py-3 bg-white border-b border-border">
              <div className="text-sm text-muted-foreground">
                希望時間等: <span className="text-foreground">即時</span>
              </div>
            </div>

            {/* スクロール可能なコンテンツエリア */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3 bg-blue-50/30">
                  {/* 検査種別 */}
                  <div className="space-y-1.5">
                    <Label className="text-sm">検査種別</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="検査種別を選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 検査部位 */}
                  <BodyPartCheckboxGroup
                    availableBodyParts={availableBodyParts}
                    selectedBodyParts={selectedSection.bodyParts}
                    onToggle={(part) => updateSection(selectedSection.id, 'bodyParts', part, selectedCategory)}
                  />

                  {/* 撮影方向 */}
                  <DirectionCheckboxGroup
                    availableDirections={availableDirections}
                    selectedDirections={selectedSection.directions}
                    onToggle={(dir) => toggleDirection(selectedSection.id, dir)}
                  />

                  {/* 側性 */}
                  <LateralitySelector
                    value={selectedSection.laterality[0] || 'Not specified'}
                    onChange={(value) => updateSection(selectedSection.id, 'laterality', [value], selectedCategory)}
                  />

                  {/* 体位 */}
                  <PositionCheckboxGroup
                    selectedPositions={selectedSection.positions}
                    onToggle={(pos) => togglePosition(selectedSection.id, pos)}
                  />

                  {/* 照射条件 */}
                  <div className="space-y-1.5">
                    <Label className="text-sm">照射条件</Label>
                    <Textarea
                      className="bg-white"
                      value={selectedSection.radiationCondition}
                      onChange={(e) => updateSection(selectedSection.id, 'radiationCondition', e.target.value, selectedCategory)}
                      rows={2}
                      placeholder="照射条件を入力してください"
                    />
                  </div>

                  {/* 機能的条件 */}
                  {functionalConditionsByCategory[selectedCategory] && (
                    <div className="space-y-1.5">
                      <Label className="text-sm">機能的条件</Label>
                      <div className="flex flex-wrap gap-2">
                        {functionalConditionsByCategory[selectedCategory].map((condition) => (
                          <label
                            key={condition}
                            className="inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedSection.functionalConditions.includes(condition)}
                              onCheckedChange={() => {
                                const current = selectedSection.functionalConditions;
                                const updated = current.includes(condition)
                                  ? current.filter(c => c !== condition)
                                  : [...current, condition];
                                updateSection(selectedSection.id, 'functionalConditions', updated, selectedCategory);
                              }}
                            />
                            <span className="text-sm">{condition}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* フッター */}
            <div className="p-4 border-t border-border flex-shrink-0 bg-background">
              <div className="flex gap-2">
                <Button
                  onClick={closeSlidePanel}
                  variant="default"
                  className="flex-1"
                >
                  保存
                </Button>
                <Button
                  onClick={closeSlidePanel}
                  variant="outline"
                  className="flex-1"
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
