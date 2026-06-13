---
name: implement-phase9
description: Phase 9（Storybookテスト強化）のタスク T9-1〜T9-11 の実施手順知識パック。API通信が必要なstoryファイルの特定・MSW設定・storyテストファイル作成・actions追加・MSW不要コンポーネントのテスト作成・カバレッジ C0/C1/C2 設定・CI組み込みを含む。TRIGGER when: Phase 8（T8-1〜T8-4 Storybookセットアップ・story作成）が完了したとき、T9-1〜T9-11 のいずれかを実施するとき。DO NOT TRIGGER when: Storybookの初期セットアップ・story作成（implement-phase8 を使うこと）、または Playwright E2E テスト（app-e2e-test-prep を使うこと）。
---

**作業原則**: このスキルの作業中、不明点があれば作業を中断してユーザーに報告し指示を仰ぐこと。推測や独自判断で進めない。

# Phase 9: Storybookテスト強化（MSW・Vitest）実施手順

Phase 8（T8-1〜T8-4 Storybookセットアップ・story作成）完了後に実施する。

---

## 前提条件

- Phase 8 の全タスクが `[x]` であること
- `.storybook/main.ts` と `.storybook/preview.ts` が存在すること
- molecules / organisms の `.stories.tsx` が作成済みであること

---

## T9-1: API通信が必要なstoryファイルの特定

api/ → repository/ → hooks/ → components の依存チェーンを逆トレースして、
API呼び出しが発生するコンポーネントに対応する `.stories.tsx` を洗い出す。

### ステップ1: api/ フォルダを一覧化

```bash
find product/frontend/src/features -path "*/api/*.ts" | sort
```

### ステップ2: API呼び出しを含むhookを特定

```bash
grep -r "repository\.\|\.api\b" product/frontend/src/features --include="*.ts" -l
```

### ステップ3: コンポーネントのhook使用を確認

```bash
grep -r "use[A-Z][a-zA-Z]*Init\|use[A-Z][a-zA-Z]*Actions\|use[A-Z][a-zA-Z]*Confirm" \
  product/frontend/src/features --include="*.tsx" -l
```

### ステップ4: storiesファイルとの照合

ステップ3で特定したコンポーネントの `.stories.tsx` を対象ファイルとしてリストアップする。

#### 判定基準

| 判定 | 条件 |
|------|------|
| **API通信あり（MSW対象）** | 初期化hook / 操作hookを内部で使い、そのhookがapi/を呼び出している |
| **API通信なし** | props受け渡しのみ、またはpure UIコンポーネント |

**結果**: 対象storyファイル・判定・使用APIエンドポイントの全リストを `.steering/{機能名}/tasklist.md` の T9-1 セクションに追記する（T9-2で使用）。

以下のフォーマットで記録する:

```markdown
## T9-1: API通信対象 storyファイル

| storyファイル | 判定 | 使用APIエンドポイント |
|---|---|---|
| `organisms/SchemaCreationOrganism.stories.tsx` | MSW対象 | `GET /bff/templates?category=...`, `GET /bff/favorites`, `GET /bff/schemas/:schemaUuid`, `POST /bff/schemas`, `PUT /bff/schemas/:schemaUuid`, `POST /bff/favorites`, `DELETE /bff/favorites/:templateId` |
| `molecules/ConfirmDialog.stories.tsx` | MSW不要 | — |
| `molecules/DrawingCanvas.stories.tsx` | MSW不要 | — |
| ...（全storyファイルを列挙）... | | |
```

> **記録の目的**: T9-2 の MSW handlers 定義時に「何をモックすべきか」を一覧で参照できるようにする。
> エンドポイントは `api/*.api.ts` のリクエスト定義から正確に転記すること。

---

## T9-2: 該当storyファイルへのMSW設定追加

T9-1 で特定した対象storiesに MSW を設定する。

### パッケージ追加

```bash
cd product/frontend
npm install msw msw-storybook-addon --save-dev
npx msw init public/ --save
```

### preview.ts を更新

```ts
import type { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '../src/app/globals.css';

initialize();

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { config: {} },
  },
};
export default preview;
```

### storiesファイルにhandlersを追加

