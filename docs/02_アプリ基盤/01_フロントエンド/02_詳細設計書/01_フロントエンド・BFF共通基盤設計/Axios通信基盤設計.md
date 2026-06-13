# Axios 通信基盤設計

フロントエンド `axiosClient` および BFF `bffAxiosClient` の公開 I/F・Interceptor の挙動・マルチテナント制御を定義する。

| 関連文書 | 内容 |
|---|---|
| [フロントエンド・BFF共通基盤規約.md](フロントエンド・BFF共通基盤規約.md) §3 | アプリ実装者の通信基盤利用規約 |
| [送信データ難読化基盤設計.md](送信データ難読化基盤設計.md) | Request Interceptor から呼び出される `safeObfuscate` の詳細 |
| [09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md](../09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md) | BFF エラーレスポンス（RFC 9457）の正本仕様 |
| [04_状態管理設計/状態管理規約.md](../04_状態管理設計/状態管理規約.md) | authStore / tenantStore の Store 仕様 |
| [10.BFF設計.md](../10.BFF設計.md) | BFF 側のバックエンド API 通信実装 |

---

## 1. 全体像

フロントエンド → BFF → バックエンド API の通信は、各境界で専用の Axios インスタンスが共通処理を担う。

```mermaid
sequenceDiagram
    participant FE as Frontend (features/api)
    participant FAC as axiosClient<br/>(frontend)
    participant BFF as BFF Controller
    participant BAC as bffAxiosClient<br/>(BFF)
    participant BE as Backend API

    FE->>FAC: axiosClient.get/post(...)
    FAC->>FAC: Request Interceptor<br/>(AT付与, X-Tenant-Id, 難読化)
    FAC->>BFF: HTTPS Request
    BFF->>BAC: client.get/post(...)
    BAC->>BAC: Request Interceptor<br/>(X-Tenant-Id 自動転送)
    BAC->>BE: HTTPS Request
    BE-->>BAC: Response
    BAC-->>BFF: Response
    BFF-->>FAC: Response (BffErrorResponse on error)
    FAC->>FAC: Response Interceptor<br/>(401 自動ログアウト等)
    FAC-->>FE: Response or rejection
```

---

## 2. axiosClient（フロントエンド）

### 2.1 公開 I/F

#### インポートパス

```typescript
import { axiosClient } from '@/shared/plugins/axiosClient';
import type { BffErrorResponse } from '@/shared/plugins/axiosClient';
```

#### 型シグネチャ

```typescript
/**
 * フロントエンドから BFF への通信専用 Axios インスタンス。
 *
 * @remarks
 * - Request Interceptor がアクセストークン（`Authorization: Bearer <AT>`）と
 *   `X-Tenant-Id` ヘッダーを自動付与する
 * - HttpOnly Cookie のリフレッシュトークンは `withCredentials: true` により自動送信
 * - リクエストボディは Base64 で透過的に難読化される（[送信データ難読化基盤設計.md](送信データ難読化基盤設計.md) 参照）
 * - 401 受信時は自動的に authStore をクリアしてログイン画面へ遷移する（暫定実装）
 *
 * @see {@link BffErrorResponse} - エラーレスポンスボディの型
 */
export const axiosClient: AxiosInstance;
```

```typescript
/**
 * BFF から返却される共通エラーレスポンスボディ（RFC 9457 ベース）。
 *
 * 全 HTTP ステータス（400 / 401 / 403 / 404 / 409 / 500 / 502 / 503 / 504）で
 * 同一構造で返却される。
 *
 * @see [09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md](../09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md) - 全フィールドおよび `errors[].code` の正本定義
 */
export interface BffErrorResponse {
  /** 日本語の要約（例: `"不正なリクエストです。"`） */
  title: string;
  /** HTTP ステータス（レスポンスステータスと一致） */
  status: number;
  /** 日本語の詳細メッセージ */
  detail: string;
  /** リクエストパス（例: `"/clinical/entry/vital-info"`） */
  instance: string;
  /** フィールド単位のエラー配列 */
  errors: BffErrorItem[];
  /** 追跡 ID（UUID） */
  traceId: string;
}

export interface BffErrorItem {
  /** ドット区切りパス（例: `items.0.name`）。フィールド単位エラー以外は空文字列 */
  field: string;
  /**
   * プロジェクト標準のエラーコード。
   * `REQUIRED` / `INVALID_FORMAT` / `INVALID_TYPE` / `VALIDATION_DELETE` /
   * `UNAUTHORIZED` / `FORBIDDEN` / `NOT_FOUND` / `CONFLICT` /
   * `SYSTEM_ERROR` / `BAD_GATEWAY` / `TIMEOUT` 他
   *
   * @see [09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md](../09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md) §errors[].code の一覧
   */
  code: string;
  /** ユーザー向け日本語メッセージ */
  message: string;
  /** 任意。コードごとの拡張情報（例: `CONFLICT` 時の `lockedByUserName`） */
  meta?: Record<string, unknown>;
}
```

