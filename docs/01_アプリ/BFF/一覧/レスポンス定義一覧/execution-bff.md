# レスポンス定義一覧 — execution-bff（実施・結果）

<!-- 追記ルール: エンドポイントごとにレスポンス型の全フィールドを1行ずつ追加する。 -->

| エンドポイント | 型名 | フィールド | 型 | 説明 |
| -------------- | ---- | ---------- | -- | ---- |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultsInitialResponse` | `orderUuid` | `string` | 対象オーダーのUUID |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultsInitialResponse` | `testResults` | `TestResultItem[]` | 検査結果一覧 |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultsInitialResponse` | `lockInfo` | `LockInfo` | 編集ロック情報（ロック取得成功時のみ） |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultsInitialResponse` | `reasonRequired` | `boolean` | 確定済み結果が存在する場合 true |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultsInitialResponse` | `availableUnits` | `UnitOption[]` | 単位ドロップダウン用マスタ |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `itemCode` | `string` | 検査コード（例: GLU） |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `itemName` | `string` | 検査項目名（例: 血糖） |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `resultValue` | `number \| null` | 結果値 |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `unit` | `string` | 単位 |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `referenceValueDisplay` | `string \| null` | 基準値表示文字列（null=手入力可） |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `lowerLimit` | `number \| null` | 基準値下限 |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `upperLimit` | `number \| null` | 基準値上限 |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `criticalLower` | `number \| null` | クリティカル下限（判定計算用） |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `criticalUpper` | `number \| null` | クリティカル上限（判定計算用） |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `previousResultValue` | `number \| null` | 前回値 |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `hasPreviousResult` | `boolean` | 前回値表示フラグ |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `testDate` | `string \| null` | 検体採取日 YYYY-MM-DD |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `hasTestDate` | `boolean` | 採取日表示フラグ |
| `POST /bff/orders/{orderUuid}/test-results` | `TestResultItem` | `isUserAdded` | `boolean` | EVT_UI_01で追加した行（true=削除可能） |
| `POST /bff/orders/{orderUuid}/test-results` | `LockInfo` | `lockBy` | `'SELF' \| 'OTHER'` | SELF=自分がロック中 / OTHER=他ユーザーがロック中 |
| `POST /bff/orders/{orderUuid}/test-results` | `LockInfo` | `lockedAt` | `string` | ISO 8601 |
| `POST /bff/orders/{orderUuid}/test-results` | `LockInfo` | `lockedByUserId` | `string` | ロック取得者のユーザーID |
| `POST /bff/orders/{orderUuid}/test-results` | `LockInfo` | `lockedByUserName` | `string` | ロック取得者のユーザー名 |
| `POST /bff/orders/{orderUuid}/test-results` | `UnitOption` | `value` | `string` | 単位コード（例: mg/dL） |
| `POST /bff/orders/{orderUuid}/test-results` | `UnitOption` | `label` | `string` | 表示名 |
| `GET /bff/test-items` | `TestItemSearchResponse` | `items` | `TestItemOption[]` | 検査項目マスタ一覧 |
| `GET /bff/test-items` | `TestItemOption` | `itemCode` | `string` | 検査コード（例: GLU） |
| `GET /bff/test-items` | `TestItemOption` | `itemName` | `string` | 検査項目名（例: 血糖） |
| `GET /bff/test-items` | `TestItemOption` | `defaultUnit` | `string` | デフォルト単位コード |
| `GET /bff/test-items` | `TestItemOption` | `referenceValueDisplay` | `string \| null` | 基準値表示文字列。lower/upper両方非nullの場合に整形（null=手入力可） |
| `GET /bff/test-items` | `TestItemOption` | `lowerLimit` | `number \| null` | 基準値下限（referenceValueDisplay=null時のFE手入力初期値） |
| `GET /bff/test-items` | `TestItemOption` | `upperLimit` | `number \| null` | 基準値上限（同上） |
| `GET /bff/test-items` | `TestItemOption` | `criticalLower` | `number \| null` | クリティカル下限 |
| `GET /bff/test-items` | `TestItemOption` | `criticalUpper` | `number \| null` | クリティカル上限 |
| `GET /bff/modification-reason` | `ModificationReasonResponse` | `reasons` | `ModificationReasonOption[]` | 修正理由マスタ一覧 |
| `GET /bff/modification-reason` | `ModificationReasonOption` | `code` | `string` | 理由コード（OTHER=その他） |
| `GET /bff/modification-reason` | `ModificationReasonOption` | `label` | `string` | 表示名 |
| `POST /bff/orders/{orderUuid}/test-results/save` | `TestResultSaveResponse` | `orderUuid` | `string` | 保存対象オーダーのUUID |
| `POST /bff/orders/{orderUuid}/test-results/save` | `TestResultSaveResponse` | `savedAt` | `string` | 保存日時 ISO 8601 |
