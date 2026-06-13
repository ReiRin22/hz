import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/atoms/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { Button } from "@/shared/components/atoms/button";
import { CheckCircle, BarChart3, Bell, UserPlus, Grid3X3, Pill } from "lucide-react";
import { HistoricalRecords } from "./HistoricalRecords";
import { RecordDetailPanel } from "./RecordDetailPanel";
import { MedicalRecordInput } from "./MedicalRecordInput";
import { OrderInput } from "./OrderInput";
import { HamburgerMenu } from "./HamburgerMenu";
import { StatsDashboard } from "./StatsDashboard";
import { MedicalAlerts } from "./MedicalAlerts";
import { BulkSaveSection } from "./BulkSaveSection";
import { MedicalCalendar } from "./MedicalCalendar";
import { PrescriptionOrderModal, PrescriptionOrder } from "./PrescriptionOrderModal";

import { OverviewMatrix } from "./OverviewMatrix";
import { isNewPatient, getCurrentPatientRecords } from "../utils/patient-utils";
import { toast } from "sonner";
import { useState } from "react";

interface MainContentTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadHandoverCount: number;
  currentPatient: any;
  selectedRecord: string | undefined;
  currentRecord: any;
  orders: any[];
  hasUnsavedChanges: boolean;
  isCurrentDay: boolean;
  progressRecords: any[];
  handoverItems: any[];
  currentUser: any;
  statsData: any;
  handlers: {
    handleRecordSelect: (record: any) => void;
    handleApplyRecord: (record: any) => void;
    handleRecordSave: () => void;
    handleOrdersSubmit: () => void;
    handleCloseRecordDetail: () => void;
    handleNewRecordMode: () => void;
    handleBulkSave: () => void;
    handleDocumentCreate: (type: string) => void;
    handleTemplateLoad: (template: string) => void;
    handleExternalRecordsView: () => void;
    handleHealthCheckupView: () => void;
    handleDiagnosisRegistration: (data: any) => void;
    handleMedicationHistoryView: () => void;
    handleImageViewing: () => void;
    handleTestResultsView: () => void;
    handleDateSelect: (date: string) => void;
    isSaving: boolean;
  };
  setters: {
    setCurrentRecord: (record: any) => void;
    setOrders: (orders: any[]) => void;
    setHasUnsavedChanges: (hasChanges: boolean) => void;
  };
  onAddProgress: (record: any) => void;
  onAddHandover: (item: any) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsResolved: (id: string) => void;
  medicationHistory: any[];
  testResults: any[];
  imageCount: number;
  onSetManagementOpen?: () => void;
}

