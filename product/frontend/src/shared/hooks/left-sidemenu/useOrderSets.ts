'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  SetDataResponse,
  OrderItemResponse,
} from '@/front_bff_shared/features/ui-common/left-sidemenu/order-sets/types/responses/order-sets.response';
import type { CreateMySetRequest } from '@/front_bff_shared/features/ui-common/left-sidemenu/order-sets/types/requests/order-sets.request';
import type { OrderTypeKey } from '@/shared/types/left-sidemenu/menu.types';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

interface UseOrderSetsReturn {
  mySets: SetDataResponse[];
  compositeSets: SetDataResponse[];
  availableOrders: OrderItemResponse[];
  errorMessage: string | null;
  clearError: () => void;
  createMySet: (req: CreateMySetRequest) => Promise<void>;
  refetchMySets: () => Promise<void>;
}

export function useOrderSets(selectedSetOrderType: OrderTypeKey): UseOrderSetsReturn {
  const [mySets, setMySets] = useState<SetDataResponse[]>([]);
  const [compositeSets, setCompositeSets] = useState<SetDataResponse[]>([]);
  const [availableOrders, setAvailableOrders] = useState<OrderItemResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearError = useCallback(() => setErrorMessage(null), []);

  const fetchMySets = useCallback(async () => {
    try {
      const res = await fetch(`${BFF_BASE_URL}/bff/order-sets/my-sets`);
      if (!res.ok) throw new Error(`BFF error: ${res.status}`);
      const data = await res.json() as { mySets: SetDataResponse[] };
      setMySets(data.mySets);
    } catch (e) {
      console.error('Myセット一覧の取得に失敗しました', e);
      setErrorMessage('Myセット一覧の取得に失敗しました。');
    }
  }, []);

  const fetchCompositeSets = useCallback(async (orderType: OrderTypeKey) => {
    try {
      const res = await fetch(
        `${BFF_BASE_URL}/bff/order-sets/composite-sets?orderType=${orderType}`
      );
      if (!res.ok) throw new Error(`BFF error: ${res.status}`);
      const data = await res.json() as { compositeSets: SetDataResponse[] };
      setCompositeSets(data.compositeSets);
    } catch (e) {
      console.error('複合セット一覧の取得に失敗しました', e);
      setErrorMessage('複合セット一覧の取得に失敗しました。');
    }
  }, []);

  const fetchAvailableOrders = useCallback(async () => {
    try {
      const res = await fetch(`${BFF_BASE_URL}/bff/order-sets/available-orders`);
      if (!res.ok) throw new Error(`BFF error: ${res.status}`);
      const data = await res.json() as { availableOrders: OrderItemResponse[] };
      setAvailableOrders(data.availableOrders);
    } catch (e) {
      console.error('オーダー候補一覧の取得に失敗しました', e);
      setErrorMessage('オーダー候補一覧の取得に失敗しました。');
    }
  }, []);

  useEffect(() => {
    fetchMySets();
    fetchAvailableOrders();
  }, [fetchMySets, fetchAvailableOrders]);

  useEffect(() => {
    fetchCompositeSets(selectedSetOrderType);
  }, [selectedSetOrderType, fetchCompositeSets]);

  const createMySet = useCallback(async (req: CreateMySetRequest) => {
    try {
      const res = await fetch(`${BFF_BASE_URL}/bff/order-sets/my-sets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!res.ok) throw new Error(`BFF error: ${res.status}`);
      await fetchMySets();
    } catch (e) {
      console.error('Myセットの登録に失敗しました', e);
      setErrorMessage('Myセットの登録に失敗しました。');
    }
  }, [fetchMySets]);

  return {
    mySets,
    compositeSets,
    availableOrders,
    errorMessage,
    clearError,
    createMySet,
    refetchMySets: fetchMySets,
  };
}