```tsx
import { http, HttpResponse } from 'msw';

// Story レベルで handlers を追加
export const SuccessBehavior: Story = {
  args: { ... },
  parameters: {
    msw: {
      handlers: [
        http.get('/bff/templates', ({ request }) => {
          const url = new URL(request.url);
          return HttpResponse.json({
            templates: SAMPLE_TEMPLATES.filter(
              t => t.category === url.searchParams.get('category')
            ),
          });
        }),
        http.get('/bff/favorites', () => {
          return HttpResponse.json({ favoriteIds: ['tmpl-001'] });
        }),
      ],
    },
  },
};

// エラーケース
export const TemplateFetchError: Story = {
  args: { ... },
  parameters: {
    msw: {
      handlers: [
        http.get('/bff/templates', () => {
          return HttpResponse.json(
            { message: 'テンプレート取得に失敗しました' },
            { status: 500 }
          );
        }),
      ],
    },
  },
};
```

> **MSW v2 の注意点**: `rest.get` は廃止。`http.get` / `HttpResponse.json` を使う（msw v2 以降）。

### 絶対 URL を使う API の場合（重要）

API ファイルが `process.env.NEXT_PUBLIC_BFF_BASE_URL` や `http://localhost:3001` などで絶対 URL を組み立てている場合、
MSW handler のパスも **絶対 URL** で書く必要がある。相対パスでは intercept されない。

```tsx
// NG: 相対パスでは intercept されない
http.get('/bff/templates', () => ...)

// OK: 絶対 URL で書く
http.get('http://localhost:3001/bff/templates', () => ...)
```

`.storybook/main.ts` の `viteFinal` で `config.define = { 'process.env': {} }` を設定している場合、
`process.env.NEXT_PUBLIC_BFF_BASE_URL` は `undefined` になり、API ファイルのフォールバック値（例: `http://localhost:3001`）が使われる。
その値を MSW handler の URL プレフィックスとして使うこと。

### handlers をテストと Storybook で共有するために named export する（重要）

handlers をテストファイルから参照するために、storyファイルから **named export** する。
テストは `import * as Stories from '...'` でインポートし、`Stories.commonHandlers` として参照する。
これによりハンドラーの定義が1ヶ所に集約される（Single Source of Truth）。

```tsx
// ✅ named export — テストから Stories.commonHandlers で参照できる
export const commonHandlers = [
  http.get('http://localhost:3001/bff/templates', () => HttpResponse.json({ templates: [] })),
  http.get('http://localhost:3001/bff/favorites', () => HttpResponse.json({ favoriteTemplateIds: [] })),
  http.post('http://localhost:3001/bff/favorites', () => new HttpResponse(null, { status: 204 })),
  http.delete('http://localhost:3001/bff/favorites/:templateId', () => new HttpResponse(null, { status: 204 })),
];

// EditMode 固有ハンドラー（commonHandlers に schemaUuid 取得を追加）
export const editModeHandlers = [
  ...commonHandlers,
  http.get('http://localhost:3001/bff/schemas/:schemaUuid', () =>
    HttpResponse.json({ schemaUuid: 'schema-uuid-001', imageData: '' })
  ),
];

const meta = {
  // ...
  parameters: {
    msw: { handlers: commonHandlers },  // NewMode がデフォルトで使うハンドラー
  },
} satisfies Meta<typeof MyComponent>;

// EditMode は editModeHandlers を指定（Story 固有）
export const EditMode: Story = {
  parameters: {
    msw: { handlers: editModeHandlers },
  },
};
```

テストファイルでの参照（T9-3 参照）:

```tsx
import * as Stories from '../components/organisms/SchemaCreationOrganism.stories'
// 各テスト冒頭で登録:
server.use(...Stories.commonHandlers)
server.use(...Stories.editModeHandlers)
```

### void レスポンス（204 No Content）の書き方

`POST /bff/favorites` や `DELETE /bff/favorites/:id` のようにレスポンスボディなしのエンドポイントは `new HttpResponse(null, { status: 204 })` を使う。

```tsx
// NG: HttpResponse.json() は body が必要
http.post('http://localhost:3001/bff/favorites', () => HttpResponse.json({}))

// OK: body なしの 204 を返す
http.post('http://localhost:3001/bff/favorites', () => new HttpResponse(null, { status: 204 }))
http.delete('http://localhost:3001/bff/favorites/:templateId', () => new HttpResponse(null, { status: 204 }))
```

---

## T9-8: Vitest + @storybook/test 統合テスト設定（T9-3 の前に実施）

**T9-3 の前に必ず実施すること。** vitest.config.ts と setup ファイルが存在しないとテストが動かない。

### パッケージ追加

