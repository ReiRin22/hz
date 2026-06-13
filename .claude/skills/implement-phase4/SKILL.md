---
name: implement-phase4
description: Phase 4（Hook 層）のスキル。T4-1 を実行するときに参照する。カスタムフック実装（初期化・操作・送信の3種）を行う。TRIGGER when: Phase 2（T2-1〜T2-2）と Phase 3（T3-1）が完了し、Phase 4 を開始するとき。やること: ① design_detail の `## 操作イベント定義` を読み、必要なフックを特定 ② 初期化フック（use{機能名}Init）を実装 ③ 操作フック（use{機能名}Actions）を実装 ④ 送信フック（use{機能名}Submit）を実装 ⑤ TypeScript型の確認。DO NOT TRIGGER when: Phase 2 または Phase 3 が未完了のとき、または Phase 5 以降を実行するとき。
---

**作業原則**: このスキルの作業中、不明点があれば作業を中断してユーザーに報告し指示を仰ぐこと。推測や独自判断で進めない。

# Phase 4: Hook 層

Phase 2（T2-1〜T2-2）と Phase 3（T3-1）が完了してから開始する。
設計書の `## 操作イベント定義` を読み、必要なカスタムフックをすべて実装する。

---

## チェックリスト

```
Phase 4: Hook 層（T2-x + T3-1 完了後）
└── T4-1: カスタムフック実装（初期化・操作・送信）
```

---

## 事前確認

### 参照する設計書

| 参照先 | 確認ポイント |
|---|---|
| `{design_detail}` `## 操作イベント定義` | この機能で必要なフックのハンドラー一覧（T4-1 の実装対象） |
| `04_状態管理設計/状態管理規約.md` 全章 | カスタムフック分類・クエリキー設計・基盤I/F利用 |
| `05_コンポーネント設計/コンポーネント設計規約.md` 全章 | Hook 配置・命名・UIとの責務分離 |
| Next.js `functions.md` | useRouter / usePathname / useSearchParams / useParams の API 仕様 |
| Next.js `suspense-boundaries.md` | useSearchParams は静的ルートで Suspense 境界が必須 |

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`

---

## T4-1: カスタムフック実装（初期化・操作・送信）

`features/{LV1}/{LV2}/{LV3}/hooks/` 配下にフックファイルを作成する。

### 実装前の洗い出し

`design_detail` の `## 操作イベント定義` からフックに必要な情報を全件抽出し、以下の表を埋める。

| イベントID | イベント名 | フック種別 | 担当フック | API 呼び出し |
|---|---|---|---|---|
| 例: EVT_INIT01 | 初期表示 | 初期化 | `useXxxInit` | `fetchInitialData` (並列) |
| 例: EVT_SELECT01 | 項目選択 | 操作 | `useXxxActions` | なし |
| 例: EVT_SUBMIT01 | 確定 | 送信 | `useXxxSubmit` | `saveData` |
| （残りを埋める） | | | | |

> 設計書の操作イベントが全件テーブルに記載されていることを確認してから実装を開始する。

### フック種別と配置先

Phase 4 では以下の3種類のフックを実装する。規約の4分類（状態管理規約.md §7.4）との対応関係も示す。

| 種別 | 役割 | ファイル名 | 配置先 | 規約の対応 |
|---|---|---|---|---|
| **初期化フック** | マウント時の初期データ取得・ストアへのセット | `use{機能名}Init.ts` | `features/{LV1}/{LV2}/{LV3}/hooks/` | データフェッチ（`useGet{Resource}`） |
| **操作フック** | ユーザー操作に対応するハンドラー群 | `use{機能名}Actions.ts` | `features/{LV1}/{LV2}/{LV3}/hooks/` | UI 状態管理（`use{Feature}State`） |
| **送信フック** | 確定・保存処理（API呼び出し・エラーハンドリング） | `use{機能名}Submit.ts` | `features/{LV1}/{LV2}/{LV3}/hooks/` | データ更新（`useSave{Resource}`） |
| **フォーム管理フック** | React Hook Form + Zod によるフォーム制御 | `use{機能名}Form.ts` | `shared/components/` の入力プラグイン | フォーム管理（`use{Feature}Form`）<br>**Phase 4 では実装しない** |

> 機能の性質によっては一部フックが不要な場合もある。設計書に対応するイベントがなければスキップしてよい（`tasklist.md` に理由を記録する）。

### ファイル命名規則

| 対象 | パターン | 例 |
|---|---|---|
| 初期化フック | `use{機能名}Init.ts` | `useSchemaCreationInit.ts` |
| 操作フック | `use{機能名}Actions.ts` | `useSchemaCreationActions.ts` |
| 送信フック | `use{機能名}Submit.ts` | `useSchemaCreationSubmit.ts` |

> `{機能名}` は PascalCase で統一する（ストアと同じ命名規則）。

---

### 実装パターン 1: 初期化フック

マウント時に初期データを取得し、Zustand ストアにセットする。

