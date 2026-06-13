import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/atoms/dialog';
import { Label } from '@/shared/components/atoms/label';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { OrderTypeBadge } from '@/shared/components/atoms/left-sidemenu/OrderTypeBadge';
import type { OrderItemResponse } from '@/front_bff_shared/features/ui-common/left-sidemenu/order-sets/types/responses/order-sets.response';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.globalMenuNav.addMySetDialog;

interface AddMySetDialogProps {
  newSetName: string;
  selectedItems: string[];
  availableOrders: OrderItemResponse[];
  onSetNameChange: (name: string) => void;
  onItemToggle: (itemName: string, checked: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function AddMySetDialog({
  newSetName,
  selectedItems,
  availableOrders,
  onSetNameChange,
  onItemToggle,
  onSave,
  onCancel,
}: AddMySetDialogProps) {
  return (
    <DialogContent className="max-w-2xl max-h-[80vh]">
      <DialogHeader>
        <DialogTitle>{t.title}</DialogTitle>
        <DialogDescription>
          {t.description}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="set-name" className="text-sm mb-2 block">
            {t.setNameLabel} <span className="text-destructive">{t.required}</span>
          </Label>
          <Input
            id="set-name"
            value={newSetName}
            onChange={(e) => onSetNameChange(e.target.value)}
            placeholder={t.setNamePlaceholder}
          />
        </div>
        <div>
          <Label className="text-sm mb-2 block">{t.orderSelectLabel}</Label>
          <div className="border rounded-lg p-2 max-h-[40vh] overflow-y-auto space-y-2">
            {availableOrders.map((order) => (
              <div key={order.id} className="flex items-center space-x-2">
                <Checkbox
                  id={order.id}
                  checked={selectedItems.includes(order.name)}
                  onCheckedChange={(checked) => onItemToggle(order.name, checked as boolean)}
                />
                <label
                  htmlFor={order.id}
                  className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                >
                  <span>{order.name}</span>
                  <OrderTypeBadge type={order.type} />
                </label>
              </div>
            ))}
          </div>
        </div>
        {selectedItems.length > 0 && (
          <div>
            <Label className="text-sm mb-2 block">{t.selectedLabel(selectedItems.length)}</Label>
            <div className="flex flex-wrap gap-1 p-2 border rounded-lg max-h-[10vh] overflow-y-auto">
              {selectedItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            {t.cancelBtn}
          </Button>
          <Button
            onClick={onSave}
            disabled={!newSetName || selectedItems.length === 0}
          >
            {t.saveBtn}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
