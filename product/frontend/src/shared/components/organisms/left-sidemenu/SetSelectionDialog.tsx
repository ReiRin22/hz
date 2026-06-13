import { X, Plus } from 'lucide-react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/atoms/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Label } from '@/shared/components/atoms/label';
import { Button } from '@/shared/components/atoms/button';
import { SetCard } from '@/shared/components/molecules/left-sidemenu/SetCard';
import { OrderTypeKey, OrderSetType, AddSetOrdersPayload } from '@/shared/types/left-sidemenu/menu.types';
import type { SetDataResponse } from '@/front_bff_shared/features/ui-common/left-sidemenu/order-sets/types/responses/order-sets.response';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.globalMenuNav.setSelectionDialog;

interface SetSelectionDialogProps {
  activeSetTab: OrderSetType;
  selectedSetOrderType: OrderTypeKey;
  mySets: SetDataResponse[];
  compositeSets: SetDataResponse[];
  onSetTabChange: (tab: OrderSetType) => void;
  onOrderTypeChange: (type: OrderTypeKey) => void;
  onAddSetOrders?: (payload: AddSetOrdersPayload) => void;
  onClose: () => void;
  onAddMySet: () => void;
}

export function SetSelectionDialog({
  activeSetTab,
  selectedSetOrderType,
  mySets,
  compositeSets,
  onSetTabChange,
  onOrderTypeChange,
  onAddSetOrders,
  onClose,
  onAddMySet,
}: SetSelectionDialogProps) {
  return (
    <DialogContent className="max-w-2xl max-h-[80vh]">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>
              {t.description}
            </DialogDescription>
          </div>
          <div className="flex gap-2">
            {activeSetTab === 'my-set' && (
              <Button
                variant="default"
                size="sm"
                className="gap-1"
                onClick={onAddMySet}
              >
                <Plus className="h-4 w-4" />
                {t.addBtn}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              {t.closeBtn}
            </Button>
          </div>
        </div>
      </DialogHeader>
      <Tabs
        defaultValue="my-set"
        className="w-full"
        value={activeSetTab}
        onValueChange={(v) => onSetTabChange(v as OrderSetType)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-set">{t.mySetTab}</TabsTrigger>
          <TabsTrigger value="composite-set">{t.compositeSetTab}</TabsTrigger>
        </TabsList>
        <TabsContent value="my-set" className="mt-4">
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {mySets.map((set) => (
              <SetCard
                key={set.id}
                set={set}
                onClick={() => {
                  if (onAddSetOrders) {
                    onAddSetOrders({ id: set.id, name: set.name, items: set.items, type: 'my-set' });
                  }
                  onClose();
                }}
                badgeVariant="primary"
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="composite-set" className="mt-4">
          <div className="mb-4">
            <Label htmlFor="order-type-select" className="text-sm mb-2 block">{t.orderTypeLabel}</Label>
            <Select
              value={selectedSetOrderType}
              onValueChange={(v) => onOrderTypeChange(v as OrderTypeKey)}
            >
              <SelectTrigger id="order-type-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prescription">{t.prescriptionOption}</SelectItem>
                <SelectItem value="injection">{t.injectionOption}</SelectItem>
                <SelectItem value="lab">{t.labOption}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {compositeSets.map((set) => (
              <SetCard
                key={set.id}
                set={set}
                onClick={() => {
                  if (onAddSetOrders) {
                    onAddSetOrders({ id: set.id, name: set.name, items: set.items, type: 'composite-set' });
                  }
                  onClose();
                }}
                badgeVariant="secondary"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
