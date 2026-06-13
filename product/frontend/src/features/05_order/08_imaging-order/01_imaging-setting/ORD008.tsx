'use client';

import { useState, useEffect } from 'react';
import { FileText, X } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { OrderPanel } from './components/organisms/OrderPanel';
import type { OrderDetail, EditingOrderData, SavedOrderData } from './types/order-shared.types';

export interface ImagingOrderEntryFeatureProps {
  showImagingOrderPanel: boolean;
  onShowImagingOrderPanelChange: (show: boolean) => void;
  confirmedOrders: OrderDetail[];
  onUpdateOrder: (order: OrderDetail) => void;
  onAddOrder: (order: OrderDetail) => void;
  onRemoveOrder: (id: string) => void;
  onConfirmAllOrders: () => void;
  savedOrderDataList: SavedOrderData[];
  onSaveTemporary: (saveName: string) => void;
  onLoadTemporary: (saveData: SavedOrderData) => void;
  onDeleteSavedData: (saveId: string) => void;
  onNavigateToExamination?: (orderId: string) => void;
  patientAllergies?: string[];
  onRemoveGroup?: (groupId: string) => void;
  onEditImagingOrder?: (order: OrderDetail) => void;
  onDuplicateOrder?: (order: OrderDetail) => void;
  onAddNewOrder?: () => void;
  onCloseImagingInput?: () => void;
  editingOrders?: Record<string, EditingOrderData>;
  onEditingOrdersChange?: (editingOrders: Record<string, EditingOrderData>) => void;
  patientId?: string;
}

export function ImagingOrderEntryFeature({
  showImagingOrderPanel,
  onShowImagingOrderPanelChange,
  confirmedOrders,
  onUpdateOrder,
  onAddOrder,
  onRemoveOrder,
  onConfirmAllOrders,
  savedOrderDataList,
  onSaveTemporary,
  onLoadTemporary,
  onDeleteSavedData,
  onNavigateToExamination,
  patientAllergies,
  onRemoveGroup,
  onEditImagingOrder,
  onDuplicateOrder,
  onAddNewOrder,
  onCloseImagingInput,
  editingOrders,
  onEditingOrdersChange,
  patientId,
}: ImagingOrderEntryFeatureProps) {
  const [imagingSubTab, setImagingSubTab] = useState<'search' | 'history' | 'sets'>(() => {
    try {
      const stored = sessionStorage.getItem('imagingSubTab');
      const validTabs = ['search', 'history', 'sets'] as const;
      return validTabs.includes(stored as never)
        ? (stored as 'search' | 'history' | 'sets')
        : 'sets';
    } catch {
      return 'sets';
    }
  });

  useEffect(() => {
    sessionStorage.setItem('imagingSubTab', imagingSubTab);
  }, [imagingSubTab]);

  if (!showImagingOrderPanel) return null;

  return (
    <div className="absolute inset-0 bg-white z-[200] flex flex-col border-l shadow-2xl">
      <div className="h-14 bg-background border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">画像検査オーダー入力</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShowImagingOrderPanelChange(false)}
        >
          <X className="w-4 h-4 mr-1" />
          キャンセル
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <OrderPanel
            confirmedOrders={confirmedOrders}
            onUpdateOrder={onUpdateOrder}
            onAddOrder={onAddOrder}
            onRemoveOrder={onRemoveOrder}
            onConfirmAllOrders={onConfirmAllOrders}
            activeOrderType="imaging"
            savedOrderDataList={savedOrderDataList}
            onSaveTemporary={onSaveTemporary}
            onLoadTemporary={onLoadTemporary}
            onDeleteSavedData={onDeleteSavedData}
            patientAllergies={patientAllergies}
            onNavigateToExamination={onNavigateToExamination}
            onRemoveGroup={onRemoveGroup}
            onEditImagingOrder={onEditImagingOrder}
            onDuplicateOrder={onDuplicateOrder}
            onAddNewOrder={onAddNewOrder}
            onCloseImagingInput={onCloseImagingInput}
            activeSubTab={imagingSubTab}
            onSubTabChange={setImagingSubTab}
            showImagingOrderPanel={showImagingOrderPanel}
            onShowImagingOrderPanelChange={onShowImagingOrderPanelChange}
            editingOrders={editingOrders}
            onEditingOrdersChange={onEditingOrdersChange}
            patientId={patientId}
          />
        </div>
      </div>
    </div>
  );
}
