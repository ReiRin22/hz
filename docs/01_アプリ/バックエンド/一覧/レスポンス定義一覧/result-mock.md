# レスポンス定義一覧 — result（検査結果）※モック定義

<!-- DB未設計のためモック定義。DB設計確定後に result.md へ正式定義を記載し、本ファイルは削除する。 -->
<!-- 追記ルール: エンドポイントごとにレスポンス型の全フィールドを1行ずつ追加する。 -->

| エンドポイント | 型名 | フィールド | 型 | 説明 |
| -------------- | ---- | ---------- | -- | ---- |
| `POST /api/v1/orders/{orderUuid}/test-results/lock` | `LockAcquireResponse` | `lockId` | `string` | ロックID（BFF内部使用。FE非公開） |
| `POST /api/v1/orders/{orderUuid}/test-results/lock` | `LockAcquireResponse` | `lockedAt` | `string` | ロック取得日時 ISO 8601 |
| `POST /api/v1/orders/{orderUuid}/test-results/lock` | `LockAcquireResponse` | `expiresAt` | `string` | ロック有効期限 ISO 8601（BFF内部使用。FE非公開） |
| `POST /api/v1/orders/{orderUuid}/test-results/lock` | `LockConflictBody` | `errorCode` | `string` | 409時: `LOCK_CONFLICT` |
| `POST /api/v1/orders/{orderUuid}/test-results/lock` | `LockConflictBody` | `lockedByUserId` | `string` | 409時: ロック保持者のユーザーID（BFF内部使用。FE非公開） |
| `POST /api/v1/orders/{orderUuid}/test-results/lock` | `LockConflictBody` | `lockedByUserName` | `string` | 409時: ロック保持者のユーザー名（BFFがFEへ転送） |
| `POST /api/v1/orders/{orderUuid}/test-results/lock` | `LockConflictBody` | `lockedAt` | `string` | 409時: ロック取得日時（BFF内部使用。FE非公開） |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultsGetResponse` | `orderUuid` | `string` | 対象オーダーのUUID |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultsGetResponse` | `hasConfirmedResults` | `boolean` | 確定済み結果が存在する場合 true（BFFで reasonRequired に変換） |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultsGetResponse` | `testResults` | `TestResultRecord[]` | 検査結果一覧 |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `itemCode` | `string` | 検査コード |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `itemName` | `string` | 検査項目名 |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `resultValue` | `number \| null` | 結果値 |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `unit` | `string` | 単位 |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `referenceValueDisplay` | `string \| null` | 基準値表示文字列（BEが整形済みで返す） |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `lowerLimit` | `number \| null` | 基準値下限 |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `upperLimit` | `number \| null` | 基準値上限 |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `criticalLower` | `number \| null` | クリティカル下限 |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `criticalUpper` | `number \| null` | クリティカル上限 |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `previousResultValue` | `number \| null` | 前回値 |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `hasPreviousResult` | `boolean` | 前回値表示フラグ |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `testDate` | `string \| null` | 検体採取日 YYYY-MM-DD |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `hasTestDate` | `boolean` | 採取日表示フラグ |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `isUserAdded` | `boolean` | EVT_UI_01で追加した行（true=削除可能） |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `isAutoLinked` | `boolean` | 自動連携結果フラグ（FE非公開。削除防止制御はBEで完結） |
| `GET /api/v1/orders/{orderUuid}/test-results` | `TestResultRecord` | `confirmedAt` | `string \| null` | 確定日時 ISO 8601（FE非公開。確定済み判定は reasonRequired で表現） |
| `POST /api/v1/orders/{orderUuid}/test-results` | `TestResultSaveResponse` | `orderUuid` | `string` | 保存対象オーダーのUUID |
| `POST /api/v1/orders/{orderUuid}/test-results` | `TestResultSaveResponse` | `savedAt` | `string` | 保存日時 ISO 8601 |
| `DELETE /api/v1/orders/{orderUuid}/test-results/lock` | — | — | — | レスポンスボディなし（204 No Content）。fire-and-forgetのためBFFはレスポンスを待たない |
