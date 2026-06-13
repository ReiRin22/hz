# 実装計画書_clinical-record-domain-service

<!-- モジュール責任: 医師が確定した診療内容・記録の法的確定状態はここだけが管理する。 -->

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

- 生成対象: `clinical-record-domain-service` の Controller 層 / Service 層 / Repository 層
- 非生成対象: BFF・フロントエンドのコード

---

## 文書概要

- **サービス名**: `clinical-record-domain-service`
- **責務**: SOAP記録管理・記録確定処理・版管理・履歴保持・修正履歴管理
- **呼び出し元**: 診療記録系 BFF
- **真実の源泉**: 医師が確定した診療内容・記録の法的確定状態

---

## API一覧（Controller層）

| メソッド | パス | 概要 | ステータス |
| :------: | ---- | ---- | :--------: |
| `POST`   | `/api/v1/clinical-records` | 診療記録作成（下書き） | 設計中 |
| `GET`    | `/api/v1/clinical-records/{recordId}` | 診療記録取得 | 設計中 |
| `PUT`    | `/api/v1/clinical-records/{recordId}` | 診療記録更新（下書き） | 設計中 |
| `POST`   | `/api/v1/clinical-records/{recordId}/finalize` | 診療記録確定 | 設計中 |
| `POST`   | `/api/v1/clinical-records/{recordId}/amend` | 確定済み記録の修正（追記） | 設計中 |
| `GET`    | `/api/v1/encounters/{encounterId}/clinical-records` | 受診に紐づく記録一覧 | 設計中 |
| `GET`    | `/api/v1/clinical-records/{recordId}/history` | 記録の変更履歴一覧 | 設計中 |

---

## API仕様（APIごと）

### `POST /api/v1/clinical-records`

**概要**: 診療記録を下書き状態で作成する。  
**呼び出し元**: 診療記録系 BFF  
**呼び出しタイミング**: 医師が診察を開始したとき

#### リクエスト

```typescript
type ClinicalRecordCreateRequest = {
  tenantId: string;
  encounterId: string;             // 受診UUID
  recordType: 'SOAP' | 'NURSING' | 'PROGRESS';
  subjectiveNote?: string;         // S: 主観的情報（患者の訴え）
  objectiveNote?: string;          // O: 客観的情報（検査値等）
  assessmentNote?: string;         // A: 評価
  planNote?: string;               // P: 計画
  authorId: string;                // 記録作成者ID（医師・看護師）
};
```

#### レスポンス

**成功時（201）**

