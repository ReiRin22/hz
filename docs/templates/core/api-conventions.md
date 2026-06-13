# API規約

> 最終更新: YYYY-MM-DD

## スタイル

- 方式: {{REST / GraphQL / gRPC / tRPC}}
- ベースパス: {{例: /api/v1}}
- バージョニング: {{URLパス / ヘッダ / なし}}

## 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| エンドポイント | {{kebab-case等}} | `/user-profiles` |
| クエリパラメータ | {{camelCase等}} | `?pageSize=20` |
| リクエスト/レスポンスのキー | {{camelCase等}} | `{ "userName": "" }` |

## 共通レスポンス形式

```json
// 成功
{
  "data": {},
  "meta": {}
}

// エラー
{
  "error": {
    "code": "ERROR_CODE",
    "message": "人間が読めるメッセージ",
    "details": []
  }
}
```

## エラーコード体系

| HTTPステータス | 用途 | エラーコード規則 |
|--------------|------|----------------|
| 400 | バリデーションエラー | `VALIDATION_*` |
| 401 | 未認証 | `AUTH_*` |
| 403 | 権限不足 | `FORBIDDEN_*` |
| 404 | リソース不在 | `NOT_FOUND_*` |
| 409 | 競合 | `CONFLICT_*` |
| 500 | サーバーエラー | `INTERNAL_*` |

## 認証・認可

- 認証方式: {{JWT / Session / OAuth2}}
- トークンの渡し方: {{Authorization Bearer / Cookie}}
- 認可チェックの実装場所: {{ミドルウェア / ガード}}

## ページネーション

- 方式: {{offset / cursor}}
- デフォルトページサイズ: {{20}}
- 最大ページサイズ: {{100}}
