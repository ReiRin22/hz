'use client';
import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { useAuthStore } from "@/shared/stores/use-auth.store";
import { Card } from "@/shared/components/atoms/card";
import { Button } from "@/shared/components/atoms/button";
import {
  usePatientHeaderInit,
  usePatientHeaderActions,
  usePatientHeaderSubmit,
} from "../../hooks/use-patient-header";
import { usePatientHeaderStore } from "../../stores/use-patient-header.store";
import { PatientAvatarMolecule } from "../molecules/PatientAvatarMolecule";
import { PatientInfoGridMolecule } from "../molecules/PatientInfoGridMolecule";
import { PatientAlertsMolecule } from "../molecules/PatientAlertsMolecule";
import { PrivacyModePanelMolecule } from "../molecules/PrivacyModePanelMolecule";
import { NewPatientBadge } from "../molecules/NewPatientBadge";
import { PatientDetailDialog } from "./PatientDetailDialog";
import { DiagnosisRegistrationDialog } from "./DiagnosisRegistrationDialog";
import { MedicationHistoryDialog } from "./MedicationHistoryDialog";
import { ImageViewerDialog } from "./ImageViewerDialog";
import { TestResultsDialog } from "./TestResultsDialog";
import { PatientSearchDialog } from "./PatientSearchDialog";
import { PrescriptionSettingsDialog } from "./PrescriptionSettingsDialog";
import { MedicalInfoSharingDialog } from "./MedicalInfoSharingDialog";
import { PatientMemoDialog } from "./PatientMemoDialog";
import { ProxyInputConfirmDialog } from "./ProxyInputConfirmDialog";

// デフォルトの患者ID（実際はルートパラメータやグローバル状態から取得）
const DEFAULT_PATIENT_ID = "P001";