```bash
cd product/frontend
npm install -D @storybook/experimental-addon-test vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

> `@storybook/test` は `@storybook/experimental-addon-test` に内包されている。

### `vitest.config.ts`（`product/frontend/vitest.config.ts`）

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
      include: ['src/features/**/components/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/types/**',
      ],
    },
  },
});
```

### `vitest.setup.ts`（`product/frontend/vitest.setup.ts`）

```ts
import '@testing-library/jest-dom/vitest';

// <canvas> は jsdom 未実装のためスタブ化
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    clearRect: () => {}, fillRect: () => {}, drawImage: () => {},
    getImageData: () => ({ data: [] }), putImageData: () => {},
    beginPath: () => {}, stroke: () => {}, fill: () => {},
    arc: () => {}, moveTo: () => {}, lineTo: () => {},
  }),
  writable: true,
});
```

### `package.json` スクリプト追加

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest --run",
    "test:coverage": "vitest --run --coverage"
  }
}
```

---

## T9-3: test/ 配下にstoryテストファイルを作成

T9-1 で特定した対象のAPIモック込みテストファイルを **LV3の `test/` 直下** に作成する。

### ディレクトリ構成（structure_2.md 準拠）

```
src/features/{LV1}/{LV2}/{LV3}/
  test/
    SchemaCreationOrganism.test.tsx   ← {コンポーネント名}.test.tsx
