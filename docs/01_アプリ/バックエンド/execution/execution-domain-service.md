# 実装計画書_execution-domain-service

<!-- モジュール責任: 検査オーダーの実施・結果管理（結果 CRUD・排他ロック・業務バリデーション）はここだけが管理する。 -->

---

## 目次

- [実装前提ルール（AI実装制約）](#実装前提ルールai実装制約)
- [文書概要](#文書概要)
- [API一覧（Controller層）](#api一覧controller層)
- [API仕様（APIごと）](#api仕様apiごと)
- [ドメインモデル・型定義](#ドメインモデル型定義)
- [業務ルール仕様](#業務ルール仕様)
- [エラーコード一覧](#エラーコード一覧)

---

## 実装前提ルール（AI実装制約）

- 本設計書は Claude Code による自動実装を前提とする
- 記載のない業務ロジックは実装しない
- 記載のない例外処理・最適化・省略実装は禁止
- 命名規則・構造は本設計書に従う
- BFF・フロントエンドの処理ロジックは実装しない
- コントローラー層の共通規約は [バックエンド共通設計書](../バックエンド共通設計書.md) に従う

### 実装対象範囲

- 生成対象: `execution-domain-service` の Controller 層 / Service 層 / Repository 層
- 非生成対象: BFF・フロントエンドのコード

---

## 文書概要

- **サービス名**: `execution-domain-service`
- **責務**: 検査オーダーの実施・結果管理（結果 CRUD・排他ロック・業務バリデーション）
- **呼び出し元**: `execution-bff`
- **参照資料**
  - [BFF定義書_【RES002】結果入力](../../BFF/execution-bff/結果入力/BFF定義書_【RES002】結果入力.md)
  - [バックエンド共通設計書](../バックエンド共通設計書.md)

### BFF → バックエンド API 対応表

| BFF API（execution-bff） | バックエンドAPI（execution-domain-service） | 用途 |
| ------- | -------------- | ---- |
| `POST /bff/orders/{orderUuid}/test-results` | `POST /api/v1/orders/{orderUuid}/test-results/lock` | 編集ロック取得（execution-bff が直接呼び出し） |
| `POST /bff/orders/{orderUuid}/test-results` | `GET /api/v1/orders/{orderUuid}/test-results` | 結果一覧取得 |
| `POST /bff/orders/{orderUuid}/test-results/save` | `POST /api/v1/orders/{orderUuid}/test-results` | 結果確定保存 |
| `POST /bff/orders/{orderUuid}/test-results/save` | `DELETE /api/v1/orders/{orderUuid}/test-results/lock` | 編集ロック解放（確定保存後・非同期 fire-and-forget） |

※ 編集ロック取得は execution-bff から execution-domain-service へ直接呼び出す（common-bff 経由ではない）。

---

## API一覧（Controller層）

| メソッド | パス | 概要 | ステータス |
| :------: | ---- | ---- | :--------: |
| `POST`   | `/api/v1/orders/{orderUuid}/test-results/lock` | 編集ロック取得 | 設計完了（RES002） |
| `DELETE` | `/api/v1/orders/{orderUuid}/test-results/lock` | 編集ロック解放 | 設計完了（RES002） |
| `GET`    | `/api/v1/orders/{orderUuid}/test-results` | 検査結果一覧取得 | 設計完了（RES002） |
| `POST`   | `/api/v1/orders/{orderUuid}/test-results` | 結果確定保存 | 設計完了（RES002） |

---

## API仕様（APIごと）

### `POST /api/v1/orders/{orderUuid}/test-results/lock`

**概要**: 指定オーダーの検査結果編集ロックを取得する。  
**呼び出し元**: execution-bff（EVT_INIT01）  
**呼び出しタイミング**: 初期表示データ取得の前（逐次実行）

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `orderUuid` | path | `string` | ○ | 対象オーダーのUUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID（[共通規約](../バックエンド共通設計書.md#1-共通ヘッダー仕様)参照） |
| `X-Correlation-ID` | header | `string` | ○ | 相関ID（監査ログに記録） |

リクエストボディなし。

#### レスポンス

**成功時（200）**

```typescript
type LockAcquireResponse = {
  lockId: string;          // ロックID（UUID）
  lockedAt: string;        // ISO 8601
  expiresAt: string;       // ロック有効期限（ISO 8601、ロック取得から30分）
};
```

**ステータスコード一覧**

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200 | — | 正常（ロック取得成功） |
| 404 | `ORDER_NOT_FOUND` | orderUuid に対応するオーダーが存在しない |
| 409 | `LOCK_CONFLICT` | 他ユーザーが有効なロックを保持中 |
| 500 | `SYSTEM_ERROR` | サーバー内部エラー |

409 レスポンスボディ:
```typescript
type LockConflictBody = {
  errorCode: "LOCK_CONFLICT";
  lockedByUserId: string;
  lockedByUserName: string;
  lockedAt: string;        // ISO 8601
};
```

#### 処理仕様

```
1. test_result_locks テーブルで orderUuid の有効ロックを検索する
   （有効: expiresAt > 現在時刻 AND tenantId = リクエストの X-Tenant-Id）
2. 他ユーザーのロックが存在する場合: 409 LOCK_CONFLICT を返す
3. 自ユーザーのロックが存在する場合: expiresAt を現在時刻 + 30分に更新して 200 を返す
4. ロックが存在しない場合: 新規レコードを INSERT して 200 を返す
5. ロック取得成功を監査ログに記録する（X-Correlation-ID を含む）
```

---

### `DELETE /api/v1/orders/{orderUuid}/test-results/lock`

**概要**: 指定オーダーの検査結果編集ロックを解放する。  
**呼び出し元**: execution-bff（確定保存後・非同期）  
**呼び出しタイミング**: 確定保存 API 成功後（非同期 fire-and-forget）

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `orderUuid` | path | `string` | ○ | 対象オーダーのUUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

#### レスポンス

| HTTP | 説明 |
| :--: | ---- |
| 204 | 正常（ロック解放または存在しなかった場合も 204） |
| 403 | 他ユーザーのロックを解放しようとした |

#### 処理仕様

```
1. test_result_locks テーブルで orderUuid かつ呼び出しユーザーのロックを検索する
2. 存在する場合: レコードを DELETE して 204 を返す
3. 存在しない場合: 204 を返す（冪等性を保証する）
4. 他ユーザーのロックが存在する場合: 403 を返す（上書き解放禁止）
```

---

### `GET /api/v1/orders/{orderUuid}/test-results`

**概要**: 指定オーダーの検査結果一覧を取得する。reasonRequired 判定値（hasConfirmedResults）を含む。  
**呼び出し元**: execution-bff（EVT_INIT01、ロック取得成功後の並列呼び出し）

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `orderUuid` | path | `string` | ○ | 対象オーダーのUUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

#### レスポンス

**成功時（200）**

```typescript
type TestResultsGetResponse = {
  orderUuid: string;
  hasConfirmedResults: boolean;  // 確定済み結果が1件以上存在する場合 true（BFF で reasonRequired に変換）
  testResults: TestResultRecord[];
};
type TestResultRecord = {
  itemCode: string;
  itemName: string;
  resultValue: number | null;
  unit: string;
  referenceValueDisplay: string | null;  // lowerLimit・upperLimit 両方 non-null の場合 "${lower}–${upper}" に整形して返す。どちらかが null の場合は null
  lowerLimit: number | null;
  upperLimit: number | null;
  criticalLower: number | null;
  criticalUpper: number | null;
  previousResultValue: number | null;
  hasPreviousResult: boolean;
  testDate: string | null;            // YYYY-MM-DD
  hasTestDate: boolean;
  isUserAdded: boolean;               // true=ユーザーが追加した行（削除可能）
  isAutoLinked: boolean;              // true=自動連携行（削除不可・VALIDATION_DELETE）
  confirmedAt: string | null;         // ISO 8601、未確定は null
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200 | — | 正常 |
| 404 | `ORDER_NOT_FOUND` | オーダーが存在しない |

---

### `POST /api/v1/orders/{orderUuid}/test-results`

**概要**: 検査結果を確定保存する。自動連携行の削除を検知した場合は 400 を返す。  
**呼び出し元**: execution-bff（EVT_TEST_RESULT_CONFIRM / EVT_EDIT_REASON_CONFIRM）

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `orderUuid` | path | `string` | ○ | 対象オーダーのUUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |
| `X-Correlation-ID` | header | `string` | ○ | 相関ID（監査ログに記録） |

```typescript
type TestResultsSaveRequest = {
  testResults: TestResultSaveRecord[];
  modificationReason?: {
    reasonCode: string;      // 修正理由コード
    reasonText?: string;     // reasonCode='OTHER' の場合は必須
  };
};
type TestResultSaveRecord = {
  itemCode: string;
  resultValue: number;
  unit: string;
  lowerLimit?: number;
  upperLimit?: number;
  testDate?: string;          // YYYY-MM-DD
};
```

#### レスポンス

**成功時（200）**

```typescript
type TestResultsSaveResponse = {
  orderUuid: string;
  savedAt: string;            // ISO 8601
};
```

**ステータスコード一覧**

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200 | — | 正常 |
| 400 | `VALIDATION_DELETE` | 自動連携行（isAutoLinked=true）が送信リストから欠落している |
| 404 | `ORDER_NOT_FOUND` | オーダーが存在しない |
| 409 | `LOCK_EXPIRED` | 編集ロックが期限切れまたは存在しない |
| 500 | `SYSTEM_ERROR` | サーバー内部エラー |

#### 処理仕様

```
1. 呼び出しユーザーの編集ロック有効性を確認する
   （test_result_locks テーブル: orderUuid + userId + expiresAt > 現在時刻）
   → 無効の場合: 409 LOCK_EXPIRED
2. DB から isAutoLinked=true の行一覧を取得する
3. リクエストの testResults に isAutoLinked=true の全 itemCode が含まれるか検証する
   → 欠落がある場合: 400 VALIDATION_DELETE
4. testResults を UPSERT する（itemCode が一致する既存行を更新、存在しない行は INSERT）
5. isUserAdded=true で リクエストに含まれない行を DELETE する
6. 全行の confirmedAt を現在時刻で更新する
7. modificationReason が存在する場合: test_result_modification_reasons テーブルに INSERT する
8. 監査ログを記録する（X-Correlation-ID 含む）
9. 200 を返す
```

---

## ドメインモデル・型定義

```typescript
// execution-domain-service 内部のドメイン型（DDL との対応）

/** 検査結果ロックレコード（test_result_locks テーブル） */
type TestResultLock = {
  lockId: string;            // UUID PK
  orderUuid: string;         // FK → orders.uuid
  tenantId: string;
  lockedByUserId: string;
  lockedByUserName: string;
  lockedAt: string;          // ISO 8601
  expiresAt: string;         // lockedAt + 30分
};

/** 検査結果レコード（test_results テーブル） */
type TestResult = {
  id: number;                // PK
  orderUuid: string;         // FK
  tenantId: string;
  itemCode: string;
  resultValue: number | null;
  unit: string;
  lowerLimit: number | null;
  upperLimit: number | null;
  testDate: string | null;
  isUserAdded: boolean;
  isAutoLinked: boolean;
  confirmedAt: string | null;
  confirmedByUserId: string | null;
};
```

---

## 業務ルール仕様

### 排他ロック管理

| ルール | 仕様 |
| ------ | ---- |
| ロック有効期間 | ロック取得（または更新）から **30分** |
| 同一ユーザーの再取得 | 許可。expiresAt を現在時刻 + 30分に更新する |
| 他ユーザーのロック中 | 409 LOCK_CONFLICT を返す（上書き不可） |
| ロック解放タイミング | 保存 API 成功後に BFF が非同期で DELETE する |
| 期限切れロックの自動解放 | expiresAt < 現在時刻のレコードは有効ロックと見なさない（DELETE は不要、上書き INSERT 可） |
| マルチテナント境界 | tenantId が異なるロックは相互に影響しない |

### reasonRequired 判定（hasConfirmedResults）

- `GET /api/v1/orders/{orderUuid}/test-results` のレスポンスに `hasConfirmedResults` を含める
- 判定条件: **同一 orderUuid で `confirmedAt IS NOT NULL` の行が1件以上存在する場合 `true`**
- BFF は `hasConfirmedResults` を `reasonRequired` としてフロントに渡す

### 自動連携行の削除防止（VALIDATION_DELETE）

- `isAutoLinked=true` の行は外部システムから連携されたデータ
- 確定保存時に DB の `isAutoLinked=true` 全行が送信リストに含まれているかチェックする
- 欠落が検出された場合: **400 エラーコード `VALIDATION_DELETE`** を返す

---

## エラーコード一覧

| エラーコード | HTTP | 説明 | BFF変換後 type |
| ----------- | :--: | ---- | :------------: |
| `ORDER_NOT_FOUND` | 404 | 指定のオーダーが存在しない | `NOT_FOUND` |
| `LOCK_CONFLICT` | 409 | 他ユーザーが編集ロック中 | `CONFLICT` |
| `LOCK_EXPIRED` | 409 | 編集ロックが期限切れ | `CONFLICT` |
| `VALIDATION_DELETE` | 400 | 自動連携行の削除試行 | `BUSINESS_ERROR` |
| `SYSTEM_ERROR` | 500 | サーバー内部エラー | `SYSTEM_ERROR` |
