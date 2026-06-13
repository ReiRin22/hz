# 実装引き継ぎ: フロント・BFF・バックエンド不整合修正

作成日: 2026-04-22  
最終更新: 2026-04-22（K・L・M・N 対応済み確認・疎通テスト実施・O 追記）

## 概要

フロントエンド・BFF・バックエンド間の実装整合性レビューで検出した不整合。  
次セッションで修正対応すること。

---

## 疎通テスト結果サマリ（2026-04-22 更新）

### バックエンド直接疎通（ポート 7121）

| エンドポイント | HTTP ステータス | 結果 |
|---|---|---|
| `GET /api/v1/master/units` | 200 | ✅ |
| `GET /api/v1/master/modification-reasons` | 200 | ✅ |
| `GET /api/v1/master/test-items` | 200 | ✅ |
| `GET /api/v1/master/test-items?itemCode=GLU` | 200 | ✅（絞り込み未実装・全件返却） |
| `GET /api/v1/orders/{uuid}/test-results` | 200 | ✅ |
| `POST /api/v1/orders/{uuid}/test-results/lock` | 200 | ✅ |
| `DELETE /api/v1/orders/{uuid}/test-results/lock` | 204 | ✅ |
| `POST /api/v1/orders/{uuid}/test-results`（保存） | 200 | ✅ |

### BFF 経由疎通（ポート 3001、プレフィックス `/api/bff`）— 2026-04-22 再計測

| エンドポイント | HTTP ステータス | 結果 |
|---|---|---|
| `POST /api/bff/orders/{uuid}/test-results`（initTestResults） | 201 | ⚠️ データ正常・HTTP 201 が返る（200 期待） |
| `GET /api/bff/test-items` | 200 | ✅ `referenceValueDisplay: "70–110"` — 問題 M 解消 |
| `GET /api/bff/test-items?itemCode=GLU` | 200 | ✅（絞り込みはバックエンド未実装・全件返却） |
| `GET /api/bff/modification-reason` | 200 | ✅ `{ code, label }` 形式 — 問題 L 解消 |
| `POST /api/bff/orders/{uuid}/test-results/save` | 200 | ✅ `{ orderUuid, savedAt }` 正常返却 — 問題 N 解消 |

---

## ステータスサマリ

| # | 課題 | 重大度 | 状態 |
|---|---|---|---|
| **J** | **バックエンドコンテナ未リビルドにより camelCase で返却中** | **重大** | ✅ 対応済み（`dotnet run` で再起動、snake_case 確認済み） |
| **K** | **`fetchUnits` 戻り型ミスマッチ（配列宣言だが実際は `{units:[]}` オブジェクト）** | **重大** | ✅ 対応済み（BFF `backend.type.ts` + `test-results.client.ts` 修正） |
| **L** | **`fetchModificationReasons` 戻り型ミスマッチ（配列宣言だが実際は `{reasons:[]}` オブジェクト）** | **重大** | ✅ 対応済み（BFF `backend.type.ts` + `test-results.client.ts` 修正） |
| M | `referenceValueDisplay` が `"undefined–undefined"` になる | 警告 | ✅ 解消（J + K 修正により `"70–110"` が返ることを疎通確認） |
| N | save レスポンスが `{}`（snake_case 未反映で値が undefined） | 警告 | ✅ 解消（J 修正 + `@HttpCode(HttpStatus.OK)` 追加で HTTP 200・正常ボディ確認） |
| **O** | **`initTestResults` が HTTP 201 を返す（200 期待）** | **警告** | ✅ 対応済み（`@HttpCode(HttpStatus.OK)` 追加） |

---

## ❌ [重大 J] バックエンドコンテナ未リビルド → 実際は camelCase で返却中

**症状**: `initTestResults` が 500、`modification-reason` が 500、save レスポンスが `{}`

`Program.cs` に `SnakeCaseLower` は設定済みだが、**コンテナがリビルドされていないため旧バイナリが動作中**。  
実測すると全レスポンスが camelCase（`orderUuid`, `testResults`, `units`, `reasons`, `lockedAt` 等）で返ってくる。  
BFF の `backend.type.ts` は snake_case 前提で書かれているため、全フィールドアクセスが `undefined` になる。

