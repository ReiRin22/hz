'use client';

import { useCallback, useState } from 'react';
import axios from 'axios';
import { confirmSpecimenOrders } from '../api/specimenOrderApi';
import type { SpecimenOrderFormItem } from '../types/specimen-order-entry.type';
import type { ConfirmSpecimenOrdersRequest } from '@/front_bff_shared/features/order/specimen-order/specimen-orders/types/requests/specimen-orders.request';

export interface UseSpecimenOrderSubmitOptions {
  onSuccess?: () => void;
}

export interface UseSpecimenOrderSubmitReturn {
  isSubmitting: boolean;
  submitError: string | null;
  handleConfirmAllOrders: (patientId: string, items: SpecimenOrderFormItem[]) => Promise<void>;
}

// TODO: 認証実装後にセッションから取得する
const STUB_CONFIRMED_BY = 'stub-user';

export function useSpecimenOrderSubmit(
  options: UseSpecimenOrderSubmitOptions = {}
): UseSpecimenOrderSubmitReturn {
  const { onSuccess } = options;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleConfirmAllOrders = useCallback(
    async (patientId: string, items: SpecimenOrderFormItem[]) => {
      setIsSubmitting(true);
      setSubmitError(null);

      const request: ConfirmSpecimenOrdersRequest = {
        items: items.map((item) => ({
          specimenType: item.specimenType,
          orderCode: item.orderCode,
          testName: item.testName,
          quantity: item.quantity,
          priority: item.priority,
          clinicalPurpose: item.clinicalPurpose,
          specialInstructions: item.specialInstructions,
        })),
        confirmedBy: STUB_CONFIRMED_BY,
      };

      try {
        await confirmSpecimenOrders(patientId, request);
        onSuccess?.();
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setSubmitError('検査連携システムとの通信障害により、オーダーを確定できません。');
        } else {
          setSubmitError('予期しないエラーが発生しました。管理者に連絡してください。');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess]
  );

  return { isSubmitting, submitError, handleConfirmAllOrders };
}
