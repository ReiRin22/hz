# Payload 型定義設計

> 規約: [リアルタイム通信規約.md](./リアルタイム通信規約.md) §2.1 の通り、受信 Payload のバリデーションは `notificationMessageSchema` 経由とする。

## 1. ファイル配置

| ファイル | 配置パス | 役割 |
|---|---|---|
| `join-room.request.ts` | `front_bff_shared/features/notification/realtime/types/requests/` | Room 参加リクエストの型定義 |
| `join-room.schema.ts` | `front_bff_shared/features/notification/realtime/schemas/` | Room 参加リクエストの Zod スキーマ |
| `notification-message.response.ts` | `front_bff_shared/features/notification/realtime/types/responses/` | 通知メッセージの型定義 |
| `notification-message.schema.ts` | `front_bff_shared/features/notification/realtime/schemas/` | 通知メッセージの Zod スキーマ |

フロントエンド・BFF 間の共有型は `front_bff_shared` に配置し、シンボリックリンクで参照する。

---

## 2. ディレクトリ構造

```
front_bff_shared/
└── features/
    └── notification/
        └── realtime/
            ├── types/
            │   ├── requests/
            │   │   └── join-room.request.ts
            │   └── responses/
            │       └── notification-message.response.ts
            └── schemas/
                ├── join-room.schema.ts
                └── notification-message.schema.ts
```

---

## 3. 公開 I/F

### 3.1 `NotificationMessageResponse` 型

```typescript
import type { NotificationMessageResponse } from '@front_bff_shared/features/notification/realtime/types/responses/notification-message.response';

/**
 * BFF からフロントエンドへ配信される通知メッセージの型。
 *
 * @remarks
 * - `notificationId` は UUID v4 形式。重複受信の防止と既読管理に使用する。
 * - `timestamp` は ISO 8601 形式（例: `2024-01-15T09:30:00.000Z`）。
 * - `link` は省略可能。設定された場合、トースト内にリンクボタンを表示する。
 */
interface NotificationMessageResponse {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  notificationId: string; // UUID v4
  timestamp: string;      // ISO 8601
  link?: {
    url: string;
    label: string;
  };
}
```

### 3.2 `notificationMessageSchema`

```typescript
import { notificationMessageSchema } from '@front_bff_shared/features/notification/realtime/schemas/notification-message.schema';

/**
 * 受信した通知 Payload を NotificationMessageResponse 型としてバリデーションする。
 *
 * @param data - Socket.io の 'message' イベントで受信した未検証データ
 * @returns バリデーション済みの NotificationMessageResponse
 * @throws {ZodError} - Payload のフィールドが型に適合しない場合
 *
 * @remarks
 * バリデーション失敗時は呼び出し元でキャッチしてサイレントフェイルとすること。
 * ユーザーへの通知は不要（コンソールログのみ）。
 */
// 使用例
try {
  const notification = notificationMessageSchema.parse(rawData);
  addNotification(notification);
} catch {
  console.error('[useNotification] Invalid notification payload', rawData);
}
```

### 3.3 `JoinRoomRequest` 型

```typescript
import type { JoinRoomRequest } from '@front_bff_shared/features/notification/realtime/types/requests/join-room.request';

/**
 * フロントエンドが接続時に BFF へ送信する Room 参加リクエストの型。
 *
 * @remarks
 * - `userId` と `tenantId` は認証ストア（`useAuthStore`）から取得する。
 * - BFF はこの値を用いて `{tenantId}:{userId}` 形式の Room 名を生成する。
 * - クライアントから Room 名を直接指定することはできない（なりすまし防止）。
 */
interface JoinRoomRequest {
  userId: string;   // UUID v4
  tenantId: string; // UUID v4
}
```

**呼び出し例**:

```typescript
// useNotification フック内（connect イベント時）
socket.emit('join-room', { userId, tenantId } satisfies JoinRoomRequest);
```

### 3.4 `joinRoomRequestSchema`

```typescript
import { joinRoomRequestSchema } from '@front_bff_shared/features/notification/realtime/schemas/join-room.schema';

/**
 * JoinRoomRequest を BFF 側でバリデーションする Zod スキーマ。
 *
 * @param data - 'join-room' イベントで受信した未検証データ
 * @returns バリデーション済みの JoinRoomRequest
 * @throws {ZodError} - userId / tenantId が UUID 形式でない場合
 */
```

---

## 4. 型シグネチャ一覧（Quick Reference）

| 型・スキーマ | インポートパス | 用途 |
|---|---|---|
| `NotificationMessageResponse` | `@front_bff_shared/features/notification/realtime/types/responses/notification-message.response` | 受信通知の型 |
| `notificationMessageSchema` | `@front_bff_shared/features/notification/realtime/schemas/notification-message.schema` | 受信 Payload バリデーション |
| `JoinRoomRequest` | `@front_bff_shared/features/notification/realtime/types/requests/join-room.request` | Room 参加リクエストの型 |
| `joinRoomRequestSchema` | `@front_bff_shared/features/notification/realtime/schemas/join-room.schema` | BFF 側バリデーション |