**修正方針**: バックエンドコンテナをリビルドする

```bash
docker compose build karte-domain-service
docker compose up -d karte-domain-service
```

**対応結果（2026-04-22）**: Docker が使えない環境のため、PID kill → `dotnet run` で再起動。  
`lower_limit`・`upper_limit` 等が snake_case で返ることを確認済み。M・N も連鎖解消見込み。

---

## ❌ [重大 K] `fetchUnits` 戻り型ミスマッチ

**症状**: `initTestResults`（BFF-1）が 500 エラー

`TestResultsClient.fetchUnits` の戻り型は `BackendUnitRecord[]`（配列）と宣言されているが、  
実際のバックエンドレスポンスは `{ "units": [...] }` のラッパーオブジェクト。

| 宣言 | 実際のレスポンス |
|---|---|
| `Promise<BackendUnitRecord[]>` | `{ units: [{ code, name }] }` |

J（コンテナリビルド）を適用しても構造ミスマッチは残る。

**修正方針**:

変更ファイル① `product/bff/src/features/execution/test-results/types/backend.type.ts` に追加:

```typescript
export type BackendUnitsGetResponse = {
  units: BackendUnitRecord[];
};
```

変更ファイル② `product/bff/src/features/execution/test-results/test-results.client.ts`

```typescript
// 修正前
async fetchUnits(correlationId: string): Promise<BackendUnitRecord[]> {
  const response = await axiosClient.get<BackendUnitRecord[]>('/api/v1/master/units', ...)
  return response.data;
}

// 修正後
async fetchUnits(correlationId: string): Promise<BackendUnitRecord[]> {
  const response = await axiosClient.get<BackendUnitsGetResponse>('/api/v1/master/units', ...)
  return response.data.units;
}
```

**関連ファイル**:
- `product/bff/src/features/execution/test-results/test-results.client.ts`
- `product/bff/src/features/execution/test-results/types/backend.type.ts`

---

## ❌ [重大 L] `fetchModificationReasons` 戻り型ミスマッチ

**症状**: `modification-reason`（BFF-4）が 500 エラー（`{ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }`）

`TestResultsClient.fetchModificationReasons` の戻り型は `BackendModificationReasonRecord[]`（配列）と宣言されているが、  
実際のバックエンドレスポンスは `{ "reasons": [...] }` のラッパーオブジェクト。

| 宣言 | 実際のレスポンス |
|---|---|
| `Promise<BackendModificationReasonRecord[]>` | `{ reasons: [{ code, name }] }` |

**修正方針**:

変更ファイル① `product/bff/src/features/execution/test-results/types/backend.type.ts` に追加:

```typescript
export type BackendModificationReasonsGetResponse = {
  reasons: BackendModificationReasonRecord[];
};
```

変更ファイル② `product/bff/src/features/execution/test-results/test-results.client.ts`

```typescript
// 修正前
async fetchModificationReasons(correlationId: string): Promise<BackendModificationReasonRecord[]> {
  const response = await axiosClient.get<BackendModificationReasonRecord[]>('/api/v1/master/modification-reasons', ...)
  return response.data;
}

// 修正後
async fetchModificationReasons(correlationId: string): Promise<BackendModificationReasonRecord[]> {
  const response = await axiosClient.get<BackendModificationReasonsGetResponse>('/api/v1/master/modification-reasons', ...)
  return response.data.reasons;
}
```

**関連ファイル**: `product/bff/src/features/execution/test-results/test-results.client.ts`

---

## ❌ [警告 M] `referenceValueDisplay` が `"undefined–undefined"` になる（J 修正で解消見込み）

**症状**: `GET /api/bff/test-items` のレスポンスで `referenceValueDisplay: "undefined–undefined"`

`test-results.service.ts` の `searchTestItems` が `r.lower_limit`・`r.upper_limit` を参照しているが、  
バックエンドが camelCase（`lowerLimit`/`upperLimit`）で返しているため `undefined` になる。  
J（コンテナリビルド）で `SnakeCaseLower` が有効になれば解消する見込み。

**関連ファイル**: `product/bff/src/features/execution/test-results/test-results.service.ts`

---

## ❌ [警告 N] save レスポンスが `{}` になる（J 修正で解消見込み）

