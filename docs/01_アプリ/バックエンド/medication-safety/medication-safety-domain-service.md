# 実装計画書_medication-safety-domain-service

<!-- モジュール責任: 投薬可否判定ロジックはここだけが決定する。データ所有はしない純粋判定責任。 -->

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

- 生成対象: `medication-safety-domain-service` の Controller 層 / Service 層 / Repository 層
- 非生成対象: BFF・フロントエンドのコード

---

## 文書概要

- **サービス名**: `medication-safety-domain-service`
- **責務**: 相互作用チェック・重複投薬判定・禁忌チェック・投与量妥当性判定
- **呼び出し元**: 処方系 BFF（オーダー発行前に呼び出す）
- **真実の源泉**: 投薬可否判定ロジック
- **特記事項**: 業務データを持たない純粋判定サービス。患者の現在処方一覧は order-domain-service から取得する

---

## API一覧（Controller層）

| メソッド | パス | 概要 | ステータス |
| :------: | ---- | ---- | :--------: |
| `POST`   | `/api/v1/medication-safety/check` | 投薬安全性チェック（一括） | 設計中 |
| `POST`   | `/api/v1/medication-safety/interaction` | 相互作用チェック | 設計中 |
| `POST`   | `/api/v1/medication-safety/duplicate` | 重複投薬チェック | 設計中 |
| `POST`   | `/api/v1/medication-safety/contraindication` | 禁忌チェック | 設計中 |
| `POST`   | `/api/v1/medication-safety/dosage` | 投与量妥当性チェック | 設計中 |

---

## API仕様（APIごと）

### `POST /api/v1/medication-safety/check`

**概要**: 相互作用・重複投薬・禁忌・投与量を一括チェックする。処方オーダー発行前に呼び出す。  
**呼び出し元**: 処方系 BFF

#### リクエスト

```typescript
type MedicationSafetyCheckRequest = {
  tenantId: string;
  patientId: string;               // チェック対象患者ID
  encounterId: string;             // 現在の受診ID
  newMedications: MedicationInput[];  // 新規処方候補
};

type MedicationInput = {
  drugId: string;                  // 薬剤マスタID
  dosage: number;                  // 1回投与量
  unit: string;                    // 単位（mg, mL 等）
  frequency: string;               // 投与頻度（例: "1日3回", "毎食後"）
  route: 'ORAL' | 'INJECTION' | 'TOPICAL' | 'INHALATION';
};
```

#### レスポンス

**成功時（200）**

```typescript
type MedicationSafetyCheckResponse = {
  overallSafe: boolean;            // 全チェック通過で true
  alerts: SafetyAlert[];           // 警告一覧（空配列なら問題なし）
};

type SafetyAlert = {
  alertType: 'INTERACTION' | 'DUPLICATE' | 'CONTRAINDICATION' | 'DOSAGE';
  severity: 'ERROR' | 'WARNING' | 'INFO';
  drugId: string;                  // 問題のある薬剤ID
  conflictDrugId?: string;         // 相互作用先の薬剤ID（INTERACTION の場合）
  message: string;                 // 警告メッセージ
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常（チェック完了。alerts に警告内容を含む） |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 404  | `PATIENT_NOT_FOUND` | 指定患者が存在しない |
| 500  | `SYSTEM_ERROR` | サーバー内部エラー |

#### 処理仕様

```
1. リクエストをバリデーションする
2. patient-domain-service で patientId の存在確認（存在しない場合: 404）
3. order-domain-service から patientId の現在有効な処方オーダー一覧を取得する
4. 以下の4チェックを並列実行する
   a. 相互作用チェック: newMedications × 現在処方 の組み合わせで薬剤相互作用マスタを照合
   b. 重複投薬チェック: 同一薬剤または同一薬効群が現在処方に存在するか確認
   c. 禁忌チェック: 患者の診断・アレルギー情報と newMedications の禁忌マスタを照合
   d. 投与量チェック: newMedications の dosage が薬剤マスタの安全投与量範囲内か確認
5. 全チェック結果を統合し、alerts に格納する
6. overallSafe = alerts に severity = 'ERROR' が存在しない場合 true
7. 200 を返す
```

---

### `POST /api/v1/medication-safety/interaction`

**概要**: 薬剤間の相互作用のみをチェックする。

#### リクエスト

```typescript
type InteractionCheckRequest = {
  tenantId: string;
  patientId: string;
  newMedications: MedicationInput[];
};
```

**成功時（200）**

```typescript
type InteractionCheckResponse = {
  hasInteraction: boolean;
  interactions: InteractionDetail[];
};

