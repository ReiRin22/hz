import type { Patient, MedicalAlert, TestResult, StatsData } from "@/shared/types/user-header/patient-types";
import { 
  patientDatabase, 
  newPatientAlerts, 
  existingPatientAlerts, 
  newPatientTestResults, 
  sampleTestResults,
  imageDatabase,
  testResultsDatabase,
  recordsDatabase,
  medicationDatabase,
  externalMedicalRecordsDatabase,
  healthCheckupDatabase
} from "@/shared/assets/user-header/medical-data";

// 新患かどうかを判定する関数
export const isNewPatient = (patientId: string): boolean => {
  return ["P001234567", "P002345678"].includes(patientId);
};

// 患者別のアラートを取得する関数
export const getPatientAlerts = (patientId: string): MedicalAlert[] => {
  if (isNewPatient(patientId)) {
    return newPatientAlerts;
  } else {
    return existingPatientAlerts;
  }
};

// 患者の画像件数を取得
export const getPatientImageCount = (patientId: string): number => {
  return imageDatabase[patientId] || 0;
};

// 患者の検査結果を取得
export const getPatientTestResults = (patientId: string): TestResult[] => {
  return testResultsDatabase[patientId] || [];
};

// 現在の患者の診療記録を取得
export const getCurrentPatientRecords = (patientId: string) => {
  return recordsDatabase[patientId] || [];
};

// 現在の患者の薬歴を取得
export const getCurrentPatientMedications = (patientId: string) => {
  return medicationDatabase[patientId] || [];
};

// 患者の他院診療情報を取得
export const getCurrentPatientExternalRecords = (patientId: string) => {
  return externalMedicalRecordsDatabase[patientId] || [];
};

// 患者の健診情報を取得
export const getCurrentPatientHealthCheckups = (patientId: string) => {
  return healthCheckupDatabase[patientId] || [];
};

// 現在の患者の検査結果を取得（ヘッダー用の簡易データ）
export const getCurrentTestResults = (patientId: string): TestResult[] => {
  return isNewPatient(patientId) ? newPatientTestResults : sampleTestResults;
};

// 検査結果の詳細データを取得（検査結果ダイアログ用）
export const getCurrentDetailedTestResults = (patientId: string): TestResult[] => {
  return getPatientTestResults(patientId);
};

// 日付を日本形式に変換
export const formatDateToJapanese = (isoDate: string): string => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
};

// 統計データの生成（新患の場合は空）
export const getStatsData = (patient: Patient): StatsData => {
  if (isNewPatient(patient.patientId)) {
    return {
      vitalTrends: [],
      labTrends: [],
      recordCounts: {
        progress: 0,
        nursing: 0,
        prescription: 0,
        test: 0,
      },
      totalRecords: 0,
      averageVitals: {
        bloodPressure: "未測定",
        pulse: 0,
        temperature: 0,
        oxygenSaturation: 0,
      },
      isNewPatient: true,
      patientInfo: {
        name: patient.name,
        patientId: patient.patientId,
        department: patient.department,
        firstVisit: formatDateToJapanese(new Date().toISOString().slice(0, 10)), // 今日を初診日とする
      },
    };
  }
  
  return {
    vitalTrends: [
      { date: "2024-12-20", bloodPressureSystolic: 145, bloodPressureDiastolic: 92, pulse: 88, temperature: 36.9, oxygenSaturation: 97 },
      { date: "2024-12-21", bloodPressureSystolic: 140, bloodPressureDiastolic: 90, pulse: 82, temperature: 36.8, oxygenSaturation: 98 },
      { date: "2024-12-22", bloodPressureSystolic: 138, bloodPressureDiastolic: 88, pulse: 76, temperature: 36.6, oxygenSaturation: 98 },
      { date: "2024-12-23", bloodPressureSystolic: 142, bloodPressureDiastolic: 89, pulse: 78, temperature: 36.7, oxygenSaturation: 99 },
      { date: "2024-12-24", bloodPressureSystolic: 150, bloodPressureDiastolic: 95, pulse: 85, temperature: 36.8, oxygenSaturation: 98 },
      { date: "2024-12-25", bloodPressureSystolic: 147, bloodPressureDiastolic: 93, pulse: 83, temperature: 36.9, oxygenSaturation: 97 },
      { date: "2024-12-26", bloodPressureSystolic: 140, bloodPressureDiastolic: 90, pulse: 82, temperature: 36.8, oxygenSaturation: 98 },
      { date: "2024-12-27", bloodPressureSystolic: 143, bloodPressureDiastolic: 91, pulse: 84, temperature: 36.8, oxygenSaturation: 98 },
    ],
    labTrends: [
      { date: "2024-12-20", bloodSugar: 150, hba1c: 7.5, cholesterol: 230 },
      { date: "2024-12-22", bloodSugar: 145, hba1c: 7.3, cholesterol: 225 },
      { date: "2024-12-24", bloodSugar: 140, hba1c: 7.2, cholesterol: 220 },
      { date: "2024-12-26", bloodSugar: 142, hba1c: 7.1, cholesterol: 218 },
    ],
    recordCounts: {
      progress: 2,
      nursing: 2,
      prescription: 2,
      test: 1,
    },
    totalRecords: 7,
    averageVitals: {
      bloodPressure: "143/91",
      pulse: 82,
      temperature: 36.8,
      oxygenSaturation: 98,
    },
    isNewPatient: false,
    patientInfo: {
      name: patient.name,
      patientId: patient.patientId,
      department: patient.department,
      firstVisit: "2024/12/20", // 既存患者の初診日例
    },
  };
};

// 患者検索（IDから患者情報を取得）
export const getPatientById = (patientId: string): Patient | undefined => {
  return patientDatabase[patientId];
};

// 時間帯による重み付け（勤務時間中の検索はより関連性が高い）
export const getTimeWeight = (searchTimes: number[]): number => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // 検索時刻の時間帯分析
  const recentSearchHours = searchTimes
    .filter(time => Date.now() - time < 7 * 24 * 60 * 60 * 1000) // 過去1週間
    .map(time => new Date(time).getHours());
  
  // 現在時刻と似た時間帯の検索があれば重みを上げる
  const similarTimeSearches = recentSearchHours.filter(hour => 
    Math.abs(hour - currentHour) <= 2 || Math.abs(hour - currentHour) >= 22
  ).length;
  
  return 1 + (similarTimeSearches * 0.2);
};

// 患者の名前から初期文字を取得
export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// 性別による色分け（テーマカラーに合わせて調整）
export const getGenderColor = (gender: string): string => {
  return gender === "男性" ? "medical-primary" : "bg-pink-500";
};