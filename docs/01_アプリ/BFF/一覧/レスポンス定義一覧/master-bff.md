# レスポンス定義一覧 — master-bff（マスタ参照）

<!-- 追記ルール: エンドポイントごとにレスポンス型の全フィールドを1行ずつ追加する。 -->

| エンドポイント | 型名 | フィールド | 型 | 説明 |
| -------------- | ---- | ---------- | -- | ---- |
| `GET /bff/test-item/lists` | `TestItemListResponse` | `items` | `TestItemRecord[]` | 検査項目マスタ一覧 |
| `GET /bff/test-item/lists` | `TestItemRecord` | `code` | `string` | 検査項目コード（例: GLU） |
| `GET /bff/test-item/lists` | `TestItemRecord` | `name` | `string` | 検査項目名（例: 血糖） |
| `GET /bff/test-item/lists` | `TestItemRecord` | `unit_id` | `string` | 単位コード（例: mg/dL） |
| `GET /bff/test-item/lists` | `TestItemRecord` | `lower_limit` | `number \| null` | 基準値下限（null許容） |
| `GET /bff/test-item/lists` | `TestItemRecord` | `upper_limit` | `number \| null` | 基準値上限（null許容） |
| `GET /bff/test-item/lists` | `TestItemRecord` | `critical_lower` | `number \| null` | クリティカル下限（null許容） |
| `GET /bff/test-item/lists` | `TestItemRecord` | `critical_upper` | `number \| null` | クリティカル上限（null許容） |
