# フロントエンド・BFF 共通基盤規約

フロントエンドおよび BFF（Backend For Frontend）が共通で利用する基盤の上で **アプリ実装チームが守るべき規約** を定義する。

| 関連文書 | 内容 |
|---|---|
| [技術スタック設計.md](技術スタック設計.md) | 採用技術一覧・バージョン・ロードマップ |
| [Axios通信基盤設計.md](Axios通信基盤設計.md) | axiosClient / bffAxiosClient の I/F、Interceptor、マルチテナント |
| [送信データ難読化基盤設計.md](送信データ難読化基盤設計.md) | safeObfuscate / decryption.middleware の I/F・処理フロー |
| [03.TypeScript型管理とスキーマ共有.md](../03.TypeScript型管理とスキーマ共有.md) | front_bff_shared 配下の共有型定義・Zod スキーマ・i18n リソース |
| [00.ディレクトリ構成.md](../00.ディレクトリ構成.md) | モノレポのディレクトリ責務 |

---

## 1. 用語と適用範囲

| 用語 | 定義 |
|---|---|
| 基盤チーム | 本章のサブファイル群および 16 章「アプリ基盤実装コード一覧」に登録された実装ファイルを管理するチーム |
| アプリ実装者 | 業務機能（features 層）を実装するチーム。本規約の遵守対象 |
| 公開 I/F | アプリ実装者が直接 import / 呼び出しする型・関数・クライアント |

本規約は **アプリ実装者の遵守事項** を定義する。基盤チームの実装そのものは本規約の対象外。

---

## 2. 基盤 I/F 利用規約（最重要）

> 基盤が提供する I/F を **経由しない実装は禁止する**。バイパス実装はテナント間データ混入・認証ヘッダー欠落・データ難読化漏れ・エラーハンドリング不整合を引き起こす。

### 2.1 必ず経由する I/F とバイパス禁止 API

| 用途 | ✅ 経由必須 I/F | ⛔ バイパス禁止 | 詳細 |
|---|---|---|---|
| BFF 通信（フロントエンド） | `axiosClient`（`@/shared/plugins/axiosClient`） | `axios.create()` 個別生成、`fetch()` 直接呼び出し、別 baseURL の Axios インスタンス | [Axios通信基盤設計.md](Axios通信基盤設計.md) §2 |
| バックエンド API 通信（BFF） | `bffAxiosClient`（`@/shared/plugins/bffAxiosClient`、BFF 側） | `axios.create()` 個別生成、Service／Client 層で `tenantId` を引数に取り回す | [Axios通信基盤設計.md](Axios通信基盤設計.md) §4 |
| 共有型・Zod スキーマ | `front_bff_shared/features/**/{types,schemas}/` から import | フロントとBFFで型を別個に定義、独自 Zod スキーマで FE のみ検証 | [03.TypeScript型管理とスキーマ共有.md](../03.TypeScript型管理とスキーマ共有.md) |
| メッセージリソース | `front_bff_shared/i18n/` の JSON＋型推論経由 | UI 文言・バリデーションメッセージのコード内直書き | [03.TypeScript型管理とスキーマ共有.md](../03.TypeScript型管理とスキーマ共有.md) |
| 送信データ難読化 | `axiosClient` の Request Interceptor 経由（自動付与） | `axios.create()` で別インスタンスを作って難読化を回避 | [送信データ難読化基盤設計.md](送信データ難読化基盤設計.md) |

### 2.2 例外

| ケース | 条件 |
|---|---|
| プロトタイプ・検証コード | 本番投入前に基盤 I/F 経由へ移すこと |
| 基盤チームによる基盤実装 | 本規約の対象外（基盤 I/F の実装側） |
| 外部 SaaS との直接通信 | BFF 経由が原則。やむを得ず FE 直接通信する場合は機能設計書に根拠を明記 |

### 2.3 PR レビュー観点

