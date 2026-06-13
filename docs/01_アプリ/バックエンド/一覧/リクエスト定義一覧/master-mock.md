# リクエスト定義一覧 — master（マスタ参照）※モック定義

<!-- DB未設計のためモック定義。DB設計確定後に master.md へ正式定義を記載し、本ファイルは削除する。 -->
<!-- 追記ルール: エンドポイントごとにリクエスト型の全フィールドを1行ずつ追加する。 -->

| エンドポイント | 型名 | フィールド | 型 | 必須 | 説明 |
| -------------- | ---- | ---------- | -- | :--: | ---- |
| `GET /api/v1/master/units` | — | — | — | — | リクエストパラメータなし |
| `GET /api/v1/master/modification-reasons` | — | — | — | — | リクエストパラメータなし |
| `GET /api/v1/master/test-items` | — | `itemName` | `string` | × | query: 検査項目名（部分一致）。省略時は絞り込みなし |
| `GET /api/v1/master/test-items` | — | `itemCode` | `string` | × | query: 検査コード（部分一致）。AND検索。省略時は絞り込みなし |
