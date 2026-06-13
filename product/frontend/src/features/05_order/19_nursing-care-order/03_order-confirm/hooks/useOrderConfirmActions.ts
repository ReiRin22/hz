'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useOrderConfirmStore } from '../stores/orderConfirm.store';
import type { OrderTypeViewModel } from '../types/order-confirm.types';

interface PanelCallbacks {
  onSpecimenOrderOpen?: () => void;
  onImagingOrderOpen?: () => void;
}

export function useOrderConfirmActions(isSubstituteUser: boolean, callbacks: PanelCallbacks = {}) {
  const router = useRouter();
  const store = useOrderConfirmStore();
  const { onSpecimenOrderOpen, onImagingOrderOpen } = callbacks;

  // EVT_ORD076_01: 帳票出力ボタン押下
  const handleOpenPrintDialog = useCallback(() => {
    store.openPrintDialog();
  }, [store]);

  // EVT_ORD076_03: オーダー追加ボタン押下
  const handleOpenOrderTypeDialog = useCallback(() => {
    store.openOrderTypeDialog();
  }, [store]);

  // EVT_ORD076_04: 未確定オーダー編集アイコン押下
  const handleEditPendingOrder = useCallback(
    (orderId: string, orderRoute: string) => {
      router.push(orderRoute);
    },
    [router],
  );

  // EVT_ORD076_05: 確定済みオーダー編集アイコン押下
  const handleOpenEditConfirmDialog = useCallback(
    (orderId: string) => {
      store.openEditConfirmDialog(orderId);
    },
    [store],
  );

  // EVT_ORD076_07: 確定済みオーダー削除アイコン押下
  const handleOpenRevokeConfirmDialog = useCallback(
    (orderId: string) => {
      store.openRevokeConfirmDialog(orderId);
    },
    [store],
  );

  // EVT_ORD076_08: 帳票出力ダイアログ・すべて選択
  const handleSelectAllForms = useCallback(() => {
    store.selectAllForms();
  }, [store]);

  // EVT_ORD076_09: 帳票出力ダイアログ・個別チェックボックス操作
  const handleToggleFormSelection = useCallback(
    (formId: string) => {
      store.toggleFormSelection(formId);
    },
    [store],
  );

  // EVT_ORD076_11: オーダー種別選択ダイアログ・オーダー種選択
  // lab/imaging はコールバックでパネルを開く。それ以外は route へ遷移
  const handleSelectOrderType = useCallback(
    (orderType: OrderTypeViewModel) => {
      store.closeOrderTypeDialog();
      if (orderType.id === 'lab' && onSpecimenOrderOpen) {
        onSpecimenOrderOpen();
      } else if (orderType.id === 'imaging' && onImagingOrderOpen) {
        onImagingOrderOpen();
      } else {
        router.push(orderType.route);
      }
    },
    [store, router, onSpecimenOrderOpen, onImagingOrderOpen],
  );

  // EVT_ORD076_12: 確定済み編集確認ダイアログ・編集するボタン押下
  // 代行入力者は editReason 必須（バリデーションは呼び出し元で実施）
  const handleConfirmEdit = useCallback(
    (orderRoute: string) => {
      store.closeEditConfirmDialog();
      router.push(orderRoute);
    },
    [store, router],
  );

  return {
    isSubstitute: isSubstituteUser,
    handleOpenPrintDialog,
    handleOpenOrderTypeDialog,
    handleEditPendingOrder,
    handleOpenEditConfirmDialog,
    handleOpenRevokeConfirmDialog,
    handleSelectAllForms,
    handleToggleFormSelection,
    handleSelectOrderType,
    handleConfirmEdit,
  };
}
