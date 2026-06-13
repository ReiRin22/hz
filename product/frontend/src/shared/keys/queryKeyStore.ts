import { createQueryKeyStore } from '@lukemorales/query-key-factory';

/**
 * クエリキーストア（全クエリキーを一元管理）
 *
 * 【責務分担】
 * - 基盤チーム: 本ファイル（テンプレート）の作成・保守
 * - 実装チーム: 各機能のクエリキーを下記オブジェクトに追加し、カスタムフック内で使用する
 *
 * 【キー構造ルール】
 * 実際のキーは `[ドメイン名, 操作名, ...queryKey に渡した値]` の形式で生成される。
 * `queryKey` には引数で受け取った tenantId・パラメータ等を順に並べる。
 *
 * 【追加例】
 * ```ts
 * export const queries = createQueryKeyStore({
 *   diagnosis: {
 *     // 実際のキー: ['diagnosis', 'patientList', tenantId, filters]
 *     patientList: (tenantId: string, filters?: { search?: string; page?: number }) => ({
 *       queryKey: [tenantId, filters],
 *     }),
 *   },
 * });
 * ```
 *
 * 【使用例（カスタムフック）】
 * ```ts
 * import { queries } from '@/shared/keys/queryKeyStore';
 *
 * useQuery({
 *   queryKey: queries.diagnosis.patientList(currentTenantId, filters).queryKey,
 *   queryFn: () => fetchPatientList(currentTenantId, filters),
 * });
 * ```
 *
 * 【禁止事項】
 * - カスタムフック内でリテラル配列（例: `['diagnosis', tenantId]`）を直接書かない。
 *   キー構造の変更時に全呼び出し箇所を修正する必要が生じ、リファクタ安全性を損なう。
 * - 同じキー構造を複数箇所に重複定義しない。本ストアの1箇所に集約すること。
 */
export const queries = createQueryKeyStore({});
