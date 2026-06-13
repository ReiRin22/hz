---
name: implement-phase5
description: Phase 5（コンポーネント層）のスキル。T5-1〜T5-3 を実行するときに参照する。Organism実装・Molecule群実装・Page層RSC化を行う。TRIGGER when: Phase 4（T4-1）が完了し、Phase 5 を開始するとき。やること: ① design_detail の `## 画面設計（詳細）` を読み、実装すべきコンポーネントを特定 ② Organism を `features/**/components/organisms/` に実装 ③ Molecule群を `features/**/components/molecules/` に実装・既存整理 ④ Page を RSC として実装。DO NOT TRIGGER when: Phase 4 未完了のとき、または Phase 6 以降を実行するとき。
---

**作業原則**: このスキルの作業中、不明点があれば作業を中断してユーザーに報告し指示を仰ぐこと。推測や独自判断で進めない。

# Phase 5: コンポーネント層

Phase 4（T4-1 カスタムフック実装）が完了してから開始する。
設計書の `## 画面設計（詳細）` を読み、Organism・Molecule・Page コンポーネントをすべて実装する。

---

## チェックリスト

```
Phase 5: コンポーネント層（T4-1 完了後）
├── T5-1: Organism細分化・Molecule抽出
│         Organism の JSX を読み、独立した UI 単位を molecule として切り出す
│         molecule は atom の組み合わせの最小単位まで細分化する（50行超えたらさらに分割）
│         ※ Page を最小化したときに Organism に余剰ロジックが流れ込む問題をここで防ぐ
├── T5-2: Molecule群実装・既存コンポーネント整理
├── T5-3: Organism実装
├── T5-4: Page層（RSC化）
├── T5-5: {機能ID}.tsx の最小化確認・修正
│         {機能ID}.tsx が Organism への委譲のみになっているかを確認し、余剰 JSX・ロジックを Organism へ移動する
├── T5-6: importパス確認・修正（{機能ID}.tsx 含む全コンポーネントの import パスを確認し壊れたパスを修正）
└── T5-7: components/直下の残存ファイル削除確認（molecules/ と organisms/ 以外に .tsx/.ts が残っていないか確認・削除）
```

---

## 事前確認

### 参照する設計書

| タスク | 参照先 | 確認ポイント |
|---|---|---|
| **T5-1〜T5-3** | `{design_detail}` `## 画面設計（詳細）` | Organism / Molecule コンポーネントの構造・責務・Props |
| **T5-1〜T5-3** | `05_コンポーネント設計/コンポーネント設計規約.md` 全章 | Atomic Design 分類・Props型・RSC/RCC境界・依存方向 |
| **T5-2** | `06_UIビジュアル設計/UIビジュアル規約.md` 全章 | Tailwind 実装規約・UIライブラリ利用・画像最適化 |

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`

### Next.js ベストプラクティス参照

Phase 5 では以下のスキルファイルを必要に応じて参照する（`product/.agents/skills/next-best-practices/`）。

| ファイル | 参照タイミング |
|---|---|
| `rsc-boundaries.md` | 非シリアライズ可能 Props（Date / Map / 関数等）を Props として渡す箇所を発見したとき |
| `hydration-error.md` | `window` / 日付 / ランダム値など SSR/CSR 不一致が起きうる箇所を実装するとき |
| `image.md` | `<img>` タグを使う箇所すべて（next/image への置き換え要否を確認） |
| `async-patterns.md` | Page / Layout で `params` / `searchParams` を受け取るとき |

---

## 実装前の洗い出し

`design_detail` の `## 画面設計（詳細）` からコンポーネント一覧を全件抽出し、以下の表を埋める。

| コンポーネント名 | 層 | 配置先 | 依存するフック/ストア | 主な責務 |
|---|---|---|---|---|
| 例: SchemaEditorOrganism | Organism | `features/.../organisms/` | `useSchemaCreation` | キャンバス全体・ツールバー統合 |
| 例: ToolbarMolecule | Molecule | `features/.../molecules/` | — | ツール選択 UI |
| 例: SchemaPage | Page (RSC) | `app/.../(route)/page.tsx` | — | RSC シェル・Suspense 境界 |
| （残りを埋める） | | | | |

