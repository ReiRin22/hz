---
name: implement-phase9-test
description: Phase 9（Storybookテスト強化）完了後の検証スキル。T9-1〜T9-11（API通信特定・MSW設定・storyテストファイル・actions追加・MSW不要コンポーネントテスト・カバレッジ設定・CI組み込み）が全て完了していることを確認する。TRIGGER when: Phase 9 の全タスクが [x] になったとき。DO NOT TRIGGER when: Phase 9 未完了のとき。
---

# Phase 9 完了確認

Phase 9 の全タスクが `[x]` になったら以下の項目を順番に確認する。
全項目 PASS で phase9-test PASS とする。

---

## T9-1: API通信対象特定確認

```bash
# tasklist.md に T9-1 の対象ファイルリストが記録されているか確認
grep -A5 "T9-1" .steering/*/tasklist.md
```

**PASS 条件:**
- [ ] T9-1 の対象ファイルリストが tasklist.md に記録されている
- [ ] organisms の story が対象に含まれている（API通信あり）
- [ ] 各storyファイルの使用APIエンドポイントが表形式で記録されている（MSW不要のものは「—」）

---

## T9-2: MSW設定確認

```bash
# MSWパッケージの存在確認
grep "msw" product/frontend/package.json

# preview.ts に mswLoader が設定されているか確認
grep "mswLoader\|msw-storybook" product/frontend/.storybook/preview.ts

# 対象storiesに parameters.msw.handlers が追加されているか確認
grep -r "parameters.msw\|msw.*handlers" product/frontend/src --include="*.stories.tsx"
```

**PASS 条件:**
- [ ] `msw` / `msw-storybook-addon` が devDependencies にある
- [ ] `.storybook/preview.ts` に `mswLoader` が設定されている
- [ ] T9-1 で特定した対象storiesに `parameters.msw.handlers` が追加されている

---

## T9-3: storyテストファイル確認

```bash
# LV3/test/ 直下にstoryテストファイルが存在するか確認
find product/frontend/src -path "*/test/*.test.tsx" | sort

# composeStories を使っているか確認
grep -r "composeStories" product/frontend/src --include="*.test.tsx"
```

**PASS 条件:**
- [ ] `src/**/test/` 直下に T9-1 で特定した対象のテストファイルが存在する（`test/stories/` サブディレクトリではない）
- [ ] `composeStories` + `render(<Story />)` の RTL パターンが実装されている（`Story.run()` ではない）

---

## T9-4: actions（fn()）追加確認

```bash
# fn import が全storyファイルにあるか確認
grep -r "from '@storybook/test'" \
  product/frontend/src --include="*.stories.tsx" | wc -l

# meta.args に fn() が使われているか確認
grep -r "fn()" product/frontend/src --include="*.stories.tsx" | head -20
```

**PASS 条件:**
- [ ] 全storyファイルに `import { fn } from '@storybook/test'` がある（`action` from `@storybook/addon-actions` ではない）
- [ ] `meta.args` のコールバック props が `fn()` で定義されている
- [ ] Storybook を起動して Actions タブにボタン押下ログが表示されることを確認済み

---

## T9-5: RTL + AAA パターン確認

```bash
# setupServer / beforeAll / afterEach / afterAll が揃っているか確認
grep -r "setupServer\|beforeAll\|afterEach\|afterAll" \
  product/frontend/src --include="*.test.tsx"

# onUnhandledRequest: 'error' になっているか確認（'warn' は不可）
grep -r "onUnhandledRequest" \
  product/frontend/src --include="*.test.tsx"

# within のインポート元が @testing-library/dom か確認
grep -r "from '@testing-library/dom'\|from '@storybook/test'" \
  product/frontend/src --include="*.test.tsx"

# afterEach に cleanup と Zustand リセットがあるか確認
grep -r "cleanup\|\.reset()" \
  product/frontend/src --include="*.test.tsx"
```

**PASS 条件:**
- [ ] `test/` 配下の `*.test.tsx` に AAA パターンのテストが実装されている
- [ ] `setupServer()` が引数なしで作成されている（ハンドラーは各テストで登録）
- [ ] `server.listen({ onUnhandledRequest: 'error' })` になっている（`'warn'` は不可）
- [ ] `afterEach` に `cleanup()` と Zustand `store.getState().reset()` が両方含まれている
- [ ] `within` が `@testing-library/dom` から import されている（`@storybook/test` ではない）
- [ ] 各テスト先頭で `server.use(...Stories.commonHandlers)` が呼ばれている

---

## T9-6: server.use によるテスト固有ハンドラー確認

```bash
# server.use が各テストで呼ばれているか確認
grep -r "server\.use" \
  product/frontend/src --include="*.test.tsx"
```

**PASS 条件:**
- [ ] 各テストの先頭で `server.use(...Stories.commonHandlers)` または `server.use(...Stories.editModeHandlers)` が呼ばれている
- [ ] スパイハンドラーが必要なテストでは `server.use(spyHandler, ...Stories.commonHandlers)` の形で先頭に登録されている
- [ ] `afterEach(() => server.resetHandlers())` が存在する（テスト間ハンドラー汚染防止）
- [ ] `server.boundary` は任意（使っても使わなくても可）

---

## T9-7: storyファイル handlers named export 整合確認