```typescript
// features/{LV1}/{LV2}/{LV3}/hooks/use{機能名}Init.ts
'use client';

import { useEffect } from 'react';
import { use{機能名}Store } from '../stores/{機能名}.store';
import { fetchInitialData } from '../repository/{機能名}.repository';

export function use{機能名}Init(param: string) {
  const setIsLoading = use{機能名}Store((s) => s.setIsLoading);
  const setData = use{機能名}Store((s) => s.setData);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchInitialData(param)
      .then((data) => {
        if (!cancelled) setData(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [param]);
}
```

> **`cancelled` フラグの理由**: コンポーネントがアンマウントされた後に非同期処理が完了すると、アンマウント済みのストアを更新しようとしてメモリリークや不整合が発生する。`cancelled` フラグを使って後続の状態更新を無効化する。

---

### 実装パターン 2: 操作フック

ユーザー操作（選択・入力・削除等）に対応するハンドラーをまとめる。Zustand ストアの状態更新を担当する。

```typescript
// features/{LV1}/{LV2}/{LV3}/hooks/use{機能名}Actions.ts
'use client';

import { useCallback } from 'react';
import { use{機能名}Store } from '../stores/{機能名}.store';

export function use{機能名}Actions() {
  const setSelectedItem = use{機能名}Store((s) => s.setSelectedItem);
  const setInputValue = use{機能名}Store((s) => s.setInputValue);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItem(id);
  }, [setSelectedItem]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, [setInputValue]);

  return {
    handleSelectItem,
    handleInputChange,
  };
}
```

> **`useCallback` を使う理由**: ハンドラーを `useCallback` でメモ化しないと、操作フックを呼ぶコンポーネントが再レンダリングするたびに新しい関数参照が生成され、子コンポーネントの `React.memo` が無効化される。

---

### 実装パターン 3: 送信フック

確定・保存処理を担当する。`repository/` 経由で保存 API を呼び、エラーハンドリングも含む（詳細は Phase 7 で強化）。

```typescript
// features/{LV1}/{LV2}/{LV3}/hooks/use{機能名}Submit.ts
'use client';

import { useCallback, useState } from 'react';
import { use{機能名}Store } from '../stores/{機能名}.store';
import { saveData } from '../repository/{機能名}.repository';

export function use{機能名}Submit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formData = use{機能名}Store((s) => s.formData);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await saveData(formData);
    } catch (error) {
      // Phase 7 でエラーハンドリングを詳細化する
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return { isSubmitting, handleSubmit };
}
```

---

### TanStack Query を使う場合（useQuery / useMutation）

設計書が TanStack Query を指定している場合は以下のパターンを使う。

**初期化（useQuery）:**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchInitialData } from '../repository/{機能名}.repository';
import { useTenantStore } from '@/shared/stores/tenant.store';

export function use{機能名}Init(param: string) {
  const tenantId = useTenantStore((s) => s.tenantId);

  return useQuery({
    queryKey: ['{機能名}-init', tenantId, param],  // テナントIDを含めてマルチテナント安全性を確保
    queryFn: () => fetchInitialData(param),
    enabled: !!tenantId && !!param,
  });
}
```

**送信（useMutation）:**

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveData } from '../repository/{機能名}.repository';
import { useTenantStore } from '@/shared/stores/tenant.store';

export function use{機能名}Submit() {
  const queryClient = useQueryClient();
  const tenantId = useTenantStore((s) => s.tenantId);

  return useMutation({
    mutationFn: saveData,
    onSuccess: () => {
      // 関連クエリを無効化して再取得を促す
      queryClient.invalidateQueries({ queryKey: ['{機能名}-init', tenantId] });
    },
  });
}
```

> **クエリキーにテナントIDを含める理由**: 複数テナントを切り替えると、前テナントのキャッシュが次テナントのデータとして表示されるリスクがある。テナントIDをキーに含めることで、テナント切り替え時に自動的に別キャッシュが参照される。

---

### フォーム管理フックについて（Phase 4 では実装しない）

**規約（状態管理規約.md §3）** ではフォーム管理フック（`use{Feature}Form.ts`）の分類があるが、これは **shared の入力プラグイン側で実装する想定** のため、Phase 4 では実装しない。

| 分類 | 実装場所 | Phase 4 での扱い |
|---|---|---|
| 初期化フック | `features/**/hooks/` | Phase 4 で実装 |
| 操作フック | `features/**/hooks/` | Phase 4 で実装 |
| 送信フック | `features/**/hooks/` | Phase 4 で実装 |
| **フォーム管理フック** | **`shared/components/` の入力プラグイン** | **Phase 4 では TODO メモのみ残す** |

**Phase 4 でフォーム入力が必要な場合:**

