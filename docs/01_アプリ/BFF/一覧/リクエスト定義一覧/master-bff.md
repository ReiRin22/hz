# リクエスト定義一覧 — master-bff（マスタ参照）

<!-- 追記ルール: エンドポイントごとにリクエスト型の全フィールドを1行ずつ追加する。 -->

| エンドポイント | 型名 | フィールド | 型 | 必須 | 説明 |
| -------------- | ---- | ---------- | -- | :--: | ---- |
| `GET /bff/test-item/lists` | — | `itemName` | `string` | × | query: 検査項目名（部分一致）。省略時は絞り込みなし |
| `GET /bff/test-item/lists` | — | `itemCode` | `string` | × | query: 検査コード（部分一致）。AND検索。省略時は絞り込みなし |
| `GET /bff/test-item/lists` | — | `X-Correlation-ID` | `string` | ○ | header: 呼び出し元から転送された相関ID |
| `GET /bff/test-item/lists` | — | `X-Tenant-Id` | `string` | ○ | header: テナントID |
| `GET /bff/test-item/lists` | — | `Authorization` | `string` | ○ | header: BFF間サービスアカウントトークン（Bearer） |
