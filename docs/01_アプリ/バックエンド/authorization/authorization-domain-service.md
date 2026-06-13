# 実装計画書_authorization-domain-service

<!-- モジュール責任: 誰が何をしてよいかの最終判断はここだけが行う。業務データは持たない。 -->

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

- 生成対象: `authorization-domain-service` の Controller 層 / Service 層 / Repository 層
- 非生成対象: BFF・フロントエンドのコード

---

## 文書概要

- **サービス名**: `authorization-domain-service`
- **責務**: ロール管理・権限ポリシー管理・アクセス可否判定・画面/APIアクセス制御
- **呼び出し元**: 全 BFF（リクエスト処理前に呼び出す）
- **真実の源泉**: 誰が何をしてよいかの最終判断

---

## API一覧（Controller層）

| メソッド | パス | 概要 | ステータス |
| :------: | ---- | ---- | :--------: |
| `POST`   | `/api/v1/authorization/check` | アクセス可否判定 | 設計中 |
| `GET`    | `/api/v1/roles` | ロール一覧取得 | 設計中 |
| `POST`   | `/api/v1/roles` | ロール作成 | 設計中 |
| `PUT`    | `/api/v1/roles/{roleId}` | ロール更新 | 設計中 |
| `DELETE` | `/api/v1/roles/{roleId}` | ロール削除 | 設計中 |
| `GET`    | `/api/v1/roles/{roleId}/policies` | ロールに紐づく権限ポリシー取得 | 設計中 |
| `PUT`    | `/api/v1/roles/{roleId}/policies` | ロールの権限ポリシー更新 | 設計中 |
| `GET`    | `/api/v1/users/{userId}/roles` | ユーザーのロール取得 | 設計中 |
| `PUT`    | `/api/v1/users/{userId}/roles` | ユーザーへのロール割り当て | 設計中 |

---

## API仕様（APIごと）

### `POST /api/v1/authorization/check`

**概要**: 指定ユーザーが指定リソースに対して指定アクションを実行できるか判定する。  
**呼び出し元**: 全 BFF（API処理の認可ゲートとして使用）

#### リクエスト

```typescript
type AuthorizationCheckRequest = {
  tenantId: string;
  userId: string;                  // 判定対象ユーザーID
  resource: string;                // リソース識別子（例: "patient", "clinical-record"）
  action: string;                  // アクション（例: "read", "write", "delete", "finalize"）
  resourceId?: string;             // 特定リソースへのアクセス（省略時は種別レベル判定）
};
```

#### レスポンス

**成功時（200）**

```typescript
type AuthorizationCheckResponse = {
  allowed: boolean;
  reason?: string;                 // 拒否の場合にのみ理由を設定
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常（allowed=false でも 200） |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 404  | `USER_NOT_FOUND` | 指定ユーザーが存在しない |
| 500  | `SYSTEM_ERROR` | サーバー内部エラー |

#### 処理仕様

```
1. リクエストをバリデーションする
2. userId AND tenantId でユーザーのロール一覧を取得する（存在しない場合: 404）
3. ロールに紐づく権限ポリシー一覧を取得する
4. resource + action の組み合わせで ALLOW ポリシーが存在するか確認する
5. DENY ポリシーが ALLOW より優先される
6. allowed の値を設定して 200 を返す
```

---

### `GET /api/v1/roles`

**概要**: テナント内のロール一覧を取得する。

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

**成功時（200）**

```typescript
type RoleListResponse = {
  roles: Role[];
};

