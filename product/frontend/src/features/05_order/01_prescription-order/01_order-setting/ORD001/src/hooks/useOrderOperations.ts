import { useState } from 'react';
import { toast } from 'sonner';
import type { OrderItem, OrderDetail, AllergyInfo } from '../data/types';
import { getDefaultQuantity, getDefaultFrequency, getDefaultTiming } from '../utils/orderDefaults';

interface UseOrderOperationsProps {
  activeTab: 'prescription' | 'injection' | 'lab';
  prescriptionType: '院外' | '院内' | '定期' | '臨時';
  nextRpNumber: number;
  setNextRpNumber: (value: number | ((prev: number) => number)) => void;
  confirmedOrders: OrderDetail[];
  setConfirmedOrders: (value: OrderDetail[] | ((prev: OrderDetail[]) => OrderDetail[])) => void;
  checkAllergy: (drugName: string) => AllergyInfo[];
  checkContraindication: (drugName: string) => Array<{ withDrug: string; reason: string; source: 'current' | 'newOrder' }>;
  checkDuplication: (drugName: string, startDate?: string, period?: string) => Array<{ withDrug: string; ingredient: string; route: string; source: 'current' | 'order'; startDate?: string; endDate?: string }>;
  checkPatientAttribute: (drugName: string) => Array<{ category: string; message: string; severity: 'prohibited' | 'caution' }>;
  showDuplicationWarningOnly: (drugName: string, onComplete: () => void, startDate?: string, period?: string) => void;
  showWarningChainWithoutDuplication: (drugName: string, onComplete: () => void) => void;
}

