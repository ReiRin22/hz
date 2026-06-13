/** 上流 API（診察記録システム）から返却される生データ */
export interface UpstreamClinicalRecord {
  recordId: string;
  patientId: string;
  recordDate: string;
  recordedBy: string;
  recordedByName: string;
  soapRecord: string;
  isConfirmed: boolean;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** 上流 API（SOAPテンプレート）から返却される生データ */
export interface UpstreamSOAPTemplate {
  templateId: string;
  templateName: string;
  templateContent: string;
}

/** 上流 API（コメント）から返却される生データ */
export interface UpstreamComment {
  commentId: string;
  commentContent: string;
  commentType: "MY" | "PATIENT" | "DEPARTMENT";
}

/** 上流 API（診察記録一覧）から返却される生データ */
export interface UpstreamMedicalRecord {
  id: string;
  date: string;
  time: string;
  type:
    | 'progress'
    | 'nursing'
    | 'prescription'
    | 'injection'
    | 'treatment'
    | 'test'
    | 'bacteriology'
    | 'pathology'
    | 'physiology'
    | 'endoscopy'
    | 'radiology'
    | 'rehabilitation'
    | 'dialysis'
    | 'guidance'
    | 'surgery'
    | 'vital'
    | 'observation'
    | 'medicalDocument'
    | 'certificate'
    | 'scannedDocument';
  visitType?: 'inpatient' | 'outpatient';
  hospitalizationId?: string;
  content: string;
  author: string;
  insurance?: { type: string; burden: string };
  soapRecord?: string;
  schema?: string;
  vitalSigns?: {
    bloodPressure?: string;
    pulse?: string;
    temperature?: string;
    respiratoryRate?: string;
    oxygenSaturation?: string;
  };
}