| 観点 | grep ターゲット |
|---|---|
| Axios 個別生成 | `axios\.create\(` （`shared/plugins/` 配下を除く） |
| fetch 直接呼び出し | `fetch\(` （`features/**/api/` 配下で `import { axiosClient }` が無い場合）|
| メッセージ直書き | UI ラベル・エラー文言の日本語文字列直書き（`features/**` 配下） |
| 共有契約バイパス | フロントエンド独自の Request/Response 型定義（`front_bff_shared` を経由しない型） |

---

## 3. 通信基盤の利用規約

### 3.1 axiosClient（フロントエンド）

| 規約 | 内容 |
|---|---|
| ✅ 必須 | features 層の `api/{機能名}.api.ts` で `import { axiosClient } from '@/shared/plugins/axiosClient'` |
| ✅ 必須 | レスポンス型は `front_bff_shared/features/**/types/responses/` から import |
| ✅ 必須 | エラー型は `BffErrorResponse`（[Axios通信基盤設計.md](Axios通信基盤設計.md) §2.3）で受ける |
| ⛔ 禁止 | `axios.create()` で別インスタンスを作る |
| ⛔ 禁止 | `fetch()` 直接呼び出し |
| ⛔ 禁止 | Interceptor 内で機能固有のビジネスロジックを実装する（責務肥大化） |

### 3.2 認証情報の取り扱い

詳細は [04_状態管理設計/状態管理規約.md](../04_状態管理設計/状態管理規約.md) §2.1（認証情報の保持）に従う。本規約では axiosClient との関係のみ規定する。

| 規約 | 内容 |
|---|---|
| ✅ 必須 | アクセストークンの取得は `useAuthStore.getState().accessToken` 経由（axiosClient の Request Interceptor が自動取得） |
| ✅ 必須 | リフレッシュトークンは HttpOnly Cookie。`withCredentials: true` の設定により自動送信される |
| ⛔ 禁止 | アクセストークン／リフレッシュトークンを LocalStorage / SessionStorage / Cookie に手動保存 |
| ⛔ 禁止 | features 層から直接 `Authorization` ヘッダーを設定する |

### 3.3 マルチテナント制御

| 規約 | 内容 |
|---|---|
| ✅ 必須 | `X-Tenant-Id` ヘッダーは axiosClient の Request Interceptor が `useTenantStore` から取得し自動付与する |
| ✅ 必須 | クエリキー第 1 階層に `tenantId` を含める（[04_状態管理設計/クエリキー基盤設計.md](../04_状態管理設計/クエリキー基盤設計.md) 参照） |
| ⛔ 禁止 | features 層から直接 `X-Tenant-Id` ヘッダーを設定する |
| ⛔ 禁止 | tenantId を URL クエリパラメータやリクエストボディに重複付与する |

### 3.4 BFF → バックエンド API（BFF 実装者向け）

| 規約 | 内容 |
|---|---|
| ✅ 必須 | BFF の Client 層は `bffAxiosClient`（`@/shared/plugins/bffAxiosClient`）を使う |
| ✅ 必須 | `RequestContext`（NestJS リクエストスコープ）から `X-Tenant-Id` を取得し、Interceptor が自動転送する |
| ⛔ 禁止 | Client/Service 層で `tenantId` を引数として手動で取り回す |
| ⛔ 禁止 | `axios.create()` で個別インスタンスを生成する |

---

## 4. エラーハンドリング規約

詳細は [09_監視エラーハンドリング設計/](../09_監視エラーハンドリング設計/監視エラーハンドリング規約.md) を参照。本規約では axiosClient との接続点のみ規定する。

| HTTP ステータス | 期待される処理 | 実装場所 |
|---|---|---|
| 400 / 404 / 409 | `error.response.data`（`BffErrorResponse`）を呼び出し側で受け取り、フォームエラー表示・ダイアログ表示等の機能固有処理 | features 層（呼び出し側） |
| 401 | 暫定: axiosClient が `useAuthStore.clearAuth()` ＋ ログイン画面遷移を自動実行 | axiosClient（[Axios通信基盤設計.md](Axios通信基盤設計.md) §2.3） |
| 403 / 5xx | axiosClient が共通トースト表示を自動実行。features 層で追加処理は不要 | axiosClient |

