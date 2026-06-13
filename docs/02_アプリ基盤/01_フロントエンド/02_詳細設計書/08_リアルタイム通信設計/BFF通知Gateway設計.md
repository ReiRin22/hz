# BFF 通知 Gateway 設計

> 規約: [リアルタイム通信規約.md](./リアルタイム通信規約.md) §4 の通り、通知配信は `sendNotificationToUser` / `sendNotificationToTenant` のみを使用し、ブロードキャスト配信は禁止する。

## 1. ファイル配置

| ファイル | 配置パス | 役割 |
|---|---|---|
| `notification.gateway.ts` | `bff/src/features/notification/` | WebSocket ゲートウェイ実装（Room 管理・配信制御） |

---

## 2. Gateway 仕様

### 2.1 設定

| 項目 | 値 | 説明 |
|---|---|---|
| namespace | `notifications` | 他の WebSocket 通信と名前空間を分離 |
| CORS origin | 環境変数で管理 | 本番環境ではフロントエンド URL を環境変数から取得 |

> 根拠: [ADR-3](adr/rest-websocket-separation.md)

### 2.2 公開 I/F

```typescript
/**
 * 特定ユーザーへ通知を配信する。
 *
 * @param tenantId - 配信対象のテナント ID（UUID v4）
 * @param userId - 配信対象のユーザー ID（UUID v4）
 * @param payload - 配信する通知メッセージ
 * @remarks Room 名は `{tenantId}:{userId}` 形式。テナント ID を含めることで他テナントへの誤配信を防ぐ。
 */
sendNotificationToUser(
  tenantId: string,
  userId: string,
  payload: NotificationMessageResponse
): void

/**
 * テナント全スタッフへ通知を配信する。
 *
 * @param tenantId - 配信対象のテナント ID（UUID v4）
 * @param payload - 配信する通知メッセージ
 * @remarks Room 名はテナント ID のみ。テナント単位の全員配信（緊急一斉通知等）に使用する。
 * @throws ブロードキャスト（`this.server.emit()`）は使用禁止。必ず本メソッドを経由すること。
 */
sendNotificationToTenant(
  tenantId: string,
  payload: NotificationMessageResponse
): void
```

**呼び出し例**（Backend → BFF への通知トリガー）:

```typescript
// bff/src/features/notification/notification.gateway.ts

// 個別ユーザー宛
this.sendNotificationToUser(tenantId, userId, {
  title: '検査結果が到着しました',
  message: '患者 ID: xxxxxxxx の検査結果が登録されました。',
  type: 'info',
  notificationId: randomUUID(),
  timestamp: new Date().toISOString(),
  link: { url: '/records/xxxxxxxx', label: '検査結果を確認する' },
});

// テナント全体宛
this.sendNotificationToTenant(tenantId, {
  title: 'システムメンテナンスのお知らせ',
  message: '本日 22:00〜23:00 にメンテナンスを実施します。',
  type: 'warning',
  notificationId: randomUUID(),
  timestamp: new Date().toISOString(),
});
```

---

## 3. Room 管理

### 3.1 Room 命名規則

| パターン | Room 名 | 用途 |
|---|---|---|
| ユーザー単位 | `{tenantId}:{userId}` | 特定ユーザーへの通知 |
| テナント単位 | `{tenantId}` | テナント全スタッフへの通知 |

テナント ID を Room 名に含めることで、マルチテナント環境における他テナントへのデータ流出を防ぐ。

### 3.2 複数タブ同時接続

- 同一ユーザーが複数タブで接続している場合、同一 Room 内の全接続に同時配信される
- Socket.io の Room 機能により、同一 Room 名の複数接続が自動グループ化される
- 各タブで独立した Toast 通知が表示される（制限なし）

---

## 4. ライフサイクルフック

| フック | タイミング | 処理 |
|---|---|---|
| `afterInit()` | Gateway 初期化時（サーバー起動時） | サーバー初期化ログ出力 |
| `handleConnection()` | クライアント接続時 | 接続ログ出力・JWT 認証検証（実装後） |
| `handleDisconnect()` | クライアント切断時 | 切断ログ出力（Room 退出は Socket.io が自動処理） |

JWT 認証統合（`handleConnection()` 内での検証・認証失敗時の `client.disconnect()`）は現時点で未実装。

---

## 5. マルチテナント安全性

| 仕組み | 内容 |
|---|---|
| Room 単位での通信経路分離 | テナント ID を Room 名に含め、他テナントへのデータ流出を防止 |
| JWT 認証による接続時検証 | JWT から取得した `tenantId` / `userId` のみで Room 参加を許可（実装後） |
| BFF 層での配信対象検証 | 通知送信時にテナント ID・ユーザー ID を検証し、配信対象を厳密に特定 |