> 設計書の全コンポーネントがテーブルに記載されていることを確認してから実装を開始する。

---

## T5-1: Organism細分化・Molecule抽出

Organism（または draft 実装）の JSX を全部読み、以下の観点で molecule に切り出せるブロックを列挙する。

### 切り出し判定基準

| ブロックの特性 | 判定 |
|---|---|
| ヘッダー・フッター・サイドバーなど独立したレイアウト領域 | molecule に切り出す |
| 複数の atom を組み合わせた再利用可能 UI（カード・フォームグループ等） | molecule に切り出す |
| map ループ内のカード 1枚（インライン実装されている場合） | molecule に切り出す |
| 既存 molecule のさらに内部にある独立した UI 単位 | molecule に切り出す（features 内に atoms/ フォルダは作らない） |
| フックや store を直接呼んでいる → Organism にとどめる | 切り出さない |

### 洗い出し手順

1. Organism の JSX を縦に読み、`{/* セクション名 */}` コメント境界や `<div className="...">` で区切られたブロックを列挙する
2. 各ブロックについて上記の判定基準を適用する
3. 切り出す molecule の Props 設計（何を受け取るか）を決める
4. 切り出し候補リストを tasklist.md に追記してからT5-2へ進む

### Molecule の最小化指針

Organism からの切り出しに加え、molecule 自体も最小単位を意識する。

| 判定 | 基準 | 対応 |
|---|---|---|
| 肥大化 | JSX 行数が 50 行を超えた | さらに小さい molecule に分割する（features 内に atoms/ フォルダは作らない） |
| 複数責務 | 「表示 + 入力」など複数の UI 責務を持つ | 責務ごとに molecule を分ける |
| 再利用可能 | 他の Organism でも使えそうなブロック | molecules/ の汎用コンポーネントとして定義する |
| 単一 atom | atom 1つを薄くラップしているだけ | 不要な wrapper を作らず atom を直接使う |

**適切な molecule の目安:**
- 1つの molecule = 1つの UI の役割（入力グループ・カード・ツールバーボタン群 など）
- JSX は 10〜40 行程度
- Props は 5 個以内を目安にする（超える場合は分割か prop object 化を検討）

### 注意事項

- **切り出し後の Organism は hook 呼び出しと molecule の組み合わせのみになることを目指す**
- Page を最小化（RSC化）したときに余剰な JSX が Organism に流れ込みやすい。T5-1 でそれを molecule に下ろすことで Organism の肥大化を防ぐ
- 切り出した molecule はフックを持たない。イベントハンドラーは Props 経由で受け取る

---

## T5-2: Molecule群実装・既存コンポーネント整理

`features/{LV1}/{LV2}/{LV3}/components/molecules/` 配下に Molecule コンポーネントを作成する。

### Molecule の役割

- **Atom を組み合わせた再利用可能な UI ブロック**を担当する。
- Props のみで動作し、フックやストアに直接依存しない（純粋な表示層）。
- `'use client'` は原則不要（イベントハンドラーは Props 経由で受け取る）。

### 実装パターン

```typescript
// features/{LV1}/{LV2}/{LV3}/components/molecules/{分子名}Molecule.tsx
type {分子名}MoleculeProps = {
  // 表示に必要なデータ
  label: string;
  value: string;
  // イベントハンドラー（Organism から渡す）
  onChange: (value: string) => void;
  // オプション
  disabled?: boolean;
};

export function {分子名}Molecule({ label, value, onChange, disabled }: {分子名}MoleculeProps) {
  return (
    <div>
      {/* Atom や HTML 要素を組み合わせた表示 */}
    </div>
  );
}
```

### 既存コンポーネントの整理

Phase 0〜4 で作成したプレースホルダーや仮実装コンポーネントを以下の手順で整理する。

