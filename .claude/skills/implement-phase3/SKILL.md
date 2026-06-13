---
name: implement-phase3
description: Phase 3（状態管理）のスキル。T3-1 を実行するときに参照する。Zustand ストア実装（Page スコープ・Global スコープ・storeRegistry 登録）を行う。TRIGGER when: Phase 1（T1-1〜T1-3）が完了し、Phase 3 を開始するとき。やること: ① design_detail の `## 状態管理ルール（画面固有）` を読み、必要なストアを特定 ② Page スコープの Zustand ストアを `features/**/stores/` に実装 ③ storeRegistry への登録 ④ TypeScript型の確認。DO NOT TRIGGER when: Phase 1 未完了のとき、または Phase 4 以降を実行するとき。
---

**作業原則**: このスキルの作業中、不明点があれば作業を中断してユーザーに報告し指示を仰ぐこと。推測や独自判断で進めない。

# Phase 3: 状態管理

Phase 1（T1-1〜T1-3）が完了してから開始する。
設計書の `## 状態管理ルール（画面固有）` を読み、必要な Zustand ストアをすべて実装する。

---

## チェックリスト

```
Phase 3: 状態管理（T1-3 完了後）
└── T3-1: Zustandストア実装
```

---

## 事前確認

### 参照する設計書

| 参照先 | 確認ポイント |
|---|---|
| `{design_detail}` `## 状態管理ルール（画面固有）` | この機能で必要なストアの状態・アクション一覧（T3-1 の実装対象） |
| `02_詳細設計書/14.状態管理設計.md` `### クライアント状態 / UI状態` | Zustand の役割・スコープ定義（Global / Domain / Page） |
| `02_詳細設計書/14.状態管理設計.md` `### Storeのスコープ定義とライフサイクル` | 配置場所・ライフサイクル・永続化ルール |

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`
>
> **`02_詳細設計書/` の参照パス規則**:
> 1. `docs/02_アプリ基盤/{component}/02_詳細設計書/{ファイル名}` — 作業中版（正式版がない場合はこちらを参照）
> 2. `docs/02_アプリ基盤/{component}/02_詳細設計書/new/{ファイル名}` — 正式版（存在すればこちらを使う）

---

## T3-1: Zustandストア実装

`features/{LV1}/{LV2}/{LV3}/stores/` 配下にストアファイルを作成する。

### 実装前の洗い出し

`design_detail` の `## 状態管理ルール（画面固有）` からストアに必要な情報を全件抽出し、以下の表を埋める。

| 状態名 | 型 | 初期値 | アクション名 | スコープ |
|---|---|---|---|---|
| 例: selectedTool | `string` | `'pen'` | `setSelectedTool` | Page |
| 例: strokeColor | `string` | `'#000000'` | `setStrokeColor` | Page |
| （残りを埋める） | | | | |

> 設計書の状態が全件テーブルに記載されていることを確認してから実装を開始する。
> スコープが Page / Domain / Global のいずれかを設計書から判断する（不明な場合は Page を採用）。

### スコープと配置先

| スコープ | 対象 | 配置先 |
|---|---|---|
| **Page**（揮発・画面固有） | 特定画面内のUIフラグ・検索条件・モーダル開閉状態 | `features/{LV1}/{LV2}/{LV3}/stores/{機能名}.store.ts` |
| **Domain**（画面跨ぎ） | 選択中の患者ID・診療コンテキスト | `src/shared/stores/{機能名}.store.ts` |
| **Global**（永続） | 認証情報・テナントID・テーマ設定 | `src/shared/stores/{機能名}.store.ts` + `persist` ミドルウェア |

> 機能固有（Page スコープ）のストアは `features/` 配下に置く。他機能から参照が必要になった場合は `shared/` への昇格を検討する。

### ファイル命名規則

| 対象 | パターン | 例 |
|---|---|---|
| ストアファイル | `{機能名}.store.ts` | `schemaCreation.store.ts` |
| フック名 | `use{機能名}Store` | `useSchemaCreationStore` |
| 初期値定数 | `INITIAL_{機能名}_STATE` | `INITIAL_SCHEMA_CREATION_STATE` |

> `{機能名}` は camelCase で統一する。

### 実装パターン（Page スコープ — 標準）

機能固有の揮発状態を管理する標準パターン。

```typescript
// features/{LV1}/{LV2}/{LV3}/stores/{機能名}.store.ts
import { create } from 'zustand';

type {機能名}Store = {
  // --- State ---
  selectedTool: string;
  strokeColor: string;
  isLoading: boolean;
  // --- Actions ---
  setSelectedTool: (tool: string) => void;
  setStrokeColor: (color: string) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
};

const INITIAL_{機能名}_STATE = {
  selectedTool: 'pen',
  strokeColor: '#000000',
  isLoading: false,
} satisfies Omit<{機能名}Store, 'setSelectedTool' | 'setStrokeColor' | 'setIsLoading' | 'reset'>;

export const use{機能名}Store = create<{機能名}Store>()((set) => ({
  ...INITIAL_{機能名}_STATE,
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  reset: () => set(INITIAL_{機能名}_STATE),
}));

// Page スコープは registerStore を呼ばない
// リセットは Phase 5 の Organism で useEffect cleanup として実装する
```

