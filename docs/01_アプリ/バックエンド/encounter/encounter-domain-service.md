# 実装計画書_encounter-domain-service

<!-- モジュール責任: 「いつ・どの単位で診療が行われたか」の確定情報はここだけが決定する。 -->

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

- 生成対象: `encounter-domain-service` の Controller 層 / Service 層 / Repository 層
- 非生成対象: BFF・フロントエンドのコード

---

## 文書概要

- **サービス名**: `encounter-domain-service`
- **責務**: 来院単位の管理・外来/入院区分管理・受診ステータス遷移・診療開始/終了管理
- **呼び出し元**: 各ドメインサービス（BFF 経由）
- **真実の源泉**: 「いつ・どの単位で診療が行われたか」の確定情報

---

## API一覧（Controller層）

| メソッド | パス | 概要 | ステータス |
| :------: | ---- | ---- | :--------: |
| `POST`   | `/api/v1/encounters` | 受診（来院）登録 | 設計中 |
| `GET`    | `/api/v1/encounters/{encounterId}` | 受診情報取得 | 設計中 |
| `GET`    | `/api/v1/patients/{patientId}/encounters` | 患者の受診履歴一覧取得 | 設計中 |
| `PATCH`  | `/api/v1/encounters/{encounterId}/status` | 受診ステータス変更 | 設計中 |
| `POST`   | `/api/v1/encounters/{encounterId}/start` | 診療開始 | 設計中 |
| `POST`   | `/api/v1/encounters/{encounterId}/end` | 診療終了 | 設計中 |

---

## API仕様（APIごと）

### `POST /api/v1/encounters`

**概要**: 新規来院を登録し、受診IDを発行する。  
**呼び出し元**: 受付系 BFF  
**呼び出しタイミング**: 患者が来院し受付を行ったとき

#### リクエスト

```typescript
type EncounterCreateRequest = {
  tenantId: string;
  patientId: string;               // 患者UUID
  encounterType: 'OUTPATIENT' | 'INPATIENT' | 'EMERGENCY';
  plannedDate: string;             // YYYY-MM-DD（受診予定日）
  departmentId: string;            // 診療科ID
  primaryPhysicianId?: string;     // 主治医ID（省略可）
  reason?: string;                 // 来院理由（省略可）
};
```

#### レスポンス

**成功時（201）**

```typescript
type EncounterCreateResponse = {
  encounterId: string;             // 発行された受診ID（UUID）
  encounterNo: string;             // 受診番号（表示用連番）
  status: 'REGISTERED';
  createdAt: string;               // ISO 8601
};
```

**ステータスコード一覧**

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 201  | —           | 正常（受診登録成功） |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 404  | `PATIENT_NOT_FOUND` | 指定患者が存在しない |
| 409  | `DUPLICATE_ENCOUNTER` | 同日同診療科で受診済みの encounter が存在する |
| 500  | `SYSTEM_ERROR` | サーバー内部エラー |

#### 処理仕様

```
1. リクエストをバリデーションする（必須項目・形式チェック）
2. patient-domain-service で patientId の存在確認（存在しない場合: 404 PATIENT_NOT_FOUND）
3. 同日・同診療科の受診重複チェック（重複がある場合: 409 DUPLICATE_ENCOUNTER）
4. 受診IDを UUID で発行する
5. 受診番号（encounterNo）をシーケンスで採番する
6. encounters テーブルに INSERT する（status = 'REGISTERED'）
7. 監査ログを記録する
8. 201 を返す
```

---

### `GET /api/v1/encounters/{encounterId}`

**概要**: 受診IDで受診情報を1件取得する。  
**呼び出し元**: 各ドメインサービス・BFF

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `encounterId` | path | `string` | ○ | 受診UUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

#### レスポンス

**成功時（200）**

