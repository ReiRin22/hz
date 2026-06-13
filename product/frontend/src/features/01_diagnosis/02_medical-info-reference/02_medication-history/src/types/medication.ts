export interface LabTestRecord {
  id: string;
  testName: string;
  testDate: string;
  value: string;
  unit: string;
  referenceRange: string;
  category: string;
}

export interface MedicationRecord {
  id: string;
  category: "内服" | "外用" | "注射" | "点眼";
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  amount?: string;
  prescribedBy: "own" | "other";
  patientType: "入院" | "外来";
  admissionDate?: string;
  hospitalName?: string;
  isAllergen?: boolean;
  isNarcotic?: boolean;
  isPsychotropic?: boolean;
  isPotentDrug?: boolean;
  notes?: string;
}
