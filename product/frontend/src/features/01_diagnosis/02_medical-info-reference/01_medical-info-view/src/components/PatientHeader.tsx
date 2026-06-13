import { Badge } from "@/shared/components/atoms/badge";
import { Card } from "@/shared/components/atoms/card";
import { Button } from "@/shared/components/atoms/button";
import { Avatar, AvatarFallback } from "@/shared/components/atoms/avatar";
import { AlertTriangle, Eye, Shield, Calendar, MapPin, CreditCard, Stethoscope, Search, Clock, CheckCircle, Pause, XCircle } from "lucide-react";
import { useState } from "react";
import { PatientDetailDialog } from "./PatientDetailDialog";
import { DiagnosisRegistrationDialog } from "./DiagnosisRegistrationDialog";
import { MedicationHistoryDialog } from "./MedicationHistoryDialog";
import { ImageViewerDialog } from "./ImageViewerDialog";
import { TestResultsDialog } from "./TestResultsDialog";
import { PatientSearchDialog } from "./PatientSearchDialog";
import { PrescriptionStatusBadge, type PrescriptionStatus } from "./PrescriptionStatusBadge";
import { PrescriptionSettingsDialog } from "./PrescriptionSettingsDialog";
import { MedicalInfoSharingBadge } from "./MedicalInfoSharingBadge";
import { MedicalInfoSharingDialog } from "./MedicalInfoSharingDialog";

interface Patient {
  name: string;
  kana: string;
  patientId: string;
  birthDate: string;
  gender: string;
  age: number;
  department: string;
  ward: string;
  room: string;
  doctor: string;
  allergies: string[];
  infections: string[];
  consultationStatus: "waiting" | "in-progress" | "completed" | "postponed" | "cancelled";
  insurance: {
    type: string;
    number: string;
    burden: string;
  };
  prescriptionStatus?: PrescriptionStatus;
}

interface TestResult {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
}



interface PatientHeaderProps {
  patient: Patient;
  latestTestResults: TestResult[];
  onDocumentCreate: (type: string) => void;
  onTemplateLoad: (template: string) => void;
  onDiagnosisRegistration?: (diagnosisData: any) => void;
  onMedicationHistoryView?: () => void;
  medicationHistory?: any[];
  onTestResultsView?: () => void;
  testResults?: any[];
  imageCount?: number;
  onPatientSelect?: (patientId: string) => void;
  allPatients?: Patient[];
  onSetManagementOpen?: () => void;
  onPrescriptionStatusChange?: (patientId: string, newStatus: PrescriptionStatus) => void;
  onMedicalInfoSharingChange?: (patientId: string, newData: any) => void;
}

