# リクエスト定義一覧 — result（検査結果）※モック定義

<!-- DB未設計のためモック定義。DB設計確定後に result.md へ正式定義を記載し、本ファイルは削除する。 -->
<!-- 追記ルール: エンドポイントごとにリクエスト型の全フィールドを1行ずつ追加する。 -->

| エンドポイント | 型名 | フィールド | 型 | 必須 | 説明 |
| -------------- | ---- | ---------- | -- | :--: | ---- |
| `POST /api/v1/orders/{orderUuid}/test-results/lock` | — | `orderUuid` | `string` | ○ | path: 対象オーダーのUUID |
| `GET /api/v1/orders/{orderUuid}/test-results` | — | `orderUuid` | `string` | ○ | path: 対象オーダーのUUID |
| `POST /api/v1/orders/{orderUuid}/test-results` | — | `orderUuid` | `string` | ○ | path: 対象オーダーのUUID |
| `POST /api/v1/orders/{orderUuid}/test-results` | `TestResultSaveRequest` | `testResults` | `TestResultSaveItem[]` | ○ | 保存する検査結果一覧 |
| `POST /api/v1/orders/{orderUuid}/test-results` | `TestResultSaveRequest` | `modificationReason` | `ModificationReasonInput` | × | 修正理由（reasonRequired=true の場合は必須） |
| `POST /api/v1/orders/{orderUuid}/test-results` | `TestResultSaveItem` | `itemCode` | `string` | ○ | 検査コード |
| `POST /api/v1/orders/{orderUuid}/test-results` | `TestResultSaveItem` | `resultValue` | `number` | ○ | 結果値（null不可） |
| `POST /api/v1/orders/{orderUuid}/test-results` | `TestResultSaveItem` | `unit` | `string` | ○ | 単位 |
| `POST /api/v1/orders/{orderUuid}/test-results` | `TestResultSaveItem` | `lowerLimit` | `number` | × | 下限値（referenceValueDisplay=null の場合に送信） |
| `POST /api/v1/orders/{orderUuid}/test-results` | `TestResultSaveItem` | `upperLimit` | `number` | × | 上限値（referenceValueDisplay=null の場合に送信） |
| `POST /api/v1/orders/{orderUuid}/test-results` | `TestResultSaveItem` | `testDate` | `string` | × | 検体採取日 YYYY-MM-DD |
| `POST /api/v1/orders/{orderUuid}/test-results` | `ModificationReasonInput` | `reasonCode` | `string` | ○ | 修正理由コード |
| `POST /api/v1/orders/{orderUuid}/test-results` | `ModificationReasonInput` | `reasonText` | `string` | × | 修正理由テキスト（reasonCode='OTHER' の場合は必須） |
| `DELETE /api/v1/orders/{orderUuid}/test-results/lock` | — | `orderUuid` | `string` | ○ | path: 対象オーダーのUUID |
