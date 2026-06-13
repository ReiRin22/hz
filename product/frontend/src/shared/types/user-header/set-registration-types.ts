// セット登録機能の型定義

export type SetType = 
  | 'medical_record'    // SOAP記録セット
  | 'order_set'         // オーダーセット  
  | 'diagnosis_set'     // 病名セット
  | 'template_set'      // テンプレートセット
  | 'comprehensive';    // 包括的セット（複数要素含む）

export type SetCategory = 
  | 'routine'           // 日常的
  | 'emergency'         // 救急
  | 'outpatient'        // 外来
  | 'inpatient'         // 入院
  | 'specialty'         // 専門
  | 'custom';           // カスタム

export interface MedicalRecordSet {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  notes?: string;
}

export interface OrderSet {
  orders: {
    type: string;
    name: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
    priority?: string;
    amount?: string;
  }[];
}

export interface DiagnosisSet {
  diagnoses: {
    icdCode: string;
    diagnosisName: string;
    type: 'PRIMARY' | 'SECONDARY' | 'DIFFERENTIAL';
    notes?: string;
  }[];
}

export interface VitalSignsSet {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  notes?: string;
}

export interface RegisteredSet {
  id: string;
  name: string;
  description?: string;
  type: SetType;
  category: SetCategory;
  
  // セット内容（型に応じて一つだけが設定される）
  medicalRecord?: MedicalRecordSet;
  orderSet?: OrderSet;
  diagnosisSet?: DiagnosisSet;
  vitalSigns?: VitalSignsSet;
  
  // 包括的セット（複数要素を含む）
  comprehensive?: {
    medicalRecord?: MedicalRecordSet;
    orderSet?: OrderSet;
    diagnosisSet?: DiagnosisSet;
    vitalSigns?: VitalSignsSet;
  };
  
  // メタデータ
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  
  // タグとキーワード
  tags: string[];
  keywords: string[];
  
  // 適用条件（オプション）
  conditions?: {
    patientAgeRange?: { min?: number; max?: number };
    patientGender?: 'male' | 'female' | 'other';
    department?: string;
    specialty?: string;
  };
  
  // 学習データ
  learningData?: {
    successRate: number;
    timesSaved: number;
    avgTimeSaving: number; // 秒
  };
  
  isActive: boolean;
  isShared: boolean; // 他のユーザーと共有するか
  shareLevel: 'private' | 'department' | 'hospital' | 'public';
}

export interface SetSearchFilters {
  type?: SetType[];
  category?: SetCategory[];
  tags?: string[];
  keywords?: string;
  createdBy?: string;
  usageCountMin?: number;
  lastUsedSince?: Date;
  isShared?: boolean;
}

export interface SetUsageStats {
  totalSets: number;
  totalUsage: number;
  avgTimeSaving: number;
  mostUsedSets: RegisteredSet[];
  recentSets: RegisteredSet[];
  categoryStats: {
    category: SetCategory;
    count: number;
    usage: number;
  }[];
}

export interface SetSuggestion {
  setId: string;
  confidence: number;
  reason: string;
  matchingElements: string[];
}

export interface SetApplyOptions {
  overwrite: boolean;        // 既存内容を上書きするか
  merge: boolean;           // 既存内容とマージするか
  confirmBeforeApply: boolean; // 適用前に確認するか
  logUsage: boolean;        // 使用ログを記録するか
}

export interface SetValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// セット登録関連のイベント
export interface SetRegistrationEvents {
  onSetCreated: (set: RegisteredSet) => void;
  onSetUpdated: (setId: string, updates: Partial<RegisteredSet>) => void;
  onSetDeleted: (setId: string) => void;
  onSetApplied: (setId: string, options: SetApplyOptions) => void;
  onSetUsageRecorded: (setId: string, timeSaved: number) => void;
}