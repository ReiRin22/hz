// 下書き管理用のユーティリティ関数

export interface DraftRecord {
  id: string;
  recordDate: string;
  soapRecord: string;
  vitalSigns: {
    bloodPressure: string;
    pulse: string;
    temperature: string;
    respiratoryRate: string;
    oxygenSaturation: string;
  };
  savedAt: string;
  savedBy: string;
}

/**
 * 下書きのLocalStorageキーを生成
 */
export function getDraftKey(userId: string, patientId: string): string {
  return `harz_draft_${userId}_${patientId}`;
}

/**
 * 下書きを保存
 */
export function saveDraft(
  userId: string,
  patientId: string,
  record: Omit<DraftRecord, 'id' | 'savedAt' | 'savedBy'>
): void {
  const key = getDraftKey(userId, patientId);
  const existingDrafts = loadDrafts(userId, patientId);
  
  const newDraft: DraftRecord = {
    ...record,
    id: `draft_${Date.now()}`,
    savedAt: new Date().toISOString(),
    savedBy: userId
  };
  
  // 新しい下書きを先頭に追加（最新順）
  const updatedDrafts = [newDraft, ...existingDrafts];
  
  // 最大10件まで保存
  const draftsToSave = updatedDrafts.slice(0, 10);
  
  localStorage.setItem(key, JSON.stringify(draftsToSave));
}

/**
 * 下書き一覧を読み込み
 */
export function loadDrafts(userId: string, patientId: string): DraftRecord[] {
  const key = getDraftKey(userId, patientId);
  const data = localStorage.getItem(key);
  
  if (!data) {
    return [];
  }
  
  try {
    const drafts = JSON.parse(data);
    return Array.isArray(drafts) ? drafts : [];
  } catch (error) {
    console.error('下書きの読み込みに失敗しました:', error);
    return [];
  }
}

/**
 * 特定の下書きを削除
 */
export function deleteDraft(userId: string, patientId: string, draftId: string): void {
  const key = getDraftKey(userId, patientId);
  const drafts = loadDrafts(userId, patientId);
  
  const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
  
  if (updatedDrafts.length > 0) {
    localStorage.setItem(key, JSON.stringify(updatedDrafts));
  } else {
    localStorage.removeItem(key);
  }
}

/**
 * すべての下書きを削除（患者切り替え時など）
 */
export function clearDrafts(userId: string, patientId: string): void {
  const key = getDraftKey(userId, patientId);
  localStorage.removeItem(key);
}

/**
 * 最新の下書きを取得
 */
export function getLatestDraft(userId: string, patientId: string): DraftRecord | null {
  const drafts = loadDrafts(userId, patientId);
  return drafts.length > 0 ? drafts[0] : null;
}

/**
 * 下書きの件数を取得
 */
export function getDraftCount(userId: string, patientId: string): number {
  const drafts = loadDrafts(userId, patientId);
  return drafts.length;
}
