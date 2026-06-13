'use client';

import { Button } from '@/shared/components/atoms/button';
import { Badge } from '@/shared/components/atoms/badge';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { i18n } from '@/shared/i18n';
import type { ConfirmedOrderViewModel } from '../../types/order-confirm.types';
import { ORDER_TYPES } from '../../types/orderTypes';
import { getDeptStatusLabel, getDeptStatusBadgeVariant } from '@/shared/utils/deptInstructionStatus';

interface ConfirmedOrderRowProps {
  order: ConfirmedOrderViewModel;
  onEdit: (orderId: string) => void;
  onRevoke: (orderId: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  ordered:      { label: i18n.orders.orderConfirmation.orderItem.orderStatus.ordered,    cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  accepted:     { label: i18n.orders.orderConfirmation.orderItem.orderStatus.accepted,   cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  'in-progress':{ label: i18n.orders.orderConfirmation.orderItem.orderStatus.inProgress, cls: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  completed:    { label: i18n.orders.orderConfirmation.orderItem.orderStatus.completed,  cls: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
};


export function ConfirmedOrderRow({ order, onEdit, onRevoke }: ConfirmedOrderRowProps) {
  const typeConfig = ORDER_TYPES[order.type];
  if (!typeConfig) return null;

  const Icon = typeConfig.icon;
  const isCancelled = order.isRevoked;
  const strikeClass = isCancelled ? 'line-through' : '';
  const statusConfig = STATUS_CONFIG[order.status];

  return (
    <div className={`p-3 rounded-lg border space-y-1.5 transition-colors bg-cyan-50/60 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800 hover:border-cyan-300 dark:hover:border-cyan-600 ${isCancelled ? 'opacity-50' : ''}`} data-ui-id="ROW_CONFIRMED_ORDER">
      {/* ヘッダー行 */}
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded text-white flex-shrink-0 ${typeConfig.color}`}>
          <Icon className="w-3 h-3" />
        </div>
        <Badge variant="secondary" className={`text-xs flex-shrink-0 ${typeConfig.textColor} ${strikeClass}`} data-ui-id="COL_ORDER_TYPE">
          {typeConfig.label}
        </Badge>
        <span className={`text-xs font-medium text-foreground flex-1 ${strikeClass}`} title={order.typeName}>
          {order.typeName}
        </span>

        {/* ステータスバッジ */}
        {statusConfig && (
          <Badge variant="outline" className={`text-xs flex-shrink-0 ${statusConfig.cls} ${strikeClass}`} data-ui-id="LBL_STATUS">
            {statusConfig.label}
          </Badge>
        )}

        {/* DEP002部門指示受けステータスバッジ */}
        {order.deptInstructionStatus && (
          <Badge variant={getDeptStatusBadgeVariant(order.deptInstructionStatus)} className={`text-xs flex-shrink-0 ${strikeClass}`} data-ui-id="LBL_DEPT_STATUS">
            {getDeptStatusLabel(order.deptInstructionStatus)}
          </Badge>
        )}

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
            data-ui-id="BTN_EDIT_CONFIRMED"
            onClick={() => onEdit(order.id)}
            disabled={isCancelled}
            title={i18n.orders.orderConfirmation.orderItem.editTitle}
          >
            <Pencil className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={isCancelled ? 'h-6 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950' : 'h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950'}
            data-ui-id="BTN_DELETE_CONFIRMED"
            onClick={() => onRevoke(order.id)}
            disabled={isCancelled}
            title={i18n.orders.orderConfirmation.orderItem.cancelTitle}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* 詳細情報 */}
      <div className={`ml-7 space-y-0.5 text-xs text-muted-foreground ${strikeClass}`}>
        {order.detail && (
          <div className="mt-1 text-xs text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20 rounded p-1.5">{order.detail}</div>
        )}

        {order.specimenSubItems && order.specimenSubItems.length > 0 && (
          <div className="mt-2 space-y-1 border-t border-border pt-2" data-ui-id="LIST_SPECIMEN_SUB_ITEMS">
            {order.specimenSubItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{item.testName}</span>
                <span className="text-muted-foreground">({item.orderCode})</span>
                {item.priority === 'urgent' && (
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 bg-orange-50">
                    <AlertTriangle className="w-3 h-3 mr-0.5" />
                    至急
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {order.scheduledAt && (
          <div className="flex items-center gap-1 text-green-700 dark:text-green-400" data-ui-id="LBL_SCHEDULED_AT">
            <span className="font-medium text-gray-600 dark:text-gray-400">{i18n.orders.orderConfirmation.orderItem.fields.scheduledAt}</span>
            <span>{order.scheduledAt.slice(0, 10)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
