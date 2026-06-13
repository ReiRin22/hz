// DEP002（臨床検査科）固有の型定義
// 共通型は _shared/types/deptInstruction.viewmodel.ts を参照

// 施術内容のタイプ（臨床検査科で使用する分類）
export type ProcedureType = '診察' | '処方' | '注射' | '処置' | '検体' | '細菌' | '病理' | '生理' | '内視' | '画像' | 'リハ' | '透析' | '手術' | '指導' | '入院';
