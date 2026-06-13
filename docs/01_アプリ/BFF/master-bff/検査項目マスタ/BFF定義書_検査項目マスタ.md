# BFF定義書_master-bff_検査項目マスタ

<!-- 作成単位: master-bff / 機能グループ: 検査項目マスタ
     本書は I/F 仕様のみを定義する。呼び出し元の業務意味は execution-bff 側定義書を参照。 -->

---

## 目次

- [1. 実装前提ルール（AI実装制約）](#1-実装前提ルールai実装制約)
- [2. 文書概要](#2-文書概要)
- [3. API仕様（APIごと）](#3-api仕様apiごと)
- [4. DTO・型定義](#4-dto型定義)
- [5. 外部連携定義](#5-外部連携定義)
- [6. エラー処理方針](#6-エラー処理方針)
- [7. 認証・認可・共通ヘッダ](#7-認証認可共通ヘッダ)

---

## 1. 実装前提ルール（AI実装制約）

→ [BFF共通設計書 §2](../../BFF共通設計書.md#2-実装前提ルールai実装制約) 参照

### 実装対象範囲

- 生成対象: `master-bff` の Controller 層 / Service 層 / Client 層
- 非生成対象: バックエンド（master-domain-service）のコード

---

## 2. 文書概要

- **BFF名**: `master-bff`
- **責務**: マスタ参照系 API の集約・DTO整形・エラー正規化。他BFFからの内部呼び出しを主目的とする
- **呼び出し元BFF**:
  - `execution-bff`（`GET /bff/test-items` から呼び出す）
- **参照資料**
  - `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/03_通信方針.md`
  - `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/05_エラー方針.md`
  - [execution-bff BFF定義書_【RES002】結果入力](../../execution-bff/結果入力/BFF定義書_【RES002】結果入力.md)

### 呼び出し元 ↔ API 対応表

| 呼び出し元BFF API | 本BFF API | 用途 |
| ----------------- | --------- | ---- |
| `GET /bff/test-items`（execution-bff） | `GET /bff/test-item/lists` | 検査項目マスタ検索 |

---

## 3. API仕様（APIごと）

### BFFAPI: GET /bff/test-item/lists

**概要**: 検査項目マスタの一覧を取得する。検索条件（検査項目名・検査コード）での絞り込みに対応する。他BFF（execution-bff等）からの内部呼び出しを想定する。  
**呼び出し元**: `execution-bff` `GET /bff/test-items`（検査項目検索ダイアログ BTN_SEARCH 押下時）

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `itemName` | query | `string` | × | 検査項目名（部分一致）。省略時は絞り込みなし |
| `itemCode` | query | `string` | × | 検査コード（部分一致）。省略時は絞り込みなし |
| `X-Correlation-ID` | header | `string` | ○ | 呼び出し元から転送された相関ID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |
| `Authorization` | header | `string` | ○ | BFF間サービスアカウントトークン（Bearer） |

※ `itemName` と `itemCode` は AND 検索。両方省略時は全件を返す。  
※ `Authorization` は execution-bff のサービスアカウントトークン（フロントの JWT は転送されない）。

#### レスポンス

**成功時（200）**: [`TestItemListResponse`](#testitemlistresponse)

**ステータスコード一覧**

| HTTP | エラーコード | 発生条件 | BFF返却形式 | 備考 |
| :--: | ----------- | -------- | ----------- | ---- |
| 200 | — | 正常 | — | — |
| 401 | `UNAUTHORIZED` | サービスアカウントトークン検証失敗 | `{ type: "AUTH_ERROR", code: "UNAUTHORIZED" }` | — |
| 500 | `SYSTEM_ERROR` | サーバー内部エラー | `{ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }` | — |
| 502 | `BAD_GATEWAY` | master-domain-service 接続不可 | `{ type: "SYSTEM_ERROR", code: "BAD_GATEWAY" }` | 呼び出し元BFFへそのまま返す |
| 504 | `TIMEOUT` | タイムアウト | `{ type: "SYSTEM_ERROR", code: "TIMEOUT" }` | — |

#### サービス層処理仕様

```
1. クエリパラメータ（itemName, itemCode）を取得する
2. master-domain-service の検査項目マスタ検索 API を呼び出す
   GET /api/v1/master/test-items?itemName={itemName}&itemCode={itemCode}
   ※ DB未設計のためモック定義。DB設計確定後に master-domain-service 設計書と照合して更新すること
   - タイムアウト: { type: "SYSTEM_ERROR", code: "TIMEOUT" } を 504 で返す
   - 500: { type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" } を 500 で返す
3. バックエンドレスポンスを TestItemListResponse にマッピングする（マッピング表は5章参照）
4. TestItemListResponse を返す
```

---

## 4. DTO・型定義

```typescript
// shared/types/test-item-master.ts

/** 検査項目マスタ1件 */
export type TestItemRecord = {
  code: string;                         // 検査項目コード（例: GLU）
  name: string;                         // 検査項目名（例: 血糖）
  unit_id: string;                      // 単位コード（例: mg/dL）
  lower_limit: number | null;           // 基準値下限
  upper_limit: number | null;           // 基準値上限
  critical_lower: number | null;        // クリティカル下限
  critical_upper: number | null;        // クリティカル上限
};

/** GET /bff/test-item/lists レスポンス */
export type TestItemListResponse = {
  items: TestItemRecord[];
};

/** BFF統一エラーレスポンス */
export type MasterBffErrorResponse = {
  type: 'AUTH_ERROR' | 'SYSTEM_ERROR';
  code: string;
};
```

---

## 5. 外部連携定義

### 外部呼び出し一覧

| 環境変数 | サービス | 用途 |
| -------- | -------- | ---- |
| `MASTER_SERVICE_URL` | `master-domain-service` | 検査項目マスタ検索 |

| BFF API | 呼び出し先 | メソッド | 呼び出しサービス | 説明 |
| ------- | ---------- | :------: | :--------------: | ---- |
| `GET /bff/test-item/lists` | `/api/v1/master/test-items` | `GET` | master | 検査項目マスタ検索 |

### タイムアウト・リトライポリシー

| 項目 | 値 | 備考 |
| ---- | -- | ---- |
| タイムアウト | `3000ms` | 環境変数 `MASTER_SERVICE_TIMEOUT_MS` で上書き可 |
| リトライ | **なし** | |

### バックエンドレスポンス → BFF DTOマッピング

#### `GET /api/v1/master/test-items` → `TestItemRecord`

※ DB未設計のためモック定義。DB設計確定後に `master-domain-service` 設計書と照合して更新すること。

| バックエンド（`master-domain-service`） | BFF DTO（`TestItemRecord`） | 変換内容 |
| --------------------------------------- | --------------------------- | -------- |
| `code` | `code` | そのまま転送 |
| `name` | `name` | そのまま転送 |
| `unit_id` | `unit_id` | そのまま転送 |
| `lower_limit` | `lower_limit` | そのまま転送（null許容） |
| `upper_limit` | `upper_limit` | そのまま転送（null許容） |
| `critical_lower` | `critical_lower` | そのまま転送（null許容） |
| `critical_upper` | `critical_upper` | そのまま転送（null許容） |

クエリパラメータ転送ルール:

| 呼び出し元クエリ（execution-bff から転送） | バックエンドクエリ | 変換内容 |
| ------------------------------------------ | ----------------- | -------- |
| `itemName` | `itemName` | そのまま転送 |
| `itemCode` | `itemCode` | そのまま転送 |

---

## 6. エラー処理方針

→ [BFF共通設計書 §6](../../BFF共通設計書.md#6-エラー型定義正規化ルール) 参照（内部BFFの方針を適用）

### このBFF固有の注意事項

- 検索結果0件は正常（HTTP 200 + `items: []`）として扱う。404は返さない

---

## 7. 認証・認可・共通ヘッダ

→ [BFF共通設計書 §4](../../BFF共通設計書.md#4-共通ヘッダ定義)・[§5](../../BFF共通設計書.md#5-認証認可方針) 参照（内部BFFの方針を適用）
