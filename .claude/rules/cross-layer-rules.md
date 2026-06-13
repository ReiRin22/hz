# フロント・BFF・BE 横断ルール

フロントエンド・BFF・バックエンドを一貫して実装する際の禁止事項と整合性チェックルール。
implement / fix フェーズで各 Phase の実装前後に参照すること。

---

## 禁止事項

### 型安全性

- `any` 型の使用禁止 — `unknown` に変換してから型ガードで narrowing すること
- `as unknown as T` の二重キャスト禁止 — 根本の型定義を修正すること
- フロントエンドが BFF の internal 型（`*.api.request.ts` / `*.api.response.ts`）を直接 import することを禁止 — `front_bff_shared/` 経由のみ許可
- BFF が FHIR リソース型をフロントエンドへ直接返すことを禁止 — ViewModel に整形してから返す

### 層の責務

| 禁止事項 | 正しい実装場所 |
|---|---|
| UI コンポーネント（Molecule / Atom）内でのビジネスロジック実装 | Organism または hooks/ |
| Organism からの `api/` 直接呼び出し | hooks/ 経由のみ |
| `repository/` 内での直接 `fetch` 呼び出し | `api/` 関数経由のみ |
| BFF Service 層での HTTP レスポンス操作（status / header 設定） | Controller 層 |
| BFF Client 層でのデータ整形・マッピング処理 | Service 層 |

### BE モック実装

- BE（C#）のモックは **Controller 層でリクエスト/レスポンス型を使って固定値を返す** こと
  - OK: `AuthController.cs` が `LoginRequest` を受け取り `LoginResponse` を返す
  - NG: BFF の Client 層（`*.clients.ts`）にモックデータをハードコードする
- BFF の Client 層は常に **HTTP で BE を呼び出す** 実装にすること — BFF 層にモックデータを置かない

### 環境・設定

- Server Component で `NEXT_PUBLIC_*` 変数を使うことを禁止（逆も同様）
  - Server: `process.env.BFF_BASE_URL`
  - Client: `process.env.NEXT_PUBLIC_BFF_BASE_URL`
- `try-catch` ブロック内での `redirect()` 呼び出し禁止 — `redirect` は内部的に例外を投げるため catch に捕まる

---

## 整合性チェックルール

### 型の整合性（Phase 1 / Phase 2 完了時）

- [ ] `front_bff_shared/` の型が BFF の `*.type.ts` と構造一致しているか（同じ型を二重定義していないか）
- [ ] フロントエンドの ViewModel 型が BFF レスポンス型の部分集合になっているか
- [ ] Zod スキーマの型推論（`z.infer<typeof schema>`）と TypeScript 型定義が乖離していないか

### エラーコードの整合性（Phase 7 完了時）

- [ ] BFF が返すエラーコード（`E-xxxx`）が `docs/02_アプリ基盤/01_フロントエンド・BFF/02_詳細設計書/05_エラー方針.md` の一覧に登録済みか
- [ ] フロントエンドのエラーハンドラーが、登録済みのエラーコードのみをハンドリングしているか（幻のコードを処理していないか）

### 操作イベントの end-to-end 整合性（Phase 6 完了時）

設計書の `## 操作イベント定義` に記載された全イベントについて、以下の接続が全て存在するか確認する。

```
操作イベント定義
  → hooks/ に対応関数あり
  → Organism から hooks/ の関数を呼び出している
  → Page から Organism に Props が渡っている
```

各層の単体チェックは Phase-test スキルが行う。この接続チェックは Phase 6 完了後に手動確認する。
