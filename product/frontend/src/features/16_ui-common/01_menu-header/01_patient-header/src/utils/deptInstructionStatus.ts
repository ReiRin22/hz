/**
 * 部門指示受けステータスの変換・表示ユーティリティ
 *
 * DEP002（部門指示受け画面）と ORD076（確定済みオーダー一覧）が共通参照する
 * ステータスキー（英語）と表示ラベル（日本語）のマッピングを一元管理する。
 */
import { i18n } from '@/shared/i18n';

/** BFF/BE から受け取る英語ステータスキー */
export type DeptInstructionStatusKey =
  | 'received'
  | 'accepted'
  | 'started'
  | 'collected'
  | 'specimen_received'
  | 'awaiting_result'
  | 'implemented'
  | 'result_entered';

/** 英語ステータスキー → 日本語ラベル（ja.ts の orderStatusLabels を参照） */
export const DEPT_STATUS_KEY_TO_LABEL = i18n.deptInstruction.orderStatusLabels;

/** 英語キーまたはフォールバック文字列から日本語ラベルを返す */
export function getDeptStatusLabel(status: string): string {
  const labels = i18n.deptInstruction.orderStatusLabels as Record<string, string>;
  return labels[status] ?? status;
}

export type DeptStatusBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export function getDeptStatusBadgeVariant(status: string): DeptStatusBadgeVariant {
  switch (status) {
    case 'received':         return 'destructive';
    case 'accepted':
    case 'started':
    case 'collected':
    case 'specimen_received': return 'secondary';
    case 'awaiting_result':  return 'outline';
    case 'implemented':
    case 'result_entered':   return 'default';
    default:                 return 'default';
  }
}