```typescript
type EncounterResponse = {
  encounterId: string;
  encounterNo: string;
  patientId: string;
  encounterType: 'OUTPATIENT' | 'INPATIENT' | 'EMERGENCY';
  status: 'REGISTERED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  plannedDate: string;             // YYYY-MM-DD
  startedAt: string | null;        // 診療開始日時
  endedAt: string | null;          // 診療終了日時
  departmentId: string;
  primaryPhysicianId: string | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `ENCOUNTER_NOT_FOUND` | 受診が存在しない |

#### 処理仕様

```
1. encounters テーブルで encounterId AND tenantId を条件に検索する
2. 存在しない場合: 404 ENCOUNTER_NOT_FOUND
3. 200 を返す
```

---

### `GET /api/v1/patients/{patientId}/encounters`

**概要**: 患者の受診履歴を一覧取得する。  
**呼び出し元**: 診療記録・BFF

#### リクエスト（クエリパラメータ）

| 項目 | 型 | 必須 | 説明 |
| ---- | -- | :--: | ---- |
| `patientId` | `string` | ○ | 患者UUID（path） |
| `status` | `string` | × | ステータスフィルタ（カンマ区切り複数可） |
| `fromDate` | `string` | × | 受診日FROM（YYYY-MM-DD） |
| `toDate` | `string` | × | 受診日TO（YYYY-MM-DD） |
| `limit` | `number` | × | 最大件数（デフォルト 20、最大 100） |
| `offset` | `number` | × | オフセット（デフォルト 0） |

**成功時（200）**

```typescript
type EncounterListResponse = {
  total: number;
  encounters: EncounterSummary[];
};
type EncounterSummary = {
  encounterId: string;
  encounterNo: string;
  encounterType: 'OUTPATIENT' | 'INPATIENT' | 'EMERGENCY';
  status: 'REGISTERED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  plannedDate: string;
  departmentId: string;
  primaryPhysicianId: string | null;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `PATIENT_NOT_FOUND` | 指定患者が存在しない |

#### 処理仕様

```
1. patientId AND tenantId を条件に encounters テーブルを検索する
2. フィルタ条件（status, fromDate, toDate）を適用する
3. plannedDate DESC でソートし、limit/offset でページング
4. 200 を返す
```

---

### `PATCH /api/v1/encounters/{encounterId}/status`

**概要**: 受診ステータスを変更する（キャンセル等）。

#### リクエスト

```typescript
type EncounterStatusRequest = {
  status: 'REGISTERED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  reason?: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `ENCOUNTER_NOT_FOUND` | 受診が存在しない |
| 400  | `INVALID_STATUS_TRANSITION` | 無効なステータス遷移 |

#### 処理仕様

```
1. encounterId AND tenantId で受診を検索する（存在しない場合: 404）
2. ステータス遷移ルールを検証する（無効な場合: 400 INVALID_STATUS_TRANSITION）
3. encounters テーブルを UPDATE する
4. 監査ログを記録する
5. 200 を返す
```

---

### `POST /api/v1/encounters/{encounterId}/start`

**概要**: 診療を開始する。ステータスを IN_PROGRESS に遷移させ、開始日時を記録する。

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `encounterId` | path | `string` | ○ | 受診UUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

リクエストボディなし。

#### レスポンス

**成功時（200）**

```typescript
type EncounterStartResponse = {
  encounterId: string;
  status: 'IN_PROGRESS';
  startedAt: string;               // ISO 8601
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `ENCOUNTER_NOT_FOUND` | 受診が存在しない |
| 400  | `INVALID_STATUS_TRANSITION` | REGISTERED 以外からの開始は不可 |

#### 処理仕様

```
1. encounterId AND tenantId で受診を検索する（存在しない場合: 404）
2. 現在ステータスが REGISTERED であることを確認（それ以外: 400）
3. status = 'IN_PROGRESS'、startedAt = 現在日時 で UPDATE する
4. 監査ログを記録する
5. 200 を返す
```

---

### `POST /api/v1/encounters/{encounterId}/end`

**概要**: 診療を終了する。ステータスを COMPLETED に遷移させ、終了日時を記録する。

#### リクエスト

```typescript
type EncounterEndRequest = {
  summary?: string;                // 診療サマリ（省略可）
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `ENCOUNTER_NOT_FOUND` | 受診が存在しない |
| 400  | `INVALID_STATUS_TRANSITION` | IN_PROGRESS 以外からの終了は不可 |

#### 処理仕様

```
1. encounterId AND tenantId で受診を検索する（存在しない場合: 404）
2. 現在ステータスが IN_PROGRESS であることを確認（それ以外: 400）
3. status = 'COMPLETED'、endedAt = 現在日時 で UPDATE する
4. summary が指定された場合は encounters テーブルに保存する
5. 監査ログを記録する
6. 200 を返す
```

---

## ドメインモデル・型定義

```typescript
// encounters テーブル対応
type Encounter = {
  encounterId: string;             // UUID PK
  encounterNo: string;             // 受診番号（表示用）
  tenantId: string;
  patientId: string;               // FK → patients
  encounterType: 'OUTPATIENT' | 'INPATIENT' | 'EMERGENCY';
  status: 'REGISTERED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  plannedDate: string;             // YYYY-MM-DD
  startedAt: string | null;        // 診療開始日時（ISO 8601）
  endedAt: string | null;          // 診療終了日時（ISO 8601）
  departmentId: string;
  primaryPhysicianId: string | null;
  reason: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
};
```

---

## 業務ルール仕様

### 受診重複チェック

| ルール | 仕様 |
| ------ | ---- |
| チェック項目 | 同一テナント・同一患者・同日・同診療科 |
| 判定 | 上記すべてが一致し、かつステータスが CANCELLED でない受診が存在する場合を重複とする |
| 重複時の挙動 | 409 DUPLICATE_ENCOUNTER |

### ステータス遷移

| 遷移元 | 遷移先 | 可否 |
| ------ | ------ | :--: |
| `REGISTERED` | `IN_PROGRESS` | ○ |
| `REGISTERED` | `CANCELLED` | ○ |
| `IN_PROGRESS` | `COMPLETED` | ○ |
| `IN_PROGRESS` | `CANCELLED` | ○ |
| `COMPLETED` | 任意 | × |
| `CANCELLED` | 任意 | × |

### マルチテナント境界

- tenantId が異なる受診データは相互に参照不可

---

## エラーコード一覧

| エラーコード | HTTP | 説明 |
| ----------- | :--: | ---- |
| `ENCOUNTER_NOT_FOUND` | 404 | 受診が存在しない |
| `PATIENT_NOT_FOUND` | 404 | 指定患者が存在しない |
| `DUPLICATE_ENCOUNTER` | 409 | 同日同診療科で受診済みの encounter が存在する |
| `INVALID_STATUS_TRANSITION` | 400 | 無効なステータス遷移 |
| `VALIDATION_ERROR` | 400 | 入力値の形式不正または必須欠落 |
| `SYSTEM_ERROR` | 500 | サーバー内部エラー |
