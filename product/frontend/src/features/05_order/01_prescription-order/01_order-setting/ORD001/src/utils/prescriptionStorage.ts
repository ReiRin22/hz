import { PrescriptionHistoryItem } from '../data/mockDoctors';
import { FrequentDrug } from '../data/mockDrugs';

const STORAGE_KEY_PREFIX = 'prescription_history_';
const CURRENT_DOCTOR_KEY = 'current_doctor_id';

/**
 * 現在ログイン中の医師IDを保存
 */
export function setCurrentDoctorId(doctorId: string): void {
  localStorage.setItem(CURRENT_DOCTOR_KEY, doctorId);
}

/**
 * 現在ログイン中の医師IDを取得
 */
export function getCurrentDoctorId(): string | null {
  return localStorage.getItem(CURRENT_DOCTOR_KEY);
}

/**
 * 医師の処方履歴を取得
 */
export function getPrescriptionHistory(doctorId: string): PrescriptionHistoryItem[] {
  const key = STORAGE_KEY_PREFIX + doctorId;
  const data = localStorage.getItem(key);
  
  if (!data) {
    return [];
  }
  
  try {
    return JSON.parse(data) as PrescriptionHistoryItem[];
  } catch (error) {
    console.error('Failed to parse prescription history:', error);
    return [];
  }
}

/**
 * 処方履歴を追加
 */
export function addPrescriptionHistory(
  doctorId: string,
  drugName: string,
  quantity?: string,
  dosage?: string
): void {
  const history = getPrescriptionHistory(doctorId);
  
  const newItem: PrescriptionHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    doctorId,
    drugName,
    prescribedAt: new Date().toISOString(),
    quantity,
    dosage
  };
  
  history.push(newItem);
  
  const key = STORAGE_KEY_PREFIX + doctorId;
  localStorage.setItem(key, JSON.stringify(history));
}

/**
 * 過去30日間の処方履歴を取得
 */
export function getRecentPrescriptionHistory(doctorId: string, days: number = 30): PrescriptionHistoryItem[] {
  const history = getPrescriptionHistory(doctorId);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return history.filter(item => {
    const prescribedDate = new Date(item.prescribedAt);
    return prescribedDate >= cutoffDate;
  });
}

/**
 * 頻用薬剤を計算（過去30日間の処方回数でランキング）
 */
export function calculateFrequentDrugs(doctorId: string, topN: number = 10): FrequentDrug[] {
  const recentHistory = getRecentPrescriptionHistory(doctorId, 30);
  
  // 薬剤名ごとの処方回数を集計
  const drugCountMap = new Map<string, number>();
  
  recentHistory.forEach(item => {
    const count = drugCountMap.get(item.drugName) || 0;
    drugCountMap.set(item.drugName, count + 1);
  });
  
  // 処方回数でソートして上位N件を取得
  const sortedDrugs = Array.from(drugCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);
  
  // FrequentDrug形式に変換
  return sortedDrugs.map(([drugName, frequency], index) => ({
    id: `freq_${doctorId}_${index}`,
    name: drugName,
    drugType: 'oral' as const, // 実際には薬剤マスタから取得すべき
    classification: undefined,
    isAdopted: true,
    units: ['錠', '包'],
    frequency
  }));
}

/**
 * すべての処方履歴をクリア（デバッグ用）
 */
export function clearAllPrescriptionHistory(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(STORAGE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * 初回起動時にテストデータを生成（開発用）
 */
export function initializeTestData(doctorId: string): void {
  // すでにデータがある場合はスキップ
  const existingHistory = getPrescriptionHistory(doctorId);
  if (existingHistory.length > 0) {
    return;
  }
  
  // 過去30日間のランダムな日付でテストデータを生成
  const testDrugs = [
    'カロナール錠200mg',
    'ムコダイン錠250mg',
    'ロキソニン錠60mg',
    'アムロジピン錠5mg',
    'ムコスタ錠100mg',
    'ガスター錠20mg',
    'アモキシシリンカプセル250mg',
    'タケキャブ錠20mg',
    'レバミピド錠100mg',
    'バイアスピリン錠100mg',
    'ワーファリン錠1mg',
    'ジアゼパム錠5mg'
  ];
  
  const history: PrescriptionHistoryItem[] = [];
  const now = new Date();
  
  // 各薬剤をランダムな頻度で追加（頻用薬剤ほど多く）
  testDrugs.forEach((drugName, index) => {
    // 上位の薬剤ほど多く処方されたことにする
    const prescriptionCount = Math.max(1, 50 - index * 4 + Math.floor(Math.random() * 10));
    
    for (let i = 0; i < prescriptionCount; i++) {
      // 過去30日以内のランダムな日付
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const prescribedDate = new Date(now);
      prescribedDate.setDate(prescribedDate.getDate() - randomDaysAgo);
      
      history.push({
        id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        doctorId,
        drugName,
        prescribedAt: prescribedDate.toISOString(),
        quantity: '1',
        dosage: '1日3回'
      });
    }
  });
  
  // LocalStorageに保存
  const key = STORAGE_KEY_PREFIX + doctorId;
  localStorage.setItem(key, JSON.stringify(history));
}
