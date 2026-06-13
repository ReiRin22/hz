import { useState } from 'react';
import { toast } from 'sonner';
import type { OrderItem, OrderDetail, SavedOrderData } from '../data/types';

interface UseOrderManagementProps {
  activeTab: string;
  prescriptionType: '院外' | '院内' | '定期' | '臨時';
  performSafetyChecks: (drugName: string, onAllChecksPass: () => void) => boolean;
}

export function useOrderManagement({
  activeTab,
  prescriptionType,
  performSafetyChecks
}: UseOrderManagementProps) {
  // オーダー関連の状態
  const [candidates, setCandidates] = useState<OrderItem[]>([]);
  const [confirmedOrders, setConfirmedOrders] = useState<OrderDetail[]>([]);
  const [nextRpNumber, setNextRpNumber] = useState(1);
  const [selectedDrug, setSelectedDrug] = useState<OrderItem | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderDetail | null>(null);
  const [savedOrderDataList, setSavedOrderDataList] = useState<SavedOrderData[]>([]);

  // 候補に追加
  const handleAddCandidate = (item: OrderItem & { source?: string }) => {
    const newItem = {
      ...item,
      id: `${item.id}-${Date.now()}-${Math.random()}`,
      type: activeTab as 'prescription' | 'injection' | 'lab',
      source: item.source
    };
    setCandidates(prev => [...prev, newItem]);
    toast.success(`${item.name} を候補に追加しました`);
  };

  // 複数候補に追加
  const handleAddMultipleCandidates = (items: (OrderItem & { source?: string })[]) => {
    const newItems = items.map(item => ({
      ...item,
      id: `${item.id}-${Date.now()}-${Math.random()}`,
      type: activeTab as 'prescription' | 'injection' | 'lab',
      source: item.source
    }));
    setCandidates(prev => [...prev, ...newItems]);
    toast.success(`${items.length}件のオーダーを候補に追加しました`);
  };

  // 薬剤を選択して詳細入力へ（医療安全チェック付き）
  const handleAddToDetail = (item: OrderItem) => {
    const orderType = item.type || (activeTab as 'prescription' | 'injection' | 'lab');
    
    // 処方オーダーで薬剤タブからの場合は医療安全チェック
    if (orderType === 'prescription' && (item.source === 'search' || item.source === 'category' || item.source === 'frequent')) {
      performSafetyChecks(item.name, () => {
        setSelectedDrug(item);
      });
      return;
    }

    // その他の場合は従来通り直接追加
    const detailOrder: OrderDetail = {
      ...item,
      id: `order-${Date.now()}-${Math.random()}`,
      startDate: new Date().toISOString().split('T')[0],
      type: orderType,
      rpNumber: orderType === 'prescription' ? nextRpNumber : undefined,
      quantity: getDefaultQuantity(item),
      frequency: getDefaultFrequency(item),
      timing: getDefaultTiming(item)
    };
    
    setConfirmedOrders(prev => [...prev, detailOrder]);
    if (orderType === 'prescription') {
      setNextRpNumber(prev => prev + 1);
    }
    toast.success(`${item.name} をオーダーリストに追加しました`);
  };

  // 詳細確定（医療安全チェック済み）
  const handleDrugDetailConfirm = (orderDetail: OrderDetail) => {
    const detailOrder: OrderDetail = {
      ...orderDetail,
      id: `order-${Date.now()}-${Math.random()}`,
      startDate: orderDetail.startDate || new Date().toISOString().split('T')[0],
      type: orderDetail.type || 'prescription',
      rpNumber: orderDetail.type === 'prescription' ? nextRpNumber : undefined,
      prescriptionType: orderDetail.type === 'prescription' ? prescriptionType : undefined
    };
    
    setConfirmedOrders(prev => [...prev, detailOrder]);
    
    if (orderDetail.type === 'prescription') {
      setNextRpNumber(prev => prev + 1);
    }
    
    toast.success(`${orderDetail.name} をオーダーリストに追加しました`);
  };

  // 複数のオーダーを詳細に追加
  const handleAddMultipleToDetail = (items: OrderItem[]) => {
    if (items.length === 0) return;
    
    let prescriptionCount = 0;
    const detailOrders = items.map((item, index) => {
      const orderType = item.type || (activeTab as 'prescription' | 'injection' | 'lab');
      const detailOrder: OrderDetail = {
        ...item,
        id: `order-${Date.now()}-${Math.random()}-${index}`,
        startDate: new Date().toISOString().split('T')[0],
        type: orderType,
        rpNumber: orderType === 'prescription' ? nextRpNumber + prescriptionCount : undefined,
        prescriptionType: orderType === 'prescription' ? prescriptionType : undefined,
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
    setNextRpNumber(prev => prev + prescriptionCount);
    toast.success(`${items.length}件のオーダーをオーダーリストに追加しました`);
  };

  // オーダー更新
  const handleUpdateOrder = (order: OrderDetail) => {
    setConfirmedOrders(prev => 
      prev.map(o => o.id === order.id ? {
        ...order,
        rpNumber: o.type === 'prescription' ? o.rpNumber : undefined
      } : o)
    );
  };

  // オーダー削除（RP番号を振り直し）
  const handleRemoveOrder = (id: string) => {
    setConfirmedOrders(prev => {
      const filtered = prev.filter(o => o.id !== id);
      let prescriptionIndex = 1;
      
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
    
    // nextRpNumberを更新（処方オーダーの数+1）
    const prescriptionCount = confirmedOrders.filter(o => o.type === 'prescription' && o.id !== id).length;
    setNextRpNumber(prescriptionCount + 1);
    
    toast.success('オーダーを削除しました');
  };

  // 薬剤選択をクリア
  const handleClearDrugSelection = () => {
    setSelectedDrug(null);
    setEditingOrder(null);
  };

  // 編集モードを開始
  const handleEditOrder = (order: OrderDetail) => {
    setEditingOrder(order);
    setSelectedDrug(null);
  };

  // 一時保存
  const handleSaveTemporary = (saveName: string) => {
    if (confirmedOrders.length === 0) {
      toast.error('保存するオーダーがありません');
      return;
    }

    const saveData: SavedOrderData = {
      id: `save-${Date.now()}`,
      name: saveName,
      orders: confirmedOrders,
      savedAt: new Date().toISOString(),
      orderType: activeTab as 'prescription' | 'injection' | 'lab'
    };

    setSavedOrderDataList(prev => [...prev, saveData]);
    toast.success(`「${saveName}」として保存しました`);
  };

  // 一時保存読み込み
  const handleLoadTemporary = (saveData: SavedOrderData) => {
    setConfirmedOrders(saveData.orders);
    
    // RP番号の最大値を取得して次の番号を設定
    const maxRpNumber = saveData.orders
      .filter(o => o.type === 'prescription' && o.rpNumber)
      .reduce((max, o) => Math.max(max, o.rpNumber || 0), 0);
    setNextRpNumber(maxRpNumber + 1);
    
    toast.success(`「${saveData.name}」を読み込みました`);
  };

  // 一時保存削除
  const handleDeleteSavedData = (saveId: string) => {
    const saveData = savedOrderDataList.find(s => s.id === saveId);
    setSavedOrderDataList(prev => prev.filter(s => s.id !== saveId));
    
    if (saveData) {
      toast.success(`「${saveData.name}」を削除しました`);
    }
  };

  // 全オーダークリア
  const handleClearAllOrders = () => {
    setConfirmedOrders([]);
    setNextRpNumber(1);
    setCandidates([]);
    setSelectedDrug(null);
    setEditingOrder(null);
  };

  // デフォルト値取得関数
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

  return {
    // 状態
    candidates,
    confirmedOrders,
    nextRpNumber,
    selectedDrug,
    editingOrder,
    savedOrderDataList,
    // setter（外部から直接使う場合のため）
    setCandidates,
    setConfirmedOrders,
    setNextRpNumber,
    setSelectedDrug,
    setEditingOrder,
    // 関数
    handleAddCandidate,
    handleAddMultipleCandidates,
    handleAddToDetail,
    handleDrugDetailConfirm,
    handleAddMultipleToDetail,
    handleUpdateOrder,
    handleRemoveOrder,
    handleClearDrugSelection,
    handleEditOrder,
    handleSaveTemporary,
    handleLoadTemporary,
    handleDeleteSavedData,
    handleClearAllOrders
  };
}
