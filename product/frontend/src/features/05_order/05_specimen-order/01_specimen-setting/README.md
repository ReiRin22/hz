# ORD023 検体検査オーダー設定

検体検査オーダー設定機能（`/dev/order/specimen-order/specimen-setting/ORD023`）の機能モジュール。
受診者一覧（REC020）のサイドパネルとして統合され、検体種別選択・セット選択・過去オーダー参照・緊急度設定・確定処理を提供する。

## 主要コンポーネント

### Organism

| コンポーネント | 責務 |
|---|---|
| `SpecimenOrderEntryOrganism` | サブタブ管理・オーダー一覧・編集フォームの統括 |
| `SpecimenOrderDetailPanel` | オーダー詳細パネル（種別・セット・履歴タブ切替） |
| `SpecimenContentPanel` | 検索・セット・履歴タブコンテンツの表示 |
| `SpecimenConfirmPanel` | 確定前プレビューパネル |
| `SpecimenOrderEditForm` | 検体オーダー編集フォーム |

### Molecule

| コンポーネント | 責務 |
|---|---|
| `SpecimenTypeSelector` | 検体種別（血液・尿・便等）の選択ボタン群 |
| `SpecimenUrgencySelector` | 緊急度（通常・緊急・超緊急）の選択ボタン群 |
| `SpecimenSetsList` | 院内共通セット・個人セットの一覧と追加操作 |
| `SpecimenSetSelector` | セットボタン一覧（ドロップダウン用） |
| `SpecimenHistoryList` | 過去オーダー履歴一覧と再追加操作 |
| `SpecimenOrderItemRow` | オーダー一覧の 1 行（検体種別・検査名・削除） |
| `SpecimenOrderConfirmButton` | 確定へ進むボタン（0 件時 disabled） |

## カスタムフック

| フック | 責務 |
|---|---|
| `useSpecimenPanelData` | 検体種別・セット・履歴データの初期取得 |
| `useSpecimenSections` | サブタブ状態・オーダーリスト操作 |
| `useSpecimenSets` | セット選択・セットアイテム追加 |
| `useSpecimenOrderSubmit` | オーダー確定処理・API 送信 |

## ディレクトリ構造

```
01_specimen-setting/
├── components/
│   ├── molecules/   ← Molecule コンポーネント本体
│   └── organisms/   ← Organism コンポーネント本体
├── stories/
│   ├── ORD023.stories.tsx        ← Feature レベル story
│   ├── molecules/   ← Molecule stories
│   └── organisms/   ← Organism stories
├── test/
│   ├── msw/handlers.ts           ← MSW ハンドラー（共通）
│   ├── *.stories.test.tsx        ← Storybook テスト
│   └── ORD023-test.js            ← Playwright E2E テスト
└── index.tsx                     ← 公開エントリーポイント（SpecimenOrderEntryFeature）
```

## E2E テストの実行方法

```bash
# Next.js 開発サーバーを起動しておくこと（localhost:3000）
bash .claude/scripts/server-test.sh ORD023
```

## Vitest 単体テストの実行方法

```bash
cd product/frontend
npx vitest run --config vitest.coverage-rec020-ord023.config.ts --coverage
```

カバレッジ閾値: Stmts 80% / Branches 70% / Funcs 80% / Lines 80%
