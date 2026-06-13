# BFF詳細設計書_{BFF名}_{機能グループ名}

<!--
  作成単位: 業務フェーズ単位（execution-bff, order-bff 等）の BFF を対象とする。
  1つの BFF が複数画面にまたがる場合は機能グループ（結果入力系 等）で分割してよい。
  業務的な「意味」はフロントエンド個別詳細設計書が一次情報。本書は I/F 仕様のみを定義する。
-->

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

→ [BFF共通設計書 §2](../01_アプリ/BFF/BFF共通設計書.md#2-実装前提ルールai実装制約) 参照

### 実装対象範囲

- 生成対象: `{BFF名}` の Controller 層 / Service 層 / Client 層
- 非生成対象: バックエンド（{ドメインサービス名}）のコード

---

## 文書概要

<!--
  【記入例】
  - **BFF名**: `execution-bff`
  - **責務**: 実施・結果系 API の集約・DTO整形・エラー正規化・編集ロック制御
  - **対象画面**: [フロントエンド個別詳細設計書_【RES002】結果入力](design_detail-RES002_結果入力.md)
  - **参照資料**: `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/03_通信方針.md`

  責務の書き方: 「何系 API の 何（集約/整形/正規化）をする BFF」という形式で1行にまとめる。
  業務ロジックの説明は書かない（それはフロントエンド個別詳細設計書の役割）。
-->

- **BFF名**: `{BFF名}` （例: `execution-bff`）
- **責務**: {このBFFの責務（例: 実施・結果系APIの集約・整形・エラー正規化）}
- **対象画面**:
  - [{画面ID} {画面名}]({フロントエンド個別詳細設計書へのリンク})
- **参照資料**
  - [{方針書名}]({リンク})

### 画面 ↔ API 対応表

<!--
  【記入例】
  統合ドキュメントは対応表のみ作る。業務意味（「なぜこのAPIを呼ぶか」）は書かない。
  用途欄は「初期表示 / 参照 / 確定 / マスタ取得」のいずれかで統一する。

  | 【RES002】結果入力       | `POST /bff/orders/{orderUuid}/test-results`      | 初期表示（ロック取得兼用） |
  | 検査項目検索ダイアログ   | `GET /bff/test-items`                            | 参照（マスタ検索）         |
  | 修正理由ダイアログ       | `GET /bff/modification-reason`                   | 参照（マスタ取得）         |
  | 【RES002】結果入力       | `POST /bff/orders/{orderUuid}/test-results/save` | 確定                       |
-->

| 画面名 | API | 用途 |
| ------ | --- | ---- |
| {画面名} | `{メソッド} {パス}` | {初期表示 / 参照 / 確定} |

---

## API仕様（APIごと）

<!-- 1エンドポイント = 1セクション。業務意味は書かず I/F 仕様のみ記載する。 -->

### `{メソッド} {パス}`

<!--
  【記入例】
  ### `POST /bff/orders/{orderUuid}/test-results`

  **概要**: 検査結果一覧の初期表示データを取得し、同時に編集ロックを取得する。
           POST を採用しているのは、ロック取得という副作用を伴う操作であるため。
  **呼び出し元画面**: [【RES002】結果入力](design_detail-RES002_結果入力.md) EVT_INIT01
  **呼び出しタイミング**: 画面ロード時（ロールが医師・臨床検査技師 または 代行確認ダイアログ「はい」押下後）
-->

**概要**: {このAPIの目的。副作用がある場合（ロック取得・状態変更等）はその理由も記載する}  
**呼び出し元画面**: [{画面ID} {画面名}]() {EVT_ID}  
**呼び出しタイミング**: {初期表示時 / ボタン押下時 / etc. ガード条件がある場合はここに記載}

#### リクエスト

<!--
  【記入例】ボディなしの場合:
  | `orderUuid`        | path   | `string` | ○ | 対象オーダーのUUID                              |
  | `X-Correlation-ID` | header | `string` | ○ | フロントが発番した相関ID（監査ログに使用）      |
  | `X-Tenant-Id`      | header | `string` | ○ | テナントID                                      |
  | `Authorization`    | header | `string` | ○ | Bearer JWT                                      |
  リクエストボディなし。

  【記入例】クエリパラメータの場合:
  | `itemName` | query | `string` | × | 検査項目名（部分一致）。省略時は全件返す         |
  | `itemCode` | query | `string` | × | 検査コード（部分一致）。itemName との AND 検索   |
  ※ 両方省略時は全件を返す。

  【記入例】ボディありの場合（型定義も合わせて記載）:
  | `orderUuid`         | path   | `string` | ○ | 対象オーダーのUUID              |
  | `X-Correlation-ID`  | header | `string` | ○ | フロントが発番した相関ID        |
  | (body)              | body   | object   | ○ | 下記参照                        |

  type TestResultSaveRequest = {
    testResults: TestResultSaveItem[];
    modificationReason?: ModificationReasonInput; // reasonRequired=true の場合は必須
  };
  type TestResultSaveItem = {
    itemCode: string;       // 検査コード
    resultValue: number;    // 結果値（数値）。null 不可。フロントでのバリデーション通過後に送信される前提
    unit: string;           // 単位
    lowerLimit?: number;    // 下限値（referenceValueDisplay=null の場合に送信）
    upperLimit?: number;    // 上限値（referenceValueDisplay=null の場合に送信）
    testDate?: string;      // 検体採取日 YYYY-MM-DD
  };
  type ModificationReasonInput = {
    reasonCode: string;     // 修正理由コード
    reasonText?: string;    // 修正理由テキスト（reasonCode='OTHER' の場合は必須）
  };
  // Zod スキーマによるボディ検証を必須とする（shared/types の schema を使用）
-->

| 項目 | 場所 | 型 | 必須 | 説明 |
| ---- | ---- | -- | :--: | ---- |
| `{パラメータ名}` | path | `string` | ○ | {説明} |
| `{パラメータ名}` | query | `string` | × | {説明} |
| `{フィールド名}` | body | `{型}` | ○ | {説明} |

```typescript
// リクエストボディ型（body がある場合のみ記載）
type {RequestTypeName} = {
  {field}: {type}; // {説明}
};
```

#### レスポンス

**成功時（200）**

<!--
  【記入例】型定義の詳細は「DTO・型定義」セクションに集約する。ここはレスポンス型名と参照先の明示のみでよい。
  **成功時（200）**: [`TestResultsInitialResponse`](#testresultsinitialresponse)

  シンプルなレスポンスはここに直書きしてよい:
  type TestResultSaveResponse = {
    orderUuid: string;
    savedAt: string; // ISO 8601
  };
-->

```typescript
type {ResponseTypeName} = {
  {field}: {type}; // {説明}
};
```

**ステータスコード一覧**

<!--
  【記入例】フロントE-codeがある場合は列を追加する。
  フロントE-codeとはフロントエンド個別詳細設計書のエラー表示設計で定義した番号（E001〜）。

  | HTTP | エラーコード       | 発生条件                     | BFF返却形式                                                            | フロントE-code |
  | :--: | ------------------ | ---------------------------- | ---------------------------------------------------------------------- | :------------: |
  | 200  | —                  | 正常                         | —                                                                      | —              |
  | 401  | `UNAUTHORIZED`     | JWT検証失敗                  | `{ type: "AUTH_ERROR", code: "UNAUTHORIZED" }`                         | E004           |
  | 403  | `FORBIDDEN`        | 権限不足                     | `{ type: "AUTH_ERROR", code: "FORBIDDEN" }`                            | E005           |
  | 404  | `NOT_FOUND`        | オーダーが存在しない         | `{ type: "NOT_FOUND", code: "NOT_FOUND" }`                             | E006           |
  | 409  | `CONFLICT`         | 他ユーザーが編集ロック中     | `{ type: "CONFLICT", code: "CONFLICT", lockedByUserName: string }`     | E007           |
  | 500  | `SYSTEM_ERROR`     | サーバー内部エラー           | `{ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }`                       | E999           |
  | 504  | `TIMEOUT`          | タイムアウト                 | `{ type: "SYSTEM_ERROR", code: "TIMEOUT" }`                            | E997           |

  ポイント:
  - 発生しないステータスは行ごと削除する（使わない行を残さない）
  - 400 の業務バリデーションエラーコードは具体名を書く（例: VALIDATION_DELETE）
  - 409 の CONFLICT は、lockedByUserName を付与するケース（他ユーザーロック中）と
    付与しないケース（ロック期限切れ）を別行で記載する
-->

| ステータス | エラーコード | 発生条件 | フロントへの返却形式 |
| :--------: | ----------- | -------- | -------------------- |
| 200 | — | 正常 | — |
| 400 | `VALIDATION_{名前}` | {発生条件} | `{ type: "BUSINESS_ERROR", code: "VALIDATION_{名前}" }` |
| 401 | `UNAUTHORIZED` | 認証失敗 | `{ type: "AUTH_ERROR", code: "UNAUTHORIZED" }` |
| 403 | `FORBIDDEN` | 権限不足 | `{ type: "AUTH_ERROR", code: "FORBIDDEN" }` |
| 404 | `NOT_FOUND` | {発生条件} | `{ type: "NOT_FOUND", code: "NOT_FOUND" }` |
| 409 | `CONFLICT` | {発生条件（例: 排他競合）} | `{ type: "CONFLICT", code: "CONFLICT" }` |
| 500 | `SYSTEM_ERROR` | システムエラー | `{ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }` |
| 502 | `BAD_GATEWAY` | 上流サービス障害 | `{ type: "SYSTEM_ERROR", code: "BAD_GATEWAY" }` |
| 504 | `TIMEOUT` | タイムアウト | `{ type: "SYSTEM_ERROR", code: "TIMEOUT" }` |

#### サービス層処理仕様

<!--
  【記入例】直列呼び出し（保存系）:
  1. X-Correlation-ID をヘッダから取得する
  2. リクエストボディを Zod スキーマで検証する
     - 型不正・必須項目欠落の場合: { type: "BUSINESS_ERROR", code: "VALIDATION_ERROR" } を 400 で返す
  3. バックエンドの保存 API を呼び出す
     POST /api/v1/orders/{orderUuid}/test-results
     - 400 VALIDATION_DELETE の場合: BFF エラー形式に正規化して返す
     - 409 の場合: { type: "CONFLICT", code: "CONFLICT" } を返す
  4. 保存成功後、編集ロックを解放する（fire-and-forget。await しない。エラーは .catch(() => {}) で握り潰す）
     DELETE /api/v1/orders/{orderUuid}/test-results/lock
  5. TestResultSaveResponse を返す

  【記入例】並列呼び出し（初期表示系）:
  1. X-Correlation-ID をヘッダから取得する
  2. 編集ロック取得 API を呼び出す
     POST /api/v1/orders/{orderUuid}/test-results/lock
     - 409 LOCK_CONFLICT の場合: lockedByUserName を取得し CONFLICT を返す
  3. ロック取得成功後、以下を並列呼び出し（Promise.all）
     a. GET /api/v1/orders/{orderUuid}/test-results  → 検査結果一覧 + reasonRequired(=hasConfirmedResults) 取得
     b. GET /api/v1/master/units                     → 単位マスタ取得
  4. バックエンドレスポンスを TestResultsInitialResponse にマッピングする
     - reasonRequired = backendResponse.hasConfirmedResults（フィールド名変換のみ）
     - lockInfo.lockBy = 'SELF'（ロック取得成功のため固定値）
  5. TestResultsInitialResponse を返す

  書き方のルール:
  - 処理順序を番号付きで記載する
  - 各バックエンドAPI呼び出しは「メソッド パス」形式で明記する
  - エラー分岐は「- {HTTPステータス} の場合: {処理}」形式で記載する
  - fire-and-forget の場合は必ず明記する
  - 業務判定ロジック（「血糖値が正常範囲か」等）は書かない
-->

```
1. リクエストヘッダから X-Correlation-ID を取得する
2. {処理ステップ}
   {バックエンドAPI呼び出し: METHOD /api/v1/...}
   - {HTTPステータス} の場合: {エラー処理}
3. {処理ステップ（レスポンスをDTOにマッピング等）}
4. {ResponseTypeName} を返す
```

---

### `{メソッド} {パス}`

<!-- 上記と同じ構成で追加する -->

---

## DTO・型定義

<!--
  【記入例】
  - shared/types に配置する共有型定義。フロントエンドと BFF で同一型を参照する。
  - 各フィールドにコメントで「用途」または「取りうる値・例」を記載する。
  - フロントに公開しない（除外する）フィールドはここに記載しない（バックエンド設計書側の話）。

  // shared/types/test-results.ts

  /** 検査結果1件 */
  export type TestResultItem = {
    itemCode: string;                     // 検査コード（例: GLU）
    itemName: string;                     // 検査項目名（例: 血糖）
    resultValue: number | null;           // 結果値
    unit: string;                         // 単位（例: mg/dL）
    referenceValueDisplay: string | null; // 基準値表示文字列（null=手入力可）
    lowerLimit: number | null;            // 基準値下限（手入力値または取得値）
    upperLimit: number | null;            // 基準値上限（手入力値または取得値）
    criticalLower: number | null;         // クリティカル下限（判定計算用）
    criticalUpper: number | null;         // クリティカル上限（判定計算用）
    previousResultValue: number | null;   // 前回値
    hasPreviousResult: boolean;           // 前回値表示フラグ
    testDate: string | null;              // 検体採取日 YYYY-MM-DD
    hasTestDate: boolean;                 // 採取日表示フラグ
    isUserAdded: boolean;                 // true=EVT_UI_01で追加した行（削除可能）
  };

  /** 編集ロック情報 */
  export type LockInfo = {
    lockBy: 'SELF' | 'OTHER'; // SELF=自分がロック中 / OTHER=他ユーザーがロック中
    lockedAt: string;          // ISO 8601
    lockedByUserId: string;
    lockedByUserName: string;
  };

  /** BFF統一エラーレスポンス */
  export type BffErrorResponse = {
    type: 'BUSINESS_ERROR' | 'AUTH_ERROR' | 'NOT_FOUND' | 'CONFLICT' | 'SYSTEM_ERROR';
    code: string;
    lockedByUserName?: string; // type=CONFLICT かつ他ユーザーロック中の場合のみ付与
  };

  /** POST /bff/orders/{orderUuid}/test-results レスポンス */
  export type TestResultsInitialResponse = {
    orderUuid: string;
    testResults: TestResultItem[];
    lockInfo: LockInfo;            // ロック取得成功時のみ（失敗時は409を返す）
    reasonRequired: boolean;       // 確定済み結果が存在する場合 true
    availableUnits: UnitOption[];  // 単位ドロップダウン用マスタ
  };
-->

```typescript
// shared/types/{ファイル名}.ts

/** {DTOの用途説明} */
export type {DtoName} = {
  {field}: {type}; // {説明（例: 検査コード（例: GLU））}
  {field}?: {type}; // {説明}（任意項目）
};
```

---

## 外部連携定義

### バックエンドAPI呼び出し一覧

<!--
  【記入例】呼び出し先サービスが複数ある場合は環境変数表を先に記載する。

  呼び出し先サービスは以下の2系統。それぞれ別の環境変数でベースURLを管理する。

  | 環境変数                | サービス                     | 用途                              |
  | ----------------------- | ---------------------------- | --------------------------------- |
  | `EXECUTION_SERVICE_URL` | `execution-domain-service`   | 検査結果・編集ロック系            |
  | `MASTER_SERVICE_URL`    | `master-domain-service`      | マスタ系（単位・検査項目・修正理由）|

  | BFF API                                          | バックエンドAPI                                     | メソッド | 呼び出し先 | 説明                               |
  | ------------------------------------------------ | --------------------------------------------------- | :------: | :--------: | ---------------------------------- |
  | `POST /bff/orders/{orderUuid}/test-results`      | `/api/v1/orders/{orderUuid}/test-results/lock`      | `POST`   | execution  | 編集ロック取得                     |
  | `POST /bff/orders/{orderUuid}/test-results`      | `/api/v1/orders/{orderUuid}/test-results`           | `GET`    | execution  | 検査結果一覧取得（reasonRequired含む） |
  | `POST /bff/orders/{orderUuid}/test-results`      | `/api/v1/master/units`                              | `GET`    | master     | 単位マスタ取得（Parallel）         |
  | `GET /bff/test-items`                            | `/api/v1/master/test-items`                         | `GET`    | master     | 検査項目マスタ検索                 |
  | `POST /bff/orders/{orderUuid}/test-results/save` | `/api/v1/orders/{orderUuid}/test-results`           | `POST`   | execution  | 検査結果確定保存                   |
  | `POST /bff/orders/{orderUuid}/test-results/save` | `/api/v1/orders/{orderUuid}/test-results/lock`      | `DELETE` | execution  | 編集ロック解放（保存後・非同期）   |

  ### タイムアウト・リトライポリシー

  | 項目         | 値       | 備考                                                                           |
  | ------------ | -------- | ------------------------------------------------------------------------------ |
  | タイムアウト | `5000ms` | 全バックエンド呼び出し共通。環境変数 `BACKEND_TIMEOUT_MS` で上書き可           |
  | リトライ     | **なし** | 全エンドポイント共通。冪等でない操作（POST/DELETE）を含むためリトライしない     |

  ### バックエンドレスポンス → BFF DTOマッピング（フィールド名変換がある場合のみ記載）

  フィールド名の変換なしにそのまま転送する場合は「そのまま転送」と記載する。
  フロントに公開しないフィールドは「（除外）」と記載し、除外理由を書く。

  | バックエンド（`TestResultsGetResponse`）  | BFF DTO（`TestResultsInitialResponse`） | 変換内容                          |
  | ----------------------------------------- | --------------------------------------- | --------------------------------- |
  | `hasConfirmedResults`                     | `reasonRequired`                        | フィールド名変換（値はそのまま）  |
  | `testResults[n]`                          | `testResults[n]`                        | 各要素を TestResultItem で変換    |
  | —（ロック取得結果）                       | `lockInfo`                              | lockBy='SELF' 固定、他はそのまま  |

  | バックエンド（`TestResultRecord`）         | BFF DTO（`TestResultItem`）             | 変換内容                          |
  | ------------------------------------------ | --------------------------------------- | --------------------------------- |
  | `itemCode` 〜 `isUserAdded`（14フィールド）| （同名）                                | そのまま転送                      |
  | `isAutoLinked`                             | **（除外）**                            | FE非公開。削除防止制御はBEで完結  |
  | `confirmedAt`                              | **（除外）**                            | FE非公開。確定済み判定は reasonRequired で表現 |
-->

| BFF API | バックエンドAPI | メソッド | 説明 |
| ------- | -------------- | :------: | ---- |
| `{BFF側パス}` | `{BE側パス}` | `{GET/POST/...}` | {説明} |

### タイムアウト・リトライポリシー

| 項目 | 値 | 備考 |
| ---- | -- | ---- |
| タイムアウト | `{Xms}` | {環境変数名で上書き可} |
| リトライ | **{なし/あり}** | {理由} |

### 他BFF連携（あれば）

| BFF API | 呼び出し先BFF | エンドポイント | 用途 |
| ------- | :-----------: | -------------- | ---- |
| `{自BFF側パス}` | `{BFF名}` | `{パス}` | {用途} |

---

## エラー処理方針

→ [BFF共通設計書 §6](../01_アプリ/BFF/BFF共通設計書.md#6-エラー型定義正規化ルール) 参照

### このBFF固有の注意事項

<!-- API固有の挙動（lockedByUserName付与等）があればここに記載する。なければ削除する。 -->

---

## 認証・認可・共通ヘッダ

→ [BFF共通設計書 §4](../01_アプリ/BFF/BFF共通設計書.md#4-共通ヘッダ定義)・[§5](../01_アプリ/BFF/BFF共通設計書.md#5-認証認可方針) 参照

<!-- フロント向けBFF: §4.1・§4.2 の方針を適用する -->
<!-- 内部BFF: §4.3・§4.4 の方針を適用する -->
