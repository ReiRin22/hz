---
name: implement-phase10
description: storyファイル整理 + E2Eテスト・依存グラフ生成（Phase 9 完了後）。T10-0〜T10-4 を含む。TRIGGER when: Phase 9（Storybookテスト・Vitest）が完了したとき。DO NOT TRIGGER when: Phase 9 未完了のとき、または他の Phase を実行中のとき。
---

**作業原則**: このスキルの作業中、不明点があれば作業を中断してユーザーに報告し指示を仰ぐこと。推測や独自判断で進めない。

# Phase 10: storyファイル整理 + E2Eテスト・依存グラフ生成

Phase 9（T9-1〜T9-4 Storybookテスト・Vitest）が完了してから開始する。

---

## チェックリスト

```
Phase 10: storyファイル整理 + E2Eテスト・依存グラフ生成（Phase 9 完了後）
├── T10-0: {CODE}.tsx → index.tsx リネーム（依存グラフ生成前に実施）
│         ① features/{LV3}/ 直下の空 index.ts を削除する
│         ② {CODE}.tsx を index.tsx にリネームする
│         ③ app/ 側で {CODE} を直接 import しているファイルの import パスから "/コード名" を除去する
│         ④ pnpm tsc --noEmit でエラーゼロを確認する
├── T10-1: stories/ フォルダへの storyファイル移動
│         components/ と同階層に stories/organisms/ と stories/molecules/ を作成し、
│         components/organisms/*.stories.tsx → stories/organisms/ へ移動
│         components/molecules/*.stories.tsx → stories/molecules/ へ移動
│         各ファイルの import パスを相対パスで更新する
├── T10-2: scripts/server-test.sh の修正（case 2箇所）
├── T10-3: {CODE}-test.js の作成または確認（既存の場合はエージェント不要）
├── T10-3r: 生成テストのユーザーレビュー（AskUserQuestion で提示 → 改善ループ → 承認）
└── T10-4: 依存グラフ生成（depcruise で dot → png を生成し docs/01_アプリ/{LV1}/{LV2}/ に保存）
```

---

## 事前確認

### 参照する設計書

| タスク | 参照先 | 確認ポイント |
|---|---|---|
| **T10-0** | このファイルの `## T10-0` | {CODE}.tsx → index.tsx リネーム手順 |
| **T10-1** | このファイルの `## T10-1` | storyファイル移動手順 |
| **T10-2〜T10-3** | Skill('app-e2e-test-prep') | E2Eテスト事前準備の全ステップ |

---

## T10-0: {CODE}.tsx → index.tsx リネーム

依存グラフを正確にするため、`{CODE}.tsx` を `index.tsx` にリネームしてからグラフを生成する。
`depcruise` はフォルダ単位で解析するため、エントリーポイントが `index.tsx` になると解析精度が上がる。

### 前提確認

```bash
# 空の index.ts が存在するか確認（存在する場合は先に削除する）
ls product/frontend/src/features/{LV1}/{LV2}/{LV3}/index.ts 2>/dev/null && echo "要削除" || echo "なし"

# {CODE}.tsx が存在するか確認
ls product/frontend/src/features/{LV1}/{LV2}/{LV3}/{CODE}.tsx 2>/dev/null && echo "存在する" || echo "なし"
```

### ステップ 1: 空の index.ts を削除する

```bash
rm product/frontend/src/features/{LV1}/{LV2}/{LV3}/index.ts
```

> **注意**: `index.ts` と `index.tsx` が同時に存在すると TypeScript の解決順序が壊れる。
> 必ずリネーム前に削除すること。

### ステップ 2: {CODE}.tsx を index.tsx にリネームする

```bash
mv product/frontend/src/features/{LV1}/{LV2}/{LV3}/{CODE}.tsx \
   product/frontend/src/features/{LV1}/{LV2}/{LV3}/index.tsx
```

### ステップ 3: app/ 側の import パスを修正する

