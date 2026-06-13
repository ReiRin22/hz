'use client';
import { PrescriptionStatusBadge, type PrescriptionStatus } from "./PrescriptionStatusBadge";
import { MedicalInfoSharingBadge } from "./MedicalInfoSharingBadge";
import type { PatientViewModel } from "@/shared/types/patient-header/patient-header.type";

type PatientStatusBarMoleculeProps = {
  prescriptionStatus: PrescriptionStatus;
  medicalInfoSharing: PatientViewModel["medicalInfoSharing"];
  isPrivacyMode: boolean;
  onPrescriptionClick: () => void;
  onMedicalInfoSharingClick: () => void;
};

export function PatientStatusBarMolecule({
  prescriptionStatus,
  medicalInfoSharing,
  isPrivacyMode,
  onPrescriptionClick,
  onMedicalInfoSharingClick,
}: PatientStatusBarMoleculeProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <span className="text-muted-foreground text-sm min-w-[60px]">処方箋:</span>
        <PrescriptionStatusBadge
          status={prescriptionStatus}
          onClick={onPrescriptionClick}
        />
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-muted-foreground text-sm min-w-[60px]">情報共有:</span>
        <div onClick={onMedicalInfoSharingClick} className="cursor-pointer">
          <MedicalInfoSharingBadge
            data={medicalInfoSharing}
            isPrivacyMode={isPrivacyMode}
          />
        </div>
      </div>
    </>
  );
}
