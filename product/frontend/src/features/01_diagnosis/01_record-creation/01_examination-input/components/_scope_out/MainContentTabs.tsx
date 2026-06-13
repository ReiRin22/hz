import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { CheckCircle, BarChart3, Grid3X3 } from "lucide-react";
import { Card } from "@/shared/components/atoms/card";
import { MedicalRecordInput } from "./MedicalRecordInput";
import { OverviewMatrix } from "./OverviewMatrix";
import { StatsDashboard } from "./StatsDashboard";

// ─── 退避: 将来のコンポーネント実装で復元する ────────────────────────────────
// import { Button } from "@/shared/components/atoms/button";
// import { Bell, UserPlus, Pill } from "lucide-react";
// import { HistoricalRecords } from "./HistoricalRecords";
// import { RecordDetailPanel } from "./RecordDetailPanel";
// import { OrderInput } from "./OrderInput";
// import { MedicalAlerts } from "./MedicalAlerts";
// import { BulkSaveSection } from "./BulkSaveSection";
// import { MedicalCalendar } from "./MedicalCalendar";
// import { PrescriptionOrderModal, PrescriptionOrder } from "./PrescriptionOrderModal";
// import { isNewPatient, getCurrentPatientRecords } from "../src/utils/patient-utils";
// import { toast } from 'sonner';
// import { useState } from "react";
// ─────────────────────────────────────────────────────────────────────────────

interface MainContentTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadHandoverCount: number;
  currentPatient: any;
  currentRecord: any;
  currentUser: any;
  statsData: any;
  handlers: {
    handleRecordSelect: (record: any) => void;
  };
  setters: {
    setCurrentRecord: (record: any) => void;
    setOrders: (orders: any[]) => void;
    setHasUnsavedChanges: (hasChanges: boolean) => void;
  };
  onAddProgress: (record: any) => void;
  onUpdateProgress: (recordId: string, record: any) => void;
  // ─── 退避: 将来のコンポーネント実装で復元する ───────────────────────────────
  // selectedRecord: string | undefined;
  // orders: any[];
  // hasUnsavedChanges: boolean;
  // isCurrentDay: boolean;
  // progressRecords: any[];
  // handoverItems: any[];
  // onAddHandover: (item: any) => void;
  // onMarkAsRead: (id: string) => void;
  // onMarkAsResolved: (id: string) => void;
  // ────────────────────────────────────────────────────────────────────────────
}

