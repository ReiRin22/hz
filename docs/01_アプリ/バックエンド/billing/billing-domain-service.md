# 実装計画書_billing-domain-service

<!-- モジュール責任: 金額および請求確定値はここだけが決定する。レセプト制度に従う独立ルール。 -->

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

- 生成対象: `billing-domain-service` の Controller 層 / Service 層 / Repository 層
- 非生成対象: BFF・フロントエンドのコード

---

## 文書概要

- **サービス名**: `billing-domain-service`
- **責務**: 点数計算・金額算出・請求データ生成・レセプトデータ作成・会計確定処理
- **呼び出し元**: 会計系 BFF
- **真実の源泉**: 金額および請求確定値

---

## API一覧（Controller層）

| メソッド | パス | 概要 | ステータス |
| :------: | ---- | ---- | :--------: |
| `POST`   | `/api/v1/bills/calculate` | 点数・金額計算 | 設計中 |
| `POST`   | `/api/v1/bills` | 請求データ作成 | 設計中 |
| `GET`    | `/api/v1/bills/{billId}` | 請求データ取得 | 設計中 |
| `POST`   | `/api/v1/bills/{billId}/finalize` | 会計確定 | 設計中 |
| `GET`    | `/api/v1/encounters/{encounterId}/bill` | 受診の請求データ取得 | 設計中 |
| `POST`   | `/api/v1/receipts/generate` | レセプトデータ生成 | 設計中 |

---

## API仕様（APIごと）

### `POST /api/v1/bills/calculate`

**概要**: オーダー一覧から診療報酬点数と患者負担金額を計算する（プレビュー用。DB保存なし）。  
**呼び出し元**: 会計系 BFF

#### リクエスト

```typescript
type BillCalculateRequest = {
  tenantId: string;
  patientId: string;
  encounterId: string;
  insuranceInfo: InsuranceInfo;    // 保険情報
};

type InsuranceInfo = {
  insuranceType: 'NATIONAL' | 'EMPLOYEE' | 'LATE_STAGE_ELDERLY' | 'SELF_PAY';
  copayRate: number;               // 自己負担割合（例: 0.3 = 3割負担）
  certificateNo?: string;          // 保険証番号
};
```

#### レスポンス

**成功時（200）**

