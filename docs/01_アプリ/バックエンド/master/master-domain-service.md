# 実装計画書_master-domain-service

<!-- モジュール責任: 各種基準値の最終決定値はここだけが管理する。更新責任を集中させる設計原則に従う。 -->

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

- 生成対象: `master-domain-service` の Controller 層 / Service 層 / Repository 層
- 非生成対象: BFF・フロントエンドのコード

---

## 文書概要

- **サービス名**: `master-domain-service`
- **責務**: 点数マスタ管理・医療行為マスタ管理・薬剤マスタ管理・各種業務マスタ管理・マスタ更新責任の集中管理
- **呼び出し元**: 全ドメインサービス（参照用）・管理系 BFF（更新用）
- **真実の源泉**: 各種基準値の最終決定値

---

## API一覧（Controller層）

| メソッド | パス | 概要 | ステータス |
| :------: | ---- | ---- | :--------: |
| `GET`    | `/api/v1/masters/drugs` | 薬剤マスタ一覧・検索 | 設計中 |
| `GET`    | `/api/v1/masters/drugs/{drugId}` | 薬剤マスタ1件取得 | 設計中 |
| `POST`   | `/api/v1/masters/drugs` | 薬剤マスタ登録 | 設計中 |
| `PUT`    | `/api/v1/masters/drugs/{drugId}` | 薬剤マスタ更新 | 設計中 |
| `GET`    | `/api/v1/masters/medical-procedures` | 医療行為マスタ一覧・検索 | 設計中 |
| `GET`    | `/api/v1/masters/medical-procedures/{procedureId}` | 医療行為マスタ1件取得 | 設計中 |
| `POST`   | `/api/v1/masters/medical-procedures` | 医療行為マスタ登録 | 設計中 |
| `PUT`    | `/api/v1/masters/medical-procedures/{procedureId}` | 医療行為マスタ更新 | 設計中 |
| `GET`    | `/api/v1/masters/fee-schedule` | 診療報酬点数マスタ一覧・検索 | 設計中 |
| `GET`    | `/api/v1/masters/fee-schedule/{itemCode}` | 診療報酬点数マスタ1件取得 | 設計中 |
| `PUT`    | `/api/v1/masters/fee-schedule/{itemCode}` | 診療報酬点数マスタ更新 | 設計中 |
| `GET`    | `/api/v1/masters/departments` | 診療科マスタ一覧 | 設計中 |
| `GET`    | `/api/v1/masters/test-items` | 検査項目マスタ一覧・検索 | 設計中 |
| `GET`    | `/api/v1/master/units` | 単位マスタ一覧（**モック**） | モック（RES002用） |
| `GET`    | `/api/v1/master/modification-reasons` | 修正理由マスタ一覧（**モック**） | モック（RES002用） |
| `GET`    | `/api/v1/master/test-items` | 検査項目マスタ検索（**モック**） | モック（RES002用） |

---

## API仕様（APIごと）

### `GET /api/v1/masters/drugs`

**概要**: 薬剤マスタを検索する。  
**呼び出し元**: 処方系 BFF・medication-safety-domain-service

#### リクエスト（クエリパラメータ）

| 項目 | 型 | 必須 | 説明 |
| ---- | -- | :--: | ---- |
| `keyword` | `string` | × | 薬剤名・一般名（部分一致） |
| `drugClass` | `string` | × | 薬効分類コード |
| `isActive` | `boolean` | × | 有効フラグ（デフォルト true） |
| `limit` | `number` | × | 最大件数（デフォルト 20、最大 100） |
| `offset` | `number` | × | オフセット（デフォルト 0） |

**成功時（200）**

```typescript
type DrugListResponse = {
  total: number;
  drugs: DrugSummary[];
};

type DrugSummary = {
  drugId: string;
  drugCode: string;                // 薬剤コード（HOT番号等）
  drugName: string;                // 薬剤名（商品名）
  genericName: string;             // 一般名
  drugClass: string;               // 薬効分類コード
  unit: string;                    // 単位（mg, mL 等）
  isActive: boolean;
};
```

