---
name: implement-phase6
description: Phase 6（機能実装）のスキル。T6-1〜T6-3 を実行するときに参照する。主要操作の完全実装・サーバー連携（楽観的更新）・確定キャンセル処理を行う。TRIGGER when: Phase 5（T5-1〜T5-3）が完了し、Phase 6 を開始するとき。やること: ① design_detail の `## AI実装制約` > `### 操作イベント定義` を読み全イベントを把握 ② Organism に操作ロジックを接続（T6-1） ③ 楽観的更新付きサーバー連携を実装（T6-2） ④ 確定・キャンセルフローを実装（T6-3）。DO NOT TRIGGER when: Phase 5 未完了のとき、または Phase 7 以降を実行するとき。
---

**作業原則**: このスキルの作業中、不明点があれば作業を中断してユーザーに報告し指示を仰ぐこと。推測や独自判断で進めない。

# Phase 6: 機能実装

Phase 5（T5-1〜T5-3 コンポーネント層）が完了してから開始する。
設計書の `## AI実装制約` > `### 操作イベント定義` を読み、スキャフォールド済みの Organism・hooks/ に実際の操作ロジックを実装する。

---

## チェックリスト

```
Phase 6: 機能実装（T5-x 完了後）
├── T6-1: 主要操作の完全実装
├── T6-2: サーバー連携（楽観的更新など）
├── T6-3: 確定・キャンセル処理
└── T6-4: 二次 shared 昇格チェック（components・hooks）
```

---

## 事前確認

### 参照する設計書・規約

| タスク | 参照先 | 確認ポイント |
|---|---|---|
| **T6-1** | `{design_detail}` `## AI実装制約` > `### 操作イベント定義` | 全操作イベントのトリガー・呼び出しフック・完了後の挙動 |
| **T6-2** | `04_状態管理設計/状態管理規約.md` | 全章（楽観的更新・ロールバック・React Query mutation パターン） |
| **T6-2** | `{design_detail}` `## 操作イベント定義` | サーバー送信が必要なイベントの特定 |
| **T6-3** | `{design_detail}` `## 操作イベント定義` / `## エラー表示設計` | 確定・キャンセルフローの仕様・エラーメッセージ定義 |

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`

**規約ファイルパス:** `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/04_状態管理設計/状態管理規約.md`

### T6-2 の規約参照セクション

`04_状態管理設計/状態管理規約.md` には以下の内容が含まれています:
- React Query の mutation パターン（楽観的更新・ロールバック）
- Zustand + repository を使う場合の状態管理パターン
- クエリキャッシュの同期と無効化
- エラー時のスナップショット復元

T6-2 実装前に必ず全章を読んで、楽観的更新の設計方針・ロールバック手順を確認すること。

### Next.js ベストプラクティス参照

Phase 6 では以下のスキルファイルを必要に応じて参照する（`product/.agents/skills/next-best-practices/`）。

| ファイル | 参照タイミング |
|---|---|
| `parallel-routes.md` | モーダルを `router.back()` で閉じる実装・`@slot` / インターセプティングルートを使うとき |
| `metadata.md` | `generateMetadata` を実装するとき・OG 画像生成が必要なとき |
| `scripts.md` | `next/script` でサードパーティスクリプトを読み込むとき |

---

## 実装前の洗い出し

`design_detail` の `## AI実装制約` > `### 操作イベント定義` から全イベントを抽出し、以下の表を埋める。

| イベントID | イベント名 | トリガー | 担当フック | API 呼び出し | 完了後の挙動 |
|---|---|---|---|---|---|
| 例: EVT_INIT01 | 初期表示 | マウント | `use{機能名}Init` | GET (並列) | ストアセット |
| 例: EVT_SELECT01 | 項目選択 | クリック | `handleSelectItem` | なし | ストア更新 |
| 例: EVT_SUBMIT01 | 確定 | クリック | `handleSubmit` | POST/PUT | 画面遷移 |
| 例: EVT_CANCEL01 | キャンセル | クリック | `handleCancel` | なし | ストアリセット・画面戻る |
| （残りを埋める） | | | | | |

