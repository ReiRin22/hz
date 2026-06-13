# BFF設計規約

フロントエンド専用バックエンド（BFF）の **アプリ実装チームが守るべき規約** を定義する。

| 関連文書 | 内容 |
|---|---|
| [BFF三層アーキテクチャ設計.md](BFF三層アーキテクチャ設計.md) | Controller / Service / Client の I/F・3通信パターン・型境界 |
| [認証ガード基盤設計.md](認証ガード基盤設計.md) | `AuthGuard` の公開 I/F・適用方法 |
| [エラーハンドリング統合設計.md](エラーハンドリング統合設計.md) | `ZodExceptionFilter` / `HttpExceptionFilter` の配線・捕捉対象 |

外部リファレンス:

| 関連文書 | 内容 |
|---|---|
| [00.ディレクトリ構成.md](../00.ディレクトリ構成.md) | BFF 配下のディレクトリ階層 |
| [01_フロントエンド・BFF共通基盤設計/Axios通信基盤設計.md](../01_フロントエンド・BFF共通基盤設計/Axios通信基盤設計.md) | フロント↔BFF 間の Axios・テナントID 自動付与 |
| [01_フロントエンド・BFF共通基盤設計/送信データ難読化基盤設計.md](../01_フロントエンド・BFF共通基盤設計/送信データ難読化基盤設計.md) | 受信データ復号ミドルウェアの配線 |
| [03_TypeScript型管理/TypeScript型管理規約.md](../03_TypeScript型管理/TypeScript型管理規約.md) | `front_bff_shared` の型・Zod スキーマ管理 |
| [09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md](../09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md) | BFF エラーレスポンス統一フォーマット |

---

## 1. 採用技術と配置

| カテゴリ | 採用技術 |
|---|---|
| 実行環境 | Node.js |
| フレームワーク | NestJS |
| 実行ツール | tsx |
| 通信 | Axios |

> 採用根拠は [01_フロントエンド・BFF共通基盤設計/技術スタック設計.md](../01_フロントエンド・BFF共通基盤設計/技術スタック設計.md) を参照。

### 1.1 配置ルール

| 規約 | 内容 |
|---|---|
| ✅ 必須 | `features/` 配下は フロントエンドと同じ LV1/LV2/LV3 の3階層構成に準拠する |
| ✅ 必須 | Controller・Service・Client・Module は同一ディレクトリに配置する |
| ✅ 必須 | バックエンドAPIとの通信に使う型（`*.api.request.ts` / `*.api.response.ts`）は BFF 内部の `types/` に配置する |
| ✅ 必須 | フロントエンドと共有する型（Request/Response型・Zod スキーマ）は `front_bff_shared/` に配置する |
| ⛔ 禁止 | `front_bff_shared` と BFF 内部の `types/` を混在させる（バックエンドAPI 型がフロントへ漏れる） |

