'use client';

/**
 * グループ化されたオーダーの折りたたみ表示
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/OrderGroupCollapsible.tsx
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Calendar, Trash2, Check, X, CalendarIcon } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Badge } from '@/shared/components/atoms/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Label } from '@/shared/components/atoms/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/atoms/collapsible';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { DatePickerCalendar } from '@/shared/components/atoms/date-picker-calendar';

function toDateString(date: Date) { return date.toISOString().slice(0, 10); }
function formatDateJa(s: string) { const [y, m, d] = s.split('-'); return `${y}/${m}/${d}`; }
import { OrderListItem } from '../organisms/OrderListItem';
import type { OrderDetail, EditingOrderData } from '../../types/order-shared.types';
import { formatOrderDisplay } from '../../utils/orderFormatters';

export interface OrderGroupCollapsibleProps {
  groupId: string;
  groupOrders: OrderDetail[];
  isGroupOpen: boolean;
  editingGroups: { [key: string]: boolean };
  groupPriority: { [key: string]: string };
  groupNotes: { [key: string]: string };
  editingOrders: Record<string, EditingOrderData>;
  expandedImagingOrders: { [key: string]: boolean };
  orderNotes: { [key: string]: string };
  frequencyOptions: string[];
  timingOptions: string[];
  onOpenChange: (open: boolean) => void;
  onEditGroup: () => void;
  onSaveGroup: () => void;
  onCancelGroup: () => void;
  onRemoveGroup: () => void;
  onNavigateToExamination?: (orderId: string) => void;
  onEdit: (order: OrderDetail) => void;
  onEditImagingOrder?: (order: OrderDetail) => void;
  onSave: (order: OrderDetail) => void;
  onCancel: (orderId: string) => void;
  onRemove: (orderId: string) => void;
  onExpandedChange: (orderId: string, expanded: boolean) => void;
  updateEditingValue: (orderId: string, field: string, value: any) => void;
  setGroupPriority: (priority: string) => void;
  setGroupNotes: (notes: string) => void;
  getGroupTypeBadge: (groupType: string | undefined, groupId: string) => { label: string } | null;
  onUpdateGroupDate?: (groupId: string, date: string | undefined) => void;
}

export function OrderGroupCollapsible({
  groupId,
  groupOrders,
  isGroupOpen,
  editingGroups,
  groupPriority,
  groupNotes,
  editingOrders,
  expandedImagingOrders,
  orderNotes,
  frequencyOptions,
  timingOptions,
  onOpenChange,
  onEditGroup,
  onSaveGroup,
  onCancelGroup,
  onRemoveGroup,
  onNavigateToExamination,
  onEdit,
  onEditImagingOrder,
  onSave,
  onCancel,
  onRemove,
  onExpandedChange,
  updateEditingValue,
  setGroupPriority,
  setGroupNotes,
  getGroupTypeBadge,
  onUpdateGroupDate,
}: OrderGroupCollapsibleProps) {
  const firstOrder = groupOrders[0];

  const collectionDates = groupOrders
    .map(o => o.collectionDate)
    .filter(d => d !== undefined && d !== '');
  const uniqueDates = [...new Set(collectionDates)];
  const groupCollectionDate = uniqueDates.length === 1 ? uniqueDates[0] :
                             collectionDates.length > 0 ? collectionDates[0] : undefined;

  const [editDate, setEditDate] = useState(groupCollectionDate ?? toDateString(new Date()));
  const [editDateUndecided, setEditDateUndecided] = useState(!groupCollectionDate);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <Collapsible
      open={isGroupOpen}
      onOpenChange={onOpenChange}
      className="border-2 border-blue-300 rounded-lg bg-blue-50/50"
    >
      <div className="p-2 bg-blue-100/60 rounded-t-lg border-b-2 border-blue-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-blue-200"
              >
                {isGroupOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <span className="font-medium text-sm">
              {firstOrder.groupName || 'グループ'}
            </span>
            {(() => {
              const badgeInfo = getGroupTypeBadge(firstOrder.groupType, groupId);
              if (!badgeInfo) return null;
              return <Badge variant="outline" className="text-xs">{badgeInfo.label}</Badge>;
            })()}
            {groupId.startsWith('lab-specimen-') ? (
              <span className="text-xs text-blue-700 bg-blue-200 px-2 py-0.5 rounded">
                実施予定日: {groupCollectionDate ? formatDateJa(groupCollectionDate) : '未定'}
              </span>
            ) : groupCollectionDate ? (
              <span className="text-xs text-blue-700 bg-blue-200 px-2 py-0.5 rounded">
                採取日: {new Date(groupCollectionDate).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
              </span>
            ) : null}
            <span className="text-xs text-muted-foreground">
              ({groupOrders.length}件)
            </span>
            {groupPriority[groupId] && !editingGroups[groupId] && (
              <span className={`text-xs px-2 py-0.5 rounded ${
                groupPriority[groupId] === '緊急' ? 'bg-red-200 text-red-800 border border-red-400' :
                groupPriority[groupId] === '至急' ? 'bg-orange-200 text-orange-800 border border-orange-400' :
                'bg-gray-200 text-gray-800 border border-gray-400'
              }`}>
                {groupPriority[groupId] === '緊急' && '🚨 '}
                {groupPriority[groupId] === '至急' && '⚡ '}
                {groupPriority[groupId]}
              </span>
            )}
            {groupNotes[groupId] && !editingGroups[groupId] && (
              <span className="text-xs text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-300">
                📝
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onEditGroup}
              className={`h-6 w-6 p-0 ${editingGroups[groupId] ? 'text-amber-700 bg-amber-100' : 'text-amber-600 hover:text-amber-700 hover:bg-amber-100'}`}
              title="グループ編集"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            {onNavigateToExamination && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onNavigateToExamination(firstOrder.id)}
                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                title="検査予約画面へ"
              >
                <Calendar className="w-3 h-3" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onRemoveGroup}
              className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              title="グループを削除"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {!editingGroups[groupId] && groupNotes[groupId] && (
          <div className="px-3 py-2 bg-blue-50 border-t border-blue-200">
            <div className="text-xs text-red-700 whitespace-pre-wrap">
              {groupNotes[groupId]}
            </div>
          </div>
        )}

        {editingGroups[groupId] && (
          <div className="px-3 pb-2 pt-2 border-t border-blue-300 space-y-3">
            {groupId.startsWith('lab-specimen-') && (
              <div>
                <Label className="text-xs text-muted-foreground mb-1">検査実施予定日</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Popover open={datePickerOpen} onOpenChange={(open) => { if (!editDateUndecided) setDatePickerOpen(open); }}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 px-2 gap-1.5 text-xs font-normal" disabled={editDateUndecided}>
                        {editDateUndecided ? '未定' : formatDateJa(editDate)}
                        <CalendarIcon className="w-3 h-3 shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                      <DatePickerCalendar
                        selected={new Date(editDate + 'T00:00:00')}
                        onSelect={(date) => {
                          if (date) { setEditDate(toDateString(date)); setDatePickerOpen(false); }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <Checkbox
                      checked={editDateUndecided}
                      onCheckedChange={(checked) => { setEditDateUndecided(checked === true); setDatePickerOpen(false); }}
                    />
                    <span className="text-xs">日付未定</span>
                  </label>
                </div>
              </div>
            )}
            <div>
              <Label className="text-xs text-muted-foreground mb-1">緊急度</Label>
              <Select
                value={groupPriority[groupId] || '通常'}
                onValueChange={setGroupPriority}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="緊急度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="通常">通常</SelectItem>
                  <SelectItem value="至急">至急</SelectItem>
                  <SelectItem value="緊急">緊急</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1">指示コメント・特記事項</Label>
              <Textarea
                value={groupNotes[groupId] || ''}
                onChange={(e) => setGroupNotes(e.target.value)}
                placeholder="グループ全体への指示や特記事項を入力..."
                className="h-20 text-sm resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  if (groupId.startsWith('lab-specimen-')) {
                    onUpdateGroupDate?.(groupId, editDateUndecided ? undefined : editDate);
                  }
                  onSaveGroup();
                }}
                className="h-7 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                保存
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onCancelGroup}
                className="h-7 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                キャンセル
              </Button>
            </div>
          </div>
        )}
      </div>

      <CollapsibleContent>
        <div className="p-2 space-y-2">
          {(() => {
            if (groupId.startsWith('lab-category-')) {
              const ordersBySubcategory: { [key: string]: OrderDetail[] } = {};
              groupOrders.forEach((order) => {
                const subcatKey = order.subcategory || 'other';
                if (!ordersBySubcategory[subcatKey]) {
                  ordersBySubcategory[subcatKey] = [];
                }
                ordersBySubcategory[subcatKey].push(order);
              });

              return Object.entries(ordersBySubcategory).map(([subcatId, subOrders]) => (
                <div key={subcatId} className="space-y-2">
                  {subOrders[0].subcategoryName && (
                    <div className="text-xs text-muted-foreground px-1 mt-2 first:mt-0">
                      {subOrders[0].subcategoryName}
                    </div>
                  )}
                  {subOrders.map((order) => (
                    <OrderListItem
                      key={order.id}
                      order={order}
                      isEditing={editingOrders[order.id]}
                      editingOrders={editingOrders}
                      expandedImagingOrders={expandedImagingOrders}
                      orderNotes={orderNotes}
                      frequencyOptions={frequencyOptions}
                      timingOptions={timingOptions}
                      onEdit={onEdit}
                      onEditImagingOrder={onEditImagingOrder}
                      onSave={onSave}
                      onCancel={onCancel}
                      onRemove={onRemove}
                      onNavigateToExamination={onNavigateToExamination}
                      onExpandedChange={onExpandedChange}
                      updateEditingValue={updateEditingValue}
                      formatOrderDisplay={formatOrderDisplay}
                    />
                  ))}
                </div>
              ));
            } else {
              return groupOrders.map((order) => (
                <OrderListItem
                  key={order.id}
                  order={order}
                  isEditing={editingOrders[order.id]}
                  editingOrders={editingOrders}
                  expandedImagingOrders={expandedImagingOrders}
                  orderNotes={orderNotes}
                  frequencyOptions={frequencyOptions}
                  timingOptions={timingOptions}
                  onEdit={onEdit}
                  onEditImagingOrder={onEditImagingOrder}
                  onSave={onSave}
                  onCancel={onCancel}
                  onRemove={onRemove}
                  onNavigateToExamination={onNavigateToExamination}
                  onExpandedChange={onExpandedChange}
                  updateEditingValue={updateEditingValue}
                  formatOrderDisplay={formatOrderDisplay}
                />
              ));
            }
          })()}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