export function useOrderOperations({
  activeTab,
  prescriptionType,
  nextRpNumber,
  setNextRpNumber,
  confirmedOrders,
  setConfirmedOrders,
  checkAllergy,
  checkContraindication,
  checkDuplication,
  checkPatientAttribute,
  showDuplicationWarningOnly,
  showWarningChainWithoutDuplication
}: UseOrderOperationsProps) {
  const [candidates, setCandidates] = useState<OrderItem[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<OrderItem | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderDetail | null>(null);

  /**
   * 候補リストに単一アイテムを追加
   */
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

  /**
   * 候補リストに複数アイテムを追加
   */
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

  /**
   * オーダーを詳細入力に追加（処方オーダーは警告チェック付き）
   */
  const handleAddToDetail = (item: OrderItem) => {
    const orderType = item.type || (activeTab as 'prescription' | 'injection' | 'lab');
    
    // 処方オーダーで薬剤タブからの場合は中央ペインで詳細入力
    // アレルギー、併用禁忌、患者属性チェックのみ実行（重複チェックは「オーダーリストに追加」時）
    if (orderType === 'prescription' && (item.source === 'search' || item.source === 'category' || item.source === 'frequent')) {
      // 警告チェーン実行（重複チェック除く）
      showWarningChainWithoutDuplication(item.name, () => {
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

  /**
   * 履歴から直接オーダーリストに追加
   */
  const handleAddHistoryToConfirmed = (item: OrderItem) => {
    const orderType = item.type || (activeTab as 'prescription' | 'injection' | 'lab');
    const detailOrder: OrderDetail = {
      ...item,
      id: `order-${Date.now()}-${Math.random()}`,
      startDate: new Date().toISOString().split('T')[0],
      type: orderType,
      // 処方オーダーのみRP番号を設定
      rpNumber: orderType === 'prescription' ? nextRpNumber : undefined,
    };
    
    setConfirmedOrders(prev => [...prev, detailOrder]);
    // 処方オーダーのみRP番号をインクリメント
    if (orderType === 'prescription') {
      setNextRpNumber(prev => prev + 1);
    }
    toast.success(`${item.name} をオーダーリストに追加しました`);
  };

  /**
   * 履歴から複数のオーダーを直接オーダーリストに追加
   */
  const handleAddMultipleHistoryToConfirmed = (items: OrderItem[]) => {
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

  /**
   * 複数アイテムを詳細入力に追加
   */
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
        // 処方オーダーのみRP番号を設定
        rpNumber: orderType === 'prescription' ? nextRpNumber + prescriptionCount : undefined,
        // 処方オーダーの場合は処方区分を設定
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
    // 処方オーダーの件数分だけRP番号をインクリメント
    setNextRpNumber(prev => prev + prescriptionCount);
    toast.success(`${items.length}件のオーダーをオーダーリストに追加しました`);
  };

  /**
   * 薬剤詳細入力の確定処理
   */
  const handleDrugDetailConfirm = (orderDetail: OrderDetail) => {
    // 処方・注射オーダーの場合は重複チェックのみ実行（期間情報含む）
    // アレルギー、併用禁忌、患者属性は詳細画面への遷移時に既にチェック済み
    if (orderDetail.type === 'prescription' || orderDetail.type === 'injection') {
      // 重複投薬チェック（開始日と期間を含める）
      const duplications = checkDuplication(orderDetail.name, orderDetail.startDate, orderDetail.period);
      
      // 重複がない場合は直接追加
      if (duplications.length === 0) {
        performDrugDetailConfirm(orderDetail);
        return;
      }
      
      // 重複がある場合は重複警告のみ表示
      showDuplicationWarningOnly(orderDetail.name, () => {
        performDrugDetailConfirm(orderDetail);
      }, orderDetail.startDate, orderDetail.period);
    } else {
      // 検体オーダーは警告チェックなしで直接追加
      performDrugDetailConfirm(orderDetail);
    }
  };

  /**
   * 実際のオーダー追加処理（内部関数）
   */
  const performDrugDetailConfirm = (orderDetail: OrderDetail) => {
    // 安全性チェックを実行してフラグを設定
    const hasAllergy = (orderDetail.type === 'prescription' || orderDetail.type === 'injection') 
      ? checkAllergy(orderDetail.name).length > 0
      : false;
    
    const contraindicationCheck = checkContraindication(orderDetail.name);
    const hasDrugInteraction = contraindicationCheck.length > 0;
    const drugInteractionWith = hasDrugInteraction 
      ? contraindicationCheck.map(c => c.withDrug).join(', ') 
      : undefined;
    
    const duplicationCheck = checkDuplication(orderDetail.name, orderDetail.startDate, orderDetail.period);
    const isDuplicate = duplicationCheck.length > 0;
    const duplicateWith = isDuplicate 
      ? duplicationCheck.map(d => d.withDrug).join(', ') 
      : undefined;
    
    const attributeCheck = checkPatientAttribute(orderDetail.name);
    const patientAttributeWarning = attributeCheck.length > 0 && attributeCheck[0].severity === 'prohibited'
      ? attributeCheck[0].category
      : undefined;
    
    // 編集モードの場合は更新、新規の場合は追加
    if (editingOrder) {
      setConfirmedOrders(prev => 
        prev.map(o => o.id === editingOrder.id ? {
          ...orderDetail,
          id: editingOrder.id,
          rpNumber: editingOrder.rpNumber,
          hasAllergy,
          hasDrugInteraction,
          drugInteractionWith,
          isDuplicate,
          duplicateWith,
          patientAttributeWarning
        } : o)
      );
      setEditingOrder(null);
      toast.success(`${orderDetail.name} を更新しました`);
    } else {
      const detailOrder: OrderDetail = {
        ...orderDetail,
        rpNumber: nextRpNumber,
        hasAllergy,
        hasDrugInteraction,
        drugInteractionWith,
        isDuplicate,
        duplicateWith,
        patientAttributeWarning
      };
      
      setConfirmedOrders(prev => [...prev, detailOrder]);
      setNextRpNumber(prev => prev + 1);
      toast.success(`${orderDetail.name} をオーダーリストに追加しました`);
    }
  };

  /**
   * オーダー更新
   */
  const handleUpdateOrder = (order: OrderDetail) => {
    setConfirmedOrders(prev => 
      prev.map(o => o.id === order.id ? {
        ...order,
        rpNumber: o.type === 'prescription' ? o.rpNumber : undefined
      } : o)
    );
  };

  /**
   * オーダー削除（RP番号の振り直し含む）
   */
  const handleRemoveOrder = (id: string) => {
    const removedOrder = confirmedOrders.find(o => o.id === id);
    
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
    
    const remainingPrescriptions = confirmedOrders.filter(o => o.id !== id && o.type === 'prescription').length;
    setNextRpNumber(remainingPrescriptions + 1);
    
    if (removedOrder) {
      toast.success(`${removedOrder.name} をオーダーリストから削除しました`);
    }
  };

  /**
   * オーダー編集開始
   */
  const handleEditOrder = (order: OrderDetail) => {
    setEditingOrder(order);
    setSelectedDrug(order);
  };

  /**
   * 薬剤選択クリア
   */
  const handleClearDrugSelection = () => {
    setSelectedDrug(null);
    setEditingOrder(null);
  };

  return {
    // 状態
    candidates,
    setCandidates,
    selectedDrug,
    setSelectedDrug,
    editingOrder,
    setEditingOrder,
    
    // 操作関数
    handleAddCandidate,
    handleAddMultipleCandidates,
    handleAddToDetail,
    handleAddHistoryToConfirmed,
    handleAddMultipleHistoryToConfirmed,
    handleAddMultipleToDetail,
    handleDrugDetailConfirm,
    handleUpdateOrder,
    handleRemoveOrder,
    handleEditOrder,
    handleClearDrugSelection
  };
}