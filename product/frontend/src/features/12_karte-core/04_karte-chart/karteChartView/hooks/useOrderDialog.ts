'use client';

/**
 * カルテ機能 - オーダーダイアログ管理フック
 *
 * 参照元: 【ORD032～ORD035】src/components/features/chart/hooks/useOrderDialog.ts
 */

import { useState } from 'react';

export function useOrderDialog(
  onShowImagingOrderPanelChange?: (show: boolean) => void
) {
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const openOrderDialog = () => {
    setIsOrderDialogOpen(true);
  };

  const closeOrderDialog = () => {
    setIsOrderDialogOpen(false);
  };

  const handleOrderTypeSelect = (typeId: string) => {
    setIsOrderDialogOpen(false);

    if (typeId === 'imaging') {
      if (onShowImagingOrderPanelChange) {
        onShowImagingOrderPanelChange(true);
      }
    }
  };

  return {
    isOrderDialogOpen,
    openOrderDialog,
    closeOrderDialog,
    handleOrderTypeSelect,
  };
}
