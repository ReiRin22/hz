'use client';

/**
 * カルテ機能 - 画像オーダーパネル管理フック
 *
 * 参照元: 【ORD032～ORD035】src/components/features/chart/hooks/useImagingPanel.ts
 */

import { useState, useEffect, useRef } from 'react';
import type { OrderDetail } from '@/features/05_order/08_imaging-order/01_imaging-setting/types/order-shared.types';

type ImagingSubTab = 'history' | 'sets' | 'search';

export function useImagingPanel(
  showImagingOrderPanel: boolean | undefined,
  confirmedOrders: OrderDetail[],
  onAddOrder: (order: OrderDetail) => void
) {
  const [imagingSubTab, setImagingSubTab] = useState<ImagingSubTab>('sets');
  const [initialImagingOrderId, setInitialImagingOrderId] = useState<string | null>(null);

  // onAddOrder の最新参照を ref で保持（stale closure 回避）
  const onAddOrderRef = useRef(onAddOrder);
  useEffect(() => { onAddOrderRef.current = onAddOrder; }, [onAddOrder]);

  useEffect(() => {
    if (showImagingOrderPanel && confirmedOrders.length === 0) {
      const newOrderId = `chart-imaging-${Date.now()}`;
      const today = new Date().toISOString().split('T')[0];
      const newOrder: OrderDetail = {
        id: newOrderId,
        name: '新規画像検査',
        type: 'imaging',
        scheduledDate: today,
        preferredDate: today,
        priority: 'normal',
        preferredTimeSlots: ['即時']
      };
      onAddOrderRef.current(newOrder);
      setInitialImagingOrderId(newOrderId);
    } else if (!showImagingOrderPanel) {
      setInitialImagingOrderId(null);
    }
  }, [showImagingOrderPanel, confirmedOrders.length]);

  const changeImagingSubTab = (tab: ImagingSubTab) => {
    setImagingSubTab(tab);
  };

  return {
    imagingSubTab,
    initialImagingOrderId,
    changeImagingSubTab,
  };
}
