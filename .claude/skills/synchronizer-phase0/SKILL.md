# synchronizer-phase0 Skill

## 用途

synchronizer Phase 0（準備フェーズ）の全ステップ（S0-1〜S0-6）を実行する。

- **S0-1**: DB 構造の理解（tmp/ 参照）
- **S0-2**: API 分析・マスタアクセスパターン・PostgreSQL 操作推定・実装順序決定
- **S0-3**: ViewModel 設計（外部レスポンス型 → ViewModel 型の変換ロジック概要）
- **S0-4**: infrastructure_scope の判断（none / auth / realtime / all）
- **S0-5**: タスク分解完了（sync-tasklist.md 作成完了）
- **S0-6**: state.md 更新（progress: "sync準備完了。次は Phase 1 から"）

---

## 実行タイミング

- **起動元**: `/synchronizer` コマンド Phase 0 で自動起動
- **入力**: 機能ID（例: REC002）、ドメイン（例: 01_diagnosis）、機能名（例: シェーマ作成）
- **出力**: 
  - `.steering/sync-{date}-{feature}/api-analysis.md`
  - `.steering/sync-{date}-{feature}/external-api-spec.md`
  - `.steering/sync-{date}-{feature}/viewmodel-mapping.md`
  - `.steering/sync-{date}-{feature}/sync-tasklist.md`
  - `.steering/sync-{date}-{feature}/state.md`

---

## 参照スキル・ドキュメント

- **synchronizer-phase0-db**: BE データベース構造の把握（tmp/ の DDL・ドキュメント参照）
  - 参照: `.claude/skills/synchronizer-phase0-db/SKILL.md`
- **design_detail**: フロントエンド個別詳細設計書
  - `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`
- **BFF定義書**: BFF API 仕様書
  - `docs/01_アプリ/BFF/{domain}/{機能グループ}/BFF定義書_【{機能ID}】{機能名}.md`

---

## 処理フロー

### S0-1: DB 構造の理解

**synchronizer-phase0-db スキルを参照して tmp/ のデータベース構造を把握する:**

1. **tmp/docs/02_schema_design.md** を読み込み、スキーマ構成を理解する
   - `cmn` スキーマ: 全テナント共通・読み取り専用
   - `sys` スキーマ: プラットフォーム管理・読み取り専用
   - `tenant` スキーマ: テナント個別・読み書き可能

