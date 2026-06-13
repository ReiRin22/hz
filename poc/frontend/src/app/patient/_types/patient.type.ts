// src/types/patient.ts
export interface Patient {
  id: number;
  name: string;
  patientCode: string;
  fullImagePath?: string | null;
}