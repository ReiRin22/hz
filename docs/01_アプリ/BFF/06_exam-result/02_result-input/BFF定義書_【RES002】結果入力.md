# BFF定義書_execution-bff_【RES002】結果入力

<!-- 作成単位: execution-bff / 機能グループ: 結果入力
     本書は I/F 仕様のみを定義する。業務意味の一次情報はフロントエンド個別詳細設計書を参照。 -->

---

## 目次

- [実装前提ルール（AI実装制約）](#実装前提ルールai実装制約)
- [文書概要](#文書概要)
- [API仕様（APIごと）](#api仕様apiごと)
- [DTO・型定義](#dto型定義)
- [外部連携定義](#外部連携定義)
- [エラー処理方針](#エラー処理方針)
- [認証・認可・共通ヘッダ](#認証認可共通ヘッダ)

---

## 実装前提ルール（AI実装制約）

→ [BFF共通設計書 §実装前提ルール（AI実装制約）](../../BFF共通設計書.md#実装前提ルールai実装制約) 参照

### 実装対象範囲

- 生成対象: `execution-bff` の Controller 層 / Service 層 / Client 層
- 非生成対象: バックエンド（execution-domain-service）のコード

---

## 文書概要

- **BFF名**: `execution-bff`
- **責務**: 実施・結果系 API の集約・DTO整形・エラー正規化・編集ロック制御
- **対象画面**:
  - [フロントエンド個別詳細設計書_【RES002】結果入力](../../フロントエンド/06_exam-result/02_result-input/design_detail-RES002_結果入力.md)
- **参照資料**
  - `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/03_通信方針.md`
  - `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/05_エラー方針.md`

### 画面 ↔ API 対応表

| 画面名 | API | 用途 |
| ------ | --- | ---- |
| 【RES002】結果入力 | `POST /bff/orders/{orderUuid}/test-results` | 初期表示（ロック取得兼用） |
| 検査項目検索ダイアログ | `GET /bff/test-items` | 検索ダイアログ表示 |
| 検査結果修正理由ダイアログ | `GET /bff/modification-reason` | 修正理由ダイアログ表示 |
| 【RES002】結果入力 | `POST /bff/orders/{orderUuid}/test-results/save` | 確定保存 |

---

## API仕様（APIごと）

### BFFAPI: POST /bff/orders/{orderUuid}/test-results

**概要**: 検査結果一覧の初期表示データを取得し、同時に編集ロックを取得する。POSTを採用しているのは、ロック取得という副作用を伴う操作であるため。  
**呼び出し元画面**: [【RES002】結果入力](design_detail-RES002_結果入力.md) EVT_INIT01  
**呼び出しタイミング**: 画面ロード時（ロールが医師・臨床検査技師 または 代行確認ダイアログ「はい」押下後）

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `orderUuid` | path | `string` | ○ | 対象オーダーのUUID |
| `X-Correlation-ID` | header | `string` | ○ | フロントが発番した相関ID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |
| `Authorization` | header | `string` | ○ | Bearer JWT |

リクエストボディなし。

#### レスポンス

**成功時（200）**: [`TestResultsInitialResponse`](#testresultsinitialresponse)

**ステータスコード一覧**

| HTTP | エラーコード | 発生条件 | BFF返却形式 | フロントE-code |
| :--: | ----------- | -------- | ----------- | :------------: |
| 200 | — | 正常 | — | — |
| 401 | `UNAUTHORIZED` | JWT検証失敗 | `{ type: "AUTH_ERROR", code: "UNAUTHORIZED" }` | E004 |
| 403 | `FORBIDDEN` | 権限不足 | `{ type: "AUTH_ERROR", code: "FORBIDDEN" }` | E005 |
| 404 | `NOT_FOUND` | オーダーが存在しない | `{ type: "NOT_FOUND", code: "NOT_FOUND" }` | E006 |
| 409 | `CONFLICT` | 他ユーザーが編集ロック中 | `{ type: "CONFLICT", code: "CONFLICT", lockedByUserName: string }` | E007 |
| 500 | `SYSTEM_ERROR` | サーバー内部エラー | `{ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }` | E999 |
| 504 | `TIMEOUT` | タイムアウト | `{ type: "SYSTEM_ERROR", code: "TIMEOUT" }` | E997 |

#### サービス層処理仕様

```
1. X-Correlation-ID をヘッダから取得する
2. execution-domain-service の編集ロック取得APIを呼び出す
   POST /api/v1/orders/{orderUuid}/test-results/lock
   - 409 の場合: lockedByUserName を取得し { type: "CONFLICT", code: "CONFLICT", lockedByUserName } を返す
3. ロック取得成功後、以下を並列で呼び出す（Promise.all）
   a. GET /api/v1/orders/{orderUuid}/test-results  → 検査結果一覧 + reasonRequired (hasConfirmedResults) 取得
   b. GET /api/v1/master/units                     → 単位マスタ取得
4. バックエンドレスポンスを TestResultsInitialResponse にマッピングする
   - reasonRequired = backendResponse.hasConfirmedResults
   - lockInfo.lockBy = 'SELF'（ロック取得成功のため）
5. TestResultsInitialResponse を返す
```

---

### BFFAPI: GET /bff/test-items

**概要**: 検査項目検索ダイアログ用の検索結果一覧を取得する。execution-bff は master-bff の `GET /bff/test-item/lists` を呼び出して結果を整形して返す。  
**呼び出し元画面**: 検査項目検索ダイアログ（ダイアログ表示前の全件取得、および BTN_SEARCH 押下時）  
**呼び出しタイミング**: 医師・臨床検査技師ロールの場合は項目追加ボタン押下直後、研修医・看護師ロールの場合は【PRI001】代行確認ダイアログの[はい]押下後。いずれもダイアログ表示前に全件取得する。および BTN_SEARCH 押下時

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `itemName` | query | `string` | × | 検査項目名（部分一致） |
| `itemCode` | query | `string` | × | 検査コード（部分一致） |
| `X-Correlation-ID` | header | `string` | ○ | フロントが発番した相関ID（master-bff へそのまま転送） |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |
| `Authorization` | header | `string` | ○ | Bearer JWT |

※ `itemName` と `itemCode` は AND 検索。両方省略時は全件を返す。

#### レスポンス

**成功時（200）**: [`TestItemSearchResponse`](#testitemsearchresponse)

**ステータスコード一覧**

| HTTP | エラーコード | 発生条件 | BFF返却形式 | フロントE-code |
| :--: | ----------- | -------- | ----------- | :------------: |
| 200 | — | 正常 | — | — |
| 401 | `UNAUTHORIZED` | JWT検証失敗 | `{ type: "AUTH_ERROR", code: "UNAUTHORIZED" }` | E004 |
| 403 | `FORBIDDEN` | 権限不足 | `{ type: "AUTH_ERROR", code: "FORBIDDEN" }` | E005 |
| 500 | `SYSTEM_ERROR` | サーバー内部エラー | `{ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }` | E999 |
| 502 | `BAD_GATEWAY` | master-bff 障害 | `{ type: "SYSTEM_ERROR", code: "BAD_GATEWAY" }` | E998 |
| 504 | `TIMEOUT` | タイムアウト | `{ type: "SYSTEM_ERROR", code: "TIMEOUT" }` | E997 |

#### サービス層処理仕様

```
1. master-bff の検査項目一覧 API を呼び出す
   GET /bff/test-item/lists（master-bff）
   - クエリパラメータ（itemName, itemCode）をそのまま転送する
   - master-bff から 502 受信（BAD_GATEWAY）: { type: "SYSTEM_ERROR", code: "BAD_GATEWAY" } を 502 で返す
   - master-bff への接続不可（ネットワークエラー等）: { type: "SYSTEM_ERROR", code: "BAD_GATEWAY" } を 502 で返す
   - master-bff から 504 受信 またはタイムアウト: { type: "SYSTEM_ERROR", code: "TIMEOUT" } を 504 で返す
2. master-bff レスポンスを TestItemSearchResponse にマッピングする（下記マッピング表参照）
   - master-bff が 200 + items:[] を返した場合は TestItemSearchResponse{ items: [] } を 200 で返す
3. TestItemSearchResponse を返す
```

---

### BFFAPI: GET /bff/modification-reason

**概要**: 検査結果修正理由ダイアログ用の修正理由マスタを取得する。  
**呼び出し元画面**: 検査結果修正理由ダイアログ（reasonRequired=true 時、確定ボタン押下後）  
**呼び出しタイミング**: 確定ボタン押下後・バリデーション通過・reasonRequired=true の場合

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `X-Correlation-ID` | header | `string` | ○ | フロントが発番した相関ID（バックエンドへそのまま転送） |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |
| `Authorization` | header | `string` | ○ | Bearer JWT |

リクエストパラメータ・ボディなし。

#### レスポンス

**成功時（200）**: [`ModificationReasonResponse`](#modificationreasonresponse)

**ステータスコード一覧**

| HTTP | エラーコード | 発生条件 | BFF返却形式 | フロントE-code |
| :--: | ----------- | -------- | ----------- | :------------: |
| 200 | — | 正常 | — | — |
| 401 | `UNAUTHORIZED` | JWT検証失敗 | `{ type: "AUTH_ERROR", code: "UNAUTHORIZED" }` | E004 |
| 403 | `FORBIDDEN` | 権限不足 | `{ type: "AUTH_ERROR", code: "FORBIDDEN" }` | E005 |
| 404 | `NOT_FOUND` | 修正理由マスタのエンドポイントが存在しない（マスタ0件とは別。運用上は発生しない想定） | `{ type: "NOT_FOUND", code: "NOT_FOUND" }` | E006 |
| 500 | `SYSTEM_ERROR` | サーバー内部エラー | `{ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }` | E999 |
| 504 | `TIMEOUT` | タイムアウト | `{ type: "SYSTEM_ERROR", code: "TIMEOUT" }` | E997 |

#### サービス層処理仕様

```
1. GET /api/v1/master/modification-reasons を呼び出す
2. バックエンドレスポンスを ModificationReasonResponse にマッピングする
3. ModificationReasonResponse を返す
```

---

### BFFAPI: POST /bff/orders/{orderUuid}/test-results/save

**概要**: 編集中の検査結果を確定保存する。修正理由が必要な場合はリクエストに含める。フロントは参照モード（isEditable=false）時に確定ボタンを非活性化するためリクエストを送信しないが、ロック未取得状態でリクエストが来た場合は 409 CONFLICT で弾く（編集ロック検証はサービス層処理仕様 §3 参照）。  
**呼び出し元画面**: [【RES002】結果入力](design_detail-RES002_結果入力.md) EVT_TEST_RESULT_CONFIRM / EVT_EDIT_REASON_CONFIRM  
**呼び出しタイミング**: 確定ボタン押下（初回）または 修正理由ダイアログ確定押下

#### リクエスト

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `orderUuid` | path | `string` | ○ | 対象オーダーのUUID |
| `X-Correlation-ID` | header | `string` | ○ | フロントが発番した相関ID |
| `X-Tenant-Id` | header | `string` | ○ | テナントID |
| `Authorization` | header | `string` | ○ | Bearer JWT |

```typescript
// リクエストボディ
type TestResultSaveRequest = {
  // フロントで削除操作した行（EVT_ROW_DELETE）は除外して送信する。testResults は確定時点で画面に残っている行のみを含む
  testResults: TestResultSaveItem[];
  modificationReason?: ModificationReasonInput; // reasonRequired=true の場合は必須（Zod superRefine で条件必須チェックを実装すること）
};
type TestResultSaveItem = {
  itemCode: string;       // 検査コード
  resultValue: number;    // 結果値（数値）。null不可。フロントでの入力バリデーション通過後に送信される前提
  unit: string;           // 単位。単位マスタとは別に検査結果テーブルのカラムとして保持するため送信が必要
  lowerLimit?: number;    // 下限値。referenceValueDisplay=null（マスタ未設定）の場合のみ送信。referenceValueDisplay が非null の場合は省略する（バックエンドのマスタ値を上書きしない）
  upperLimit?: number;    // 上限値。同上
  testDate?: string;      // 検体採取日 YYYY-MM-DD
};
type ModificationReasonInput = {
  reasonCode: string;     // 修正理由コード
  reasonText?: string;    // 修正理由テキスト（reasonCode='OTHER' の場合は必須）
};
```

Zod スキーマによるボディ検証を必須とする（`shared/types` の schema を使用）。

#### レスポンス

**成功時（200）**: [`TestResultSaveResponse`](#testresultsaveresponse)

**ステータスコード一覧**

| HTTP | エラーコード | 発生条件 | BFF返却形式 | フロントE-code |
| :--: | ----------- | -------- | ----------- | :------------: |
| 200 | — | 正常 | — | — |
| 400 | `VALIDATION_FORMAT` | リクエスト型不正・必須項目欠落 | `{ type: "BUSINESS_ERROR", code: "VALIDATION_FORMAT" }` | E008 |
| 400 | `VALIDATION_DELETE` | 自動連携結果を削除しようとした | `{ type: "BUSINESS_ERROR", code: "VALIDATION_DELETE" }` | E003 |
| 401 | `UNAUTHORIZED` | JWT検証失敗 | `{ type: "AUTH_ERROR", code: "UNAUTHORIZED" }` | E004 |
| 403 | `FORBIDDEN` | 権限不足 | `{ type: "AUTH_ERROR", code: "FORBIDDEN" }` | E005 |
| 404 | `NOT_FOUND` | オーダーが存在しない | `{ type: "NOT_FOUND", code: "NOT_FOUND" }` | E006 |
| 409 | `CONFLICT` | 他ユーザーによるロック競合 または 編集ロック期限切れ | `{ type: "CONFLICT", code: "CONFLICT" }` | E007 |
| 500 | `SYSTEM_ERROR` | サーバー内部エラー | `{ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }` | E999 |
| 504 | `TIMEOUT` | タイムアウト | `{ type: "SYSTEM_ERROR", code: "TIMEOUT" }` | E997 |

#### サービス層処理仕様

```
1. X-Correlation-ID をヘッダから取得する
2. リクエストボディを Zod スキーマで検証する
   - 型不正・必須項目欠落の場合: { type: "BUSINESS_ERROR", code: "VALIDATION_FORMAT" } を 400 で返す
3. バックエンドの保存 API を呼び出す
   POST /api/v1/orders/{orderUuid}/test-results
   - 400 VALIDATION_DELETE の場合: BFF エラー形式に正規化して返す
   - 401 UNAUTHORIZED の場合: { type: "AUTH_ERROR", code: "UNAUTHORIZED" } を 401 で返す
   - 403 FORBIDDEN の場合: { type: "AUTH_ERROR", code: "FORBIDDEN" } を 403 で返す
   - 404 NOT_FOUND の場合: { type: "NOT_FOUND", code: "NOT_FOUND" } を 404 で返す
   - 409 LOCK_CONFLICT の場合: { type: "CONFLICT", code: "CONFLICT", lockedByUserName } を 409 で返す
   - 409 LOCK_EXPIRED の場合: { type: "CONFLICT", code: "CONFLICT" }（lockedByUserName なし）を 409 で返す
4. 保存成功後、編集ロックを解放する（fire-and-forget。await しない。エラーは .catch(() => {}) で握り潰す）
   DELETE /api/v1/orders/{orderUuid}/test-results/lock
   ※ 解放失敗時はTTL切れ（バックエンド側の自動解放）で次ユーザーがロック取得可能。監視不要（ロック期限は排他制御仕様に従う）。
5. TestResultSaveResponse を返す
```

---

## DTO・型定義

```typescript
// shared/types/test-results.ts

/** 検査結果1件 */
export type TestResultItem = {
  itemCode: string;                     // 検査コード（例: GLU）
  itemName: string;                     // 検査項目名（例: 血糖）
  resultValue: number | null;           // 結果値
  unit: string;                         // 単位
  referenceValueDisplay: string | null; // 基準値表示文字列（null=手入力可）
  lowerLimit: number | null;            // 基準値下限（手入力値または取得値）
  upperLimit: number | null;            // 基準値上限（手入力値または取得値）
  criticalLower: number | null;         // クリティカル下限（判定計算用）
  criticalUpper: number | null;         // クリティカル上限（判定計算用）
  previousResultValue: number | null;   // 前回値
  hasPreviousResult: boolean;           // 前回値表示フラグ
  testDate: string | null;              // 検体採取日 YYYY-MM-DD
  hasTestDate: boolean;                 // 採取日表示フラグ
  isUserAdded: boolean;                 // EVT_UI_01で追加した行（true=削除可能）
};

/** 編集ロック情報 */
export type LockInfo = {
  lockBy: 'SELF' | 'OTHER';            // SELF=自分がロック中 / OTHER=他ユーザーがロック中
  lockedAt: string;                     // ISO 8601
  lockedByUserId: string;
  lockedByUserName: string;             // E007ダイアログに「{lockedByUserName}が編集中です」として表示する想定（lockBy='OTHER' 時のみ使用）
};

/** 単位マスタ */
export type UnitOption = {
  value: string;                        // 単位コード（例: mg/dL）
  label: string;                        // 表示名
};

/** POST /bff/orders/{orderUuid}/test-results レスポンス */
export type TestResultsInitialResponse = {
  orderUuid: string;
  testResults: TestResultItem[];
  lockInfo: LockInfo;                   // ロック取得成功時のみ（失敗時は409を返す）
  reasonRequired: boolean;             // 確定済み結果が存在する場合 true
  availableUnits: UnitOption[];        // 単位ドロップダウン用マスタ
};

/** 検査項目マスタ1件（検索ダイアログ用） */
export type TestItemOption = {
  itemCode: string;
  itemName: string;
  defaultUnit: string;
  referenceValueDisplay: string | null; // lower_limit/upper_limit を "${lower}–${upper}" に整形した値（どちらかがnullの場合は全体をnull）
  lowerLimit: number | null;            // 基準値下限（referenceValueDisplay=null 時、FEで手入力欄の初期値として使用）
  upperLimit: number | null;            // 基準値上限（同上）
  criticalLower: number | null;
  criticalUpper: number | null;
};

/** GET /bff/test-items レスポンス */
export type TestItemSearchResponse = {
  items: TestItemOption[];
};

/** 修正理由マスタ1件 */
export type ModificationReasonOption = {
  code: string;                         // 理由コード（OTHER=その他）
  label: string;                        // 表示名
};

/** GET /bff/modification-reason レスポンス */
export type ModificationReasonResponse = {
  reasons: ModificationReasonOption[];
};

/** POST /bff/orders/{orderUuid}/test-results/save レスポンス */
export type TestResultSaveResponse = {
  orderUuid: string;
  savedAt: string;                      // ISO 8601
};

/** BFF統一エラーレスポンス: → BFF共通設計書 §6.1 参照 */
```

---

## 外部連携定義

### 外部呼び出し一覧

呼び出し先は以下の3系統。それぞれ別の環境変数でベースURLを管理する。

| 環境変数 | サービス | 用途 |
| -------- | -------- | ---- |
| `EXECUTION_SERVICE_URL` | `execution-domain-service` | 検査結果・編集ロック系 |
| `MASTER_SERVICE_URL` | `master-domain-service` | マスタ系（単位・修正理由） |
| `MASTER_BFF_URL` | `master-bff` | 検査項目マスタ検索（BFF間連携） |

| BFF API | 呼び出し先 | メソッド | 呼び出しサービス | 説明 |
| ------- | ---------- | :------: | :--------------: | ---- |
| `POST /bff/orders/{orderUuid}/test-results` | `/api/v1/orders/{orderUuid}/test-results/lock` | `POST` | execution | 編集ロック取得 |
| `POST /bff/orders/{orderUuid}/test-results` | `/api/v1/orders/{orderUuid}/test-results` | `GET` | execution | 検査結果一覧取得（reasonRequired含む） |
| `POST /bff/orders/{orderUuid}/test-results` | `/api/v1/master/units` | `GET` | master | 単位マスタ取得（Parallel） |
| `GET /bff/test-items` | `/bff/test-item/lists` | `GET` | master-bff | 検査項目マスタ検索（BFF間連携） |
| `GET /bff/modification-reason` | `/api/v1/master/modification-reasons` | `GET` | master | 修正理由マスタ取得 |
| `POST /bff/orders/{orderUuid}/test-results/save` | `/api/v1/orders/{orderUuid}/test-results` | `POST` | execution | 検査結果確定保存 |
| `POST /bff/orders/{orderUuid}/test-results/save` | `/api/v1/orders/{orderUuid}/test-results/lock` | `DELETE` | execution | 編集ロック解放（保存後・非同期） |

タイムアウト・リトライは → [BFF共通設計書 §タイムアウト・リトライ基本方針](../../BFF共通設計書.md#タイムアウトリトライ基本方針) 参照

### バックエンドレスポンス → BFF DTOマッピング

#### `GET /api/v1/orders/{orderUuid}/test-results` → `TestResultItem`

| バックエンド（`TestResultRecord`） | BFF DTO（`TestResultItem`） | 変換内容 |
| ---------------------------------- | --------------------------- | -------- |
| `itemCode` 〜 `isUserAdded`（14フィールド） | （同名） | そのまま転送 |
| `isAutoLinked` | **（除外）** | FE非公開。削除防止制御はBEで完結するため |
| `confirmedAt` | **（除外）** | FE非公開。確定済み判定は `reasonRequired` で表現 |

`TestResultsGetResponse` 上位フィールドのマッピング:

| バックエンド（`TestResultsGetResponse`） | BFF DTO（`TestResultsInitialResponse`） | 変換内容 |
| ---------------------------------------- | --------------------------------------- | -------- |
| `orderUuid` | `orderUuid` | そのまま転送 |
| `hasConfirmedResults` | `reasonRequired` | フィールド名変換（値はそのまま） |
| `testResults[n]` | `testResults[n]` | 各要素を上記 TestResultItem マッピングで変換 |
| —（ロック取得結果） | `lockInfo` | 下記参照 |
| —（単位マスタ取得結果） | `availableUnits` | 下記参照 |

#### `POST /api/v1/orders/{orderUuid}/test-results/lock`（成功時）→ `LockInfo`

| バックエンド（`LockAcquireResponse`） | BFF DTO（`LockInfo`） | 変換内容 |
| ------------------------------------- | --------------------- | -------- |
| —（固定値） | `lockBy` | `'SELF'` 固定（ロック取得成功のため） |
| `lockedAt` | `lockedAt` | そのまま転送 |
| —（JWTクレームから取得） | `lockedByUserId` | JWT `sub` クレームを使用 |
| —（JWTクレームから取得） | `lockedByUserName` | JWT `name` クレームを使用 |
| `lockId` | **（除外）** | BFF内部のみ使用（FE非公開） |
| `expiresAt` | **（除外）** | FE非公開 |

JWT クレームの参照方法: NestJS の `@CurrentUser()` カスタムデコレータ（`req.user` から取得）を使用する。  
`req.user` には JWT Middleware が検証・デコードした `{ sub: string, name: string, ... }` が格納されている前提。

#### `POST /api/v1/orders/{orderUuid}/test-results/lock`（409時）→ `BffErrorResponse`

| バックエンド（`LockConflictBody`） | BFF レスポンス | 変換内容 |
| ---------------------------------- | -------------- | -------- |
| `errorCode = "LOCK_CONFLICT"` | `type = "CONFLICT"` / `code = "CONFLICT"` | エラータイプを正規化 |
| `lockedByUserName` | `lockedByUserName` | そのまま転送 |
| `lockedByUserId` | **（除外）** | FE非公開 |
| `lockedAt` | **（除外）** | FE非公開 |

#### `GET /bff/test-item/lists`（master-bff）→ `TestItemOption`

※ DB未設計のためモック定義。DB設計確定後に `master-domain-service` 設計書と照合して更新すること。

**整形責務**: `referenceValueDisplay` は execution-bff が整形する（検索ダイアログ用マスタ由来のため）。  
既存の検査結果行（`GET /api/v1/orders/{orderUuid}/test-results` 由来）の `referenceValueDisplay` はバックエンドが整形済みで返す。

| master-bff レスポンス（`TestItemRecord`） | BFF DTO（`TestItemOption`） | 変換内容 |
| ----------------------------------------- | --------------------------- | -------- |
| `code` | `itemCode` | そのまま転送 |
| `name` | `itemName` | そのまま転送 |
| `unit_id` | `defaultUnit` | そのまま転送（単位コード） |
| `lower_limit` / `upper_limit` 両方非null | `referenceValueDisplay` | BFFで `"${lower_limit}–${upper_limit}"` に整形（区切り文字: U+2013 EN DASH） |
| `lower_limit` または `upper_limit` が null | `referenceValueDisplay` | `null`（FEで手入力可） |
| `lower_limit` | `lowerLimit` | そのまま転送 |
| `upper_limit` | `upperLimit` | そのまま転送 |
| `critical_lower` | `criticalLower` | そのまま転送 |
| `critical_upper` | `criticalUpper` | そのまま転送 |
| `itemName` / `itemCode` 以外のクエリ絞り込みは master-bff 側で処理。`itemName`・`itemCode` クエリをそのまま転送する | | |

#### `GET /api/v1/master/units` → `UnitOption`

※ DB未設計のためモック定義。DB設計確定後に `master-domain-service` 設計書と照合して更新すること。

| バックエンド（`master-domain-service`） | BFF DTO（`UnitOption`） | 変換内容 |
| --------------------------------------- | ----------------------- | -------- |
| `code` | `value` | 単位コード |
| `name` | `label` | 表示名 |

---

### 他BFF連携

| BFF API | 呼び出し先BFF | エンドポイント | 用途 |
| ------- | :-----------: | -------------- | ---- |
| `GET /bff/test-items` | `master-bff` | `GET /bff/test-item/lists` | 検査項目マスタ検索 |

ユーザーヘッダ（ETC006）・患者情報ヘッダ（ETC003）はフロントエンドが別途 common-bff / patient-bff を呼び出す。

master-bff 呼び出しポリシーは → [BFF共通設計書 §BFF間呼び出しポリシー](../../BFF共通設計書.md#bff間呼び出しポリシー) 参照

---

## エラー処理方針

→ [BFF共通設計書 §エラー型定義・正規化ルール](../../BFF共通設計書.md#エラー型定義正規化ルール) 参照

### このBFF固有の注意事項

- HTTP 409 の `lockedByUserName` 付与有無は各APIのステータスコード一覧を参照
  - `LOCK_CONFLICT`（他ユーザーがロック中）: `lockedByUserName` を付与する
  - `LOCK_EXPIRED`（ロック期限切れ）: `lockedByUserName` は付与しない

---

## 認証・認可・共通ヘッダ

→ [BFF共通設計書 §共通ヘッダ定義](../../BFF共通設計書.md#共通ヘッダ定義)・[§認証・認可方針](../../BFF共通設計書.md#認証認可方針) 参照（フロント向けBFFの方針を適用）
