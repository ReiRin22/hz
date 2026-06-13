"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useGlobalHeaderInit } from "../../hooks/useGlobalHeaderInit";
import { useGlobalHeaderActions } from "../../hooks/useGlobalHeaderActions";
import { useGlobalHeaderSubmit } from "../../hooks/useGlobalHeaderSubmit";
import { usePatientData } from "../../hooks/usePatientData";
import { useAppEventHandlers } from "../../hooks/useAppEventHandlers";
import { useAutoLogout } from "@shared/hooks/useAutoLogout";

import { useGlobalHeaderStore } from "../../stores/use-global-header.store";
import { currentUser as fallbackUser } from "../../assets/medical-data";

import { GlobalHeader } from "./GlobalHeader";
import { PatientHeaderOrganism } from "../../../01_patient-header/components/organisms/PatientHeaderOrganism";
import { NewPatientBadge } from "../molecules/NewPatientBadge";
import { StickyNotesDialogMolecule } from "../molecules/StickyNotesDialogMolecule";
import { TempSaveDialogMolecule } from "../molecules/TempSaveDialogMolecule";
import { AlertsDialogMolecule } from "../molecules/AlertsDialogMolecule";
import { MenuSettingsDialogMolecule } from "../molecules/MenuSettingsDialogMolecule";
import { isNewPatient } from "../../utils/patient-utils";

export function GlobalHeaderOrganism() {
  useGlobalHeaderInit();

  const actions = useGlobalHeaderActions();
  const { handleDismissAlert } = useGlobalHeaderSubmit();

  const storeCurrentUser = useGlobalHeaderStore((s) => s.currentUser);
  const userAlerts = useGlobalHeaderStore((s) => s.userAlerts);
  const darkMode = useGlobalHeaderStore((s) => s.darkMode);
  const autoSaveEnabled = useGlobalHeaderStore((s) => s.autoSaveEnabled);
  const alertsEnabled = useGlobalHeaderStore((s) => s.alertsEnabled);
  const themeColor = useGlobalHeaderStore((s) => s.themeColor);
  const autoLogoutEnabled = useGlobalHeaderStore((s) => s.autoLogoutEnabled);
  const autoLogoutTimeout = useGlobalHeaderStore((s) => s.autoLogoutTimeout);
  const autoLogoutWarningTime = useGlobalHeaderStore((s) => s.autoLogoutWarningTime);
  const setSelectedRecord = useGlobalHeaderStore((s) => s.setSelectedRecord);

  const currentUser = storeCurrentUser ?? fallbackUser;

  const { currentPatient, currentRecord, setCurrentRecord, changePatient, resetToNewRecord } = usePatientData();

  const handleLogout = () => {
    toast.success("自動ログアウトしました", { description: "セキュリティのため自動ログアウトしました。" });
    setTimeout(() => { window.location.reload(); }, 2000);
  };

  const autoLogoutResult = useAutoLogout({
    timeout: autoLogoutTimeout,
    warningDuration: autoLogoutWarningTime,
    enabled: autoLogoutEnabled,
    onLogout: handleLogout,
  });

  const eventHandlers = useAppEventHandlers({
    currentPatient,
    currentRecord,
    setCurrentRecord,
    resetToNewRecord,
    changePatient,
    setSelectedRecord,
    setOrders: () => {},
    setHasUnsavedChanges: () => {},
    setShowExternalRecordsDialog: () => {},
    setShowHealthCheckupDialog: () => {},
    orders: [],
  });

  const handleExtendSession = () => { autoLogoutResult?.extendSession?.(); };

  // Dialog open state (UI only — no store)
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [tempDataCount, setTempDataCount] = useState(3);
  const [isTempDataOpen, setIsTempDataOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isMenuSettingsOpen, setIsMenuSettingsOpen] = useState(false);

  useEffect(() => {
    return () => { useGlobalHeaderStore.getState().reset(); };
  }, []);

  return (
    <>
      <GlobalHeader
        currentUser={currentUser}
        userAlerts={userAlerts}
        darkMode={darkMode}
        autoSaveEnabled={autoSaveEnabled}
        onAutoSave={eventHandlers.handleAutoSave}
        alertsEnabled={alertsEnabled}
        autoLogoutEnabled={autoLogoutEnabled}
        autoLogoutTimeout={autoLogoutTimeout}
        autoLogoutWarningTime={autoLogoutWarningTime}
        isAutoLogoutWarningVisible={autoLogoutResult?.isWarningVisible || false}
        autoLogoutRemainingTime={autoLogoutResult?.remainingTime || 0}
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
        themeColor={themeColor}
        stickyNotesCount={0}
        tempDataCount={tempDataCount}
        unreadAlertsCount={userAlerts.filter((a) => !a.dismissed).length}
        onNotesOpen={() => setIsNotesOpen(true)}
        onTempDataOpen={() => setIsTempDataOpen(true)}
        onAlertsOpen={() => setIsAlertsOpen(true)}
        onMenuSettingsOpen={() => setIsMenuSettingsOpen(true)}
      />

      <StickyNotesDialogMolecule
        isOpen={isNotesOpen}
        onOpenChange={setIsNotesOpen}
        onCountChange={() => {}}
      />

      <TempSaveDialogMolecule
        isOpen={isTempDataOpen}
        onOpenChange={setIsTempDataOpen}
        count={tempDataCount}
        onCountChange={setTempDataCount}
      />

      <AlertsDialogMolecule
        isOpen={isAlertsOpen}
        onOpenChange={setIsAlertsOpen}
        userAlerts={userAlerts}
        onDismissAlert={handleDismissAlert}
      />

      <MenuSettingsDialogMolecule
        isOpen={isMenuSettingsOpen}
        onOpenChange={setIsMenuSettingsOpen}
        themeColor={themeColor}
        onThemeColorChange={actions.handleThemeColorChange}
        darkMode={darkMode}
        autoSaveEnabled={autoSaveEnabled}
        alertsEnabled={alertsEnabled}
        autoLogoutEnabled={autoLogoutEnabled}
        autoLogoutTimeout={autoLogoutTimeout}
        onDarkModeToggle={actions.handleDarkModeToggle}
        onAutoSaveToggle={actions.handleAutoSaveToggle}
        onAutoSave={eventHandlers.handleAutoSave}
        onAlertsToggle={actions.handleAlertsToggle}
        onAutoLogoutToggle={actions.handleAutoLogoutToggle}
        onAutoLogoutTimeoutChange={actions.handleAutoLogoutTimeoutChange}
      />

      <div className="min-h-[calc(100vh-48px)]">
        <PatientHeaderOrganism />
        <NewPatientBadge show={isNewPatient(currentPatient.patientId)} />
      </div>

      {process.env.NODE_ENV === "development" && autoLogoutEnabled && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          自動ログアウト: {autoLogoutResult?.isActive ? "有効" : "無効"} | {autoLogoutTimeout}分
        </div>
      )}
    </>
  );
}