> **T1-4 との関係**: T1-4（Phase 1）で公開窓口ファイルの最小化と molecules/organisms への**仮配置**を行っている。
> T5-2 では、その仮配置を**設計書の `## 画面設計（詳細）` と照合して確定**する。
> 仮置きファイルのリネーム・不要ファイルの削除・props 設計の確定がここで行われる。

1. `features/{LV1}/{LV2}/{LV3}/components/` 配下を確認し、未整理ファイルを列挙する。
2. 設計書の `## 画面設計（詳細）` と照合し、不要なファイルを削除・統合する。
3. コンポーネント名・ファイル名が `05.コンポーネント設計.md` の命名規則に準拠しているか確認する。

### components/ 直下の未整理ファイル振り分けルール

`components/` 直下（`molecules/` / `organisms/` いずれにも属さない状態）のファイルは、
**T5-2 の最初に全件処理してから** Molecule/Organism の実装に入る。

**振り分け判定フロー:**

```
components/ 直下のファイルを見たとき
  │
  ├─ organisms/ に同名ファイルが存在する？
  │     YES → diff で内容を比較する
  │             同一内容 → 直下版を削除（organisms/ 版が正）
  │             差分あり → 内容を統合して organisms/ 版を更新、直下版を削除
  │     NO  ↓
  │
  ├─ 独自の状態（useState/useCallback等）や window アクセスを持つ？
  │     YES → organisms/ へ移動
  │     NO  ↓
  │
  ├─ Atoms の組み合わせ + Props のみで動作する表示部品？
  │     YES → molecules/ へ移動
  │     NO  ↓
  │
  └─ SVGテンプレート定義・静的データ定数のみ（ロジックなし）？
        YES → assets/ へ移動（コンポーネントではなくデータとして扱う）
```

**REC002 での確認済みパターン:**

| ファイル | 判定 | 処置 |
|---|---|---|
| `DrawingCanvas.tsx`（直下） | `organisms/DrawingCanvas.tsx` と同一内容 | 直下版を削除。organisms/ 版が正 |
| `ColorPicker.tsx` | Atoms 組み合わせ + Props のみ、`useState` は UI 開閉のみ | `molecules/` へ移動 |
| `MedicalTemplates.tsx` | SVG 定義の export 集、ロジックなし | `assets/` へ移動（`assets/medical-templates.ts`） |

**移動後は必ず import パスを更新すること。** 移動したファイルを参照している箇所を grep で確認する:

```bash
grep -rn "from.*components/ColorPicker\|from.*components/MedicalTemplates\|from.*components/DrawingCanvas" \
  product/frontend/src --include="*.tsx" --include="*.ts"
```

### Tailwind 実装規約

`06.UI実装とビジュアル設計.md` の規約に従い、以下を守る。

- クラス名は設計書指定のものを使う（勝手にカスタムクラスを作らない）。
- レスポンシブ対応が必要な場合は設計書のブレークポイント定義に従う。
- UIコンポーネントライブラリ（shadcn/ui 等）を使う場合は `06.UI実装とビジュアル設計.md` の利用ルールに従う。

---

## T5-3: Organism実装

`features/{LV1}/{LV2}/{LV3}/components/organisms/` 配下に Organism コンポーネントを作成する。

### Organism の役割

- **Molecule・Atom を組み合わせた画面の主要ブロック**を担当する。
- **カスタムフック（Phase 4 実装済み）を直接呼ぶ唯一の層**。Molecule 以下ではフックを呼ばない。
- `'use client'` を付与する（フックを使うため Client Component）。
- Page スコープストアの `reset` をアンマウント時に呼ぶ（`useEffect` の cleanup）。

### 実装パターン