export function PatientHeader({
  patient,
  latestTestResults,
  onDocumentCreate,
  onTemplateLoad,
  onDiagnosisRegistration,
  onMedicationHistoryView,
  medicationHistory = [],
  onTestResultsView,
  testResults = [],
  imageCount = 0,
  onPatientSelect,
  allPatients = [],
  onSetManagementOpen,
  onPrescriptionStatusChange,
  onMedicalInfoSharingChange
}: PatientHeaderProps) {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDiagnosisDialog, setShowDiagnosisDialog] = useState(false);
  const [showMedicationDialog, setShowMedicationDialog] = useState(false);
  const [showImageViewerDialog, setShowImageViewerDialog] = useState(false);
  const [showTestResultsDialog, setShowTestResultsDialog] = useState(false);
  const [showPatientSearchDialog, setShowPatientSearchDialog] = useState(false);
  const [showPrescriptionSettingsDialog, setShowPrescriptionSettingsDialog] = useState(false);
  const [showMedicalInfoSharingDialog, setShowMedicalInfoSharingDialog] = useState(false);

  // 患者の名前から初期文字を取得
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // 性別による色分け（テーマカラーに合わせて調整）
  const getGenderColor = (gender: string) => {
    return gender === "男性" ? "medical-primary" : "bg-pink-500";
  };

  // 診察ステータスの表示情報を取得
  const getConsultationStatusInfo = (status: string) => {
    switch (status) {
      case "waiting":
        return {
          icon: Clock,
          label: "診察待ち",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          iconColor: "text-yellow-600"
        };
      case "in-progress":
        return {
          icon: Stethoscope,
          label: "診察中",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          iconColor: "text-blue-600"
        };
      case "completed":
        return {
          icon: CheckCircle,
          label: "診察終了",
          color: "bg-green-100 text-green-800 border-green-200",
          iconColor: "text-green-600"
        };
      case "postponed":
        return {
          icon: Pause,
          label: "診察延期",
          color: "bg-orange-100 text-orange-800 border-orange-200",
          iconColor: "text-orange-600"
        };
      case "cancelled":
        return {
          icon: XCircle,
          label: "診察中止",
          color: "bg-red-100 text-red-800 border-red-200",
          iconColor: "text-red-600"
        };
      default:
        return {
          icon: Clock,
          label: "未設定",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          iconColor: "text-gray-600"
        };
    }
  };

  // 病名登録の処理
  const handleDiagnosisRegistration = (diagnosisData: any) => {
    // 病名データを処理（実際のアプリケーションでは患者データベースに保存）
    console.log('病名登録:', diagnosisData);
    
    // 親コンポーネントのハンドラーが存在する場合は呼び出す
    if (onDiagnosisRegistration) {
      onDiagnosisRegistration(diagnosisData);
    }
  };

  // 患者検索の処理
  const handlePatientSelect = (patientId: string) => {
    if (onPatientSelect) {
      onPatientSelect(patientId);
    }
  };

  // 処方箋ステータス変更の処理
  const handlePrescriptionStatusChange = (newStatus: PrescriptionStatus) => {
    console.log(`処方箋ステータス変更: ${patient.patientId} → ${newStatus}`);
    // 実際のアプリケーションでは、ここでサーバーAPIを呼び出してデータベースを更新
    if (onPrescriptionStatusChange) {
      onPrescriptionStatusChange(patient.patientId, newStatus);
    }
  };

  // 医療情報共有変更の処理
  const handleMedicalInfoSharingChange = (newData: any) => {
    console.log(`医療情報共有変更: ${patient.patientId}`, newData);
    // 実際のアプリケーションでは、ここでサーバーAPIを呼び出してデータベースを更新
    if (onMedicalInfoSharingChange) {
      onMedicalInfoSharingChange(patient.patientId, newData);
    }
  };

  return (
    <>
      <Card className="w-full min-h-24 flex items-center px-8 mb-6 bg-gradient-to-r from-white via-gray-50/80 to-white dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900 border-0 shadow-lg backdrop-blur-sm relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-blue-700/3 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
        
        <div className="flex items-center justify-between w-full relative z-10">
          <div className="flex items-center space-x-8">
            {/* アバター & 患者名 */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className={`w-16 h-16 ${getGenderColor(patient.gender)} border-4 border-white dark:border-gray-800 shadow-lg`}>
                  <AvatarFallback className="text-white text-lg font-bold">
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 medical-secondary border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              
              <div className="flex flex-col">
                {/* 患者IDバッジ（クリック可能） - 上部の青線と重ならないように余白追加 */}
                <div className="mt-2 mb-1">
                  <Badge 
                    variant="outline" 
                    className="text-[12px] medical-border-primary medical-text-primary medical-bg-primary cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group"
                    onClick={() => setShowPatientSearchDialog(true)}
                  >
                    <Search className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    ID: {patient.patientId}
                  </Badge>
                </div>
                
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {patient.name}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{patient.kana}</div>
              </div>
            </div>
            
            {/* 患者情報グリッド - レスポンシブ3カラムレイアウト */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
              {/* 基本情報 */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 medical-text-primary" />
                  <span className="text-muted-foreground">生年月日:</span>
                  <span className="font-medium">{patient.birthDate}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Badge variant="secondary" className="text-xs">
                    {patient.age}歳 {patient.gender}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 medical-text-secondary" />
                  <span className="text-muted-foreground">病室:</span>
                  <Badge className="medical-secondary-light text-white text-xs">
                    {patient.ward} {patient.room}
                  </Badge>
                </div>
              </div>
              
              {/* 医療情報 */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Stethoscope className="w-4 h-4 text-purple-500" />
                  <span className="text-muted-foreground">診療科:</span>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 text-xs">
                    {patient.department}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">主治医:</span>
                  <span className="font-medium">{patient.doctor}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <CreditCard className="w-4 h-4 text-orange-500" />
                  <span className="text-muted-foreground">保険:</span>
                  <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 dark:border-orange-800 dark:text-orange-300 dark:bg-orange-950 text-xs">
                    {patient.insurance.type}
                  </Badge>
                </div>
              </div>

              {/* システム設定情報 */}
              <div className="space-y-2">
                {/* 診察ステータス */}
                <div className="flex items-center space-x-2 text-sm">
                  {(() => {
                    const statusInfo = getConsultationStatusInfo(patient.consultationStatus);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <>
                        <StatusIcon className={`w-4 h-4 ${statusInfo.iconColor}`} />
                        <span className="text-muted-foreground">診察:</span>
                        <Badge className={`border ${statusInfo.color} text-xs`}>
                          {statusInfo.label}
                        </Badge>
                      </>
                    );
                  })()}
                </div>

                {/* 処方箋発行形態ステータス */}
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">処方箋:</span>
                  <PrescriptionStatusBadge
                    status={patient.prescriptionStatus || "electronic"}
                    onClick={() => setShowPrescriptionSettingsDialog(true)}
                  />
                </div>

                {/* 医療情報共有同意ステータス */}
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">情報共有:</span>
                  <div onClick={() => setShowMedicalInfoSharingDialog(true)} className="cursor-pointer">
                    <MedicalInfoSharingBadge
                      data={patient.medicalInfoSharing || { status: "no-consent" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* アレルギー・感染症アラート（基本情報の近くに配置） */}
            <div className="flex items-center space-x-1.5">
              {patient.allergies.length > 0 && (
                <div className="flex items-center space-x-1 p-1.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md shadow-sm">
                  <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                    <AlertTriangle className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <Badge variant="destructive" className="text-xs font-medium mb-0.5 px-1 py-0 text-[12px]">
                      アレルギー
                    </Badge>
                    <span className="text-xs text-red-700 dark:text-red-300 font-medium truncate max-w-[120px]">
                      {patient.allergies.slice(0, 2).join(", ")}
                      {patient.allergies.length > 2 && "..."}
                    </span>
                  </div>
                </div>
              )}
              
              {patient.infections.length > 0 && (
                <div className="flex items-center space-x-1 p-1.5 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 rounded-md shadow-sm">
                  <div className="flex items-center justify-center w-5 h-5 bg-orange-500 rounded-full">
                    <Shield className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <Badge className="bg-orange-500 text-white text-xs font-medium mb-0.5 px-1 py-0 text-[12px]">
                      感染症
                    </Badge>
                    <span className="text-xs text-orange-700 dark:text-orange-300 font-medium truncate max-w-[120px]">
                      {patient.infections.slice(0, 2).join(", ")}
                      {patient.infections.length > 2 && "..."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* アクションボタン */}
          <div className="flex items-center space-x-3">
            {/* 詳細表示ボタン（コンパクトサイズ） */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetailDialog(true)}
              className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm medical-border-primary hover:medical-bg-primary hover:border-blue-300 dark:hover:bg-blue-950 transition-all duration-200 shadow-sm hover:shadow-md px-3 py-1.5 h-8"
            >
              <Eye className="w-3.5 h-3.5 medical-text-primary" />
              <span className="text-xs font-medium">詳細表示</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 患者詳細ダイアログ */}
      <PatientDetailDialog
        patient={patient}
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        latestTestResults={latestTestResults}
      />

      {/* 病名登録ダイアログ */}
      <DiagnosisRegistrationDialog
        isOpen={showDiagnosisDialog}
        onClose={() => setShowDiagnosisDialog(false)}
        patientId={patient.patientId}
        patientName={patient.name}
        onDiagnosisRegistration={handleDiagnosisRegistration}
      />

      {/* 薬歴参照ダイアログ */}
      <MedicationHistoryDialog
        isOpen={showMedicationDialog}
        onClose={() => setShowMedicationDialog(false)}
        patientId={patient.patientId}
        patientName={patient.name}
        patientAllergies={patient.allergies || []}
        medicationHistory={medicationHistory}
      />

      {/* 画像参照ダイアログ */}
      <ImageViewerDialog
        isOpen={showImageViewerDialog}
        onClose={() => setShowImageViewerDialog(false)}
        patientId={patient.patientId}
        patientName={patient.name}
      />

      {/* 検査結果参照ダイアログ */}
      <TestResultsDialog
        isOpen={showTestResultsDialog}
        onClose={() => setShowTestResultsDialog(false)}
        patientId={patient.patientId}
        patientName={patient.name}
        testResults={testResults}
      />

      {/* 患者検索ダイアログ */}
      <PatientSearchDialog
        isOpen={showPatientSearchDialog}
        onClose={() => setShowPatientSearchDialog(false)}
        onPatientSelect={handlePatientSelect}
        allPatients={allPatients}
      />

      {/* 処方箋設定ダイアログ */}
      <PrescriptionSettingsDialog
        isOpen={showPrescriptionSettingsDialog}
        onClose={() => setShowPrescriptionSettingsDialog(false)}
        patientId={patient.patientId}
        patientName={patient.name}
        currentStatus={patient.prescriptionStatus || "electronic"}
        onStatusChange={handlePrescriptionStatusChange}
      />

      {/* 医療情報共有設定ダイアログ */}
      <MedicalInfoSharingDialog
        isOpen={showMedicalInfoSharingDialog}
        onClose={() => setShowMedicalInfoSharingDialog(false)}
        patientId={patient.patientId}
        patientName={patient.name}
        currentData={patient.medicalInfoSharing || { status: "no-consent" }}
        onDataChange={handleMedicalInfoSharingChange}
      />
    </>
  );
}