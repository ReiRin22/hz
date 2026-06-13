'use client';

/**
 * オーダー関連ダイアログ管理フック
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/hooks/useOrderDialogs.ts
 */

import { useState } from 'react';
import type { AllergyWarning } from '../types/order-shared.types';

export function useOrderDialogs() {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [setRegistrationDialogOpen, setSetRegistrationDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [setName, setSetName] = useState('');
  const [selectedOrdersForSet, setSelectedOrdersForSet] = useState<string[]>([]);

  // アレルギー警告ダイアログ
  const [allergyWarningOpen, setAllergyWarningOpen] = useState(false);
  const [allergyWarnings, setAllergyWarnings] = useState<AllergyWarning[]>([]);

  // 造影剤アレルギー警告ダイアログ
  const [contrastAllergyWarningOpen, setContrastAllergyWarningOpen] = useState(false);
  const [contrastAllergyInstructions, setContrastAllergyInstructions] = useState('');

  // 帳票印刷確認ダイアログ
  const [printConfirmDialogOpen, setPrintConfirmDialogOpen] = useState(false);
  const [selectedReports, setSelectedReports] = useState({
    imaging: true,
    imagingConsent: false,
    imagingExplanation: false
  });

  return {
    saveDialogOpen,
    setSaveDialogOpen,
    loadDialogOpen,
    setLoadDialogOpen,
    setRegistrationDialogOpen,
    setSetRegistrationDialogOpen,
    saveName,
    setSaveName,
    setName,
    setSetName,
    selectedOrdersForSet,
    setSelectedOrdersForSet,
    allergyWarningOpen,
    setAllergyWarningOpen,
    allergyWarnings,
    setAllergyWarnings,
    contrastAllergyWarningOpen,
    setContrastAllergyWarningOpen,
    contrastAllergyInstructions,
    setContrastAllergyInstructions,
    printConfirmDialogOpen,
    setPrintConfirmDialogOpen,
    selectedReports,
    setSelectedReports
  };
}