```typescript
// features/{LV1}/{LV2}/{LV3}/components/organisms/{機能名}Organism.tsx
'use client';

import { useEffect } from 'react';
import { use{機能名} } from '../../hooks/use{機能名}';
import { use{機能名}Store } from '../../stores/{機能名}.store';
import { {Molecule名} } from '../molecules/{Molecule名}';

type {機能名}OrganismProps = {
  // Page から渡される初期データや設定値のみ受け取る
  initialData?: {型};
};

export function {機能名}Organism({ initialData }: {機能名}OrganismProps) {
  const { /* フックから必要なものを分割代入 */ } = use{機能名}(initialData);

  // Page スコープストアのリセット（アンマウント時）
  useEffect(() => {
    return () => {
      use{機能名}Store.getState().reset();
    };
  }, []);

  return (
    <div>
      {/* Molecule を組み合わせてレイアウトを構築 */}
    </div>
  );
}
```

### 注意事項

- **Props はシリアライズ可能な値のみ**受け取る（Date / Map / 関数を Props で渡さない）。非シリアライズ Props が必要な場合は `rsc-boundaries.md` を確認する。
- `'use client'` ディレクティブは Organism に付与する。Molecule・Atom は原則付与しない（Organism 境界内で動作するため）。
- フックを複数使う場合でも、フック呼び出しは Organism に集約する（Molecule にフックを持たせない）。

---

## T5-2: Molecule群実装・既存コンポーネント整理

`features/{LV1}/{LV2}/{LV3}/components/molecules/` 配下に Molecule コンポーネントを作成する。

### Molecule の役割

- **Atom を組み合わせた再利用可能な UI ブロック**を担当する。
- Props のみで動作し、フックやストアに直接依存しない（純粋な表示層）。
- `'use client'` は原則不要（イベントハンドラーは Props 経由で受け取る）。

### 実装パターン

```typescript
// features/{LV1}/{LV2}/{LV3}/components/molecules/{分子名}Molecule.tsx
type {分子名}MoleculeProps = {
  // 表示に必要なデータ
  label: string;
  value: string;
  // イベントハンドラー（Organism から渡す）
  onChange: (value: string) => void;
  // オプション
  disabled?: boolean;
};

export function {分子名}Molecule({ label, value, onChange, disabled }: {分子名}MoleculeProps) {
  return (
    <div>
      {/* Atom や HTML 要素を組み合わせた表示 */}
    </div>
  );
}
```

### 既存コンポーネントの整理

Phase 0〜4 で作成したプレースホルダーや仮実装コンポーネントを以下の手順で整理する。

1. `features/{LV1}/{LV2}/{LV3}/components/` 配下を確認し、未整理ファイルを列挙する。
2. 設計書の `## 画面設計（詳細）` と照合し、不要なファイルを削除・統合する。
3. コンポーネント名・ファイル名が `05.コンポーネント設計.md` の命名規則に準拠しているか確認する。

### Tailwind 実装規約

`06.UI実装とビジュアル設計.md` の規約に従い、以下を守る。

- クラス名は設計書指定のものを使う（勝手にカスタムクラスを作らない）。
- レスポンシブ対応が必要な場合は設計書のブレークポイント定義に従う。
- UIコンポーネントライブラリ（shadcn/ui 等）を使う場合は `06.UI実装とビジュアル設計.md` の利用ルールに従う。

---

## T5-3: Page層（RSC化）

`app/` 配下の Page ファイルを React Server Component（RSC）として実装する。

### Page の役割

- **RSC シェル**として動作し、データフェッチと Organism へのデータ受け渡しを担う。
- `'use client'` を付与しない（RSC のまま維持する）。
- Zustand ストアやカスタムフックを直接呼ばない（Client Component である Organism に委ねる）。

### RSC/RCC 境界の原則

`07.ルーティングとレンダリング設計方針.md` を参照し、以下を守る。

| 項目 | RSC（Page） | RCC（Organism以下） |
|---|---|---|
| `'use client'` | ❌ 付与しない | ✅ 必要な場合のみ付与 |
| データフェッチ | ✅ `async` 関数で直接 fetch | ❌ useQuery 等は使わない |
| フック呼び出し | ❌ 不可 | ✅ 可 |
| Zustand ストア | ❌ 不可 | ✅ 可 |
| Props | シリアライズ可能な値のみ RCC に渡す | — |