export function MainContentTabs({
  activeTab,
  setActiveTab,
  unreadHandoverCount,
  currentPatient,
  selectedRecord,
  currentRecord,
  orders,
  hasUnsavedChanges,
  isCurrentDay,
  progressRecords,
  handoverItems,
  currentUser,
  statsData,
  handlers,
  setters,
  onAddProgress,
  onAddHandover,
  onMarkAsRead,
  onMarkAsResolved,
  medicationHistory,
  testResults,
  imageCount,
  onSetManagementOpen,
}: MainContentTabsProps) {
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // 記録再利用処理：診療記録入力画面に転記
  const handleReuseRecord = (item: any) => {
    // 診療記録タブに切り替え
    setActiveTab("records");
    
    // 記録の内容を構築
    let transferredContent = "";
    
    if (item.details && item.details.content) {
      transferredContent = `[${item.date} ${item.timestamp} 再利用記録]\n${item.details.content}`;
    } else {
      transferredContent = `[${item.date} ${item.timestamp} 再利用記録]\n${item.title}`;
    }

    // SOAPフォーマットがある場合は追加
    if (item.details && item.details.soapRecord) {
      transferredContent += `\n\n--- SOAP記録 ---\n${item.details.soapRecord}`;
    }

    // 現在の記録に内容を設定
    const newRecord = {
      ...currentRecord,
      subjectiveFindings: transferredContent,
      objectiveFindings: item.details?.objectiveFindings || "",
      assessment: item.details?.assessment || "",
      plan: item.details?.plan || "",
      // 元の記録情報を保持
      originalRecordId: item.id,
      originalDate: item.date,
      transferredAt: new Date().toISOString()
    };

    setters.setCurrentRecord(newRecord);
    setters.setHasUnsavedChanges(true);
    
    // 成功メッセージは OverviewMatrix で表示される
  };

  // オーダー再利用処理：オーダー入力画面に転記
  const handleReuseOrder = (item: any) => {
    // 診療記録タブに切り替え
    setActiveTab("records");
    
    // オーダー内容を構築
    const newOrder = {
      id: `reused_${item.id}_${Date.now()}`,
      type: item.category === "prescriptions" ? "prescription" : 
            item.category === "tests" ? "lab" : 
            item.category === "orders" ? "treatment" : "other",
      category: item.category,
      title: item.title,
      description: item.details?.content || `${item.title}（再利用）`,
      priority: item.priority,
      urgent: item.priority === "high",
      orderDetails: item.details?.orderDetails || "",
      // 元の記録情報を保持
      originalRecordId: item.id,
      originalDate: item.date,
      transferredAt: new Date().toISOString(),
      status: "pending"
    };

    // 既存のオーダーに追加
    const updatedOrders = [...orders, newOrder];
    setters.setOrders(updatedOrders);
    setters.setHasUnsavedChanges(true);
    
    // 成功メッセージは OverviewMatrix で表示される
  };

  // 処方オーダー確定処理
  const handlePrescriptionOrderConfirm = (prescriptionOrders: PrescriptionOrder[]) => {
    // 処方オーダーを通常のオーダー形式に変換
    const convertedOrders = prescriptionOrders.map(prescription => ({
      id: prescription.id,
      type: "prescription" as const,
      name: prescription.medicationName,
      dosage: `${prescription.dosage}${prescription.dosageUnit}`,
      frequency: prescription.frequency,
      duration: `${prescription.duration}${prescription.durationUnit}`,
      instructions: [
        prescription.route !== "内服" ? `投与経路: ${prescription.route}` : "",
        prescription.isRegular ? "定期投与" : "頓用投与",
        prescription.stopPreviousPrescription ? "以前の処方を中止" : "",
        prescription.dosageAdjustmentReason ? `調整理由: ${prescription.dosageAdjustmentReason}` : "",
        prescription.instructions || ""
      ].filter(Boolean).join("、"),
      priority: prescription.isRegular ? "通常" : "頓用",
      amount: "",
      status: 'PENDING' as const,
      createdAt: new Date(),
      createdBy: currentUser.id
    }));

    // 既存のオーダーに追加
    const updatedOrders = [...orders, ...convertedOrders];
    setters.setOrders(updatedOrders);
    setters.setHasUnsavedChanges(true);
    
    toast.success(`${prescriptionOrders.length}件の処方オーダーを追加しました`);
  };

  // 患者のアレルギー情報を取得（モック）
  const getPatientAllergies = () => {
    return [
      {
        id: "allergy_1",
        allergen: "ペニシリン",
        reaction: "発疹、呼吸困難",
        severity: "SEVERE" as const
      },
      {
        id: "allergy_2", 
        allergen: "アスピリン",
        reaction: "胃腸障害",
        severity: "MODERATE" as const
      }
    ];
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="records" className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>診療記録</span>
        </TabsTrigger>
        <TabsTrigger value="overview" className="flex items-center space-x-2">
          <Grid3X3 className="w-4 h-4" />
          <span>診療オーバービュー</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4" />
          <span>バイタル・検査グラフ</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="records" className="mt-2">
        <div className="flex min-h-[calc(100vh-160px)] gap-3">
          {/* 左カラム: 時系列記録 - 固定幅20% */}
          <div className="w-[20%] space-y-4">
            <HistoricalRecords
              records={getCurrentPatientRecords(currentPatient.patientId)}
              onRecordSelect={handlers.handleRecordSelect}
              selectedRecordId={selectedRecord}
              onApplyRecord={handlers.handleApplyRecord}
            />
          </div>

          {/* 中央カラム: 記録詳細パネル - 固定幅25% */}
          <div className="w-[25%] min-h-0">
            {selectedRecord && (() => {
              const foundRecord = getCurrentPatientRecords(currentPatient.patientId).find(r => r.id === selectedRecord);
              return foundRecord ? (
                <RecordDetailPanel
                  record={foundRecord}
                  onApplyRecord={handlers.handleApplyRecord}
                  onClose={handlers.handleCloseRecordDetail}
                />
              ) : (
                <Card className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-2 border-dashed border-red-300 dark:border-red-600">
                  <div className="text-center p-6 space-y-3">
                    <div className="text-red-600 dark:text-red-400">
                      選択された記録が見つかりません
                    </div>
                    <Button variant="outline" onClick={handlers.handleCloseRecordDetail}>
                      閉じる
                    </Button>
                  </div>
                </Card>
              );
            })() || (
              <Card className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center">
                    {isNewPatient(currentPatient.patientId) ? (
                      <UserPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
                    ) : (
                      <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 text-[12px]">
                      {isNewPatient(currentPatient.patientId) ? "新患記録エリア" : "記録詳細表示エリア"}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed text-[10px]">
                      {isNewPatient(currentPatient.patientId) ? (
                        <>
                          新患のため<br />
                          過去の記録はありません<br />
                          右側から新規記録を<br />
                          作成してください
                        </>
                      ) : (
                        <>
                          左側の時系列記録から<br />
                          項目を選択すると<br />
                          詳細情報が表示されます<br />
                          <span className="text-medical-primary font-medium">診療オーバービューからも<br />記録を再利用できます</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 border rounded-md ${
                    isNewPatient(currentPatient.patientId)
                      ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                      : "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                  }`}>
                    <span className={`text-xs font-medium ${
                      isNewPatient(currentPatient.patientId)
                        ? "text-green-700 dark:text-green-300"
                        : "text-blue-700 dark:text-blue-300"
                    }`}>
                      {isNewPatient(currentPatient.patientId) ? "新患モード" : "待機中"}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* 右カラム: 診療記録入力 + オーダ入力 + サイドメニュー - 固定幅55% */}
          <div className="w-[55%]">
            <div className="flex flex-col gap-3 h-full">
              {/* 診療記録入力とオーダー入力とサイドメニューを左右に配置 */}
              <div className="flex gap-3 min-h-0 flex-1">
                {/* 診療記録入力 (50%) */}
                <div className="w-[50%] min-h-0">
                  <MedicalRecordInput
                    record={currentRecord}
                    onRecordChange={setters.setCurrentRecord}
                    onSave={handlers.handleRecordSave}
                    isEditable={isCurrentDay}
                    onNewRecordMode={handlers.handleNewRecordMode}
                    selectedRecordId={selectedRecord}
                    onRecordEdit={() => setters.setHasUnsavedChanges(true)}
                    onSetManagementOpen={onSetManagementOpen}
                  />
                </div>
                
                {/* オーダー入力 (35%) */}
                <div className="w-[35%] min-h-0 space-y-3">
                  <OrderInput
                    orders={orders}
                    onOrdersChange={(newOrders) => {
                      setters.setOrders(newOrders);
                      setters.setHasUnsavedChanges(true);
                    }}
                    onSubmitOrders={handlers.handleOrdersSubmit}
                    onPrescriptionOrderOpen={() => setShowPrescriptionModal(true)}
                  />
                </div>

                {/* サイドメニュー (15%) */}
                <div className="w-[15%] min-h-0">
                  <HamburgerMenu
                    onDocumentCreate={handlers.handleDocumentCreate}
                    onTemplateLoad={handlers.handleTemplateLoad}
                    onExternalRecordsView={handlers.handleExternalRecordsView}
                    onHealthCheckupView={handlers.handleHealthCheckupView}
                    onDiagnosisRegistration={handlers.handleDiagnosisRegistration}
                    onMedicationHistoryView={handlers.handleMedicationHistoryView}
                    onImageViewing={handlers.handleImageViewing}
                    onTestResultsView={handlers.handleTestResultsView}
                    onSetManagementOpen={onSetManagementOpen}
                    onPrescriptionOrderOpen={() => setShowPrescriptionModal(true)}
                    medicationHistory={medicationHistory}
                    testResults={testResults}
                    imageCount={imageCount}
                  />
                </div>
              </div>
              
              {/* 一括保存セクション */}
              {(hasUnsavedChanges || orders.length > 0) && isCurrentDay && (
                <BulkSaveSection
                  currentPatient={currentPatient}
                  currentRecord={currentRecord}
                  orders={orders}
                  isSaving={handlers.isSaving}
                  onBulkSave={handlers.handleBulkSave}
                />
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="overview" className="mt-2">
        <div className="h-[calc(100vh-160px)]">
          <OverviewMatrix
            currentPatient={currentPatient}
            onItemSelect={handlers.handleRecordSelect}
            onReuseRecord={handleReuseRecord}
            onReuseOrder={handleReuseOrder}
          />
        </div>
      </TabsContent>

      <TabsContent value="stats" className="mt-2">
        <StatsDashboard data={statsData} />
      </TabsContent>
      
      {/* 処方オーダーモーダル */}
      <PrescriptionOrderModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        onConfirm={handlePrescriptionOrderConfirm}
        patientId={currentPatient.patientId}
        patientName={currentPatient.name}
        existingMedications={medicationHistory.map(med => med.medicationName)}
        allergies={getPatientAllergies()}
      />
    </Tabs>
  );
}