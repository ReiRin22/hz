---
name: implement-phase5-test
description: Phase 5（コンポーネント層）完了後の検証スキル。design_detail の `## 画面設計（詳細）` に定義された全コンポーネントが実装されているか・Organism の 'use client' 付与とフック集約・Page の RSC 実装・非シリアライズ Props の有無・TypeScript コンパイルが通るかを確認する。TRIGGER when: `/implement` コマンドの Phase 5（T5-1〜T5-3）が全タスク完了したとき。DO NOT TRIGGER when: Phase 5 未完了のとき、または他の Phase を実行中のとき。
---

# implement-phase5-test: Phase 5 コンポーネント層 検証

Phase 5（T5-1〜T5-3）の全タスクが完了したら、このスキルを実行する。
目的は「設計書に定義された全コンポーネントが実装されているか」「RSC/RCC 境界が正しいか」「非シリアライズ Props がないか」「型エラーがないか」を確認すること。

---

## ステップ 1: 設計書からコンポーネント一覧を抽出

`design_detail`（`docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`）を Read し、
`## 画面設計（詳細）` セクションからコンポーネントを全件抽出する。

抽出した情報を以下の形式で記録する。

```
## 設計書のコンポーネント一覧
| No | コンポーネント名 | 層 | 期待配置先 |
|---|---|---|---|
| 1 | SchemaEditorOrganism | Organism | features/.../organisms/ |
| 2 | ToolbarMolecule | Molecule | features/.../molecules/ |
| 3 | SchemaPage | Page | app/.../(route)/page.tsx |
...（全件）

合計: N 件
```

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`

---

## ステップ 2: 実装ファイルを列挙

```bash
# Organism コンポーネントを確認
find product/frontend/src/features -type f -name "*.tsx" -path "*/organisms/*" | sort

# Molecule コンポーネントを確認
find product/frontend/src/features -type f -name "*.tsx" -path "*/molecules/*" | sort

# Page コンポーネントを確認（app/ 配下）
find product/frontend/app -type f -name "page.tsx" | sort
```

---

## ステップ 3: コンポーネントカバレッジチェック（設計 vs 実装の照合）

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 設計書のコンポーネント数 | N 件 | 記録する |
| 実装済みコンポーネント数 | N 件以上 | 記録する |
| 設計書に存在するが未実装のコンポーネント | 0 件 | 記録する |

**ルール**:
- 実装数 ≥ 設計書の数 → OK
- 設計書に存在するコンポーネントが未実装 → FAIL
- 実装に設計書外のコンポーネントがある場合 → 警告（意図的な追加か確認を促す）

---

## ステップ 4: RSC/RCC 境界チェック

### 4-1: Organism の `'use client'` 確認

```bash
# Organism ファイルに 'use client' があるか確認
grep -l "use client" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/organisms/*.tsx 2>/dev/null
```

### 4-2: Organism のフック集約確認

```bash
# Organism でカスタムフックを呼んでいるか確認
grep -n "^import.*hooks\|use[A-Z]" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/organisms/*.tsx 2>/dev/null
```

### 4-3: Molecule のフック独立性確認

Molecule がカスタムフックやストアを直接 import していないことを確認する。

```bash
# Molecule がフック・ストアを直接 import していないか確認
grep -n "use[A-Z]\|from.*store\|from.*hooks" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/molecules/*.tsx 2>/dev/null
```

> Molecule に `useQuery` / `useStore` 系の import がある場合は FAIL（Organism に集約すべき）。
> ただし `useState` / `useRef` / `useCallback` 等の React 組み込みフックは許可。

### 4-4: Page の RSC 確認

```bash
# Page ファイルに 'use client' がないことを確認
grep -l "use client" \
  product/frontend/app/**/*page.tsx 2>/dev/null || echo "RSC OK（'use client' なし）"
```

Page ファイルに `'use client'` が含まれる場合は FAIL（Page は RSC として維持する）。

### 4-5: RSC/RCC チェック結果表

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 全 Organism に `'use client'` がある | ✅ | OK / NG |
| Organism がカスタムフックを集約している | ✅ | OK / NG |
| Molecule がカスタムフック・ストアを直接持たない | ✅ | OK / NG |
| Page に `'use client'` がない（RSC） | ✅ | OK / NG |

---

## ステップ 5: 非シリアライズ Props チェック

RSC から RCC（Organism 等）へ非シリアライズ可能な値（Date / Map / Set / 関数 / クラスインスタンス）が Props として渡されていないかを確認する。

```bash
# Page → Organism の Props を確認
# Page ファイルで <{機能名}Organism ... /> の呼び出し部分を確認
grep -n "<.*Organism" \
  product/frontend/app/**/*page.tsx 2>/dev/null
```

疑わしい Props が見つかった場合は実際のコードを Read し、渡している値の型を確認する。

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| Date オブジェクトを Props で渡していない | ✅ | OK / NG |
| Map / Set を Props で渡していない | ✅ | OK / NG |
| 関数（コールバック）を RSC → RCC で Props 渡ししていない | ✅ | OK / NG |
| クラスインスタンスを Props で渡していない | ✅ | OK / NG |

---

## ステップ 6: ハイドレーションエラー起因コードチェック

```bash
# window / document / navigator の直接参照を確認
grep -rn "window\.\|document\.\|navigator\." \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/ 2>/dev/null | \
  grep -v "// " | grep -v "test\." | head -20
```

`window` 等がコンポーネントのトップレベルや JSX 内で使われている場合は FAIL。
`useEffect` 内での利用は OK。

---

## ステップ 7: next/image チェック

```bash
# <img タグの直接使用を確認
grep -rn "<img " \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/ \
  product/frontend/app/ 2>/dev/null | grep -v ".stories." | head -20
