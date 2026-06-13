# 実装計画書_audit-domain-service

<!-- モジュール責任: 操作の証跡・誰が何をいつ行ったかの確定記録はここだけが管理する。他ドメインからのイベント受信専用。 -->

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

- 生成対象: `audit-domain-service` の Controller 層 / Service 層 / Repository 層
- 非生成対象: BFF・フロントエンドのコード

---

## 文書概要

- **サービス名**: `audit-domain-service`
- **責務**: 操作履歴記録・閲覧履歴保存・更新履歴保存・法的証跡保持・監査ログ検索
- **呼び出し元**: 全ドメインサービス（監査ログ書き込み）・管理系 BFF（検索）
- **真実の源泉**: 操作の証跡・誰が何をいつ行ったかの確定記録
- **特記事項**: 書き込みは他ドメインからのイベント受信専用。監査ログは削除・更新不可。

---

## API一覧（Controller層）

| メソッド | パス | 概要 | ステータス |
| :------: | ---- | ---- | :--------: |
| `POST`   | `/api/v1/audit-logs` | 監査ログ記録 | 設計中 |
| `GET`    | `/api/v1/audit-logs` | 監査ログ検索 | 設計中 |
| `GET`    | `/api/v1/audit-logs/{logId}` | 監査ログ1件取得 | 設計中 |
| `GET`    | `/api/v1/audit-logs/patients/{patientId}` | 患者単位の操作履歴取得 | 設計中 |
| `GET`    | `/api/v1/audit-logs/users/{userId}` | ユーザー単位の操作履歴取得 | 設計中 |

---

## API仕様（APIごと）

### `POST /api/v1/audit-logs`

**概要**: 監査ログを記録する。各ドメインサービスが操作完了後に呼び出す。  
**呼び出し元**: 全ドメインサービス  
**呼び出しタイミング**: 重要な操作（登録・更新・確定・削除・閲覧）の完了後

#### リクエスト

```typescript
type AuditLogCreateRequest = {
  tenantId: string;
  userId: string;                  // 操作者ID
  action: AuditAction;             // 操作種別
  resourceType: string;            // リソース種別（例: "patient", "clinical-record"）
  resourceId: string;              // 操作対象のリソースID
  detail?: Record<string, unknown>; // 操作詳細（JSON形式。変更前後の値等）
  ipAddress?: string;              // クライアントIPアドレス
  userAgent?: string;              // クライアントUA
};

type AuditAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'FINALIZE'
  | 'CANCEL'
  | 'MERGE'
  | 'LOGIN'
  | 'LOGOUT';
```

#### レスポンス

**成功時（201）**

```typescript
type AuditLogCreateResponse = {
  logId: string;                   // 発行されたログID（UUID）
  recordedAt: string;              // 記録日時（ISO 8601）
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 201  | —           | 正常（ログ記録成功） |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 500  | `SYSTEM_ERROR` | サーバー内部エラー |

#### 処理仕様

```
1. リクエストをバリデーションする（必須項目・形式チェック）
2. logId を UUID で発行する
3. recordedAt = 現在日時で audit_logs テーブルに INSERT する
4. 201 を返す
※ 監査ログは INSERT のみ。UPDATE / DELETE は実装しない
```

---

### `GET /api/v1/audit-logs`

**概要**: 監査ログを検索する。  
**呼び出し元**: 管理系 BFF（システム管理者・監査担当者向け）

#### リクエスト（クエリパラメータ）

| 項目 | 型 | 必須 | 説明 |
| ---- | -- | :--: | ---- |
| `X-Tenant-Id` | header | ○ | テナントID |
| `userId` | `string` | × | 操作者IDフィルタ |
| `action` | `string` | × | 操作種別フィルタ（カンマ区切り複数可） |
| `resourceType` | `string` | × | リソース種別フィルタ |
| `resourceId` | `string` | × | リソースIDフィルタ |
| `fromDate` | `string` | × | 記録日時FROM（ISO 8601） |
| `toDate` | `string` | × | 記録日時TO（ISO 8601） |
| `limit` | `number` | × | 最大件数（デフォルト 50、最大 200） |
| `offset` | `number` | × | オフセット（デフォルト 0） |

**成功時（200）**

```typescript
type AuditLogSearchResponse = {
  total: number;
  logs: AuditLogSummary[];
};

