# 実装計画書_patient-domain-service

<!-- モジュール責任: 患者の同一性はここだけが決定する。患者基本情報の最終確定値はここに存在する。 -->

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

- 生成対象: `patient-domain-service` の Controller 層 / Service 層 / Repository 層
- 非生成対象: BFF・フロントエンドのコード

---

## 文書概要

- **サービス名**: `patient-domain-service`
- **責務**: 患者の同一性管理・患者基本情報 CRUD・名寄せ処理
- **呼び出し元**: 各ドメインサービス（BFF 経由）
- **真実の源泉**: 患者の同一性・患者基本情報の最終確定値

---

## API一覧（Controller層）

| メソッド | パス | 概要 | ステータス |
| :------: | ---- | ---- | :--------: |
| `POST`   | `/api/v1/patients` | 患者登録 | 設計中 |
| `GET`    | `/api/v1/patients/{patientId}` | 患者情報取得 | 設計中 |
| `PUT`    | `/api/v1/patients/{patientId}` | 患者情報更新 | 設計中 |
| `GET`    | `/api/v1/patients` | 患者検索 | 設計中 |
| `POST`   | `/api/v1/patients/merge` | 名寄せ（患者統合） | 設計中 |
| `PATCH`  | `/api/v1/patients/{patientId}/status` | 患者ステータス変更 | 設計中 |

---

## API仕様（APIごと）

### `POST /api/v1/patients`

**概要**: 新規患者を登録し、患者IDを発行する。  
**呼び出し元**: 受付系 BFF  
**呼び出しタイミング**: 初診受付時

#### リクエスト

```typescript
type PatientCreateRequest = {
  tenantId: string;
  lastName: string;          // 姓
  firstName: string;         // 名
  lastNameKana: string;      // 姓（カナ）
  firstNameKana: string;     // 名（カナ）
  birthDate: string;         // YYYY-MM-DD
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  address?: string;
};
```

#### レスポンス

**成功時（201）**

```typescript
type PatientCreateResponse = {
  patientId: string;         // 発行された患者ID（UUID）
  patientNo: string;         // 患者番号（表示用連番）
  createdAt: string;         // ISO 8601
};
```

**ステータスコード一覧**

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 201  | —           | 正常（患者登録成功） |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 409  | `DUPLICATE_PATIENT` | 同一性チェックで重複候補が検出された |
| 500  | `SYSTEM_ERROR` | サーバー内部エラー |

#### 処理仕様

```
1. リクエストをバリデーションする（必須項目・形式チェック）
2. 氏名カナ・生年月日で既存患者との同一性チェックを行う
   - 重複候補が存在する場合: 409 DUPLICATE_PATIENT（候補一覧を返す）
3. 患者IDを UUID で発行する
4. 患者番号（patientNo）をシーケンスで採番する
5. patients テーブルに INSERT する
6. 監査ログを記録する
7. 201 を返す
```

---

### `GET /api/v1/patients/{patientId}`

**概要**: 患者IDで患者情報を1件取得する。  
**呼び出し元**: 各ドメインサービス・BFF

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `patientId` | path | `string` | ○ | 患者UUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

#### レスポンス

**成功時（200）**