**症状**: `POST /api/bff/orders/{uuid}/test-results/save` が HTTP 201 で `{}` を返す

`BackendSaveResponse` の型は `{ order_uuid: string; saved_at: string }` だが、  
バックエンドが camelCase（`orderUuid`/`savedAt`）で返しているため両フィールドが `undefined` となり JSON 出力から省略される。  
J（コンテナリビルド）で `SnakeCaseLower` が有効になれば解消する見込み。

なお HTTP ステータスが 200 でなく 201 になっているのは NestJS の `@Post` がデフォルト 201 を返すため。  
設計書上 200 が期待されているなら `@HttpCode(HttpStatus.OK)` をコントローラーに追加する。

**関連ファイル**:
- `product/bff/src/features/execution/test-results/test-results.client.ts`
- `product/bff/src/features/execution/test-results/test-results.controller.ts`（`@HttpCode` 追加要否を確認）

---

## 対応優先順位

| 優先 | # | 課題 | 対応タイミング |
|---|---|---|---|
| ~~1~~ | ~~**J**~~ | ~~バックエンドコンテナリビルド~~ | ✅ 対応済み |
| ~~2~~ | ~~**K**~~ | ~~`fetchUnits` 戻り型修正~~ | ✅ 対応済み |
| ~~3~~ | ~~**L**~~ | ~~`fetchModificationReasons` 戻り型修正~~ | ✅ 対応済み |
| ~~4~~ | ~~N~~ | ~~save の HTTP 201 → 200~~ | ✅ 対応済み |
| ~~1~~ | ~~**O**~~ | ~~`initTestResults` の HTTP 201 → 200~~ | ✅ 対応済み |
| ~~1~~ | ~~**P**~~ | ~~フロント: APIエラーレスポンスのエラーコード別処理が未実装~~ | ✅ 対応済み（2026-04-23） |
| ~~2~~ | ~~**Q**~~ | ~~フロント: `shared/validators` の E002 コード誤り（小数点桁数に E002 を使用）~~ | ✅ 対応済み（2026-04-23） |
| ~~3~~ | ~~**R**~~ | ~~フロント: `shared/hooks` 2ファイルが廃止済みAPIシグネチャを参照（コンパイルエラー）~~ | ✅ 対応済み（2026-04-23） |
| ~~4~~ | ~~S~~ | ~~BFF: BAD_GATEWAY (502) 時の E998 伝播ハンドリング不完全~~ | ✅ 対応済み（2026-04-23） |
| ~~5~~ | ~~T~~ | ~~バックエンド: `LockConflictException` が 409 に変換されない~~ | ✅ 対応済み（2026-04-23） |
| ~~6~~ | ~~U~~ | ~~フロント: `hasTestDate` フラグの列表示制御未実装~~ | ✅ 対応済み（2026-04-23） |
| ~~7~~ | ~~V~~ | ~~フロント: 手動追加行の `referenceValueDisplay` でハイフン（U+002D）を使用（EN DASH 期待）~~ | ✅ 対応済み（2026-04-23） |
| ~~8~~ | ~~W~~ | ~~BFF/BE: `X-Tenant-Id` ヘッダがBFF→バックエンド転送で欠落~~ | ✅ 対応済み（2026-04-23） |
| ~~9~~ | ~~X~~ | ~~フロント: `modificationReasonService` の `X-Correlation-ID` ヘッダ欠落~~ | ✅ 対応済み（2026-04-23） |

---

## コンテナ別修正作業

各コンテナで担当する修正をまとめる。問題 J〜N との対応も示す。

---

### フロントエンド（product-frontend-1）で修正するもの

**問題 1: 修正理由のレスポンス型ミスマッチ** ✅ 対応済み（2026-04-22）

~~`modification-reason-service.ts` が `string[]` を期待しているが、BFF は `{ reasons: [{ code, label }] }` を返す。~~

対応内容:
- `modification-reason-service.ts`: 戻り型を `string[]` → `Promise<ModificationReasonOption[]>` に変更。`res.json()` から `data.reasons` を返すよう修正
- `ReasonDialog.tsx`: `reasons` props 型を `ModificationReasonOption[]` に変更。ラジオの value/key を `reason.code`、表示を `reason.label` に変更。`onConfirm` に渡す値を `reason.code` に変更
- `TestResultInputPage.tsx`: `modificationReasons` state 型を `string[]` → `ModificationReasonOption[]` に変更

