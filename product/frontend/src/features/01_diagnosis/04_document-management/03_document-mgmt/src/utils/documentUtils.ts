// 文書管理システムの共通ユーティリティ関数

import { DocumentStatus, Document, Patient } from '../types/document';

// ステータスに応じたスタイルクラスを返す
export const getStatusColor = (status: DocumentStatus): string => {
  switch (status) {
    case '作成中':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case '作成済':
      return 'bg-green-100 text-green-800 border-green-200';
    case '取込済':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// ページネーション用のページ番号配列を生成
export const generatePageNumbers = (currentPage: number, totalPages: number, maxVisible: number = 5): (number | string)[] => {
  const pages: (number | string)[] = [];
  
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
  }
  
  return pages;
};

// フィルター条件に基づいて文書をフィルタリング
export interface DocumentFilterOptions {
  searchQuery?: string;
  filterDocType?: string;
  filterStatus?: string;
  filterDepartment?: string;
  filterReferralHospital?: string;
  filterDateFrom?: Date;
  filterDateTo?: Date;
  currentPatient?: Patient;
}

export const filterDocuments = (
  documents: Document[],
  options: DocumentFilterOptions
): Document[] => {
  const {
    searchQuery,
    filterDocType,
    filterStatus,
    filterDepartment,
    filterReferralHospital,
    filterDateFrom,
    filterDateTo,
    currentPatient
  } = options;

  return documents.filter(doc => {
    // Patient filter
    if (currentPatient && doc.content?.patientName && doc.content.patientName !== currentPatient.name) {
      return false;
    }
    
    // Document type filter
    if (filterDocType && filterDocType !== 'all' && doc.type !== filterDocType) {
      return false;
    }
    
    // Keyword filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesKeyword = 
        doc.type.toLowerCase().includes(searchLower) ||
        doc.createdBy.toLowerCase().includes(searchLower) ||
        doc.comment?.toLowerCase().includes(searchLower) ||
        doc.referralHospital?.toLowerCase().includes(searchLower);
      if (!matchesKeyword) return false;
    }
    
    // Status filter
    if (filterStatus && filterStatus !== 'all' && doc.status !== filterStatus) {
      return false;
    }
    
    // Department filter
    if (filterDepartment && filterDepartment !== 'all' && doc.department !== filterDepartment) {
      return false;
    }

    // Referral hospital filter
    if (filterReferralHospital && filterReferralHospital !== 'all' && doc.referralHospital !== filterReferralHospital) {
      return false;
    }
    
    // Date range filter
    if (filterDateFrom) {
      const docDate = new Date(doc.createdDate);
      if (docDate < filterDateFrom) return false;
    }
    if (filterDateTo) {
      const docDate = new Date(doc.createdDate);
      if (docDate > filterDateTo) return false;
    }
    
    return true;
  });
};

// 文書を日付順（新しい順）でソート
export const sortDocumentsByDate = (documents: Document[]): Document[] => {
  return [...documents].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.updatedDate || a.createdDate);
    const dateB = new Date(b.updatedAt || b.updatedDate || b.createdDate);
    return dateB.getTime() - dateA.getTime();
  });
};

// 文書リストから特定フィールドの一意な値を抽出
export const extractUniqueValues = (
  documents: Document[],
  field: keyof Document
): string[] => {
  const values = documents
    .map(doc => doc[field])
    .filter((value): value is string => Boolean(value) && typeof value === 'string');
  
  return Array.from(new Set(values)).sort();
};

// スキャナ設定の説明文を生成
export const getScannerSettingsDescription = (
  scanner: string,
  resolution: string,
  colorMode: string,
  duplex: boolean
): string => {
  const colorModeText = colorMode === 'color' ? 'カラー' 
    : colorMode === 'grayscale' ? 'グレースケール' 
    : '白黒';
  
  return `スキャナ「${scanner}」でスキャンを開始します\n\n設定:\n- 解像度: ${resolution} dpi\n- カラーモード: ${colorModeText}\n- 両面スキャン: ${duplex ? 'ON' : 'OFF'}\n\n※実際の実装ではローカルエージェントが\nスキャナドライバ（TWAIN/WIA）を起動します`;
};

// 日付の差分を計算（日数）
export const getDaysSince = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 文書が最近更新されたかどうか（7日以内）
export const isRecentlyUpdated = (document: Document): boolean => {
  const updateDate = document.updatedAt || document.updatedDate;
  if (!updateDate) return false;
  return getDaysSince(updateDate) <= 7;
};

/**
 * 文書の変更差分を検出
 */
export interface FieldChange {
  field: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
}

const fieldMap: Record<string, string> = {
  patientName: '患者氏名',
  patientAge: '年齢',
  patientGender: '性別',
  birthDate: '生年月日',
  department: '診療科',
  doctor: '担当医',
  allergy: 'アレルギー',
  diagnosis: '病名',
  treatmentSummary: '治療経過（概要）',
  purpose: '紹介目的',
  medicalHistory: '診療経過',
  treatmentPlan: '治療方針',
  notes: '注意事項'
};

export const detectDocumentChanges = (
  oldContent: any,
  newContent: any
): FieldChange[] => {
  const changes: FieldChange[] = [];
  
  if (!oldContent || !newContent) return changes;
  
  Object.keys(fieldMap).forEach(field => {
    const oldValue = String(oldContent[field as keyof typeof oldContent] || '');
    const newValue = String(newContent[field as keyof typeof newContent] || '');
    if (oldValue !== newValue) {
      changes.push({
        field,
        fieldLabel: fieldMap[field],
        oldValue,
        newValue
      });
    }
  });
  
  return changes;
};

/**
 * リビジョンレコードを作成
 */
export interface RevisionRecord {
  revisionNumber: number;
  timestamp: string;
  updatedBy: string;
  action: string;
  changes?: FieldChange[];
  memo?: string;
}

export const createRevisionRecord = (
  currentRevisionNumber: number,
  timestamp: string,
  updatedBy: string,
  action: '作成' | '更新',
  changes: FieldChange[],
  memo?: string
): RevisionRecord => {
  return {
    revisionNumber: currentRevisionNumber + 1,
    timestamp,
    updatedBy,
    action,
    changes,
    memo
  };
};