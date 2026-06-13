# 実装計画書_result-domain-service

<!-- モジュール責任: 実際に実施された事実・検査/処置の結果値はここだけが管理する。 -->

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

### 実装対象範囲

- 生成対象: `result-domain-service` の Controller 層 / Service 層 / Repository 層
- 非生成対象: BFF・フロントエンドのコード

---

## 文書概要

- **サービス名**: `result-domain-service`
- **責務**: 実施記録管理・検査結果保存・結果確定・外部機器連携結果取込
- **呼び出し元**: 検査系 BFF・外部機器連携システム
- **真実の源泉**: 実際に実施された事実・検査/処置の結果値

> **注意（RES002実装時）**: RES002（結果入力）の実装に必要なAPIは `execution-domain-service` が担当する。
> - 本ファイルは `result-domain-service`（外部機器連携・実施記録）の設計書であり、RES002の直接の実装対象ではない。
> - RES002の実装対象設計書: [`(仮)バックエンド設計書_【RES002】結果入力.md`](../(仮)バックエンド設計書_【RES002】結果入力.md)
> - 単位マスタ・修正理由マスタ・検査項目マスタのモックAPI定義は同設計書の [§7 master-domain-service モックAPI定義](../(仮)バックエンド設計書_【RES002】結果入力.md#7-master-domain-service-モックapi定義) を参照。

---

## API一覧（Controller層）

| メソッド | パス | 概要 | ステータス |
| :------: | ---- | ---- | :--------: |
| `POST`   | `/api/v1/results` | 実施記録・結果登録 | 設計中 |
| `GET`    | `/api/v1/results/{resultId}` | 結果取得 | 設計中 |
| `PUT`    | `/api/v1/results/{resultId}` | 結果更新（未確定） | 設計中 |
| `POST`   | `/api/v1/results/{resultId}/finalize` | 結果確定 | 設計中 |
| `GET`    | `/api/v1/orders/{orderId}/results` | オーダーに紐づく結果一覧 | 設計中 |
| `POST`   | `/api/v1/results/import` | 外部機器連携結果取込 | 設計中 |

---

## API仕様（APIごと）

### `POST /api/v1/results`

**概要**: 実施記録と検査結果を登録する。  
**呼び出し元**: 検査系 BFF・看護系 BFF  
**呼び出しタイミング**: 検査・処置を実施したとき

#### リクエスト

```typescript
type ResultCreateRequest = {
  tenantId: string;
  orderId: string;                 // オーダーUUID
  executedBy: string;             // 実施者ID
  executedAt: string;             // 実施日時（ISO 8601）
  resultItems: ResultItemInput[];  // 結果値一覧
  memo?: string;                   // 実施メモ（省略可）
};

type ResultItemInput = {
  itemCode: string;                // 検査項目コード（マスタID）
  value: string;                   // 結果値（数値・文字列いずれも string で受け取る）
  unit?: string;                   // 単位
  referenceRange?: string;         // 基準値範囲（例: "3.5-5.5"）
  abnormalFlag?: 'H' | 'L' | 'A'; // 異常フラグ（High/Low/Abnormal）
};
```

#### レスポンス

**成功時（201）**

```typescript
type ResultCreateResponse = {
  resultId: string;                // 発行された結果ID（UUID）
  orderId: string;
  status: 'PRELIMINARY';          // 未確定状態
  createdAt: string;               // ISO 8601
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 201  | —           | 正常（結果登録成功） |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 404  | `ORDER_NOT_FOUND` | 指定オーダーが存在しない |
| 409  | `ORDER_ALREADY_COMPLETED` | オーダーが既に COMPLETED |
| 500  | `SYSTEM_ERROR` | サーバー内部エラー |

#### 処理仕様

```
1. リクエストをバリデーションする（必須項目・形式チェック）
2. order-domain-service で orderId の存在確認（存在しない場合: 404）
3. order の status が CANCELLED / COMPLETED でないことを確認（409）
4. 結果IDを UUID で発行する
5. test_results テーブルに INSERT する（status = 'PRELIMINARY'）
6. test_result_items テーブルに resultItems を INSERT する
7. order-domain-service へ status = IN_PROGRESS の更新を通知する
8. 監査ログを記録する
9. 201 を返す
```

---

### `GET /api/v1/results/{resultId}`

**概要**: 結果IDで実施記録・検査結果を1件取得する。

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `resultId` | path | `string` | ○ | 結果UUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

#### レスポンス

**成功時（200）**

```typescript
type ResultResponse = {
  resultId: string;
  orderId: string;
  status: 'PRELIMINARY' | 'FINAL' | 'CORRECTED';
  executedBy: string;
  executedAt: string;
  resultItems: ResultItem[];
  memo: string | null;
  finalizedAt: string | null;
  finalizedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

type ResultItem = {
  itemCode: string;
  value: string;
  unit: string | null;
  referenceRange: string | null;
  abnormalFlag: 'H' | 'L' | 'A' | null;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `RESULT_NOT_FOUND` | 結果が存在しない |

---

### `PUT /api/v1/results/{resultId}`

**概要**: 未確定（PRELIMINARY）の結果を更新する。

#### リクエスト

```typescript
type ResultUpdateRequest = {
  resultItems: ResultItemInput[];
  memo?: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `RESULT_NOT_FOUND` | 結果が存在しない |
| 400  | `RESULT_ALREADY_FINALIZED` | 確定済み結果への更新は不可 |

#### 処理仕様

```
1. resultId AND tenantId で結果を検索する（存在しない場合: 404）
2. status が PRELIMINARY であることを確認（それ以外: 400）
3. test_result_items を DELETE して再 INSERT する
4. test_results テーブルを UPDATE する
5. 監査ログを記録する
6. 200 を返す
```

---

### `POST /api/v1/results/{resultId}/finalize`

**概要**: 結果を確定する（PRELIMINARY → FINAL）。確定後は PUT による更新不可。

#### リクエスト

リクエストボディなし。

**成功時（200）**

```typescript
type ResultFinalizeResponse = {
  resultId: string;
  status: 'FINAL';
  finalizedAt: string;             // ISO 8601
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `RESULT_NOT_FOUND` | 結果が存在しない |
| 400  | `RESULT_ALREADY_FINALIZED` | 既に確定済み |

#### 処理仕様

```
1. resultId AND tenantId で結果を検索する（存在しない場合: 404）
2. status が PRELIMINARY であることを確認（それ以外: 400）
3. status = 'FINAL'、finalizedAt = 現在日時 で UPDATE する
4. order-domain-service へ status = COMPLETED の更新を通知する
5. 監査ログを記録する
6. 200 を返す
```

---

### `GET /api/v1/orders/{orderId}/results`

**概要**: オーダーに紐づく結果一覧を取得する。

**成功時（200）**

```typescript
type ResultListResponse = {
  total: number;
  results: ResultSummary[];
};
type ResultSummary = {
  resultId: string;
  status: 'PRELIMINARY' | 'FINAL' | 'CORRECTED';
  executedBy: string;
  executedAt: string;
  itemCount: number;
  hasAbnormal: boolean;           // 異常値が含まれる場合 true
};
```

---

### `POST /api/v1/results/import`

**概要**: 外部機器（検査機器等）から連携された結果データを一括取込する。  
**呼び出し元**: 外部機器連携システム・連携 BFF

#### リクエスト

```typescript
type ResultImportRequest = {
  tenantId: string;
  deviceId: string;                // 機器ID
  importedResults: ExternalResultInput[];
};

type ExternalResultInput = {
  externalOrderId: string;         // 外部機器上のオーダー識別子
  orderId: string;                 // 対応するシステム内 orderId
  executedAt: string;              // 実施日時（ISO 8601）
  resultItems: ResultItemInput[];
};
```

**成功時（202）**

```typescript
type ResultImportResponse = {
  importId: string;                // 取込バッチID
  acceptedCount: number;
  rejectedCount: number;
  rejectedItems: RejectedItem[];   // 取込失敗した行の詳細
};
type RejectedItem = {
  externalOrderId: string;
  reason: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 202  | —           | 正常（取込受付） |
| 400  | `VALIDATION_ERROR` | フォーマット不正 |

#### 処理仕様

```
1. リクエストをバリデーションする
2. importedResults を順次処理する
   - orderId が存在しない / CANCELLED の場合: rejectedItems に追加してスキップ
   - 正常な場合: /api/v1/results の登録処理と同等の処理を実行する
3. 取込結果サマリを返す（202）
```

---

## ドメインモデル・型定義

```typescript
// test_results テーブル対応
type TestResult = {
  resultId: string;                // UUID PK
  tenantId: string;
  orderId: string;                 // FK → orders
  status: 'PRELIMINARY' | 'FINAL' | 'CORRECTED';
  executedBy: string;
  executedAt: string;
  memo: string | null;
  finalizedAt: string | null;
  finalizedBy: string | null;
  importId: string | null;         // 外部機器取込時のバッチID
  createdAt: string;
  updatedAt: string;
};

// test_result_items テーブル対応
type TestResultItem = {
  itemId: string;                  // UUID PK
  resultId: string;                // FK → test_results
  itemCode: string;
  value: string;
  unit: string | null;
  referenceRange: string | null;
  abnormalFlag: 'H' | 'L' | 'A' | null;
};
```

---

## 業務ルール仕様

### 結果ステータス遷移

| 遷移元 | 遷移先 | 可否 | 操作 |
| ------ | ------ | :--: | ---- |
| `PRELIMINARY` | `FINAL` | ○ | finalize |
| `PRELIMINARY` | （削除不可） | × | — |
| `FINAL` | `CORRECTED` | ○ | 修正（将来対応） |
| `FINAL` | その他 | × | — |

### 外部機器連携

| ルール | 仕様 |
| ------ | ---- |
| 部分取込 | 一部が失敗しても残りは取込む（rejectedItems で失敗分を通知） |
| 重複取込 | 同一 orderId + externalOrderId の組み合わせが既に存在する場合はスキップして rejectedItems に追加 |

### マルチテナント境界

- tenantId が異なる結果データは相互に参照不可

---

## エラーコード一覧

| エラーコード | HTTP | 説明 |
| ----------- | :--: | ---- |
| `RESULT_NOT_FOUND` | 404 | 結果が存在しない |
| `ORDER_NOT_FOUND` | 404 | 指定オーダーが存在しない |
| `ORDER_ALREADY_COMPLETED` | 409 | オーダーが既に完了済み |
| `RESULT_ALREADY_FINALIZED` | 400 | 確定済み結果への変更は不可 |
| `VALIDATION_ERROR` | 400 | 入力値の形式不正または必須欠落 |
| `SYSTEM_ERROR` | 500 | サーバー内部エラー |