```

> **注意**: `test/stories/organisms/` などのサブディレクトリは作らない。
> structure_2.md のルール（`test/*.ts/tsx`）に従い、`test/` 直下に置く。
> 拡張子は `.stories.test.tsx` ではなく `.test.tsx`。

### テストファイルの正しいパターン（composeStories + RTL + msw/node）

```tsx
import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { composeStories } from '@storybook/react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { within } from '@testing-library/dom'        // ← @storybook/test ではなく @testing-library/dom
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

import * as Stories from '../components/organisms/SchemaCreationOrganism.stories'
import { useSchemaCreationStore } from '../stores/schemaCreation.store'   // Zustand リセット用

const { NewMode, EditMode } = composeStories(Stories)

// setupServer() は空で作成し、ハンドラーは各テストで server.use() で追加する
const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })   // ← 'warn' ではなく 'error'
})

afterEach(() => {
  cleanup()                                         // ← 必須: DOM クリーンアップ
  server.resetHandlers()
  useSchemaCreationStore.getState().reset()         // ← Zustand ストアをリセット
})

afterAll(() => {
  server.close()
})

describe('SchemaCreationOrganism / NewMode', () => {
  test('初期表示: ヘッダー見出しと操作ボタンが描画される', async () => {
    server.use(...Stories.commonHandlers)  // stories ファイルの named export を参照
    render(<NewMode />)

    expect(screen.getByText('シェーマ作成')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '確定' })).toBeEnabled()
  })

  test('キャンセルボタン押下: onCancel が呼ばれる', async () => {
    server.use(...Stories.commonHandlers)
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<NewMode onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'キャンセル' }))

    expect(onCancel).toHaveBeenCalledOnce()
  })
})

describe('SchemaCreationOrganism / EditMode', () => {
  test('初期表示: ヘッダー見出しとフッターボタンが描画される', async () => {
    server.use(...Stories.editModeHandlers)  // EditMode 固有ハンドラー
    render(<EditMode />)

    await waitFor(() => {
      expect(screen.getByText('シェーマ作成')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeEnabled()
  })
})
```

**重要ポイント:**
- `within` は `@testing-library/dom` から（`@storybook/test` ではない）
- `Story.run()` は使わない — `render(<Story />)` で RTL レンダリング
- `setupServer()` は引数なしの空で作成
- ハンドラーは各テストの **先頭で** `server.use(...Stories.commonHandlers)` で登録
- `afterEach` に `cleanup()` と Zustand `store.getState().reset()` の両方が必要
- `import '@testing-library/jest-dom/vitest'` を最上部に追加（`.toBeInTheDocument()` 等のマッチャーが必要）

### Canvas コンポーネントのスタブ（jsdom 用）

`vitest.setup.ts` で `HTMLCanvasElement.prototype.getContext` をスタブ化する（T9-8 参照）。

---

## T9-4: storyファイルへの `fn()` 追加（Actions タブ + テストスパイの両立）

T9-1 で特定した全storyファイルに `@storybook/test` の `fn()` を導入する。
`fn()` は **Actions タブへのログ** と **Vitest テストのスパイ** を同時に提供する。
`@storybook/addon-actions` の `action()` は使わない（テストから参照できないため）。

### なぜ `fn()` を使うか

| 比較 | `action()` | `fn()` |
|---|---|---|
| Actions タブに表示 | ✅ | ✅ |
| テストから `toHaveBeenCalledWith` | ❌ | ✅ |
| `mockClear()` でリセット | ❌ | ✅ |

`fn()` は Vitest の `vi.fn()` 互換スパイ。Storybook の Actions タブにも自動でログされる。

### 対象ファイル

T9-1 の判定結果に関わらず、moleculesとorganismsの**全storyファイル**が対象。

### import パターン

```tsx
import { fn } from '@storybook/test';
```

> `@storybook/test` は `@storybook/experimental-addon-test` に含まれる（T9-8 でインストール済み）。

### meta.args への `fn()` 追加パターン

コールバック Props（`onXxx` / `handleXxx` 等）を `fn()` で定義する。
`meta.args` に置くことで全 Story が共有し、テストからも `Story.args.onXxx` で参照できる。

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ToolbarPanel } from './ToolbarPanel';

const meta = {
  title: '01_diagnosis/.../molecules/ToolbarPanel',
  component: ToolbarPanel,
  tags: ['autodocs'],
  args: {
    canUndo: false,
    canRedo: false,
    onUndo: fn(),    // ← fn() — Actions タブにログ ＆ テストスパイとして使える
    onRedo: fn(),
    onClear: fn(),
    onFlip: fn(),
  },
} satisfies Meta<typeof ToolbarPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHistory: Story = {
  args: { canUndo: true, canRedo: true },
};
```

### 確認方法（Storybook ブラウザ）

`npm run storybook` を起動してコンポーネントを開き、
下部の **Actions タブ**（画像参照: undo/redo/clear/flip ボタンをクリックするとイベント名と引数がリストされる）にログが表示されることを確認する。

`fn()` がセットされていれば、ボタンを押すたびに `onUndo called` 等がリアルタイム表示される。

---

## T9-5: React Testing Library を使ったコンポーネントテスト（AAA パターン）

`test/` 配下の `{storyファイル名}.test.tsx` に、`composeStories` + RTL + MSW node サーバーを組み合わせた
**Arrange / Act / Assert** 形式のコンポーネントテストを実装する。

### 前提パッケージ（vitest.config.ts の include に `*.test.tsx` が含まれること）

```json
"@testing-library/react": "^16.x",
"@testing-library/user-event": "^14.x",
"@testing-library/jest-dom": "^6.x",
"msw": "^2.x"
```

`vitest.setup.ts` で `import '@testing-library/jest-dom'` を読み込んでおくこと。

### MSW node サーバーの立て方

```ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// 空で作成し、ハンドラーは各テストで server.use() で登録する
const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));  // 'error' でモック漏れを即検出
afterEach(() => {
  cleanup();                                 // RTL DOM クリーンアップ
  server.resetHandlers();
  useXxxStore.getState().reset();            // Zustand ストアリセット（機能に合わせて置き換える）
});
afterAll(() => server.close());
```

> `msw/node` は Node 環境（Vitest）用。Storybook の `msw-storybook-addon` とは別物。
> `onUnhandledRequest: 'error'` にすることでモックされていないリクエストを即座にテスト失敗にできる。
> `afterEach` で `cleanup()` と Zustand リセットを忘れると、テスト間で DOM・状態が汚染される。

### テストファイルの AAA パターン

```tsx
import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { composeStories } from '@storybook/react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { within } from '@testing-library/dom'   // @storybook/test ではなく @testing-library/dom
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import * as Stories from '../components/organisms/SchemaCreationOrganism.stories'
import { useSchemaCreationStore } from '../stores/schemaCreation.store'

const { NewMode, EditMode } = composeStories(Stories)

// 空で作成 — ハンドラーは各テストで server.use() で登録
const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup()                                    // DOM クリーンアップ
  server.resetHandlers()
  useSchemaCreationStore.getState().reset()    // Zustand ストアリセット
})

afterAll(() => server.close())

describe('SchemaCreationOrganism / NewMode', () => {
  test('初期表示: Undo・クリアは無効、キャンセル・確定は有効', () => {
    // Arrange
    server.use(...Stories.commonHandlers)
    render(<NewMode />)

    // Act（初期表示のため操作なし）

    // Assert
    expect(screen.getByRole('button', { name: '元に戻す' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '確定' })).toBeEnabled()
  })

  test('キャンセル押下（描画なし）: ダイアログなしで onCancel が呼ばれる', async () => {
    // Arrange
    server.use(...Stories.commonHandlers)
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<NewMode onCancel={onCancel} />)

    // Act
    await user.click(screen.getByRole('button', { name: 'キャンセル' }))

    // Assert
    expect(onCancel).toHaveBeenCalledOnce()
  })

  test('確定押下（描画なし）: 空白確認ダイアログが表示される', async () => {
    // Arrange
    server.use(...Stories.commonHandlers)
    const user = userEvent.setup()
    render(<NewMode />)

    // Act
    await user.click(screen.getByRole('button', { name: '確定' }))

    // Assert
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
  })
})
```

### args の上書き

`composeStories` が生成した Story コンポーネントは、通常の React コンポーネントと同じく props で上書きできる。
`onConfirm` / `onCancel` のような callback は `vi.fn()` に差し替えることで呼び出し検証が可能。

```tsx
render(<NewMode onCancel={vi.fn()} onConfirm={vi.fn()} />);
```

### よくある落とし穴

| 症状 | 原因 | 対処 |
|---|---|---|
| テスト内で API が 500 になる | `server.listen()` の前に `render` している | `beforeAll` で `server.listen()` してから `render` する |
| `onCancel` が呼ばれない | `undoStack` が空でない（前テストの残留） | `afterEach(() => server.resetHandlers())` + Zustand ストアのリセットを確認 |
| `getByRole('dialog')` が見つからない | ダイアログが portal 経由でマウントされる | `waitFor` でポーリングする |
| `toBeDisabled()` が通らない | `aria-disabled` のみ付与されている | `toHaveAttribute('disabled')` または `toBeDisabled()` を両方試す |

---

## T9-6: テスト固有ハンドラーの追加（server.use）

各テストの冒頭で `server.use()` を呼んでそのテスト用のハンドラーを登録する。
`afterEach(() => server.resetHandlers())` が自動リセットするため、テスト間の汚染はない。

### 基本: commonHandlers をそのまま使う

```tsx
test('初期表示: ヘッダーが描画される', async () => {
  server.use(...Stories.commonHandlers)   // 全テストにこのパターンを使う
  render(<NewMode />)
  expect(screen.getByText('シェーマ作成')).toBeInTheDocument()
})
```

### テスト固有のレスポンスが必要な場合: スパイハンドラーを先頭に追加

MSW はハンドラーを **配列の先頭から優先適用** する。
スパイハンドラーを先頭に置き、残りを `...Stories.commonHandlers` で補完する。

```tsx
test('お気に入り追加: POST が呼ばれてボタンが切り替わる', async () => {
  const postSpy = vi.fn()
  server.use(
    // スパイハンドラーを先頭に登録 → commonHandlers の同パスより優先
    http.post('http://localhost:3001/bff/favorites', async ({ request }) => {
      const body = await request.json()
      postSpy(body)
      return new HttpResponse(null, { status: 204 })
    }),
    ...Stories.commonHandlers,
  )
  // ...
})
```

### EditMode 固有ハンドラー

```tsx
test('EditMode: ヘッダーが描画される', async () => {
  server.use(...Stories.editModeHandlers)  // editModeHandlers = commonHandlers + スキーマ取得
  render(<EditMode />)
  await waitFor(() => expect(screen.getByText('シェーマ作成')).toBeInTheDocument())
})
```

### server.boundary（オプション）

複数のスパイハンドラーが絡む複雑なテストでは `server.boundary` でスコープを明示できる。
**必須ではない** — `afterEach` の `server.resetHandlers()` で十分な場合がほとんど。

```tsx
test('テスト名', server.boundary(async () => {
  server.use(/* テスト固有ハンドラー */)
  // ...
}))
```

---

## T9-7: storyファイル handlers と テスト handlers の整合確認

テストファイルが `Stories.commonHandlers` / `Stories.editModeHandlers` を参照しているため、
storyファイルが正しく named export していることを確認する。

### 確認コマンド

```bash
# storyファイルの named export を確認
grep -r "export const commonHandlers\|export const editModeHandlers" \
  product/frontend/src --include="*.stories.tsx"

