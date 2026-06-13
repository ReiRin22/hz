# synchronizer-phase0-db Skill

## 用途

synchronizer Phase 0（S0-2）において、**BE（C# master-domain-service / execution-domain-service）のデータベース構造を分析し、PostgreSQL 操作推定・マスタアクセスパターン・実装順序決定の根拠を提供する。**

このスキルは `app-synchronizer-planner` が Phase 0 実行時に参照する。

---

## 参照元

- **tmp/docs/** — DB 設計ドキュメント
- **tmp/cmn/** — 共通参照スキーマ DDL
- **tmp/sys/** — システム管理スキーマ DDL
- **tmp/tenant/** — テナント個別スキーマ DDL テンプレート

---

## BE データベース構造の把握

### 1. スキーマ構成

```
PostgreSQL DB: emr
├── cmn スキーマ      ── 全テナント共通の参照マスタ（読み取り専用）
├── sys スキーマ      ── プラットフォーム管理（テナント管理・RBAC、読み取り専用）
├── t_h0001 スキーマ  ── 医療機関 h0001 の個別データ（読み書き）
├── t_h0002 スキーマ  ── 医療機関 h0002 の個別データ（読み書き）
└── ...
```

**重要**:
- `cmn` / `sys` スキーマは全テナント共通・読み取り専用
- `t_{org_code}` スキーマはテナント個別・読み書き可能
- アプリケーションからの `cmn` / `sys` への書き込みは禁止
- `tenant_id` 列は不要（スキーマ分離でテナント識別）

### 2. テーブル命名規則

DDL ファイル名: `{スキーマ名}.{テーブル名}.sql`

| プレフィックス | 種別 | 例 | PostgreSQL 操作推定 |
|---|---|---|---|
| `mst_` | マスタテーブル | `mst_patient`, `mst_drug` | 主に SELECT（参照） |
| `trn_` | トランザクションテーブル | `trn_encounter`, `trn_order` | INSERT/UPDATE/DELETE（登録・更新・削除） |
| `his_` | 履歴・監査テーブル | `his_prescription` | INSERT のみ（自動記録、直接操作禁止） |
| `rel_` | 関連テーブル（多対多） | `rel_user_role` | INSERT/DELETE（関連追加・削除） |
| `raw_` | 外部取込生データ | `raw_hot_drug` | INSERT/TRUNCATE（バッチ取込） |

---

## マスタアクセスパターン分析手順

`app-synchronizer-planner` は以下の手順で BE 構造を分析する:

### Step 1: マスタテーブルの特定

1. **tmp/docs/03_table_list.md** を参照（存在する場合）
2. **tmp/cmn/*.sql** をリスト → `cmn` スキーマの全マスタテーブルを抽出
3. **tmp/tenant/tenant.mst_*.sql** をリスト → テナント個別マスタテーブルを抽出

**出力例**:
```yaml
cmn スキーマ（全テナント共通・読み取り専用）:
  - cmn.mst_drug（薬剤マスタ）
  - cmn.mst_standard_disease（標準病名マスタ）
  - cmn.mst_insurance（保険者マスタ）
  - cmn.mst_labo_test（検査項目マスタ）
  - cmn.mst_imaging_modality（画像検査モダリティマスタ）
  - cmn.mst_nationality（国籍マスタ）
  - cmn.mst_dosage_instruction（用法マスタ）
  - cmn.mst_frequency（投与頻度マスタ）

tenant スキーマ（テナント個別・読み書き）:
  - tenant.mst_patient（患者マスタ）
  - tenant.mst_organization（組織マスタ）
  - tenant.mst_department（部門マスタ）
  - tenant.mst_user（ユーザマスタ）
  - tenant.mst_bed（ベッドマスタ）
```

### Step 2: PostgreSQL 操作の推定

BFF が呼び出す BE API の HTTP method とテーブル種別から操作を推定:

| HTTP Method | Path Pattern | 対象テーブル | PostgreSQL 操作推定 | 複雑度 |
|---|---|---|---|---|
| GET | `/api/v1/master/units` | `cmn.mst_code` (code_type='unit') | `SELECT * FROM cmn.mst_code WHERE code_type = 'unit'` | Simple |
| GET | `/api/v1/test-items?itemName=血糖` | `cmn.mst_labo_test` | `SELECT * FROM cmn.mst_labo_test WHERE item_name LIKE '%血糖%' LIMIT 20` | Medium |
| POST | `/api/v1/orders/{orderUuid}/test-results` | `tenant.trn_labo_result` | `INSERT INTO tenant.trn_labo_result (...) VALUES (...)` | Simple-Medium |
| PUT | `/api/v1/test-results/{id}` | `tenant.trn_labo_result` | `UPDATE tenant.trn_labo_result SET ... WHERE id = ?` | Simple-Medium |
| DELETE | `/api/v1/orders/{orderUuid}/test-results/{id}` | `tenant.trn_labo_result` | `DELETE FROM tenant.trn_labo_result WHERE id = ?` | Simple |

**複雑度の定義**:
- **Simple**: 単一テーブル・条件なし
- **Medium**: 単一テーブル・WHERE句あり または JOIN 1-2テーブル
- **Complex**: JOIN 3+ テーブル または GROUP BY/HAVING
- **Aggregation**: Complex + 集約関数（COUNT/SUM/AVG）

### Step 3: FK 依存関係の抽出

DDL ファイルから `REFERENCES` 句を検索し、FK 依存グラフを構築:

```bash
# 例: tenant.mst_patient の FK を抽出
grep -A 5 "REFERENCES" tmp/tenant/tenant.mst_patient.sql
```

**出力例**:
```sql
CONSTRAINT fk_mst_patient_nationality
    FOREIGN KEY (nationality_code)
    REFERENCES cmn.mst_nationality(nationality_code)
```

**依存グラフ**:
```
tenant.mst_patient → cmn.mst_nationality（国籍マスタ）
tenant.trn_encounter → tenant.mst_patient（患者マスタ）
tenant.trn_encounter → tenant.mst_department（診療科マスタ）
```

**実装順序推定**:
1. **cmn マスタ（読み取り専用）** — 最優先（BFF 初期化時に必要）
2. **tenant マスタ（FK なし）** — 次優先
3. **tenant マスタ（FK あり）** — 親テーブル実装後
4. **tenant トランザクション** — マスタ実装後

### Step 4: 履歴テーブル（his_*）の扱い

```yaml
履歴テーブルの特徴:
  - PostgreSQL トリガーで自動記録（AFTER INSERT/UPDATE/DELETE）
  - アプリケーションからの直接操作は禁止
  - BE API 実装時に his_* への操作コードは書かない
```

**例**:
- `tenant.trn_prescription` に INSERT → `tenant.his_prescription` へ自動記録
- BE Controller は `trn_prescription` のみ操作し、`his_prescription` には触れない

---

## スキーマ権限ルール

| ロール | 対象スキーマ | 権限 |
|---|---|---|
| `role_app_{org_code}` | `t_{org_code}` | 読み書き |
| `role_app_{org_code}` | `cmn` | 読み取りのみ |
| `role_app_{org_code}` | `sys` | 読み取りのみ |
| `role_cmn_admin` | `cmn` | 読み書き（システム管理者専用） |
| `role_sys_admin` | `sys` | 読み書き（プラットフォーム管理者専用） |

**BE 実装の制約**:
- `cmn` / `sys` スキーマへの INSERT/UPDATE/DELETE は実装しない
- テナント接続時は `search_path = t_{org_code}, cmn, sys, public` を設定
- クロススキーマ参照は FK で保証済み（例: `REFERENCES cmn.mst_drug(drug_id)`）

---

## 出力形式（app-synchronizer-planner への入力）

`app-synchronizer-planner` は以下の情報を `api-analysis.md` に記載する:

```markdown
## BE データベース構造

### マスタテーブル一覧

#### cmn スキーマ（全テナント共通・読み取り専用）
- `cmn.mst_drug`（薬剤マスタ）
- `cmn.mst_labo_test`（検査項目マスタ）
- ...

#### tenant スキーマ（テナント個別・読み書き）
- `tenant.mst_patient`（患者マスタ）
- `tenant.mst_department`（部門マスタ）
- ...

### PostgreSQL 操作推定

| API | HTTP Method | 対象テーブル | 推定操作 | 複雑度 |
|---|---|---|---|---|
| `/api/v1/master/units` | GET | `cmn.mst_code` | `SELECT * WHERE code_type = 'unit'` | Simple |
| `/api/v1/test-items?itemName=...` | GET | `cmn.mst_labo_test` | `SELECT * WHERE item_name LIKE ... LIMIT 20` | Medium |
| `/api/v1/orders/{orderUuid}/test-results` | POST | `tenant.trn_labo_result` | `INSERT INTO ...` | Simple-Medium |

### FK 依存関係

```
tenant.mst_patient → cmn.mst_nationality
tenant.trn_encounter → tenant.mst_patient
tenant.trn_encounter → tenant.mst_department
```

### 実装順序推定

1. **cmn マスタ GET APIs** — 最優先（BFF 初期化時に必要）
2. **tenant マスタ GET APIs** — FK なしのテーブルから
3. **tenant マスタ POST/PUT APIs** — 親テーブル実装後
4. **tenant トランザクション APIs** — マスタ実装後
```

---

## 参照ドキュメント

| ファイル | 内容 |
|---|---|
| `tmp/docs/01_overview.md` | システム概要・アーキテクチャ方針 |
| `tmp/docs/02_schema_design.md` | スキーマ分離設計・命名規約・DDL配置ルール |
| `tmp/docs/03_table_list.md` | 全テーブル一覧（存在する場合） |
| `tmp/docs/04_operations.md` | DB 構築・運用手順 |
| `tmp/docs/05_tenant_management.md` | テナント管理手順 |
| `tmp/cmn/*.sql` | cmn スキーマ DDL（全テナント共通マスタ） |
| `tmp/sys/*.sql` | sys スキーマ DDL（プラットフォーム管理） |
| `tmp/tenant/*.sql` | tenant スキーマ DDL テンプレート |

---

## 使用例

### synchronizer Phase 0（S0-2）での使用

```bash
# メインエージェントが app-synchronizer-planner を起動
/synchronizer RES002/F2_検査結果入力

# app-synchronizer-planner の処理:
1. design_detail-RES002_F2_検査結果入力.md を読み込む
2. BFF定義書から API 一覧を抽出
3. synchronizer-phase0-db を参照し、tmp/cmn/*.sql と tmp/tenant/*.sql を読む
4. 各 API の対象テーブルを特定（例: cmn.mst_labo_test, tenant.trn_labo_result）
5. PostgreSQL 操作を推定（SELECT/INSERT/UPDATE/DELETE）
6. FK 依存関係から実装順序を決定
7. api-analysis.md を生成し、メインエージェントに返却
```

---

## 制約事項

- tmp/ の DDL は手動管理されているため、実際の DB 構造と乖離している可能性がある
- 本番環境のテーブル構造確認は `\d+ テーブル名` で行うこと
- FK 依存関係は DDL の `REFERENCES` 句から推定するが、論理削除フラグ（`is_deleted`）等の運用ルールは考慮しない

---

## 更新履歴

- 2026-05-21: 初版作成（synchronizer-phase0 の BE 構造分析用）
