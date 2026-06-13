'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useOrderEntryStore } from '../stores/use-order-entry.store';
import { fetchOrderInitialData } from '../repository/order.repository';
import { BffApiError } from '@/shared/utils/bff-error';
import type { CurrentPatient } from '../types/order.types';

// TODO: Phase 6後 - 認証ストアから取得するよう差し替える
const DUMMY_PATIENT: CurrentPatient = {
  id: 'p001',
  name: '山田太郎',
  age: 45,
  gender: 'male',
  patientNumber: '12345678',
  visitDate: new Date().toISOString().split('T')[0],
  allergies: ['ペニシリン系', 'アルコール'],
};

export function useOrderEntryInit() {
  const [currentPatient] = useState<CurrentPatient>(DUMMY_PATIENT);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const activeTab = useOrderEntryStore((s) => s.activeTab);
  const setOrderHistoryByTab = useOrderEntryStore((s) => s.setOrderHistoryByTab);
  const setOrderSetsByTab = useOrderEntryStore((s) => s.setOrderSetsByTab);
  const orderHistoryByTab = useOrderEntryStore((s) => s.orderHistoryByTab);

  useEffect(() => {
    // 既にこのタブのデータが取得済みなら再取得しない
    if (orderHistoryByTab[activeTab]) return;

    const controller = new AbortController();
    setIsLoading(true);
    setInitError(null);

    fetchOrderInitialData(
      { patientId: currentPatient.id, orderType: activeTab as 'prescription' | 'injection' | 'lab' },
      controller.signal
    )
      .then(({ history, sets }) => {
        // BFF レスポンスを ViewModel に変換してストアにセット
        const historyGroups = history.orders.reduce<Record<string, typeof history.orders>>((acc, item) => {
          const key = item.orderDate;
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

        const newHistory = Object.entries(historyGroups).map(([date, items]) => ({
          date,
          department: '内科', // BFF レスポンスに科情報が追加されたら差し替え
          complaint: '',
          orders: items.flatMap((item) =>
            item.items.map((entry) => ({
              id: entry.itemId,
              name: entry.name,
              dosage: entry.dosage,
              usage: entry.usage,
              source: 'history' as const,
              type: activeTab as 'prescription' | 'injection' | 'lab',
            }))
          ),
        }));

        const newSets = sets.sets.map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          items: s.items,
        }));

        setOrderHistoryByTab({ ...useOrderEntryStore.getState().orderHistoryByTab, [activeTab]: newHistory });
        setOrderSetsByTab({ ...useOrderEntryStore.getState().orderSetsByTab, [activeTab]: newSets });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        const message = err instanceof BffApiError ? err.message : '初期データの取得に失敗しました';
        setInitError(message);
        toast.error(message);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [activeTab, currentPatient.id, orderHistoryByTab, setOrderHistoryByTab, setOrderSetsByTab]);

  return { currentPatient, isLoading, initError };
}