# テストファイルが Stories.commonHandlers を参照しているか確認
grep -r "Stories\.commonHandlers\|Stories\.editModeHandlers" \
  product/frontend/src --include="*.test.tsx"
```

### 整合チェックリスト

- [ ] storyファイルに `export const commonHandlers = [...]` が定義されている
- [ ] storyファイルに `export const editModeHandlers = [...commonHandlers, ...]` が定義されている
- [ ] `meta.parameters.msw.handlers` に `commonHandlers` が設定されている（Storybook ブラウザ表示用）
- [ ] `EditMode` の `parameters.msw.handlers` に `editModeHandlers` が設定されている
- [ ] テストファイルが `server.use(...Stories.commonHandlers)` / `server.use(...Stories.editModeHandlers)` で参照している
- [ ] `POST /bff/favorites` / `DELETE /bff/favorites/:templateId` の 204 レスポンスが `new HttpResponse(null, { status: 204 })` で統一されている

---

---

## よくある落とし穴

| 症状 | 原因 | 対処 |
|---|---|---|
| `setProjectAnnotations is not a function` | `@storybook/react` のバージョン不整合 | `@storybook/react` と `storybook` のバージョンを揃える |
| Canvas コンポーネントが jsdom でエラー | `<canvas>` が jsdom 未実装 | `vitest.setup.ts` で `HTMLCanvasElement.prototype.getContext = () => null` をスタブする |
| `import.meta.env` が undefined | Vite 環境変数が Vitest に引き継がれない | `vitest.config.ts` の `define` に `{ 'import.meta.env': {} }` を追加 |
| `autodocs` に description が出ない | `tags: ['autodocs']` が抜けている | `meta.tags` に `'autodocs'` を追加する |

---

## T9-9: MSW不要コンポーネントのstoryテストファイル作成

T9-1 で **MSW不要** と判定した molecules の全storyファイルに対応するテストファイルを作成する。

### 対象コンポーネント（MSW不要）

tasklist.md の T9-1 テーブルで「MSW不要」と判定された molecules が対象。
REC002 では以下の14コンポーネントが対象:

- CanvasTextInput / ColorPalette / ColorPickerPanel / ConfirmDialog / DrawingCanvas
- ErrorDialog / FavoriteToggleButton / LineWidthControl / OtherActionControls
- SchemaCreationFooter / SchemaCreationHeader / TemplateCard / TemplatePanel / ToolBox

### テストファイルの配置

```
src/features/{LV1}/{LV2}/{LV3}/
  test/
    {コンポーネント名}.test.tsx   ← LV3/test/ 直下（サブディレクトリは作らない）
