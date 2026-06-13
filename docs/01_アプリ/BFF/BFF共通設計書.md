# BFF共通設計書

<!-- 対象: このプロジェクトで使用する全BFF（フロント向け・内部BFF問わず）
     個別設計書に同一内容を書かない。本書を参照する形にすること。 -->

---

## 目次

- [BFF一覧・責務概要](#bff一覧責務概要)
- [実装前提ルール（AI実装制約）](#実装前提ルールai実装制約)
- [命名規則](#命名規則)
- [共通ヘッダ定義](#共通ヘッダ定義)
- [認証・認可方針](#認証認可方針)
- [エラー型定義・正規化ルール](#エラー型定義正規化ルール)
  - [BFF統一エラーレスポンス型](#bff統一エラーレスポンス型)
  - [HTTPステータス → BFF type マッピング](#httpステータス--bff-type-マッピング)
  - [複数バックエンドエラー発生時の優先順位](#複数バックエンドエラー発生時の優先順位)
  - [エラー正規化実装例（NestJS service 層）](#エラー正規化実装例nestjs-service-層)
- [タイムアウト・リトライ基本方針](#タイムアウトリトライ基本方針)
- [BFF間呼び出しポリシー](#bff間呼び出しポリシー)
- [エラー処理の責務分担](#エラー処理の責務分担)

---

## BFF一覧・責務概要

BFFは業務フェーズ単位で分割する。1つのBFFが肥大化した場合は機能グループ単位での追加分割を検討する。

| No | BFF名 | 主軸 | 主な利用者 | 種別 |
| :-: | ------------- | ---------- | ----------- | :----: |
| ① | `order-bff` | 依頼・確定 | 医師 | フロント向け |
| ② | `execution-bff` | 実施・結果 | 部門 | フロント向け |
| ③ | `chart-bff` | 記録・閲覧 | 医師・看護 | フロント向け |
| ④ | `schedule-bff` | 予定・時間軸 | 受付・部門 | フロント向け |
| ⑤ | `common-bff` | 共通参照 | 全体 | フロント向け |
| ⑥ | `patient-bff` | 患者情報 | 全体 | フロント向け |
| ⑦ | `master-bff` | マスタ参照 | 全体 | 内部BFF |
| ⑧ | `nursing-bff` | 看護・病棟 | 看護師 | フロント向け |
| ⑨ | `external-bff` | 外部連携 | システム | フロント向け |

**種別の定義**

- **フロント向け**: フロントエンドから直接呼ばれる。JWTによるユーザー認証を実施する
- **内部BFF**: 他BFFからのみ呼ばれる。サービスアカウントトークンによる認証を実施する

### BFF間連携マップ

```
フロントエンド
  ├─ order-bff     → schedule-bff, execution-bff
  ├─ execution-bff → order-bff, chart-bff, common-bff, master-bff
  ├─ chart-bff     → execution-bff, order-bff, patient-bff
  ├─ schedule-bff  → order-bff, execution-bff
  ├─ common-bff    → patient-bff
  ├─ patient-bff   → common-bff, chart-bff, order-bff
  ├─ nursing-bff   → chart-bff, patient-bff, common-bff
  └─ external-bff  → execution-bff, chart-bff, order-bff
         ↓（内部BFF）
       master-bff  ← order-bff, execution-bff, nursing-bff
```

---

## 実装前提ルール（AI実装制約）

全BFF個別設計書に共通して適用する。個別設計書への再掲不要。

- 本設計書は Claude Code による自動実装を前提とする
- 記載のない業務ロジックは実装しない
- 記載のない例外処理・最適化・省略実装は禁止
- 命名規則・構造は本書および個別設計書に従う
- フロントエンドの UI 制御ロジックは実装しない
- バックエンドの永続化・業務判定ロジックは実装しない

### 実装対象範囲（全BFF共通）

- 生成対象: 各BFFの Controller 層 / Service 層 / Client 層
- 非生成対象: バックエンド（ドメインサービス）のコード
- 業務ルール判定・データ永続化はバックエンドに委譲する

---

## 命名規則

### BFF名・ディレクトリ

| 対象 | 規則 | 例 |
| ---- | ---- | -- |
| BFF名 | `{業務フェーズ}-bff`（kebab-case） | `execution-bff`, `master-bff` |
| ディレクトリ | BFF名と同名 | `execution-bff/` |
| 設計書ディレクトリ | `docs/01_アプリ/BFF/{BFF名}/{機能グループ名}/` | `execution-bff/結果入力/` |

### エンドポイント

| 対象 | 規則 | 例 |
| ---- | ---- | -- |
| パスプレフィックス | `/bff/` 固定（全BFF共通） | `/bff/orders/{id}/test-results` |
| パスセグメント | kebab-case | `/bff/test-items`, `/bff/modification-reason` |
| パスパラメータ | camelCase | `{orderUuid}`, `{patientId}` |
| クエリパラメータ | camelCase | `?itemName=xxx&itemCode=yyy` |

HTTPメソッドは副作用の有無で判断する。副作用を伴う操作（ロック取得・状態変更）はPOSTを採用し、その理由を個別設計書の概要欄に明記すること。

### TypeScript型名

| 対象 | 規則 | 例 |
| ---- | ---- | -- |
| レスポンス型 | `{対象}{操作}Response` | `TestResultsInitialResponse`, `TestItemListResponse` |
| リクエスト型 | `{対象}{操作}Request` | `TestResultSaveRequest` |
| リクエスト内ネスト型 | `{対象}{役割}` | `TestResultSaveItem`, `ModificationReasonInput` |
| エラーレスポンス型 | `BffErrorResponse`（全BFF共通・1種類） | — |
| 共有型ファイル | `shared/types/{ドメイン}.ts`（kebab-case） | `shared/types/test-results.ts` |

### 環境変数

| 対象 | 規則 | 例 |
| ---- | ---- | -- |
| サービスURL | `{SERVICE_NAME}_SERVICE_URL` | `EXECUTION_SERVICE_URL`, `MASTER_SERVICE_URL` |
| BFF間URL | `{BFF_NAME}_URL` | `MASTER_BFF_URL` |
| タイムアウト値 | `{SERVICE_OR_BFF_NAME}_TIMEOUT_MS` | `BACKEND_TIMEOUT_MS`, `MASTER_BFF_TIMEOUT_MS` |

### NestJSクラス名

| 対象 | 規則 | 例 |
| ---- | ---- | -- |
| Controller | `{機能名}Controller` | `TestResultsController` |
| Service | `{機能名}Service` | `TestResultsService` |
| Client（BE呼び出し） | `{サービス名}Client` | `ExecutionClient`, `MasterClient` |
| DTO クラス | 上記3.3の型名規則と同じ | `TestResultSaveRequest` |

---

## 共通ヘッダ定義

### フロントエンド → フロント向けBFF

| ヘッダ名 | 必須 | 説明 |
| -------- | :--: | ---- |
| `Authorization` | ○ | `Bearer {JWT}`（Keycloak発行） |
| `X-Tenant-Id` | ○ | テナントID（マルチテナント識別） |
| `X-Correlation-ID` | ○ | 相関ID（フロントが発番。監査ログ・分散トレーシングに使用） |

### フロント向けBFF → バックエンド（ドメインサービス）

| ヘッダ名 | 転送 | 説明 |
| -------- | :--: | ---- |
| `X-Tenant-Id` | ○ | そのまま転送 |
| `X-Correlation-ID` | ○ | そのまま転送（分散トレーシング） |
| `Authorization` | × | BFFがJWT検証済み。サービス間認証は別途サービスアカウントトークンを使用 |

### フロント向けBFF → 内部BFF（BFF間呼び出し）

| ヘッダ名 | 必須 | 説明 |
| -------- | :--: | ---- |
| `Authorization` | ○ | `Bearer {サービスアカウントトークン}`（フロントのJWTは転送しない） |
| `X-Tenant-Id` | ○ | そのまま転送 |
| `X-Correlation-ID` | ○ | フロントから受け取った値をそのまま転送 |

### 内部BFF → バックエンド（ドメインサービス）

| ヘッダ名 | 転送 | 説明 |
| -------- | :--: | ---- |
| `X-Tenant-Id` | ○ | そのまま転送 |
| `X-Correlation-ID` | ○ | そのまま転送（分散トレーシング） |
| `Authorization` | × | 別途サービスアカウントトークンを使用 |

---

## 認証・認可方針

### フロント向けBFF

- 全エンドポイントで **JWTを検証**する（NestJS Middleware）
- `X-Tenant-Id` ヘッダの存在チェックを必須とする
- 認可制御（ロール・権限チェック）は**バックエンドに委譲**する
- JWTクレームからユーザー情報を取得する場合は `@CurrentUser()` カスタムデコレータ（`req.user`）を使用する
  - `req.user` には JWT Middleware が検証・デコードした `{ sub: string, name: string, ... }` が格納されている前提

### 内部BFF

- 全エンドポイントで **サービスアカウントトークンを検証**する
- `X-Tenant-Id` ヘッダの存在チェックを必須とする
- 認可制御（ロール・権限チェック）は実施しない（マスタ参照・集約処理のため）

---

## エラー型定義・正規化ルール

### BFF統一エラーレスポンス型

全BFF共通。`shared/types/bff-error.ts` に定義する。

```typescript
// shared/types/bff-error.ts

/** BFF統一エラーレスポンス（全BFF共通） */
export type BffErrorResponse = {
  type: 'BUSINESS_ERROR' | 'AUTH_ERROR' | 'NOT_FOUND' | 'CONFLICT' | 'SYSTEM_ERROR';
  code: string;              // バックエンドのエラーコードをそのまま使用 or BFF独自コード
  lockedByUserName?: string; // type=CONFLICT かつ他ユーザーロック中の場合のみ付与
};
```

### HTTPステータス → BFF type マッピング

| バックエンドエラー | BFF `type` | BFF `code` | 返却HTTPステータス |
| ------------------ | ---------- | ---------- | :----------------: |
| HTTP 400（業務バリデーション） | `BUSINESS_ERROR` | バックエンドの `errorCode` をそのまま使用 | 400 |
| HTTP 401 | `AUTH_ERROR` | `UNAUTHORIZED` | 401 |
| HTTP 403 | `AUTH_ERROR` | `FORBIDDEN` | 403 |
| HTTP 404 | `NOT_FOUND` | `NOT_FOUND` | 404 |
| HTTP 409（排他競合） | `CONFLICT` | `CONFLICT` | 409 |
| HTTP 500 以上 | `SYSTEM_ERROR` | `SYSTEM_ERROR` | 500 |
| 上流サービス障害（502受信・接続不可） | `SYSTEM_ERROR` | `BAD_GATEWAY` | 502 |
| タイムアウト | `SYSTEM_ERROR` | `TIMEOUT` | 504 |

**409 CONFLICT の補足**: `lockedByUserName` の付与有無はAPI固有の挙動のため、個別設計書のステータスコード一覧に記載する。

### 複数バックエンドエラー発生時の優先順位

1つのBFFエンドポイントが複数バックエンドを呼び出す場合、エラーが複数発生しても `BffErrorResponse` は1件しか返せない。この場合は以下の優先度順で最も高いエラーを返す。

| 優先度 | type | 選択理由 |
| :----: | ---- | -------- |
| 1（最高） | `SYSTEM_ERROR` | システム異常中の操作継続を防ぐ（データ整合性保証不可） |
| 2 | `AUTH_ERROR` | アクセス権なし（操作続行不可） |
| 3 | `CONFLICT` | 排他競合は即座に通知が必要 |
| 4 | `NOT_FOUND` | 対象リソース未発見 |
| 5（最低） | `BUSINESS_ERROR` | 入力値の問題（最も軽微） |

**SYSTEM_ERROR を最優先とする理由**: 医療行為の記録・確定操作でデータ不整合が起きると患者安全に直結する。システム異常を最優先で通知し、フロントが「入力を修正すれば操作できる」と誤判断して再試行するのを防ぐ。

**実装指針**: `Promise.allSettled` 等で並列呼び出しを行い、rejected な結果を収集した後、上記優先度順で最上位の `type` を持つエラーを `throw` する。同一優先度のエラーが複数ある場合は最初に発生したものを採用する。

### エラー正規化実装例（NestJS service 層）

```typescript
try {
  return await this.client.callBackend(params);
} catch (error) {
  if (error.response?.status === 400) {
    throw new HttpException(
      { type: 'BUSINESS_ERROR', code: error.response.data.errorCode },
      HttpStatus.BAD_REQUEST,
    );
  }
  if (error.response?.status === 401) {
    throw new HttpException(
      { type: 'AUTH_ERROR', code: 'UNAUTHORIZED' },
      HttpStatus.UNAUTHORIZED,
    );
  }
  if (error.response?.status === 403) {
    throw new HttpException(
      { type: 'AUTH_ERROR', code: 'FORBIDDEN' },
      HttpStatus.FORBIDDEN,
    );
  }
  if (error.response?.status === 404) {
    throw new HttpException(
      { type: 'NOT_FOUND', code: 'NOT_FOUND' },
      HttpStatus.NOT_FOUND,
    );
  }
  if (error.response?.status === 409) {
    // API固有の付与フィールド（lockedByUserName等）は個別設計書に従う
    throw new HttpException(
      { type: 'CONFLICT', code: 'CONFLICT' },
      HttpStatus.CONFLICT,
    );
  }
  // タイムアウト・接続不可はClientクラスで検出してエラーをスローする
  throw new HttpException(
    { type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
```

---

## タイムアウト・リトライ基本方針

### デフォルト値

| 呼び出し先 | デフォルトタイムアウト | 環境変数（上書き可） |
| ---------- | :--------------------: | -------------------- |
| バックエンド（ドメインサービス） | `5000ms` | `BACKEND_TIMEOUT_MS` |
| 内部BFF間 | `3000ms` | `{BFF名}_TIMEOUT_MS`（例: `MASTER_BFF_TIMEOUT_MS`） |

### リトライポリシー

**全エンドポイント共通: リトライなし。**

理由: 冪等でない操作（POST/DELETE によるロック取得・解放・保存）を含むAPIでの二重実行を防ぐため。

---

## BFF間呼び出しポリシー

### 認証

- フロントのJWTは内部BFFへ転送しない
- 呼び出し元BFFのサービスアカウントトークンを使用する

### ヘッダ転送

- `X-Correlation-ID` はフロントから受け取った値をそのまま転送する（分散トレーシング維持）
- `X-Tenant-Id` はそのまま転送する

### エラーハンドリング

内部BFFからのエラーレスポンスはそのままフロントへ返さず、呼び出し元BFFが正規化して返す。

| 内部BFFからのエラー | 呼び出し元BFFの返却 |
| ------------------- | ------------------- |
| 401（トークン検証失敗） | `{ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }` を 500 で返す（設定ミス扱い） |
| 500 | `{ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }` を 500 で返す |
| 502（内部BFF側の上流障害） | `{ type: "SYSTEM_ERROR", code: "BAD_GATEWAY" }` を 502 で返す |
| 504 またはタイムアウト | `{ type: "SYSTEM_ERROR", code: "TIMEOUT" }` を 504 で返す |

---

## エラー処理の責務分担

BFFの役割は「バックエンドのエラーをフロントが扱いやすい形に正規化する」ことに限定する。

| 層 | 役割 | やっていいこと | やってはいけないこと |
| -- | ---- | -------------- | -------------------- |
| **バックエンド** | 業務的に何が起きたかを返す | `{ errorCode: "ORDER_ALREADY_CONFIRMED", detail: {...} }` | フロント向けメッセージの生成 |
| **BFF** | エラーの正規化・仕分け | `{ type: "BUSINESS_ERROR", code: "ORDER_ALREADY_CONFIRMED" }` | エラーメッセージ文字列の生成・i18nキーの付与 |
| **フロントエンド** | コードに応じたUI制御 | `if (error.code === "ORDER_ALREADY_CONFIRMED") { showMessage(...) }` | バックエンドの生エラーを直接表示 |

**メッセージ文字列はフロントエンドが管理する。BFFはコードのみを返す。**
