import type { OrderType, OrderStatus } from './deptInstruction.viewmodel';

// 部門固有の設定を DeptInstructionScreen に注入するための Config 型
// DEP002 等の各エントリファイルで生成し、DeptInstructionScreen に渡す
export interface DeptInstructionConfig {
  /** 部門コード（例: 'lab', 'nursing', 'rehab'） */
  deptCode: string;
  /** 画面タイトル */
  title: string;
  /** 画面説明 */
  description: string;
  /** この部門で扱うオーダー種 */
  targetOrderTypes: OrderType[];
  /** デフォルト表示ステータスフィルタ（指定なしの場合は全ステータス） */
  defaultStatusFilter?: OrderStatus[];
  /** 結果入力ボタンを表示するオーダー種（RES002遷移） */
  resultInputOrderTypes?: OrderType[];
  /** 外注検査業者依頼票を帳票一覧に表示するか */
  showExternalLabSlip?: boolean;
  /** 医事会計連携を行うステータス遷移 */
  billingLinkTriggerStatuses?: OrderStatus[];
  /** 画面タイトル・説明を非表示にするか */
  hideTitle?: boolean;
}