```

### `fn()` を使ったテストパターン（推奨）

T9-4 で story の `meta.args` に `fn()` をセットした場合、テストは `Story.args.onXxx` を直接スパイとして使える。
`vi.fn()` を別途作る必要がなく、story と同じ mock オブジェクトを共有する。

**全操作をカバーするサンプル（ToolbarPanel — 操作数が最多のコンポーネント）:**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, beforeEach } from 'vitest';
import * as stories from '../components/molecules/ToolbarPanel.stories';

const { Default, WithHistory } = composeStories(stories);

describe('ToolbarPanel', () => {
  // story の fn() スパイを各テスト前にクリア
  beforeEach(() => {
    Default.args.onUndo?.mockClear?.();
    Default.args.onRedo?.mockClear?.();
    Default.args.onClear?.mockClear?.();
    Default.args.onFlip?.mockClear?.();
    WithHistory.args.onUndo?.mockClear?.();
    WithHistory.args.onRedo?.mockClear?.();
  });

  // --- C0: 基本レンダリング（全 UI 要素の存在確認）---
  test('Default story: Undo・Redo・クリア・反転ボタンが存在する', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: '元に戻す' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'やり直す' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'クリア' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '反転' })).toBeInTheDocument();
  });

  // --- C1: disabled 分岐（canUndo/canRedo が false のとき非活性）---
  test('Default story: canUndo=false のとき Undo ボタンが無効', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: '元に戻す' })).toBeDisabled();
  });

  test('Default story: canRedo=false のとき Redo ボタンが無効', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: 'やり直す' })).toBeDisabled();
  });

  test('WithHistory story: canUndo=true のとき Undo ボタンが有効', () => {
    render(<WithHistory />);
    expect(screen.getByRole('button', { name: '元に戻す' })).toBeEnabled();
  });

  test('WithHistory story: canRedo=true のとき Redo ボタンが有効', () => {
    render(<WithHistory />);
    expect(screen.getByRole('button', { name: 'やり直す' })).toBeEnabled();
  });

  // --- C2: 全コールバック操作（fn() スパイで呼び出しを検証）---
  test('Undo ボタン押下で onUndo が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<WithHistory />);
    await user.click(screen.getByRole('button', { name: '元に戻す' }));
    expect(WithHistory.args.onUndo).toHaveBeenCalledOnce();
  });

  test('Redo ボタン押下で onRedo が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<WithHistory />);
    await user.click(screen.getByRole('button', { name: 'やり直す' }));
    expect(WithHistory.args.onRedo).toHaveBeenCalledOnce();
  });

  test('クリアボタン押下で onClear が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: 'クリア' }));
    expect(Default.args.onClear).toHaveBeenCalledOnce();
  });

  test('反転ボタン押下で onFlip が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: '反転' }));
    expect(Default.args.onFlip).toHaveBeenCalledOnce();
  });
});
```

