# レスポンス定義一覧 — master（マスタ参照）※モック定義

<!-- DB未設計のためモック定義。DB設計確定後に master.md へ正式定義を記載し、本ファイルは削除する。 -->
<!-- 追記ルール: エンドポイントごとにレスポンス型の全フィールドを1行ずつ追加する。 -->

| エンドポイント | 型名 | フィールド | 型 | 説明 |
| -------------- | ---- | ---------- | -- | ---- |
| `GET /api/v1/master/units` | `UnitListResponse` | `units` | `UnitRecord[]` | 単位マスタ一覧 |
| `GET /api/v1/master/units` | `UnitRecord` | `code` | `string` | 単位コード（例: mg/dL）。BFFで UnitOption.value に変換 |
| `GET /api/v1/master/units` | `UnitRecord` | `name` | `string` | 表示名。BFFで UnitOption.label に変換 |
| `GET /api/v1/master/modification-reasons` | `ModificationReasonListResponse` | `reasons` | `ModificationReasonRecord[]` | 修正理由マスタ一覧 |
| `GET /api/v1/master/modification-reasons` | `ModificationReasonRecord` | `code` | `string` | 理由コード（OTHER=その他） |
| `GET /api/v1/master/modification-reasons` | `ModificationReasonRecord` | `label` | `string` | 表示名 |
| `GET /api/v1/master/test-items` | `TestItemListResponse` | `items` | `TestItemRecord[]` | 検査項目マスタ一覧 |
| `GET /api/v1/master/test-items` | `TestItemRecord` | `code` | `string` | 検査項目コード（例: GLU） |
| `GET /api/v1/master/test-items` | `TestItemRecord` | `name` | `string` | 検査項目名（例: 血糖） |
| `GET /api/v1/master/test-items` | `TestItemRecord` | `unit_id` | `string` | 単位コード（例: mg/dL） |
| `GET /api/v1/master/test-items` | `TestItemRecord` | `lower_limit` | `number \| null` | 基準値下限（null許容） |
| `GET /api/v1/master/test-items` | `TestItemRecord` | `upper_limit` | `number \| null` | 基準値上限（null許容） |
| `GET /api/v1/master/test-items` | `TestItemRecord` | `critical_lower` | `number \| null` | クリティカル下限（null許容） |
| `GET /api/v1/master/test-items` | `TestItemRecord` | `critical_upper` | `number \| null` | クリティカル上限（null許容） |