```bash
# app/ 配下で {CODE} を直接 import しているファイルを探す
grep -rn "from.*{LV3}/{CODE}" product/frontend/src/app/ 2>/dev/null
grep -rn "from.*{LV3}/{CODE}\"" product/frontend/src/app/ 2>/dev/null
```

見つかったファイルの import パスから末尾の `/{CODE}` を除去する。

**修正パターン:**
```tsx
// 修正前（@/ エイリアス使用）
import {CODE}Page from "@/features/{LV1}/{LV2}/{LV3}/{CODE}";
// 修正後
import {CODE}Page from "@/features/{LV1}/{LV2}/{LV3}";

// 修正前（相対パス使用）
import {CODE}Page from "../../../../../../features/{LV1}/{LV2}/{LV3}/{CODE}";
// 修正後
import {CODE}Page from "../../../../../../features/{LV1}/{LV2}/{LV3}";
```

### ステップ 4: TypeScript コンパイルチェック

```bash
cd product/frontend && npx tsc --noEmit 2>&1 | grep "error TS" | grep -v node_modules | grep "{LV3}" | head -10
# 期待: 0件
```

---

## T10-1: stories/ フォルダへの storyファイル移動

`components/` と同じ階層に `stories/` フォルダを作成し、storyファイルをまとめて移動する。
コンポーネント本体（`*.tsx`）は移動しない。storiesファイルのみが対象。

### ディレクトリ構造（移動後）

```
{LV3}/
├── components/
│   ├── molecules/
│   │   └── FooMolecule.tsx          ← コンポーネント本体はここに残す
│   └── organisms/
│       └── FooOrganism.tsx
├── stories/                          ← 新規作成
│   ├── molecules/
│   │   └── FooMolecule.stories.tsx  ← components/molecules/ から移動
│   └── organisms/
│       └── FooOrganism.stories.tsx  ← components/organisms/ から移動
└── test/
    └── ...
```

### ステップ 1: 対象ファイルを確認する

```bash
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/components -name "*.stories.tsx" | sort
```

### ステップ 2: stories/ フォルダを作成してファイルを移動する

```bash
mkdir -p product/frontend/src/features/{LV1}/{LV2}/{LV3}/stories/molecules
mkdir -p product/frontend/src/features/{LV1}/{LV2}/{LV3}/stories/organisms

# molecules 配下を移動
mv product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/molecules/*.stories.tsx \
   product/frontend/src/features/{LV1}/{LV2}/{LV3}/stories/molecules/ 2>/dev/null || true

# organisms 配下を移動
mv product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/organisms/*.stories.tsx \
   product/frontend/src/features/{LV1}/{LV2}/{LV3}/stories/organisms/ 2>/dev/null || true
```

### ステップ 3: 各 storiesファイルの import パスを更新する

移動後、コンポーネント本体への相対パスが変わるため修正する。

**移動前（`components/molecules/` にある場合）:**
```tsx
import { FooMolecule } from './FooMolecule';
```

**移動後（`stories/molecules/` に移動した場合）:**
```tsx
import { FooMolecule } from '../../components/molecules/FooMolecule';
```

**移動前（`components/organisms/` にある場合）:**
```tsx
import { FooOrganism } from './FooOrganism';
```

**移動後（`stories/organisms/` に移動した場合）:**
```tsx
import { FooOrganism } from '../../components/organisms/FooOrganism';
```

`@/` エイリアスを使っている import はそのまま維持する（変更不要）。

### ステップ 3.5: test/ 配下のstoriesファイル import を更新する

`test/` 配下のテストファイルが `composeStories` 等でstoriesファイルをimportしている場合、
移動後のパスに合わせて更新する。

```bash
# test/ 配下に stories import が残っていないか確認する
grep -rn "from.*components.*\.stories" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/test/ 2>/dev/null
```

**修正パターン（molecules の例）:**
```tsx
// 修正前
import * as stories from '../components/molecules/FooMolecule.stories';
// 修正後
import * as stories from '../stories/molecules/FooMolecule.stories';
```

