/** フロントエンドの MedicalRecord と同一構造（BFF → フロントエンド 共有型） */
export interface MedicalRecordResponse {
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

export interface GetClinicalRecordsResponse {
  records: MedicalRecordResponse[];
}