---

### BFF（product-bff-1）で修正するもの

**問題 O: `initTestResults` が HTTP 201 を返す**

NestJS の `@Post` はデフォルトで HTTP 201 を返す。`saveTestResults` と同様に `@HttpCode(HttpStatus.OK)` が必要。

```
product/bff/src/features/execution/test-results/test-results.controller.ts
  initTestResults エンドポイントに @HttpCode(HttpStatus.OK) を追加
```

---

**問題 K: `fetchUnits` 戻り型ミスマッチ** ✅ 対応済み

宣言は `BackendUnitRecord[]`（配列）だが、実際のレスポンスは `{ units: [...] }` ラッパーオブジェクト。

```
product/bff/src/features/execution/test-results/types/backend.type.ts
  追加: export type BackendUnitsGetResponse = { units: BackendUnitRecord[] }

product/bff/src/features/execution/test-results/test-results.client.ts
  fetchUnits の型引数を BackendUnitsGetResponse に変更
  return response.data → return response.data.units に変更
```

**問題 L: `fetchModificationReasons` 戻り型ミスマッチ** ✅ 対応済み

宣言は `BackendModificationReasonRecord[]`（配列）だが、実際のレスポンスは `{ reasons: [...] }` ラッパーオブジェクト。

```
product/bff/src/features/execution/test-results/types/backend.type.ts
  追加: export type BackendModificationReasonsGetResponse = { reasons: BackendModificationReasonRecord[] }

product/bff/src/features/execution/test-results/test-results.client.ts
  fetchModificationReasons の型引数を BackendModificationReasonsGetResponse に変更
  return response.data → return response.data.reasons に変更
```

**問題 M** ✅ 解消（疎通確認済み）

**問題 N** ✅ 解消（`@HttpCode(HttpStatus.OK)` 追加 + 疎通確認済み）

---

### バックエンド（product-karte-domain-service-1）で修正するもの

現状はモック返却で疎通確認済み（問題 J は対応済み）。追加で対応が必要な場合は以下。

**`BackendTestResultRecord` の欠落フィールド（低優先）**

バックエンドモデルに `IsAutoLinked`・`ConfirmedAt` があるが、BFF の `backend.type.ts` に型定義がない。  
本実装時に取りこぼしになるため、モックレスポンスにも含める。

```
product/backend/KarteDomainService/Features/ExamResult/Controllers/TestResultsController.cs
  モックレスポンスの TestResultRecord に IsAutoLinked・ConfirmedAt を追加
```

---

## 2026-04-23 整合性レビュー検出問題（P〜X）

### ❌ [High P] フロント: APIエラーレスポンスのエラーコード別処理が未実装

**症状**: BFF が返す `{ type, code, message }` 形式のエラーレスポンスを全エンドポイントで無視し、`throw new Error(... failed: ${res.status})` のみ実装している。

設計書で規定された E003〜E999 のエラーコードごとのダイアログ表示（E006=NOT_FOUND、E007=競合、E008=バリデーション等）が動作しない。

**対象ファイル**:
- `product/frontend/src/features/06_exam-result/02_result-input/01_result-entry/features/test-results/api/test-results-service.ts` (`initTestResults`, `confirmTestResults`)
- `product/frontend/src/features/06_exam-result/02_result-input/01_result-entry/features/modification-reason/api/modification-reason-service.ts`
- `product/frontend/src/features/06_exam-result/02_result-input/01_result-entry/features/test-items/api/test-items-service.ts`
- `product/frontend/src/features/06_exam-result/02_result-input/01_result-entry/pages/TestResultInputPage.tsx`

**修正方針**: `res.ok` でない場合に `res.json()` を読んで `code` フィールドを取得し、エラーコードに応じた表示分岐を実装する。

---

### ❌ [High Q] フロント: `shared/validators` の E002 コード誤り

**症状**: `shared/validators/test-results/test-result.schema.ts` の `resultValueWithDecimalSchema` が小数点桁数オーバーのエラーコードとして `'E002'` を返しているが、設計書の E002 は「下限値は上限値以下で入力してください」（基準値の相関チェック）。

