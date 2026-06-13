'use client';

import { useCallback } from 'react';
import { useDeptInstructionStore } from '../stores/useDeptInstructionStore';
import type { Order, OrderStatus } from '../types/deptInstruction.viewmodel';

export function useDeptInstructionActions() {
  const store = useDeptInstructionStore();

  const handleSelectOrder = useCallback(
    (order: Order | null) => {
      store.setSelectedOrder(order);
    },
    [store],
  );

  const handleToggleOrderSelection = useCallback(
    (orderId: string) => {
      store.toggleOrderSelection(orderId);
    },
    [store],
  );

  const handleToggleAllOrders = useCallback(
    (checked: boolean) => {
      store.toggleAllOrders(checked);
    },
    [store],
  );

  const handleFilterOrders = useCallback(
    (predicate: (order: Order) => boolean) => {
      const filtered = store.orders.filter(predicate);
      store.setFilteredOrders(filtered);
    },
    [store],
  );

  const handleFilterByStatus = useCallback(
    (statuses: OrderStatus[]) => {
      if (statuses.length === 0) {
        store.setFilteredOrders(store.orders);
        return;
      }
      const filtered = store.orders.filter((o) => statuses.includes(o.status));
      store.setFilteredOrders(filtered);
    },
    [store],
  );

  const handleOpenImplementerDialog = useCallback(
    (order: Order) => {
      store.openImplementerDialog(order);
    },
    [store],
  );

  const handleCloseImplementerDialog = useCallback(() => {
    store.closeImplementerDialog();
  }, [store]);

  const handleOpenResultInputDialog = useCallback(
    (order: Order) => {
      store.openResultInputDialog(order);
    },
    [store],
  );

  const handleCloseResultInputDialog = useCallback(() => {
    store.closeResultInputDialog();
  }, [store]);

  const handleOpenMaterialRecordDialog = useCallback(
    (order: Order) => {
      store.openMaterialRecordDialog(order);
    },
    [store],
  );

  const handleCloseMaterialRecordDialog = useCallback(() => {
    store.closeMaterialRecordDialog();
  }, [store]);

  const handleOpenPrintDialog = useCallback(
    (type: 'label' | 'document') => {
      store.openPrintDialog(type);
    },
    [store],
  );

  const handleClosePrintDialog = useCallback(() => {
    store.closePrintDialog();
  }, [store]);

  const handleOpenAllergyDialog = useCallback(
    (order: Order) => {
      store.openAllergyDialog(order);
    },
    [store],
  );

  const handleCloseAllergyDialog = useCallback(() => {
    store.closeAllergyDialog();
  }, [store]);

  return {
    handleSelectOrder,
    handleToggleOrderSelection,
    handleToggleAllOrders,
    handleFilterOrders,
    handleFilterByStatus,
    handleOpenImplementerDialog,
    handleCloseImplementerDialog,
    handleOpenResultInputDialog,
    handleCloseResultInputDialog,
    handleOpenMaterialRecordDialog,
    handleCloseMaterialRecordDialog,
    handleOpenPrintDialog,
    handleClosePrintDialog,
    handleOpenAllergyDialog,
    handleCloseAllergyDialog,
  };
}