**修正パターン（organisms の例）:**
```tsx
// 修正前
import * as Stories from '../components/organisms/FooOrganism.stories';
// 修正後
import * as Stories from '../stories/organisms/FooOrganism.stories';
```

一括置換コマンド:
```bash
BASE="product/frontend/src/features/{LV1}/{LV2}/{LV3}/test"
# molecules
sed -i "s|from '\.\./components/molecules/\(.*\)\.stories'|from '../stories/molecules/\1.stories'|g" "$BASE"/*.test.tsx
# organisms
sed -i "s|from '\.\./components/organisms/\(.*\)\.stories'|from '../stories/organisms/\1.stories'|g" "$BASE"/*.test.tsx
# 修正結果を確認する
grep -n "\.stories" "$BASE"/*.test.tsx
```

### ステップ 4: TypeScript コンパイルエラーを確認する

```bash
cd product/frontend && npx tsc --noEmit 2>&1 | grep -v node_modules | grep "error TS" | head -20
```

エラーがあれば import パスを修正してから次のタスクへ進む。

### ステップ 5: Storybook が起動できることを確認する（任意）

```bash
cd product/frontend && pnpm storybook 2>&1 | head -20
```

`Stories found` のログが出れば OK。

---

## T10-2: scripts/server-test.sh の修正

### 修正箇所 A: E2Eスクリプト選択ブロック

```bash
# .claude/scripts/server-test.sh の case ブロックに追加
{CODE}) E2E_SCRIPT="$FEATURES_DIR/{LV1}/{LV2}/{LV3}/test/{CODE}-test.js" ;;
```

### 修正箇所 B: URLマッピング関数

```bash
# code_to_path() 内に追加
{CODE}) echo "/{T10-1で確認したパス}" ;;
```

> **注意**: `code_to_path()` に記載するパスは Next.js の実際のルートパスに合わせること。
> 開発用ページが `app/dev/...` に配置されている場合は `/dev/` プレフィックスが必要。
> REC002 の例: `/dev/diagnosis/record-creation/examination-input/REC002`
> `{CODE}-test.js` 内の URL パス定数（`const {CODE}_PATH`）も同じパスにすること。

詳細手順は Skill('app-e2e-test-prep') `## ステップ2` を参照。

---

## T10-3: {CODE}-test.js の作成または確認

### まず存在確認を行う

```bash
find product/frontend/src/features -path "*/test/{CODE}-test.js" -type f 2>/dev/null
```

### ファイルが存在する場合 → エージェント不要

既存ファイルをそのまま使用する。Playwright エージェント（planner / generator / healer）は**起動しない**。

```bash
# 既存ファイルの内容を確認する
cat product/frontend/src/features/{LV1}/{LV2}/{LV3}/test/{CODE}-test.js
```

### ファイルが存在しない場合 → Playwright エージェントで生成する

以下の順序でエージェントを起動する。

#### ステップ 3a: PRD・設計書を読む

```bash
find docs/01_アプリ -name "*.md" | xargs grep -l "{CODE}" 2>/dev/null
```

見つかったファイルを Read して受入条件・操作イベント定義・エラー表示設計を把握する。

#### ステップ 3b: 実装済みファイルを確認する

```bash
find product/frontend/src/features -path "*{LV3}*" -name "*.tsx" | grep -v node_modules | sort
```

organisms / molecules の構成と主要 UI 要素（ボタンラベル・フォーム等）を把握する。

#### ステップ 3c: シードファイルを作成する

`product/frontend/e2e/{CODE}.spec.ts` を作成する（存在しない場合のみ）:

```typescript
import { test, expect } from '@playwright/test';

test.describe('{CODE}', () => {
  test('seed', async ({ page }) => {
    // generate code here.
  });
});
```

#### ステップ 3d: playwright-test-planner を起動する

プランナーへの指示に以下を必ず含める:

