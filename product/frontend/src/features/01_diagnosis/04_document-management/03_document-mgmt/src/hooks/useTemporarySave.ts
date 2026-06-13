import { useState } from 'react';
import { toast } from 'sonner';
import type { SavedOrderData, OrderDetail } from '../types';

export function useTemporarySave() {
  const [savedOrderDataList, setSavedOrderDataList] = useState<SavedOrderData[]>([]);

  const handleSaveTemporary = (
    saveName: string,
    confirmedOrders: OrderDetail[],
    nextRpNumber: number
  ) => {
    if (confirmedOrders.length === 0) {
      toast.error('保存するオーダーがありません');
      return;
    }

    const newSaveData: SavedOrderData = {
      id: `save-${Date.now()}`,
      name: saveName,
      savedAt: new Date().toLocaleString('ja-JP'),
      orders: [...confirmedOrders],
      nextRpNumber: nextRpNumber
    };

    setSavedOrderDataList(prev => [...prev, newSaveData]);
    toast.success(`オーダーを「${saveName}」として一時保存しました`);
  };

  const handleLoadTemporary = (
    saveData: SavedOrderData,
    setConfirmedOrders: (orders: OrderDetail[]) => void,
    setNextRpNumber: (num: number) => void
  ) => {
    setConfirmedOrders(saveData.orders);
    setNextRpNumber(saveData.nextRpNumber);
    toast.success(`「${saveData.name}」を読み込みました`);
  };

  const handleDeleteSavedData = (saveId: string) => {
    const saveData = savedOrderDataList.find(s => s.id === saveId);
    setSavedOrderDataList(prev => prev.filter(s => s.id !== saveId));
    if (saveData) {
      toast.success(`「${saveData.name}」を削除しました`);
    }
  };

  return {
    savedOrderDataList,
    handleSaveTemporary,
    handleLoadTemporary,
    handleDeleteSavedData
  };
}