```typescript
type PatientResponse = {
  patientId: string;
  patientNo: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  birthDate: string;          // YYYY-MM-DD
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string | null;
  address: string | null;
  status: 'ACTIVE' | 'DECEASED' | 'WITHDRAWN';
  createdAt: string;
  updatedAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `PATIENT_NOT_FOUND` | 患者が存在しない |

#### 処理仕様

```
1. patients テーブルで patientId AND tenantId を条件に検索する
2. 存在しない場合: 404 PATIENT_NOT_FOUND
3. 200 を返す
```

---

### `PUT /api/v1/patients/{patientId}`

**概要**: 患者基本情報を更新する。  
**呼び出し元**: 患者管理 BFF

#### リクエスト

```typescript
type PatientUpdateRequest = {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  address?: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `PATIENT_NOT_FOUND` | 患者が存在しない |
| 400  | `VALIDATION_ERROR`  | 形式不正 |

#### 処理仕様

```
1. patientId で患者を検索する（存在しない場合: 404）
2. リクエストをバリデーションする
3. patients テーブルを UPDATE する
4. 変更履歴を patient_histories テーブルに INSERT する
5. 監査ログを記録する
6. 200 を返す
```

---

### `GET /api/v1/patients`

**概要**: 患者を検索する。氏名カナ・患者番号・生年月日の部分一致。  
**呼び出し元**: 受付・検索系 BFF

#### リクエスト（クエリパラメータ）

| 項目 | 型 | 必須 | 説明 |
| ---- | -- | :--: | ---- |
| `nameKana` | `string` | × | 氏名カナ（前方一致） |
| `patientNo` | `string` | × | 患者番号（完全一致） |
| `birthDate` | `string` | × | 生年月日 YYYY-MM-DD |
| `limit` | `number` | × | 最大件数（デフォルト 20、最大 100） |
| `offset` | `number` | × | オフセット（デフォルト 0） |

**成功時（200）**

```typescript
type PatientSearchResponse = {
  total: number;
  patients: PatientSummary[];
};
type PatientSummary = {
  patientId: string;
  patientNo: string;
  fullName: string;          // 姓名結合
  fullNameKana: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  status: 'ACTIVE' | 'DECEASED' | 'WITHDRAWN';
};
```

---

### `POST /api/v1/patients/merge`

**概要**: 重複患者を統合する（名寄せ）。主患者へ副患者の診療情報を統合し、副患者を非アクティブ化する。  
**呼び出し元**: 患者管理 BFF（管理者権限必須）

#### リクエスト

```typescript
type PatientMergeRequest = {
  primaryPatientId: string;   // 存続させる患者ID
  secondaryPatientId: string; // 統合されて非アクティブになる患者ID
  reason: string;             // 統合理由
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `PATIENT_NOT_FOUND` | 主または副患者が存在しない |
| 409  | `MERGE_CONFLICT`    | 副患者に進行中の診療がある |

#### 処理仕様

```
1. 主患者・副患者の存在確認（どちらか存在しない場合: 404）
2. 副患者の進行中 encounter が存在する場合: 409 MERGE_CONFLICT
3. 副患者の参照を主患者 ID に付け替える（encounters, orders テーブル等）
4. 副患者の status を 'MERGED' に更新する
5. patient_merges テーブルにマージ履歴を記録する
6. 監査ログを記録する
```

---

### `PATCH /api/v1/patients/{patientId}/status`

**概要**: 患者ステータスを変更する（死亡・受診辞退等）。

#### リクエスト

```typescript
type PatientStatusRequest = {
  status: 'ACTIVE' | 'DECEASED' | 'WITHDRAWN';
  reason?: string;
  effectiveDate?: string;    // YYYY-MM-DD（省略時は当日）
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `PATIENT_NOT_FOUND` | 患者が存在しない |
| 400  | `INVALID_STATUS_TRANSITION` | 無効なステータス遷移（例: DECEASED→ACTIVE） |

---

## ドメインモデル・型定義

```typescript
// patients テーブル対応
type Patient = {
  patientId: string;          // UUID PK
  patientNo: string;          // 患者番号（表示用）
  tenantId: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  birthDate: string;          // YYYY-MM-DD
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string | null;
  address: string | null;
  status: 'ACTIVE' | 'DECEASED' | 'WITHDRAWN' | 'MERGED';
  createdAt: string;
  updatedAt: string;
};
```

---

## 業務ルール仕様

### 患者同一性チェック

| ルール | 仕様 |
| ------ | ---- |
| チェック項目 | 氏名カナ（完全一致）+ 生年月日（完全一致） |
| 判定 | 両方一致する既存患者が存在する場合を重複候補とする |
| 重複時の挙動 | 409 DUPLICATE_PATIENT。候補患者一覧をレスポンスに含める |
| 強制登録 | 将来対応（現時点では不可） |

### ステータス遷移

| 遷移元 | 遷移先 | 可否 |
| ------ | ------ | :--: |
| `ACTIVE` | `DECEASED` | ○ |
| `ACTIVE` | `WITHDRAWN` | ○ |
| `DECEASED` | `ACTIVE` | × |
| `WITHDRAWN` | `ACTIVE` | ○（受診再開） |
| `MERGED` | 任意 | × |

### マルチテナント境界

- tenantId が異なる患者データは相互に参照・統合不可

---

## エラーコード一覧

| エラーコード | HTTP | 説明 |
| ----------- | :--: | ---- |
| `PATIENT_NOT_FOUND` | 404 | 患者が存在しない |
| `DUPLICATE_PATIENT` | 409 | 同一性チェックで重複候補が検出 |
| `MERGE_CONFLICT` | 409 | 副患者に進行中の診療がある |
| `INVALID_STATUS_TRANSITION` | 400 | 無効なステータス遷移 |
| `VALIDATION_ERROR` | 400 | 入力値の形式不正または必須欠落 |
| `SYSTEM_ERROR` | 500 | サーバー内部エラー |
