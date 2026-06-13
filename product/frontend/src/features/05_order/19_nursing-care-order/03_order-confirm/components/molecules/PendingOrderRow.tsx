'use client';

import { Button } from '@/shared/components/atoms/button';
import { Badge } from '@/shared/components/atoms/badge';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { i18n } from '@/shared/i18n';
import type { PendingOrderViewModel } from '../../types/order-confirm.types';
import { ORDER_TYPES } from '../../types/orderTypes';

interface PendingOrderRowProps {
  order: PendingOrderViewModel;
  onEdit: (orderId: string) => void;
  onDelete: (orderId: string) => void;
}

export function PendingOrderRow({ order, onEdit, onDelete }: PendingOrderRowProps) {
  const typeConfig = ORDER_TYPES[order.type];
  if (!typeConfig) return null;

  const Icon = typeConfig.icon;

  return (
    <div className="p-3 rounded-lg border space-y-1.5 transition-colors bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600" data-ui-id="ROW_PENDING_ORDER">
      {/* ヘッダー行 */}
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded text-white flex-shrink-0 ${typeConfig.color}`}>
          <Icon className="w-3 h-3" />
        </div>
        <Badge variant="secondary" className={`text-xs flex-shrink-0 ${typeConfig.textColor}`} data-ui-id="COL_ORDER_TYPE">
          {typeConfig.label}
        </Badge>
        <span className="text-xs font-medium text-foreground flex-1" title={order.typeName}>
          {order.typeName}
        </span>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
            data-ui-id="BTN_EDIT_PENDING"
            onClick={() => onEdit(order.id)}
            title={i18n.orders.orderConfirmation.orderItem.editTitle}
          >
            <Pencil className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
            data-ui-id="BTN_DELETE_PENDING"
            onClick={() => onDelete(order.id)}
            title={i18n.orders.orderConfirmation.orderItem.deleteTitle}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* 詳細情報 */}
      <div className="ml-7 space-y-0.5 text-xs text-muted-foreground">
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
            <span>{order.scheduledAt}</span>
          </div>
        )}
      </div>
    </div>
  );
}