**重要ポイント:**
- `fn()` スパイは story 間で共有されるため、`beforeEach` で `mockClear()` することで前テストの呼び出し記録を消す
- C2 テストは操作ごとに1テストケース（「全操作を1テストで書く」は避ける）
- 操作数が最多のコンポーネントを先に書き、他コンポーネントも同じパターンで実装する
- `Story.args.onXxx` の型は `((...args: any[]) => any) & MockInstance` — `mockClear` / `toHaveBeenCalledWith` が使える

### C0 / C1 / C2 カバレッジ観点

| 観点 | 内容 | テストで確認する内容 |
|---|---|---|
| **C0**（ステートメント） | 各ステートメントが最低1回実行される | 全 UI 要素の存在確認・初期レンダリング |
| **C1** （ブランチ） | すべての条件分岐（true/false）が実行される | disabled/enabled 分岐・open/closed 分岐・isFavorite 分岐 |
| **C2** （関数） | すべての関数が最低1回呼ばれる | **操作ごとに独立したテストケース**を書く（ツール選択・undo・redo・clear・flip 等） |

> C2 は「全コールバックが呼ばれるか」だけでなく、「どの引数で呼ばれるか」まで検証することで仕様網羅性が高まる。
> 例: `expect(Story.args.onToolSelect).toHaveBeenCalledWith('pen')` のように引数まで確認する。

---

## T9-10: RTL + カバレッジ C0/C1/C2 対応 Vitest 設定

