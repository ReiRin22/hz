# BFF個別詳細設計書_【REC002】シェーマ作成

## 文書概要

- **目的**: シェーマ作成機能のBFF層の設計を示す
- **対象システム／サブシステム**: 【REC002】シェーマ作成 / record-bff
- **対象範囲**
  - 本書は「【REC002】シェーマ作成」におけるBFF（record-bff）のAPI仕様を示す。
  - フロントエンド詳細設計は `docs/01_アプリ/フロントエンド/01_診療記録・診断管理/01_診療記録作成・管理/01_シェーマ作成機能/design_detail-REC002_シェーマ作成.md` を参照する。
- **用語定義**

| 用語 | 説明 |
| --- | --- |
| シェーマ | 患者の病状・処置・治療部位を視覚的に表現した図 |
| schemaUuid | シェーマを一意に識別するUUID |
| テンプレート | 部位別の背景画像（全身・頭部・腹部など） |

- **参照資料**
  - 個別機能設計書_シェーマ作成機能（design-REC002_シェーマ作成.md）
  - フロントエンド個別詳細設計書_シェーマ作成機能（design_detail-REC002_シェーマ作成.md）

---

## BFF API一覧

| API名 | HTTPメソッド | エンドポイント | 用途 |
| --- | --- | --- | --- |
| シェーマ読込 | GET | /bff/schemas/{schemaUuid} | 既存シェーマデータ取得（編集時） |
| テンプレート一覧取得 | GET | /bff/templates | テンプレート画像一覧取得 |
| シェーマ新規保存 | POST | /bff/schemas | シェーマを新規保存しカルテに添付 |
| シェーマ更新保存 | PUT | /bff/schemas/{schemaUuid} | 既存シェーマを更新保存 |

---

## BFFAPI: GET /bff/schemas/{schemaUuid}

### リクエスト

| 項目 | 説明 |
| --- | --- |
| HTTPメソッド | GET |
| エンドポイント | /bff/schemas/{schemaUuid} |
| 認証 | Bearer Token（ヘッダ: Authorization） |
| X-Correlation-ID | フロントエンドで発番したUUID（ヘッダ） |

| パラメータ | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| schemaUuid | string（path） | ○ | 取得対象のシェーマUUID |

### レスポンス（200 OK）

| フィールド | 型 | 説明 |
| --- | --- | --- |
| schemaUuid | string | シェーマUUID |
| imageData | string | Base64エンコード済み画像データ |
| createdAt | string | 作成日時（ISO 8601形式） |
| updatedAt | string | 更新日時（ISO 8601形式） |

### エラーレスポンス

| HTTPステータス | エラーコード | 説明 |
| --- | --- | --- |
| 401 | UNAUTHORIZED | 認証失敗 |
| 403 | FORBIDDEN | 権限不足 |
| 404 | NOT_FOUND | 指定のシェーマが存在しない |
| 500 | SYSTEM_ERROR | サーバー内部エラー |

---

## BFFAPI: GET /bff/templates

### リクエスト

| 項目 | 説明 |
| --- | --- |
| HTTPメソッド | GET |
| エンドポイント | /bff/templates |
| 認証 | Bearer Token（ヘッダ: Authorization） |

| パラメータ | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| category | string（query） | - | 部位カテゴリ（例: 全身、頭部、腹部）。省略時は全件取得 |
| userId | string（query） | - | お気に入り情報を含めるユーザーID |

### レスポンス（200 OK）

| フィールド | 型 | 説明 |
| --- | --- | --- |
| templates[] | array | テンプレート一覧 |
| templates[].templateId | string | テンプレートID |
| templates[].category | string | 部位カテゴリ |
| templates[].thumbnailUrl | string | サムネイル画像URL |
| templates[].imageUrl | string | 背景画像URL |
| templates[].isFavorite | boolean | お気に入り登録有無 |
| templates[].favoriteOrder | number | お気に入り表示順（お気に入り未登録時はnull） |

---

## BFFAPI: POST /bff/schemas

### リクエスト

| 項目 | 説明 |
| --- | --- |
| HTTPメソッド | POST |
| エンドポイント | /bff/schemas |
| Content-Type | application/json |
| 認証 | Bearer Token（ヘッダ: Authorization） |
| X-Correlation-ID | フロントエンドで発番したUUID（ヘッダ） |

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| patientId | string | ○ | 患者ID |
| soapId | string | ○ | 添付先のSOAP記録ID |
| imageData | string | ○ | Base64エンコード済みシェーマ画像（PNG形式） |
| cursorPosition | number | ○ | REC001のテキストカーソル位置 |

### レスポンス（201 Created）

| フィールド | 型 | 説明 |
| --- | --- | --- |
| schemaUuid | string | 新規作成されたシェーマのUUID |
| insertedAt | number | 挿入されたカーソル位置 |

### エラーレスポンス

| HTTPステータス | エラーコード | 説明 |
| --- | --- | --- |
| 400 | VALIDATION_ERROR | リクエストパラメータ不正（imageDataが空など） |
| 401 | UNAUTHORIZED | 認証失敗 |
| 403 | FORBIDDEN | 権限不足 |
| 409 | CONFLICT | 排他制御エラー（編集ロック期限切れ） |
| 500 | SYSTEM_ERROR | サーバー内部エラー |

---

## BFFAPI: PUT /bff/schemas/{schemaUuid}

### リクエスト

| 項目 | 説明 |
| --- | --- |
| HTTPメソッド | PUT |
| エンドポイント | /bff/schemas/{schemaUuid} |
| Content-Type | application/json |
| 認証 | Bearer Token（ヘッダ: Authorization） |

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| imageData | string | ○ | Base64エンコード済みシェーマ画像（PNG形式） |

### レスポンス（200 OK）

| フィールド | 型 | 説明 |
| --- | --- | --- |
| schemaUuid | string | 更新されたシェーマのUUID |
| updatedAt | string | 更新日時（ISO 8601形式） |

### エラーレスポンス

| HTTPステータス | エラーコード | 説明 |
| --- | --- | --- |
| 400 | VALIDATION_ERROR | リクエストパラメータ不正 |
| 401 | UNAUTHORIZED | 認証失敗 |
| 403 | FORBIDDEN | 権限不足 |
| 404 | NOT_FOUND | 指定のシェーマが存在しない |
| 409 | CONFLICT | 排他制御エラー |
| 500 | SYSTEM_ERROR | サーバー内部エラー |

---

## 監査ログ対象操作

| イベントID | 操作 | 監査対象 | 記録項目 |
| --- | --- | --- | --- |
| EVT_CONFIRM | POST/PUT /bff/schemas | ○ | 操作者・患者ID・schemaUuid・操作日時 |
| EVT_INIT_SCHEMA | GET /bff/schemas/{schemaUuid} | ○ | 操作者・患者ID・schemaUuid・参照日時 |
| その他 | テンプレート取得など | × | — |

---

## AI実装制約

- 本設計書はBFF層の実装を対象とする
- フロントエンド実装は `design_detail-REC002_シェーマ作成.md` に従う
- 記載のないエンドポイント・業務ロジック・例外処理は実装しない
- imageData はBase64形式（PNG）のみ受け付ける。BFF側でフォーマット検証を行う
- schemaUuid はUUID v4形式で生成する
- 全APIにX-Correlation-IDヘッダの受け取りと監査ログへの記録を実装する
