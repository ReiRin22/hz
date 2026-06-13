'use client';

import { useEffect, useCallback, useState } from 'react';
import { initializeOrderConfirm } from '../repository/orderConfirm.repository';
import { useOrderConfirmStore } from '../stores/orderConfirm.store';
import { mapToPendingOrder, mapToConfirmedOrder } from '../repository/orderMappers';
import type { FormViewModel } from '../types/order-confirm.types';
import type { MedicalFormResponse } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response';

function mapToFormViewModel(form: MedicalFormResponse): FormViewModel {
  return {
    id: form.id,
    name: form.name,
    description: form.description,
    relatedOrderIds: form.relatedOrderIds,
  };
}

export function useOrderConfirmInit(patientId: string) {
  const {
    setPendingOrders,
    setConfirmedOrders,
    setAllForms,
    setOrderTypes,
    setIsLoadingOrders,
    reset,
  } = useOrderConfirmStore();
  const [initError, setInitError] = useState<string | null>(null);

  const fetchOrders = useCallback(async ({ silent }: { silent: boolean }) => {
    if (!patientId) return;

    if (!silent) {
      reset();
      setIsLoadingOrders(true);
      setInitError(null);
    }
    try {
      const { orders, forms, orderTypes } = await initializeOrderConfirm({ patientId, skipReset: silent });

      const pending = orders.orders
        .filter((o) => o.status === 'pending' || o.status == null)
        .map(mapToPendingOrder)
        .reverse();

      const confirmed = orders.orders
        .filter((o) => o.status != null && o.status !== 'pending')
        .map(mapToConfirmedOrder)
        .sort((a, b) => b.confirmedAt.localeCompare(a.confirmedAt));

      setPendingOrders(pending);
      setConfirmedOrders(confirmed);
      setAllForms(forms.forms.map(mapToFormViewModel));
      setOrderTypes(
        orderTypes.orderTypes.map((ot) => ({ id: ot.id, name: ot.name, route: ot.route })),
      );
    } catch (err) {
      console.error('オーダー情報の取得に失敗しました', err);
      if (!silent) {
        setInitError('オーダー情報の取得に失敗しました。再度お試しください。');
      }
    } finally {
      if (!silent) {
        setIsLoadingOrders(false);
      }
    }
  }, [patientId, setPendingOrders, setConfirmedOrders, setAllForms, setOrderTypes, setIsLoadingOrders, reset]);

  const refresh = useCallback(() => fetchOrders({ silent: false }), [fetchOrders]);

  const initialize = useCallback(() => fetchOrders({ silent: false }), [fetchOrders]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const timer = setInterval(() => fetchOrders({ silent: true }), 10_000);
    return () => clearInterval(timer);
  }, [fetchOrders]);

  return { refresh, initError, clearInitError: () => setInitError(null) };
}