type AuditLogSummary = {
  logId: string;
  userId: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  recordedAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 400  | `VALIDATION_ERROR` | クエリパラメータの形式不正 |

---

### `GET /api/v1/audit-logs/{logId}`

**概要**: 監査ログを1件取得する（detail を含む完全な情報）。

**成功時（200）**

```typescript
type AuditLogResponse = {
  logId: string;
  tenantId: string;
  userId: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  detail: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  recordedAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `LOG_NOT_FOUND` | ログが存在しない |

---

### `GET /api/v1/audit-logs/patients/{patientId}`

**概要**: 特定患者に対する操作履歴を取得する（患者情報のアクセス履歴確認用）。

#### リクエスト（クエリパラメータ）

| 項目 | 型 | 必須 | 説明 |
| ---- | -- | :--: | ---- |
| `fromDate` | `string` | × | 記録日時FROM |
| `toDate` | `string` | × | 記録日時TO |
| `limit` | `number` | × | 最大件数（デフォルト 50、最大 200） |
| `offset` | `number` | × | オフセット（デフォルト 0） |

**成功時（200）**

```typescript
type PatientAuditLogResponse = {
  patientId: string;
  total: number;
  logs: AuditLogSummary[];
};
```

---

### `GET /api/v1/audit-logs/users/{userId}`

**概要**: 特定ユーザーの操作履歴を取得する（ユーザー行動監査用）。

**成功時（200）**

```typescript
type UserAuditLogResponse = {
  userId: string;
  total: number;
  logs: AuditLogSummary[];
};
```

---

## ドメインモデル・型定義

```typescript
// audit_logs テーブル対応
type AuditLog = {
  logId: string;                   // UUID PK
  tenantId: string;
  userId: string;                  // 操作者ID
  action: AuditAction;
  resourceType: string;            // 例: "patient", "clinical-record", "order"
  resourceId: string;              // 操作対象のリソースID
  detail: string | null;           // JSON文字列（変更前後の値等）
  ipAddress: string | null;
  userAgent: string | null;
  recordedAt: string;              // 記録日時（ISO 8601）。変更不可。
};
```

---

## 業務ルール仕様

### 監査ログ不変性

| ルール | 仕様 |
| ------ | ---- |
| INSERT のみ | 監査ログは記録後に更新・削除不可 |
| 法的証跡 | 記録は法的要件に基づき一定期間保持（保持期間はシステム設定） |

### 監査対象操作

| 操作 | action 値 | 記録条件 |
| ---- | --------- | -------- |
| リソース作成 | `CREATE` | 常に記録 |
| リソース参照 | `READ` | 患者情報・診療記録の参照時のみ記録 |
| リソース更新 | `UPDATE` | 常に記録 |
| リソース削除 | `DELETE` | 常に記録 |
| 記録確定 | `FINALIZE` | 常に記録 |
| 取消 | `CANCEL` | 常に記録 |
| 名寄せ | `MERGE` | 常に記録 |
| ログイン | `LOGIN` | 常に記録 |
| ログアウト | `LOGOUT` | 常に記録 |

### マルチテナント境界

- tenantId が異なる監査ログは相互に参照不可

---

## エラーコード一覧

| エラーコード | HTTP | 説明 |
| ----------- | :--: | ---- |
| `LOG_NOT_FOUND` | 404 | 監査ログが存在しない |
| `VALIDATION_ERROR` | 400 | 入力値の形式不正または必須欠落 |
| `SYSTEM_ERROR` | 500 | サーバー内部エラー |