- シードファイル `product/frontend/e2e/{CODE}.spec.ts` を渡す
- localhost:3000 に Next.js 開発サーバーが起動していることを前提とする
- **ステップ 3a で読んだ PRD の受入条件・操作イベント定義・エラー表示設計を全て渡す**
- **ステップ 3b で確認した hooks/ の操作関数一覧（phase9-actions-memo.md があれば添付）を渡す**

**必須シナリオ（省略禁止）:**

| カテゴリ | 内容 |
|---|---|
| 画面表示 | ページロード後の主要 UI 要素の存在確認 |
| 初期状態 | デフォルト値・disabled 状態・プレースホルダーの確認 |
| 主要操作 | hooks/ が公開する操作関数（handleXxx）を全て 1 つ以上のテストで経由する |
| 画面遷移 | 確定・キャンセル後のルーティングが期待通りになる |
| バリデーション | 必須項目未入力・不正値入力時のエラーメッセージ表示 |
| API エラー | BFF が 500 を返したときのエラー表示 |
| 状態変化 | 操作後に UI の状態（ボタン disabled / ローディング / 完了）が変わる |

#### ステップ 3e: playwright-test-generator を起動する

- planner の出力したテスト計画を使用する
- 生成先: `product/frontend/src/features/{LV1}/{LV2}/{LV3}/test/{CODE}-test.js`
- `REC002-test.js` を雛形として構造を参照する（ただしテスト内容は新機能固有に書き換える）

#### ステップ 3f: playwright-test-healer を起動する（カバレッジ修正ループ、最大3回）

**目的: PASS するテストを作ることではなく、全シナリオを網羅したテストが正しく動くことを確認する。**

ヒーラーへの指示:

- 失敗テストを `test.fixme()` や `expect(true).toBe(true)` で誤魔化すことを**禁止**する
- 失敗の原因がセレクターのズレ・タイミング・URL の誤りであれば修正する
- 失敗の原因が実装バグや未実装機能であれば、`test.fixme('実装側の問題: {理由}')` でマークし、**テスト自体は削除しない**
- ループの終了条件は「全 PASS」ではなく「全シナリオがテストとして存在し、修正可能なものは PASS になっている」状態

**修正してはいけないもの:**

| 禁止パターン | 理由 |
|---|---|
| シナリオを丸ごと削除する | カバレッジが落ちる |
| `expect(true).toBe(true)` で置き換える | テストが無意味になる |
| アサーション条件を緩める（例: 要素の存在だけ確認） | 実際の動作が検証されなくなる |

---

## T10-3v: {CODE}-test.js の動画・ログエクスポート確認

生成・修正した `{CODE}-test.js` が動画録画とログ出力を正しくエクスポートするか確認する。
CI の GitLab アーティファクトで `videos/*.webm` が生成されない場合、録画設定の欠落が原因。

### チェックポイント

`{CODE}-test.js` のメイン関数に以下が揃っているか確認する。

#### 1. browser.launch の args（日本語フォント・CI 対応）

```javascript
const browser = await chromium.launch({
  headless: isCI,
  slowMo: isCI ? 0 : 120,
  args: [
    ...(isCI
      ? ['--no-sandbox', '--disable-setuid-sandbox']
      : ['--start-maximized', `--display=${process.env.DISPLAY || ':0'}`]),
    '--font-render-hinting=none',
    '--disable-font-subpixel-positioning',
    '--lang=ja-JP',
  ],
});
```

#### 2. context の recordVideo 設定

```javascript
const context = await browser.newContext({
  viewport: { width: 1400, height: 900 },
  locale: 'ja-JP',
  extraHTTPHeaders: { 'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.8' },
  recordVideo: {
    dir: path.join(LOG_DIR, 'videos'),
    size: { width: 1400, height: 900 },
  },
});
```

#### 3. finally ブロックの後処理（順序が重要）

```javascript
} finally {
  const videoPath = await page.video()?.path();
  await context.close();   // ← context.close() が先（これで動画が確定する）
  await browser.close();
  if (videoPath) {
    const videoFile = path.join(LOG_DIR, 'videos', `${CODE}-${ts}.webm`);
    fs.renameSync(videoPath, videoFile);
    log(`  動画: ${videoFile}`);
  }
}
```

