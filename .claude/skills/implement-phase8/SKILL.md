---
name: implement-phase8
description: Phase 8（Storybookセットアップ・story作成）のタスク T8-1〜T8-4 の実施手順知識パック。セットアップ設定・molecules/organisms の story 作成・GitLab CI 設定を含む。TRIGGER when: Phase 7 完了後に Phase 8 を開始するとき、T8-1〜T8-4 のいずれかを実施するとき、.storybook/ の設定を変更するとき。DO NOT TRIGGER when: MSW設定・storyテスト・Vitestの導入（implement-phase9 を使うこと）、または Playwright E2E テスト（app-e2e-test-prep を使うこと）。
---

**作業原則**: このスキルの作業中、不明点があれば作業を中断してユーザーに報告し指示を仰ぐこと。推測や独自判断で進めない。

# Phase 8: Storybookセットアップ・story作成 実施手順

Phase 7（バリデーション・エラーハンドリング）完了後に実施する。

---

## 前提条件

- Phase 7 の全タスクが `[x]` であること
- `pnpm tsc --noEmit` が通ること

---

## 1. フレームワーク選定

**`@storybook/react-vite` を使う（`@storybook/nextjs` は使わない）。**

Next.js 16 + React 19 環境では `@storybook/nextjs` の Node.js バージョン要件が競合して `npm install` が失敗する。
`@storybook/react-vite` は Next.js に依存しないため Node 20 で安定動作する。

---

## 2. インストール済みパッケージ（`product/frontend/package.json`）

```json
"scripts": {
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build"
},
"devDependencies": {
  "@storybook/addon-a11y": "^8.6.0",
  "@storybook/addon-essentials": "^8.6.0",
  "@storybook/react": "^8.6.0",
  "@storybook/react-vite": "^8.6.0",
  "storybook": "^8.6.0",
  "vite": "^6.0.0"
}
```

→ `npm install` 後に `npm run storybook` で http://localhost:6006 が起動する。

---

## 3. `.storybook/` 設定（`product/frontend/.storybook/`）

### `main.ts`

```ts
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: { autodocs: 'tag' },
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      '@shared': path.resolve(__dirname, '../src/shared'),
    };
    // Next.js の process.env.NEXT_PUBLIC_* を Storybook/Vite バンドルで安全に扱う。
    // api/ ファイルで `process.env.NEXT_PUBLIC_BFF_BASE_URL ?? 'http://localhost:3001'` のように
    // 参照している場合、Vite バンドルに `process` が存在せず import 時クラッシュする。
    // `{}` にすることで undefined にフォールバックし、`??` の右辺のデフォルト値が使われる。
    // Next.js 本番ビルドはこのファイルを参照しないため影響なし。
    config.define = {
      ...config.define,
      'process.env': {},
    };
    return config;
  },
};
export default config;
```

**ポイント**: `webpackFinal` ではなく `viteFinal`。パスエイリアス `@/` と `@shared/` を必ず解決する。

### `preview.ts`

```ts
import type { Preview } from '@storybook/react';
import '../src/app/globals.css';   // Tailwind CSS エントリポイント

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { config: {} },
  },
};
export default preview;
```

---

## 4. Story ファイルの配置ルール

各コンポーネントファイルと**同じディレクトリ**に `.stories.tsx` を置く。

```
components/
  molecules/
    DrawingToolbar.tsx
    DrawingToolbar.stories.tsx
  organisms/
    SchemaCreationPanel.tsx
    SchemaCreationPanel.stories.tsx
```

### title のパス形式（必須）

`const meta` の `title` は `src/features/` 以降のフォルダパスを **全て** 含める:

```
'LV1/LV2/LV3/コンポーネント種別/コンポーネント名'
```

**具体例（REC002 の場合）:**

| コンポーネント種別 | 期待する title |
|---|---|
| molecules | `'01_diagnosis/01_record-creation/01_schema-creation/molecules/FavoriteToggleButton'` |
| organisms | `'01_diagnosis/01_record-creation/01_schema-creation/organisms/SchemaCreationOrganism'` |

これは `src/features/01_diagnosis/01_record-creation/01_schema-creation/components/molecules/FavoriteToggleButton.tsx` に対応する。

**ルール:**
- `src/features/` 以降、`components/` フォルダ名は除く
- `components/molecules/` → title では `molecules/`
- `components/organisms/` → title では `organisms/`
- フォルダ名はそのまま使う（省略・短縮禁止）

---

## T8-1: Storybookセットアップ確認

**確認項目:**
```bash
ls product/frontend/.storybook/main.ts && echo "main.ts OK"
ls product/frontend/.storybook/preview.ts && echo "preview.ts OK"
grep "react-vite" product/frontend/.storybook/main.ts && echo "framework OK"
grep '"storybook"' product/frontend/package.json && echo "storybook script OK"
grep '"build-storybook"' product/frontend/package.json && echo "build-storybook script OK"
```

**期待状態:**
- `.storybook/main.ts` が存在し `framework: '@storybook/react-vite'` になっている
- `.storybook/preview.ts` が存在し `globals.css` をインポートしている
- `package.json` に `storybook` / `build-storybook` スクリプトがある
- `viteFinal` に `config.define = { 'process.env': {} }` が設定されている

---

## T8-2: molecules story作成

> **注意**: features 内に `atoms/` フォルダは作らない。小粒コンポーネントも `molecules/` に配置する。

各 molecules コンポーネントに `.stories.tsx` を作成する。CSF3 形式（`satisfies Meta<typeof ...>`）を使う。