### vitest.config.ts の coverage セクション

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.stories.test.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      // C0: ステートメントカバレッジ
      // C1: ブランチカバレッジ（条件分岐）
      // C2: 関数カバレッジ
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        statements: 80,   // C0
        branches: 70,     // C1
        functions: 80,    // C2
        lines: 80,
      },
      include: [
        'src/features/**/components/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/types/**',
        'src/**/assets/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});
```

### カバレッジレポート確認コマンド

```bash
cd product/frontend && npm run test -- --run --coverage
```

`coverage/index.html` をブラウザで開くと C0/C1/C2 の詳細が確認できる。

---

## T9-11: CI テスト実行設定（2ファイルのみ、gitlab-ci.yml は触らない）

`.gitlab-ci.yml` は変更しない。変更するのは以下の2ファイルだけ。

---

### ステップ 1: `product/frontend/ci.env` を更新

```
# product/frontend/ci.env
# CI 実行対象スクリプト（機能切り替え時はここだけ変更）
VITEST_SCRIPT=test:REC002
E2E_SCRIPT=test:e2e:REC002
```

- `VITEST_SCRIPT` に `package.json` の `test:{機能コード}` スクリプト名を書く
- `E2E_SCRIPT` に `package.json` の `test:e2e:{機能コード}` スクリプト名を書く
- 機能切り替え時はこの2行だけ変更する
- このファイルは Git 管理下（`.gitignore` の除外対象外）

---

### ステップ 2: `package.json` にテストスクリプトを追記

LV3 の `test/` ディレクトリを確認してからスクリプトを追加する:

```bash
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/test -name "*.test.tsx" | sort
```

**追加するスクリプト形式（`product/frontend/package.json`）:**

```json
"test:{機能コード}": "vitest run src/features/{LV1}/{LV2}/{LV3}/test",
"test:e2e:{機能コード}": "node src/features/{LV1}/{LV2}/{LV3}/test/{機能コード}-test.js"
```

- `test:{機能コード}` — Vitest（LV3/test/ 配下の全 `*.test.tsx`）
- `test:e2e:{機能コード}` — E2E（Phase 10 で作成する `{機能コード}-test.js`）
- 既に同じスクリプト名がある場合は追記不要

**追記例（REC002 の場合）:**

```json
"test:REC002": "vitest run src/features/01_diagnosis/01_record-creation/01_schema-creation/test",
"test:e2e:REC002": "node src/features/01_diagnosis/01_record-creation/01_schema-creation/test/REC002-test.js"
```

> **注意**: `gitlab-ci.yml` は既に `source ci.env && npm run $VITEST_SCRIPT` / `npm run $E2E_SCRIPT` で動作するよう設定済み（`before_script` で `cd product/frontend` 済みのため `ci.env` の相対パスで読める）。このファイルは変更しない。

---

## Phase 9 チェックリスト

実施順序: T9-1 → T9-2 → **T9-8（Vitest設定）** → T9-3（テスト作成） → T9-4〜T9-7 → T9-9〜T9-11

```
□ T9-1: 対象storyファイルリストが tasklist.md に記録されている
□ T9-2: msw / msw-storybook-addon が devDependencies にある
□ T9-2: .storybook/preview.ts に mswLoader が設定されている
□ T9-2: 対象storiesに export const commonHandlers が定義されている
□ T9-2: 対象storiesに export const editModeHandlers が定義されている（EditModeがある場合）
□ T9-2: meta.parameters.msw.handlers に commonHandlers が設定されている
□ T9-8: vitest.config.ts が存在し include: ['src/**/*.test.{ts,tsx}'] になっている
□ T9-8: vitest.setup.ts に import '@testing-library/jest-dom/vitest' がある
□ T9-8: "test": "vitest" スクリプトが package.json にある
□ T9-3: LV3の test/ 直下に {コンポーネント名}.test.tsx が存在する（MSWありの対象）
□ T9-3: import { within } from '@testing-library/dom' になっている（@storybook/test ではない）
□ T9-3: setupServer() が引数なしの空で作成されている
□ T9-3: server.listen({ onUnhandledRequest: 'error' }) になっている
□ T9-3: afterEach に cleanup() と Zustand store.getState().reset() が両方ある
□ T9-3: 各テストの先頭で server.use(...Stories.commonHandlers) / server.use(...Stories.editModeHandlers) が呼ばれている
□ T9-4: 全storyファイルに import { fn } from '@storybook/test' がある
□ T9-4: meta.args のコールバック props が fn() で定義されている（action() は使わない）
□ T9-4: Storybook Actions タブでボタン押下時にイベントログが表示されることを確認済み
□ T9-5: test/ 配下の *.test.tsx に AAA パターンのコンポーネントテストが実装されている
□ T9-6: テスト固有ハンドラー（スパイ等）が server.use で先頭に追加されている（必要なテストのみ）
□ T9-7: storyファイルの commonHandlers とテストが同じ named export を参照している
□ T9-9: MSW不要の全moleculeコンポーネントに test/{コンポーネント名}.test.tsx が存在する
□ T9-9: C0（全要素レンダリング）・C1（disabled/open等の分岐）・C2（全コールバック操作を個別テスト）が実装されている
□ T9-9: C2 テストが Story.args.onXxx（fn() スパイ）を使っている（vi.fn() を別途作らない）
□ T9-9: beforeEach で mockClear() を呼んでいる（テスト間のスパイ汚染防止）
□ T9-10: vitest.config.ts に coverage セクション（C0 statements 80% / C1 branches 70% / C2 functions 80%）がある
□ T9-11: product/frontend/ci.env に VITEST_SCRIPT=test:{機能コード} が定義されている
□ T9-11: product/frontend/ci.env に E2E_SCRIPT=test:e2e:{機能コード} が定義されている
□ T9-11: package.json に "test:{機能コード}" スクリプトが追加されている（例: "test:REC002"）
□ T9-11: package.json に "test:e2e:{機能コード}" スクリプトが追加されている（例: "test:e2e:REC002"）
□ .gitlab-ci.yml は変更しない（既存ジョブが ci.env を読む構成になっている）
□ npm run test:{機能コード} がエラーなく完了する（対象 *.test.tsx が全て green）
```

## Phase 9 完了後

全タスクが完了したら **`Skill('implement-phase9-test')`** を起動して最終検証する。

チェック通過（PASS）になってから Phase 10（E2Eテスト）へ進む。