---

### `GET /api/v1/masters/drugs/{drugId}`

**概要**: 薬剤マスタを1件取得する（投与量・相互作用情報を含む詳細版）。

**成功時（200）**

```typescript
type DrugResponse = {
  drugId: string;
  drugCode: string;
  drugName: string;
  genericName: string;
  drugClass: string;
  unit: string;
  singleDoseMin: number | null;    // 1回最小投与量
  singleDoseMax: number | null;    // 1回最大投与量
  dailyDoseMax: number | null;     // 1日最大投与量
  contraindicationCodes: string[]; // 禁忌コード一覧
  isActive: boolean;
  updatedAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `MASTER_NOT_FOUND` | 薬剤マスタが存在しない |

---

### `POST /api/v1/masters/drugs`

**概要**: 薬剤マスタを新規登録する。  
**呼び出し元**: 管理系 BFF（システム管理者のみ）

#### リクエスト

```typescript
type DrugCreateRequest = {
  drugCode: string;
  drugName: string;
  genericName: string;
  drugClass: string;
  unit: string;
  singleDoseMin?: number;
  singleDoseMax?: number;
  dailyDoseMax?: number;
  contraindicationCodes?: string[];
};
```

**成功時（201）**

```typescript
type DrugCreateResponse = {
  drugId: string;
  drugCode: string;
  createdAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 201  | —           | 正常 |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 409  | `MASTER_CODE_DUPLICATE` | 同一薬剤コードが既に存在する |

---

### `PUT /api/v1/masters/drugs/{drugId}`

**概要**: 薬剤マスタを更新する。

```typescript
type DrugUpdateRequest = {
  drugName?: string;
  genericName?: string;
  drugClass?: string;
  unit?: string;
  singleDoseMin?: number;
  singleDoseMax?: number;
  dailyDoseMax?: number;
  contraindicationCodes?: string[];
  isActive?: boolean;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `MASTER_NOT_FOUND` | 薬剤マスタが存在しない |
| 400  | `VALIDATION_ERROR` | 形式不正 |

---

### `GET /api/v1/masters/medical-procedures`

**概要**: 医療行為マスタを検索する。

#### リクエスト（クエリパラメータ）

| 項目 | 型 | 必須 | 説明 |
| ---- | -- | :--: | ---- |
| `keyword` | `string` | × | 医療行為名（部分一致） |
| `category` | `string` | × | カテゴリコード（例: "TEST", "PROCEDURE"） |
| `isActive` | `boolean` | × | 有効フラグ（デフォルト true） |

**成功時（200）**

```typescript
type MedicalProcedureListResponse = {
  total: number;
  procedures: MedicalProcedureSummary[];
};

type MedicalProcedureSummary = {
  procedureId: string;
  procedureCode: string;
  procedureName: string;
  category: string;
  isActive: boolean;
};
```

---

### `GET /api/v1/masters/medical-procedures/{procedureId}`

**成功時（200）**

```typescript
type MedicalProcedureResponse = {
  procedureId: string;
  procedureCode: string;
  procedureName: string;
  category: string;
  description: string | null;
  isActive: boolean;
  updatedAt: string;
};
```

---

### `POST /api/v1/masters/medical-procedures`・`PUT /api/v1/masters/medical-procedures/{procedureId}`

薬剤マスタの CREATE / UPDATE と同等の構造。省略。

---

### `GET /api/v1/masters/fee-schedule`

**概要**: 診療報酬点数マスタを検索する。  
**呼び出し元**: billing-domain-service

#### リクエスト（クエリパラメータ）

| 項目 | 型 | 必須 | 説明 |
| ---- | -- | :--: | ---- |
| `itemCodes` | `string` | × | 項目コード（カンマ区切り複数可） |
| `keyword` | `string` | × | 項目名（部分一致） |
| `effectiveDate` | `string` | × | 有効日（YYYY-MM-DD、省略時は当日） |

**成功時（200）**

```typescript
type FeeScheduleListResponse = {
  total: number;
  items: FeeScheduleItem[];
};

type FeeScheduleItem = {
  itemCode: string;                // 診療報酬項目コード
  itemName: string;
  points: number;                  // 診療報酬点数
  effectiveFrom: string;           // 有効開始日（YYYY-MM-DD）
  effectiveTo: string | null;      // 有効終了日（null = 無期限）
};
```

---

### `GET /api/v1/masters/fee-schedule/{itemCode}`

**成功時（200）**

```typescript
type FeeScheduleResponse = FeeScheduleItem & {
  description: string | null;
  updatedAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `MASTER_NOT_FOUND` | 点数マスタが存在しない |

---

### `GET /api/v1/masters/departments`

**概要**: 診療科マスタ一覧を取得する。

**成功時（200）**

```typescript
type DepartmentListResponse = {
  departments: Department[];
};

type Department = {
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  isActive: boolean;
};
```

---

### `GET /api/v1/masters/test-items`

**概要**: 検査項目マスタを検索する。  
**呼び出し元**: 検査系 BFF・result-domain-service

#### リクエスト（クエリパラメータ）

| 項目 | 型 | 必須 | 説明 |
| ---- | -- | :--: | ---- |
| `keyword` | `string` | × | 検査項目名（部分一致） |
| `category` | `string` | × | 検査カテゴリ（例: "BLOOD", "URINE", "IMAGING"） |

**成功時（200）**

```typescript
type TestItemListResponse = {
  total: number;
  items: TestItem[];
};

type TestItem = {
  itemCode: string;                // 検査項目コード（JLAC10等）
  itemName: string;
  unit: string | null;
  referenceRangeMin: number | null;
  referenceRangeMax: number | null;
  category: string;
  isActive: boolean;
};
```

---

## ドメインモデル・型定義

```typescript
// drugs テーブル対応
type Drug = {
  drugId: string;                  // UUID PK
  drugCode: string;                // 薬剤コード（UNIQUE）
  drugName: string;
  genericName: string;
  drugClass: string;               // 薬効分類コード
  unit: string;
  singleDoseMin: number | null;
  singleDoseMax: number | null;
  dailyDoseMax: number | null;
  contraindicationCodes: string[]; // JSON配列
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// medical_procedures テーブル対応
type MedicalProcedure = {
  procedureId: string;             // UUID PK
  procedureCode: string;           // UNIQUE
  procedureName: string;
  category: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// fee_schedule テーブル対応
type FeeSchedule = {
  itemCode: string;                // 診療報酬項目コード PK
  itemName: string;
  points: number;
  effectiveFrom: string;           // YYYY-MM-DD
  effectiveTo: string | null;
  description: string | null;
  updatedAt: string;
};

// departments テーブル対応
type Department = {
  departmentId: string;            // UUID PK
  departmentCode: string;          // UNIQUE
  departmentName: string;
  isActive: boolean;
};

// test_item_masters テーブル対応
type TestItemMaster = {
  itemCode: string;                // JLAC10等のコード PK
  itemName: string;
  unit: string | null;
  referenceRangeMin: number | null;
  referenceRangeMax: number | null;
  category: string;
  isActive: boolean;
};
```

---

## 業務ルール仕様

### マスタ更新ルール

| ルール | 仕様 |
| ------ | ---- |
| 更新権限 | マスタの更新はシステム管理者のみ（authorization-domain-service で制御） |
| 論理削除 | マスタの削除は isActive = false への更新。物理削除は禁止 |
| 診療報酬点数 | 有効期間（effectiveFrom ～ effectiveTo）で管理。改定時は新レコードを追加 |

### マルチテナント

- 薬剤・医療行為・検査項目マスタはシステム共通（tenantId なし）
- 診療科マスタはテナント固有（tenantId あり）

---

---

## モックAPI仕様（RES002用）

> **モック定義**: DB設計未確定のため、コントローラー層の I/F のみを定義する。
> 実装はモックレスポンスを返すのみでよい。DB設計確定後に本セクションを正式仕様に置き換えること。
> モック実装規約は [バックエンド共通設計書 §6](../バックエンド共通設計書.md#6-モック実装規約) を参照。

### `GET /api/v1/master/units`

**概要**: 単位マスタ一覧を返す。  
**呼び出し元**: execution-bff（初期表示時、`GET /api/v1/orders/{orderUuid}/test-results` と並列呼び出し）

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

リクエストボディ・クエリパラメータなし。

#### レスポンス（モック）

```typescript
type UnitsGetResponse = {
  units: UnitRecord[];
};
type UnitRecord = {
  code: string;   // 単位コード（例: mg/dL）
  name: string;   // 表示名（例: mg/dL）
};
```

| HTTP | 説明 |
| :--: | ---- |
| 200 | 正常 |
| 500 | サーバー内部エラー |

**モック固定値**: `[{ code: "mg/dL", name: "mg/dL" }, { code: "U/L", name: "U/L" }]`

---

### `GET /api/v1/master/modification-reasons`

**概要**: 修正理由マスタ一覧を返す。  
**呼び出し元**: execution-bff（修正理由ダイアログ表示時）

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

リクエストボディ・クエリパラメータなし。

#### レスポンス（モック）

```typescript
type ModificationReasonsGetResponse = {
  reasons: ModificationReasonRecord[];
};
type ModificationReasonRecord = {
  code: string;    // 理由コード（OTHER=その他）
  name: string;    // 表示名
};
```

| HTTP | 説明 |
| :--: | ---- |
| 200 | 正常 |
| 500 | サーバー内部エラー |

**モック固定値**: `{ reasons: [{ code: "MISTAKE", name: "入力誤り" }, { code: "OTHER", name: "その他" }] }`

---

### `GET /api/v1/master/test-items`

**概要**: 検査項目マスタを検索して返す。master-bff 経由で execution-bff から呼び出される。  
**呼び出し元**: master-bff（`GET /bff/test-item/lists` のバックエンド呼び出し）

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `itemName` | query | `string` | × | 検査項目名（部分一致）。省略時は全件 |
| `itemCode` | query | `string` | × | 検査コード（部分一致）。省略時は全件 |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

#### レスポンス（モック）

```typescript
type TestItemsGetResponse = {
  items: TestItemMasterRecord[];
};
type TestItemMasterRecord = {
  code: string;                  // 検査コード（例: GLU）
  name: string;                  // 検査項目名（例: 血糖）
  unit_id: string;               // 単位コード（例: mg/dL）
  lower_limit: number | null;    // 基準値下限
  upper_limit: number | null;    // 基準値上限
  critical_lower: number | null; // クリティカル下限
  critical_upper: number | null; // クリティカル上限
};
```

| HTTP | 説明 |
| :--: | ---- |
| 200 | 正常（0件も 200 + `items: []`） |
| 500 | サーバー内部エラー |

**モック固定値**: `[{ code: "GLU", name: "血糖", unit_id: "mg/dL", lower_limit: 70, upper_limit: 110, critical_lower: 50, critical_upper: 400 }]`  
※ `itemName`・`itemCode` クエリによる絞り込みはモックでは省略可（全件返却でよい）。

---

## エラーコード一覧

| エラーコード | HTTP | 説明 |
| ----------- | :--: | ---- |
| `MASTER_NOT_FOUND` | 404 | マスタデータが存在しない |
| `MASTER_CODE_DUPLICATE` | 409 | 同一コードのマスタが既に存在する |
| `VALIDATION_ERROR` | 400 | 入力値の形式不正または必須欠落 |
| `SYSTEM_ERROR` | 500 | サーバー内部エラー |
