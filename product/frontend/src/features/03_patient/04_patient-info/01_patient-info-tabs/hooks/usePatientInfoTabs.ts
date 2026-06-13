import { useState, useCallback } from 'react';
import type { TabId } from '../constants/tabConfig';
import { ACCESSIBLE_TABS } from '../constants/tabConfig';
import type { UserRole } from '../types/patientInfo.type';

export function usePatientInfoTabs(userRole: UserRole) {
  const accessibleTabs = ACCESSIBLE_TABS[userRole];
  const [activeTab, setActiveTab] = useState<TabId>(accessibleTabs[0]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  const openCancelDialog = useCallback(() => {
    setCancelDialogOpen(true);
  }, []);

  const closeCancelDialog = useCallback(() => {
    setCancelDialogOpen(false);
  }, []);

  return {
    activeTab,
    accessibleTabs,
    cancelDialogOpen,
    handleTabChange,
    openCancelDialog,
    closeCancelDialog,
  };
}
