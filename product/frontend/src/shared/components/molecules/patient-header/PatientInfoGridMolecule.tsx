'use client';
import { StickyNote } from "lucide-react";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { ConsultationStatusMolecule } from "./ConsultationStatusMolecule";
import { PatientStatusBarMolecule } from "./PatientStatusBarMolecule";
import type { PatientViewModel } from "@/shared/types/patient-header/patient-header.type";
import type { PrescriptionStatus } from "./PrescriptionStatusBadge";

type PatientInfoGridMoleculeProps = {
  patient: PatientViewModel;
  admissionType: "inpatient" | "outpatient";
  isConsultationStarted: boolean;
  orderingPhysician: string | null;
  onAdmissionTypeToggle: () => void;
  onConsultationToggle: () => void;
  onMemoClick: () => void;
  onProxyInputClick: () => void;
  onPrescriptionClick: () => void;
  onMedicalInfoSharingClick: () => void;
};

export function PatientInfoGridMolecule({
  patient,
  admissionType,
  isConsultationStarted,
  orderingPhysician,
  onAdmissionTypeToggle,
  onConsultationToggle,
  onMemoClick,
  onProxyInputClick,
  onPrescriptionClick,
  onMedicalInfoSharingClick,
}: PatientInfoGridMoleculeProps) {
  const formattedBirthDate = patient.birthDate.replace(
    /(\d{4})(?:\([^)]+\))?年(\d{1,2})月(\d{1,2})日/,
    (_, y, m, d) => `${y}/${m.padStart(2, '0')}/${d.padStart(2, '0')}`
  );

  return (
    <div className="flex items-start space-x-8">
      {/* 左側：基本情報 */}
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="text-muted-foreground text-sm min-w-[70px]">生年月日:</span>
          <span className="font-semibold text-base">{formattedBirthDate}</span>
        </div>
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="text-muted-foreground text-sm min-w-[70px]">年齢/性別:</span>
          <span className="font-semibold text-base">{patient.age}歳 {patient.gender}</span>
        </div>
        <div className="whitespace-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onMemoClick}
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
            <span className="font-semibold text-base">{patient.ward} {patient.room}</span>
          </div>
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <span className="text-muted-foreground text-sm min-w-[48px]">入/外:</span>
            <Button
              onClick={onAdmissionTypeToggle}
              size="sm"
              variant="outline"
              className={`text-sm font-semibold h-7 px-3 transition-all ${
                admissionType === "inpatient"
                  ? "bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  : "bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 border-green-500 hover:bg-green-50 dark:hover:bg-green-950/30"
              }`}
            >
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
              patient.insurance.type === "自費" ? "text-orange-600 dark:text-orange-400" : ""
            }`}>
              {patient.insurance.type}
            </span>
          </div>
        </div>

        {/* 診療科・主治医・指示医 */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <span className="text-muted-foreground text-sm min-w-[60px]">診療科:</span>
            <span className="font-semibold text-base">{patient.department}</span>
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
              onClick={onProxyInputClick}
            >
              {orderingPhysician ?? ""}
            </Badge>
          </div>
        </div>

        {/* システム設定情報 */}
        <div className="space-y-1.5">
          <ConsultationStatusMolecule
            consultationStatus={patient.consultationStatus}
            isConsultationStarted={isConsultationStarted}
            onConsultationToggle={onConsultationToggle}
          />
          <PatientStatusBarMolecule
            prescriptionStatus={patient.prescriptionStatus as PrescriptionStatus}
            medicalInfoSharing={patient.medicalInfoSharing}
            isPrivacyMode={false}
            onPrescriptionClick={onPrescriptionClick}
            onMedicalInfoSharingClick={onMedicalInfoSharingClick}
          />
        </div>
      </div>
    </div>
  );
}
