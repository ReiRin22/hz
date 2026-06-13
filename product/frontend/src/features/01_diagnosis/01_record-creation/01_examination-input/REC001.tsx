"use client";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";

import { GlobalHeader } from "./components/GlobalHeader";
import { PatientHeader } from "./components/PatientHeader";
import { MainContentTabs } from "./components/MainContentTabs";
import { RightSideMenu } from "./components/RightSideMenu";
import { LeftSideMenu } from "./components/LeftSideMenu";
import { ORD001Wrapper } from "./components/ORD001Wrapper";
import { ExternalMedicalRecordsDialog } from "./components/ExternalMedicalRecordsDialog";
import { HealthCheckupDialog } from "./components/HealthCheckupDialog";
import { SetManagementDashboard } from "./components/SetManagementDashboard";
import { DraggableMedicationDialog } from "./components/DraggableMedicationDialog";
import { PatientListOverlay } from "./components/PatientListOverlay";

// カスタムフック
import { usePatientData } from "./hooks/usePatientData";
import { useAppEventHandlers } from "./hooks/useAppEventHandlers";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useUserAlerts } from "./hooks/useUserAlerts";
import { useAutoLogout } from "./hooks/useAutoLogout";

// ユーティリティ関数（将来のコンポーネント配線で使用）
import {
  isNewPatient,
  getPatientImageCount,
  getCurrentPatientMedications,
  getCurrentPatientExternalRecords,
  getCurrentPatientHealthCheckups,
  getCurrentTestResults,
  getCurrentDetailedTestResults,
  getStatsData
} from "./src/utils/patient-utils";

import { currentUser, patientDatabase } from "./src/constants/medical-data";

import type { Order } from "./types";
import type { RegisteredSet, SetApplyOptions } from "./types/set-registration-types";