export function PatientHeaderOrganism() {
  // ストアから状態取得
  const patient = usePatientHeaderStore((s) => s.patient);
  const dialogs = usePatientHeaderStore((s) => s.dialogs);
  const isLoading = usePatientHeaderStore((s) => s.isLoading);

  // フック呼び出し
  usePatientHeaderInit(DEFAULT_PATIENT_ID);
  const { handleOpenDialog, handleCloseDialog, handlePatientSelect, handlePatientSearch } =
    usePatientHeaderActions();
  const { handlePrescriptionStatusChange, handleMedicalInfoSharingChange } =
    usePatientHeaderSubmit();

  // ローカル UI 状態
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [isConsultationStarted, setIsConsultationStarted] = useState(false);
  const [admissionType, setAdmissionType] = useState<"inpatient" | "outpatient">(
    patient?.admissionType ?? "outpatient"
  );

  // ストアアンマウントリセット
  useEffect(() => {
    return () => {
      usePatientHeaderStore.getState().reset();
    };
  }, []);

  const { userName, role } = useAuthStore();
  const orderingPhysician = role === "doctor" ? userName : null;

  if (isLoading || !patient) {
    return (
      <div className="w-full min-h-28 flex items-center justify-center bg-white dark:bg-gray-900 border-b shadow-lg">
        <span className="text-muted-foreground text-sm">読み込み中...</span>
      </div>
    );
  }

  const isNewPatient = patient.isNewPatient;

  return (
    <>
      <Card className={`w-full min-h-28 flex items-start px-8 py-3 mb-6 ${
        isPrivacyMode
          ? 'bg-gradient-to-r from-purple-100 via-purple-200/80 to-purple-100 dark:from-purple-950 dark:via-purple-900/80 dark:to-purple-950'
          : 'bg-gradient-to-r from-white via-gray-50/80 to-white dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900'
      } border-0 shadow-lg backdrop-blur-sm relative overflow-hidden`}>
        {/* 背景装飾 */}
        <div className={`absolute inset-0 ${
          isPrivacyMode
            ? 'bg-gradient-to-r from-purple-500/10 to-purple-700/10'
            : 'bg-gradient-to-r from-blue-500/3 to-blue-700/3'
        } pointer-events-none`} />
        <div className={`absolute top-0 left-0 w-full h-1 ${
          isPrivacyMode
            ? 'bg-gradient-to-r from-purple-600 to-purple-800'
            : 'bg-gradient-to-r from-blue-600 to-blue-800'
        }`} />

        <div className="flex items-start justify-between w-full relative z-10 mt-1">
          <div className="flex items-start space-x-6">
            {/* アバター & 患者名 */}
            <PatientAvatarMolecule
              name={patient.name}
              kana={patient.kana}
              patientId={patient.patientId}
              gender={patient.gender}
              isPrivacyMode={isPrivacyMode}
              onPrivacyToggle={() => setIsPrivacyMode((prev) => !prev)}
              onPatientIdClick={() => handleOpenDialog("patientSearch")}
            />

            {/* 患者情報グリッド or プライバシーモードパネル */}
            {!isPrivacyMode ? (
              <PatientInfoGridMolecule
                patient={patient}
                admissionType={admissionType}
                isConsultationStarted={isConsultationStarted}
                orderingPhysician={orderingPhysician}
                onAdmissionTypeToggle={() =>
                  setAdmissionType((prev) => (prev === "inpatient" ? "outpatient" : "inpatient"))
                }
                onConsultationToggle={() => setIsConsultationStarted((prev) => !prev)}
                onMemoClick={() => handleOpenDialog("patientMemo")}
                onProxyInputClick={() => handleOpenDialog("proxyInputConfirm")}
                onPrescriptionClick={() => handleOpenDialog("prescriptionSettings")}
                onMedicalInfoSharingClick={() => handleOpenDialog("medicalInfoSharing")}
              />
            ) : (
              <PrivacyModePanelMolecule
                patient={patient}
                isConsultationStarted={isConsultationStarted}
                onConsultationToggle={() => setIsConsultationStarted((prev) => !prev)}
                onPrescriptionClick={() => handleOpenDialog("prescriptionSettings")}
                onMedicalInfoSharingClick={() => handleOpenDialog("medicalInfoSharing")}
              />
            )}
          </div>

          {/* アクションボタン */}
          <div className="flex items-center space-x-3 self-center">
            {!isPrivacyMode && (
              <PatientAlertsMolecule
                allergies={patient.allergies}
                infections={patient.infections}
                radiationExposure={patient.radiationExposure}
              />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenDialog("patientDetail")}
              className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm medical-border-primary hover:medical-bg-primary hover:border-blue-300 dark:hover:bg-blue-950 transition-all duration-200 shadow-sm hover:shadow-md px-3 py-1.5 h-8"
            >
              <Eye className="w-3.5 h-3.5 medical-text-primary" />
              <span className="text-xs font-medium">詳細表示</span>
            </Button>
          </div>
        </div>
      </Card>

      <NewPatientBadge show={isNewPatient} />

      {/* ダイアログ群 */}
      <PatientDetailDialog
        patient={patient}
        isOpen={dialogs.patientDetail}
        onClose={() => handleCloseDialog("patientDetail")}
        latestTestResults={[]}
      />

      <DiagnosisRegistrationDialog
        isOpen={dialogs.diagnosisRegistration}
        onClose={() => handleCloseDialog("diagnosisRegistration")}
        patientId={patient.patientId}
        patientName={patient.name}
        onDiagnosisRegistration={() => {}}
      />

      <MedicationHistoryDialog
        isOpen={dialogs.medicationHistory}
        onClose={() => handleCloseDialog("medicationHistory")}
        patientId={patient.patientId}
        patientName={patient.name}
        patientAllergies={patient.allergies}
        medicationHistory={[]}
      />

      <ImageViewerDialog
        isOpen={dialogs.imageViewer}
        onClose={() => handleCloseDialog("imageViewer")}
        patientId={patient.patientId}
        patientName={patient.name}
      />

      <TestResultsDialog
        isOpen={dialogs.testResults}
        onClose={() => handleCloseDialog("testResults")}
        patientId={patient.patientId}
        patientName={patient.name}
        testResults={[]}
      />

      <PatientSearchDialog
        isOpen={dialogs.patientSearch}
        onClose={() => handleCloseDialog("patientSearch")}
        onPatientSelect={handlePatientSelect}
        onSearch={handlePatientSearch}
      />

      <PrescriptionSettingsDialog
        isOpen={dialogs.prescriptionSettings}
        onClose={() => handleCloseDialog("prescriptionSettings")}
        patientId={patient.patientId}
        patientName={patient.name}
        currentStatus={patient.prescriptionStatus}
        onStatusChange={(status) => handlePrescriptionStatusChange({ status })}
      />

      <MedicalInfoSharingDialog
        isOpen={dialogs.medicalInfoSharing}
        onClose={() => handleCloseDialog("medicalInfoSharing")}
        patientId={patient.patientId}
        patientName={patient.name}
        currentData={patient.medicalInfoSharing}
        onDataChange={(data) =>
          handleMedicalInfoSharingChange({
            status: data.status,
            expiryDate: data.expiryDate,
            details: data.details,
          })
        }
      />

      <PatientMemoDialog
        isOpen={dialogs.patientMemo}
        onClose={() => handleCloseDialog("patientMemo")}
        patientId={patient.patientId}
        patientName={patient.name}
      />

      <ProxyInputConfirmDialog
        open={dialogs.proxyInputConfirm}
        onOpenChange={(open) =>
          open ? handleOpenDialog("proxyInputConfirm") : handleCloseDialog("proxyInputConfirm")
        }
        patientName={patient.name}
        primaryDoctorName={patient.doctor}
      />
    </>
  );
}