> 全イベントが表に記載されていることを確認してから実装を開始する。
> T6 の実装対象は **Organism と hooks/**。Molecule は Props を受け取るだけで実装変更なし。

---

## T6-1: 主要操作の完全実装

Phase 5 でスキャフォールドした Organism に、hooks/ のハンドラーを接続して操作ロジックを完成させる。

### Organism への操作ロジック接続

```typescript
// features/{LV1}/{LV2}/{LV3}/components/organisms/{機能名}Organism.tsx
'use client';

import { useEffect } from 'react';
import { use{機能名}Init } from '../../hooks/use{機能名}Init';
import { use{機能名}Actions } from '../../hooks/use{機能名}Actions';
import { use{機能名}Submit } from '../../hooks/use{機能名}Submit';
import { use{機能名}Store } from '../../stores/{機能名}.store';
import { {Molecule名} } from '../molecules/{Molecule名}';

export function {機能名}Organism() {
  // Phase 4 で実装したフックを呼ぶ
  use{機能名}Init();
  const { handleSelectItem, handleDeleteItem } = use{機能名}Actions();
  const { isSubmitting, handleSubmit, handleCancel } = use{機能名}Submit();

  // Page スコープストアのリセット（Phase 5 から引き継ぎ）
  useEffect(() => {
    return () => {
      use{機能名}Store.getState().reset();
    };
  }, []);

  return (
    <div>
      <{Molecule名}
        onSelectItem={handleSelectItem}
        onDeleteItem={handleDeleteItem}
      />
      <div>
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? '送信中...' : '確定'}
        </button>
        <button onClick={handleCancel} disabled={isSubmitting}>
          キャンセル
        </button>
      </div>
    </div>
  );
}
```

### 注意事項

- **T6 の変更は Organism と hooks/ のみ**。Molecule は Phase 5 で実装済みの Props 境界のまま維持する。
- フック呼び出しは Organism に集約する（Molecule 内でフックを呼び始めない）。
- 確定ボタンは `isSubmitting` が true の間 `disabled` にして二重送信を防ぐ。

---

## T6-2: サーバー連携（楽観的更新）

`design_detail` の `## 操作イベント定義` でサーバー送信が必要なイベントを特定し、楽観的更新を実装する。

### パターン A: TanStack Query の useMutation を使う場合

```typescript
// features/{LV1}/{LV2}/{LV3}/hooks/use{機能名}Submit.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveData } from '../repository/{機能名}.repository';
import { useTenantStore } from '@/shared/stores/tenant.store';

export function use{機能名}Submit() {
  const queryClient = useQueryClient();
  const tenantId = useTenantStore((s) => s.tenantId);

  const mutation = useMutation({
    mutationFn: saveData,
    onMutate: async (newData) => {
      // 1. 進行中のクエリをキャンセルして競合を防ぐ
      await queryClient.cancelQueries({ queryKey: ['{機能名}', tenantId] });
      // 2. 現在のキャッシュをスナップショット（ロールバック用）
      const previous = queryClient.getQueryData(['{機能名}', tenantId]);
      // 3. 楽観的にキャッシュを更新
      queryClient.setQueryData(['{機能名}', tenantId], (old: unknown) => ({
        ...(old as object),
        ...newData,
      }));
      return { previous };
    },
    onError: (_err, _newData, context) => {
      // 4. エラー時はスナップショットに戻す
      queryClient.setQueryData(['{機能名}', tenantId], context?.previous);
      // Phase 7 でエラー UI を詳細化する
      console.error('保存に失敗しました');
    },
    onSettled: () => {
      // 5. 成功・失敗問わず最新データを再取得
      queryClient.invalidateQueries({ queryKey: ['{機能名}', tenantId] });
    },
  });

  return {
    isSubmitting: mutation.isPending,
    handleSubmit: mutation.mutate,
  };
}
```

> **クエリキーにテナントIDを含める理由**: テナント切り替え時に別テナントのキャッシュが表示されるのを防ぐ。

### パターン B: Zustand + repository を使う場合（TanStack Query 不使用時）

```typescript
// features/{LV1}/{LV2}/{LV3}/hooks/use{機能名}Submit.ts
'use client';

import { useCallback, useState } from 'react';
import { use{機能名}Store } from '../stores/{機能名}.store';
import { saveData } from '../repository/{機能名}.repository';

export function use{機能名}Submit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formData = use{機能名}Store((s) => s.formData);
  const setFormData = use{機能名}Store((s) => s.setFormData);

  const handleSubmit = useCallback(async () => {
    const snapshot = formData; // スナップショット（ロールバック用）
    setIsSubmitting(true);
    setFormData({ ...formData, _optimistic: true }); // 楽観的更新
    try {
      await saveData(formData);
    } catch (error) {
      setFormData(snapshot); // ロールバック
      // Phase 7 でエラー UI を詳細化する
      console.error('保存に失敗しました', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, setFormData]);

  return { isSubmitting, handleSubmit };
}
```

> **必ずロールバックを実装する理由**: 楽観的更新でキャッシュ/ストアを先に更新した後、API が失敗すると UI と実態が乖離する。`onError` / `catch` でスナップショットに戻す処理を省かないこと。

---

## T6-3: 確定・キャンセル処理

### 確定フロー

確定処理では送信成功後にナビゲーションとストアリセットを行う。

```typescript
// features/{LV1}/{LV2}/{LV3}/hooks/use{機能名}Submit.ts
'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use{機能名}Store } from '../stores/{機能名}.store';
import { saveData } from '../repository/{機能名}.repository';

export function use{機能名}Submit() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formData = use{機能名}Store((s) => s.formData);
  const isDirty = use{機能名}Store((s) => s.isDirty);
  const reset = use{機能名}Store((s) => s.reset);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await saveData(formData);
      reset(); // 成功後にストアをリセット
      router.push('/next-page'); // または router.back()
    } catch (error) {
      // Phase 7 でエラー UI を詳細化する
      console.error('保存に失敗しました', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, reset, router]);

  const handleCancel = useCallback(() => {
    if (isDirty) {
      // 未保存変更がある場合は確認ダイアログ（Phase 7 で詳細化）
      if (!confirm('変更内容が失われます。よろしいですか？')) return;
    }
    reset();
    router.back();
  }, [isDirty, reset, router]);

  return { isSubmitting, handleSubmit, handleCancel };
}
```

### 確定フローのポイント

| 項目 | 実装方針 |
|---|---|
| 二重送信防止 | `isSubmitting` が true の間、確定ボタンを `disabled` にする |
| 成功後のナビゲーション | `router.push('/next-page')` または `router.back()`（設計書の画面遷移図を参照） |
| ストアリセット | 成功後に `reset()` を呼んで画面固有の状態を破棄する |
| モーダルを閉じる場合 | `router.back()` を使う（`parallel-routes.md` のインターセプティングルートパターン参照） |

### キャンセルフローのポイント

| 項目 | 実装方針 |
|---|---|
| 未保存変更の確認 | `isDirty` フラグで変更あり/なしを判断（Phase 7 でカスタムモーダルに置き換え） |
| 画面を戻る | `router.back()` を使う（パラメーター付きの場合は設計書の遷移定義を参照） |
| ストアリセット | `router.back()` の前に `reset()` を呼ぶ |

---

---

## T6-4: 二次 shared 昇格チェック（components・hooks）

T0-4 の時点では「昇格候補かもしれない」止まりだった components と hooks を、実装が固まったこのタイミングで最終判定する。
**移動はここでは行わない。候補リストを作成し、人間の確認を得てから実施する。**

**⚠️ 重要: 昇格候補がゼロの場合でも、必ず tasklist.md に「昇格なし」を TODO として記録すること。**

### 判定対象

| カテゴリ | 確認ポイント |
|---|---|
| components（molecules） | 同じ Molecule を他の LV3 でも実装していた・今後使う可能性が高い |
| components（organisms） | 汎用パターンで他機能がそのまま使えそうな Organism |
| hooks | 同じロジックを別 LV3 でも書いた（認証チェック・ナビゲーションガード・共通フォーマット等） |

### 判定フロー

```
実装した components / hooks を 1 ファイルずつ確認
  │
  ├─ 同じ UI・ロジックが別 LV3 にも存在するか？
  │     YES → shared 昇格候補リストに追加
  │     NO  ↓
  │
  └─ 近い将来（次機能以内）に再利用が確実か？
        YES → shared 昇格候補リストに追加（コメントに理由を記す）
        NO  → LV3 に留める
```

### 成果物（tasklist.md に記録）

#### パターン A: 昇格候補あり

```markdown
## T6-4 二次 shared 昇格候補リスト

### components
- [ ] components/molecules/PatientBadge.tsx
      → shared/components/molecules/patient-badge.tsx
      （理由: REC001・REC002 両方で同一の患者バッジ UI を実装した）

### hooks
- [ ] hooks/useNavigationGuard.ts
      → shared/hooks/useNavigationGuard.ts
      （理由: 未保存変更の確認ダイアログは複数画面で共通パターン）

### 昇格なし
- components/organisms/SchemaCreationOrganism.tsx（この画面固有）
- hooks/useSchemaDrawing.ts（描画ロジックはこの画面のみ）
```

#### パターン B: 昇格候補なし（デフォルト）

**昇格候補がゼロの場合でも、必ず以下の TODO を tasklist.md に記録する:**

```markdown
## T6-4 二次 shared 昇格候補リスト

### 判定結果: 昇格候補なし

- [ ] 全 components / hooks を確認した結果、shared 昇格候補はありません
      理由: 全てがこの機能固有の実装であり、他機能での再利用可能性が低い
```

### 完了フロー

1. **昇格候補あり（パターン A）の場合**:
   - リストを tasklist.md に記録
   - **[Gate: CONFIRM]** で人間に確認
   - 承認されたら移動を実施してから Phase 7 へ進む

2. **昇格候補なし（パターン B）の場合**:
   - 「判定結果: 昇格候補なし」を tasklist.md に TODO として記録
   - **[Gate: CONFIRM]** で人間に「昇格候補なし」を確認
   - 承認されたらそのまま Phase 7 へ進む

**⚠️ 禁止事項: 昇格候補がゼロだからといって T6-4 をスキップしたり、tasklist.md に記録せずに Phase 7 へ進むことは禁止。**

---

## Phase 6 完了後

全タスクが完了したら **`Skill('implement-phase6-test')`** を起動して機能実装を検証する。

このスキルは以下を行う：
1. `design_detail` の `## 操作イベント定義` に定義された全イベントが Organism に実装されているかを照合
2. 楽観的更新（onMutate / snapshot）とロールバック（onError / catch）が実装されているかを確認
3. 確定ボタンの `disabled` 制御・キャンセル時のストアリセットを確認
4. TypeScript コンパイルエラーが 0 件であることを確認

チェック通過（PASS）になってから Phase 7 へ進む。