type InteractionDetail = {
  drugId: string;
  conflictDrugId: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  mechanism: string;               // 相互作用のメカニズム説明
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |

---

### `POST /api/v1/medication-safety/duplicate`

**概要**: 重複投薬（同一薬剤・同一薬効群の重複）をチェックする。

#### リクエスト

```typescript
type DuplicateCheckRequest = {
  tenantId: string;
  patientId: string;
  newMedications: MedicationInput[];
};
```

**成功時（200）**

```typescript
type DuplicateCheckResponse = {
  hasDuplicate: boolean;
  duplicates: DuplicateDetail[];
};

type DuplicateDetail = {
  drugId: string;                  // 新規処方の薬剤ID
  conflictDrugId: string;          // 既存処方の薬剤ID
  duplicateType: 'SAME_DRUG' | 'SAME_CLASS';
};
```

---

### `POST /api/v1/medication-safety/contraindication`

**概要**: 患者の状態に対する禁忌をチェックする。

#### リクエスト

```typescript
type ContraindicationCheckRequest = {
  tenantId: string;
  patientId: string;
  newMedications: MedicationInput[];
};
```

**成功時（200）**

```typescript
type ContraindicationCheckResponse = {
  hasContraindication: boolean;
  contraindications: ContraindicationDetail[];
};

type ContraindicationDetail = {
  drugId: string;
  reason: string;                  // 禁忌理由（例: "腎機能障害のため禁忌"）
  severity: 'ERROR' | 'WARNING';
};
```

---

### `POST /api/v1/medication-safety/dosage`

**概要**: 投与量の妥当性をチェックする。

#### リクエスト

```typescript
type DosageCheckRequest = {
  tenantId: string;
  patientId: string;
  newMedications: MedicationInput[];
};
```

**成功時（200）**

```typescript
type DosageCheckResponse = {
  allValid: boolean;
  violations: DosageViolation[];
};

type DosageViolation = {
  drugId: string;
  inputDosage: number;
  unit: string;
  maxSafeDosage: number;           // 薬剤マスタの最大安全投与量
  severity: 'ERROR' | 'WARNING';
};
```

---

## ドメインモデル・型定義

```typescript
// このサービスは業務データを所有しない。
// 判定に使用するマスタは master-domain-service 管理下。
// 以下は判定処理で参照するマスタの型定義。

// 薬剤相互作用マスタ（master-domain-service から参照）
type DrugInteractionMaster = {
  drugId1: string;
  drugId2: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  mechanism: string;
};

// 薬剤禁忌マスタ（master-domain-service から参照）
type DrugContraindicationMaster = {
  drugId: string;
  contraindicationType: string;    // 禁忌種別コード（例: "RENAL_FAILURE"）
  severity: 'ERROR' | 'WARNING';
  reason: string;
};
```

---

## 業務ルール仕様

### チェック優先度

| 優先度 | チェック種別 | severity=ERROR 時の挙動 |
| :----: | ----------- | ----------------------- |
| 1      | 禁忌チェック | 処方不可（BFF 側でブロック） |
| 2      | 相互作用チェック（ERROR） | 処方不可 |
| 3      | 投与量チェック（ERROR） | 処方不可 |
| 4      | 重複投薬チェック | 警告表示（処方可） |
| 5      | 相互作用・投与量チェック（WARNING） | 警告表示（処方可） |

※ severity=ERROR / WARNING の判断はこのサービスが行う。ブロック制御は BFF が担う。

### 判定データソース

| チェック種別 | 参照先 |
| ----------- | ------ |
| 相互作用 | 薬剤相互作用マスタ（master-domain-service） |
| 重複投薬 | 患者の現在処方（order-domain-service） + 薬効分類マスタ（master） |
| 禁忌 | 薬剤禁忌マスタ（master） + 患者アレルギー情報（patient-domain-service） |
| 投与量 | 薬剤投与量マスタ（master） |

---

## エラーコード一覧

| エラーコード | HTTP | 説明 |
| ----------- | :--: | ---- |
| `PATIENT_NOT_FOUND` | 404 | 指定患者が存在しない |
| `VALIDATION_ERROR` | 400 | 入力値の形式不正または必須欠落 |
| `SYSTEM_ERROR` | 500 | サーバー内部エラー |
