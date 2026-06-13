export interface MedicalRecord {
  id: string;
  date: string;
  time: string;
  type:
    | 'progress'        // 経過記録
    | 'nursing'         // 看護記録
    | 'prescription'    // 処方
    | 'injection'       // 注射
    | 'treatment'       // 処置
    | 'test'            // 検体検査
    | 'bacteriology'    // 細菌検査
    | 'pathology'       // 病理検査
    | 'physiology'      // 生理検査
    | 'endoscopy'       // 内視鏡
    | 'radiology'       // 画像検査
    | 'rehabilitation'  // リハビリ
    | 'dialysis'        // 透析
    | 'guidance'        // 指導
    | 'surgery'         // 手術
    | 'vital'           // バイタルサイン
    | 'observation'     // 観察記録
    | 'medicalDocument' // 診療文書（診療情報提供書、紹介状など）
    | 'certificate'     // 証明・提出文書（診断書、証明書など）
    | 'scannedDocument'; // 取込文書（スキャン）
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

export type CategoryKey = 'ownDept' | 'allDepts' | 'tests';

export interface RecordFilters {
  searchQuery: string;
  searchMode: 'and' | 'or';
  profession: string;
  recordType: string;
  visitType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export interface RecordSelectionState {
  selectedRecordIds: Set<string>;
  expandedCategories: Set<CategoryKey>;
  expandedDates: Set<string>;
}
