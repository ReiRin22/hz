"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import ORD076 from "@/features/05_order/19_nursing-care-order/03_order-confirm/components/organisms/ORD076";
import { useOrderConfirmStore } from "@/features/05_order/19_nursing-care-order/03_order-confirm/stores/orderConfirm.store";
import { ORDER_TYPES } from "@/features/05_order/19_nursing-care-order/03_order-confirm/types/orderTypes";
import { ImagingOrderEntryFeature } from "@/features/05_order/08_imaging-order/01_imaging-setting";
import type { OrderDetail, SavedOrderData } from "@/features/05_order/08_imaging-order/01_imaging-setting/types/order-shared.types";
import { SpecimenOrderEntryFeature } from "@/features/05_order/05_specimen-order/01_specimen-setting";
import type { SpecimenOrderFormItem } from "@/features/05_order/05_specimen-order/01_specimen-setting/types/specimen-order-entry.type";
import type { PendingOrderViewModel, SpecimenSubItemViewModel } from "@/features/05_order/19_nursing-care-order/03_order-confirm/types/order-confirm.types";

interface Props {
  patientId: string;
  patientName: string;
  confirmedBy: string;
  isSubstituteUser: boolean;
  patientAllergies?: string[];
  scheduledDate?: string;
  scheduledTime?: string;
  updatedOrderId?: string;
  openImaging?: string;
  openSpecimen?: string;
}

const toViewModelFromDetail = (detail: OrderDetail): PendingOrderViewModel => ({
  id: detail.id,
  type: 'imaging',
  typeName: ORDER_TYPES['imaging'].label,
  detail: detail.name,
  addedAt: new Date().toISOString(),
  scheduledAt: detail.scheduledDate,
});

export function OrderConfirmedClient({
  patientId,
  patientName,
  confirmedBy,
  isSubstituteUser,
  patientAllergies,
  scheduledDate,
  scheduledTime,
  updatedOrderId,
  openImaging,
  openSpecimen,
}: Props) {
  const router = useRouter();
  const addPendingOrders = useOrderConfirmStore((s) => s.addPendingOrders);
  const pendingOrders = useOrderConfirmStore((s) => s.pendingOrders);

  // 画像検査オーダーパネル
  const [showImagingOrderPanel, setShowImagingOrderPanel] = useState(!!openImaging);
  // 検体検査オーダーパネル
  const [showSpecimenOrderPanel, setShowSpecimenOrderPanel] = useState(!!openSpecimen);

  const [imagingOrders, setImagingOrders] = useState<OrderDetail[]>(() => {
    if (typeof window === 'undefined') return [];
    if (updatedOrderId) {
      try {
        const saved = sessionStorage.getItem('imagingOrders');
        const parsed: OrderDetail[] = saved ? JSON.parse(saved) : null;
        return parsed && parsed.length > 0 ? parsed : [];
      } catch {
        return [];
      }
    }
    sessionStorage.removeItem('imagingOrders');
    sessionStorage.removeItem('imagingSubTab');
    return [];
  });

  useEffect(() => {
    sessionStorage.setItem('imagingOrders', JSON.stringify(imagingOrders));
  }, [imagingOrders]);

  useEffect(() => {
    if (updatedOrderId && scheduledDate) {
      setShowImagingOrderPanel(true);
      setImagingOrders(prev =>
        prev.map(o =>
          o.id === updatedOrderId
            ? { ...o, scheduledDate, scheduledTime: scheduledTime ?? o.scheduledTime, ...(scheduledTime ? { preferredTime: 'specific' as const } : {}) }
            : o
        )
      );
    }
  }, [updatedOrderId, scheduledDate, scheduledTime]);

  const savedOrderDataList = useMemo<SavedOrderData[]>(() => [], []);

  const handleNavigateToExamination = useCallback((orderId: string) => {
    router.push(`/examination?orderId=${orderId}`);
  }, [router]);

  const handleImagingPanelClose = useCallback(() => {
    if (imagingOrders.length > 0) {
      addPendingOrders(imagingOrders.map(toViewModelFromDetail));
    }
    const reset: OrderDetail[] = [];
    setImagingOrders(reset);
    sessionStorage.setItem('imagingOrders', JSON.stringify(reset));
    setShowImagingOrderPanel(false);
  }, [imagingOrders, addPendingOrders]);

  const handleSpecimenPanelAdd = useCallback((specimenItems: SpecimenOrderFormItem[]) => {
    const grouped = specimenItems.reduce<Record<string, SpecimenOrderFormItem[]>>((acc, item) => {
      const key = item.category ?? item.specimenType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    const toAdd: PendingOrderViewModel[] = Object.entries(grouped).map(([category, items]) => ({
      id: crypto.randomUUID(),
      type: 'lab' as const,
      typeName: ORDER_TYPES['lab'].label,
      detail: category,
      addedAt: new Date().toISOString(),
      scheduledAt: items[0]?.scheduledDate,
      specimenSubItems: items.map((i): SpecimenSubItemViewModel => ({
        id: i.id,
        testName: i.testName,
        orderCode: i.orderCode,
        specimenType: i.specimenType,
        priority: i.priority,
      })),
    }));

    addPendingOrders(toAdd);
  }, [addPendingOrders]);

  const confirmedOrderCodes = useMemo(
    () => pendingOrders.flatMap((o) => o.specimenSubItems?.map((i) => i.orderCode) ?? []),
    [pendingOrders]
  );

  return (
    <div className="relative overflow-hidden h-full w-full">
      <ORD076
        patientId={patientId}
        patientName={patientName}
        confirmedBy={confirmedBy}
        isSubstituteUser={isSubstituteUser}
        patientAllergies={patientAllergies}
        onSpecimenOrderOpen={() => setShowSpecimenOrderPanel(true)}
        onImagingOrderOpen={() => setShowImagingOrderPanel(true)}
      />
      <ImagingOrderEntryFeature
        showImagingOrderPanel={showImagingOrderPanel}
        onShowImagingOrderPanelChange={(show) => show ? setShowImagingOrderPanel(true) : setShowImagingOrderPanel(false)}
        confirmedOrders={imagingOrders}
        onUpdateOrder={(order) => setImagingOrders(prev => prev.map(o => o.id === order.id ? order : o))}
        onAddOrder={(order) => setImagingOrders(prev => [...prev, order])}
        onRemoveOrder={(id) => setImagingOrders(prev => prev.filter(o => o.id !== id))}
        onConfirmAllOrders={handleImagingPanelClose}
        onCloseImagingInput={handleImagingPanelClose}
        savedOrderDataList={savedOrderDataList}
        onSaveTemporary={() => {}}
        onLoadTemporary={() => {}}
        onDeleteSavedData={() => {}}
        patientAllergies={patientAllergies}
        onNavigateToExamination={handleNavigateToExamination}
      />
      <SpecimenOrderEntryFeature
        showSpecimenOrderPanel={showSpecimenOrderPanel}
        onShowSpecimenOrderPanelChange={setShowSpecimenOrderPanel}
        patientId={patientId}
        onAddToConfirmation={handleSpecimenPanelAdd}
        confirmedOrderCodes={confirmedOrderCodes}
      />
    </div>
  );
}