#### インスタンス設定

| 設定項目 | 値 | 目的 |
|---|---|---|
| `baseURL` | `process.env.NEXT_PUBLIC_BFF_URL` （既定: `http://localhost:3001`） | BFF エンドポイント |
| `timeout` | `30000`（ms） | 通信タイムアウト |
| `headers` | `Content-Type: application/json` | JSON 通信を既定とする |
| `withCredentials` | `true` | HttpOnly Cookie のリフレッシュトークンを自動送信するため必須 |

### 2.2 Request Interceptor

リクエスト送信前に以下の共通処理を実行する。

| 処理 | 説明 | 実装のポイント |
|---|---|---|
| **アクセストークン付与** | `Authorization: Bearer <accessToken>` ヘッダーへ自動追加 | `useAuthStore.getState().accessToken`（メモリのみ・persist なし）から取得。詳細は [04_状態管理設計/状態管理規約.md](../04_状態管理設計/状態管理規約.md)・[adr/auth-401-stub.md](adr/auth-401-stub.md) |
| **リフレッシュトークン送信** | HttpOnly Cookie をブラウザが自動付与 | `withCredentials: true` により Cookie 同送。FE コードから RT を直接操作しない |
| **テナント ID 付与** | `X-Tenant-Id` ヘッダーへ自動追加 | `useTenantStore.getState().currentTenantId` から取得 |
| **送信データ難読化** | リクエストボディを Base64 エンコード（オプション） | `safeObfuscate` で `{ payload, _obfuscated: true }` 構造へ変換。GET は対象外。詳細は [送信データ難読化基盤設計.md](送信データ難読化基盤設計.md) |

### 2.3 Response Interceptor

BFF からのエラーレスポンスは全 HTTP ステータスで共通フォーマット（`BffErrorResponse`）。`errors[].code` および完全な定義は [09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md](../09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md) を参照。

| HTTP ステータス | 主な `errors[].code` | 期待される挙動 | 実装場所 |
|---|---|---|---|
| **400 Bad Request** | `REQUIRED` / `INVALID_FORMAT` / `INVALID_TYPE` / `VALIDATION_DELETE` / 機能固有コード | レスポンスボディの `errors[]` を呼び出し側に渡し、エラーダイアログを表示 | 呼び出し側（features 層） |
| **401 Unauthorized** | `UNAUTHORIZED` | 暫定: `useAuthStore.clearAuth()` ＋ `window.location.href = '/login'`。本来: RT による AT 自動再発行 → リトライ → 再失敗時のみログアウト | Interceptor 自動処理（暫定）。> 根拠: [adr/auth-401-stub.md](adr/auth-401-stub.md) |
| **403 Forbidden** | `FORBIDDEN` | 権限エラーダイアログ（持続的モーダル）を表示 | Interceptor 自動処理 |
| **404 Not Found** | `NOT_FOUND` | エラーオブジェクトを返し、呼び出し側でデータ取得エラーダイアログ表示 | 呼び出し側 |
| **409 Conflict** | `CONFLICT` | `errors[0].meta.lockedByUserName` の有無に応じて同時編集エラーダイアログを表示 | 呼び出し側 |
| **500** | `SYSTEM_ERROR` | エラーモーダルを表示 | Interceptor 自動処理 |
| **502** | `BAD_GATEWAY` | エラーモーダルを表示 | Interceptor 自動処理 |
| **504** | `TIMEOUT` | エラーモーダルを表示 | Interceptor 自動処理 |
| その他 | - | 「通信エラーが発生しました」トースト表示 | Interceptor 自動処理 |

正常レスポンスは加工せずそのまま呼び出し側へ返却する。

### 2.4 使用例（features 層）

```typescript
// frontend/src/features/clinical/patients/list/api/patient.api.ts
import { axiosClient } from '@/shared/plugins/axiosClient';
import type { BffErrorResponse } from '@/shared/plugins/axiosClient';
import type { PatientResponse } from '@/front_bff_shared/features/clinical/patients/list/types/responses/patient.response';
import { isAxiosError } from 'axios';

/** @throws 400/404/409 等は呼び出し側で error.response.data（BffErrorResponse）を参照する */
export async function fetchPatient(id: string): Promise<PatientResponse> {
  const response = await axiosClient.get<PatientResponse>(`/api/patients/${id}`);
  return response.data;
}

// 呼び出し側でのエラー処理例
try {
  const patient = await fetchPatient(id);
} catch (error) {
  if (isAxiosError<BffErrorResponse>(error) && error.response?.status === 404) {
    const errorBody = error.response.data;
  }
}
```