### 実装パターン

```typescript
// app/.../(route)/page.tsx
import { {機能名}Organism } from '@/features/{LV1}/{LV2}/{LV3}/components/organisms/{機能名}Organism';

// params / searchParams は async で受け取る（Next.js 15+）
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function {機能名}Page({ params }: PageProps) {
  const { id } = await params;

  // RSC でのデータフェッチ（必要な場合）
  // const data = await fetchInitialData(id);

  return (
    <main>
      <{機能名}Organism {/* initialData={data} */} />
    </main>
  );
}
```

### ハイドレーションエラーの防止

`hydration-error.md` を参照し、以下に注意する。

- `window` / `navigator` 等のブラウザ専用 API を RSC・RCC の初回レンダリングで使わない。
- 日付・乱数など SSR/CSR で値が変わるものを直接レンダリングしない（`useEffect` 内で処理する）。
- `new Date().toLocaleString()` はロケール差異でミスマッチを起こすため注意。

### next/image の必須化

`<img>` タグを使う場合は `image.md` を参照し、`next/image` に置き換える。

```typescript
// NG: <img src="/logo.png" />
// OK:
import Image from 'next/image';
<Image src="/logo.png" alt="ロゴ" width={120} height={40} />
```

---

## T5-5: {機能ID}.tsx の最小化確認・修正

`features/{LV1}/{LV2}/{LV3}/{機能ID}.tsx`（例: `REC002.tsx`）はルーティング層と feature 層の境界であり、**Organism への委譲のみ**を持つべきエントリーファイルである。

### 確認手順

**ステップ1: 現在の {機能ID}.tsx の内容を確認する**

```bash
cat product/frontend/src/features/{LV1}/{LV2}/{LV3}/{機能ID}.tsx
```

**ステップ2: 不要な要素を検出する**

以下が含まれている場合はすべて Organism へ移動する。

| 検出パターン | 対処 |
|---|---|
| `useState` / `useCallback` / `useEffect` 等のフック呼び出し | 対応する Organism に移動する |
| JSX の条件分岐・ループ・スタイル定義 | Organism または Molecule に移動する |
| `import` が Organism 以外の molecule / hooks を直接参照 | Organism 経由に変更する |
| `const` / `function` によるローカル定義 | 不要なら削除、必要なら Organism へ移動する |

**ステップ3: 最小化後の期待形**

```typescript
// {機能ID}.tsx — Organism への委譲のみ
import { {機能名}Organism } from './components/organisms/{機能名}Organism';

export default function {機能名}() {
  return <{機能名}Organism />;
}
```

> props が必要な場合でも、受け取った値をそのまま Organism に渡すだけにとどめる。ロジックはここに置かない。

---

## T5-6: importパス確認・修正

T5-1〜T5-5 でコンポーネントを整理・移動した後、`{機能ID}.tsx`（例: `REC002.tsx`）および features 内の全コンポーネントの import パスが正しく解決できるかを確認し、壊れたパスを修正する。

### 手順

**ステップ1: 対象ファイルの import を確認する**

```bash
# {機能ID}.tsx の import 一覧を確認
grep -n "^import" product/frontend/src/features/{LV1}/{LV2}/{LV3}/{機能ID}.tsx

# features 内の全 .tsx .ts ファイルの import 一覧（broken path を探す）
grep -rn "^import" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/ \
  --include="*.tsx" --include="*.ts" | grep -v node_modules
```

**ステップ2: 存在しないパスを特定する**

import パスを確認し、以下のパターンで壊れたパスを検出する。

```bash
# 旧パス（components/ 直下）への参照が残っていないか確認
grep -rn "from.*components/ColorPicker\|from.*components/DrawingCanvas\|from.*components/MedicalTemplates" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/ 2>/dev/null

# 削除済みフォルダ（src/ / data/）への参照が残っていないか確認
grep -rn "from.*['\"]\.\.?/src/\|from.*['\"]\.\.?/data/" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/ 2>/dev/null
```