title は `'LV1/LV2/LV3/molecules/コンポーネント名'` 形式（セクション 4 参照）。`src/features/` 以降の全フォルダを含める。

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { FavoriteToggleButton } from './FavoriteToggleButton';

const meta = {
  title: '01_diagnosis/01_record-creation/01_schema-creation/molecules/FavoriteToggleButton',
  component: FavoriteToggleButton,
  tags: ['autodocs'],
  argTypes: { onToggle: { action: 'toggled' } },
} satisfies Meta<typeof FavoriteToggleButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NotFavorite: Story = {
  args: { templateId: 'tmpl-001', isFavorite: false, onToggle: () => {} },
};
export const IsFavorite: Story = {
  args: { templateId: 'tmpl-001', isFavorite: true, onToggle: () => {} },
};
```

- 各 story は意味のある状態を表現する（Loading/Error/Success 等）
- `open` 状態を持つものは `Open` / `Closed` の2 story を必ず用意

---

## T8-3: organisms story作成

- store・canvas は実コードのまま使う（モックしない）
- props 境界のみ `args` で注入する
- `parameters: { layout: 'fullscreen' }` を設定する
- API 呼び出しが発生する場合は story 上では失敗してよい（表示確認が目的）
- title は `'LV1/LV2/LV3/organisms/コンポーネント名'` 形式（セクション 4 参照）。`src/features/` 以降の全フォルダを含める

> ※ api/ ファイルが `process.env.NEXT_PUBLIC_*` を参照している場合、Vite バンドルに
> `process` が存在せず import 時クラッシュが起きる。
> `.storybook/main.ts` の `viteFinal` に `config.define = { 'process.env': {} }` を
> 追加することで解消する（詳細: セクション 3 main.ts）

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SchemaCreationOrganism } from './SchemaCreationOrganism';

const meta = {
  title: '01_diagnosis/01_record-creation/01_schema-creation/organisms/SchemaCreationOrganism',
  component: SchemaCreationOrganism,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onConfirm: { action: 'confirmed' },
    onCancel: { action: 'cancelled' },
  },
} satisfies Meta<typeof SchemaCreationOrganism>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NewMode: Story = {
  args: { mode: 'new', onConfirm: () => {}, onCancel: () => {} },
};
export const EditMode: Story = {
  args: { mode: 'edit', schemaUuid: 'schema-uuid-001', onConfirm: () => {}, onCancel: () => {} },
};
```

---

## T8-4: story title 確認

全 `.stories.tsx` の `const meta` を確認し、title がセクション 4 の形式に沿っているかを検証する。

```bash
# title 一覧を抽出して確認
grep -r "title:" product/frontend/src --include="*.stories.tsx"
```

**確認ポイント:**
- title が `'LV1/LV2/LV3/(molecules|organisms)/コンポーネント名'` の形式になっているか
- `src/features/` 以降のフォルダが途中で省略されていないか（LV3 のみ・LV1 のみ等は NG）

**確認例（REC002 の場合）:**

| ファイル | 期待する title |
|---|---|
| `molecules/FavoriteToggleButton.stories.tsx` | `'01_diagnosis/01_record-creation/01_schema-creation/molecules/FavoriteToggleButton'` |
| `organisms/SchemaCreationOrganism.stories.tsx` | `'01_diagnosis/01_record-creation/01_schema-creation/organisms/SchemaCreationOrganism'` |

形式がずれているファイルがあれば修正する。

---

## T8-5: hooks/ 操作イベント一覧メモ作成（Phase 9 準備）

Phase 9 の `@storybook/test` args / actions 設定に備えて、この機能の `hooks/` が持つ操作イベントを整理する。

### 手順

1. `features/{LV1}/{LV2}/hooks/` 配下のカスタムフックを全て読む
2. 各フックが公開する操作関数（`() => void` 型の返り値）を列挙する
3. 下記の `.tp` ファイルにメモを書き出す

### 出力先

`.steering/YYYYMMDD-機能名/phase9-actions-memo.md`

### ファイル形式

```markdown
# Phase 9 args / actions メモ

## hooks/ 操作イベント一覧

| フック名 | 操作関数 | 引数型 | 対応コンポーネント |
|---|---|---|---|
| useSchemaCreation | handleConfirm | () => void | SchemaCreationOrganism |
| useSchemaCreation | handleCancel | () => void | SchemaCreationOrganism |
| useDrawingTool | handleToolSelect | (tool: DrawingTool) => void | DrawingToolbar |

## Phase 9 argTypes 候補

各コンポーネントに追加予定の argTypes:

### SchemaCreationOrganism
```ts
argTypes: {
  onConfirm: { action: 'confirmed' },
  onCancel: { action: 'cancelled' },
}
```

### DrawingToolbar
```ts
argTypes: {
  onToolSelect: { action: 'tool-selected' },
}
```

## 備考

- API 通信が発生するフック: （一覧）
- MSW が必要なコンポーネント: （一覧）
```

---

## Phase 8 チェックリスト

```
□ .storybook/main.ts が存在し framework: '@storybook/react-vite' になっている
□ viteFinal に config.define = { 'process.env': {} } が設定されている
□ .storybook/preview.ts が存在し globals.css をインポートしている
□ package.json に storybook / build-storybook スクリプトがある
□ molecules/ の全コンポーネントに .stories.tsx がある
□ organisms/ に .stories.tsx がある
□ 全 .stories.tsx の title が 'LV1フォルダ名/種別/コンポーネント名' 形式になっている
□ .steering/{機能}/phase9-actions-memo.md が作成されている
```
