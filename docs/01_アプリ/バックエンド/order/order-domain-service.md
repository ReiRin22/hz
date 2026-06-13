# 実装計画書_order-domain-service

<!-- モジュール責任: 指示の状態（発行・取消・完了）はここだけが決定する。 -->

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

- 生成対象: `order-domain-service` の Controller 層 / Service 層 / Repository 層
- 非生成対象: BFF・フロントエンドのコード

---

## 文書概要

- **サービス名**: `order-domain-service`
- **責務**: 指示発行・オーダーステータス管理・取消処理・実施依頼管理・状態遷移ルール管理
- **呼び出し元**: 診療系 BFF
- **真実の源泉**: 指示の状態（発行・取消・完了）

---

## API一覧（Controller層）

| メソッド | パス | 概要 | ステータス |
| :------: | ---- | ---- | :--------: |
| `POST`   | `/api/v1/orders` | オーダー発行 | 設計中 |
| `GET`    | `/api/v1/orders/{orderId}` | オーダー取得 | 設計中 |
| `GET`    | `/api/v1/encounters/{encounterId}/orders` | 受診に紐づくオーダー一覧 | 設計中 |
| `POST`   | `/api/v1/orders/{orderId}/cancel` | オーダー取消 | 設計中 |
| `POST`   | `/api/v1/orders/{orderId}/request-execution` | 実施依頼 | 設計中 |
| `PATCH`  | `/api/v1/orders/{orderId}/status` | オーダーステータス変更 | 設計中 |

---

## API仕様（APIごと）

### `POST /api/v1/orders`

**概要**: オーダー（指示）を発行する。  
**呼び出し元**: 診療系 BFF  
**呼び出しタイミング**: 医師が処方・検査・処置等を指示したとき

#### リクエスト

```typescript
type OrderCreateRequest = {
  tenantId: string;
  encounterId: string;             // 受診UUID
  orderType: 'MEDICATION' | 'TEST' | 'PROCEDURE' | 'REFERRAL';
  itemId: string;                  // マスタID（薬剤ID / 検査ID 等）
  quantity?: number;               // 数量（検査等では省略可）
  unit?: string;                   // 単位
  instruction?: string;            // 指示内容・備考
  orderedBy: string;               // 指示者ID（医師）
  scheduledDate?: string;          // 実施予定日（YYYY-MM-DD、省略時は当日）
};
```

#### レスポンス

**成功時（201）**