```bash
# storyファイルの named export を確認
grep -r "export const commonHandlers\|export const editModeHandlers" \
  product/frontend/src --include="*.stories.tsx"

# テストが Stories.commonHandlers を参照しているか確認
grep -r "Stories\.commonHandlers\|Stories\.editModeHandlers" \
  product/frontend/src --include="*.test.tsx"

# 絶対URL（localhost:3001）が使われているか確認
grep -r "http://localhost:3001" \
  product/frontend/src --include="*.stories.tsx" | head -5
```

**PASS 条件:**
- [ ] storyファイルに `export const commonHandlers = [...]` が定義されている
- [ ] `EditMode` がある場合 `export const editModeHandlers = [...commonHandlers, ...]` が定義されている
- [ ] `meta.parameters.msw.handlers` に `commonHandlers` が設定されている
- [ ] テストが `server.use(...Stories.commonHandlers)` で参照している（setupServer 引数にハンドラーを渡していない）
- [ ] handlers の URL が絶対 URL `http://localhost:3001/...` になっている

---

## T9-8: Vitest設定確認

```bash
# vitest.config.ts の存在確認
ls product/frontend/vitest.config.ts && echo "vitest.config.ts OK"

# test スクリプトの確認
grep '"test"' product/frontend/package.json && echo "test script OK"

# テスト実行（エラーなく完了するか確認）
cd product/frontend && npm run test -- --run 2>&1 | tail -20
```

**PASS 条件:**
- [ ] `vitest.config.ts` が存在する
- [ ] `"test": "vitest"` スクリプトが package.json にある
- [ ] `npm run test -- --run` がエラーなく完了する（全 `*.test.tsx` が green）

---

## T9-9: MSW不要コンポーネントのstoryテストファイル確認

```bash
# MSW不要の全コンポーネントにテストファイルが存在するか確認
find product/frontend/src -path "*/test/*.test.tsx" | grep -v SchemaCreationOrganism | sort

# composeStories が使われているか確認
grep -r "composeStories" \
  product/frontend/src --include="*.test.tsx" | grep -v SchemaCreationOrganism | wc -l

# fn() スパイが使われているか確認（Story.args.onXxx パターン）
grep -r "\.args\." \
  product/frontend/src --include="*.test.tsx" | grep -v SchemaCreationOrganism | head -20

# beforeEach の mockClear が存在するか確認
grep -r "mockClear" \
  product/frontend/src --include="*.test.tsx" | grep -v SchemaCreationOrganism | head -10
```

**PASS 条件:**
- [ ] MSW不要と判定された全moleculeコンポーネントのテストファイルが `test/` 直下に存在する
- [ ] C0（全 UI 要素の存在確認）・C1（disabled/open/isFavorite 等の分岐）・C2（全コールバックを個別テスト）が実装されている
- [ ] `Story.args.onXxx`（fn() スパイ）を使っている（`vi.fn()` を別途作らない）
- [ ] `beforeEach` で `mockClear()` を呼んでいる
- [ ] C2 テストが「操作ごとに独立したテストケース」になっている（1テスト = 1コールバック検証）

---

## T9-10: カバレッジ C0/C1/C2 設定確認

```bash
# vitest.config.ts に coverage セクションが存在するか確認
grep -A20 "coverage:" product/frontend/vitest.config.ts

# thresholds が設定されているか確認
grep "statements\|branches\|functions" product/frontend/vitest.config.ts
```

**PASS 条件:**
- [ ] `vitest.config.ts` に `coverage.provider: 'v8'` が設定されている
- [ ] `thresholds.statements >= 80`（C0）が設定されている
- [ ] `thresholds.branches >= 70`（C1）が設定されている
- [ ] `thresholds.functions >= 80`（C2）が設定されている
- [ ] `reporter: ['text', 'json', 'html', 'lcov']` が含まれている

---

## T9-11: CI テスト実行設定確認

```bash
# .steering/ci.env の内容確認
cat .steering/ci.env

# package.json にテストスクリプトが追加されているか確認
grep "test:" product/frontend/package.json

# 実際にテストが通るか確認（ci.env から変数を読んで実行）
source .steering/ci.env && cd product/frontend && npm run $VITEST_SCRIPT 2>&1 | tail -20
```

**PASS 条件:**
- [ ] `.steering/ci.env` に `VITEST_SCRIPT=test:{機能コード}` が定義されている
- [ ] `.steering/ci.env` に `E2E_SCRIPT=test:e2e:{機能コード}` が定義されている
- [ ] `package.json` に `"test:{機能コード}": "vitest run src/features/..."` スクリプトが存在する
- [ ] `package.json` に `"test:e2e:{機能コード}": "node .../test/{機能コード}-test.js"` スクリプトが存在する
- [ ] `.gitlab-ci.yml` は変更していない（変更したら差し戻す）
- [ ] `npm run test:{機能コード}` がエラーなく完了する（全テスト green）

---

## 総合判定

上記全チェックリストが `[x]` になれば **Phase 9 PASS**。

**PASS後の処理:**
1. `state.md` の `completed_phases` に `Phase 9: Storybookテスト強化 ✅ YYYY-MM-DD` を追記
2. `state.md` の `progress` を `Phase 9 完了。次は Phase 10 (T10-1: Next.jsルートパスの確認) から` に更新
3. 応答を終了する（Phase 10 には自発的に進まない）
