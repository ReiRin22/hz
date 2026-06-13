'use client';

/**
 * 画像オーダー管理フック
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/hooks/useImagingOrders.ts
 */

import { useState, useEffect, useRef } from 'react';
import type { OrderDetail, EditingOrderData } from '../types/order-shared.types';

interface UseImagingOrdersProps {
  confirmedOrders: OrderDetail[];
  editingOrders: Record<string, EditingOrderData>;
  setEditingOrders: (editingOrders: Record<string, EditingOrderData> | ((prev: Record<string, EditingOrderData>) => Record<string, EditingOrderData>)) => void;
}

export function useImagingOrders({
  confirmedOrders,
  editingOrders,
  setEditingOrders
}: UseImagingOrdersProps) {
  const [expandedImagingOrders, setExpandedImagingOrders] = useState<{[key: string]: boolean}>({});

  // setEditingOrders の最新参照を ref で保持（stale closure 回避）
  const setEditingOrdersRef = useRef(setEditingOrders);
  useEffect(() => { setEditingOrdersRef.current = setEditingOrders; }, [setEditingOrders]);

  // 画像検査オーダーを初期展開・編集モードに設定
  useEffect(() => {
    const imagingOrders = confirmedOrders.filter(order => order.type === 'imaging');

    if (imagingOrders.length > 0) {
      const expandedState: {[key: string]: boolean} = {};
      const editingState: Record<string, EditingOrderData> = {};

      imagingOrders.forEach(order => {
        expandedState[order.id] = true;

        const isCompleteOrder = order.modality && order.bodyPart;
        const isAlreadyEditing = editingOrders[order.id];

        if (!isCompleteOrder && !isAlreadyEditing) {
          editingState[order.id] = {
            scheduledDate: order.scheduledDate || new Date().toISOString().split('T')[0],
            preferredTime: order.preferredTime || undefined,
            dateUndecided: false
          };
        }
      });

      setExpandedImagingOrders(expandedState);
      if (Object.keys(editingState).length > 0) {
        setEditingOrdersRef.current(prev => ({...prev, ...editingState}));
      }
    }
  }, [confirmedOrders.length]);

  return {
    expandedImagingOrders,
    setExpandedImagingOrders
  };
}
