---
name: implement-phase4-test
description: Phase 4（Hook 層）完了後の検証スキル。design_detail の `## 操作イベント定義` に定義された全イベントが hooks/ にカバーされているか・'use client' 付与・依存関係（api/ への直接参照なし）・TypeScript コンパイルが通るかを確認する。TRIGGER when: `/implement` コマンドの Phase 4（T4-1）が全タスク完了したとき。DO NOT TRIGGER when: Phase 4 未完了のとき、または他の Phase を実行中のとき。
---

# implement-phase4-test: Phase 4 Hook 層 検証

Phase 4（T4-1）の全タスクが完了したら、このスキルを実行する。
目的は「設計書の全操作イベントがフックでカバーされているか」「'use client' が付与されているか」「依存関係が正しいか」「型エラーがないか」を確認すること。

---

## ステップ 1: 設計書から操作イベント一覧を抽出

`design_detail`（`docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`）を Read し、
`## 操作イベント定義` セクションから全イベントを抽出する。

抽出した情報を以下の形式で記録する。

```
## 設計書の操作イベント一覧（操作イベント定義）
| No | イベントID | イベント名 | フック種別 | 担当フック（期待） |
|---|---|---|---|---|
| 1 | EVT_INIT01 | 初期表示 | 初期化 | use{機能名}Init |
| 2 | EVT_SELECT01 | 項目選択 | 操作 | use{機能名}Actions |
| 3 | EVT_SUBMIT01 | 確定 | 送信 | use{機能名}Submit |
...（全件）

合計: N 件
```

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`

---

## ステップ 2: hooks/ の実装ファイルを列挙

```bash
# hooks/ 配下の実装ファイルを確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks -name "*.ts" | sort
```

各ファイルの export 関数名を確認する。

```bash
# hooks/ の export 関数一覧
grep -n "^export function use\|^export const use" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/*.ts 2>/dev/null
```

---

## ステップ 3: 操作イベントカバレッジチェック（設計 vs 実装の照合）

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 設計書 `## 操作イベント定義` のイベント数 | N 件 | 記録する |
| hooks/ で実装されているハンドラー総数 | N 件以上 | 記録する |
| 設計書に存在するが hooks/ で未実装のイベント | 0 件 | 記録する |

**ルール**:
- 設計書の全イベントが hooks/ のいずれかのフックでカバーされている → OK
- 設計書に存在するイベントが hooks/ で未実装 → FAIL
- hooks/ に設計書外のハンドラーがある場合 → 警告（意図的な追加か確認を促す）

---

## ステップ 4: フック種別の存在確認

機能の性質に応じて必要なフック種別が存在するかを確認する。

```bash
# 初期化フックの確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks -name "*Init.ts" | sort

# 操作フックの確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks -name "*Actions.ts" | sort

# 送信フックの確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks -name "*Submit.ts" | sort
```

| フック種別 | 存在確認 | 備考 |
|---|---|---|
| 初期化フック（`*Init.ts`） | ✅ / ❌ / N/A | EVT_INIT 系イベントが設計書になければ N/A |
| 操作フック（`*Actions.ts`） | ✅ / ❌ / N/A | 操作系イベントが設計書になければ N/A |
| 送信フック（`*Submit.ts`） | ✅ / ❌ / N/A | 送信系イベントが設計書になければ N/A |

> N/A（設計書に対応するイベントがない場合は省略可）を記録すること。

---

## ステップ 5: `'use client'` 付与確認

```bash
# 'use client' の付与状況を確認
grep -rn "'use client'" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null
```

hooks/ の全ファイルに `'use client'` が付与されていることを確認する。

```bash
# 'use client' が付いていないファイルを検出
for f in product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/*.ts; do
  if ! grep -q "'use client'" "$f" 2>/dev/null; then
    echo "MISSING 'use client': $f"
  fi
done
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 全 hooks ファイルに `'use client'` が付与されている | すべての .ts ファイル | OK / NG |

---

## ステップ 6: 依存関係チェック（hooks/ → repository/ 経由確認）

hooks/ が api/ を直接参照していないことを確認する。

```bash
# repository/ への参照確認
grep -rn "from.*repository" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null

# api/ への直接参照がないか確認（あれば FAIL）
grep -rn "from.*[/']api[/']" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| hooks/ が `repository/` を経由している | 全 import に repository/ への参照あり | OK / NG |
| hooks/ が `api/` を直接参照していない | 0 件 | OK / NG |

---

## ステップ 7: 命名規則チェック

| チェック項目 | 期待パターン | 確認方法 |
|---|---|---|
| ファイル名 | `use{機能名}{Init/Actions/Submit}.ts`（PascalCase） | ファイル一覧で確認 |
| フック名 | `use{機能名}{Init/Actions/Submit}`（PascalCase） | `grep "^export function use"` で確認 |
| ファイル名とフック名の一致 | `use{機能名}Init.ts` → `export function use{機能名}Init` | 各ファイルで確認 |

```bash
# フック名とファイル名の一致確認
grep -n "^export function use\|^export const use" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/*.ts 2>/dev/null
```

---

## ステップ 8: TypeScript コンパイルチェック

### 8-1: コンパイルエラー確認

```bash
cd product/frontend && npx tsc --noEmit 2>&1 | grep -E "hooks/" | head -30
```

hooks/ に関するコンパイルエラーが 0 件であることを確認する。

### 8-2: import パスの確認

```bash
# hooks/ の import パスを確認
grep -n "^import" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/*.ts 2>/dev/null | head -30
```

`@/shared/` または相対パスで stores/ と repository/ を参照していることを確認する。

---

## ステップ 9: 結果レポート

以下の形式で出力する：

```
## Phase 4 Hook 層 チェック結果

### 📋 操作イベントカバレッジチェック
- 設計書のイベント数: N 件
- hooks/ 実装済みハンドラー数: N 件
- 未実装のイベント: （なし / {イベントID}）
- → ✅ PASS / ❌ FAIL（未実装: {イベントID}）

### 📋 フック種別チェック
- 初期化フック（*Init.ts）: ✅ あり / ❌ なし / N/A
- 操作フック（*Actions.ts）: ✅ あり / ❌ なし / N/A
- 送信フック（*Submit.ts）: ✅ あり / ❌ なし / N/A
- → ✅ PASS / ❌ FAIL

### 📋 'use client' 付与チェック
- 全ファイルに付与: ✅ OK / ❌ 未付与: {ファイル名}
- → ✅ PASS / ❌ FAIL

### 📋 依存関係チェック
- repository/ 経由: ✅ OK / ❌ {ファイル名} で未経由
- api/ 直接参照なし: ✅ 0 件 / ❌ {ファイル名} で直接参照あり
- → ✅ PASS / ❌ FAIL

### 📋 命名規則チェック
- ファイル名（use{機能名}{Init/Actions/Submit}.ts）: ✅ / ❌
- フック名（use{機能名}{Init/Actions/Submit}）: ✅ / ❌
- ファイル名とフック名の一致: ✅ / ❌
- → ✅ PASS / ❌ FAIL

### 📋 TypeScript コンパイルチェック
- hooks/ エラー数: N 件
- → ✅ 0 件 / ❌ N 件エラー

### 📊 サマリ
- 操作イベントカバレッジ: ✅ / ❌
- フック種別: ✅ / ❌
- 'use client' 付与: ✅ / ❌
- 依存関係: ✅ / ❌
- 命名規則: ✅ / ❌
- TypeScript: ✅ / ❌
→ 総合: PASS / FAIL
```

---

## ステップ 10: Gate（FAIL がある場合のみ）

FAIL 項目がある場合：

```yaml
header: "Phase 4 FAIL"
question: "以下の未実装・エラーがあります。修正しますか？"
options:
  - "修正する（推奨）" / description: "FAIL 項目を修正してから再度テストを実行"
  - "スキップする" / description: "意図的な未実装として記録してから次フェーズへ進む"
```

「修正する」が選択された場合、FAIL 項目を修正後にステップ 1 から再実行する。

---

## 完了条件

- [ ] 設計書の全操作イベントが hooks/ でカバーされている
- [ ] 初期化・操作・送信フックが適切に実装されている（不要な種別は N/A として記録済み）
- [ ] 全 hooks ファイルに `'use client'` が付与されている
- [ ] hooks/ が repository/ を経由している（api/ への直接参照なし）
- [ ] ファイル名・フック名の命名規則に準拠している
- [ ] TypeScript コンパイルエラーが 0 件
- [ ] サマリが出力された