export default function REC001Page() {
  const {
    currentPatient,
    progressRecords,
    handoverItems,
    currentRecord,
    setCurrentRecord,
    changePatient,
    resetToNewRecord,
    addProgressRecord,
    updateProgressRecord,
    addHandoverItem,
    markHandoverAsRead,
    markHandoverAsResolved
  } = usePatientData();

  const { userAlerts, dismissUserAlert } = useUserAlerts();

  // ローカル状態
  const [selectedRecord, setSelectedRecord] = useState<string | undefined>();
  const [showExternalRecordsDialog, setShowExternalRecordsDialog] = useState(false);
  const [showHealthCheckupDialog, setShowHealthCheckupDialog] = useState(false);
  const [showSetManagementDialog, setShowSetManagementDialog] = useState(false);
  const [showMedicationHistoryDialog, setShowMedicationHistoryDialog] = useState(false);
  const [showPatientList, setShowPatientList] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("records");
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem(`harz_user_${currentUser.id}_fontSize`);
    return saved || 'normal';
  });

  // 左メニューのビュー切り替え
  type ViewType = 'chart' | 'order' | 'prescription' | 'injection' | 'lab' | 'treatment' | 'guidance' | 'physiology' | 'endoscopy' | 'imaging' | 'pathology' | 'bacteriology' | 'general' | 'composite' | 'meal' | 'rehabilitation' | 'transfusion' | 'surgery' | 'dialysis' | 'admission' | 'discharge' | 'transfer' | 'nursingCare' | 'results' | 'external-info' | 'consultation' | 'patient' | 'document' | 'appointment';
  const [currentView, setCurrentView] = useState<ViewType>('chart');

  // 自動ログアウト関連の状態
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(false);
  const [autoLogoutTimeout, setAutoLogoutTimeout] = useState(30);
  const [autoLogoutWarningTime] = useState(60);

  // ログアウト処理
  const handleLogout = () => {
    console.log('自動ログアウトを実行します');
    toast.success('自動ログアウトしました', {
      description: 'セキュリティのため自動ログアウトしました。'
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  // 自動ログアウトフック
  const autoLogoutResult = useAutoLogout({
    timeout: autoLogoutTimeout,
    warningDuration: autoLogoutWarningTime,
    enabled: autoLogoutEnabled,
    onLogout: handleLogout
  });

  // イベントハンドラー
  const eventHandlers = useAppEventHandlers({
    currentPatient,
    currentRecord,
    setCurrentRecord,
    resetToNewRecord,
    changePatient,
    setSelectedRecord,
    setOrders,
    setHasUnsavedChanges,
    setShowExternalRecordsDialog,
    setShowHealthCheckupDialog,
    orders
  });

  // セット登録
  const handleSetManagementOpen = () => {
    setShowSetManagementDialog(true);
  };

  const handleSetApply = (set: RegisteredSet, options: SetApplyOptions) => {
    try {
      if (set.comprehensive?.medicalRecord || set.medicalRecord) {
        const medicalRecord = set.comprehensive?.medicalRecord || set.medicalRecord;
        if (medicalRecord) {
          if (options.overwrite) {
            const newSoapRecord = [
              medicalRecord.subjective ? `S (Subjective - 主観的情報):\n${medicalRecord.subjective}` : '',
              medicalRecord.objective ? `\nO (Objective - 客観的情報):\n${medicalRecord.objective}` : '',
              medicalRecord.assessment ? `\nA (Assessment - 評価・診断):\n${medicalRecord.assessment}` : '',
              medicalRecord.plan ? `\nP (Plan - 計画・治療方針):\n${medicalRecord.plan}` : '',
            ].filter(Boolean).join('\n');
            setCurrentRecord(prev => ({ ...prev, soapRecord: newSoapRecord }));
          } else if (options.merge) {
            const hasExistingContent = currentRecord.soapRecord.trim().length > 0;
            const parts: string[] = [];
            if (hasExistingContent && medicalRecord.subjective) {
              parts.push(`\n\n--- セット追加: ${set.name} ---`);
              parts.push(`S: ${medicalRecord.subjective}`);
            } else if (medicalRecord.subjective) {
              parts.push(`S (Subjective - 主観的情報):\n${medicalRecord.subjective}`);
            }
            if (medicalRecord.objective) {
              const prefix = hasExistingContent ? 'O: ' : '\nO (Objective - 客観的情報):\n';
              parts.push(`${prefix}${medicalRecord.objective}`);
            }
            if (medicalRecord.assessment) {
              const prefix = hasExistingContent ? 'A: ' : '\nA (Assessment - 評価・診断):\n';
              parts.push(`${prefix}${medicalRecord.assessment}`);
            }
            if (medicalRecord.plan) {
              const prefix = hasExistingContent ? 'P: ' : '\nP (Plan - 計画・治療方針):\n';
              parts.push(`${prefix}${medicalRecord.plan}`);
            }
            setCurrentRecord(prev => ({ ...prev, soapRecord: prev.soapRecord + parts.join('\n') }));
          }
        }
      }
      if (set.comprehensive?.orderSet || set.orderSet) {
        const orderSet = set.comprehensive?.orderSet || set.orderSet;
        if (orderSet?.orders) {
          const newOrders: Order[] = orderSet.orders.map((orderTemplate, index) => ({
            id: `order_${Date.now()}_${index}`,
            type: orderTemplate.type as any,
            name: orderTemplate.name,
            dosage: orderTemplate.dosage,
            frequency: orderTemplate.frequency,
            duration: orderTemplate.duration,
            instructions: orderTemplate.instructions,
            priority: orderTemplate.priority,
            amount: orderTemplate.amount,
            status: 'PENDING',
            createdAt: new Date(),
            createdBy: currentUser.id
          }));
          if (options.overwrite) {
            setOrders(newOrders);
          } else {
            setOrders(prev => [...prev, ...newOrders]);
          }
        }
      }
      setHasUnsavedChanges(true);
      toast.success(`セット「${set.name}」を適用しました`, {
        description: `${set.learningData?.avgTimeSaving || 0}秒の時短効果が期待されます`
      });
    } catch (error) {
      console.error('セット適用エラー:', error);
      toast.error('セットの適用に失敗しました');
    }
  };
  // ─────────────────────────────────────────────────────────────────────────────

  // 健診記録表示切替
  const handleHealthCheckupVisibilityToggle = (checkupId: string, visible: boolean) => {
    console.log(`健診記録 ${checkupId} の表示を ${visible ? '有効' : '無効'} に設定`);
    toast.success(`健診記録の表示を${visible ? '有効' : '無効'}にしました`);
  };

  // 自動ログアウト設定変更
  const handleAutoLogoutToggle = () => {
    const newState = !autoLogoutEnabled;
    setAutoLogoutEnabled(newState);
    if (newState) {
      toast.success('自動ログアウト機能を有効にしました', {
        description: `${autoLogoutTimeout}分間無操作でログアウトします`
      });
    } else {
      toast.info('自動ログアウト機能を無効にしました');
    }
  };

  const handleAutoLogoutTimeoutChange = (minutes: number) => {
    setAutoLogoutTimeout(minutes);
    toast.info(`自動ログアウト時間を${minutes}分に変更しました`);
  };

  const handleExtendSession = () => {
    if (autoLogoutResult?.extendSession) {
      autoLogoutResult.extendSession();
    }
  };

  // 処方箋ステータス変更
  const handlePrescriptionStatusChange = (patientId: string, newStatus: "electronic" | "paper" | "disconnected") => {
    console.log(`処方箋ステータス変更: ${patientId} → ${newStatus}`);
    toast.success(`処方箋発行形態を変更しました`, {
      description: `患者ID: ${patientId} → ${newStatus === 'electronic' ? '電子処方箋' : newStatus === 'paper' ? '紙処方箋' : '未連携'}`
    });
  };

  // 医療情報共有変更
  const handleMedicalInfoSharingChange = (patientId: string, newData: any) => {
    console.log(`医療情報共有変更: ${patientId}`, newData);
    const statusLabels = {
      'full-consent': 'すべて同意',
      'partial-consent': '一部同意',
      'no-consent': '同意しない'
    };
    toast.success(`医療情報共有設定を変更しました`, {
      description: `患者ID: ${patientId} → ${statusLabels[newData.status as keyof typeof statusLabels]}`
    });
  };

  // フォントサイズ変更
  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem(`harz_user_${currentUser.id}_fontSize`, size);
    const sizeLabels = { 'normal': '標準', 'large': '大', 'xlarge': '特大' };
    toast.success(`文字サイズを変更しました`, {
      description: `${sizeLabels[size as keyof typeof sizeLabels]}に設定されました`
    });
  };

  // 計算値
  const unreadHandoverCount = handoverItems.filter(item => !item.isRead).length;

  // キーボードショートカット
  useKeyboardShortcuts({
    hasUnsavedChanges,
    orders,
    handleBulkSave: eventHandlers.handleBulkSave,
    handleNewRecordMode: eventHandlers.handleNewRecordMode
  });

  // ダークモード切替
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // フォントサイズ適用
  useEffect(() => {
    const fontSizeScale = { 'normal': 1.0, 'large': 1.25, 'xlarge': 1.5 };
    const scale = fontSizeScale[fontSize as keyof typeof fontSizeScale] || 1.0;
    document.documentElement.style.setProperty('--font-size-scale', scale.toString());
  }, [fontSize]);

  // ビュー切り替えハンドラー
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);

    const viewLabels: Record<ViewType, string> = {
      'chart': 'カルテ',
      'order': 'オーダー',
      'prescription': '処方オーダー',
      'injection': '注射オーダー',
      'lab': '検体オーダー',
      'treatment': '処置オーダー',
      'guidance': '指導オーダー',
      'physiology': '生理検査オーダー',
      'endoscopy': '内視鏡検査オーダー',
      'imaging': '画像検査オーダー',
      'pathology': '病理検査オーダー',
      'bacteriology': '細菌検査オーダー',
      'general': '汎用オーダー',
      'composite': '複合オーダー',
      'meal': '食事オーダー',
      'rehabilitation': 'リハビリオーダー',
      'transfusion': '輸血オーダー',
      'surgery': '手術オーダー',
      'dialysis': '透析オーダー',
      'admission': '入院オーダー',
      'discharge': '退院オーダー',
      'transfer': '転棟転科転室オーダー',
      'nursingCare': '看護ケアオーダー',
      'results': '検査結果',
      'external-info': '他院情報',
      'consultation': '他科依頼',
      'patient': '患者情報',
      'document': '文書管理',
      'appointment': '予約管理'
    };

    if (view !== 'chart') {
      toast.info(`${viewLabels[view]}画面に切り替えました`);
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* 左サイドメニュー */}
      <LeftSideMenu onViewChange={handleViewChange} currentView={currentView} />

      {/* メインコンテンツ */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {currentView === 'chart' && (
          /* グローバルヘッダー - カルテ表示時のみ */
          <GlobalHeader
            currentUser={currentUser}
            userAlerts={userAlerts}
            onDismissAlert={dismissUserAlert}
            darkMode={darkMode}
            onDarkModeToggle={() => setDarkMode(!darkMode)}
            autoSaveEnabled={autoSaveEnabled}
            onAutoSaveToggle={() => setAutoSaveEnabled(!autoSaveEnabled)}
            onAutoSave={eventHandlers.handleAutoSave}
            alertsEnabled={alertsEnabled}
            onAlertsToggle={() => setAlertsEnabled(!alertsEnabled)}
            autoLogoutEnabled={autoLogoutEnabled}
            onAutoLogoutToggle={handleAutoLogoutToggle}
            autoLogoutTimeout={autoLogoutTimeout}
            onAutoLogoutTimeoutChange={handleAutoLogoutTimeoutChange}
            autoLogoutWarningTime={autoLogoutWarningTime}
            isAutoLogoutWarningVisible={autoLogoutResult?.isWarningVisible || false}
            autoLogoutRemainingTime={autoLogoutResult?.remainingTime || 0}
            onExtendSession={handleExtendSession}
            onLogout={handleLogout}
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
          />
        )}

        {/* メインアプリケーション */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'chart' ? (
            /* REC001カルテ画面 */
            <>
              <PatientHeader
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                patient={currentPatient as any}
                latestTestResults={getCurrentTestResults(currentPatient.patientId)}
                onDocumentCreate={eventHandlers.handleDocumentCreate}
                onTemplateLoad={eventHandlers.handleTemplateLoad}
                onDiagnosisRegistration={eventHandlers.handleDiagnosisRegistration}
                onMedicationHistoryView={eventHandlers.handleMedicationHistoryView}
                medicationHistory={getCurrentPatientMedications(currentPatient.patientId)}
                onTestResultsView={eventHandlers.handleTestResultsView}
                testResults={getCurrentDetailedTestResults(currentPatient.patientId)}
                imageCount={getPatientImageCount(currentPatient.patientId)}
                onPatientSelect={eventHandlers.handlePatientSelect}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                allPatients={Object.values(patientDatabase) as any[]}
                onSetManagementOpen={handleSetManagementOpen}
                onPrescriptionStatusChange={handlePrescriptionStatusChange}
                onMedicalInfoSharingChange={handleMedicalInfoSharingChange}
              />

              <div className="min-h-[calc(100vh-200px)] p-2">
                <MainContentTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  unreadHandoverCount={unreadHandoverCount}
                  currentPatient={currentPatient}
                  currentRecord={currentRecord}
                  currentUser={currentUser}
                  statsData={getStatsData(currentPatient)}
                  handlers={{
                    handleRecordSelect: eventHandlers.handleRecordSelect
                  }}
                  setters={{
                    setCurrentRecord,
                    setOrders,
                    setHasUnsavedChanges
                  }}
                  onAddProgress={addProgressRecord}
                  onUpdateProgress={updateProgressRecord}
                  medicationHistory={getCurrentPatientMedications(currentPatient.patientId)}
                  testResults={getCurrentDetailedTestResults(currentPatient.patientId)}
                  imageCount={getPatientImageCount(currentPatient.patientId)}
                  onSetManagementOpen={handleSetManagementOpen}
                  onDocumentCreate={eventHandlers.handleDocumentCreate}
                  onTemplateLoad={eventHandlers.handleTemplateLoad}
                  onExternalRecordsView={() => setShowExternalRecordsDialog(true)}
                  onHealthCheckupView={() => setShowHealthCheckupDialog(true)}
                  onDiagnosisRegistration={() => eventHandlers.handleDiagnosisRegistration({})}
                  onMedicationHistoryView={() => setShowMedicationHistoryDialog(true)}
                  onImageViewing={() => eventHandlers.handleImageViewing()}
                  onTestResultsView={() => eventHandlers.handleTestResultsView()}
                />
              </div>
            </>
          ) : (
            /* ORD001オーダー画面 - GlobalMenuとSystemMenuを非表示 */
            <ORD001Wrapper currentView={currentView} />
          )}
        </div>


        <ExternalMedicalRecordsDialog
          isOpen={showExternalRecordsDialog}
          onClose={() => setShowExternalRecordsDialog(false)}
          patientName={currentPatient.name}
          patientId={currentPatient.patientId}
          externalRecords={getCurrentPatientExternalRecords(currentPatient.patientId)}
        />
        <HealthCheckupDialog
          isOpen={showHealthCheckupDialog}
          onClose={() => setShowHealthCheckupDialog(false)}
          patientName={currentPatient.name}
          patientId={currentPatient.patientId}
          healthCheckupRecords={getCurrentPatientHealthCheckups(currentPatient.patientId)}
          onToggleVisibility={handleHealthCheckupVisibilityToggle}
        />
        <SetManagementDashboard
          isOpen={showSetManagementDialog}
          onClose={() => setShowSetManagementDialog(false)}
          onApplySet={handleSetApply}
        />

        <DraggableMedicationDialog
          isOpen={showMedicationHistoryDialog}
          onClose={() => setShowMedicationHistoryDialog(false)}
        />

        <PatientListOverlay
          isOpen={showPatientList}
          onClose={() => setShowPatientList(false)}
        />

      </div>

      {/* 右サイドメニュー */}
      <RightSideMenu onPatientListClick={() => setShowPatientList(true)} />

      {/* 開発用デバッグ表示 - 右メニューの左側に配置 */}
      {process.env.NODE_ENV === 'development' && autoLogoutEnabled && (
        <div className="fixed bottom-4 right-[110px] bg-blue-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50">
          自動ログアウト: {autoLogoutResult?.isActive ? '有効' : '無効'} | {autoLogoutTimeout}分
        </div>
      )}

      <Toaster />
    </div>
  );
}
