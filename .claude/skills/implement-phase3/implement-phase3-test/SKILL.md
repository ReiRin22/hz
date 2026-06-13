---
name: implement-phase3-test
description: Phase 3（状態管理）完了後の検証スキル。design_detail の `## 状態管理ルール（画面固有）` に定義された全状態が stores/ に実装されているか・storeRegistry 登録があるか・TypeScript コンパイルが通るかを確認する。TRIGGER when: `/implement` コマンドの Phase 3（T3-1）が全タスク完了したとき。DO NOT TRIGGER when: Phase 3 未完了のとき、または他の Phase を実行中のとき。
---

# implement-phase3-test: Phase 3 状態管理 検証

Phase 3（T3-1）の全タスクが完了したら、このスキルを実行する。
目的は「設計書に定義された全状態がストアに実装されているか」「storeRegistry に登録されているか」「型エラーがないか」を確認すること。

---

## ステップ 1: 設計書から状態一覧を抽出

`design_detail`（`docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`）を Read し、
`## 状態管理ルール（画面固有）` セクションから状態・アクションを全件抽出する。

抽出した情報を以下の形式で記録する。

```
## 設計書の状態一覧（状態管理ルール）
| No | 状態名 | 型 | 初期値 | スコープ |
|---|---|---|---|---|
| 1 | selectedTool | string | 'pen' | Page |
| 2 | strokeColor | string | '#000000' | Page |
...（全件）

合計: N 件
```

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`

---

## ステップ 2: stores/ の実装ファイルを列挙

```bash
# features 配下の stores/ を確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/stores -name "*.store.ts" | sort

# shared 配下（Domain / Global スコープ）も確認
find product/frontend/src/shared/stores -name "*.store.ts" | sort
```

各ファイルの state キーと export フック名を確認する。

```bash
# stores/ の state キーを確認（INITIAL_STATE 定数から）
grep -n "INITIAL_\|const INITIAL" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/stores/*.store.ts 2>/dev/null

# export されているフック名を確認
grep -n "^export const use" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/stores/*.store.ts 2>/dev/null
```

---

## ステップ 3: 状態カバレッジチェック（設計 vs 実装の照合）

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 設計書 `## 状態管理ルール` の状態数 | N 件 | 記録する |
| stores/ で実装されている状態数 | N 件以上 | 記録する |
| 設計書に存在するが stores/ で未実装の状態 | 0 件 | 記録する |

**ルール**:
- stores/ の状態数 ≥ 設計書の状態数 → OK
- 設計書に存在する状態が stores/ で未実装 → FAIL
- stores/ に設計書外の状態がある場合 → 警告（意図的な追加か確認を促す）

---

## ステップ 4: storeRegistry 登録確認

### 4-1: storeRegistry.ts の存在確認

```bash
# storeRegistry.ts が存在するか確認
find product/frontend/src/shared/stores -name "storeRegistry.ts" | sort
```

### 4-2: registerStore の呼び出し確認

```bash
# stores/ ファイルに registerStore 呼び出しがあるか確認
grep -rn "registerStore" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/stores/ 2>/dev/null

# shared/stores/ も確認（Domain / Global スコープ）
grep -rn "registerStore" \
  product/frontend/src/shared/stores/ 2>/dev/null | grep -v "storeRegistry.ts"
```

### 4-3: レジストリチェック

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| `storeRegistry.ts` の存在 | 存在する | OK / NG |
| 実装した stores/ ファイルで `registerStore` を呼んでいるか | 全ファイルで呼んでいる | OK / NG |
| `resetAllStores` が export されているか | export あり | OK / NG |

```bash
# resetAllStores の export を確認
grep -n "export function resetAllStores\|export.*resetAllStores" \
  product/frontend/src/shared/stores/storeRegistry.ts 2>/dev/null
```

---

## ステップ 5: 命名規則チェック

| チェック項目 | 期待パターン | 確認方法 |
|---|---|---|
| ファイル名 | `{機能名}.store.ts`（camelCase） | ファイル一覧で確認 |
| フック名 | `use{機能名}Store`（PascalCase） | `grep "^export const use"` で確認 |
| 初期値定数 | `INITIAL_{機能名}_STATE`（大文字スネークケース） | `grep "INITIAL_"` で確認 |
| `reset` アクション | 全 Store に `reset: () => void` が存在 | `grep "reset:"` で確認 |

```bash
# reset アクションの存在確認
grep -n "reset:" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/stores/*.store.ts 2>/dev/null
```

---

## ステップ 6: TypeScript コンパイルチェック

### 6-1: コンパイルエラー確認

```bash
cd product/frontend && npx tsc --noEmit 2>&1 | grep -E "stores/" | head -30
```

stores/ に関するコンパイルエラーが 0 件であることを確認する。

### 6-2: import パスの確認

```bash
# registerStore の import パスを確認
grep -n "import.*registerStore" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/stores/*.store.ts 2>/dev/null
```

`@/shared/stores/storeRegistry` または相対パスで storeRegistry を参照していることを確認する。

---

## ステップ 7: 結果レポート

以下の形式で出力する：

```
## Phase 3 状態管理 チェック結果

### 📋 状態カバレッジチェック
- 設計書の状態数: N 件
- stores/ 実装済み状態数: N 件
- 未実装の状態: （なし / {状態名}）
- → ✅ PASS / ❌ FAIL（未実装: {状態名}）

### 📋 storeRegistry 登録チェック
- storeRegistry.ts の存在: ✅ あり / ❌ なし
- registerStore 呼び出し: ✅ 全 Store で確認 / ❌ {ファイル名} で未実装
- resetAllStores export: ✅ あり / ❌ なし
- → ✅ PASS / ❌ FAIL

### 📋 命名規則チェック
- ファイル名（{機能名}.store.ts）: ✅ / ❌
- フック名（use{機能名}Store）: ✅ / ❌
- 初期値定数（INITIAL_{機能名}_STATE）: ✅ / ❌
- reset アクション存在: ✅ / ❌
- → ✅ PASS / ❌ FAIL

### 📋 TypeScript コンパイルチェック
- stores/ エラー数: N 件
- → ✅ 0 件 / ❌ N 件エラー

### 📊 サマリ
- 状態カバレッジ: ✅ / ❌
- storeRegistry 登録: ✅ / ❌
- 命名規則: ✅ / ❌
- TypeScript: ✅ / ❌
→ 総合: PASS / FAIL
```

---

## ステップ 8: Gate（FAIL がある場合のみ）

FAIL 項目がある場合：

```yaml
header: "Phase 3 FAIL"
question: "以下の未実装・エラーがあります。修正しますか？"
options:
  - "修正する（推奨）" / description: "FAIL 項目を修正してから再度テストを実行"
  - "スキップする" / description: "意図的な未実装として記録してから次フェーズへ進む"
```

「修正する」が選択された場合、FAIL 項目を修正後にステップ 1 から再実行する。

---

## 完了条件

- [ ] 設計書の全状態が stores/ に実装されている
- [ ] 全 Store で `registerStore` が呼ばれている
- [ ] `storeRegistry.ts` が存在し `resetAllStores` が export されている
- [ ] 全 Store に `reset` アクションが実装されている
- [ ] ファイル名・フック名・初期値定数の命名規則に準拠している
- [ ] TypeScript コンパイルエラーが 0 件
- [ ] サマリが出力された