2. **tmp/cmn/*.sql** をリスト → cmn スキーマのマスタテーブル一覧を抽出
   ```bash
   ls tmp/cmn/*.sql | grep "mst_"
   ```
   - 例: `cmn.mst_drug`（薬剤マスタ）
   - 例: `cmn.mst_labo_test`（検査項目マスタ）
   - 例: `cmn.mst_insurance`（保険者マスタ）

3. **tmp/tenant/*.sql** をリスト → tenant スキーマのマスタテーブル一覧を抽出
   ```bash
   ls tmp/tenant/*.sql | grep "mst_"
   ```
   - 例: `tenant.mst_patient`（患者マスタ）
   - 例: `tenant.mst_department`（部門マスタ）
   - 例: `tenant.mst_organization`（組織マスタ）

4. **tmp/tenant/*.sql** をリスト → tenant スキーマのトランザクションテーブル一覧を抽出
   ```bash
   ls tmp/tenant/*.sql | grep "trn_"
   ```
   - 例: `tenant.trn_encounter`（診察記録）
   - 例: `tenant.trn_labo_result`（検査結果）
   - 例: `tenant.trn_prescription`（処方）

5. **テーブル名プレフィックスから PostgreSQL 操作を推定**:
   - `mst_*` → 主に SELECT（マスタ参照）
   - `trn_*` → INSERT/UPDATE/DELETE（トランザクション）
   - `his_*` → INSERT のみ（自動記録、直接操作禁止）
   - `rel_*` → INSERT/DELETE（多対多関連）

6. **DDL から FK 依存関係を抽出**:
   ```bash
   grep -A 5 "REFERENCES" tmp/tenant/tenant.mst_patient.sql
   ```
   - 例: `tenant.mst_patient` → `cmn.mst_nationality`（国籍マスタ）
   - 例: `tenant.trn_encounter` → `tenant.mst_patient`（患者マスタ）

7. **機能関連テーブルの詳細抽出**（この機能で使用するテーブルのみ）:
   
   各テーブルの DDL ファイルを読み込み、以下を抽出:
   - テーブル名（スキーマ.テーブル名）
   - 論理名（DDL の `-- 論理名` コメント）
   - 説明（DDL の `-- 説明` コメント）
   - 主キー（PK）カラム名
   - 主な格納データ（説明から要約）
   
   **対象**: design_detail の `## 呼び出しAPI一覧` で推定される操作対象テーブル
   
   例: REC002（シェーマ作成）の場合
   ```bash
   # 関連テーブルの DDL を読む
   cat tmp/tenant/tenant.trn_clinical_record.sql | grep -E "^-- (論理名|説明)" | head -2
   cat tmp/tenant/tenant.trn_encounter.sql | grep -E "^-- (論理名|説明)" | head -2
   cat tmp/tenant/tenant.trn_document.sql | grep -E "^-- (論理名|説明)" | head -2
   ```

**出力**: DB 構造サマリを `.steering/sync-{date}-{feature}/db-structure-summary.md` に記録

```markdown
# DB 構造サマリ — {機能ID} {機能名}

## スキーマ構成

```
PostgreSQL DB: emr
├── cmn スキーマ      ── 全テナント共通・読み取り専用
├── sys スキーマ      ── プラットフォーム管理・読み取り専用
├── t_{org_code} スキーマ  ── テナント個別・読み書き可能
```

---

## cmn スキーマ（全テナント共通・読み取り専用）

{機能名}で使用する可能性のあるマスタテーブル:

| テーブル | 論理名 | 用途 |
|---|---|---|
| `cmn.mst_code` | 汎用コードマスタ | 共通コード（単位・ステータス等） |
| `cmn.mst_standard_disease` | 標準病名マスタ | ICD-10 ベースの病名 |
| ... | ... | ... |

---

## tenant スキーマ（テナント個別・読み書き）

### マスタテーブル

| テーブル | 論理名 | 用途 | 操作推定 |
|---|---|---|---|
| `tenant.mst_patient` | 患者マスタ | 患者基本情報 | SELECT |
| `tenant.mst_department` | 部門マスタ | 診療科情報 | SELECT |
| ... | ... | ... | ... |

### トランザクションテーブル（{機能ID} 関連）

| テーブル | 論理名 | 用途 | 操作推定 |
|---|---|---|---|
| `tenant.trn_encounter` | 受診・入院エピソード | 患者の1回の受診または入院 | SELECT/INSERT/UPDATE |
| `tenant.trn_clinical_record` | 診療記録トラン | 医師・看護師等による診療記録（SOAP・経過記録・指示等） | SELECT/INSERT/UPDATE |
| `tenant.trn_document` | 文書管理トラン | 各種文書（診療記録、同意書、紹介状等）の版管理 | SELECT/INSERT/UPDATE |

### 履歴テーブル（自動記録）

| テーブル | 論理名 | 用途 |
|---|---|---|
| `tenant.his_clinical_record` | 診療記録履歴 | trn_clinical_record の変更履歴（トリガー自動記録） |

---

## {機能ID} 関連テーブル詳細

### tenant.trn_clinical_record（診療記録トラン）

**論理名**: 診療記録  
**説明**: 医師・看護師等による診療記録（SOAP・経過記録・指示等）を保持する。電子カルテの中核となるトランザクションテーブル。  
**主キー**: `clinical_record_id` (BIGSERIAL)  
**格納データ**:
- 記録種別（SOAP / PROGRESS / ORDER / NOTE 等）
- 記録本文（TEXT）
- SOAP構造（subjective / objective / assessment / plan）
- 記録日時・記録者
- ステータス（ACTIVE / LOCKED / VOID）

### tenant.trn_encounter（受診・入院エピソード）

**論理名**: 受診・入院エピソード  
**説明**: 患者の1回の外来受診または入院を1エピソードとして管理する。処方・オーダ・診療記録・看護記録など全トランザクションの親単位。FHIR Encounter リソースに対応。  
**主キー**: `encounter_id` (BIGSERIAL)  
**格納データ**:
- 受診種別（OUTPATIENT / INPATIENT / EMERGENCY）
- ステータス（PLANNED / IN_PROGRESS / FINISHED / CANCELLED）
- 診療科・担当医
- 開始日時・終了日時
- 主訴・備考

### tenant.trn_document（文書管理トラン）

**論理名**: 文書管理トラン  
**説明**: 電子カルテにおける各種文書（診療記録、同意書、紹介状、サマリ等）を管理するトランザクションテーブル。版管理・監査・電子署名を想定する。  
**主キー**: `document_id` (BIGSERIAL)  
**格納データ**:
- 文書種別コード・タイトル
- 文書状態（DRAFT / FINAL / SIGNED / VOID）
- 版番号
- ファイル形式（PDF / HTML / JSON 等）・保存パス
- 本文テキスト（構造化保存用）
- 作成者・署名者・署名日時

---

## FK 依存関係

```
tenant.trn_clinical_record
  ├─→ tenant.trn_encounter (encounter_id)
  └─→ tenant.trn_document (document_id) ※ document として保存する場合

tenant.trn_encounter
  ├─→ tenant.mst_organization (organization_id)
  ├─→ tenant.mst_patient (patient_id)
  ├─→ tenant.mst_department (department_code)
  └─→ tenant.mst_doctor (attending_doctor_id)

tenant.trn_document
  ├─→ tenant.mst_patient (patient_id)
  └─→ tenant.trn_encounter (encounter_id)
```

**実装順序推定**:
1. **cmn マスタ GET APIs** — 最優先（BFF 初期化時に必要）
2. **tenant マスタ GET APIs** — FK なしのテーブルから
3. **tenant トランザクション GET APIs** — 親テーブル実装後
4. **tenant トランザクション POST/PUT APIs** — 最後

---

## PostgreSQL 操作推定ルール

| プレフィックス | 操作推定 | 複雑度 |
|---|---|---|
| `mst_*` | SELECT（マスタ参照） | Simple-Medium |
| `trn_*` | INSERT/UPDATE/DELETE（トランザクション） | Medium-Complex |
| `his_*` | INSERT のみ（自動記録、直接操作禁止） | N/A（アプリからは操作しない） |
| `rel_*` | INSERT/DELETE（関連） | Simple |

---

## {機能ID} {機能名}の想定シナリオ

1. **{操作名1}**:
   - `POST /api/v1/...` → `INSERT INTO tenant.trn_xxx`
   
2. **{操作名2}**:
   - `GET /api/v1/.../{id}` → `SELECT * FROM tenant.trn_xxx WHERE id = ?`

3. **{操作名3}**:
   - `PUT /api/v1/.../{id}` → `UPDATE tenant.trn_xxx SET ... WHERE id = ?`
   - 履歴: `his_xxx` へ自動記録（トリガー）

---

## スキーマ権限ルール

| ロール | 対象スキーマ | 権限 |
|---|---|---|
| `role_app_{org_code}` | `t_{org_code}` | 読み書き |
| `role_app_{org_code}` | `cmn` | 読み取りのみ |
| `role_app_{org_code}` | `sys` | 読み取りのみ |

**BE 実装の制約**:
- `cmn` / `sys` スキーマへの INSERT/UPDATE/DELETE は実装しない
- テナント接続時は `search_path = t_{org_code}, cmn, sys, public` を設定
- 履歴テーブル（`his_*`）への直接操作は禁止（トリガー自動記録のみ）

---

## 生成日時

YYYY-MM-DD
```

---

### S0-2: API 分析

**フロントエンド個別詳細設計書と BFF 定義書を分析して API 情報を抽出する:**

#### Step 1: API一覧抽出

1. **design_detail-{CODE}_{機能名}.md** を読み込む
2. **`## 呼び出しAPI一覧`** テーブルをパース
   - 抽出項目: 画面名, BFF名, API名, 用途
   - API 名列から markdown リンクを抽出（BFF 定義書へのリンク）
3. **API 数をカウント**

#### Step 2: BFF定義書の読み込み

各 API について:

1. **API名列の markdown リンクから BFF 定義書パスを抽出**
2. **BFF 定義書を読み込む**
3. **以下のセクションから情報を抽出**:
   - `## API仕様（APIごと）` → HTTP method, path, purpose (概要)
   - `## DTO・型定義` → Request/Response types
   - `## 外部連携定義` → Backend service calls (環境変数名に注目)
   - `## サービス層処理仕様` → Service logic & backend call patterns

#### Step 3: マスタアクセス判定（DB 構造サマリを参照）

各 API について:

1. **`## 外部連携定義` セクションの環境変数を確認**:
   - `MASTER_SERVICE_URL` → **Direct**: BFF → master-domain-service
   - `MASTER_BFF_URL` → **Indirect**: BFF → master-bff → master-domain-service
   - `EXECUTION_SERVICE_URL` → **None**: 機能データのみ
   - **該当なし** → API path パターンをチェック:
     - `/bff/test-item` または `/bff/master` を含む → `[要確認: master-bff 経由の可能性あり]`
     - それ以外 → **None**

2. **バックエンド API path から対象テーブルを推定**（S0-1 の DB 構造サマリを参照）:
   - `/api/v1/master/units` → `cmn.mst_code` (code_type='unit')
   - `/api/v1/test-items` → `cmn.mst_labo_test`
   - `/api/v1/orders/{orderUuid}/test-results` → `tenant.trn_labo_result`

3. **マスタ種別を特定** (units, test-items, modification-reasons, etc.)

#### Step 4: PostgreSQL 操作推定（DB 構造サマリを参照）

各バックエンド API 呼び出しについて:

| HTTP Method | Path Pattern | 対象テーブル | PostgreSQL 操作推定 | 複雑度 |
|---|---|---|---|---|
| GET | /collection?query=... | `cmn.mst_*` / `tenant.mst_*` | `SELECT * WHERE ... LIMIT ... OFFSET ...` | Medium |
| GET | /resource/{id} | `tenant.trn_*` | `SELECT * WHERE id = ?` | Simple |
| POST | /resource | `tenant.trn_*` | `INSERT INTO ...` | Simple-Medium |
| POST | /resource/action | `tenant.trn_*` | `INSERT + UPDATE` (transactional) | Complex |
| PUT | /resource/{id} | `tenant.trn_*` | `UPDATE ... WHERE id = ?` | Simple-Medium |
| DELETE | /resource/{id} | `tenant.trn_*` | `DELETE FROM ... WHERE id = ?` | Simple |

**複雑度の定義**:
- **Simple**: 単一テーブル・条件なし
- **Medium**: 単一テーブル・WHERE句あり または JOIN 1-2テーブル
- **Complex**: JOIN 3+ テーブル または GROUP BY/HAVING
- **Aggregation**: Complex + 集約関数（COUNT/SUM/AVG）

#### Step 5: FK 依存関係の確認（DB 構造サマリを参照）

S0-1 で抽出した FK 依存グラフを参照し、実装順序を決定:

```
tenant.mst_patient → cmn.mst_nationality
tenant.trn_encounter → tenant.mst_patient
tenant.trn_labo_result → tenant.trn_encounter
```

**実装順序推定**:
1. **cmn マスタ GET APIs** — 最優先（BFF 初期化時に必要）
2. **tenant マスタ GET APIs** — FK なしのテーブルから
3. **tenant マスタ POST/PUT APIs** — 親テーブル実装後
4. **tenant トランザクション APIs** — マスタ実装後

#### Step 6: 実装順序決定

1. **Master APIs を最優先リストに追加**
   - Master APIs (Direct/Indirect) は最初に実装が必要
   - 理由: BFF が初期化時に master-domain-service を呼び出すため
2. **操作種別でグループ化**
   - **Group A (read系)**: GET APIs → 並列実装可能
   - **Group B (write系)**: POST/PUT/DELETE APIs → Group A 完了後に実装
3. **推奨順序を生成**:
   - **Phase 1**: BE Controller mocks（Master APIs 優先、次に Feature APIs）
   - **Phase 2**: master-bff（Indirect access が検出された場合）
   - **Phase 3**: execution-bff（Group A 並列、次に Group B）
   - **Phase 4**: FE（API → Repository → Hooks）

**出力**: `.steering/sync-{date}-{feature}/api-analysis.md`

```markdown
# Synchronizer実装計画_[機能名]

## API一覧分析

### 抽出結果
- **API数**: X本
- **マスタアクセスあり**: Y本（Direct: A本, Indirect: B本, Unknown: C本）
- **マスタアクセスなし**: Z本

### API詳細

| No | 画面名 | API | メソッド | マスタアクセス | マスタ種別 | 対象テーブル | 推定PostgreSQL操作 | 複雑度 |
|----|--------|-----|---------|--------------|-----------|------------|------------------|--------|
| 1 | [画面名] | [API path] | GET | Direct | test-items | cmn.mst_labo_test | SELECT * WHERE ... LIMIT 20 | Medium |
| 2 | [画面名] | [API path] | POST | None | - | tenant.trn_labo_result | INSERT INTO ... | Simple-Medium |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

## マスタアクセスパターン

### Direct Access (BFF → master-domain-service)
- **環境変数**: `MASTER_SERVICE_URL`
- **API 1**: `GET /api/v1/test-items` (test-items) → `cmn.mst_labo_test`
- **検出根拠**: BFF定義書 L42「環境変数: MASTER_SERVICE_URL」

### Indirect Access (BFF → master-bff → master-domain-service)
（該当なし）

### No Master Access (BFF → execution-domain-service)
- **API 2**: `POST /api/v1/orders/{orderUuid}/test-results` → `tenant.trn_labo_result`

## FK 依存関係（DB 構造サマリより）

```
tenant.trn_labo_result → tenant.trn_encounter
tenant.trn_encounter → tenant.mst_patient
tenant.mst_patient → cmn.mst_nationality
```

## 実装順序推定

### Phase 1: BE Controller mocks（Master APIs 優先）
1. `GET /api/v1/test-items` (cmn.mst_labo_test)
2. `POST /api/v1/orders/{orderUuid}/test-results` (tenant.trn_labo_result)

### Phase 2: master-bff（スキップ — Indirect access なし）

### Phase 3: execution-bff
- **Group A (read系)**: なし
- **Group B (write系)**: 
  - `POST /api/v1/orders/{orderUuid}/test-results`

### Phase 4: FE（API → Repository → Hooks）
- `postTestResults.api.ts`
- `testResultsRepository.ts`
- `useTestResultsSubmit.ts`
```

---

### S0-3: ViewModel 設計

**S0-2 の API 分析結果を元に、外部レスポンス型 → ViewModel 型の変換ロジックを設計する:**

1. **外部レスポンス型を特定** (BFF 定義書の `## DTO・型定義` セクション)
2. **フロントエンド表示要件を確認** (design_detail の `## 状態管理ルール（画面固有）` セクション)
3. **ViewModel 型を設計** (必要なフィールドのみ抽出・整形)
4. **変換ロジックの概要を記述** (マッピング・集約・フィルタリング等)

**出力**: `.steering/sync-{date}-{feature}/viewmodel-mapping.md`

```markdown
# ViewModel 設計_[機能名]

## 外部レスポンス型 → ViewModel 型

### API 1: POST /bff/orders/{orderUuid}/test-results

#### 外部レスポンス型（BE）
```typescript
// Backend: SaveTestResultsResponse.cs
{
  orderUuid: string;
  testResults: Array<{
    itemId: string;
    itemName: string;
    value: string;
    unit: string;
    referenceRange: string;
  }>;
}
```

#### ViewModel 型（FE）
```typescript
// Frontend: testResults.type.ts
type TestResultViewModel = {
  itemName: string;
  value: string;
  unit: string;
  isAbnormal: boolean; // 派生フィールド（referenceRange と value の比較結果）
};
```

#### 変換ロジック
- `itemName` / `value` / `unit` はそのままコピー
- `isAbnormal` は `referenceRange` と `value` を比較して判定（BFF Service 層で計算）
- `itemId` / `orderUuid` はフロントエンド表示に不要のため除外
```

---

### S0-4: infrastructure_scope の判断

**機能の要件を元に、Phase 9（基盤要素実装）の実装範囲を判断する:**

| 値 | 意味 | Phase 9 の対象 |
|---|---|---|
| `none` | 機能固有の通信のみ（認証・通知不要） | Phase 9 スキップ可 |
| `auth` | 認証必須（ログイン後の操作） | S9-1（認証）+ S9-2（ミドルウェア）必須 |
| `realtime` | リアルタイム通知必須 | S9-3（通知）必須 |
| `all` | 認証・通知・監査ログ全て必須 | Phase 9 全タスク必須 |

**判断基準**:
- design_detail の `## セキュリティ要件` セクションを確認
- ログイン後の操作 → `auth` 以上
- リアルタイム通知が必要 → `realtime` または `all`
- 監査ログが必要 → `all`

初回の機能では `all` を推奨（基盤を一度実装すれば、2回目以降は再利用のみ）。

---

### S0-5: タスク分解完了

**標準フェーズヘッダーを含む sync-tasklist.md を作成する:**

`.steering/sync-{date}-{feature}/sync-tasklist.md` に以下を記述:

```markdown
# 3層同期実装タスクリスト

## Phase 0: 準備（スコープ確定・設計）

- [x] S0-1: DB 構造の理解（tmp/ 参照）
- [x] S0-2: API 分析（マスタアクセスパターン・PostgreSQL 操作推定・実装順序決定）
- [x] S0-3: ViewModel 設計（外部レスポンス型 → ViewModel 型の変換ロジック概要）
- [x] S0-4: infrastructure_scope の判断（none / auth / realtime / all）
- [x] S0-5: タスク分解完了（本タスクリスト作成完了）
- [ ] S0-6: state.md 更新（progress: "sync準備完了。次は Phase 1 から"）

## Phase 1: 型定義（FE / BFF / BE）

- [ ] S1-1: BE リクエスト型・レスポンス型定義（C# record / class）
- [ ] S1-2: BFF internal 型定義（`*.api.request.ts` / `*.api.response.ts`）
- [ ] S1-3: BFF → FE 共有型定義（`front_bff_shared/features/*/types/responses/*.response.ts`）
- [ ] S1-4: FE ViewModel 型定義（`features/*/types/*.type.ts`）
- [ ] S1-5: Zod スキーマ定義（`front_bff_shared/features/*/schemas/*.schema.ts`）

## Phase 2: BE Controller モック実装

- [ ] S2-1: Controller 実装 — IF 仕様に沿った固定値を返す
          ※ 全エンドポイントに X-Tenant-Id / X-Correlation-ID / Authorization の [FromHeader] を宣言する
- [ ] S2-2: Program.cs へのルーティング登録確認
- [ ] S2-3: Swagger 定義確認（BE の OpenAPI ドキュメント生成）

## Phase 3: BFF Client 層

- [ ] S3-1: `*.clients.ts` 実装 — axios で BE エンドポイントを呼び出す
          ※ BFF 層にモックデータを置かない。BE がモック中でも axios.get/post で BE を呼ぶ実装にする

## Phase 4: BFF Service 層

- [ ] S4-1: `*.services.ts` 実装 — Client 呼び出し・データ整形・ViewModel マッピング
          ※ HTTP レスポンス操作（status / header 設定）は Service に書かない
- [ ] S4-2: 変換ロジックの単体テスト（`*.services.test.ts`）

## Phase 5: BFF Controller 層

- [ ] S5-1: `*.controllers.ts` 実装 — エンドポイント定義・共通ヘッダー受け取り・Service 呼び出し
          ※ 全エンドポイントに X-Tenant-Id / X-Correlation-ID / Authorization の @Headers() を宣言する
- [ ] S5-2: Controller 統合テスト（`*.controllers.test.ts`）

## Phase 6: Module 登録

- [ ] S6-1: `*.module.ts` 作成 — Controller / Service / Client を NestJS モジュールに登録
- [ ] S6-2: `app.module.ts` へのインポート確認

## Phase 7: FE API 層・Repository 層

- [ ] S7-1: `api/*.api.ts` 実装 — BFF エンドポイント呼び出し（axiosClient 使用）
- [ ] S7-2: `repository/*.repository.ts` 実装 — 並列呼び出し・保存処理
- [ ] S7-3: API 層の単体テスト（MSW でモック）

## Phase 8: 整合性チェック

- [ ] S8-1: 型の整合性（`front_bff_shared/` の型が BFF の `*.type.ts` と構造一致）
- [ ] S8-2: エラーコードの整合性（BFF が返すエラーコードが一覧に登録済み）
- [ ] S8-3: エンドポイントカバレッジ（設計書の API 一覧と実装が全て対応）

## Phase 9: 基盤要素実装（infrastructure_scope により必須/任意が決まる）

**infrastructure_scope: {判断結果} の場合**: {必須タスク}

- [ ] S9-1: 認証・セッション管理（JWT検証・AuthGuard・authStore・Cookie管理）
- [ ] S9-2: ミドルウェア層（security.middleware / decryption.middleware / RequestContext）
- [ ] S9-3: リアルタイム通知（NotificationGateway / useNotification / notification.store）
- [ ] S9-4: i18n リソース管理（front_bff_shared/i18n/ の labels / validation / errors）
- [ ] S9-5: 監査ログ（auditLogClient.ts 実装・送信タイミング確認）
- [ ] S9-6: Store ライフサイクル管理（storeRegistry.ts / tenantStore.ts 実装）
```

---

### S0-6: state.md 更新

**Phase 0 完了を記録し、次のセッションに引き継ぐ:**

`.steering/sync-{date}-{feature}/state.md` を以下の内容で更新:

```yaml
feature: "{domain}/Fxx_機能名"
phase: synchronizer
progress: "sync準備完了。次は Phase 1（S1-1: BE 型定義）から"
last_updated: "YYYY-MM-DD"
infrastructure_scope: "{判断結果}"  # none | auth | realtime | all
completed_phases:
  - "Phase 0: 準備（スコープ確定・設計） ✅ YYYY-MM-DD"
```

**このセッションを終了する。**

---

## 制約事項

- S0-1〜S0-6 は必ず順番に実行すること
- S0-1 でDB構造を理解してから S0-2 の API 分析を実行すること
- S0-2 の結果を S0-3 の ViewModel 設計に反映すること
- Phase 0 完了後は必ず state.md を更新してから次の Phase へ進むこと

---

## 更新履歴

- 2026-05-21: 初版作成（synchronizer Phase 0 の統合スキル）