> ディレクトリ階層の詳細は [BFF三層アーキテクチャ設計.md §1](BFF三層アーキテクチャ設計.md#1-ディレクトリ構造) を参照。

---

## 2. 基盤 I/F 利用規約（最重要）

> 基盤が提供する I/F を **経由しない実装は禁止する**。バイパス実装はマルチテナント間データ混入・エラーレスポンス不整合・認証バイパスを引き起こす。

### 2.1 必ず経由する I/F とバイパス禁止 API

| 用途 | ✅ 経由必須 I/F | ⛔ バイパス禁止 | 詳細 |
|---|---|---|---|
| バックエンド API への HTTP 通信 | `bffAxiosClient` を Client 層から呼ぶ | `axios.get` / `fetch` の直接利用、独自 axios インスタンス生成 | [BFF三層アーキテクチャ設計.md §3.3](BFF三層アーキテクチャ設計.md#33-client実装パターン) |
| 認証ヘッダー検証・テナントID 照合 | `@UseGuards(AuthGuard)` を Controller / メソッドに付与 | `request.headers.authorization` の直接読み取り、`X-Tenant-Id` の個別検証 | [認証ガード基盤設計.md §2](認証ガード基盤設計.md#2-公開-if) |
| バリデーションエラー応答 | Controller で Zod `parse()` を呼ぶ（`ZodExceptionFilter` がグローバル変換） | エラーレスポンスを各 Controller / Service で組み立てる | [エラーハンドリング統合設計.md §3](エラーハンドリング統合設計.md#3-zodexceptionfilter) |
| 業務エラー応答 | Service で `HttpException` 系（`BusinessException`・`UnauthorizedException` 等）を throw | レスポンス Body の手組み・`res.status().json()` 直書き | [エラーハンドリング統合設計.md §4](エラーハンドリング統合設計.md#4-httpexceptionfilter) |
| Controller / Service 間の型 | `front_bff_shared/.../requests`・`.../responses` | BFF 独自定義の重複型を引数・戻り値に使う | [03_TypeScript型管理/TypeScript型管理規約.md](../03_TypeScript型管理/TypeScript型管理規約.md) |
| バックエンド API レスポンスの整形先 | Service 層で `front_bff_shared/.../responses` の型に整形 | バックエンド DTO（`*.api.response.ts`）をそのまま Controller / フロントへ返す | [BFF三層アーキテクチャ設計.md §4.2](BFF三層アーキテクチャ設計.md#42-viewmodelへのマッピング) |

### 2.2 例外

| ケース | 条件 |
|---|---|
| 基盤チーム実装 | 本規約の対象外（基盤 I/F の実装側） |
| プロトタイプ・検証コード | 本番投入前に基盤 I/F 経由へ移すこと |

### 2.3 PR レビュー観点（grep ターゲット）

| 観点 | チェック内容 |
|---|---|
| 直接 axios 利用 | `import axios from 'axios'` が Client 層以外、または `bffAxiosClient` 以外で出ていないか |
| AuthGuard 漏れ | Controller で `@UseGuards(AuthGuard)` が付いていないメソッドが無いか（公開エンドポイント以外） |
| 生 DTO 返却 | Service の戻り値型に `*ApiResponse`（バックエンド生 DTO 型）が露出していないか |
| エラー手組み | `res.status(` / `response.json(` が Controller / Service に無いか |
| 認証ヘッダー直接参照 | `request.headers.authorization` / `request.headers['x-tenant-id']` の直接アクセスが無いか（`AuthGuard` 内部以外） |

---

## 3. 三層アーキテクチャの責務

| レイヤー | 責務 | やってはいけないこと |
|---|---|---|
| **Controller** | エンドポイント定義（Routing）、リクエスト情報の抽出（Params/Query/Body）、Service の呼び出しとレスポンス返却 | ビジネスロジックの実装、データ整形 |
| **Service** | 複数 API の呼び出し順序制御（オーケストレーション）、生データの ViewModel への変換、エラーハンドリング | バックエンド API への直接通信 |
| **Client** | バックエンド API への HTTP 通信（`bffAxiosClient` を使用） | ビジネスロジックの実装、データ整形 |

> 各レイヤーの実装パターンは [BFF三層アーキテクチャ設計.md §3](BFF三層アーキテクチャ設計.md#3-実装パターン) を参照。

---

## 4. デコレーター利用規約

| 規約 | 内容 |
|---|---|
| ✅ 必須 | NestJS 標準デコレーター（`@Controller` / `@Injectable` / `@Module` / `@Get` 等）のみを使用する |
| ✅ 必須 | 認証が必要なエンドポイントは `@UseGuards(AuthGuard)` を Controller クラスまたはメソッドに付与する |
| ⛔ 禁止 | デコレーターを使わず手動でルーティング・DI 登録を行う |
| ⛔ 禁止 | カスタムデコレーターを作成する |

> 採用根拠は [adr/no-custom-decorator.md](adr/no-custom-decorator.md) を参照。
> 使用するデコレーター一覧は [BFF三層アーキテクチャ設計.md §2.1](BFF三層アーキテクチャ設計.md#21-使用するデコレーター一覧) を参照。

---

## 5. ViewModel マッピング規約

| 規約 | 内容 |
|---|---|
| ✅ 必須 | バックエンド API の生データ（`*ApiResponse`）は Service で `front_bff_shared` の Response 型に整形して返す |
| ✅ 必須 | 敬称付与・日付フォーマット・数値計算・条件分岐は Service 層で行う |
| ✅ 必須 | 変換後のプロパティ名は UI 上の役割が伝わる名称（`displayName`・`formattedDate`・`isWarning` 等）にする |
| ✅ 必須 | バックエンドからのデータが欠落している場合、BFF 側で初期値を埋めて返す（フロントで `?? 'なし'` を書かせない）|
| ⛔ 禁止 | バックエンド API の生データ（DTO）をフロントエンドへそのまま返却する |
| ⛔ 禁止 | フロント側で日付フォーマット・敬称付与・年代計算等の装飾ロジックを書く |

> マッピングパターン例は [BFF三層アーキテクチャ設計.md §4.2](BFF三層アーキテクチャ設計.md#42-viewmodelへのマッピング) を参照。
> BFF 側で行う根拠は [adr/view-model-mapping-on-bff.md](adr/view-model-mapping-on-bff.md) を参照。

---

## 6. パフォーマンス・並列化

| 規約 | 内容 |
|---|---|
| ✅ 必須 | 独立した複数のバックエンド API 呼び出しは `Promise.all` で並列化する |
| ✅ 必須 | Client へのパラメータ渡しはオブジェクト形式（`{ targetId, ... }`）を標準とする |

> 実装例は [BFF三層アーキテクチャ設計.md §4.1](BFF三層アーキテクチャ設計.md#41-並列データ取得aggregator) を参照。

---

## 7. ファイル命名規則

| ファイル種別 | 命名パターン（ローワーキャメル） | 例 |
|---|---|---|
| Controller | `(機能名).controller.ts` | `userDetail.controller.ts` |
| Service | `(機能名).service.ts` | `userDetail.service.ts` |
| Client | `(機能名).client.ts` | `userDetail.client.ts` |
| Module | `(機能名).module.ts` | `userDetail.module.ts` |
| バックエンドAPI 向けリクエスト型 | `(機能名).api.request.ts` | `userDetail.api.request.ts` |
| バックエンドAPI 向けレスポンス型 | `(機能名).api.response.ts` | `userDetail.api.response.ts` |
| BFF 内部型 | `(機能名).type.ts` | `userDetail.type.ts` |

---

## 8. アプリ実装チームの責務サマリ

| カテゴリ | 責務 | 経由必須 I/F | 参照する基盤 |
|---|---|---|---|
| 基盤 I/F の利用 | バイパス実装をしない（§2 が最優先） | §2.1 の表 | §2 |
| Controller 実装 | リクエスト抽出と Service 呼び出しのみ。`@UseGuards(AuthGuard)` を必ず付与 | `AuthGuard` | [認証ガード基盤設計.md](認証ガード基盤設計.md) |
| Service 実装 | 複数 Client の `Promise.all` 並列呼び出し → ViewModel 整形。エラーは `HttpException` 系を throw | `bffAxiosClient`（Client 経由）/ `front_bff_shared` の Response 型 | [BFF三層アーキテクチャ設計.md](BFF三層アーキテクチャ設計.md) |
| Client 実装 | `bffAxiosClient` で HTTP 通信のみ。受け取り型は `*.api.response.ts` | `bffAxiosClient` | [BFF三層アーキテクチャ設計.md §3.3](BFF三層アーキテクチャ設計.md#33-client実装パターン) |
| バリデーション | Controller で Zod `parse()` を呼ぶ。`ZodExceptionFilter` が 400 に変換 | Zod スキーマ（`front_bff_shared`）| [エラーハンドリング統合設計.md](エラーハンドリング統合設計.md) |
| エラー応答 | 業務エラーは `BusinessException` 等を throw。`HttpExceptionFilter` が統一フォーマットへ変換 | `HttpException` 派生 | [エラーハンドリング統合設計.md §4](エラーハンドリング統合設計.md#4-httpexceptionfilter) |
| 型管理 | Request / Response は必ず `front_bff_shared` を使用 | `front_bff_shared` | [03_TypeScript型管理/TypeScript型管理規約.md](../03_TypeScript型管理/TypeScript型管理規約.md) |