```

`<img` タグが見つかった場合は `next/image` への置き換えが必要（WARN）。

---

## ステップ 8: 命名規則チェック

| チェック項目 | 期待パターン | 確認方法 |
|---|---|---|
| Organism ファイル名 | `{機能名}Organism.tsx`（PascalCase） | ファイル一覧で確認 |
| Molecule ファイル名 | `{名称}Molecule.tsx`（PascalCase） | ファイル一覧で確認 |
| Page ファイル名 | `page.tsx`（Next.js 規約） | ファイル一覧で確認 |
| コンポーネント export | `export function {名前}(` または `export default function` | `grep "^export"` で確認 |

```bash
# コンポーネントの export 確認
grep -n "^export" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/organisms/*.tsx \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/molecules/*.tsx 2>/dev/null
```

---

## ステップ 9: components/ 直下の残存ファイルチェック（T5-7）

`components/` 直下に `.tsx` / `.ts` ファイルが残っていないことを確認する。
`components/` 直下に置いてよいのは `molecules/` と `organisms/` **フォルダのみ**。

```bash
# components/ 直下の .tsx / .ts ファイルを列挙（サブフォルダは除外）
find product/frontend/src/features -path "*/components" -prune -o \
  -path "*/components/*" -maxdepth 0 -print 2>/dev/null || \
find product/frontend/src/features -type d -name "components" | \
  xargs -I{} find {} -maxdepth 1 -type f \( -name "*.tsx" -o -name "*.ts" \) 2>/dev/null
```

出力が空であれば OK。ファイルが列挙された場合は T5-2 の振り分けが漏れているため FAIL。

---

## ステップ 10: TypeScript コンパイルチェック

```bash
cd product/frontend && npx tsc --noEmit 2>&1 | grep -E "components/|app/" | head -30
```

components/ と app/ に関するコンパイルエラーが 0 件であることを確認する。

---

## ステップ 12: 結果レポート

以下の形式で出力する：

```
## Phase 5 コンポーネント層 チェック結果

### 📋 コンポーネントカバレッジチェック
- 設計書のコンポーネント数: N 件
- 実装済みコンポーネント数: N 件
- 未実装のコンポーネント: （なし / {コンポーネント名}）
- → ✅ PASS / ❌ FAIL（未実装: {コンポーネント名}）

### 📋 RSC/RCC 境界チェック
- Organism の 'use client' 付与: ✅ 全 Organism で確認 / ❌ {ファイル名} で未付与
- Organism のフック集約: ✅ 集約されている / ❌ Molecule に直接呼び出しあり
- Molecule のフック独立: ✅ カスタムフック・ストア依存なし / ❌ {ファイル名} に依存あり
- Page の RSC 維持: ✅ 'use client' なし / ❌ {ファイル名} に 'use client' あり
- → ✅ PASS / ❌ FAIL

### 📋 非シリアライズ Props チェック
- Date/Map/Set/関数の Props 渡し: （なし / {箇所}）
- → ✅ PASS / ❌ FAIL（{箇所}）

### 📋 ハイドレーションエラーリスクチェック
- window/document 直接参照: （なし / {箇所}）
- → ✅ PASS / ⚠️ WARN（{箇所}）

### 📋 next/image チェック
- <img タグの残存: （なし / {箇所}）
- → ✅ PASS / ⚠️ WARN（{箇所}）

### 📋 命名規則チェック
- Organism ファイル名（{機能名}Organism.tsx）: ✅ / ❌
- Molecule ファイル名（{名称}Molecule.tsx）: ✅ / ❌
- → ✅ PASS / ❌ FAIL

### 📋 components/ 直下残存ファイルチェック（T5-7）
- 直下の .tsx/.ts ファイル: （なし / {ファイル名}）
- → ✅ PASS / ❌ FAIL（{ファイル名} が残存）

### 📋 TypeScript コンパイルチェック
- components/ + app/ エラー数: N 件
- → ✅ 0 件 / ❌ N 件エラー

### 📊 サマリ
- コンポーネントカバレッジ: ✅ / ❌
- RSC/RCC 境界: ✅ / ❌
- 非シリアライズ Props: ✅ / ❌
- ハイドレーションリスク: ✅ / ⚠️
- next/image: ✅ / ⚠️
- 命名規則: ✅ / ❌
- components/ 直下残存ファイル: ✅ / ❌
- TypeScript: ✅ / ❌
→ 総合: PASS / FAIL
```

---

## ステップ 13: Gate（FAIL がある場合のみ）

FAIL 項目がある場合：

```yaml
header: "Phase 5 FAIL"
question: "以下の未実装・エラーがあります。修正しますか？"
options:
  - "修正する（推奨）" / description: "FAIL 項目を修正してから再度テストを実行"
  - "スキップする" / description: "意図的な未実装として記録してから次フェーズへ進む"
```

「修正する」が選択された場合、FAIL 項目を修正後にステップ 1 から再実行する。

---

## 完了条件

- [ ] 設計書の全コンポーネントが organisms/ / molecules/ / app/ に実装されている
- [ ] 全 Organism に `'use client'` が付与されている
- [ ] Organism がカスタムフック呼び出しを集約している
- [ ] Molecule がカスタムフック・ストアを直接持っていない
- [ ] Page が RSC（`'use client'` なし）として実装されている
- [ ] 非シリアライズ Props（Date / Map / Set / 関数）が RSC → RCC 間で渡されていない
- [ ] ファイル名・コンポーネント名の命名規則に準拠している
- [ ] `components/` 直下に `.tsx` / `.ts` ファイルが存在しない（T5-7）
- [ ] TypeScript コンパイルエラーが 0 件
- [ ] サマリが出力された