### 実装パターン（Global スコープ — LocalStorage 永続化）

ブラウザリロード後も維持すべき情報（テナントID・ユーザー設定等）に使用する。

```typescript
// src/shared/stores/{機能名}.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { registerStore } from './storeRegistry';

type TenantStore = {
  tenantId: string | null;
  setTenantId: (id: string) => void;
  reset: () => void;
};

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      tenantId: null,
      setTenantId: (id) => set({ tenantId: id }),
      reset: () => set({ tenantId: null }),
    }),
    {
      name: 'tenant-storage',                          // localStorage のキー名
      storage: createJSONStorage(() => localStorage),
    }
  )
);

registerStore(() => useTenantStore.getState().reset());
```

### storeRegistry の実装（初回のみ・未存在の場合）

`src/shared/stores/storeRegistry.ts` が存在しない場合は作成する。

```typescript
// src/shared/stores/storeRegistry.ts
type ResetFn = () => void;
const registry: ResetFn[] = [];

export function registerStore(resetFn: ResetFn): void {
  registry.push(resetFn);
}

export function resetAllStores(): void {
  registry.forEach((reset) => reset());
}
```

> `storeRegistry.ts` が既に存在する場合は上書きしない。`registerStore` と `resetAllStores` が export されていることだけ確認する。

### Page スコープ Store のリセット（コンポーネントアンマウント時）

Page スコープのストアはコンポーネントがアンマウントされる際に初期化する。
Organism コンポーネント（`useEffect` を使える最上位 Client Component）に記述する。

```typescript
// コンポーネント内でのリセット（useEffect の cleanup）
useEffect(() => {
  return () => {
    use{機能名}Store.getState().reset();
  };
}, []);
```

> Global / Domain スコープのストアにはこの cleanup を書かない（画面を離れても保持が必要なため）。

> **⚠️ 実装タイミング**: このリセット処理は **Phase 5 の T5-3（Organism 実装）** で書く。Phase 3 ではストアファイルのみ作成する。

### Global / Domain スコープのロード保証

Global / Domain スコープのストアは `registerStore()` を呼び出すが、**そのファイルが import されないと `registerStore()` が実行されない**。

以下のいずれかの方法で確実にロードする：

#### 方法1: stores/index.ts で re-export（推奨）

```typescript
// src/shared/stores/index.ts
export * from './authStore';
export * from './tenantStore';
export * from './themeStore';
export * from './patientStore';
export * from './notificationStore';
// ← 新しく作成したストアをここに追加
```

```typescript
// layout.tsx または root layout で一括 import
import '@/shared/stores';
```

#### 方法2: layout で直接 import

```typescript
// src/app/_providers/StoreProvider.tsx
'use client';

import '@/shared/stores/authStore';
import '@/shared/stores/tenantStore';
import '@/shared/stores/themeStore';
import '@/shared/stores/patientStore';
import '@/shared/stores/notificationStore';
// ← 新しく作成したストアをここに追加

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

> **重要**: Page スコープのストアはこのロード保証は不要（画面 import 時に自動ロードされる）。
> Global / Domain スコープのストアを新規作成した場合は、必ず上記のいずれかの方法でロードすること。

### 注意事項

- **`satisfies Omit<...>` を使う理由**: `INITIAL_STATE` 定数に型チェックを適用しつつ、`create<Store>()` に渡すときの型推論を正確にするため。直接 `as const` だけにしない。
- **アクション名の統一**: 状態を置き換える場合は `set{State名}` を基本とし、副作用がある処理は動詞+名詞（例: `confirmSelection`, `clearDraft`）にする。
- **1ファイル1ストア**: 複数の独立した関心事がある場合はストアを分割する（例: `drawing.store.ts` と `template.store.ts`）。ただし、共に Page スコープで同一コンポーネントから参照する場合は1ファイルにまとめてよい。
- **型定義の再利用**: ストア内の型が `features/**/types/{機能名}.types.ts` に既に定義されている場合は import して再利用する（重複定義しない）。
- **`'use client'` 不要**: ストアファイル自体は `'use client'` を付けない。`use{機能名}Store` フックを呼ぶコンポーネント側で付与する。

---

## Phase 3 完了後

全タスクが完了したら **`Skill('implement-phase3-test')`** を起動してストア実装を検証する。

このスキルは以下を行う：
1. `design_detail` の `## 状態管理ルール（画面固有）` に定義された全状態が stores/ に実装されているかを照合
2. storeRegistry への登録（`registerStore` 呼び出し）が存在するかを確認
3. TypeScript コンパイルエラーが 0 件であることを確認

チェック通過（PASS）になってから Phase 4 へ進む。
