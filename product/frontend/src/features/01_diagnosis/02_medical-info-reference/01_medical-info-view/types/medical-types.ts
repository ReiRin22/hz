// 医療システム固有の型定義
export interface MedicalRecord {
  id: string;
  patientId: string;
  timestamp: Date;
  type: 'SOAP' | 'PROGRESS' | 'HANDOVER' | 'VITAL_SIGNS';
  content: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    notes?: string;
  };
  doctorId: string;
  isLocked?: boolean;
  tags?: string[];
}

export interface Order {
  id: string;
  type: OrderType;
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  priority?: string;
  amount?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: Date;
  createdBy: string;
}

export type OrderType = 
  | "prescription" 
  | "injection" 
  | "procedure" 
  | "guidance" 
  | "lab" 
  | "physiology" 
  | "endoscopy" 
  | "imaging" 
  | "pathology" 
  | "microbiology" 
  | "general" 
  | "rehabilitation" 
  | "transfusion" 
  | "surgery" 
  | "dialysis";

export interface VitalSigns {
  id: string;
  patientId: string;
  timestamp: Date;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  consciousness?: string;
  painLevel?: number;
  notes?: string;
  measuredBy: string;
}

export interface DiagnosisRecord {
  id: string;
  patientId: string;
  icdCode: string;
  diagnosisName: string;
  type: 'PRIMARY' | 'SECONDARY' | 'DIFFERENTIAL';
  status: 'ACTIVE' | 'RESOLVED' | 'CHRONIC';
  onsetDate?: Date;
  resolvedDate?: Date;
  notes?: string;
  doctorId: string;
  createdAt: Date;
}

export interface TestResult {
  id: string;
  patientId: string;
  testType: string;
  testName: string;
  results: {
    [key: string]: {
      value: string | number;
      unit?: string;
      referenceRange?: string;
      status?: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
    };
  };
  performedAt: Date;
  reportedAt: Date;
  notes?: string;
  attachments?: {
    type: 'IMAGE' | 'PDF' | 'DOCUMENT';
    url: string;
    name: string;
  }[];
}

export interface MedicationHistory {
  id: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
  indication: string;
  status: 'ACTIVE' | 'DISCONTINUED' | 'COMPLETED';
  notes?: string;
}

export interface HandoverItem {
  id: string;
  patientId: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'MEDICATION' | 'PROCEDURE' | 'OBSERVATION' | 'COMMUNICATION' | 'OTHER';
  title: string;
  description: string;
  dueTime?: Date;
  createdBy: string;
  createdAt: Date;
  assignedTo?: string;
  isRead: boolean;
  isCompleted: boolean;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
}

export interface ProgressNote {
  id: string;
  patientId: string;
  timestamp: Date;
  type: 'DAILY_PROGRESS' | 'SHIFT_SUMMARY' | 'SPECIAL_OBSERVATION';
  content: string;
  writtenBy: string;
  tags?: string[];
  isImportant: boolean;
}