type Role = {
  roleId: string;
  roleName: string;
  description: string | null;
  isSystem: boolean;               // システム定義ロール（削除不可）
  createdAt: string;
};
```

---

### `POST /api/v1/roles`

**概要**: 新しいロールを作成する。

#### リクエスト

```typescript
type RoleCreateRequest = {
  tenantId: string;
  roleName: string;
  description?: string;
};
```

**成功時（201）**

```typescript
type RoleCreateResponse = {
  roleId: string;
  roleName: string;
  createdAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 201  | —           | 正常 |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 409  | `ROLE_NAME_DUPLICATE` | 同テナント内に同名ロールが存在する |

---

### `PUT /api/v1/roles/{roleId}`

**概要**: ロール情報を更新する。システムロールは更新不可。

```typescript
type RoleUpdateRequest = {
  roleName: string;
  description?: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `ROLE_NOT_FOUND` | ロールが存在しない |
| 400  | `SYSTEM_ROLE_IMMUTABLE` | システムロールは変更不可 |

---

### `DELETE /api/v1/roles/{roleId}`

**概要**: ロールを削除する。システムロールおよびユーザーに割り当て中のロールは削除不可。

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 204  | —           | 正常 |
| 404  | `ROLE_NOT_FOUND` | ロールが存在しない |
| 400  | `SYSTEM_ROLE_IMMUTABLE` | システムロールは削除不可 |
| 409  | `ROLE_IN_USE` | ユーザーに割り当て中のロールは削除不可 |

---

### `GET /api/v1/roles/{roleId}/policies`

**概要**: ロールに紐づく権限ポリシー一覧を取得する。

**成功時（200）**

```typescript
type PolicyListResponse = {
  roleId: string;
  policies: Policy[];
};

type Policy = {
  policyId: string;
  resource: string;
  action: string;
  effect: 'ALLOW' | 'DENY';
};
```

---

### `PUT /api/v1/roles/{roleId}/policies`

**概要**: ロールの権限ポリシーを全置換する。

```typescript
type PolicyUpdateRequest = {
  policies: PolicyInput[];
};

type PolicyInput = {
  resource: string;
  action: string;
  effect: 'ALLOW' | 'DENY';
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `ROLE_NOT_FOUND` | ロールが存在しない |
| 400  | `SYSTEM_ROLE_IMMUTABLE` | システムロールのポリシーは変更不可 |

#### 処理仕様

```
1. roleId AND tenantId でロールを検索する（存在しない場合: 404）
2. isSystem = true の場合: 400 SYSTEM_ROLE_IMMUTABLE
3. 既存ポリシーを全件 DELETE する
4. 新しいポリシーを INSERT する
5. 200 を返す
```

---

### `GET /api/v1/users/{userId}/roles`

**概要**: ユーザーに割り当てられたロール一覧を取得する。

**成功時（200）**

```typescript
type UserRoleResponse = {
  userId: string;
  roles: Role[];
};
```

---

### `PUT /api/v1/users/{userId}/roles`

**概要**: ユーザーへのロール割り当てを全置換する。

```typescript
type UserRoleUpdateRequest = {
  tenantId: string;
  roleIds: string[];               // 割り当てるロールID一覧
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `USER_NOT_FOUND` | ユーザーが存在しない |
| 400  | `ROLE_NOT_FOUND` | 指定ロールが存在しない |

---

## ドメインモデル・型定義

```typescript
// roles テーブル対応
type Role = {
  roleId: string;                  // UUID PK
  tenantId: string;
  roleName: string;
  description: string | null;
  isSystem: boolean;               // true = システム定義ロール（変更・削除不可）
  createdAt: string;
  updatedAt: string;
};

// role_policies テーブル対応
type RolePolicy = {
  policyId: string;                // UUID PK
  roleId: string;                  // FK → roles
  resource: string;                // 例: "patient", "clinical-record", "*"
  action: string;                  // 例: "read", "write", "delete", "finalize", "*"
  effect: 'ALLOW' | 'DENY';
};

// user_roles テーブル対応
type UserRole = {
  userId: string;
  roleId: string;
  tenantId: string;
  assignedAt: string;
};
```

---

## 業務ルール仕様

### アクセス可否判定ルール

| ルール | 仕様 |
| ------ | ---- |
| DENY 優先 | DENY ポリシーが ALLOW より優先される |
| デフォルト拒否 | 一致するポリシーがない場合は拒否（DENY）とする |
| ワイルドカード | resource="*" / action="*" はすべてのリソース/アクションにマッチ |
| マルチロール | ユーザーが複数ロールを持つ場合、いずれかの ALLOW があれば許可（ただし DENY 優先） |

### システムロール

| ロール名 | 概要 |
| ------- | ---- |
| `SYSTEM_ADMIN` | 全リソース・全アクションへのフルアクセス |
| `DOCTOR` | 診療記録・オーダーの参照・書き込み・確定 |
| `NURSE` | 診療記録参照・実施記録の書き込み |
| `RECEPTIONIST` | 患者情報・受診情報の参照・書き込み（診療記録は参照のみ） |

### マルチテナント境界

- tenantId が異なるロール・ポリシーは相互に参照不可

---

## エラーコード一覧

| エラーコード | HTTP | 説明 |
| ----------- | :--: | ---- |
| `USER_NOT_FOUND` | 404 | 指定ユーザーが存在しない |
| `ROLE_NOT_FOUND` | 404 | ロールが存在しない |
| `ROLE_NAME_DUPLICATE` | 409 | 同テナント内に同名ロールが存在する |
| `ROLE_IN_USE` | 409 | ユーザーに割り当て中のため削除不可 |
| `SYSTEM_ROLE_IMMUTABLE` | 400 | システムロールは変更・削除不可 |
| `VALIDATION_ERROR` | 400 | 入力値の形式不正または必須欠落 |
| `SYSTEM_ERROR` | 500 | サーバー内部エラー |
