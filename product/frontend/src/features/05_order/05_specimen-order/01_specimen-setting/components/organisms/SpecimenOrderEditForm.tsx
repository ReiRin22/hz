'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, CalendarIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/atoms/collapsible';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { RadioGroup, RadioGroupItem } from '@/shared/components/atoms/radio-group';
import { Label } from '@/shared/components/atoms/label';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { Badge } from '@/shared/components/atoms/badge';
import { DatePickerCalendar } from '@/shared/components/atoms/date-picker-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { getSpecimenItems } from '../../api/specimenOrderApi';
import { toSpecimenType, toOrderPriority } from '../../hooks/useSpecimenPanelData';
import type { SpecimenItemResponse } from '@/front_bff_shared/features/order/specimen-order/specimen-orders/types/responses/specimen-orders.response';
import type { SpecimenOrderFormItem, OrderPriority } from '../../types/specimen-order-entry.type';

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDateJa(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${y}/${m}/${d}`;
}

export interface SpecimenOrderEditFormProps {
  onAddItems: (items: Omit<SpecimenOrderFormItem, 'id'>[]) => void;
  onRemoveItem?: (orderCode: string) => void;
  onCancel?: () => void;
  addedOrderCodes?: string[];
}

export function SpecimenOrderEditForm({ onAddItems, onRemoveItem, onCancel, addedOrderCodes = [] }: SpecimenOrderEditFormProps) {
  const [allItems, setAllItems] = useState<SpecimenItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [checkedCodes, setCheckedCodes] = useState<Set<string>>(new Set());
  const [priority, setPriority] = useState<OrderPriority>('normal');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [openPriority, setOpenPriority] = useState(false);
  const [openSpecialInstructions, setOpenSpecialInstructions] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>(toDateString(new Date()));
  const [dateUndecided, setDateUndecided] = useState(false);
  const [openScheduledDate, setOpenScheduledDate] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    getSpecimenItems()
      .then((res) => {
        setAllItems(res.items);
        // 最初のカテゴリを開いた状態にする
        const firstCategory = res.items[0]?.category;
        if (firstCategory) setOpenCategories({ [firstCategory]: true });
      })
      .catch(() => setFetchError('検体項目の取得に失敗しました。'))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = Array.from(new Set(allItems.map((item) => item.category)));

  const toggleCode = (code: string) => {
    setCheckedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleAdd = () => {
    const toAdd = allItems
      .filter((item) => checkedCodes.has(item.code))
      .map((item) => ({
        specimenType: toSpecimenType(item.specimenType),
        orderCode: item.code,
        testName: item.name,
        category: item.category,
        priority,
        specialInstructions: specialInstructions || undefined,
        scheduledDate: dateUndecided ? undefined : scheduledDate,
      }));
    if (toAdd.length === 0) return;
    onAddItems(toAdd);
    setCheckedCodes(new Set());
    setSpecialInstructions('');
    setScheduledDate(toDateString(new Date()));
    setDateUndecided(false);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 space-y-2">

      {isLoading && <p className="text-xs text-muted-foreground">読み込み中...</p>}
      {fetchError && <p className="text-xs text-destructive">{fetchError}</p>}

      {/* カテゴリ別項目一覧 */}
      {categories.map((category) => (
        <Collapsible
          key={category}
          open={openCategories[category] ?? false}
          onOpenChange={(open) => setOpenCategories((prev) => ({ ...prev, [category]: open }))}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              {category}
              {(() => {
                const addedCount = allItems.filter((i) => i.category === category && addedOrderCodes.includes(i.code)).length;
                const checkedCount = allItems.filter((i) => i.category === category && checkedCodes.has(i.code)).length;
                const total = addedCount + checkedCount;
                return total > 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 font-medium">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white font-bold">{total}</span>
                    選択中
                  </span>
                ) : null;
              })()}
            </span>
            <ChevronDown className="w-3 h-3" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-1">
            <div className="grid grid-cols-3 gap-1 bg-white border border-border rounded p-2">
              {allItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <label
                    key={item.code}
                    className="flex items-center gap-1.5 p-1 rounded transition-colors cursor-pointer hover:bg-blue-50"
                  >
                    <Checkbox
                      checked={addedOrderCodes.includes(item.code) || checkedCodes.has(item.code)}
                      onCheckedChange={() => {
                        if (addedOrderCodes.includes(item.code)) {
                          onRemoveItem?.(item.code);
                        } else {
                          toggleCode(item.code);
                        }
                      }}
                    />
                    <span className="text-xs">{item.name}</span>
                  </label>
                ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* 選択中バッジ */}
      {checkedCodes.size > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-1">
          <span className="text-xs text-muted-foreground shrink-0">選択項目：</span>
          {Array.from(checkedCodes).map((code) => {
            const item = allItems.find((i) => i.code === code);
            return item ? (
              <Badge key={code} variant="secondary" className="text-xs gap-1">
                {item.name}
                <button onClick={() => toggleCode(code)} className="ml-0.5 hover:text-destructive">×</button>
              </Badge>
            ) : null;
          })}
        </div>
      )}

      {/* 緊急度 */}
      <Collapsible open={openPriority} onOpenChange={setOpenPriority}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
          <span className="text-xs font-medium">緊急度: {priority === 'urgent' ? '至急' : '通常'}</span>
          <ChevronDown className="w-3 h-3" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <RadioGroup
            value={priority}
            onValueChange={(v) => {
              const parsed = toOrderPriority(v);
              if (parsed) { setPriority(parsed); setOpenPriority(false); }
            }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-1.5">
              <RadioGroupItem value="normal" id="priority-normal" />
              <Label htmlFor="priority-normal" className="text-xs cursor-pointer">通常</Label>
            </div>
            <div className="flex items-center gap-1.5">
              <RadioGroupItem value="urgent" id="priority-urgent" />
              <Label htmlFor="priority-urgent" className="text-xs cursor-pointer">至急</Label>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* 検査実施予定日 */}
      <Collapsible open={openScheduledDate} onOpenChange={setOpenScheduledDate}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
          <span className="text-xs font-medium">
            検査実施予定日: {dateUndecided ? '未定' : formatDateJa(scheduledDate)}
          </span>
          <ChevronDown className="w-3 h-3" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 px-1">
          <div className="flex items-center gap-2">
            <Popover open={datePickerOpen} onOpenChange={(open) => { if (!dateUndecided) setDatePickerOpen(open); }}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 gap-1.5 text-xs font-normal"
                  disabled={dateUndecided}
                >
                  {dateUndecided ? '未定' : formatDateJa(scheduledDate)}
                  <CalendarIcon className="w-3 h-3 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                <DatePickerCalendar
                  selected={new Date(scheduledDate + 'T00:00:00')}
                  onSelect={(date) => {
                    if (date) {
                      setScheduledDate(toDateString(date));
                      setDatePickerOpen(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <Checkbox
                checked={dateUndecided}
                onCheckedChange={(checked) => {
                  setDateUndecided(checked === true);
                  setDatePickerOpen(false);
                }}
              />
              <span className="text-xs">日付未定</span>
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 特記事項 */}
      <Collapsible open={openSpecialInstructions} onOpenChange={setOpenSpecialInstructions}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-1 hover:bg-blue-100 rounded px-1">
          <span className="text-xs font-medium">特記事項: {specialInstructions || '未入力'}</span>
          <ChevronDown className="w-3 h-3" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <Input
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="特記事項を入力（任意）"
            className="h-8 text-xs bg-white"
          />
        </CollapsibleContent>
      </Collapsible>

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="h-7 px-3 text-xs"
          >
            キャンセル
          </Button>
        )}
        <Button
          size="sm"
          disabled={checkedCodes.size === 0}
          onClick={handleAdd}
          className="h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs"
        >
          選択項目を追加（{checkedCodes.size}件）
        </Button>
      </div>
    </div>
  );
}
