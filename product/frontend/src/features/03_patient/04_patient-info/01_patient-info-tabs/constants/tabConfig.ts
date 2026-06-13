import type { UserRole } from '../types/patientInfo.type';

export type TabId =
  | 'basicInfo'
  | 'allergyHistory'
  | 'vaccination'
  | 'familyInfo'
  | 'infection'
  | 'implantDevice'
  | 'lifestyle'
  | 'medicalMemo'
  | 'philosophy'
  | 'accessControl';

export const TAB_LABELS: Record<TabId, string> = {
  basicInfo: '基本情報',
  allergyHistory: 'アレルギー/既往歴/手術歴',
  vaccination: '予防接種',
  familyInfo: '家族情報',
  infection: '感染症',
  implantDevice: '体内埋込デバイス',
  lifestyle: '生活習慣',
  medicalMemo: '医療メモ',
  philosophy: 'ACP・方針',
  accessControl: 'アクセス制御',
};

export const ALL_TAB_IDS: TabId[] = [
  'basicInfo',
  'allergyHistory',
  'vaccination',
  'familyInfo',
  'infection',
  'implantDevice',
  'lifestyle',
  'medicalMemo',
  'philosophy',
  'accessControl',
];

/** ロール別アクセス可能タブ（accessControl は admin のみ） */
export const ACCESSIBLE_TABS: Record<UserRole, TabId[]> = {
  admin: ALL_TAB_IDS,
  doctor: [
    'basicInfo',
    'allergyHistory',
    'vaccination',
    'familyInfo',
    'infection',
    'implantDevice',
    'lifestyle',
    'medicalMemo',
    'philosophy',
  ],
  nurse: [
    'basicInfo',
    'allergyHistory',
    'vaccination',
    'familyInfo',
    'infection',
    'implantDevice',
    'lifestyle',
    'medicalMemo',
    'philosophy',
  ],
  staff: [
    'basicInfo',
    'allergyHistory',
    'vaccination',
    'familyInfo',
    'infection',
    'implantDevice',
    'lifestyle',
    'medicalMemo',
    'philosophy',
  ],
};

/** InfectionTab は staff は read-only、MedicalMemoTab は staff は参照のみ */
export const READ_ONLY_TABS: Partial<Record<TabId, UserRole[]>> = {
  infection: ['staff'],
  medicalMemo: ['staff'],
};
