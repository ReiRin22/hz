# PHIマスキング設計（セキュリティ観点）

外部 SaaS（Sentry 等）への PHI（患者健康情報）流出を防止するためのマスキング基盤の **セキュリティ監査要件** を定義する。

> Sentry SDK の詳細な設定および実装パターン（`beforeSend` フックの実装、PHIパターン定義、Breadcrumbs 制御等）は **[09_監視エラーハンドリング設計/GlitchTip連携設計.md](../09_監視エラーハンドリング設計/GlitchTip連携設計.md)** で詳述する。本設計書は本章（13章）の文脈で **基盤として最低限遵守すべき必須要件** のみを記載する。

| 関連文書 | 内容 |
|---|---|
| [セキュリティ基盤規約.md](セキュリティ基盤規約.md) | アプリチームが守る規約 |
| [09_監視エラーハンドリング設計/GlitchTip連携設計.md](../09_監視エラーハンドリング設計/GlitchTip連携設計.md) | Sentry SDK 設定・PHI フィルタリングの実装詳細 |

---

## 1. 必須要件

| No | 要件 | 目的 |
| --- | --- | --- |
| 1 | **PHI 自動マスク** | 外部 SaaS への機密情報流出を防止 |
| 2 | **監査情報の必須付与** | マルチテナント環境で影響範囲を特定可能にする |
| 3 | **Breadcrumbs の機密情報除外** | エラー再現手順の把握と機密保護を両立 |

---

## 2. 公開 I/F: PHIパターン定義

### 2.1 配置と公開対象

| 項目 | 内容 |
|---|---|
| ファイル | `front_bff_shared/utils/phiPatterns.ts` |
| インポートパス | フロント: `import { PHI_PATTERNS } from '@/shared/utils/phiPatterns'`／BFF: `import { PHI_PATTERNS } from '@/shared/utils/phiPatterns'`（双方とも `front_bff_shared` のシンボリックリンク経由） |
| 公開対象 | ✅ 09章 Sentry `beforeSend` フックで参照、本章（13章）で監査対象として参照（アプリ実装者は直接 import せず、09章の `beforeSend` フック経由のみ利用） |

### 2.2 型シグネチャ

```typescript
/**
 * PHI（患者健康情報）として扱うべきデータパターンの正規表現一覧。
 *
 * @remarks
 * - 09章 Sentry `beforeSend` フックでエラー送信前のマスキングに使用
 * - 13章では本ファイルが「PHIパターンの一元管理」として存在することが
 *   セキュリティ監査の必須要件
 * - パターン追加・修正は基盤チームの審査必須（外部送信内容の変更となるため）
 * - **配列の先頭から順次** マッチング・置換が行われるため、より具体的なパターンを先に並べること
 * - 適用対象は文字列値のみ。ネストした `Error.message` / `extra` フィールド等は呼び出し側
 *   （09章 `beforeSend` フック）で再帰的に走査する
 * - パターン追加時は `front_bff_shared/utils/phiPatterns.test.ts` のスナップショットテストで全件検証必須
 */
export const PHI_PATTERNS: ReadonlyArray<{
  /** パターンの識別名（例: "patient_id", "insurance_number"） */
  name: string;
  /** マスク対象の正規表現 */
  pattern: RegExp;
  /** マスク後の置換文字列（例: "[PATIENT_ID]"） */
  replacement: string;
}>;
```

> 詳細なパターン定義（patient_id・insurance_number 等の具体的正規表現）は [09_監視エラーハンドリング設計/GlitchTip連携設計.md](../09_監視エラーハンドリング設計/GlitchTip連携設計.md) を参照。

---

## 3. セキュリティ監査での確認項目

| No | 確認項目 | 監査方法 |
| --- | --- | --- |
| 1 | すべてのエラー送信前に `beforeSend` フックが実行されているか | Sentry 初期化コード（`Sentry.init(...)`）に `beforeSend` 設定があるかを grep |
| 2 | PHI パターンが `front_bff_shared/utils/phiPatterns.ts` で一元管理されているか | `Sentry.init` の `beforeSend` が `PHI_PATTERNS` を import して参照しているかを確認 |
| 3 | ユーザーID、テナントID、セッションID が必ず付与されているか | `Sentry.setUser` / `Sentry.setTag` が認証成功時とテナント切替時に呼ばれているかを確認 |
| 4 | `Sentry.init` で `beforeSend` が必ず設定されているか（個別の `Sentry.captureException` / `Sentry.captureMessage` 呼び出しは `beforeSend` で全件自動適用される） | grep で `Sentry.init(` を検索し、引数オブジェクトに `beforeSend` キーが必ず存在することを確認 |

---

## 4. ファイルパス・配置対応表

| ファイル | 配置 | 役割 | 公開対象 |
|---|---|---|---|
| `phiPatterns.ts` | `front_bff_shared/utils/` | PHI 正規表現パターン一元管理 | ✅ 09章で実装参照、13章で監査参照 |

---

## 5. 残件

| No | 残件 | トリガー |
|---|---|---|
| 1 | PHI パターンの初期セット確定（patient_id・insurance_number 等の正規表現） | 09章 PoC 検証結果（[03_PoC検証/3_通信・暗号化/4_エラーモニタリング(Sentry).md](../../03_PoC検証/3_通信・暗号化/4_エラーモニタリング(Sentry).md)）の最終化 |
| 2 | 外部 SaaS 追加時のマスキング適用 | Sentry 以外の外部 SaaS（Datadog 等）導入時に基盤チームが追加 |

---

## 参照

- [セキュリティ基盤規約.md](セキュリティ基盤規約.md) §5
- [09_監視エラーハンドリング設計/GlitchTip連携設計.md](../09_監視エラーハンドリング設計/GlitchTip連携設計.md) - Sentry SDK 設定・PHI フィルタリング詳細
- [03_PoC検証/3_通信・暗号化/4_エラーモニタリング(Sentry).md](../../03_PoC検証/3_通信・暗号化/4_エラーモニタリング(Sentry).md) - PoC 検証結果
- フロントエンド方式設計書「4.セキュリティ・アクセス統制」4.5節
