import { useState } from 'react';
import { toast } from 'sonner';
import type { SavedOrderData, OrderDetail } from '../data/types';

export function useSavedOrders() {
  const [savedOrderDataList, setSavedOrderDataList] = useState<SavedOrderData[]>([]);

  /**
   * オーダーを一時保存
   */
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

  /**
   * 一時保存データを読み込み
   */
  const handleLoadTemporary = (saveData: SavedOrderData): {
    orders: OrderDetail[];
    nextRpNumber: number;
  } => {
    toast.success(`「${saveData.name}」を読み込みました`);
    return {
      orders: saveData.orders,
      nextRpNumber: saveData.nextRpNumber
    };
  };

  /**
   * 一時保存データを削除
   */
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
