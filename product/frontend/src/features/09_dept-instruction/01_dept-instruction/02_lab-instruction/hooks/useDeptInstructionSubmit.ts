'use client';

import { useCallback } from 'react';
import axios from 'axios';
import {
  executeStatusUpdate,
  executeImplementer,
  executeBillingLink,
} from '../repository/useUpdateDeptInstructionStatus';
import { useDeptInstructionStore } from '../stores/useDeptInstructionStore';
import type { OrderStatus, ImplementerInput } from '../types/deptInstruction.viewmodel';

type SubmitResult = { ok: true } | { ok: false; message: string };

export function useDeptInstructionSubmit(updatedBy: string) {
  const store = useDeptInstructionStore();

  // ステータス更新（楽観的更新 → 成功確認 or ロールバック）
  const handleStatusUpdate = useCallback(
    async (orderId: string, newStatus: OrderStatus): Promise<SubmitResult> => {
      const timestamp = new Date().toISOString();
      store.optimisticUpdateStatus(orderId, newStatus, updatedBy);
      try {
        await executeStatusUpdate({ orderId, newStatus, updatedBy, timestamp });
        store.confirmStatusUpdate();
        return { ok: true };
      } catch (err) {
        store.rollbackStatus();
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : 'ステータスの更新に失敗しました。';
        return { ok: false, message };
      }
    },
    [store, updatedBy],
  );

  // 実施者登録送信（登録後にステータス更新）
  const handleImplementer = useCallback(
    async (orderId: string, input: ImplementerInput, nextStatus: OrderStatus): Promise<SubmitResult> => {
      try {
        await executeImplementer(orderId, {
          implementer: input.implementer,
          witness: input.witness,
          location: input.location,
          notes: input.notes,
          implementedAt: input.implementedAt,
          reason: input.reason,
        });
        return handleStatusUpdate(orderId, nextStatus);
      } catch {
        return { ok: false, message: '実施者登録に失敗しました。' };
      }
    },
    [handleStatusUpdate],
  );

  // 医事会計連携（[PLACEHOLDER: BILLING] — 現時点ではモック呼び出し）
  const handleBillingLink = useCallback(
    async (orderId: string, triggerStatus: OrderStatus) => {
      const timestamp = new Date().toISOString();
      try {
        await executeBillingLink(orderId, { triggerStatus, timestamp });
        return true;
      } catch {
        // 医事会計連携失敗は業務継続を妨げない（ログのみ）
        console.error('[BILLING] 医事会計連携に失敗しました。orderId:', orderId);
        return false;
      }
    },
    [],
  );

  return {
    handleStatusUpdate,
    handleImplementer,
    handleBillingLink,
  };
}
