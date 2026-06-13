'use client';
import { Shield } from "lucide-react";
import { ConsultationStatusMolecule } from "./ConsultationStatusMolecule";
import { PatientStatusBarMolecule } from "./PatientStatusBarMolecule";
import type { PatientViewModel } from "@/shared/types/patient-header/patient-header.type";
import type { PrescriptionStatus } from "./PrescriptionStatusBadge";

type PrivacyModePanelMoleculeProps = {
  patient: PatientViewModel;
  isConsultationStarted: boolean;
  onConsultationToggle: () => void;
  onPrescriptionClick: () => void;
  onMedicalInfoSharingClick: () => void;
};

export function PrivacyModePanelMolecule({
  patient,
  isConsultationStarted,
  onConsultationToggle,
  onPrescriptionClick,
  onMedicalInfoSharingClick,
}: PrivacyModePanelMoleculeProps) {
  return (
    <div className="flex flex-col space-y-2 px-6 py-4 bg-purple-50 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-700 rounded-lg">
      <div className="flex items-center space-x-2">
        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <span className="font-bold text-purple-800 dark:text-purple-300">個人情報保護措置</span>
      </div>
      <p className="text-sm text-purple-700 dark:text-purple-400">
        すべての個人情報が非表示になっています
      </p>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 mt-2 pt-2 border-t border-purple-200 dark:border-purple-800">
        <ConsultationStatusMolecule
          consultationStatus={patient.consultationStatus}
          isConsultationStarted={isConsultationStarted}
          onConsultationToggle={onConsultationToggle}
        />
        <PatientStatusBarMolecule
          prescriptionStatus={patient.prescriptionStatus as PrescriptionStatus}
          medicalInfoSharing={patient.medicalInfoSharing}
          isPrivacyMode={true}
          onPrescriptionClick={onPrescriptionClick}
          onMedicalInfoSharingClick={onMedicalInfoSharingClick}
        />
      </div>
    </div>
  );
}