小数点桁数のエラーは設計書上 E001（数値フォーマットエラー）で扱うべき。

**対象ファイル**:
- `product/frontend/src/shared/validators/test-results/test-result.schema.ts`

---

### ❌ [High R] フロント: `shared/hooks` が廃止済みAPIシグネチャを参照（コンパイルエラー）

**症状**: 以下の2ファイルが `shared/api/test-results/test-results-service.ts` に存在しないメソッドを呼び出しており、TypeScript コンパイルエラーが発生する。

- `useGetTestResults.ts`: `testResultsService.getTestResults(patientId)` を呼び出し（廃止済み）
- `useTestResultMutations.ts`: `createTestResult` / `updateTestResult` / `deleteTestResults` / `confirmTestResults(ids, reason)` を呼び出し（廃止済み）

現在の画面実装（`use-test-results.ts`）では使用されていないデッドコード。

**対象ファイル**:
- `product/frontend/src/shared/hooks/test-results/useGetTestResults.ts`
- `product/frontend/src/shared/hooks/test-results/useTestResultMutations.ts`

**修正方針**: 削除 or 現行の `testResultsService` API シグネチャ（`initTestResults` / `confirmTestResults`）に合わせて書き直す。

---

### ⚠️ [Medium S] BFF: BAD_GATEWAY (502) 時の E998 伝播ハンドリング不完全

`test-results.service.ts` の `searchTestItems` は master-bff 障害時に 502 を受け取るが、service 層での明示的な判定がない。BFF定義書では「master-bff 障害時 502 で BAD_GATEWAY を返す」と定義。

**対象ファイル**: `product/bff/src/features/execution/test-results/test-results.service.ts`

---

### ⚠️ [Medium T] バックエンド: `LockConflictException` が 409 に変換されない

`TestResultsController.cs` の `SaveTestResults` は `LockExpiredException` のみキャッチしており、`LockConflictException` をキャッチしない。BFF は 409 LOCK_CONFLICT を受け取って `lockedByUserName` 付きの CONFLICT を返す仕様だが、バックエンドがその例外を 409 に変換する実装がない。

**対象ファイル**: `product/backend/KarteDomainService/Features/ExamResult/Controllers/TestResultsController.cs`

---

### ⚠️ [Medium U] フロント: `hasTestDate` フラグの列表示制御未実装

設計書の `COL_TEST_DATE` は `hasTestDate=true` の場合のみ表示する仕様だが、`TestResult` 型に `hasTestDate` フィールドが定義されておらず、テーブルで常時表示になっている可能性がある。

**対象ファイル**:
- `product/frontend/src/features/06_exam-result/02_result-input/01_result-entry/components/organisms/TestResultTable.tsx`
- `product/frontend/src/features/06_exam-result/02_result-input/01_result-entry/lib/types.ts`

---

### ⚠️ [Medium V] フロント: 手動追加行の `referenceValueDisplay` でハイフン（U+002D）を使用（EN DASH 期待）

`TestResultInputPage.tsx` の `handleTestItemSelect` が `"${lowerReference}-${upperReference}"` でハイフン（U+002D）を使用。BFF定義書では EN DASH（U+2013）で整形する仕様のため、既存行と書式が異なる。

**対象ファイル**: `product/frontend/src/features/06_exam-result/02_result-input/01_result-entry/pages/TestResultInputPage.tsx`

---

### 🔵 [Low W] BFF/BE: `X-Tenant-Id` ヘッダがBFF→バックエンド転送で欠落

BFF の `TestResultsController.ts` 全エンドポイントで `X-Tenant-Id` ヘッダを取得・転送していないが、バックエンドは `[FromHeader]` で必須として定義している。

**対象ファイル**: `product/bff/src/features/execution/test-results/test-results.controller.ts`

---

### 🔵 [Low X] フロント: `modificationReasonService` の `X-Correlation-ID` ヘッダ欠落

`modification-reason-service.ts` の fetch に `X-Correlation-ID` ヘッダが設定されていない。他の全fetchは `correlationId` を設定済み。

**対象ファイル**: `product/frontend/src/features/06_exam-result/02_result-input/01_result-entry/features/modification-reason/api/modification-reason-service.ts`
