'use client';

/**
 * オーダーリストアイテムコンポーネント
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-list/organisms/OrderListItem.tsx
 */

import { Pencil, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Textarea } from '@/shared/components/atoms/textarea';
import { ImagingOrderEditForm } from '@/features/05_order/08_imaging-order/01_imaging-setting/components/organisms/ImagingOrderEditForm';
import type { OrderDetail, EditingOrderData } from '../../types/order-shared.types';

export interface OrderListItemProps {
  order: OrderDetail;
  isEditing: EditingOrderData | undefined;
  editingOrders: Record<string, EditingOrderData>;
  expandedImagingOrders: Record<string, boolean>;
  orderNotes: Record<string, string>;
  frequencyOptions: string[];
  timingOptions: string[];
  onEdit: (order: OrderDetail) => void;
  onEditImagingOrder?: (order: OrderDetail) => void;
  onSave: (order: OrderDetail) => void;
  onCancel: (orderId: string) => void;
  onRemove: (orderId: string) => void;
  onNavigateToExamination?: (orderId: string) => void;
  onExpandedChange: (orderId: string, expanded: boolean) => void;
  updateEditingValue: (orderId: string, field: string, value: any) => void;
  formatOrderDisplay: (order: OrderDetail) => string;
}

export function OrderListItem({
  order,
  isEditing,
  editingOrders,
  expandedImagingOrders,
  orderNotes,
  frequencyOptions,
  timingOptions,
  onEdit,
  onEditImagingOrder,
  onSave,
  onCancel,
  onRemove,
  onNavigateToExamination,
  onExpandedChange,
  updateEditingValue,
  formatOrderDisplay
}: OrderListItemProps) {
  return (
    <div className="p-3 rounded border border-border bg-card">
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {order.type === 'prescription' && (
            <span className="text-sm font-medium text-primary">
              RP.{order.rpNumber}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isEditing ? (
            <>
              {order.type !== 'lab' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(order)}
                  className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700"
                >
                  <Pencil className="w-3 h-3" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemove(order.id)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </>
          ) : (
            order.type !== 'imaging' && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSave(order)}
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                >
                  <Check className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCancel(order.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </>
            )
          )}
        </div>
      </div>

      {/* オーダー内容 */}
      <div className="mb-2">
        {order.type === 'imaging' && !isEditing ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-sm font-medium">{order.examType || order.modality || order.name}</div>
              {order.priority && order.priority !== 'normal' && (
                <span className={
                  order.priority === 'urgent' ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300' :
                  order.priority === 'stat' ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-300' : ''
                }>
                  {order.priority === 'urgent' && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-orange-600" />}
                  {order.priority === 'stat' && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-red-600" />}
                  {order.priority === 'urgent' ? '至急' : order.priority === 'stat' ? '緊急' : ''}
                </span>
              )}
            </div>

            {order.bodyPartsList && order.bodyPartsList.length > 0 && (
              <div className="text-sm">
                {(order.bodyPartsList[0] as any)?.name && (
                  <div className="font-medium">{(order.bodyPartsList[0] as any).name}</div>
                )}
                {(() => {
                  const directions = Array.from(new Set(order.bodyPartsList.map((part: any) => part.direction).filter(Boolean)));
                  const positions = Array.from(new Set(order.bodyPartsList.map((part: any) => part.position).filter(Boolean)));
                  const parts = [];
                  if (directions.length > 0) parts.push(directions.join('・'));
                  if (positions.length > 0) parts.push(positions.join('・'));
                  return parts.length > 0 ? <div className="font-medium">{parts.join(' / ')}</div> : null;
                })()}
              </div>
            )}

            {order.imagingContent && (
              <div className="text-xs">
                <span className="text-muted-foreground">撮影内容: </span>
                <span className="font-medium">{order.imagingContent}</span>
              </div>
            )}

            {order.functionalConditions && order.functionalConditions.length > 0 && (
              <div className="text-xs">
                <span className="text-muted-foreground">撮影条件: </span>
                <span className="font-medium">{order.functionalConditions.join('、')}</span>
              </div>
            )}

            {order.specialInstructions && (
              <div className="px-2 py-1.5 bg-red-50 border border-red-200 rounded mt-1">
                <div className="text-xs">
                  <span className="text-red-600">⚠️ 特別指示:</span>
                  <div className="text-red-700 font-medium whitespace-pre-wrap mt-0.5">
                    {order.specialInstructions}
                  </div>
                </div>
              </div>
            )}

            {order.dateUndecided ? (
              <div className="text-xs mt-1">
                <span className="text-muted-foreground">実施予定日: </span>
                <span className="font-medium">
                  {['CT検査', 'MRI検査', '超音波検査'].includes(order.modality || '') ? '枠未取得' : '日付未定'}
                </span>
              </div>
            ) : (
              <div className="text-xs mt-1">
                <span className="text-muted-foreground">実施予定日: </span>
                <span className="font-medium">
                  {order.scheduledDate || '未定'}
                  {order.preferredTime === 'now' && ' (即時)'}
                  {order.preferredTime === 'morning' && ' (午前)'}
                  {order.preferredTime === 'afternoon' && ' (午後)'}
                  {order.preferredTime === 'specific' && order.scheduledTime && ` (${order.scheduledTime})`}
                </span>
              </div>
            )}
          </>
        ) : order.type !== 'imaging' && !isEditing && (
          <div className="text-sm font-medium">{order.name}</div>
        )}
        {!isEditing && order.notes && (
          <div className="text-xs text-muted-foreground mt-1">{order.notes}</div>
        )}
        {!isEditing && order.scheduledDates && order.scheduledDates.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            投与予定: {order.scheduledDates.join(', ')}
          </div>
        )}
      </div>

      {/* 特記事項メモ */}
      {!isEditing && orderNotes[order.id] && (
        <div className="mb-2 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded">
          <div className="text-xs text-red-700 whitespace-pre-wrap">
            {orderNotes[order.id]}
          </div>
        </div>
      )}

      {/* 表示・編集エリア */}
      {!isEditing ? (
        order.type !== 'imaging' && (
          <div className="text-sm text-muted-foreground">
            {formatOrderDisplay(order)}
          </div>
        )
      ) : (
        <div className="space-y-2">
          {order.type === 'imaging' && (
            <ImagingOrderEditForm
              order={order}
              isEditing={isEditing}
              updateEditingValue={updateEditingValue}
              handleSave={onSave}
              handleCancel={onCancel}
            />
          )}

          {order.type !== 'imaging' && (
            <div className="mt-3 pt-3 border-t border-border">
              <label className="text-xs text-muted-foreground mb-1 block">特記事項</label>
              <Textarea
                value={isEditing.notes || ''}
                onChange={(e) => updateEditingValue(order.id, 'notes', e.target.value)}
                placeholder="この項目への特記事項を入力..."
                className="h-16 text-xs resize-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
