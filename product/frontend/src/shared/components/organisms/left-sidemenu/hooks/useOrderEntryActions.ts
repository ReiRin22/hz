'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useOrderEntryStore } from '../stores/use-order-entry.store';
import type { OrderItem, SavedOrderData } from '../types/order.types';

const newOrderId = () => `order-${Date.now()}-${Math.random()}`;

export function useOrderEntryActions() {
  const [activeFilter, setActiveFilter] = useState('all');

  const switchTab = useOrderEntryStore((s) => s.switchTab);
  const activeTab = useOrderEntryStore((s) => s.activeTab);
  const nextRpNumber = useOrderEntryStore((s) => s.nextRpNumber);
  const addCandidate = useOrderEntryStore((s) => s.addCandidate);
  const addMultipleCandidates = useOrderEntryStore((s) => s.addMultipleCandidates);
  const addConfirmedOrder = useOrderEntryStore((s) => s.addConfirmedOrder);
  const addMultipleConfirmedOrders = useOrderEntryStore((s) => s.addMultipleConfirmedOrders);
  const removeCandidate = useOrderEntryStore((s) => s.removeCandidate);
  const setNextRpNumber = useOrderEntryStore((s) => s.setNextRpNumber);
  const clearConfirmedOrders = useOrderEntryStore((s) => s.clearConfirmedOrders);
  const incrementRpNumber = useOrderEntryStore((s) => s.incrementRpNumber);
  const removeSavedOrderData = useOrderEntryStore((s) => s.removeSavedOrderData);

  const handleOrderTypeChange = useCallback(
    (tab: string) => {
      // T6-1: 種別切り替え時にCenterPanelの候補をクリア
      switchTab(tab);
    },
    [switchTab]
  );

  const handleAddSetOrders = useCallback(
    (setData: {
      id: string;
      name: string;
      items: string[];
      type: 'my-set' | 'composite-set';
    }) => {
      const groupId = `group-${Date.now()}`;
      const newOrders = setData.items.map((itemName, index) => ({
        id: `${groupId}-${index}`,
        name: itemName,
        groupId,
        groupName: setData.name,
        groupType: 'set' as const,
        type: 'lab' as 'prescription' | 'injection' | 'lab',
        source: 'set' as const,
      }));
      addMultipleConfirmedOrders(newOrders);
      toast.success(`${setData.name}を追加しました`);
    },
    [addMultipleConfirmedOrders]
  );

  const handleAddToOrder = useCallback(
    (item: OrderItem) => {
      if (item.groupItems && item.groupItems.length > 0) {
        const groupId = `group-${Date.now()}`;
        const newOrders = item.groupItems.map((groupItem, index) => {
          const order: OrderItem = {
            ...groupItem,
            id: `${groupId}-${index}`,
            groupId,
            groupName: item.name,
            groupType: item.source === 'set' ? 'set' : 'history',
            type: activeTab as 'prescription' | 'injection' | 'lab',
          };
          if (activeTab === 'prescription') order.rpNumber = nextRpNumber;
          return order;
        });
        addMultipleConfirmedOrders(newOrders);
        if (activeTab === 'prescription') incrementRpNumber();
      } else {
        const newOrder: OrderItem = {
          ...item,
          id: newOrderId(),
          type: activeTab as 'prescription' | 'injection' | 'lab',
        };
        if (activeTab === 'prescription') {
          newOrder.rpNumber = nextRpNumber;
          incrementRpNumber();
        }
        addConfirmedOrder(newOrder);
      }
      removeCandidate(item.id);
    },
    [
      activeTab,
      nextRpNumber,
      addMultipleConfirmedOrders,
      incrementRpNumber,
      addConfirmedOrder,
      removeCandidate,
    ]
  );

  const handleLoadTemporary = useCallback(
    (saveData: SavedOrderData) => {
      clearConfirmedOrders();
      addMultipleConfirmedOrders(saveData.orders);
      setNextRpNumber(saveData.nextRpNumber);
      toast.success(`「${saveData.name}」を読み込みました`);
    },
    [clearConfirmedOrders, addMultipleConfirmedOrders, setNextRpNumber]
  );

  const handleDeleteSavedData = useCallback(
    (saveId: string) => {
      removeSavedOrderData(saveId);
      toast.success('保存データを削除しました');
    },
    [removeSavedOrderData]
  );

  const handleAddCandidateFromPanel = useCallback(
    (item: OrderItem) => {
      addCandidate(item);
    },
    [addCandidate]
  );

  const handleAddMultipleCandidates = useCallback(
    (items: OrderItem[]) => {
      addMultipleCandidates(items);
    },
    [addMultipleCandidates]
  );

  const handleAddToDetailDirect = useCallback(
    (item: OrderItem) => {
      addConfirmedOrder({ ...item, id: newOrderId() });
    },
    [addConfirmedOrder]
  );

  const handleAddMultipleToDetailDirect = useCallback(
    (items: OrderItem[]) => {
      addMultipleConfirmedOrders(items.map((item) => ({ ...item, id: newOrderId() })));
    },
    [addMultipleConfirmedOrders]
  );

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  return {
    activeFilter,
    handleOrderTypeChange,
    handleAddSetOrders,
    handleAddToOrder,
    handleLoadTemporary,
    handleDeleteSavedData,
    handleAddCandidateFromPanel,
    handleAddMultipleCandidates,
    handleAddToDetailDirect,
    handleAddMultipleToDetailDirect,
    handleFilterChange,
  };
}
