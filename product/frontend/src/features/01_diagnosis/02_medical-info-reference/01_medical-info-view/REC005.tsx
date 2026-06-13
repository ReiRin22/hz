"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// レイアウトコンポーネント（直接インポート）
import { GlobalHeader } from "./src/components/GlobalHeader";
import { PatientHeader } from "./src/components/PatientHeader";
import { MainContentTabs } from "./src/components/MainContentTabs";

// 医療機能コンポーネント
import { ExternalMedicalRecordsDialog } from "./src/components/ExternalMedicalRecordsDialog";
import { HealthCheckupDialog } from "./src/components/HealthCheckupDialog";
import { SetManagementDashboard } from "./src/components/SetManagementDashboard";

// その他のコンポーネント
import { NewPatientBadge } from "./src/components/NewPatientBadge";

// カスタムフック
import { usePatientData } from "./src/hooks/usePatientData";
import { useAppEventHandlers } from "./src/hooks/useAppEventHandlers";
import { useKeyboardShortcuts } from "./src/hooks/useKeyboardShortcuts";
import { useUserAlerts } from "./src/hooks/useUserAlerts";
import { useAutoLogout } from "./src/hooks/useAutoLogout";

// ユーティリティ関数
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

// 定数
import { currentUser, patientDatabase } from "./src/constants/medical-data";

// 型定義
import type { Order } from "./src/types";
import type { RegisteredSet, SetApplyOptions } from "./src/types/set-registration-types";

