# implement-phase2-test: Phase 2 API・Repository 層 検証（Axios + React Query パターン）

**このファイルは `implement-phase2-test/SKILL.md` の代替検証パターン。**

fetch ベースの SKILL.md に対し、こちらは **Axios + React Query** ベースの実装を検証する。
synchronizer-phase2 で使用しているパターンと同じ構成の検証。

Phase 2（T2-1〜T2-2）の全タスクが完了したら、このスキルを実行する。
目的は「設計書に定義された全 API が実装されているか」と「型エラーがないか」を確認すること。

---

## ステップ 1: 実装対象エンドポイント一覧の確定

**採用ルール**: `design_detail` と AI実装制約ファイルの両方が存在する場合、**API 件数が多い方を正として採用する**。

```bash
# AI実装制約ファイルの存在確認
ls docs/01_アプリ/{domain}/{機能グループ}/*AI実装制約* 2>/dev/null
```

両ファイルが存在する場合: それぞれの `## 呼び出しAPI一覧` を Read して件数を数え、多い方を採用する。同数の場合は AI実装制約を採用する。
AI実装制約ファイルが存在しない場合: `design_detail` の `## 呼び出しAPI一覧` をそのまま使う。

抽出した情報を以下の形式で記録する。

```
## 実装対象エンドポイント一覧
採用文書: design_detail（N件） / AI実装制約（M件） → 件数が多い「○○」を採用

| No | メソッド | パス | 用途 |
|---|---|---|---|
| 1 | GET | /bff/templates | テンプレート一覧取得 |
...（全件）

合計: N 件
```

> `design_detail` と AI実装制約でエンドポイント数が異なる場合は差異を明記し、件数が多い方の文書の件数を正として照合する。

---

## ステップ 2: api/ の実装ファイルを列挙

```bash
# api/ 配下の実装ファイルを確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/api -name "*.ts" | sort
```

抽出した各ファイルの export 関数名を確認する。

```bash
# Axios + React Query パターンの export 関数一覧
# useQuery/useMutation を返す Hook を探す
grep -n "^export const use\|^export function use" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/api/*.ts
```

---

## ステップ 3: API 通信数チェック（設計 vs 実装の件数照合）

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 設計書 `## 呼び出しAPI一覧` の行数 | N 件 | 記録する |
| api/ ファイル数（.api.ts） | N 件以上 | 記録する |
| api/ の export Hook 総数（useXxx） | N 件 | 記録する |

**ルール**:
- api/ の export Hook 数 ≥ 設計書の行数 → OK
- 設計書に存在するエンドポイントが api/ で未実装 → FAIL
- api/ に設計書外の Hook がある場合 → 警告（意図的な追加か確認を促す）

---

## ステップ 4: repository/ の実装確認（複合API呼び出しのカバレッジ）

### 4-1: 操作イベント定義から複合API呼び出し一覧を抽出

`design_detail` の `## 操作イベント定義` または `## AI実装制約` > `### 操作イベント定義` を読み、
複数 API を呼び出すイベント（並列・直列問わず）を全件抽出する。

```
## 複数API呼び出しイベント一覧（設計書より）
| イベント | 呼び出し方式 | API 数 |
|---|---|---|
| 初期表示（EVT_INIT01） | 並列（React Query 自動） | 2〜3 |
| 確定（EVT_CONFIRM） | 直列・新規/更新分岐 | 1 |
...
```

### 4-2: repository/ の実装ファイルを列挙

```bash
# repository/ 配下の実装ファイルを確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/repository -name "*.ts" | sort
```

各ファイルの export 関数名と複数 `useQuery` の使用有無を確認する。

```bash
# repository/ の export Hook 一覧
grep -n "^export const use\|^export function use" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/repository/*.ts

# 複数 useQuery の使用確認（React Query 並列実行パターン）
grep -n "useQuery\|useMutation" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/repository/*.ts | wc -l
```

### 4-3: 複合API呼び出しチェック

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 設計書の複合API呼び出しイベント数 | N 件 | 記録する |
| repository/ で複数 Hook を使う関数数 | N 件以上 | 記録する |
| repository/ が api/ Hook を経由しているか（直接 axiosClient 禁止） | すべて OK | 記録する |

**Axios + React Query パターンの確認ポイント**:
- repository/ 内で `axiosClient` を直接 import していないこと
- repository/ 内で `../api/useXxx` から Hook を import していること
- 複数の `useQuery` を並列実行している場合、`Promise.all` は不要（React Query が自動並列実行）

---

## ステップ 5: 型整合性チェック

### 5-1: TypeScript コンパイルチェック

```bash
cd product/frontend && npx tsc --noEmit 2>&1 | grep -E "api/|repository/" | head -30
```

api/ と repository/ に関するコンパイルエラーが 0 件であることを確認する。

### 5-2: 型インポートの確認

```bash
# api/ の import が front_bff_shared を参照しているか確認
grep -n "^import.*from '@/front_bff_shared" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/api/*.ts
```

すべての api/ ファイルが `front_bff_shared` の型を使用していることを確認する。

### 5-3: Axios + React Query パターンチェック

