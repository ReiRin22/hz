import { AlertTriangle, Eye, Shield, Calendar, MapPin, CreditCard, Stethoscope, Search, Clock, CheckCircle, Pause, XCircle, EyeOff, StickyNote, Radiation, CalendarClock, User } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/shared/components/atoms/badge";
import { Card } from "@/shared/components/atoms/card";
import { Button } from "@/shared/components/atoms/button";
import { Avatar, AvatarFallback } from "@/shared/components/atoms/avatar";
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
import { PatientMemoDialog } from "./PatientMemoDialog";
import { ProxyInputConfirmDialog } from "./ProxyInputConfirmDialog";

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
  admissionType?: "inpatient" | "outpatient";
  radiationExposure?: {
    dose: number;
    unit: string;
    level: "low" | "moderate" | "high";
  };
  lastExamination?: {
    date: string;
    type: string;
  };
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
  const [showPatientMemoDialog, setShowPatientMemoDialog] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [isConsultationStarted, setIsConsultationStarted] = useState(false);
  const [admissionType, setAdmissionType] = useState<"inpatient" | "outpatient">(patient.admissionType || "outpatient");
  const [showProxyInputDialog, setShowProxyInputDialog] = useState(false);

  // 患者の名前から初期文字を取得
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // 入院/外来の切り替えハンドラー
  const toggleAdmissionType = () => {
    setAdmissionType(prev => prev === "inpatient" ? "outpatient" : "inpatient");
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
          label: "診察前",
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
      <Card className={`w-full min-h-28 flex items-start px-8 py-3 mb-6 ${isPrivacyMode ? 'bg-gradient-to-r from-purple-100 via-purple-200/80 to-purple-100 dark:from-purple-950 dark:via-purple-900/80 dark:to-purple-950' : 'bg-gradient-to-r from-white via-gray-50/80 to-white dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900'} border-0 shadow-lg backdrop-blur-sm relative overflow-hidden`}>
        {/* 背景装飾 */}
        <div className={`absolute inset-0 ${isPrivacyMode ? 'bg-gradient-to-r from-purple-500/10 to-purple-700/10' : 'bg-gradient-to-r from-blue-500/3 to-blue-700/3'} pointer-events-none`} />
        <div className={`absolute top-0 left-0 w-full h-1 ${isPrivacyMode ? 'bg-gradient-to-r from-purple-600 to-purple-800' : 'bg-gradient-to-r from-blue-600 to-blue-800'}`} />
        
        <div className="flex items-start justify-between w-full relative z-10 mt-1">
          <div className="flex items-start space-x-6">
            {/* アバター & 患者名 */}
            <div className="flex items-center space-x-4">
              <div 
                className="relative cursor-pointer group"
                onClick={() => setIsPrivacyMode(!isPrivacyMode)}
                title={isPrivacyMode ? "クリックして個人情報を表示" : "クリックして個人情報を非表示"}
              >
                <Avatar className={`w-16 h-16 ${getGenderColor(patient.gender)} border-4 border-white dark:border-gray-800 shadow-lg transition-all ${isPrivacyMode ? 'blur-sm' : ''}`}>
                  <AvatarFallback className="text-white text-lg font-bold">
                    {isPrivacyMode ? '?' : getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>
                
                {/* ホバー時のアイコン表示 */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {isPrivacyMode ? (
                    <Eye className="w-8 h-8 text-white" />
                  ) : (
                    <EyeOff className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
              
              <div className="flex flex-col">
                {/* 患者IDバッジ（クリック可能） - 上部の青線と重ならないように余白追加 */}
                <div className="mt-2 mb-1 flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className="text-[12px] medical-border-primary medical-text-primary medical-bg-primary cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group"
                    onClick={() => setShowPatientSearchDialog(true)}
                  >
                    <Search className="w-3 h-3 mr-1 text-blue-700 dark:text-blue-300" />
                    ID: {patient.patientId}
                  </Badge>
                  {/* VIP患者バッジ */}
                  {isPrivacyMode && (
                    <Badge className="bg-yellow-500 text-white text-[12px] animate-pulse">
                      VIP患者
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground font-medium">
                  {isPrivacyMode ? '●●●●●●' : patient.kana}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isPrivacyMode ? '匿名患者' : patient.name}
                </div>
              </div>
            </div>
            
            {/* 患者情報グリッド - レスポンシブ3カラムレイアウト */}
            {!isPrivacyMode ? (
              <div className="flex items-start space-x-8">
                {/* 左側：基本情報 */}
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-muted-foreground text-sm min-w-[70px]">生年月日:</span>
                    <span className="font-semibold text-base">{patient.birthDate.replace(/(\d{4})(?:\([^)]+\))?年(\d{1,2})月(\d{1,2})日/, (_, y, m, d) => `${y}/${m.padStart(2, '0')}/${d.padStart(2, '0')}`)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-muted-foreground text-sm min-w-[70px]">年齢/性別:</span>
                    <span className="font-semibold text-base">
                      {patient.age}歳 {patient.gender}
                    </span>
                  </div>
                  
                  <div className="whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPatientMemoDialog(true)}
                      className="flex items-center space-x-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm medical-border-primary hover:medical-bg-primary hover:border-blue-300 dark:hover:bg-blue-950 transition-all duration-200 shadow-sm hover:shadow-md px-2 py-0.5 h-6"
                    >
                      <StickyNote className="w-3.5 h-3.5 medical-text-primary" />
                      <span className="text-sm font-medium">診療メモ 0件</span>
                    </Button>
                  </div>
                </div>
                
                {/* 右側：病室・入外・保険、診療科情報、システム設定 */}
                <div className="grid gap-x-4 gap-y-1.5" style={{ gridTemplateColumns: "160px 170px 260px" }}>
                  {/* 病室・入外・保険 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="text-muted-foreground text-sm min-w-[48px]">病室:</span>
                      <span className="font-semibold text-base">
                        {patient.ward} {patient.room}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="text-muted-foreground text-sm min-w-[48px]">入/外:</span>
                      <Button 
                        onClick={toggleAdmissionType}
                        size="sm"
                        variant="outline"
                        className={`text-sm font-semibold h-7 px-3 transition-all ${
                          admissionType === "inpatient" 
                            ? "bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" 
                            : "bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 border-green-500 hover:bg-green-50 dark:hover:bg-green-950/30"
                        }`}>
                        {admissionType === "inpatient" ? "入院" : "外来"}
                      </Button>
                    </div>
                    
                    <div className={`flex items-center space-x-2 whitespace-nowrap ${
                      patient.insurance.type === "自費" 
                        ? "bg-orange-100 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-700 rounded-md px-2 py-1" 
                        : ""
                    }`}>
                      <span className={`text-sm min-w-[48px] ${
                        patient.insurance.type === "自費" 
                          ? "text-orange-700 dark:text-orange-300 font-medium" 
                          : "text-muted-foreground"
                      }`}>保険:</span>
                      <span className={`font-semibold text-base ${
                        patient.insurance.type === "自費" 
                          ? "text-orange-600 dark:text-orange-400" 
                          : ""
                      }`}>
                        {patient.insurance.type}
                      </span>
                    </div>
                  </div>
                  
                  {/* 診療科・主治医・指示医 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="text-muted-foreground text-sm min-w-[60px]">診療科:</span>
                      <span className="font-semibold text-base">
                        {patient.department}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="text-muted-foreground text-sm min-w-[60px]">主治医:</span>
                      <span className="font-semibold text-base">{patient.doctor}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="text-muted-foreground text-sm min-w-[60px]">指示医:</span>
                      <Badge 
                        variant="outline" 
                        className="text-base medical-border-primary medical-text-primary medical-bg-primary cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        onClick={() => setShowProxyInputDialog(true)}
                      >
                        鈴木 次郎
                      </Badge>
                    </div>
                  </div>

                  {/* システム設定情報 */}
                  <div className="space-y-1.5">
                    {/* 診察ステータス */}
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const statusInfo = getConsultationStatusInfo(patient.consultationStatus);
                        
                        return (
                          <>
                            <span className="text-muted-foreground text-sm min-w-[60px]">診察:</span>
                            {isConsultationStarted && (
                              <Badge className="border bg-green-100 text-green-800 border-green-200 text-sm px-2.5 py-0.5">
                                診察中
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant={isConsultationStarted ? "destructive" : "default"}
                              onClick={() => setIsConsultationStarted(!isConsultationStarted)}
                              className={`h-7 px-3 text-base transition-all ${
                                isConsultationStarted 
                                  ? "bg-red-500 hover:bg-red-600 text-white" 
                                  : "medical-primary text-white hover:bg-blue-700"
                              }`}
                            >
                              {isConsultationStarted ? "診察終了" : "診察開始"}
                            </Button>
                          </>
                        );
                      })()}
                    </div>

                    {/* 処方箋発行形態ステータス */}
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground text-sm min-w-[60px]">処方箋:</span>
                      <PrescriptionStatusBadge
                        status={patient.prescriptionStatus || "electronic"}
                        onClick={() => setShowPrescriptionSettingsDialog(true)}
                      />
                    </div>

                    {/* 医療情報共有同意ステータス */}
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground text-sm min-w-[60px]">情報共有:</span>
                      <div onClick={() => setShowMedicalInfoSharingDialog(true)} className="cursor-pointer">
                        <MedicalInfoSharingBadge
                          data={patient.medicalInfoSharing || { status: "no-consent" }}
                          isPrivacyMode={isPrivacyMode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-6 py-4 bg-purple-50 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-purple-800 dark:text-purple-300">個人情報保護措置</span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  すべての個人情報が非表示になっています
                </p>
                
                {/* システム設定情報のみ表示 */}
                <div className="grid grid-cols-3 gap-x-4 gap-y-2 mt-2 pt-2 border-t border-purple-200 dark:border-purple-800">
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
                        isPrivacyMode={isPrivacyMode}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* アクションボタン */}
          <div className="flex items-center space-x-3 self-center">
            {/* アレルギー・感染症アラート */}
            {!isPrivacyMode && (
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
                
                {/* 放射線被曝量 */}
                {patient.radiationExposure && (
                  <div className={`flex items-center space-x-1 p-1.5 border rounded-md shadow-sm ${
                    patient.radiationExposure.level === "high" 
                      ? "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800"
                      : patient.radiationExposure.level === "moderate"
                      ? "bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800"
                      : "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800"
                  }`}>
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full ${
                      patient.radiationExposure.level === "high" 
                        ? "bg-red-500"
                        : patient.radiationExposure.level === "moderate"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}>
                      <Radiation className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <Badge className={`text-xs font-medium mb-0.5 px-1 py-0 text-[12px] ${
                        patient.radiationExposure.level === "high" 
                          ? "bg-red-500 text-white"
                          : patient.radiationExposure.level === "moderate"
                          ? "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"
                      }`}>
                        放射線量（直近1年）
                      </Badge>
                      <span className={`text-xs font-medium truncate max-w-[120px] ${
                        patient.radiationExposure.level === "high" 
                          ? "text-red-700 dark:text-red-300"
                          : patient.radiationExposure.level === "moderate"
                          ? "text-yellow-700 dark:text-yellow-300"
                          : "text-green-700 dark:text-green-300"
                      }`}>
                        {patient.radiationExposure.dose}{patient.radiationExposure.unit}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
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

      {/* 患者メモダイアログ */}
      <PatientMemoDialog
        isOpen={showPatientMemoDialog}
        onClose={() => setShowPatientMemoDialog(false)}
        patientId={patient.patientId}
        patientName={patient.name}
      />

      {/* 代理入力確認ダイアログ */}
      <ProxyInputConfirmDialog
        open={showProxyInputDialog}
        onOpenChange={setShowProxyInputDialog}
        patientName={patient.name}
        primaryDoctorName={patient.doctor}
      />
    </>
  );
}