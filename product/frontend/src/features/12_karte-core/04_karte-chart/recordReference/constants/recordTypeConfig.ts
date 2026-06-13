import {
  FileText, Heart, Pill, FlaskConical, Syringe, Scissors,
  Microscope, Eye, ImageIcon, Activity, Droplets, BookOpen, Cross, FileCheck, ScanLine,
  Stethoscope, Building2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MedicalRecord } from '../types/recordReference.type';

export const recordTypeConfig = {
  progress:        { icon: FileText,   label: '経過記録',      color: 'bg-blue-500',    profession: '医師' },
  nursing:         { icon: Heart,      label: '看護記録',      color: 'bg-green-500',   profession: '看護師' },
  prescription:    { icon: Pill,       label: '処方',          color: 'bg-purple-500',  profession: '医師' },
  injection:       { icon: Syringe,    label: '注射',          color: 'bg-pink-500',    profession: '医師' },
  treatment:       { icon: Scissors,   label: '処置',          color: 'bg-cyan-500',    profession: '医師' },
  test:            { icon: FlaskConical, label: '検体検査',    color: 'bg-orange-500',  profession: '検査技師' },
  bacteriology:    { icon: Microscope, label: '細菌検査',      color: 'bg-amber-600',   profession: '検査技師' },
  pathology:       { icon: Microscope, label: '病理検査',      color: 'bg-red-600',     profession: '検査技師' },
  physiology:      { icon: Activity,   label: '生理検査',      color: 'bg-teal-500',    profession: '検査技師' },
  endoscopy:       { icon: Eye,        label: '内視鏡',        color: 'bg-indigo-500',  profession: '医師' },
  radiology:       { icon: ImageIcon,  label: '画像検査',      color: 'bg-slate-600',   profession: '放射線技師' },
  rehabilitation:  { icon: Activity,   label: 'リハビリ',      color: 'bg-lime-500',    profession: 'リハビリ' },
  dialysis:        { icon: Droplets,   label: '透析',          color: 'bg-sky-600',     profession: '看護師' },
  guidance:        { icon: BookOpen,   label: '指導',          color: 'bg-emerald-500', profession: '医師' },
  surgery:         { icon: Cross,      label: '手術',          color: 'bg-rose-600',    profession: '医師' },
  vital:           { icon: Activity,   label: 'バイタル',      color: 'bg-red-500',     profession: '看護師' },
  observation:     { icon: Eye,        label: '観察記録',      color: 'bg-gray-500',    profession: '看護師' },
  medicalDocument: { icon: FileText,   label: '診療文書',      color: 'bg-indigo-600',  profession: '医師' },
  certificate:     { icon: FileCheck,  label: '証明・提出文書', color: 'bg-yellow-600', profession: '医師' },
  scannedDocument: { icon: ScanLine,   label: 'スキャン文書',  color: 'bg-slate-500',   profession: '医師' },
} as const satisfies RecordTypeConfigMap;

type RecordTypeConfigEntry = {
  icon: LucideIcon;
  label: string;
  color: string;
  profession: string;
};
type RecordTypeConfigMap = Record<MedicalRecord['type'], RecordTypeConfigEntry>;

// TODO: diagnosisRecord など他機能でも記録種別設定が必要になった場合は _shared に昇格する
/** RecordDetailPanel 用の拡張設定（isOrder・detailLabel フィールド追加） */
export const recordTypeConfigExtended = {
  progress:        { ...recordTypeConfig.progress,        isOrder: false, detailLabel: '記録内容' },
  nursing:         { ...recordTypeConfig.nursing,         isOrder: false, detailLabel: '記録内容' },
  prescription:    { ...recordTypeConfig.prescription,    isOrder: true,  detailLabel: '処方内容' },
  injection:       { ...recordTypeConfig.injection,       isOrder: true,  detailLabel: '注射内容' },
  treatment:       { ...recordTypeConfig.treatment,       isOrder: true,  detailLabel: '処置内容' },
  test:            { ...recordTypeConfig.test,            isOrder: true,  detailLabel: '検査項目' },
  bacteriology:    { ...recordTypeConfig.bacteriology,    isOrder: true,  detailLabel: '検査項目' },
  pathology:       { ...recordTypeConfig.pathology,       isOrder: true,  detailLabel: '検査項目' },
  physiology:      { ...recordTypeConfig.physiology,      isOrder: true,  detailLabel: '検査項目' },
  endoscopy:       { ...recordTypeConfig.endoscopy,       isOrder: true,  detailLabel: '検査部位・目的' },
  radiology:       { ...recordTypeConfig.radiology,       isOrder: true,  detailLabel: '検査部位・目的' },
  rehabilitation:  { ...recordTypeConfig.rehabilitation,  isOrder: true,  detailLabel: 'リハビリ内容' },
  dialysis:        { ...recordTypeConfig.dialysis,        isOrder: true,  detailLabel: '透析内容' },
  guidance:        { ...recordTypeConfig.guidance,        isOrder: false, detailLabel: '指導内容' },
  surgery:         { ...recordTypeConfig.surgery,         isOrder: true,  detailLabel: '手術内容' },
  vital:           { ...recordTypeConfig.vital,           isOrder: false, detailLabel: '記録内容' },
  observation:     { ...recordTypeConfig.observation,     isOrder: false, detailLabel: '観察内容' },
  medicalDocument: { ...recordTypeConfig.medicalDocument, isOrder: false, detailLabel: '文書内容' },
  certificate:     { ...recordTypeConfig.certificate,     isOrder: false, detailLabel: '文書内容' },
  scannedDocument: { ...recordTypeConfig.scannedDocument, isOrder: false, detailLabel: '文書内容' },
};

export const professionPriority: Record<string, number> = {
  '医師':       1,
  '看護師':     2,
  '薬剤師':     3,
  '検査技師':   4,
  '放射線技師': 5,
  'リハビリ':   6,
};

export const categoryConfig = {
  ownDept:  { label: '自科',     icon: Stethoscope,   color: 'text-blue-600 dark:text-blue-400',   bgColor: 'bg-blue-50 dark:bg-blue-950' },
  allDepts: { label: '全科',     icon: Building2,     color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-950' },
  tests:    { label: '検査結果', icon: FlaskConical,  color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-950' },
};