```typescript
type ClinicalRecordCreateResponse = {
  recordId: string;                // 発行された記録ID（UUID）
  version: number;                 // 版番号（初版 = 1）
  status: 'DRAFT';
  createdAt: string;               // ISO 8601
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 201  | —           | 正常（記録作成成功） |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 404  | `ENCOUNTER_NOT_FOUND` | 指定受診が存在しない |
| 409  | `ENCOUNTER_ALREADY_FINALIZED` | 受診が COMPLETED で記録不可 |
| 500  | `SYSTEM_ERROR` | サーバー内部エラー |

#### 処理仕様

```
1. リクエストをバリデーションする（必須項目・形式チェック）
2. encounter-domain-service で encounterId の存在確認（存在しない場合: 404）
3. encounter の status が CANCELLED / COMPLETED の場合: 409 ENCOUNTER_ALREADY_FINALIZED
4. 記録IDを UUID で発行する
5. version = 1 で clinical_records テーブルに INSERT する（status = 'DRAFT'）
6. 監査ログを記録する
7. 201 を返す
```

---

### `GET /api/v1/clinical-records/{recordId}`

**概要**: 記録IDで診療記録を1件取得する。  
**呼び出し元**: 診療記録系 BFF・各ドメインサービス

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `recordId` | path | `string` | ○ | 記録UUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

#### レスポンス

**成功時（200）**

```typescript
type ClinicalRecordResponse = {
  recordId: string;
  encounterId: string;
  recordType: 'SOAP' | 'NURSING' | 'PROGRESS';
  status: 'DRAFT' | 'FINALIZED' | 'AMENDED';
  version: number;
  subjectiveNote: string | null;
  objectiveNote: string | null;
  assessmentNote: string | null;
  planNote: string | null;
  authorId: string;
  finalizedAt: string | null;      // 確定日時
  finalizedBy: string | null;      // 確定者ID
  createdAt: string;
  updatedAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `RECORD_NOT_FOUND` | 記録が存在しない |

---

### `PUT /api/v1/clinical-records/{recordId}`

**概要**: 下書き状態の診療記録を更新する。確定済みには不可。

#### リクエスト

```typescript
type ClinicalRecordUpdateRequest = {
  subjectiveNote?: string;
  objectiveNote?: string;
  assessmentNote?: string;
  planNote?: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `RECORD_NOT_FOUND` | 記録が存在しない |
| 400  | `RECORD_ALREADY_FINALIZED` | 確定済み記録への更新は不可 |

#### 処理仕様

```
1. recordId AND tenantId で記録を検索する（存在しない場合: 404）
2. status が DRAFT であることを確認（FINALIZED/AMENDED の場合: 400）
3. clinical_records テーブルを UPDATE する
4. 監査ログを記録する
5. 200 を返す
```

---

### `POST /api/v1/clinical-records/{recordId}/finalize`

**概要**: 下書き記録を確定する。確定後は PUT による更新不可。法的確定状態に移行する。

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `recordId` | path | `string` | ○ | 記録UUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

リクエストボディなし。

#### レスポンス

**成功時（200）**

```typescript
type ClinicalRecordFinalizeResponse = {
  recordId: string;
  status: 'FINALIZED';
  version: number;
  finalizedAt: string;             // ISO 8601
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `RECORD_NOT_FOUND` | 記録が存在しない |
| 400  | `RECORD_ALREADY_FINALIZED` | 既に確定済み |

#### 処理仕様

```
1. recordId AND tenantId で記録を検索する（存在しない場合: 404）
2. status が DRAFT であることを確認（それ以外: 400）
3. status = 'FINALIZED'、finalizedAt = 現在日時 で UPDATE する
4. 監査ログを記録する（確定操作は監査対象）
5. 200 を返す
```

---

### `POST /api/v1/clinical-records/{recordId}/amend`

**概要**: 確定済み記録に修正追記を行う。元記録はアーカイブし、新版を AMENDED 状態で作成する。

#### リクエスト

```typescript
type ClinicalRecordAmendRequest = {
  amendReason: string;             // 修正理由（必須）
  subjectiveNote?: string;
  objectiveNote?: string;
  assessmentNote?: string;
  planNote?: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 201  | —           | 正常（修正版作成） |
| 404  | `RECORD_NOT_FOUND` | 記録が存在しない |
| 400  | `RECORD_NOT_FINALIZED` | 下書き記録への修正追記は不可 |

#### 処理仕様

```
1. recordId AND tenantId で記録を検索する（存在しない場合: 404）
2. status が FINALIZED または AMENDED であることを確認（DRAFT の場合: 400）
3. 現在の記録内容を clinical_record_histories テーブルにアーカイブする
4. 新しい recordId を UUID で発行し、version を +1 して INSERT する（status = 'AMENDED'）
5. 旧 recordId に supersededBy = 新recordId を UPDATE する
6. 監査ログを記録する（修正操作は監査対象）
7. 201 を返す
```

---

### `GET /api/v1/encounters/{encounterId}/clinical-records`

**概要**: 受診に紐づく診療記録を一覧取得する。

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `ENCOUNTER_NOT_FOUND` | 受診が存在しない |

#### 処理仕様

```
1. encounterId AND tenantId を条件に clinical_records を検索する
2. supersededBy が null のもの（最新版のみ）を返す
3. createdAt DESC でソート
4. 200 を返す
```

---

### `GET /api/v1/clinical-records/{recordId}/history`

**概要**: 記録の全版（変更履歴）を一覧取得する。

**成功時（200）**

```typescript
type ClinicalRecordHistoryResponse = {
  recordId: string;
  histories: ClinicalRecordVersion[];
};
type ClinicalRecordVersion = {
  version: number;
  status: 'FINALIZED' | 'AMENDED';
  subjectiveNote: string | null;
  objectiveNote: string | null;
  assessmentNote: string | null;
  planNote: string | null;
  amendReason: string | null;
  authorId: string;
  createdAt: string;
};
```

---

## ドメインモデル・型定義

```typescript
// clinical_records テーブル対応
type ClinicalRecord = {
  recordId: string;                // UUID PK
  tenantId: string;
  encounterId: string;             // FK → encounters
  recordType: 'SOAP' | 'NURSING' | 'PROGRESS';
  status: 'DRAFT' | 'FINALIZED' | 'AMENDED';
  version: number;                 // 版番号（1始まり）
  subjectiveNote: string | null;
  objectiveNote: string | null;
  assessmentNote: string | null;
  planNote: string | null;
  authorId: string;
  finalizedAt: string | null;
  finalizedBy: string | null;
  supersededBy: string | null;     // 修正により新版が作成された場合の新recordId
  createdAt: string;
  updatedAt: string;
};

// clinical_record_histories テーブル対応
type ClinicalRecordHistory = {
  historyId: string;               // UUID PK
  recordId: string;                // 元の recordId
  version: number;
  subjectiveNote: string | null;
  objectiveNote: string | null;
  assessmentNote: string | null;
  planNote: string | null;
  amendReason: string | null;
  archivedAt: string;
};
```

---

## 業務ルール仕様

### 記録確定ルール

| ルール | 仕様 |
| ------ | ---- |
| 確定操作 | DRAFT → FINALIZED への遷移のみ許可 |
| 確定後の変更 | PUT による更新は不可。修正は amend エンドポイントを使用 |
| 修正追記 | FINALIZED / AMENDED からのみ可。元版をアーカイブし新版を作成 |

### 版管理ルール

| ルール | 仕様 |
| ------ | ---- |
| 版番号 | 作成時 version = 1。amend 毎に +1 |
| 最新版の判別 | supersededBy = null のレコードが最新版 |
| 全版取得 | /history エンドポイントで全版を取得可能 |

### マルチテナント境界

- tenantId が異なる診療記録は相互に参照不可

---

## エラーコード一覧

| エラーコード | HTTP | 説明 |
| ----------- | :--: | ---- |
| `RECORD_NOT_FOUND` | 404 | 診療記録が存在しない |
| `ENCOUNTER_NOT_FOUND` | 404 | 指定受診が存在しない |
| `RECORD_ALREADY_FINALIZED` | 400 | 確定済み記録への更新操作は不可 |
| `RECORD_NOT_FINALIZED` | 400 | 下書き記録への修正追記は不可 |
| `ENCOUNTER_ALREADY_FINALIZED` | 409 | 受診が終了済みで記録作成不可 |
| `VALIDATION_ERROR` | 400 | 入力値の形式不正または必須欠落 |
| `SYSTEM_ERROR` | 500 | サーバー内部エラー |
