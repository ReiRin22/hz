// shared/types/test-results/index.ts
// 検査結果ドメイン共有型定義
// 設計書: docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/14.状態管理設計.md

// Core domain types
export interface TestResult {
  id: string;
  itemCode: string;              // COL_TEST_CODE
  itemName: string;              // COL_TEST_ITEM
  resultValue: string;           // COL_RESULT
  unit: string;                  // COL_UNIT
  referenceValueDisplay: string | null;  // COL_REFERENCE_VALUE_DISPLAY (NULLの場合は入力可)
  judgment: 'H' | 'L' | 'N' | ''; // COL_JUDGMENT
  device: string;
  measurementDateTime: string;
  decimalPlaces: number;
  comment: string;
  status: 'not-entered' | 'temporary' | 'verified' | 'confirmed' | 'corrected';
  hasError: boolean;
  selected: boolean;             // チェックボックス
  previousResultValue: string;   // COL_PREV_RESULT
  hasPreviousResult: boolean;    // 前回値の表示条件
  criticalLower: number | null;  // 判定条件用
  criticalUpper: number | null;  // 判定条件用
  lowerLimit: number | null;     // criticalがNULLの場合の代替
  upperLimit: number | null;     // criticalがNULLの場合の代替
  testDate: string;              // COL_TEST_DATE (検体採取日)
  hasTestDate: boolean;          // COL_TEST_DATE 表示フラグ
  isEditable: boolean;           // 編集可能かどうか
  isAddedItem: boolean;          // EVT_UI_01で追加した項目（削除可能）
  reasonRequired: boolean;       // 確定済み検査結果の再登録時に修正理由入力が必要
}

export interface TestItem {
  code: string;
  name: string;
  unit: string;
  lowerReference: string;
  upperReference: string;
  judgment: string;
  criticalLower: number | null;
  criticalUpper: number | null;
}

export interface Patient {
  id: string;
  name: string;
  nameKana: string;
  gender: string;
  birthDate: string;
  age: number;
  primaryDiagnosis: string;
  department: string;
  reception: string;
  prescription: string;
  insuranceType: string;
  consultationType: string;
  allergies: string[];
  medicalHistory: string[];
}

export interface User {
  id: string;
  name: string;
  department: string;
  role: string;
}