| チェック項目 | 確認方法 | 結果 |
|---|---|---|
| §1 axiosClient のインポート | grep で `@shared/plugins/axios.client` 確認 | OK / NG |
| §2 useQuery/useMutation の使用 | grep で `useQuery\|useMutation` 確認 | OK / NG |
| §3 queryKey の設定 | grep で `queryKey:` 確認 | OK / NG |
| §4 response.data を返している | grep で `return response.data` 確認 | OK / NG |
| §5 front_bff_shared の型使用 | grep で `@/front_bff_shared` 確認 | OK / NG |
| §6 BFF エンドポイント呼び出し（/clinical/*） | grep で `/clinical/` 確認 | OK / NG |
| §7 repository/ が api/ Hook を経由 | repository/ に `axiosClient` import なし確認 | OK / NG |

```bash
# §1 axiosClient のインポート確認
grep -n "axiosClient" product/frontend/src/features/{LV1}/{LV2}/{LV3}/api/*.ts | grep "from '@shared/plugins/axios.client'"

# §2 useQuery/useMutation の使用確認
grep -n "useQuery\|useMutation" product/frontend/src/features/{LV1}/{LV2}/{LV3}/api/*.ts

# §3 queryKey の設定確認
grep -n "queryKey:" product/frontend/src/features/{LV1}/{LV2}/{LV3}/api/*.ts

# §4 response.data を返しているか確認
grep -n "return response.data" product/frontend/src/features/{LV1}/{LV2}/{LV3}/api/*.ts

# §5 front_bff_shared の型使用確認
grep -n "@/front_bff_shared" product/frontend/src/features/{LV1}/{LV2}/{LV3}/api/*.ts

# §6 BFF エンドポイント呼び出し確認
grep -n "axiosClient.get\|axiosClient.post" product/frontend/src/features/{LV1}/{LV2}/{LV3}/api/*.ts | grep "/clinical/"

# §7 repository/ が api/ Hook を経由しているか確認（axiosClient を直接 import していないこと）
grep -n "axiosClient" product/frontend/src/features/{LV1}/{LV2}/{LV3}/repository/*.ts
# → 結果が 0 件なら OK（repository/ は axiosClient を直接使わない）
```

---

## ステップ 6: 結果レポート

以下の形式で出力する：

```
## Phase 2 API・Repository 層 チェック結果（Axios + React Query パターン）

### 📋 API 通信数チェック
- 設計書のエンドポイント数: N 件
- api/ 実装ファイル数: N 件（.api.ts）
- api/ export Hook 数（useXxx）: N 件
- → ✅ PASS / ❌ FAIL（未実装: {エンドポイント名}）

### 📋 repository/ カバレッジチェック
- 設計書の複合呼び出しイベント数: N 件
- repository/ の複数 Hook 使用関数数: N 件
- repository/ → api/ Hook 経由確認: ✅ OK / ❌ 直接 axiosClient あり
- → ✅ PASS / ❌ FAIL

### 📋 TypeScript コンパイルチェック
- api/ エラー数: N 件
- repository/ エラー数: N 件
- → ✅ 0 件 / ❌ N 件エラー

### 📋 Axios + React Query パターンチェックリスト
- §1 axiosClient のインポート: ✅ / ❌
- §2 useQuery/useMutation の使用: ✅ / ❌
- §3 queryKey の設定: ✅ / ❌
- §4 response.data を返している: ✅ / ❌
- §5 front_bff_shared の型使用: ✅ / ❌
- §6 BFF エンドポイント呼び出し: ✅ / ❌
- §7 repository/ が api/ Hook を経由: ✅ / ❌
- → ✅ PASS / ❌ FAIL（{該当ファイル名}）

### 📊 サマリ
- API 通信数: ✅ / ❌
- repository/ カバレッジ: ✅ / ❌
- TypeScript: ✅ / ❌
- Axios + React Query パターン: ✅ / ❌
→ 総合: PASS / FAIL
```

---

## ステップ 7: Gate（FAIL がある場合のみ）

FAIL 項目がある場合：

```yaml
header: "Phase 2 FAIL"
question: "以下の未実装・エラーがあります。修正しますか？"
options:
  - "修正する（推奨）" / description: "FAIL 項目を修正してから再度テストを実行"
  - "スキップする" / description: "意図的な未実装として記録してから次フェーズへ進む"
```

「修正する」が選択された場合、FAIL 項目を修正後にステップ 1 から再実行する。

---

## 完了条件

- [ ] 設計書の全エンドポイントが api/ に実装されている
- [ ] api/ の全ファイルで axiosClient を使用している
- [ ] api/ の全ファイルで useQuery または useMutation を使用している
- [ ] api/ の全ファイルで front_bff_shared の型を使用している
- [ ] api/ の全ファイルで response.data を返している
- [ ] 設計書の複合API呼び出しイベントが repository/ でカバーされている
- [ ] repository/ が api/ Hook を経由している（直接 axiosClient なし）
- [ ] TypeScript コンパイルエラーが 0 件
- [ ] Axios + React Query パターンチェックリスト（§1〜§7）がすべて OK
- [ ] サマリが出力された

---

## SKILL.md との違い

| 項目 | SKILL.md（fetch） | SKILL2.md（Axios + React Query） |
|---|---|---|
| **export 関数形式** | `async function getXxx()` | `const useXxx = () => useQuery/useMutation` |
| **並列実行確認** | `Promise.all` の有無 | 複数 `useQuery` の並行使用 |
| **ヘッダー注入確認** | `x-tenant-id` 手動付与の有無 | axiosClient インポートの有無 |
| **型インポート元** | api/ ファイル内で定義 | `@/front_bff_shared` から import |
| **repository/ の確認** | `Promise.all` と api/ 関数呼び出し | 複数 Hook の組み合わせと axiosClient 直接使用禁止 |
| **チェックリスト** | BFF fetch チェック（§1〜§3） | Axios + React Query パターン（§1〜§7） |

---

## いつ SKILL.md と SKILL2.md のどちらを使うか

| 実装パターン | 使用する検証スキル |
|---|---|
| **fetch ベース実装** | SKILL.md |
| **Axios + React Query 実装** | **SKILL2.md** |

**Phase 2 実装時に SKILL2.md（Axios + React Query）を使った場合は、検証も SKILL2.md を使う。**
