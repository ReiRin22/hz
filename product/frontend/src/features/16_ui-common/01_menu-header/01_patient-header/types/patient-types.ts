// 患者情報の型定義
export interface Patient {
  name: string;
  kana: string;
  patientId: string;
  birthDate: string;
  gender: string;
  age: number;
  department: string;
  ward: string;
  room: string;
  doctor: string;
  allergies: string[];
  infections: string[];
  consultationStatus: "waiting" | "in-progress" | "completed" | "postponed" | "cancelled";
  prescriptionStatus: "electronic" | "paper" | "disconnected";
  medicalInfoSharing: {
    status: "full-consent" | "partial-consent" | "no-consent";
    consentDate?: string;
    expiryDate?: string;
    lastUpdated?: string;
    details?: {
      emergencyMedicalInfo?: boolean;
      prescriptionHistory?: boolean;
      diagnosticImages?: boolean;
      labResults?: boolean;
      referralLetters?: boolean;
    };
  };
  insurance: {
    type: string;
    number: string;
    burden: string;
  };
}

// 検査結果の型定義
export interface TestResult {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
}

// ログインユーザーの型定義
export interface CurrentUser {
  name: string;
  role: string;
  department: string;
  id: string;
  loginTime: string;
}

// 検索履歴の型定義
export interface SearchHistoryItem {
  patientId: string;
  searchCount: number;
  lastSearched: number;
  searchTimes: number[];
}

// 医療アラートの型定義
export interface MedicalAlert {
  id: string;
  type: "critical" | "warning" | "info";
  category: "allergy" | "interaction" | "vital" | "system" | "documentation" | "workflow";
  title: string;
  message: string;
  timestamp: string;
  dismissed?: boolean;
}

// 経過記録の型定義
export interface ProgressRecord {
  id: string;
  date: string;
  time: string;
  type: "progress" | "vital" | "observation" | "treatment";
  title: string;
  content: string;
  author: string;
  department: string;
  isImportant: boolean;
}

// 申し送り項目の型定義
export interface HandoverItem {
  id: string;
  date: string;
  time: string;
  shift: "day" | "evening" | "night";
  fromUser: string;
  toUser: string;
  priority: "high" | "medium" | "low";
  category: "patient-condition" | "medication" | "family" | "other";
  title: string;
  content: string;
  isRead: boolean;
  isResolved: boolean;
}

// 薬歴の型定義
export interface MedicationRecord {
  id: string;
  medicationName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  route: string;
  prescribedDate: string;
  startDate: string;
  endDate?: string;
  duration: number;
  prescribedBy: string;
  department: string;
  institution: "自院" | "他院";
  institutionName: string;
  status: "継続中" | "完了" | "中止";
  category: "循環器薬" | "糖尿病薬" | "消化器薬" | "鎮痛薬";
  effectiveness: "有効" | "無効" | "不明";
  adherence: "良好" | "普通" | "不良";
  notes?: string;
  sideEffects?: string[];
  warningLevel?: "注意" | "警告" | "禁忌";
  interactions?: string[];
}

// 診療記録の型定義
export interface MedicalRecord {
  id: string;
  date: string;
  time: string;
  type: "progress" | "nursing" | "prescription" | "test" | "vital" | "treatment" | "observation";
  title: string;
  content: string;
  author: string;
  insurance: { type: string; burden: string };
  soapRecord?: string;
  vitalSigns?: {
    bloodPressure: string;
    pulse: string;
    temperature: string;
    respiratoryRate: string;
    oxygenSaturation: string;
  };
  isImportant?: boolean;
}

// 他院診療情報の型定義
export interface ExternalMedicalRecord {
  id: string;
  hospitalName: string;
  hospitalType: "総合病院" | "大学病院" | "専門病院" | "クリニック";
  department: string;
  date: string;
  type: "診察" | "検査" | "処方" | "手術";
  doctor: string;
  title: string;
  content: string;
  diagnosis?: string;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: number;
  }>;
  testResults?: Array<{
    name: string;
    value: string;
    unit: string;
    normalRange: string;
    isAbnormal: boolean;
  }>;
  isImportant: boolean;
  referralSource: boolean;
}

// 健診情報の型定義
export interface HealthCheckupRecord {
  id: string;
  year: number;
  date: string;
  organization: string;
  type: "特定健診" | "企業健診" | "人間ドック";
  results: {
    height: number;
    weight: number;
    bmi: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    pulse: number;
    bodyFat?: number;
    waistCircumference?: number;
    visionLeft: number;
    visionRight: number;
    hearing: "正常" | "異常" | "要精査";
    bloodSugar: number;
    hba1c: number;
    totalCholesterol: number;
    hdlCholesterol: number;
    ldlCholesterol: number;
    triglycerides: number;
    uricAcid: number;
    creatinine: number;
    ast: number;
    alt: number;
    gammaGtp: number;
    hemoglobin: number;
    whiteBloodCells: number;
    redBloodCells: number;
    platelets: number;
    urineProtein: "陰性" | "陽性" | "±";
    urineGlucose: "陰性" | "陽性" | "±";
    urineBlood: "陰性" | "陽性" | "±";
    chestXray: "正常" | "異常" | "要精査";
    ecg: "正常" | "異常" | "軽度異常";
    upperGi?: "正常" | "異常" | "要精査";
    colonoscopy?: "正常" | "異常" | "要精査";
  };
  abnormalFindings: string[];
  recommendations: string[];
  followUpRequired: boolean;
  isVisible: boolean;
}

// 現在の記録の型定義
export interface CurrentRecord {
  recordDate: string;
  soapRecord: string;
  vitalSigns: {
    bloodPressure: string;
    pulse: string;
    temperature: string;
    respiratoryRate: string;
    oxygenSaturation: string;
  };
}

// 統計データの型定義
export interface StatsData {
  vitalTrends: Array<{
    date: string;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    pulse: number;
    temperature: number;
    oxygenSaturation: number;
  }>;
  labTrends: Array<{
    date: string;
    bloodSugar: number;
    hba1c: number;
    cholesterol: number;
  }>;
  recordCounts: {
    progress: number;
    nursing: number;
    prescription: number;
    test: number;
  };
  totalRecords: number;
  averageVitals: {
    bloodPressure: string;
    pulse: number;
    temperature: number;
    oxygenSaturation: number;
  };
  isNewPatient: boolean;
  patientInfo: {
    name: string;
    patientId: string;
    department: string;
    firstVisit: string;
  };
}

// ユーザーアラートの型定義
export interface UserAlert {
  id: string;
  type: 'system' | 'task' | 'notification' | 'warning';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  dismissed: boolean;
  userId: string;
}