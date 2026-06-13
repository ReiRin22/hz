'use client';

import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { SpecimenOrderItemRow } from '../molecules/SpecimenOrderItemRow';
import { SpecimenOrderConfirmButton } from '../molecules/SpecimenOrderConfirmButton';
import type { SpecimenOrderFormItem, ConfirmedSpecimenOrder } from '../../types/specimen-order-entry.type';
import { ja } from '@/shared/i18n/ja';

export interface SpecimenConfirmPanelProps {
  selectedItems: SpecimenOrderFormItem[];
  onRemoveItem: (orderCode: string) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  isConfirmEnabled?: boolean;
  confirmedOrders?: ConfirmedSpecimenOrder[];
}

export function SpecimenConfirmPanel({
  selectedItems,
  onRemoveItem,
  onConfirm,
  isLoading = false,
  isConfirmEnabled = false,
  confirmedOrders,
}: SpecimenConfirmPanelProps) {
  if (confirmedOrders && confirmedOrders.length > 0) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <div className="text-sm font-medium text-green-700">{ja.orders.specimenOrderEntry.confirmPanel.confirmed}</div>
        <div className="space-y-1.5">
          {confirmedOrders.map((order) => (
            <div key={order.id} className="text-xs border border-green-200 rounded-md px-3 py-2 bg-green-50">
              <span className="font-medium">{order.testName}</span>
              <span className="ml-2 text-muted-foreground">{order.id}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-sm font-medium">{ja.orders.specimenOrderEntry.confirmPanel.header(selectedItems.length)}</div>

      {selectedItems.length > 0 ? (
        <ScrollArea className="max-h-64">
          <div className="space-y-1.5">
            {selectedItems.map((item) => (
              <SpecimenOrderItemRow key={item.id} item={item} onRemove={onRemoveItem} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-xs text-muted-foreground py-4 text-center">
          {ja.orders.specimenOrderEntry.confirmPanel.empty}
        </div>
      )}

      <SpecimenOrderConfirmButton
        onClick={onConfirm}
        isLoading={isLoading}
        disabled={!isConfirmEnabled}
      />
    </div>
  );
}
