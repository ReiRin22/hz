# BFF エラーレスポンス設計

BFF からフロントエンドへ返却される全エラーレスポンス（バリデーション失敗・認証/認可エラー・排他競合・システム障害等）の共通構造とエラーコード体系を定義する。

| 関連文書 | 内容 |
|---|---|
| [監視エラーハンドリング規約.md](監視エラーハンドリング規約.md) | アプリ実装が守る規約 |
| [エラー処理基盤設計.md](エラー処理基盤設計.md) | エラー処理フロー・errorClassifier |
| [GlitchTip連携設計.md](GlitchTip連携設計.md) | Sentry SDK 初期化 |

---

## 1. 方針

すべての BFF エラーレスポンスは [RFC 9457 (Problem Details for HTTP APIs)](https://www.rfc-editor.org/rfc/rfc9457.html) に準拠する。プロジェクト要件として以下のローカライズを適用する。

- `type` フィールドは含めない
- `title` / `detail` / `errors[].message` は日本語
- `instance` は URI ではなくリクエストパス文字列
- `traceId` を `errors[]` の後ろに追加（オブザーバビリティ連携用）
- `errors[]` は任意フィールド。**HTTP 400 バリデーションエラー時には必ず設定する**。HTTP ステータスのみで意味が確定するエラー（404・401・403・5xx 等）では省略可

> RFC 9457 ローカライズの判断: [adr/rfc-9457-localization.md](adr/rfc-9457-localization.md) を参照。

---

## 2. レスポンスボディ構造

```typescript
/**
 * BFF が返す全エラーレスポンスの構造。RFC 9457 ベース＋プロジェクトローカライズ。
 */
export type BffErrorResponse = {
  /** 人間可読な日本語の短い要約（例: `"不正なリクエストです。"`） */
  title: string;
  /** HTTP ステータス。HTTP レスポンスのステータスと一致する */
  status: number;
  /** 日本語の詳細メッセージ */
  detail: string;
  /** エラーが発生したリクエストパス（例: `"/clinical/entry/vital-info"`。URI ではない） */
  instance: string;
  /**
   * エラー詳細。HTTP 400 バリデーションエラー時には必ず設定する。
   * ステータスのみで意味が確定するエラー（404・401・403・5xx 等）では省略可。
   */
  errors?: Array<{
    /**
     * エラー対象のフィールドパス。ドット区切り（例: `items.0.name`）。
     * フィールド単位エラーでない場合は空文字列 `""`。
     */
    field: string;
    /** プロジェクト標準のエラーコード（§3 参照） */
    code: string;
    /** ユーザー向け日本語メッセージ（i18n は `front_bff_shared/i18n` のキーから取得） */
    message: string;
    /**
     * コードごとの拡張情報。
     * TODO: errors[].meta の採用可否をアプリTと確認中（チケット #11436）。
     * 採用する場合は BE（板谷）と連携してレスポンス仕様を確定すること。
     * 不要と判断された場合はこのフィールドを削除する。
     */
    meta?: Record<string, unknown>;
  }>;
  /** リクエスト追跡 ID（UUID）。Sentry / 操作監査ログとの紐付けに使用 */
  traceId: string;
};
```

| キー | 型 | 必須 | 概要 |
|---|---|---|---|
| `title` | string | 必須 | 人間可読な日本語の短い要約 |
| `status` | number | 必須 | HTTP ステータス |
| `detail` | string | 必須 | 日本語の詳細メッセージ |
| `instance` | string | 必須 | リクエストパス文字列（URI ではない） |
| `errors` | array | **任意**（HTTP 400 時は必須） | バリデーションエラー詳細。ステータスのみで意味が確定する場合は省略可 |
| `errors[].field` | string | 必須 | フィールドパス。ない場合は `""` |
| `errors[].code` | string | 必須 | プロジェクト標準コード |
| `errors[].message` | string | 必須 | ユーザー向け日本語メッセージ |
| `errors[].meta` | object | 任意（TODO: 採用可否確認中 #11436） | コードごとの拡張情報 |
| `traceId` | string | 必須 | UUID 形式 |

---

## 3. `errors[].code` 一覧

`errors[].code` は HTTP ステータスごとに次のコードを使用する。フロントエンドは HTTP ステータスと本コードを判定キーとして UI 側のエラー分岐を行う。

| HTTP | コード | 意味 | `errors[].field` | `errors[].meta` 例 |
|---|---|---|---|---|
| 400 | `REQUIRED` | 必須項目が未指定（`undefined` / `null` の到来） | フィールドパス | — |
| 400 | `INVALID_FORMAT` | 形式・範囲・列挙値・複合ルール違反 | フィールドパス | — |
| 400 | `INVALID_TYPE` | 型不一致（`REQUIRED` 以外） | フィールドパス | — |
| 400 | `VALIDATION_DELETE` | 削除不可業務ルール違反（自動連携行の削除試行等） | 空文字列 or フィールドパス | — |
| 401 | `UNAUTHORIZED` | 認証失敗（JWT 検証失敗・セッション切れ） | 空文字列 | — |
| 403 | `FORBIDDEN` | 認可失敗（権限不足） | 空文字列 | — |
| 404 | `NOT_FOUND` | リソース不存在 | 空文字列 | — |
| 409 | `CONFLICT` | 排他競合（編集ロック・期限切れ） | 空文字列 | `lockedByUserName: string`（他ユーザーロック中の場合のみ） |
| 500 | `SYSTEM_ERROR` | サーバー内部エラー | 空文字列 | — |
| 502 | `BAD_GATEWAY` | 上流サービス障害 | 空文字列 | — |
| 504 | `TIMEOUT` | タイムアウト | 空文字列 | — |

**コードの拡張ルール**:
- 機能固有の業務エラーコード（例: `ORDER_ALREADY_CONFIRMED` 等）を追加する場合は HTTP 400 配下の業務エラーとして個別機能設計書で定義する
- 機能固有コードもこの統一フォーマット（`errors[].code` に格納）で返却する。ルートに `code` フィールドを別途設けない

> フロント側 E-code をフロント内部マッピングで導出する判断: [adr/frontend-error-codes.md](adr/frontend-error-codes.md) を参照。

---

## 4. レスポンス例

### 4.1 例1: バリデーションエラー（HTTP 400・複数フィールド）

```json
{
  "title": "不正なリクエストです。",
  "status": 400,
  "detail": "入力内容に不備があります。各項目の詳細を確認してください。",
  "instance": "/clinical/entry/vital-info",
  "errors": [
    {
      "field": "bloodPressure",
      "code": "INVALID_FORMAT",
      "message": "血圧は「収縮期/拡張期」の形式で入力してください。"
    },
    {
      "field": "bloodType",
      "code": "REQUIRED",
      "message": "血液型は必須です。"
    }
  ],
  "traceId": "2ab1312c-aec2-4de8-a9d0-6841715ffe80"
}
```

### 4.2 例2: 排他競合エラー（HTTP 409・`errors[].meta` に追加情報）

```json
{
  "title": "編集が競合しました。",
  "status": 409,
  "detail": "他のユーザーが編集中のため、操作を完了できません。",
  "instance": "/clinical/entry/vital-info/lock",
  "errors": [
    {
      "field": "",
      "code": "CONFLICT",
      "message": "山田太郎さんが編集中です。",
      "meta": {
        "lockedByUserName": "山田太郎"
      }
    }
  ],
  "traceId": "5e8d2a1f-9c3b-4a7e-8b6d-3f2c9a1d8e7f"
}
```

### 4.3 例3: リソース不存在エラー（HTTP 404・`errors` 省略）

```json
{
  "title": "リソースが見つかりません。",
  "status": 404,
  "detail": "指定された患者情報が存在しません。",
  "instance": "/clinical/patients/99999",
  "traceId": "a3c9f1e2-7d5b-4e8a-9c2f-1b6d3a8e7f4c"
}
```

### 4.5 例5: 認可エラー（HTTP 401・`errors` 省略）

```json
{
  "title": "認証に失敗しました。",
  "status": 401,
  "detail": "ログインセッションが切れています。再ログインしてください。",
  "instance": "/clinical/orders",
  "traceId": "f7c1e3a2-4b8d-9c5e-a6f3-2d1b8c7e4a9f"
}
```

---

## 5. Zod 内部コードからプロジェクトコードへの変換ルール

BFF 側の `ZodExceptionFilter`（[03章 ZodExceptionFilter のコード例](../03_TypeScript型管理/) 参照）が Zod の `ZodIssue.code` をプロジェクトコード（`REQUIRED` / `INVALID_FORMAT` / `INVALID_TYPE`）へ変換する。フロントエンドは変換後の `errors[].code` のみを参照すればよい。

| Zod 内部コード | 条件 | プロジェクトコード |
|---|---|---|
| `invalid_type` | `received` が `undefined` / `null` | `REQUIRED` |
| `invalid_type` | 上記以外 | `INVALID_TYPE` |
| `too_small` / `too_big` | — | `INVALID_FORMAT` |
| `invalid_string` / `invalid_enum_value` 等 | — | `INVALID_FORMAT` |
| `custom`（`superRefine` 由来） | — | `INVALID_FORMAT`（固定） |

> `custom` を `INVALID_FORMAT` 固定にする判断: [adr/zod-custom-as-invalid-format.md](adr/zod-custom-as-invalid-format.md) を参照。

> **TODO（確認中・担当: アプリT・アプリ基盤）**: `too_small` / `too_big` を `INVALID_FORMAT` に丸める方針について、影響調査・設計判断（ADR）・アプリTとの調整が未完了（チケット #11436）。
> 画面表示仕様（フィールドレベル詳細 vs 汎用メッセージ）が確定次第、本テーブルと `adr/zod-custom-as-invalid-format.md` を更新すること。

---

## 6. エラー種別と Sentry 送信の関係

| HTTP / `errors[].code` | エラー種別 | Sentry 送信 | UI 表示 |
|---|---|---|---|
| 400 / `REQUIRED`・`INVALID_FORMAT`・`INVALID_TYPE` | 業務エラー（バリデーション） | しない（業務ロジック内の正常系） | フォームのフィールド単位メッセージ（`errors[]` 必須） |
| 400 / `VALIDATION_DELETE` 等 | 業務エラー（業務ルール違反） | しない | ダイアログ（`errors[]` 必須） |
| 401 | 認可エラー | する | ログイン画面へリダイレクト（`errors[]` 省略可） |
| 403 | 認可エラー | する | 権限エラーダイアログ（`errors[]` 省略可） |
| 404 | API エラー | する | データ取得エラーダイアログ（`errors[]` 省略可） |
| 409 / `CONFLICT` | API エラー | する | 同時編集エラーダイアログ（`ErrorModal`・`errors[]` 推奨） |
| 500 / 502 / 504 | システムエラー | する | 共通エラー画面／トースト（`errors[]` 省略可） |

> 業務エラーを Sentry 送信対象外とする判断: [adr/exclude-business-errors.md](adr/exclude-business-errors.md) を参照。

---

## 7. フロントエンドでの取り扱いまとめ

| 取り扱い | 内容 |
|---|---|
| `axiosClient` Interceptor | HTTP ステータスごとにレスポンスを判定し、`error.response.data` をそのまま呼び出し側に渡す（[01章 axiosClient Response Interceptor](../01_フロントエンド・BFF共通基盤設計/) 参照） |
| フォーム呼び出し側 | HTTP 400 のレスポンスから `errors[].field` を React Hook Form のフィールド名と突き合わせて該当フィールドにエラーメッセージを表示 |
| 認可エラー（401/403）・競合エラー（409）・システムエラー（5xx） | HTTP ステータスで一次分岐。`errors` が存在する場合は `errors?.[0].code` を追加判定に使用 |
| `errors[].message` | BFF から日本語で届くため、フロントエンドでの再翻訳は不要。`errors` が省略された場合は `detail` を使用 |
| `errors[].meta` | `errors?.[0].code` ごとに必要時のみ参照（例: `code === 'CONFLICT'` のときのみ `meta.lockedByUserName` を読む） |
| `traceId` | 表示せず、ログ解析時に BFF / 操作監査ログと突き合わせる用途で保持 |
| フロント E-code（E001〜E999） | 本レスポンスの `errors[].code` から内部マッピングで導出。BFF はフロント E-code を返さない |
