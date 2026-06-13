'use client';

import { useState } from 'react';
import { OrderTypeKey, OrderSetType } from '@/shared/types/left-sidemenu/menu.types';

export function useGlobalMenuState(initialShowOrderSubmenu = false) {
  const [showOrderSubmenu, setShowOrderSubmenu] = useState(initialShowOrderSubmenu);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [patientInfoOpen, setPatientInfoOpen] = useState(false);
  const [setDialogOpen, setSetDialogOpen] = useState(false);
  const [activeOrderType, setActiveOrderType] = useState<OrderTypeKey>('prescription');
  const [selectedSetOrderType, setSelectedSetOrderType] = useState<OrderTypeKey>('prescription');
  const [activeSetTab, setActiveSetTab] = useState<OrderSetType>('my-set');

  return {
    showOrderSubmenu,
    setShowOrderSubmenu,
    isCollapsed,
    setIsCollapsed,
    patientInfoOpen,
    setPatientInfoOpen,
    setDialogOpen,
    setSetDialogOpen,
    activeOrderType,
    setActiveOrderType,
    selectedSetOrderType,
    setSelectedSetOrderType,
    activeSetTab,
    setActiveSetTab,
  };
}