> **注意**: `context.close()` を呼ぶ前に `videoPath` を取得し、`context.close()` 後に
> `browser.close()` → rename の順にすること。順序が逆だと動画ファイルが確定せずリネームが失敗する。
> `browser.close()` のみで `context.close()` がない場合も動画が生成されない。

### 確認コマンド

```bash
grep -n "recordVideo\|context.close\|videoPath\|renameSync" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/test/{CODE}-test.js
```

3項目すべて出力されれば OK。

---

## T10-3r: 生成テストのユーザーレビュー（改善ループ）

ステップ 3e/3f で生成・修正したテストファイルをユーザーに提示し、承認を得る。

### 手順

**ステップ 1: ファイルを読み込む**

```bash
cat product/frontend/src/features/{LV1}/{LV2}/{LV3}/test/{CODE}-test.js
```

**ステップ 2: AskUserQuestion でプレビュー付きで提示する**

```
質問: 「生成されたE2Eテストを確認してください。問題ありますか？」

選択肢:
  - 「このまま進める」     → T10-4 へ進む
  - 「改善案を入力する」   → Other（自由テキスト）で受け取り、ステップ 3 へ
  - 「テストを削減する」   → シナリオを絞り込んでステップ 2 に戻る
  - 「テストを追加する」   → 追加シナリオをテキストで受け取りステップ 2 に戻る

preview: ファイル冒頭 80 行程度を貼り付ける（長い場合は test.describe ブロック単位で抜粋）
```

> **ファイルが長い場合の提示方針**: 全体は「全体は {ファイルパス} にあります」と案内し、
> preview には `test.describe` ブロックの先頭〜最初の `test()` まで（目安 60〜80 行）を貼る。

**ステップ 3: フィードバックがあった場合**

ユーザーの指摘内容を Edit で反映し、**ステップ 2 に戻る**。

改善ループに上限はない。ユーザーが「このまま進める」を選択するまで繰り返す。

---

## T10-4: 依存グラフ生成

`depcruise` で LV3 機能フォルダの依存グラフを生成し、`docs/01_アプリ/` 配下に保存する。

### 出力先

```
docs/01_アプリ/{LV1機能名}/{LV2機能名}/{CODE}-graph.dot
docs/01_アプリ/{LV1機能名}/{LV2機能名}/{CODE}-graph.png
```

### 手順

**ステップ 1: dot ファイル生成**

```bash
cd product/frontend && node_modules/.bin/depcruise \
  src/features/{LV1}/{LV2}/{LV3} \
  --no-config \
  --exclude "_scope_out" \
  --include-only "^src" \
  --ts-config tsconfig.json \
  --output-type dot \
  > /absolute/path/to/docs/01_アプリ/{LV1機能名}/{LV2機能名}/{CODE}-graph.dot
```

> **注意**:
> - `cd product/frontend` してから `node_modules/.bin/depcruise` で実行する（`npx depcruise` は偽パッケージに当たる場合があるため）
> - `--exclude "_scope_out"` を必ず付ける（スコープ外コンポーネントを除外）
> - 出力先は絶対パスで指定する（`cd` でカレントが変わるため）

**ステップ 2: png 変換**

```bash
dot -Tpng \
  /absolute/path/to/docs/01_アプリ/{LV1機能名}/{LV2機能名}/{CODE}-graph.dot \
  -o /absolute/path/to/docs/01_アプリ/{LV1機能名}/{LV2機能名}/{CODE}-graph.png
```

> **注意**: `dot` コマンドが未インストールの場合は `sudo apt-get install graphviz` でインストールする。

---

## Phase 10 完了後

全タスクが完了したら **`Skill('implement-phase10-test')`** を起動して最終検証する。

チェック通過（PASS）になってから実装フェーズ全体の完了報告へ進む。

