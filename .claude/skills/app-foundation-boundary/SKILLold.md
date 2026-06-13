# アプリ基盤チーム境界チェック

アプリ基盤チーム担当のファイルをアプリチームが実装することを防ぐためのチェックリスト。

**TRIGGER when**: impl-planner が実装計画を立案する前（Phase1 ファイル一覧を作成する前）
**TRIGGER when**: impl-reviewer がレビュー対象ファイルを確認する前

---

## 禁止事項

アプリ基盤チーム担当ファイルに実装コードを書くことを禁止する。

**違反例（やってはいけないこと）:**
- `axiosClient.ts` にインターセプターのコードを実装する
- `storeRegistry.ts` に Store 登録ロジックを実装する
- `ErrorGuard.tsx` にエラーハンドリングUIを実装する

---

## 基盤担当ファイルの判定ルール

以下のパスパターンに該当するファイルはアプリ基盤チーム担当。

### frontend/

| パスパターン | 担当理由 |
|---|---|
| `frontend/src/shared/plugins/` 配下すべて | Axios Client・Sentry等の共通プラグイン |
| `frontend/src/shared/stores/storeRegistry.ts` | 全Store一括リセットレジストリ |
| `frontend/src/shared/stores/notification.store.ts` | 通知状態管理（08章） |
| `frontend/src/shared/keys/queryKeyStore.ts` | React Queryキー一元管理 |
| `frontend/src/shared/hooks/useTenantCleanup.ts` | テナント切り替えフック |
| `frontend/src/shared/hooks/use-notification.ts` | リアルタイム通知フック |
| `frontend/src/shared/hooks/useRouteAuditLog.ts` | 画面遷移監査ログフック |
| `frontend/src/shared/api/auditLogClient.ts` | 監査ログ送信インターフェース |
| `frontend/src/shared/components/atoms/ErrorGuard.tsx` | コンポーネント単位Error Boundary |
| `frontend/src/shared/components/molecules/ErrorModal.tsx` | エラーモーダル |
| `frontend/src/shared/utils/errorClassifier.ts` | エラー種別分類ユーティリティ |
| `frontend/src/shared/utils/sanitize.ts` | CSRFトークンCookie読み取り |
| `frontend/src/app/error.tsx` | グローバルError Boundary |
| `frontend/src/app/globals.css` | Tailwind CSS v4デザインシステム定義 |
| `frontend/tsconfig.json` / `eslint.config.mjs` / `.prettierrc` など設定ファイル | 環境設定 |
| `frontend/vitest.config.ts` / `frontend/src/shared/plugins/setup.ts` | テスト設定 |

### bff/

| パスパターン | 担当理由 |
|---|---|
| `bff/src/shared/plugins/` 配下すべて | ミドルウェア・Axiosクライアント |
| `bff/src/shared/guards/auth.guard.ts` | 認証ガード |
| `bff/src/shared/filters/zod-exception.filter.ts` | Zodバリデーション例外フィルター |
| `bff/src/features/notification/notification.gateway.ts` | WebSocketゲートウェイ |
| `bff/src/features/auditLog/` 配下すべて | 監査ログ機能 |
| `bff/tsconfig.json` / `eslint.config.mjs` / `.prettierrc` など設定ファイル | 環境設定 |

### front_bff_shared/

| パスパターン | 担当理由 |
|---|---|
| `front_bff_shared/utils/phiPatterns.ts` | PHIマスク用正規表現 |
| `front_bff_shared/i18n/` 配下すべて | 共通多言語リソース |
| `front_bff_shared/features/notification/` 配下すべて | リアルタイム通信型定義 |
| `front_bff_shared/features/shared/` 配下すべて | 監査ログ型定義 |

完全なリスト → `docs/02_アプリ基盤/01_フロントエンド・BFF/02_詳細設計書/16.アプリ基盤実装コード一覧.md`

---

## 計画時のルール（impl-planner 向け）

**Phase1 のファイル一覧を作成する前に以下を実施すること:**

1. 作成・変更しようとしているファイルが上記パターンに該当しないか確認する
2. 該当するファイルがあった場合、**そのファイルは Phase1 の一覧に含めない**
3. 代わりに「依存関係・注意事項」セクションに以下を記載する:

```
### アプリ基盤担当ファイル（実装しない）
以下のファイルはアプリ基盤チーム担当のため、実装しない。
実装チケット: https://core-mbc.cloudmine.jp/issues/11377

- `{ファイルパス}` — {理由}

これらのファイルが未実装の場合、動作確認は以下の仮実装で代替する:
- （アプリ側で動作確認に必要な暫定スタブがあれば記載。なければ「基盤実装待ち」と記載）
```

---

## レビュー時のルール（impl-reviewer 向け）

レビュー対象ファイルの中に基盤担当パスパターンに該当するものがある場合、**重大な問題** として報告する:

```
### 重大な問題（必ず修正）
- [ ] `{ファイルパス}` - アプリ基盤チーム担当ファイルに実装コードが含まれている
  **修正案:** 実装コードを削除し、以下のTODOコメントのみ残す:
  // TODO: アプリ基盤チーム担当。実装チケット: https://core-mbc.cloudmine.jp/issues/11377
  export {};
```
