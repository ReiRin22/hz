# リクエスト定義一覧 — execution-bff（実施・結果）

<!-- 追記ルール: エンドポイントごとにリクエスト型の全フィールドを1行ずつ追加する。 -->

| エンドポイント | 型名 | フィールド | 型 | 必須 | 説明 |
| -------------- | ---- | ---------- | -- | :--: | ---- |
| `POST /bff/orders/{orderUuid}/test-results` | — | `orderUuid` | `string` | ○ | path: 対象オーダーのUUID |
| `POST /bff/orders/{orderUuid}/test-results` | — | `X-Correlation-ID` | `string` | ○ | header: フロントが発番した相関ID |
| `POST /bff/orders/{orderUuid}/test-results` | — | `X-Tenant-Id` | `string` | ○ | header: テナントID |
| `POST /bff/orders/{orderUuid}/test-results` | — | `Authorization` | `string` | ○ | header: Bearer JWT |
| `GET /bff/test-items` | — | `itemName` | `string` | × | query: 検査項目名（部分一致）。省略時は絞り込みなし |
| `GET /bff/test-items` | — | `itemCode` | `string` | × | query: 検査コード（部分一致）。AND検索。省略時は絞り込みなし |
| `GET /bff/test-items` | — | `X-Correlation-ID` | `string` | ○ | header: フロントが発番した相関ID（master-bffへそのまま転送） |
| `GET /bff/test-items` | — | `X-Tenant-Id` | `string` | ○ | header: テナントID |
| `GET /bff/test-items` | — | `Authorization` | `string` | ○ | header: Bearer JWT |
| `GET /bff/modification-reason` | — | `X-Correlation-ID` | `string` | ○ | header: フロントが発番した相関ID |
| `GET /bff/modification-reason` | — | `X-Tenant-Id` | `string` | ○ | header: テナントID |
| `GET /bff/modification-reason` | — | `Authorization` | `string` | ○ | header: Bearer JWT |
| `POST /bff/orders/{orderUuid}/test-results/save` | — | `orderUuid` | `string` | ○ | path: 対象オーダーのUUID |
| `POST /bff/orders/{orderUuid}/test-results/save` | — | `X-Correlation-ID` | `string` | ○ | header: フロントが発番した相関ID |
| `POST /bff/orders/{orderUuid}/test-results/save` | — | `X-Tenant-Id` | `string` | ○ | header: テナントID |
| `POST /bff/orders/{orderUuid}/test-results/save` | — | `Authorization` | `string` | ○ | header: Bearer JWT |
| `POST /bff/orders/{orderUuid}/test-results/save` | `TestResultSaveRequest` | `testResults` | `TestResultSaveItem[]` | ○ | body: 保存する検査結果一覧 |
| `POST /bff/orders/{orderUuid}/test-results/save` | `TestResultSaveRequest` | `modificationReason` | `ModificationReasonInput` | × | body: 修正理由（reasonRequired=true の場合は必須） |
| `POST /bff/orders/{orderUuid}/test-results/save` | `TestResultSaveItem` | `itemCode` | `string` | ○ | 検査コード |
| `POST /bff/orders/{orderUuid}/test-results/save` | `TestResultSaveItem` | `resultValue` | `number` | ○ | 結果値（数値）。null不可 |
| `POST /bff/orders/{orderUuid}/test-results/save` | `TestResultSaveItem` | `unit` | `string` | ○ | 単位 |
| `POST /bff/orders/{orderUuid}/test-results/save` | `TestResultSaveItem` | `lowerLimit` | `number` | × | 下限値（referenceValueDisplay=null の場合に送信） |
| `POST /bff/orders/{orderUuid}/test-results/save` | `TestResultSaveItem` | `upperLimit` | `number` | × | 上限値（referenceValueDisplay=null の場合に送信） |
| `POST /bff/orders/{orderUuid}/test-results/save` | `TestResultSaveItem` | `testDate` | `string` | × | 検体採取日 YYYY-MM-DD |
| `POST /bff/orders/{orderUuid}/test-results/save` | `ModificationReasonInput` | `reasonCode` | `string` | ○ | 修正理由コード |
| `POST /bff/orders/{orderUuid}/test-results/save` | `ModificationReasonInput` | `reasonText` | `string` | × | 修正理由テキスト（reasonCode='OTHER' の場合は必須） |