> 実装ガイドライン（Do/Don't）は [フロントエンド・BFF共通基盤規約.md](フロントエンド・BFF共通基盤規約.md) §3.1 に集約。

---

## 3. マルチテナント制御

すべての BFF 通信において、論理的なデータ分離を厳格に担保する。

### 3.1 テナント ID の伝搬経路

```mermaid
sequenceDiagram
    participant Login as ログイン処理
    participant TS as useTenantStore
    participant FAC as axiosClient
    participant BFF as BFF
    participant BAC as bffAxiosClient
    participant BE as Backend API

    Login->>TS: setTenantId(tenantId)
    Note over FAC: ユーザー操作で API 呼び出し
    FAC->>TS: getState().currentTenantId
    TS-->>FAC: tenantId
    FAC->>BFF: X-Tenant-Id: tenant-001
    BFF->>BFF: RequestContext へ保存
    BFF->>BAC: client.get(...)
    BAC->>BFF: RequestContext から取得
    BAC->>BE: X-Tenant-Id: tenant-001（自動転送）
```

### 3.2 テナント ID の保持

`tenantStore` の詳細実装（persist 採否・LocalStorage キー・partialize 設定）は [04_状態管理設計/状態管理規約.md](../04_状態管理設計/状態管理規約.md) §6 および 04 章「残件 #5 tenantId の保持方式」を参照。認証基盤連携サービス詳細設計確定後に確定する。

> persist を採用する場合の LocalStorage キーは `harz:tenant`（04 章「LocalStorageキー命名規則」に準拠）。

### 3.3 自動付与の動作

axiosClient の Request Interceptor がすべての BFF 宛リクエストに `X-Tenant-Id` ヘッダーを自動付与する。

```http
GET /api/patients/12345 HTTP/1.1
Host: localhost:3001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Tenant-Id: tenant-001
Content-Type: application/json
```

### 3.4 BFF 側の検証

BFF は受信した `X-Tenant-Id` を JWT クレーム等と突き合わせて不正リクエストを拒否する。詳細は [10.BFF設計.md](../10.BFF設計.md) を参照。

---

## 4. bffAxiosClient（BFF 実装者向け）

BFF からバックエンド API への通信を担う Axios インスタンス。

### 4.1 公開 I/F

#### インポートパス

```typescript
// bff/src/features/{LV1}/{LV2}/{LV3}/clients/{機能名}.client.ts
import { bffAxiosClient } from '@/shared/plugins/bffAxiosClient';
```

#### 型シグネチャ

```typescript
/**
 * BFF からバックエンド API への通信専用 Axios インスタンス。
 *
 * @remarks
 * - Request Interceptor が `RequestContext` から `X-Tenant-Id` を取得して自動転送する
 * - フロントエンドから受け取ったテナント ID がバックエンド API に漏れなく付与される
 * - Client / Service 層で `tenantId` を引数として取り回す必要は無い
 *
 * @throws バックエンド API のエラーは BFF 側で `BffErrorResponse` 形式へマッピングしてフロントへ返却する（[09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md](../09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md) 参照）
 */
export const bffAxiosClient: AxiosInstance;
```

### 4.2 RequestContext によるテナント ID 自動転送

| 項目 | 内容 |
|---|---|
| **インスタンス共通化** | BFF の全 Client は `bffAxiosClient` を使用する。個別に `axios.create()` しない |
| **テナント ID 自動転送** | Request Interceptor が `RequestContext` から `X-Tenant-Id` を取り出し、バックエンド API へのリクエストヘッダーに自動付与する |
| **RequestContext** | NestJS のリクエストスコープ機構。フロントエンドからのリクエストヘッダーをリクエスト単位で保持する仕組み |

### 4.3 使用例（BFF Client 層）

```typescript
// bff/src/features/clinical/patients/list/clients/patient.client.ts
import { Injectable } from '@nestjs/common';
import { bffAxiosClient } from '@/shared/plugins/bffAxiosClient';

@Injectable()
export class PatientClient {
  /** X-Tenant-Id は bffAxiosClient が RequestContext から自動転送する */
  async fetchPatient(id: string) {
    const response = await bffAxiosClient.get(`/patients/${id}`);
    return response.data;
  }
}
```

> 実装ガイドライン（Do/Don't）は [フロントエンド・BFF共通基盤規約.md](フロントエンド・BFF共通基盤規約.md) §3.4 に集約。BFF 実装の詳細パターンは [10.BFF設計.md](../10.BFF設計.md) を参照。