**ステップ3: 壊れたパスを修正する**

発見した壊れた import を正しいパスに修正する。

| 旧パス（例） | 新パス（例） |
|---|---|
| `../components/DrawingCanvas` | `../components/molecules/DrawingCanvas` |
| `../components/ColorPicker` | `../components/molecules/ColorPickerPanel` |
| `../components/MedicalTemplates` | `../assets/templates` |
| `../src/components/xxx` | `../components/molecules/xxx` |
| `../data/templates` | `../assets/templates` |

**ステップ4: TypeScript コンパイルで確認する**

```bash
cd product/frontend && npx tsc --noEmit 2>&1 | grep "{機能フォルダ名}" | head -20
```

コンパイルエラーが 0 件であることを確認する。

---

## T5-7: components/ 直下の残存ファイル削除確認

T5-2〜T5-6 でコンポーネントを molecules/ / organisms/ へ振り分けた後、`components/` 直下に `.tsx` / `.ts` ファイルが残っていないかを確認し、あれば削除する。

`components/` 直下に置いてよいのは `molecules/` と `organisms/` **フォルダのみ**。ファイルを直接置かない。

### 手順

**ステップ1: 直下の残存ファイル・不要フォルダを確認する**

```bash
# components/ 直下の .tsx / .ts ファイルを列挙（サブフォルダは除外）
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/components \
  -maxdepth 1 -type f \( -name "*.tsx" -o -name "*.ts" \)

# figma/ フォルダの存在確認
ls -la product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/ | grep figma
```

**ステップ2: 残存ファイル・不要フォルダを削除する**

出力が空であれば完了。ファイルが列挙された場合は T5-2 の振り分けフローに従って処置済みであることを確認してから削除する。

```bash
# 例: 振り分け済みの DrawingCanvas.tsx（直下版）を削除
rm product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/DrawingCanvas.tsx

# figma/ フォルダが存在する場合は削除（Figma Make生成ファイルの残骸）
rm -rf product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/figma
```

**ステップ3: 削除後に import パスが壊れていないか確認する**

```bash
cd product/frontend && npx tsc --noEmit 2>&1 | head -20
```

---

## Phase 5 完了後

全タスクが完了したら **`Skill('implement-phase5-test')`** を起動してコンポーネント実装を検証する。

このスキルは以下を行う：
1. `design_detail` の `## 画面設計（詳細）` に定義された全コンポーネントが実装されているかを照合
2. Organism が `'use client'` を持ち、フック呼び出しを集約しているかを確認
3. Organism の JSX が molecule の組み合わせのみになっているかを確認（T5-1 の細分化が反映されているか）
4. 各 molecule が最小単位になっているかを確認（JSX 50行以内・単一責務・フック非依存）
5. Page が RSC（`'use client'` なし）として実装されているかを確認
6. 非シリアライズ Props・ハイドレーションエラー起因コードがないかを確認
7. `{機能ID}.tsx` が Organism への委譲のみで余剰 JSX・ロジックを持っていないかを確認（T5-5）
8. `{機能ID}.tsx` 含む全コンポーネントの import パスが解決できることを確認（T5-6）
9. `components/` 直下に `.tsx` / `.ts` ファイルが存在しないことを確認（T5-7）
10. TypeScript コンパイルエラーが 0 件であることを確認

チェック通過（PASS）になってから Phase 6 へ進む。

---

## T5-3 必須: Page スコープストアのアンマウントリセット

Phase 3 で実装した Page スコープ Zustand ストアは、**T5-3 の Organism 実装時**に以下のリセット処理を追加すること。

```typescript
// Organism コンポーネント（最上位 Client Component）内
useEffect(() => {
  return () => {
    use{機能名}Store.getState().reset();
  };
}, []);
```

> Phase 3 のストアファイルには書かない。Organism の `useEffect` cleanup に書く。
> Global / Domain スコープのストアにはこの cleanup を書かない（画面を離れても保持が必要なため）。