```typescript
// features/{LV1}/{LV2}/{LV3}/hooks/use{機能名}Form.ts
'use client';

// TODO: React Hook Form + Zod による実装
// 現状は shared の入力プラグイン側で実装予定のため仮実装
// 参照: 状態管理規約.md §3 フォーム管理規約
// 参照: コンポーネント設計規約.md §7.4 カスタムフック分類

export function use{機能名}Form() {
  // 仮実装: 基本的な状態管理のみ
  // 本実装時は以下を追加する:
  // - useForm<T>({ resolver: zodResolver(schema), mode, defaultValues })
  // - formState.errors / isDirty / isValid
  // - register / handleSubmit / reset
  
  return {
    // 仮の戻り値
  };
}
```

---

### Socket.io とリアルタイム通知について

**T4-2（useNotification フック）は optional タスク。** リアルタイム通知機能を持つ機能のみで実装する。

| 確認項目 | 判定基準 |
|---|---|
| `design_detail` の `## 操作イベント定義` に「リアルタイム通知」が定義されているか | ある → T4-2 を実装 |
| | ない → T4-2 をスキップ（tasklist.md に「スコープ外」と記録） |

**Socket.io とは:**
- WebSocket ベースのリアルタイム双方向通信ライブラリ
- サーバーからクライアントへイベントをプッシュ通知する（ポーリング不要）
- 例: 「他の医師が診療記録を更新しました」「新しい検査結果が到着しました」

**機能側 hooks からの呼び出し構造:**

```
[機能側 hooks]
  └── useNotification() を呼ぶ              ← 機能固有の hooks（例: useMedicalRecordActions）
       ↓
[shared/hooks/useNotification.ts]
  └── Socket.io 接続を内部で利用           ← 共通フック（全機能で共有）
       ↓
[shared/lib/socket.ts]
  └── Socket.io クライアント（シングルトン） ← 接続管理
       ↓
[BFF WebSocket エンドポイント]
  └── サーバー側 Socket.io
```

**機能側は Socket.io の存在を知らない。** `useNotification()` という抽象化されたフックを通して通知を受け取る。

**実装例（T4-2 が必要な場合）:**

```typescript
// features/{LV1}/{LV2}/{LV3}/hooks/use{機能名}Actions.ts
'use client';

import { useCallback, useEffect } from 'react';
import { useNotification } from '@/shared/hooks/useNotification';
import { use{機能名}Store } from '../stores/{機能名}.store';

export function use{機能名}Actions() {
  const { subscribe } = useNotification();
  const setSelectedItem = use{機能名}Store((s) => s.setSelectedItem);

  // リアルタイム通知の購読
  useEffect(() => {
    const unsubscribe = subscribe('medical_record_updated', (data) => {
      // 通知を受け取ったらストアを更新
      toast.info('診療記録が更新されました');
    });

    return () => unsubscribe();
  }, [subscribe]);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItem(id);
  }, [setSelectedItem]);

  return {
    handleSelectItem,
  };
}
```

**T4-2 の実装ファイル（必要な場合のみ）:**
- 参照規約: `08_リアルタイム通信設計/リアルタイム通信規約.md`
  - `## useNotificationフック`
  - `## Socket.io接続設定`
  - `## 再接続戦略`

---

### 注意事項

- **`'use client'` を付与する**: hooks はクライアントコンポーネントから呼ぶため、すべての hooks ファイルに `'use client'` を付与する。
- **hooks/ → repository/ 経由で API 呼び出し**: api/ を直接呼ばない。api/ は repository/ が使うレイヤーであり、hooks/ から飛び越して呼ぶと責務が混在する。
- **Zustand セレクターで必要な値だけ取得**: `use{機能名}Store((s) => s.xxx)` のようにセレクターを使い、ストア全体を購読しない。不要な再レンダリングを防ぐために重要。
- **Organism 層から同階層の別 Organism を import することは許容される**: `MenuOrganism.tsx` が `MenuSection.tsx` / `DashboardSection.tsx` を import するなど、同じ organisms/ 内での分割は問題ない。依存方向（下位層 → 上位層）を守る。
- **`useEffect` の依存配列を正確に記述**: lint（exhaustive-deps）に従い、使用している全変数を依存配列に記載する。依存配列が不完全だと古いクロージャを参照して画面が正しく更新されない。
- **`useSearchParams` を使う場合は Suspense 境界が必須**: 静的ルート（`generateStaticParams` あり）で `useSearchParams` を使うと、Next.js がビルド時に「Suspense 境界なし」エラーを出す。`<Suspense>` でラップすること（詳細は `suspense-boundaries.md` 参照）。

---

## Phase 4 完了後

全タスクが完了したら **`Skill('implement-phase4-test')`** を起動してフック実装を検証する。

このスキルは以下を行う：
1. `design_detail` の `## 操作イベント定義` に定義された全イベントが hooks/ でカバーされているかを照合
2. 初期化・操作・送信フックの存在確認
3. `'use client'` の付与確認・依存関係チェック（api/ への直接参照なし）
4. TypeScript コンパイルエラーが 0 件であることを確認

チェック通過（PASS）になってから Phase 5 へ進む。
