/** 画面モード */
export type RecordInputMode = 'new' | 'edit' | 'draft-restore';

/** 下書きアイテム (ViewModel) */
export interface DraftViewModel {
  id: string;
  soapContent: string;
  savedAt: string;
}

/** テンプレートアイテム (ViewModel) */
export interface TemplateViewModel {
  id: string;
  name: string;
  content: string;
}

/** 記載者選択肢 (ViewModel) */
export interface RecorderOption {
  id: string;
  name: string;
  role: string;
}

/** コメント選択肢 (ViewModel) */
export interface CommentOption {
  id: string;
  content: string;
  type: 'MY' | 'PATIENT' | 'DEPT';
}

/** 診察記録入力フォームの値 */
export interface RecordInputFormValues {
  recordDate: string;
  recorderId: string;
  soapContent: string;
}

/** 診察記録入力画面の Props */
export interface RecordInputProps {
  patientId: string;
  receptionId: string;
  /** 修正モード時のみ指定 */
  recordId?: string;
  onConfirm?: (recordId: string) => void;
  onSave?: () => void;
}
