'use client';

/**
 * オーダー種別ごとの表示セクション
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/OrderTypeSection.tsx
 */

import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Badge } from '@/shared/components/atoms/badge';
import { OrderListItem } from '../organisms/OrderListItem';
import type { OrderDetail, EditingOrderData } from '../../types/order-shared.types';
import { formatOrderDisplay } from '../../utils/orderFormatters';

interface OrderTypeSectionProps {
  orderType: string;
  orders: OrderDetail[];
  grouped: { [key: string]: OrderDetail[] };
  ungrouped: OrderDetail[];
  editingOrders: Record<string, EditingOrderData>;
  expandedImagingOrders: Record<string, boolean>;
  orderNotes: Record<string, string>;
  frequencyOptions: string[];
  timingOptions: string[];
  openGroups: { [key: string]: boolean };
  editingGroups: { [key: string]: boolean };
  groupNotes: { [key: string]: string };
  groupPriority: { [key: string]: string };
  onAddNewOrder?: () => void;
  onEdit: (order: OrderDetail) => void;
  onEditImagingOrder?: (order: OrderDetail) => void;
  onSave: (order: OrderDetail) => void;
  onCancel: (orderId: string) => void;
  onRemove: (orderId: string) => void;
  onNavigateToExamination?: (orderId: string) => void;
  onExpandedChange: (orderId: string, expanded: boolean) => void;
  updateEditingValue: (orderId: string, field: string, value: any) => void;
  setOpenGroups: (setter: (prev: { [key: string]: boolean }) => { [key: string]: boolean }) => void;
  setEditingGroups: (setter: (prev: { [key: string]: boolean }) => { [key: string]: boolean }) => void;
  setGroupNotes: (setter: (prev: { [key: string]: string }) => { [key: string]: string }) => void;
  setGroupPriority: (setter: (prev: { [key: string]: string }) => { [key: string]: string }) => void;
  getOrderTypeBadgeColor: (orderType: string) => string;
  getOrderTypeLabel: (orderType: string) => string;
  getGroupTypeBadge: (groupType: string | undefined, groupId: string) => { label: string } | null;
  renderGroupCollapsible: (groupId: string, groupOrders: OrderDetail[]) => React.ReactNode;
}

export function OrderTypeSection({
  orderType,
  orders,
  grouped,
  ungrouped,
  editingOrders,
  expandedImagingOrders,
  orderNotes,
  frequencyOptions,
  timingOptions,
  onAddNewOrder,
  onEdit,
  onEditImagingOrder,
  onSave,
  onCancel,
  onRemove,
  onNavigateToExamination,
  onExpandedChange,
  updateEditingValue,
  getOrderTypeBadgeColor,
  getOrderTypeLabel,
  renderGroupCollapsible
}: OrderTypeSectionProps) {
  if (orders.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={getOrderTypeBadgeColor(orderType)}>
            {getOrderTypeLabel(orderType)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {orders.length}件
          </span>
          <div className="flex-1"></div>
          {onAddNewOrder && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddNewOrder()}
              className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
              title="新規オーダーを追加"
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(grouped).map(([groupId, groupOrders]) => {
          if (groupOrders.length === 0) return null;
          return renderGroupCollapsible(groupId, groupOrders);
        })}

        {ungrouped.map((order) => (
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
    </div>
  );
}
