'use client';

import { Dialog, DialogContent, DialogClose, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';
import { Pill, X } from 'lucide-react';
import { i18n } from '@/shared/i18n';
import type { OrderTypeViewModel } from '../../types/order-confirm.types';
import { ORDER_TYPES } from '../../types/orderTypes';

interface OrderTypeSelectDialogProps {
  open: boolean;
  orderTypes: OrderTypeViewModel[];
  onSelect: (orderType: OrderTypeViewModel) => void;
  onClose: () => void;
}

export function OrderTypeSelectDialog({
  open,
  orderTypes,
  onSelect,
  onClose,
}: OrderTypeSelectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="flex items-center gap-2" data-ui-id="DLG02_LBL_TITLE">
                <Pill className="w-5 h-5 text-medical-primary" />
                {i18n.orders.orderConfirmation.orderInputTabs.selectOrderType}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {i18n.orders.orderConfirmation.orderInputTabs.selectOrderTypeDesc}
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button size="sm" variant="outline" className="flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-4 h-4 mr-2" />
                {i18n.orders.orderConfirmation.orderInputTabs.cancel}
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 py-4">
          {orderTypes.map((ot) => {
            const config = ORDER_TYPES[ot.id as keyof typeof ORDER_TYPES];
            const Icon = config?.icon;
            const textColor = config?.textColor ?? 'text-gray-600';

            return (
              <Button
                key={ot.id}
                variant="outline"
                className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity h-auto! py-3!"
                data-ui-id="DLG02_BTN_ORDER"
                onClick={() => onSelect(ot)}
              >
                {Icon && <Icon className={`w-8 h-8 ${textColor}`} />}
                <span className="text-sm font-medium">{ot.name}</span>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