export function MainContentTabs({
  activeTab,
  setActiveTab,
  unreadHandoverCount: _unreadHandoverCount,
  currentPatient,
  currentRecord,
  currentUser,
  statsData,
  handlers,
  setters,
  onAddProgress,
  onUpdateProgress,
  // ─── 退避: 将来のコンポーネント実装で復元する ───────────────────────────────
  // selectedRecord,
  // orders,
  // hasUnsavedChanges,
  // isCurrentDay,
  // progressRecords,
  // handoverItems,
  // onAddHandover,
  // onMarkAsRead,
  // onMarkAsResolved,
  // ────────────────────────────────────────────────────────────────────────────
}: MainContentTabsProps) {

  // ─── 退避: 将来のコンポーネント実装で復元する ────────────────────────────────
  // const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  //
  // const handleReuseRecord = (item: any) => {
  //   setActiveTab("records");
  //   let transferredContent = "";
  //   if (item.details && item.details.content) {
  //     transferredContent = `[${item.date} ${item.timestamp} 再利用記録]\n${item.details.content}`;
  //   } else {
  //     transferredContent = `[${item.date} ${item.timestamp} 再利用記録]\n${item.title}`;
  //   }
  //   if (item.details && item.details.soapRecord) {
  //     transferredContent += `\n\n--- SOAP記録 ---\n${item.details.soapRecord}`;
  //   }
  //   const newRecord = {
  //     ...currentRecord,
  //     subjectiveFindings: transferredContent,
  //     objectiveFindings: item.details?.objectiveFindings || "",
  //     assessment: item.details?.assessment || "",
  //     plan: item.details?.plan || "",
  //     originalRecordId: item.id,
  //     originalDate: item.date,
  //     transferredAt: new Date().toISOString()
  //   };
  //   setters.setCurrentRecord(newRecord);
  //   setters.setHasUnsavedChanges(true);
  // };
  //
  // const handleReuseOrder = (item: any) => {
  //   setActiveTab("records");
  //   const newOrder = {
  //     id: `reused_${item.id}_${Date.now()}`,
  //     type: item.category === "prescriptions" ? "prescription" :
  //           item.category === "tests" ? "lab" :
  //           item.category === "orders" ? "treatment" : "other",
  //     category: item.category,
  //     title: item.title,
  //     description: item.details?.content || `${item.title}（再利用）`,
  //     priority: item.priority,
  //     urgent: item.priority === "high",
  //     orderDetails: item.details?.orderDetails || "",
  //     originalRecordId: item.id,
  //     originalDate: item.date,
  //     transferredAt: new Date().toISOString(),
  //     status: "pending"
  //   };
  //   const updatedOrders = [...orders, newOrder];
  //   setters.setOrders(updatedOrders);
  //   setters.setHasUnsavedChanges(true);
  // };
  //
  // const handlePrescriptionOrderConfirm = (prescriptionOrders: PrescriptionOrder[]) => {
  //   const convertedOrders = prescriptionOrders.map(prescription => ({
  //     id: prescription.id,
  //     type: "prescription" as const,
  //     name: prescription.medicationName,
  //     dosage: `${prescription.dosage}${prescription.dosageUnit}`,
  //     frequency: prescription.frequency,
  //     duration: `${prescription.duration}${prescription.durationUnit}`,
  //     instructions: [
  //       prescription.route !== "内服" ? `投与経路: ${prescription.route}` : "",
  //       prescription.isRegular ? "定期投与" : "頓用投与",
  //       prescription.stopPreviousPrescription ? "以前の処方を中止" : "",
  //       prescription.dosageAdjustmentReason ? `調整理由: ${prescription.dosageAdjustmentReason}` : "",
  //       prescription.instructions || ""
  //     ].filter(Boolean).join("、"),
  //     priority: prescription.isRegular ? "通常" : "頓用",
  //     amount: "",
  //     status: 'PENDING' as const,
  //     createdAt: new Date(),
  //     createdBy: currentUser.id
  //   }));
  //   const updatedOrders = [...orders, ...convertedOrders];
  //   setters.setOrders(updatedOrders);
  //   setters.setHasUnsavedChanges(true);
  //   toast.success(`${prescriptionOrders.length}件の処方オーダーを追加しました`);
  // };
  //
  // const getPatientAllergies = () => {
  //   return [
  //     { id: "allergy_1", allergen: "ペニシリン", reaction: "発疹、呼吸困難", severity: "SEVERE" as const },
  //     { id: "allergy_2", allergen: "アスピリン", reaction: "胃腸障害", severity: "MODERATE" as const }
  //   ];
  // };
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="records" className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>診療記録</span>
        </TabsTrigger>
        <TabsTrigger value="overview" className="flex items-center space-x-2">
          <Grid3X3 className="w-4 h-4" />
          <span>診察オーバービュー</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4" />
          <span>バイタル・検査グラフ</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="records" className="mt-2">
        <div className="flex min-h-[calc(100vh-160px)] gap-3">
          {/* 左側: 履歴とカレンダー枠 */}
          <div className="w-[20%] space-y-4">
            <Card className="h-[50%] flex items-center justify-center text-gray-400 p-4">
              <div className="text-center">
                <div className="text-sm font-medium mb-1">過去記録一覧</div>
                <div className="text-xs">（実装予定）</div>
              </div>
            </Card>
            <Card className="h-[48%] flex items-center justify-center text-gray-400 p-4">
              <div className="text-center">
                <div className="text-sm font-medium mb-1">カレンダー</div>
                <div className="text-xs">（実装予定）</div>
              </div>
            </Card>
          </div>

          {/* 中央左: 記録詳細パネル枠 */}
          <div className="w-[25%] min-h-0">
            <Card className="h-full flex items-center justify-center text-gray-400 p-4">
              <div className="text-center">
                <div className="text-sm font-medium mb-1">記録詳細パネル</div>
                <div className="text-xs">（実装予定）</div>
              </div>
            </Card>
          </div>

          {/* 右側: メインコンテンツエリア */}
          <div className="w-[55%]">
            <div className="flex flex-col gap-3 h-full">
              <div className="flex gap-3 min-h-0 flex-1">
                {/* 記録入力（有効） */}
                <div className="w-[50%] min-h-0">
                  <MedicalRecordInput
                    record={currentRecord}
                    onRecordChange={setters.setCurrentRecord}
                    onSave={() => console.log("保存")}
                    onConfirm={onAddProgress}
                    onUpdate={onUpdateProgress}
                    isEditable={true}
                    onNewRecordMode={() => console.log("新規記録モード")}
                    selectedRecordId={undefined}
                    recordCreatedDate={undefined}
                    editablePeriodDays={30}
                    onRecordEdit={() => setters.setHasUnsavedChanges(true)}
                    onSetManagementOpen={() => console.log("セット管理")}
                    currentUser={currentUser}
                    currentPatientId={currentPatient.patientId}
                  />
                </div>

                {/* オーダー入力枠 */}
                <div className="w-[35%] min-h-0 space-y-3">
                  <Card className="h-full flex items-center justify-center text-gray-400 p-4">
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">オーダー入力</div>
                      <div className="text-xs">（実装予定）</div>
                    </div>
                  </Card>
                </div>

                {/* 操作枠 */}
                <div className="w-[15%] min-h-0">
                  <Card className="h-full flex items-center justify-center text-gray-400 p-4">
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">操作</div>
                      <div className="text-xs">（実装予定）</div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="overview" className="mt-2">
        <div className="h-[calc(100vh-160px)]">
          <OverviewMatrix
            currentPatient={currentPatient}
            onItemSelect={handlers.handleRecordSelect}
            onReuseRecord={(item: any) => {
              setActiveTab("records");
              // 記録の再利用処理
              console.log("記録再利用:", item);
            }}
            onReuseOrder={(item: any) => {
              setActiveTab("records");
              // オーダーの再利用処理
              console.log("オーダー再利用:", item);
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="stats" className="mt-2">
        <StatsDashboard data={statsData} />
      </TabsContent>

      {/* ─── 退避: 処方オーダーモーダル（将来の実装で復元する） ──────────────────
      <PrescriptionOrderModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        onConfirm={handlePrescriptionOrderConfirm}
        patientId={currentPatient.patientId}
        patientName={currentPatient.name}
        existingMedications={medicationHistory.map(med => med.medicationName)}
        allergies={getPatientAllergies()}
      />
      ─────────────────────────────────────────────────────────────────────────── */}
    </Tabs>
  );
}