```typescript
type OrderCreateResponse = {
  orderId: string;                 // 発行されたオーダーID（UUID）
  orderNo: string;                 // オーダー番号（表示用連番）
  status: 'PENDING';
  createdAt: string;               // ISO 8601
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 201  | —           | 正常（オーダー発行成功） |
| 400  | `VALIDATION_ERROR` | 必須項目欠落または形式不正 |
| 404  | `ENCOUNTER_NOT_FOUND` | 指定受診が存在しない |
| 409  | `ENCOUNTER_NOT_IN_PROGRESS` | 受診が IN_PROGRESS 状態でない |
| 500  | `SYSTEM_ERROR` | サーバー内部エラー |

#### 処理仕様

```
1. リクエストをバリデーションする（必須項目・形式チェック）
2. encounter-domain-service で encounterId の存在確認（存在しない場合: 404）
3. encounter の status が IN_PROGRESS であることを確認（それ以外: 409）
4. オーダーIDを UUID で発行する
5. オーダー番号（orderNo）をシーケンスで採番する
6. orders テーブルに INSERT する（status = 'PENDING'）
7. 監査ログを記録する
8. 201 を返す
```

---

### `GET /api/v1/orders/{orderId}`

**概要**: オーダーIDでオーダーを1件取得する。

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `orderId` | path | `string` | ○ | オーダーUUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

#### レスポンス

**成功時（200）**

```typescript
type OrderResponse = {
  orderId: string;
  orderNo: string;
  encounterId: string;
  orderType: 'MEDICATION' | 'TEST' | 'PROCEDURE' | 'REFERRAL';
  status: 'PENDING' | 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  itemId: string;
  quantity: number | null;
  unit: string | null;
  instruction: string | null;
  orderedBy: string;
  scheduledDate: string;
  executionRequestedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `ORDER_NOT_FOUND` | オーダーが存在しない |

---

### `GET /api/v1/encounters/{encounterId}/orders`

**概要**: 受診に紐づくオーダー一覧を取得する。

#### リクエスト（クエリパラメータ）

| 項目 | 型 | 必須 | 説明 |
| ---- | -- | :--: | ---- |
| `orderType` | `string` | × | オーダー種別フィルタ |
| `status` | `string` | × | ステータスフィルタ（カンマ区切り複数可） |

**成功時（200）**

```typescript
type OrderListResponse = {
  total: number;
  orders: OrderSummary[];
};
type OrderSummary = {
  orderId: string;
  orderNo: string;
  orderType: 'MEDICATION' | 'TEST' | 'PROCEDURE' | 'REFERRAL';
  status: 'PENDING' | 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  itemId: string;
  quantity: number | null;
  unit: string | null;
  scheduledDate: string;
  orderedBy: string;
};
```

---

### `POST /api/v1/orders/{orderId}/cancel`

**概要**: オーダーを取り消す。

#### リクエスト

```typescript
type OrderCancelRequest = {
  cancelReason: string;            // 取消理由（必須）
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `ORDER_NOT_FOUND` | オーダーが存在しない |
| 400  | `INVALID_STATUS_TRANSITION` | COMPLETED / CANCELLED からの取消は不可 |

#### 処理仕様

```
1. orderId AND tenantId でオーダーを検索する（存在しない場合: 404）
2. status が COMPLETED / CANCELLED でないことを確認（それ以外: 400）
3. status = 'CANCELLED'、cancelledAt = 現在日時、cancelReason を UPDATE する
4. 監査ログを記録する
5. 200 を返す
```

---

### `POST /api/v1/orders/{orderId}/request-execution`

**概要**: オーダーの実施を依頼する。PENDING → REQUESTED に遷移させる。

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `orderId` | path | `string` | ○ | オーダーUUID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |

リクエストボディなし。

**成功時（200）**

```typescript
type OrderRequestExecutionResponse = {
  orderId: string;
  status: 'REQUESTED';
  executionRequestedAt: string;    // ISO 8601
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `ORDER_NOT_FOUND` | オーダーが存在しない |
| 400  | `INVALID_STATUS_TRANSITION` | PENDING 以外からの実施依頼は不可 |

---

### `PATCH /api/v1/orders/{orderId}/status`

**概要**: オーダーステータスを変更する（実施系サービスからのコールバック用途）。

#### リクエスト

```typescript
type OrderStatusRequest = {
  status: 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;            // COMPLETED 時に設定（ISO 8601）
};
```

| HTTP | エラーコード | 発生条件 |
| :--: | ----------- | -------- |
| 200  | —           | 正常 |
| 404  | `ORDER_NOT_FOUND` | オーダーが存在しない |
| 400  | `INVALID_STATUS_TRANSITION` | 無効なステータス遷移 |

---

## ドメインモデル・型定義

```typescript
// orders テーブル対応
type Order = {
  orderId: string;                 // UUID PK
  orderNo: string;                 // オーダー番号（表示用）
  tenantId: string;
  encounterId: string;             // FK → encounters
  orderType: 'MEDICATION' | 'TEST' | 'PROCEDURE' | 'REFERRAL';
  status: 'PENDING' | 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  itemId: string;                  // FK → master
  quantity: number | null;
  unit: string | null;
  instruction: string | null;
  orderedBy: string;               // 医師ID
  scheduledDate: string;           // YYYY-MM-DD
  executionRequestedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
};
```

---

## 業務ルール仕様

### ステータス遷移

| 遷移元 | 遷移先 | 可否 | トリガー |
| ------ | ------ | :--: | ------- |
| `PENDING` | `REQUESTED` | ○ | 実施依頼（/request-execution） |
| `PENDING` | `CANCELLED` | ○ | 取消 |
| `REQUESTED` | `IN_PROGRESS` | ○ | 実施開始（result-domain-service 等から） |
| `REQUESTED` | `CANCELLED` | ○ | 取消 |
| `IN_PROGRESS` | `COMPLETED` | ○ | 実施完了 |
| `IN_PROGRESS` | `CANCELLED` | ○ | 取消 |
| `COMPLETED` | 任意 | × | — |
| `CANCELLED` | 任意 | × | — |

### マルチテナント境界

- tenantId が異なるオーダーは相互に参照不可

---

## エラーコード一覧

| エラーコード | HTTP | 説明 |
| ----------- | :--: | ---- |
| `ORDER_NOT_FOUND` | 404 | オーダーが存在しない |
| `ENCOUNTER_NOT_FOUND` | 404 | 指定受診が存在しない |
| `ENCOUNTER_NOT_IN_PROGRESS` | 409 | 受診が IN_PROGRESS 状態でない |
| `INVALID_STATUS_TRANSITION` | 400 | 無効なステータス遷移 |
| `VALIDATION_ERROR` | 400 | 入力値の形式不正または必須欠落 |
| `SYSTEM_ERROR` | 500 | サーバー内部エラー |
