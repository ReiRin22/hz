'use client';
import { useState } from "react";
import { toast } from "sonner";
import type { UserAlert } from "../types/patient-types";
import { initialUserAlerts } from "../constants/medical-data";

export function useUserAlerts() {
  const [userAlerts, setUserAlerts] = useState<UserAlert[]>(initialUserAlerts);

  const dismissUserAlert = (alertId: string) => {
    setUserAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, dismissed: true }
          : alert
      )
    );
    toast.success('アラートを非表示にしました');
  };

  const addUserAlert = (alert: Omit<UserAlert, 'id' | 'timestamp' | 'dismissed' | 'userId'>, userId: string) => {
    const newAlert: UserAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      dismissed: false,
      userId
    };
    setUserAlerts(prev => [newAlert, ...prev]);
  };

  const activeAlertsCount = userAlerts.filter(alert => !alert.dismissed).length;

  return {
    userAlerts,
    dismissUserAlert,
    addUserAlert,
    activeAlertsCount
  };
}