export default function REC005Page() {
  // カスタムフックの使用
  const {
    currentPatient,
    progressRecords,
    handoverItems,
    currentRecord,
    setCurrentRecord,
    changePatient,
    resetToNewRecord,
    addProgressRecord,
    addHandoverItem,
    markHandoverAsRead,
    markHandoverAsResolved
  } = usePatientData();

  const { userAlerts, dismissUserAlert } = useUserAlerts();

  // ローカル状態
  const [selectedRecord, setSelectedRecord] = useState<any>();  // Record | Record[] | undefined
  const [showExternalRecordsDialog, setShowExternalRecordsDialog] = useState(false);
  const [showHealthCheckupDialog, setShowHealthCheckupDialog] = useState(false);
  const [showSetManagementDialog, setShowSetManagementDialog] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("records");

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

  // セット登録関連のイベントハンドラー
  const handleSetManagementOpen = () => {
    setShowSetManagementDialog(true);
  };

  const handleSetApply = (set: RegisteredSet, options: SetApplyOptions) => {
    try {
      // SOAP記録の適用
      if (set.comprehensive?.medicalRecord || set.medicalRecord) {
        const medicalRecord = set.comprehensive?.medicalRecord || set.medicalRecord;
        if (medicalRecord) {
          if (options.overwrite) {
            // 完全上書き
            const newSoapRecord = [
              medicalRecord.subjective ? `S (Subjective - 主観的情報):\n${medicalRecord.subjective}` : '',
              medicalRecord.objective ? `\nO (Objective - 客観的情報):\n${medicalRecord.objective}` : '',
              medicalRecord.assessment ? `\nA (Assessment - 評価・診断):\n${medicalRecord.assessment}` : '',
              medicalRecord.plan ? `\nP (Plan - 計画・治療方針):\n${medicalRecord.plan}` : '',
            ].filter(Boolean).join('\n');
            
            setCurrentRecord(prev => ({
              ...prev,
              soapRecord: newSoapRecord
            }));
          } else if (options.merge) {
            // マージ（空文字列の場合は単純に適用、既存内容がある場合は追加）
            const hasExistingContent = currentRecord.soapRecord.trim().length > 0;
            const parts = [];
            
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
            
            setCurrentRecord(prev => ({
              ...prev,
              soapRecord: prev.soapRecord + parts.join('\n')
            }));
          }
        }
      }

      // オーダーセットの適用
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
    // 実際のアプリケーションでは、患者データベースの更新処理を行います
    toast.success(`処方箋発行形態を変更しました`, {
      description: `患者ID: ${patientId} → ${newStatus === 'electronic' ? '電子処方箋' : newStatus === 'paper' ? '紙処方箋' : '未連携'}`
    });
  };

  // 医療情報共有変更
  const handleMedicalInfoSharingChange = (patientId: string, newData: any) => {
    console.log(`医療情報共有変更: ${patientId}`, newData);
    // 実際のアプリケーションでは、患者データベースの更新処理を行います
    const statusLabels = {
      'full-consent': 'すべて同意',
      'partial-consent': '一部同意', 
      'no-consent': '同意しない'
    };
    toast.success(`医療情報共有設定を変更しました`, {
      description: `患者ID: ${patientId} → ${statusLabels[newData.status as keyof typeof statusLabels]}`
    });
  };

  // 計算値
  const allPatients = Object.values(patientDatabase);
  const isCurrentDay = !selectedRecord;
  const unreadHandoverCount = handoverItems.filter(item => !item.isRead).length;

  // データ取得
  const medicationHistory = getCurrentPatientMedications(currentPatient.patientId);
  const testResults = getCurrentDetailedTestResults(currentPatient.patientId);
  const imageCount = getPatientImageCount(currentPatient.patientId);
  const statsData = getStatsData(currentPatient);

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

  // setter関数群
  const setters = {
    setCurrentRecord,
    setOrders,
    setHasUnsavedChanges
  };

  return (
    <div className="min-h-screen bg-background">
      {/* グローバルヘッダー */}
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
        onSetManagementOpen={handleSetManagementOpen}
      />
      
      {/* メインアプリケーション */}
      <div className="min-h-[calc(100vh-48px)]">
        <PatientHeader 
          patient={currentPatient} 
          latestTestResults={getCurrentTestResults(currentPatient.patientId)}
          onDocumentCreate={eventHandlers.handleDocumentCreate}
          onTemplateLoad={eventHandlers.handleTemplateLoad}
          onDiagnosisRegistration={eventHandlers.handleDiagnosisRegistration}
          onMedicationHistoryView={eventHandlers.handleMedicationHistoryView}
          medicationHistory={medicationHistory}
          onTestResultsView={eventHandlers.handleTestResultsView}
          testResults={testResults}
          imageCount={imageCount}
          onPatientSelect={eventHandlers.handlePatientSelect}
          allPatients={allPatients}
          onSetManagementOpen={handleSetManagementOpen}
          onPrescriptionStatusChange={handlePrescriptionStatusChange}
          onMedicalInfoSharingChange={handleMedicalInfoSharingChange}
        />

        <NewPatientBadge show={isNewPatient(currentPatient.patientId)} />

        <div className="min-h-[calc(100vh-200px)] p-2">
          <MainContentTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            unreadHandoverCount={unreadHandoverCount}
            currentPatient={currentPatient}
            selectedRecord={selectedRecord}
            currentRecord={currentRecord}
            orders={orders}
            hasUnsavedChanges={hasUnsavedChanges}
            isCurrentDay={isCurrentDay}
            progressRecords={progressRecords}
            handoverItems={handoverItems}
            currentUser={currentUser}
            statsData={statsData}
            handlers={eventHandlers}
            setters={setters}
            onAddProgress={addProgressRecord}
            onAddHandover={addHandoverItem}
            onMarkAsRead={markHandoverAsRead}
            onMarkAsResolved={markHandoverAsResolved}
            medicationHistory={medicationHistory}
            testResults={testResults}
            imageCount={imageCount}
            onSetManagementOpen={handleSetManagementOpen}
          />
        </div>
      </div>

      {/* ダイアログ */}
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

      {/* 開発用デバッグ表示 */}
      {process.env.NODE_ENV === 'development' && autoLogoutEnabled && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          自動ログアウト: {autoLogoutResult?.isActive ? '有効' : '無効'} | {autoLogoutTimeout}分
        </div>
      )}
    </div>
  );
}