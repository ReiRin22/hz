'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useGlobalHeaderStore } from '../stores/use-global-header.store';
import { dismissAlert } from '../repository/globalHeader.repository';

export function useGlobalHeaderSubmit() {
  const [isDismissing, setIsDismissing] = useState(false);
  const userAlerts = useGlobalHeaderStore((s) => s.userAlerts);
  const setUserAlerts = useGlobalHeaderStore((s) => s.setUserAlerts);

  const handleDismissAlert = useCallback(async (alertId: string) => {
    const snapshot = userAlerts;
    setIsDismissing(true);
    setUserAlerts(
      userAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
    try {
      await dismissAlert(alertId);
      toast.success('アラートを非表示にしました');
    } catch {
      setUserAlerts(snapshot);
      toast.error('アラートの非表示に失敗しました');
    } finally {
      setIsDismissing(false);
    }
  }, [userAlerts, setUserAlerts]);

  return { isDismissing, handleDismissAlert };
}
