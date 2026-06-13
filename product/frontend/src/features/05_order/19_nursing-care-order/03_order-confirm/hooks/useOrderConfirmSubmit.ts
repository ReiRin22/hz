'use client';

import { useCallback, useState } from 'react';
import axios from 'axios';
import { confirmOrders } from '../api/confirmOrders.api';
import { deleteOrder } from '../api/deleteOrder.api';
import { revokeOrder } from '../api/revokeOrder.api';
import { outputForms } from '../api/outputForms.api';
import { useOrderConfirmStore } from '../stores/orderConfirm.store';
import { checkPendingOrderAllergies } from './allergyCheck';
import { mapToConfirmedOrder } from '../repository/orderMappers';
import type { AllergyMatch } from './allergyCheck';

interface SubmitError {
  code: 'E_ORD076_01' | 'E_ORD076_02' | 'E_ORD076_03';
  message: string;
}

const ERROR_MESSAGES: Record<SubmitError['code'], string> = {
  E_ORD076_01: '検査連携システムとの通信障害により、オーダーを確定できません。',
  E_ORD076_02: '予期しないエラーが発生しました。管理者に連絡してください。',
  E_ORD076_03: '取り消しできませんでした。再度お試しください。',
};

export function useOrderConfirmSubmit(
  patientId: string,
  confirmedBy: string,
  patientAllergies: string[] = [],
) {
  const store = useOrderConfirmStore();
  const [error, setError] = useState<SubmitError | null>(null);
  const [allergyWarnings, setAllergyWarnings] = useState<AllergyMatch[]>([]);

  const clearError = useCallback(() => setError(null), []);
  const clearAllergyWarnings = useCallback(() => setAllergyWarnings([]), []);

  const executeConfirmOrders = useCallback(
    async (orderIds: string[]) => {
      store.setIsConfirming(true);
      setError(null);
      try {
        const result = await confirmOrders({ patientId, orderIds, confirmedBy });
        store.moveOrdersToConfirmed(result.confirmedOrders.map(mapToConfirmedOrder));
        return true;
      } catch (err) {
        const isConnectionError =
          axios.isAxiosError(err) &&
          (err.response === undefined || err.response.status === 503);
        setError({
          code: isConnectionError ? 'E_ORD076_01' : 'E_ORD076_02',
          message: isConnectionError
            ? ERROR_MESSAGES.E_ORD076_01
            : ERROR_MESSAGES.E_ORD076_02,
        });
        return false;
      } finally {
        store.setIsConfirming(false);
      }
    },
    [patientId, confirmedBy, store],
  );

  // EVT_ORD076_02: オーダー確定ボタン押下（アレルギーチェック込み）
  const handleConfirmOrders = useCallback(
    async (orderIds: string[]) => {
      const warnings = checkPendingOrderAllergies(store.pendingOrders, patientAllergies);
      if (warnings.length > 0) {
        setAllergyWarnings(warnings);
        // 呼び出し元でダイアログを表示させるため false を返さず warnings を公開する
        return 'allergy_warning' as const;
      }
      return executeConfirmOrders(orderIds);
    },
    [store.pendingOrders, patientAllergies, executeConfirmOrders],
  );

  // アレルギー警告確認後に確定を続行する
  const handleConfirmOrdersForced = useCallback(
    async (orderIds: string[]) => {
      setAllergyWarnings([]);
      return executeConfirmOrders(orderIds);
    },
    [executeConfirmOrders],
  );

  // EVT_ORD076_06: 未確定オーダー削除アイコン押下
  const handleDeletePendingOrder = useCallback(
    async (orderId: string) => {
      setError(null);
      try {
        await deleteOrder(orderId);
        store.removePendingOrder(orderId);
        return true;
      } catch {
        setError({ code: 'E_ORD076_02', message: ERROR_MESSAGES.E_ORD076_02 });
        return false;
      }
    },
    [store],
  );

  // EVT_ORD076_13: 取り消し確認ダイアログ・取り消すボタン押下
  const handleRevokeOrder = useCallback(
    async (orderId: string, reason: string) => {
      setError(null);
      try {
        await revokeOrder(orderId, { reason, revokedBy: confirmedBy });
        store.closeRevokeConfirmDialog();
        return true;
      } catch {
        setError({ code: 'E_ORD076_03', message: ERROR_MESSAGES.E_ORD076_03 });
        return false;
      }
    },
    [confirmedBy, store],
  );

  // EVT_ORD076_10: 帳票出力ダイアログ・出力ボタン押下
  const handleOutputForms = useCallback(
    async (formIds: string[]) => {
      setError(null);
      try {
        await outputForms({ patientId, formIds });
        store.closePrintDialog();
        return true;
      } catch {
        setError({ code: 'E_ORD076_02', message: ERROR_MESSAGES.E_ORD076_02 });
        return false;
      }
    },
    [patientId, store],
  );

  // EVT_ORD076_14: 帳票再出力確認ダイアログ・確定のみ押下
  const handleConfirmOnly = useCallback(
    async (orderIds: string[]) => {
      store.closeReprintConfirmDialog();
      return handleConfirmOrders(orderIds);
    },
    [store, handleConfirmOrders],
  );

  // EVT_ORD076_15: 帳票再出力確認ダイアログ・再出力押下
  const handleReprintAndConfirm = useCallback(
    async (orderIds: string[], formIds: string[]) => {
      store.closeReprintConfirmDialog();
      const outputOk = await handleOutputForms(formIds);
      if (!outputOk) return false;
      return handleConfirmOrders(orderIds);
    },
    [store, handleOutputForms, handleConfirmOrders],
  );

  return {
    error,
    clearError,
    allergyWarnings,
    clearAllergyWarnings,
    handleConfirmOrders,
    handleConfirmOrdersForced,
    handleDeletePendingOrder,
    handleRevokeOrder,
    handleOutputForms,
    handleConfirmOnly,
    handleReprintAndConfirm,
  };
}
