'use client';

import { useState, useCallback } from 'react';
import { FlaskConical, X } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { OrderPanel } from './OrderPanel';
import { ja } from '@/shared/i18n/ja';
import { useSpecimenSections } from '../../hooks/useSpecimenSections';
import { useSpecimenPanelData } from '../../hooks/useSpecimenPanelData';
import type { OrderDetail } from '../../types/order-shared.types';
import type { SpecimenOrderFormItem } from '../../types/specimen-order-entry.type';

function toOrderDetail(item: SpecimenOrderFormItem): OrderDetail {
  return {
    id: item.id,
    name: item.testName,
    type: 'lab',
    itemCode: item.orderCode,
    specimenType: item.specimenType,
    subcategoryName: item.category ?? item.specimenType,
    priority: item.priority,
    notes: item.specialInstructions,
    collectionDate: item.scheduledDate,
  };
}

export interface SpecimenOrderEntryOrganismProps {
  showSpecimenOrderPanel: boolean;
  onShowSpecimenOrderPanelChange: (show: boolean) => void;
  patientId: string;
  onAddToConfirmation?: (items: SpecimenOrderFormItem[]) => void;
  /** オーダー確定画面に追加済みの検査コード（グレーアウト用） */
  confirmedOrderCodes?: string[];
}

export function SpecimenOrderEntryOrganism({
  showSpecimenOrderPanel,
  onShowSpecimenOrderPanelChange,
  patientId,
  onAddToConfirmation,
  confirmedOrderCodes = [],
}: SpecimenOrderEntryOrganismProps) {
  const [activeSubTab, setActiveSubTab] = useState<'search' | 'history' | 'sets'>('sets');
  const [showSpecimenEditForm, setShowSpecimenEditForm] = useState(true);
  const { items, addItem, addSingleItem, removeItem, updateItem, clearItems } = useSpecimenSections({ confirmedOrderCodes });
  const { specimenSets, specimenHistory, selectedSetType, setSelectedSetType, isLoading, error } =
    useSpecimenPanelData(patientId, activeSubTab);

  const handleUpdateOrder = useCallback((order: OrderDetail) => {
    if (order.notes !== undefined && order.itemCode) {
      updateItem(order.itemCode, { specialInstructions: order.notes });
    }
  }, [updateItem]);

  const handleRemoveOrder = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) removeItem(item.orderCode);
  }, [items, removeItem]);

  const handleAddSpecimenItems = useCallback(
    (newItems: Omit<SpecimenOrderFormItem, 'id'>[]) => newItems.forEach(addSingleItem),
    [addSingleItem]
  );

  const handleAddToConfirmation = useCallback(() => {
    if (items.length === 0) return;
    onAddToConfirmation?.(items);
    clearItems();
    onShowSpecimenOrderPanelChange(false);
  }, [items, onAddToConfirmation, clearItems, onShowSpecimenOrderPanelChange]);

  // lab-specimen-{category} グループの全アイテムの scheduledDate をまとめて更新
  const handleUpdateGroupDate = useCallback((groupId: string, date: string | undefined) => {
    const category = groupId.replace('lab-specimen-', '');
    items
      .filter((i) => (i.category ?? i.specimenType) === category)
      .forEach((i) => updateItem(i.orderCode, { scheduledDate: date }));
  }, [items, updateItem]);

  if (!showSpecimenOrderPanel) return null;

  const confirmedOrders = items.map(toOrderDetail);

  return (
    <div className="absolute inset-0 bg-white z-[200] flex flex-col border-l shadow-2xl">
      <div className="h-14 bg-background border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">{ja.orders.specimenOrderEntry.panelTitle}</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShowSpecimenOrderPanelChange(false)}
        >
          <X className="w-4 h-4 mr-1" />
          {ja.orders.specimenOrderEntry.cancel}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <OrderPanel
            confirmedOrders={confirmedOrders}
            onUpdateOrder={handleUpdateOrder}
            onRemoveOrder={handleRemoveOrder}
            onConfirmAllOrders={handleAddToConfirmation}
            onCloseLabInput={handleAddToConfirmation}
            activeOrderType="lab"
            savedOrderDataList={[]}
            onSaveTemporary={() => {}}
            onLoadTemporary={() => {}}
            onDeleteSavedData={() => {}}
            activeSubTab={activeSubTab}
            onSubTabChange={setActiveSubTab}
            patientId={patientId}
            specimenSets={specimenSets}
            specimenHistory={specimenHistory}
            selectedSpecimenSetType={selectedSetType}
            onSpecimenSetTypeChange={setSelectedSetType}
            isSpecimenLoading={isLoading}
            specimenError={error}
            onAddSpecimenItem={addItem}
            onAddSpecimenItems={handleAddSpecimenItems}
            showSpecimenEditForm={showSpecimenEditForm}
            onShowSpecimenEditFormChange={setShowSpecimenEditForm}
            confirmedSpecimenOrderCodes={confirmedOrderCodes}
            onUpdateSpecimenGroupDate={handleUpdateGroupDate}
          />
        </div>
      </div>
    </div>
  );
}
