'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useOrderEntryStore } from '../stores/use-order-entry.store';
import { confirmOrder, saveTempOrder } from '../repository/order.repository';
import type { PostOrderEntryRequest, SaveTemporaryOrderRequest } from '@/front_bff_shared/features/orders/orderEntry/types/orderEntry.types';
import { BffApiError } from '@/shared/utils/bff-error';

export function useOrderEntrySubmit(patientId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const activeTab = useOrderEntryStore((s) => s.activeTab);
  const confirmedOrders = useOrderEntryStore((s) => s.confirmedOrders);
  const nextRpNumber = useOrderEntryStore((s) => s.nextRpNumber);
  const addSavedOrderData = useOrderEntryStore((s) => s.addSavedOrderData);
  const clearConfirmedOrders = useOrderEntryStore((s) => s.clearConfirmedOrders);
  const setConfirmedOrders = useOrderEntryStore((s) => s.setConfirmedOrders);
  const resetRpNumber = useOrderEntryStore((s) => s.resetRpNumber);
  const setNextRpNumber = useOrderEntryStore((s) => s.setNextRpNumber);

  const handleConfirmAllOrders = useCallback(async () => {
    if (confirmedOrders.length === 0) {
      toast.error('オーダーが選択されていません');
      return;
    }
    // T6-3: 楽観的更新 - スナップショット保存
    const snapshot = [...confirmedOrders];
    const snapshotRpNumber = nextRpNumber;
    setIsSubmitting(true);
    // 楽観的にUIをクリア
    clearConfirmedOrders();
    resetRpNumber();
    try {
      const body: PostOrderEntryRequest = {
        patientId,
        orderType: activeTab as 'prescription' | 'injection' | 'lab',
        orders: snapshot.map((o) => ({
          itemId: o.id,
          name: o.name,
          dosage: o.dosage,
          usage: o.usage,
          quantity: o.quantity,
          frequency: o.frequency,
          timing: o.timing,
          route: o.route,
          period: o.period,
          startDate: o.startDate,
          notes: o.notes,
          rpNumber: o.rpNumber,
          groupId: o.groupId,
          groupName: o.groupName,
          orderType: activeTab as 'prescription' | 'injection' | 'lab',
        })),
        confirmedBy: 'current-user', // TODO: 認証ストアから取得するよう差し替える
      };
      await confirmOrder(body);
      toast.success(`${snapshot.length}件のオーダーを確定しました`);
    } catch (error) {
      // T6-3: ロールバック
      setConfirmedOrders(snapshot);
      setNextRpNumber(snapshotRpNumber);
      toast.error(error instanceof BffApiError ? error.message : 'オーダーの確定に失敗しました。再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  }, [patientId, activeTab, confirmedOrders, nextRpNumber, clearConfirmedOrders, resetRpNumber, setConfirmedOrders, setNextRpNumber, addSavedOrderData]);

  const handleSaveTemporary = useCallback(
    async (saveName: string) => {
      setIsSaving(true);
      try {
        const body: SaveTemporaryOrderRequest = {
          patientId,
          name: saveName,
          orders: confirmedOrders.map((o) => ({
            itemId: o.id,
            name: o.name,
            dosage: o.dosage,
            usage: o.usage,
            quantity: o.quantity,
            frequency: o.frequency,
            timing: o.timing,
            route: o.route,
            period: o.period,
            startDate: o.startDate,
            notes: o.notes,
            rpNumber: o.rpNumber,
            groupId: o.groupId,
            groupName: o.groupName,
            orderType: activeTab as 'prescription' | 'injection' | 'lab',
          })),
          nextRpNumber,
        };
        const result = await saveTempOrder(body);
        addSavedOrderData({
          id: result.saveId,
          name: saveName,
          savedAt: result.savedAt,
          orders: confirmedOrders,
          nextRpNumber,
        });
        toast.success(`「${saveName}」として一時保存しました`);
      } catch (error) {
        toast.error(error instanceof BffApiError ? error.message : '一時保存に失敗しました');
      } finally {
        setIsSaving(false);
      }
    },
    [patientId, activeTab, confirmedOrders, nextRpNumber, addSavedOrderData]
  );

  return {
    isSubmitting,
    isSaving,
    handleConfirmAllOrders,
    handleSaveTemporary,
  };
}
