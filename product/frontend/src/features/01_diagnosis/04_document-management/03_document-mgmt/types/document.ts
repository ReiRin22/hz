// 文書管理システムの共通型定義
import { Patient as BasePatient } from './patient';

export interface DocumentContent {
  templateId: string;
  templateName: string;
  patientName: string;
  patientAge: string;
  patientGender: '男' | '女';
  birthDate: string;
  department: string;
  doctor: string;
  allergy: string;
  diagnosis: string;
  treatmentSummary: string;
  purpose: string;
  medicalHistory: string;
  treatmentPlan: string;
  notes: string;
}

export interface FieldChange {
  field: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
}

export interface RevisionRecord {
  revisionNumber: number;
  timestamp: string;
  updatedBy: string;
  action: '作成' | '更新' | '一時保存' | '承認';
  changes: FieldChange[];
  memo?: string;
}

export type DocumentStatus = '作成中' | '作成済' | '取込済';

export interface Document {
  id: string;
  type: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  status: DocumentStatus;
  department: string;
  content?: DocumentContent;
  referralType?: string;
  referralHospital?: string;
  referralDepartment?: string;
  referralDoctor?: string;
  comment?: string;
  issuer?: string;
  documentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
  revisionHistory?: RevisionRecord[];
}

// 文書管理用の患者情報（BasePatientを拡張）
export interface DocumentPatient extends BasePatient {
  patientNumber: string;
  age: number;
  gender: '男' | '女';
}

export interface UploadDocumentData {
  type: string;
  department: string;
  doctor: string;
  createdDate: Date;
  referralType?: string;
  referralHospital?: string;
  referralDepartment?: string;
  referralDoctor?: string;
  comment?: string;
}

export interface SaveDocumentData {
  type: string;
  department: string;
  content: DocumentContent;
  revisionMemo?: string;
}

export interface TemplateNode {
  id: string;
  label: string;
  description?: string;
  documentType?: string;
  children?: TemplateNode[];
}