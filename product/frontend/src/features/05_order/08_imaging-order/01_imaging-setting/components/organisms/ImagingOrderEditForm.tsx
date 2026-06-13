'use client';

/**
 * 画像オーダー編集フォームコンポーネント
 * UIガイドライン準拠: organisms層
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/organisms/ImagingOrderEditForm.tsx
 */

import { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { RadioGroup, RadioGroupItem } from '@/shared/components/atoms/radio-group';
import { Badge } from '@/shared/components/atoms/badge';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Label } from '@/shared/components/atoms/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/atoms/collapsible';
import { ImagingVisitDateInput } from '../molecules/ImagingVisitDateInput';
import { IMAGING_PRESETS } from '../../stores/imagingPresets';
import { RADIO_ITEM_CLASSES, NESTED_CONTENT_CLASSES } from '../../styles/commonStyles';
import type { OrderDetail, EditingOrderData } from '../../types/order-shared.types';

export interface ImagingOrderEditFormProps {
  order: OrderDetail;
  isEditing: EditingOrderData;
  updateEditingValue: (orderId: string, field: keyof EditingOrderData, value: unknown) => void;
  handleSave: (order: OrderDetail) => void;
  handleCancel: (orderId: string) => void;
}

export function ImagingOrderEditForm({
  order,
  isEditing,
  updateEditingValue,
  handleSave,
  handleCancel,
}: ImagingOrderEditFormProps) {
  // 各Collapsibleの開閉状態を管理
  const [openSections, setOpenSections] = useState({
    modality: false,
    bodyPart: false,
    imagingContent: false,
    contrast: false,
    functionalConditions: false,
    specialInstructions: false,
    priority: false,
    preferredTime: false,
  });

  // プリセット選択時の処理
  const handlePresetClick = (content: string) => {
    updateEditingValue(order.id, 'imagingContent', content);

    if (isEditing.bodyPartsList && isEditing.bodyPartsList.length > 0) {
      const updatedList = isEditing.bodyPartsList.map((part) => ({
        ...part,
        imagingContent: content,
      }));
      updateEditingValue(order.id, 'bodyPartsList', updatedList);
    }

    setOpenSections(prev => ({ ...prev, imagingContent: false }));
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 space-y-2">
      {/* 検査種別 */}
      <Collapsible open={openSections.modality} onOpenChange={(open) => setOpenSections(prev => ({ ...prev, modality: open }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
          <span className="text-xs">検査種別: {isEditing.modality || '未選択'}</span>
          <ChevronDown className="w-3 h-3" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <label className="text-xs text-muted-foreground">検査種別</label>
          <Select
            value={isEditing.modality || ''}
            onValueChange={(value) => {
              updateEditingValue(order.id, 'modality', value);
              setOpenSections(prev => ({ ...prev, modality: false }));
            }}
          >
            <SelectTrigger className="h-8 text-xs bg-white mt-1">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent className="z-[9999]" position="popper" sideOffset={4}>
              <SelectItem value="X線検査">X線検査</SelectItem>
              <SelectItem value="CT検査">CT検査</SelectItem>
              <SelectItem value="MRI検査">MRI検査</SelectItem>
              <SelectItem value="超音波検査">超音波検査</SelectItem>
              <SelectItem value="ＤＥＸＡ（骨密度検査）">ＤＥＸＡ（骨密度検査）</SelectItem>
              <SelectItem value="透視検査">透視検査</SelectItem>
            </SelectContent>
          </Select>
        </CollapsibleContent>
      </Collapsible>

      {/* 検査部位 */}
      <Collapsible open={openSections.bodyPart} onOpenChange={(open) => setOpenSections(prev => ({ ...prev, bodyPart: open }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
          <span className="text-xs">
            検査部位: {(isEditing.selectedBodyParts?.length ?? 0) > 0 ? `${isEditing.selectedBodyParts!.join('、')}（${isEditing.selectedBodyParts!.length}件）` : '未選択'}
          </span>
          <ChevronDown className="w-3 h-3" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <label className="text-xs text-muted-foreground">検査部位（複数選択可）</label>

          {/* チェックボックスリスト - 4列2行 */}
          <div className="grid grid-cols-4 gap-2 bg-white border border-border rounded p-2">
            {['頭部', '胸部', '腹部', '骨盤', '脊椎', '上肢', '下肢'].map((bodyPart) => {
              const isSelected = isEditing.selectedBodyParts?.includes(bodyPart) || false;

              return (
                <label
                  key={bodyPart}
                  className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-1.5 rounded transition-colors"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const currentParts = isEditing.selectedBodyParts || [];
                      let updatedParts: string[];

                      if (checked) {
                        updatedParts = [...currentParts, bodyPart];
                      } else {
                        updatedParts = currentParts.filter((p) => p !== bodyPart);
                      }

                      updateEditingValue(order.id, 'selectedBodyParts', updatedParts);

                      if (updatedParts.length > 0) {
                        updateEditingValue(order.id, 'bodyPart', updatedParts[0]);
                      } else {
                        updateEditingValue(order.id, 'bodyPart', '');
                      }

                      const bodyPartsList: Array<{
                        name: string;
                        direction: string;
                        position: string;
                        imagingContent: string;
                      }> = [];

                      updatedParts.forEach((part) => {
                        let defaultProtocols: string[] = [];
                        let defaultPosition = 'Not specified';

                        switch (part) {
                          case '頭部':
                            defaultProtocols = ['AP', 'LAT'];
                            defaultPosition = '臥位';
                            break;
                          case '胸部':
                            defaultProtocols = ['PA', 'LAT'];
                            defaultPosition = '立位';
                            break;
                          case '腹部':
                            defaultProtocols = ['AP'];
                            defaultPosition = '臥位';
                            break;
                          case '骨盤':
                            defaultProtocols = ['AP'];
                            defaultPosition = '臥位';
                            break;
                          case '脊椎':
                            defaultProtocols = ['AP', 'LAT'];
                            defaultPosition = '立位';
                            break;
                          case '上肢':
                            defaultProtocols = ['AP', 'LAT'];
                            defaultPosition = 'Not specified';
                            break;
                          case '下肢':
                            defaultProtocols = ['AP', 'LAT'];
                            defaultPosition = '立位';
                            break;
                        }

                        defaultProtocols.forEach((protocol) => {
                          bodyPartsList.push({
                            name: part,
                            direction: protocol,
                            position: defaultPosition,
                            imagingContent: isEditing.imagingContent || '',
                          });
                        });
                      });

                      updateEditingValue(order.id, 'bodyPartsList', bodyPartsList);
                    }}
                  />
                  <span className="text-xs">{bodyPart}</span>
                </label>
              );
            })}
          </div>

          {/* 選択中の部位を表示 */}
          {isEditing.selectedBodyParts && isEditing.selectedBodyParts.length > 0 && (
            <div className="text-xs text-muted-foreground px-1">
              選択中: {isEditing.selectedBodyParts.join('、')}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* 撮影内容 */}
      <Collapsible open={openSections.imagingContent} onOpenChange={(open) => setOpenSections(prev => ({ ...prev, imagingContent: open }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
          <span className="text-xs">撮影内容: {isEditing.imagingContent || '未選択'}</span>
          <ChevronDown className="w-3 h-3" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          <Input
            value={isEditing.imagingContent || ''}
            onChange={(e) => {
              const newContent = e.target.value;
              updateEditingValue(order.id, 'imagingContent', newContent);

              if (isEditing.bodyPartsList && isEditing.bodyPartsList.length > 0) {
                const updatedList = isEditing.bodyPartsList.map((part) => ({
                  ...part,
                  imagingContent: newContent,
                }));
                updateEditingValue(order.id, 'bodyPartsList', updatedList);
              }
            }}
            placeholder="撮影内容を入力してください"
            className="h-8 text-xs bg-white mt-1"
          />

          {/* プリセット候補 */}
          {isEditing.bodyPart && IMAGING_PRESETS[isEditing.bodyPart] && (
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">プリセット</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {IMAGING_PRESETS[isEditing.bodyPart].map((preset) => (
                  <Badge
                    key={preset}
                    variant="outline"
                    className="cursor-pointer text-xs hover:bg-blue-100"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* 造影剤使用 - CT、MRI、透視検査の場合のみ表示 */}
      {(isEditing.modality === 'CT検査' || isEditing.modality === 'MRI検査' || isEditing.modality === '透視検査') && (
        <Collapsible open={openSections.contrast} onOpenChange={(open) => setOpenSections(prev => ({ ...prev, contrast: open }))}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
            <span className="text-xs">造影剤使用: {isEditing.useContrast ? 'あり' : 'なし'}</span>
            <ChevronDown className="w-3 h-3" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`contrast-use-${order.id}`}
                checked={isEditing.useContrast || false}
                onCheckedChange={(checked) => {
                  updateEditingValue(order.id, 'useContrast', checked);
                  if (checked && !isEditing.egfrValue) {
                    // TODO: 患者の検査値データから eGFR を自動取得する（現在はデフォルト値なし）
                  }
                  if (!checked) {
                    setOpenSections(prev => ({ ...prev, contrast: false }));
                  }
                }}
              />
              <label htmlFor={`contrast-use-${order.id}`} className="text-xs cursor-pointer">
                造影剤使用
              </label>
            </div>

            {isEditing.useContrast && (
              <div className={NESTED_CONTENT_CLASSES}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`contrast-allergy-${order.id}`}
                    checked={isEditing.hasAllergy || false}
                    onCheckedChange={(checked) => updateEditingValue(order.id, 'hasAllergy', checked)}
                  />
                  <label htmlFor={`contrast-allergy-${order.id}`} className="text-xs cursor-pointer">
                    造影剤アレルギーあり
                  </label>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">eGFR値（ml/min/1.73㎡）</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={isEditing.egfrValue || ''}
                    onChange={(e) => updateEditingValue(order.id, 'egfrValue', e.target.value)}
                    onBlur={() => {
                      if (isEditing.egfrValue) {
                        setOpenSections(prev => ({ ...prev, contrast: false }));
                      }
                    }}
                    placeholder="eGFR値を入力"
                    className="h-8 text-xs bg-white mt-1"
                  />
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* 機能条件 */}
      <Collapsible open={openSections.functionalConditions} onOpenChange={(open) => setOpenSections(prev => ({ ...prev, functionalConditions: open }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
          <span className="text-xs">機能条件: {isEditing.functionalConditions?.join(', ') || '未入力'}</span>
          <ChevronDown className="w-3 h-3" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <label className="text-xs text-muted-foreground mb-2 block">機能条件</label>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {['造影剤使用', '経時', '食事制限', '絶食', '排尿後'].map((condition) => (
              <Badge
                key={condition}
                variant={isEditing.functionalConditions?.includes(condition) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => {
                  const current = isEditing.functionalConditions || [];
                  const updated = current.includes(condition) ? current.filter((c) => c !== condition) : [...current, condition];
                  updateEditingValue(order.id, 'functionalConditions', updated);
                }}
              >
                {condition}
              </Badge>
            ))}
          </div>
          <Input
            value={isEditing.functionalConditions?.join('、') || ''}
            onChange={(e) => {
              const conditions = e.target.value.split('、').filter(Boolean);
              updateEditingValue(order.id, 'functionalConditions', conditions);
            }}
            placeholder="機能条件を入力してください"
            className="h-8 text-xs bg-white"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* 特別指示 */}
      <Collapsible open={openSections.specialInstructions} onOpenChange={(open) => setOpenSections(prev => ({ ...prev, specialInstructions: open }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
          <span className="text-xs">特別指示: {isEditing.specialInstructions || '未入力'}</span>
          <ChevronDown className="w-3 h-3" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground">特別指示</label>
            <Badge
              variant="outline"
              className="cursor-pointer text-xs"
              onClick={() => {
                // 今後Myコメント選択ダイアログを表示する処理を追加
              }}
            >
              Myコメント
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {['立位撮影', '放射線被ばく', '呼吸法保持', '造影剤は放射線後等'].map((instruction) => (
              <Badge
                key={instruction}
                variant="outline"
                className="cursor-pointer text-xs"
                onClick={() => {
                  const current = isEditing.specialInstructions || '';
                  const instructions = current.split('、').filter(Boolean);
                  const updated = instructions.includes(instruction)
                    ? instructions.filter((i) => i !== instruction).join('、')
                    : [...instructions, instruction].join('、');
                  updateEditingValue(order.id, 'specialInstructions', updated);
                }}
              >
                {instruction}
              </Badge>
            ))}
          </div>
          <Input
            value={isEditing.specialInstructions || ''}
            onChange={(e) => updateEditingValue(order.id, 'specialInstructions', e.target.value)}
            placeholder="特別な指示を全て確認してください"
            className="h-8 text-xs bg-white"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* 緊急度 */}
      <Collapsible open={openSections.priority} onOpenChange={(open) => setOpenSections(prev => ({ ...prev, priority: open }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
          <span className="text-xs">
            緊急度: {isEditing.priority === 'urgent' ? '至急' : isEditing.priority === 'stat' ? '緊急' : '通常'}
          </span>
          <ChevronDown className="w-3 h-3" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <label className="text-xs text-muted-foreground">緊急度</label>
          <RadioGroup
            value={isEditing.priority || 'normal'}
            onValueChange={(value) => {
              updateEditingValue(order.id, 'priority', value);
              setOpenSections(prev => ({ ...prev, priority: false }));
            }}
            className="flex items-center gap-4 mt-1"
          >
            <div className="flex items-center gap-1.5">
              <RadioGroupItem value="normal" id={`priority-normal-${order.id}`} className={RADIO_ITEM_CLASSES} />
              <Label htmlFor={`priority-normal-${order.id}`} className="text-xs cursor-pointer">通常</Label>
            </div>
            <div className="flex items-center gap-1.5">
              <RadioGroupItem value="urgent" id={`priority-urgent-${order.id}`} className={RADIO_ITEM_CLASSES} />
              <Label htmlFor={`priority-urgent-${order.id}`} className="text-xs cursor-pointer">至急</Label>
            </div>
            <div className="flex items-center gap-1.5">
              <RadioGroupItem value="stat" id={`priority-stat-${order.id}`} className={RADIO_ITEM_CLASSES} />
              <Label htmlFor={`priority-stat-${order.id}`} className="text-xs cursor-pointer">緊急</Label>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* 希望時間帯 */}
      <Collapsible open={openSections.preferredTime} onOpenChange={(open) => setOpenSections(prev => ({ ...prev, preferredTime: open }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
          <span className="text-xs">
            {isEditing?.dateUndecided
              ? `実施予定日: ${['CT検査', 'MRI検査', '超音波検査'].includes(isEditing.modality || '') ? '枠未取得' : '日付未定'}`
              : `希望時間帯: ${isEditing.preferredTimeSlots?.join(', ') || '未選択'}`}
          </span>
          <ChevronDown className="w-3 h-3" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          <ImagingVisitDateInput
            scheduledDate={isEditing.scheduledDate || new Date().toISOString().split('T')[0]}
            dateUndecided={isEditing.dateUndecided || false}
            onScheduledDateChange={(date) => updateEditingValue(order.id, 'scheduledDate', date)}
            onDateUndecidedChange={(undecided) => updateEditingValue(order.id, 'dateUndecided', undecided)}
            modality={isEditing.modality}
          />

          {!isEditing.dateUndecided && (
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">希望時間帯</label>
              <RadioGroup
                value={isEditing.preferredTimeSlots?.[0] || ''}
                onValueChange={(value) => {
                  updateEditingValue(order.id, 'preferredTimeSlots', value ? [value] : []);
                }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="即時" id={`timeslot-immediate-${order.id}`} className={RADIO_ITEM_CLASSES} />
                  <Label htmlFor={`timeslot-immediate-${order.id}`} className="text-xs cursor-pointer">
                    即時
                  </Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="午前" id={`timeslot-morning-${order.id}`} className={RADIO_ITEM_CLASSES} />
                  <Label htmlFor={`timeslot-morning-${order.id}`} className="text-xs cursor-pointer">
                    午前
                  </Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="午後" id={`timeslot-afternoon-${order.id}`} className={RADIO_ITEM_CLASSES} />
                  <Label htmlFor={`timeslot-afternoon-${order.id}`} className="text-xs cursor-pointer">
                    午後
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button size="sm" variant="secondary" onClick={() => handleCancel(order.id)} className="h-7 px-3 text-xs">
          <X className="w-3 h-3 mr-1" />
          キャンセル
        </Button>
        <Button size="sm" onClick={() => handleSave(order)} className="h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs">
          <Check className="w-3 h-3 mr-1" />
          保存
        </Button>
      </div>
    </div>
  );
}