> 401 の本来実装（RT による AT 自動再発行）は認証基盤連携サービス詳細設計確定後に確定する。詳細は [04_状態管理設計/状態管理規約.md](../04_状態管理設計/状態管理規約.md)・[adr/auth-401-stub.md](adr/auth-401-stub.md) を参照。

---

## 5. ライブラリ・バージョン管理規約

| 規約 | 内容 |
|---|---|
| ✅ 必須 | 依存追加・更新は `package.json` の `^X.0.0` 形式で記載（メジャー固定・マイナー以下は `npm update` で自動追随） |
| ✅ 必須 | 採用ライブラリ・バージョンは [技術スタック設計.md](技術スタック設計.md) §1 の表に追加 |
| ⛔ 禁止 | 採用済みライブラリと役割が重複する別ライブラリの導入（例: 別の HTTP クライアント、別の状態管理ライブラリ） |
| ⛔ 禁止 | メジャーバージョンを跨ぐ更新を機能設計書のレビュー無しに行う |

---

## 6. ディレクトリ・ファイル配置規約

詳細は [00.ディレクトリ構成.md](../00.ディレクトリ構成.md) を参照。本章スコープの抜粋を以下に示す。

| 配置先 | 配置内容 |
|---|---|
| `frontend/src/shared/plugins/` | 共通通信クライアント（`axiosClient.ts` 等の基盤実装）。**アプリ実装者は新規作成しない** |
| `frontend/src/features/{LV1}/{LV2}/{LV3}/api/` | 機能固有の API 呼び出しファイル。`axiosClient` を import して使う |
| `bff/src/shared/plugins/` | BFF 共通通信クライアント（`bffAxiosClient.ts` 等） |
| `bff/src/features/{LV1}/{LV2}/{LV3}/clients/` | バックエンド API への Client。`bffAxiosClient` を import して使う |
| `front_bff_shared/features/{LV1}/{LV2}/{LV3}/types/` | Request/Response 型定義（FE/BFF 共有） |
| `front_bff_shared/features/{LV1}/{LV2}/{LV3}/schemas/` | Zod スキーマ（FE/BFF 共有） |
| `front_bff_shared/i18n/` | UI 文言・バリデーションメッセージリソース |

---

## 7. アプリ実装チームの責務サマリ

| カテゴリ | 責務 | 経由必須 I/F | 参照する基盤 |
|---|---|---|---|
| 基盤 I/F の利用 | バイパス実装をしない（§2 が最優先） | §2.1 の表 | §2 |
| BFF 通信 | features 層の api/ ファイルで axiosClient を使用 | `axiosClient` | §3.1、[Axios通信基盤設計.md](Axios通信基盤設計.md) §2 |
| 認証ヘッダー | 自動付与に任せる。手動で Authorization 設定しない | `axiosClient`（自動） | §3.2、[04_状態管理設計/状態管理規約.md](../04_状態管理設計/状態管理規約.md) |
| マルチテナント | 自動付与に任せる。tenantId を引数で取り回さない | `axiosClient`（自動）、`useTenantStore` | §3.3、[Axios通信基盤設計.md](Axios通信基盤設計.md) §3 |
| エラー処理 | 機能固有エラー（400/404/409）のみ呼び出し側で処理 | `BffErrorResponse` 型 | §4、[09_監視エラーハンドリング設計/](../09_監視エラーハンドリング設計/監視エラーハンドリング規約.md) |
| 共有契約 | front_bff_shared から型・スキーマ・メッセージを import | `front_bff_shared/features/**`、`front_bff_shared/i18n/` | §2.1、[03.TypeScript型管理とスキーマ共有.md](../03.TypeScript型管理とスキーマ共有.md) |
| ライブラリ追加 | 既存採用との役割重複を避け、機能設計書に明記 | — | §5、[技術スタック設計.md](技術スタック設計.md) |
