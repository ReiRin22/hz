'use client';

import { useCallback } from 'react';
import DEP002Page from '@/features/09_dept-instruction/01_dept-instruction/02_lab-instruction';
import { useOrderConfirmStore } from '@/features/05_order/19_nursing-care-order/03_order-confirm/stores/orderConfirm.store';

export default function Page() {
  const updateDeptInstructionStatus = useOrderConfirmStore((s) => s.updateDeptInstructionStatus);

  const handleStatusUpdated = useCallback(
    (orderId: string, newStatus: string) => {
      updateDeptInstructionStatus(orderId, newStatus);
    },
    [updateDeptInstructionStatus],
  );

  return <DEP002Page onStatusUpdated={handleStatusUpdated} />;
}
