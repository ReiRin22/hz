import { useState } from 'react';
import { toast } from 'sonner';
import type { OrderItem, OrderDetail } from '../types';

export function useOrderManagement() {
  const [candidates, setCandidates] = useState<OrderItem[]>([]);
  const [confirmedOrders, setConfirmedOrders] = useState<OrderDetail[]>([]);
  const [nextRpNumber, setNextRpNumber] = useState(1);
  const [selectedDrug, setSelectedDrug] = useState<OrderItem | null>(null);

  // デフォルト値を設定する関数
  const getDefaultQuantity = (item: OrderItem) => {
    if (item.type === 'prescription') return '1錠';
    if (item.type === 'injection') return '1A';
    return '1';
  };

  const getDefaultFrequency = (item: OrderItem) => {
    if (item.usage?.includes('1日3回')) return '1日3回';
    if (item.usage?.includes('1日2回')) return '1日2回';
    return '1日1回';
  };

  const getDefaultTiming = (item: OrderItem) => {
    if (item.usage?.includes('食後')) return '食後';
    if (item.usage?.includes('食前')) return '食前';
    if (item.type === 'prescription') return '朝昼夕';
    return '';
  };

  const handleAddCandidate = (item: OrderItem & { source?: string }, activeTab: string) => {
    const newItem = {
      ...item,
      id: `${item.id}-${Date.now()}-${Math.random()}`,
      type: activeTab as 'prescription' | 'injection' | 'lab',
      source: item.source
    };
    setCandidates(prev => [...prev, newItem]);
    toast.success(`${item.name} を候補に追加しました`);
  };

  const handleAddMultipleCandidates = (items: (OrderItem & { source?: string })[], activeTab: string) => {
    const newItems = items.map(item => ({
      ...item,
      id: `${item.id}-${Date.now()}-${Math.random()}`,
      type: activeTab as 'prescription' | 'injection' | 'lab',
      source: item.source
    }));
    setCandidates(prev => [...prev, ...newItems]);
    toast.success(`${items.length}件のオーダーを候補に追加しました`);
  };

  const handleAddToDetail = (item: OrderItem, activeTab: string) => {
    // 処方オーダーで薬剤タブからの場合は中央ペインで詳細入力
    const orderType = item.type || (activeTab as 'prescription' | 'injection' | 'lab');
    if (orderType === 'prescription' && (item.source === 'search' || item.source === 'category')) {
      setSelectedDrug(item);
      return;
    }

    // その他の場合は従来通り直接追加
    const detailOrder: OrderDetail = {
      ...item,
      id: `order-${Date.now()}-${Math.random()}`,
      startDate: new Date().toISOString().split('T')[0],
      type: orderType,
      // 処方オーダーのみRP番号を設定
      rpNumber: orderType === 'prescription' ? nextRpNumber : undefined,
      quantity: getDefaultQuantity(item),
      frequency: getDefaultFrequency(item),
      timing: getDefaultTiming(item)
    };
    
    setConfirmedOrders(prev => [...prev, detailOrder]);
    // 処方オーダーのみRP番号をインクリメント
    if (orderType === 'prescription') {
      setNextRpNumber(prev => prev + 1);
    }
    toast.success(`${item.name} をオーダーリストに追加しました`);
  };

  const handleDrugDetailConfirm = (orderDetail: OrderDetail) => {
    const detailOrder: OrderDetail = {
      ...orderDetail,
      rpNumber: nextRpNumber
    };
    
    setConfirmedOrders(prev => [...prev, detailOrder]);
    setNextRpNumber(prev => prev + 1);
    toast.success(`${orderDetail.name} をオーダーリストに追加しました`);
  };

  const handleClearDrugSelection = () => {
    setSelectedDrug(null);
  };

  const handleAddMultipleToDetail = (items: OrderItem[], activeTab: string) => {
    if (items.length === 0) return;
    
    let prescriptionCount = 0;
    const detailOrders = items.map((item, index) => {
      const orderType = item.type || (activeTab as 'prescription' | 'injection' | 'lab');
      const detailOrder: OrderDetail = {
        ...item,
        id: `order-${Date.now()}-${Math.random()}-${index}`,
        startDate: new Date().toISOString().split('T')[0],
        type: orderType,
        // 処方オーダーのみRP番号を設定
        rpNumber: orderType === 'prescription' ? nextRpNumber + prescriptionCount : undefined,
        quantity: getDefaultQuantity(item),
        frequency: getDefaultFrequency(item),
        timing: getDefaultTiming(item)
      };
      
      if (orderType === 'prescription') {
        prescriptionCount++;
      }
      
      return detailOrder;
    });
    
    setConfirmedOrders(prev => [...prev, ...detailOrders]);
    // 処方オーダーの件数分だけRP番号をインクリメント
    setNextRpNumber(prev => prev + prescriptionCount);
    toast.success(`${items.length}件のオーダーをオーダーリストに追加しました`);
  };

  const handleUpdateOrder = (order: OrderDetail) => {
    setConfirmedOrders(prev => 
      prev.map(o => o.id === order.id ? {
        ...order,
        // 処方オーダーのみRP番号は変更させない（元の番号を保持）
        rpNumber: o.type === 'prescription' ? o.rpNumber : undefined
      } : o)
    );
  };

  const handleRemoveOrder = (id: string) => {
    const removedOrder = confirmedOrders.find(o => o.id === id);
    
    // オーダーを削除してRP番号を振り直し（処方オーダーのみ）
    setConfirmedOrders(prev => {
      const filtered = prev.filter(o => o.id !== id);
      let prescriptionIndex = 1;
      
      // 処方オーダーのみRP番号を1から連番で振り直し
      return filtered.map((order) => {
        if (order.type === 'prescription') {
          return {
            ...order,
            rpNumber: prescriptionIndex++
          };
        }
        return order;
      });
    });
    
    // nextRpNumberも更新（処方オーダーの残り件数 + 1）
    const remainingPrescriptions = confirmedOrders.filter(o => o.id !== id && o.type === 'prescription').length;
    setNextRpNumber(remainingPrescriptions + 1);
    
    if (removedOrder) {
      toast.success(`${removedOrder.name} をオーダーリストから削除しました`);
    }
  };

  const handleConfirmAllOrders = () => {
    if (confirmedOrders.length === 0) {
      toast.error('確定するオーダーがありません');
      return;
    }
    
    // 全オーダー確定処理のシミュレーション
    toast.success(`${confirmedOrders.length}件のオーダーを確定しました`);
    
    // オーダーリストをクリア
    setConfirmedOrders([]);
    setNextRpNumber(1);
    
    // 候補リストもクリア
    setCandidates([]);
  };

  const handleAddInjectionToUnifiedList = (orders: any[]) => {
    const detailOrders: OrderDetail[] = orders.map(order => ({
      ...order,
      id: `injection-unified-${Date.now()}-${Math.random()}`,
      type: 'injection' as const,
    }));
    
    setConfirmedOrders(prev => [...prev, ...detailOrders]);
    toast.success(`${orders.length}件の注射オーダーをオーダーリストに追加しました`);
  };

  return {
    // State
    candidates,
    confirmedOrders,
    nextRpNumber,
    selectedDrug,
    
    // Actions
    handleAddCandidate,
    handleAddMultipleCandidates,
    handleAddToDetail,
    handleDrugDetailConfirm,
    handleClearDrugSelection,
    handleAddMultipleToDetail,
    handleUpdateOrder,
    handleRemoveOrder,
    handleConfirmAllOrders,
    handleAddInjectionToUnifiedList,
    
    // Setters for temporary save/load
    setConfirmedOrders,
    setNextRpNumber
  };
}