```typescript
type BillCalculateResponse = {
  totalPoints: number;             // 合計診療報酬点数
  totalAmount: number;             // 合計金額（円）
  patientCopay: number;            // 患者自己負担額（円）
  insuranceCoverage: number;       // 保険負担額（円）
  breakdown: BillLineItem[];       // 内訳
};

type BillLineItem = {
  orderId: string;
  itemCode: string;
  itemName: string;
  points: number;                  // 診療報酬点数
  quantity: number;
  amount: number;                  // 金額（円）
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 404  | `ENCOUNTER_NOT_FOUND` | 指定受診が存在しない |
| 500  | `SYSTEM_ERROR` | サーバー内部エラー |

#### 処理仕様

```
1. リクエストをバリデーションする
2. encounter-domain-service で encounterId の存在確認（存在しない場合: 404）
3. order-domain-service から encounterId の COMPLETED オーダー一覧を取得する
4. master-domain-service から各 itemCode の診療報酬点数を取得する
5. 点数 × 10円 で金額を算出する（診療報酬点数の基本換算）
6. insuranceInfo.copayRate を用いて患者自己負担額を計算する
7. DB には保存せずに計算結果を返す（200）
```

---

### `POST /api/v1/bills`

**概要**: 請求データを作成し DB に保存する。  
**呼び出し元**: 会計系 BFF

#### リクエスト

```typescript
type BillCreateRequest = {
  tenantId: string;
  patientId: string;
  encounterId: string;
  insuranceInfo: InsuranceInfo;
};
```

**成功時（201）**

```typescript
type BillCreateResponse = {
  billId: string;                  // 発行された請求ID（UUID）
  billNo: string;                  // 請求番号（表示用連番）
  status: 'DRAFT';
  totalPoints: number;
  totalAmount: number;
  patientCopay: number;
  createdAt: string;               // ISO 8601
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 201  | —           | 正常（請求データ作成） |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 404  | `ENCOUNTER_NOT_FOUND` | 指定受診が存在しない |
| 409  | `BILL_ALREADY_EXISTS` | 同一受診の請求データが既に存在する |

#### 処理仕様

```
1. encounterId の請求データが既に存在しないことを確認（存在する場合: 409）
2. /calculate と同等の計算を実行する
3. bills テーブルに INSERT する（status = 'DRAFT'）
4. bill_line_items テーブルに内訳を INSERT する
5. 201 を返す
```

---

### `GET /api/v1/bills/{billId}`

**概要**: 請求IDで請求データを1件取得する。

**成功時（200）**

```typescript
type BillResponse = {
  billId: string;
  billNo: string;
  encounterId: string;
  patientId: string;
  status: 'DRAFT' | 'FINALIZED';
  insuranceType: string;
  copayRate: number;
  totalPoints: number;
  totalAmount: number;
  patientCopay: number;
  insuranceCoverage: number;
  breakdown: BillLineItem[];
  finalizedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `BILL_NOT_FOUND` | 請求データが存在しない |

---

### `POST /api/v1/bills/{billId}/finalize`

**概要**: 請求データを確定する（DRAFT → FINALIZED）。確定後は変更不可。

リクエストボディなし。

**成功時（200）**

```typescript
type BillFinalizeResponse = {
  billId: string;
  status: 'FINALIZED';
  finalizedAt: string;             // ISO 8601
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `BILL_NOT_FOUND` | 請求データが存在しない |
| 400  | `BILL_ALREADY_FINALIZED` | 既に確定済み |

#### 処理仕様

```
1. billId AND tenantId で請求データを検索する（存在しない場合: 404）
2. status が DRAFT であることを確認（それ以外: 400）
3. status = 'FINALIZED'、finalizedAt = 現在日時 で UPDATE する
4. 監査ログを記録する
5. 200 を返す
```

---

### `GET /api/v1/encounters/{encounterId}/bill`

**概要**: 受診に紐づく請求データを取得する（受診1件につき請求1件）。

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `BILL_NOT_FOUND` | 請求データが未作成 |

---

### `POST /api/v1/receipts/generate`

**概要**: 指定月のレセプトデータを生成する。  
**呼び出し元**: 会計系 BFF（月次バッチ想定）

#### リクエスト

```typescript
type ReceiptGenerateRequest = {
  tenantId: string;
  targetYearMonth: string;         // YYYY-MM（対象診療年月）
};
```

**成功時（202）**

```typescript
type ReceiptGenerateResponse = {
  receiptId: string;               // 生成されたレセプトID
  targetYearMonth: string;
  status: 'PROCESSING';            // 非同期処理中
  requestedAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 202  | —           | 正常（生成受付） |
| 400  | `VALIDATION_ERROR` | 年月フォーマット不正 |
| 409  | `RECEIPT_ALREADY_EXISTS` | 同一年月のレセプトが既に生成済み |

#### 処理仕様

```
1. 対象年月のレセプトが未生成であることを確認（存在する場合: 409）
2. receipts テーブルに INSERT する（status = 'PROCESSING'）
3. 非同期でレセプトデータ生成ジョブを起動する（202 を返す）
4. ジョブ完了後: status = 'COMPLETED' に UPDATE する
```

---

## ドメインモデル・型定義

```typescript
// bills テーブル対応
type Bill = {
  billId: string;                  // UUID PK
  billNo: string;                  // 請求番号（表示用）
  tenantId: string;
  encounterId: string;             // FK → encounters（1:1）
  patientId: string;
  status: 'DRAFT' | 'FINALIZED';
  insuranceType: 'NATIONAL' | 'EMPLOYEE' | 'LATE_STAGE_ELDERLY' | 'SELF_PAY';
  copayRate: number;
  certificateNo: string | null;
  totalPoints: number;
  totalAmount: number;
  patientCopay: number;
  insuranceCoverage: number;
  finalizedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// bill_line_items テーブル対応
type BillLineItem = {
  lineItemId: string;              // UUID PK
  billId: string;                  // FK → bills
  orderId: string;
  itemCode: string;
  itemName: string;
  points: number;
  quantity: number;
  amount: number;
};

// receipts テーブル対応
type Receipt = {
  receiptId: string;               // UUID PK
  tenantId: string;
  targetYearMonth: string;         // YYYY-MM
  status: 'PROCESSING' | 'COMPLETED' | 'ERROR';
  requestedAt: string;
  completedAt: string | null;
};
```

---

## 業務ルール仕様

### 点数計算ルール

| ルール | 仕様 |
| ------ | ---- |
| 点数換算 | 1点 = 10円（日本の診療報酬基本換算） |
| 点数取得元 | master-domain-service の診療報酬点数マスタ |
| 対象オーダー | status = COMPLETED のオーダーのみ集計対象 |

### 請求データと受診の対応

- 受診（encounter）1件につき請求（bill）1件のみ作成可能
- FINALIZED 後は内容変更不可

### マルチテナント境界

- tenantId が異なる請求データは相互に参照不可

---

## エラーコード一覧

| エラーコード | HTTP | 説明 |
| ----------- | :--: | ---- |
| `BILL_NOT_FOUND` | 404 | 請求データが存在しない |
| `ENCOUNTER_NOT_FOUND` | 404 | 指定受診が存在しない |
| `BILL_ALREADY_EXISTS` | 409 | 同一受診の請求データが既に存在する |
| `BILL_ALREADY_FINALIZED` | 400 | 確定済み請求への変更は不可 |
| `RECEIPT_ALREADY_EXISTS` | 409 | 同一年月のレセプトが既に生成済み |
| `VALIDATION_ERROR` | 400 | 入力値の形式不正または必須欠落 |
| `SYSTEM_ERROR` | 500 | サーバー内部エラー |
