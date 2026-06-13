---
name: implement-phase7
description: Phase 7（バリデーション・エラーハンドリング）のスキル。T7-1〜T7-4 を実行するときに参照する。クライアントバリデーション（Zod）・APIエラーハンドリング統一・共通エラー基盤実装（BffApiError / toast / error.tsx）を行う。TRIGGER when: Phase 6（T6-3）が完了し、Phase 7 を開始するとき。DO NOT TRIGGER when: Phase 6 未完了のとき、または Phase 8 以降を実行するとき。
---

**作業原則**: このスキルの作業中、不明点があれば作業を中断してユーザーに報告し指示を仰ぐこと。推測や独自判断で進めない。

# Phase 7: バリデーション・エラーハンドリング

Phase 6（T6-3 確定・キャンセル処理）が完了してから開始する。
設計書の `## エラー表示設計` を読み、バリデーション・APIエラー・共通エラー基盤を実装する。

---

## 重要：Sentry 送信について

**hooks で `Sentry.captureException()` を呼ぶ必要はない。**

理由：
- API エラーは **axiosClient.ts Interceptor が自動送信**（業務エラー除く）
- ランタイムエラーは **error.tsx が自動送信**
- hooks で Sentry.captureException() を呼ぶと **二重送信** になる

hooks の責務は：
- エラーの重大度を判定
- `toast.error()` または `throw` でユーザー通知
- **Sentry 送信は基盤が自動で行う**（hooks では呼ばない）

詳細：`docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/09_監視エラーハンドリング設計/エラー処理基盤設計.md` §3 参照

---

## チェックリスト

```
Phase 7: バリデーション・エラーハンドリング（T6-3 完了後）
├── T7-1: クライアントバリデーション（Zodスキーマ + フォームエラー表示）
├── T7-2: APIエラーハンドリング統一（エラーコード分類・表示）
├── T7-3: 共通エラー基盤実装
│         ① shared/utils/bff-error.ts を import（既に存在するため新規作成不要）
│         ② api/ 通信関数の throw を BffApiError に統一
│         ③ hooks の catch ブロック完全実装
│            - 致命的：throw err（エラーコード判定なし）
│            - 重度・軽微：BffApiError.code で判定 + toast / redirect
│         ④ error.tsx 配置確認
└── T7-4: .gitkeep クリーンアップ
```

---

## 事前確認

### 参照する規約

| タスク | 参照先 | 確認ポイント |
|---|---|---|
| **T7-1〜T7-4** | `.claude/rules/cross-layer-rules.md` | 型安全性・層の責務・BE モック実装・環境設定の禁止事項 |
| **T7-1〜T7-4** | `.claude/rules/test-rules.md` | テスト設計・モック・非同期テストの禁止事項 |
| **T7-1** | `{design_detail}` `## エラー表示設計` | バリデーションルール・エラーメッセージ・表示形式 |
| **T7-3** | `{design_detail}` `## エラー表示設計` | エラーコード・重大度・通知形式の対応表 |

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`

---

## T7-1: クライアントバリデーション

`design_detail` の `## エラー表示設計` からバリデーションルールを全件抽出し、Zod スキーマを実装する。

### Zod スキーマの配置先

```
features/{LV1}/{LV2}/{LV3}/types/{機能名}.schema.ts
```

### 実装パターン

```typescript
// features/{LV1}/{LV2}/{LV3}/types/{機能名}.schema.ts
import { z } from 'zod';

export const {機能名}Schema = z.object({
  // 設計書 ## エラー表示設計 のバリデーションルールをすべて記述する
  fieldName: z.string().min(1, '入力してください').max(100, '100文字以内で入力してください'),
});

export type {機能名}FormValues = z.infer<typeof {機能名}Schema>;
```

### エラー表示パターン（shadcn/ui Alert）

```typescript
// Organism 内でのエラー表示例
{errors.fieldName && (
  <p className="text-sm text-destructive" role="alert">
    {errors.fieldName.message}
  </p>
)}
```

---

## T7-2: APIエラーハンドリング統一

`.claude/rules/cross-layer-rules.md` の **層の責務** セクションを参照し、HTTPステータスコード別のハンドリングを統一する。

### エラーコードと対応方針

| HTTP | エラーコード | 通知方法 |
|---|---|---|
| 400 | VALIDATION_ERROR | フォームフィールドへのインライン表示 |
| 401 | UNAUTHORIZED | ログインページへリダイレクト |
| 403 | FORBIDDEN | toast.error で権限不足を通知 |
| 404 | NOT_FOUND | ページリロードまたは一覧へ戻す |
| 409 | CONFLICT | toast.error で重複エラーを通知 |
| 500 | SYSTEM_ERROR | toast.error でシステムエラーを通知 |

---

## T7-3: 共通エラー基盤実装

### エラー処理の役割分担（重要）

| 層 | 責務 | Sentry 送信 | エラーコード判定 |
|---|---|---|---|
| **axiosClient Interceptor** | エラー検知・業務エラー判定・Sentry 自動送信 | ✅ 自動送信（業務エラー除く） | ❌ 不要 |
| **api/ 層** | `classifyHttpError()` で BffApiError を throw（分類のみ） | ❌ 送信しない | ❌ 不要 |
| **hooks 層（致命的）** | throw でそのまま error.tsx に委譲 | ❌ 送信しない | ❌ 不要（全部 throw） |
| **hooks 層（重度・軽微）** | **BffApiError の code を見て通知方法を判定** | ❌ 送信しない | ✅ **必要** |
| **error.tsx** | Error Boundary としてランタイムエラーを捕捉・Sentry 送信 | ✅ 自動送信 | ❌ 不要（全部同じ表示） |

**重要**：
- hooks で `Sentry.captureException()` を呼ぶ必要はない（axiosClient Interceptor が自動送信済み）
- **エラーコード判定は機能側 hooks でのみ必要**（error.tsx では不要）

### ① shared/utils/bff-error.ts の使用

`shared/utils/bff-error.ts` は基盤の共通ファイルとして既に存在している。

**機能実装時の作業**：
- ✅ import して使うだけ
- ❌ ファイル自体を編集しない
- ❌ エラーコードを追加しない

```typescript
// 各機能の api/ と hooks/ で import して使う
import { classifyHttpError, BffApiError } from '@/shared/utils/bff-error';
```

### ② api/ 通信関数の throw を BffApiError に統一

各 api/ 通信関数の `if (!res.ok)` ブロックを `classifyHttpError` に置き換える。

```typescript
// 変更前（Phase 2 で仮実装した状態）
if (!res.ok) {
  throw new Error(`GET /bff/xxx failed: ${res.status}`);
}

// 変更後
import { classifyHttpError } from '@/shared/utils/bff-error';

if (!res.ok) {
  throw classifyHttpError(res.status);
}
```

**確認手順**: `grep -rn "throw new Error" product/frontend/src/features/{LV1}/{LV2}/{LV3}/api/` で残存を確認する。

### ③ hooks の catch ブロック完全実装

Phase 4・6 で `// Phase 7 でエラーハンドリングを詳細化する` と記載した catch ブロックを全件実装する。

**重大度の判断基準**（`.claude/rules/cross-layer-rules.md` の **エラーの整合性** セクションを参照）:

| 重大度 | 判定条件 | 実装パターン | エラーコード判定 |
|---|---|---|---|
| 致命的（画面が使えない） | 初期表示失敗 | `throw err`（error.tsx に委譲） | ❌ 不要（全部 throw） |
| 重度（操作継続不可） | 保存失敗・権限エラー | `toast.error(message)` + エラーコード別処理 | ✅ **必要**（機能側で判定） |
| 軽微（即時リカバリ可） | お気に入り更新失敗・楽観的更新ロールバック後 | `toast.error(message)` | ✅ **必要**（機能側で判定） |

**実装パターン A: 致命的（error.tsx に委譲）— エラーコード判定なし**

```typescript
// hooks/use{機能名}Init.ts（初期表示）
useEffect(() => {
  fetchInitialData(param)
    .then(setData)
    .catch((err) => {
      // エラーコードを見ない、全部 throw
      // error.tsx が捕捉して「システムエラーが発生しました」を表示
      throw err;
    });
}, [param]);
```

> **error.tsx の役割**：
> - throw されたエラーを捕捉
> - 画面全体をエラー表示に切り替え
> - **エラーコード別の細かい制御はしない**（全部同じ表示）

**実装パターン B: 重度・軽微（機能側でエラーコード判定 + toast 通知）**

```typescript
// hooks/use{機能名}Submit.ts（保存処理）
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BffApiError } from '@/shared/utils/bff-error';

export function use{機能名}Submit() {
  const router = useRouter();

  const handleSubmit = useCallback(async (data) => {
    try {
      await saveData(data);
      toast.success('保存しました');
    } catch (err) {
      // ✅ 機能側でエラーコードを判定してユーザー通知方法を決定
      if (err instanceof BffApiError) {
        // E401: 認証エラー → ログインページへリダイレクト
        if (err.code === 'E401') {
          router.push('/login');
          return;
        }
        
        // E403: 権限エラー → toast で通知
        if (err.code === 'E403') {
          toast.error('この操作を行う権限がありません');
          return;
        }
        
        // その他のエラー（E404, E409, E999） → toast で通知
        toast.error(err.message);
      } else {
        // 予期しないエラー（axios 以外）
        toast.error('システムエラーが発生しました');
      }
      
      // ❌ Sentry.captureException() は呼ばない
      // 理由：axiosClient.ts Interceptor がすでに送信済み
    }
  }, [router]);

  return { handleSubmit };
}
```

> **重要**：
> - `toast` は `sonner` ライブラリを使用（shadcn/ui 標準）
> - **エラーコード判定は機能側 hooks で行う**（error.tsx では行わない）
> - **`Sentry.captureException()` を hooks で呼んではいけない**（axiosClient Interceptor が自動送信済み）
> - hooks の責務は「ユーザー通知方法の判定」のみ（toast / redirect / throw）

**確認手順**: `grep -rn "console\." product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/` で `console.log` / `console.error` が残っていないことを確認する。

### ④ error.tsx 配置確認

機能が属する Next.js ルートグループに `error.tsx` が存在するかを確認する。

```bash
# app/ 配下の error.tsx 一覧
find product/frontend/src/app -name "error.tsx" | sort
```

**判定ルール**（`.claude/rules/cross-layer-rules.md` 参照）:
- `src/app/error.tsx`（グローバル）が存在する → 機能群単位の `error.tsx` は省略可
- 機能が属するルートグループ（例: `src/app/karte/`）に `error.tsx` が存在する → OK
- どちらも存在しない → 追加が必要

**最小実装（追加が必要な場合）**:

```typescript
// src/app/{route-group}/error.tsx
'use client';

type ErrorProps = { error: Error; reset: () => void };

export default function RouteGroupError({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
      <p className="text-sm text-destructive">
        {error.message || 'システムエラーが発生しました'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
      >
        再試行
      </button>
    </div>
  );
}
```

---

## T7-4: .gitkeep クリーンアップ

実装済みファイルが存在するディレクトリの `.gitkeep` を削除する。

### ステップ 1: 残存確認

```bash
find product/frontend/src/features/{LV1}/{LV2}/{LV3} -name ".gitkeep" | sort
```

### ステップ 2: 各ディレクトリを確認して削除

`.gitkeep` と同じディレクトリに他のファイルが存在する場合のみ削除する（空ディレクトリの `.gitkeep` は残す）。

```bash
# .gitkeep が存在するディレクトリのファイル数を確認して削除判断する
for f in $(find product/frontend/src/features/{LV1}/{LV2}/{LV3} -name ".gitkeep"); do
  dir=$(dirname "$f")
  count=$(ls "$dir" | grep -v "^\.gitkeep$" | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "削除: $f（ディレクトリ内に他 $count ファイルあり）"
    rm "$f"
  else
    echo "保持: $f（ディレクトリが空のため）"
  fi
done
```

### ステップ 3: 削除後の確認

```bash
# 0件であることを確認（空ディレクトリがなければ0件）
find product/frontend/src/features/{LV1}/{LV2}/{LV3} -name ".gitkeep" | sort
```

---

---

## Phase 1-6 での最小実装

Phase 1-6 では **エラーハンドリングは最小限の仮実装でよい**：

| Phase | エラーハンドリング実装 |
|---|---|
| Phase 1-3（型・ストア・API・Repository） | api/ で throw するだけ（BffApiError 不要） |
| Phase 4（Hook 層） | hooks で `console.error(error)` の仮実装 |
| Phase 5-6（コンポーネント・機能実装） | エラーハンドリングなし |

**Phase 7 で全エラーハンドリングを完全実装する。**

---

## エラー種別の実装スコープ

設計書で定義された5種類のエラー（ネットワーク・API・業務・ランタイム・認可）は **基盤が自動処理** する。

| エラー種別 | 基盤の自動処理 | Phase 7 で追加する実装 |
|---|---|---|
| ネットワークエラー | axiosClient Interceptor が検知・Sentry 送信 | hooks で toast.error('通信エラー') |
| API エラー | axiosClient Interceptor が検知・Sentry 送信 | api/ で BffApiError throw + hooks で toast.error() |
| 業務エラー | axiosClient Interceptor が Sentry 送信を除外 | Zod スキーマ + インラインエラー表示 |
| ランタイムエラー | error.tsx が捕捉・Sentry 送信 | 初期表示失敗時に throw err |
| 認可エラー | axiosClient Interceptor が検知・Sentry 送信 | hooks で 401 redirect / 403 toast.error() |

**Sentry 送信はすべて基盤が自動で行うため、hooks で `Sentry.captureException()` を呼ぶ必要はない。**

---

## Phase 7 完了後

全タスクが完了したら **`Skill('implement-phase7-test')`** を起動してバリデーション・エラーハンドリング実装を検証する。

このスキルは以下を行う：
1. 設計書の全バリデーションルールが Zodスキーマに実装されているか
2. 全APIエラーケースがハンドラーで対応されているか
3. `shared/utils/bff-error.ts` が存在し `BffApiError` が実装されているか
4. hooks に `console.log` / `console.error` が残っていないか
5. hooks の catch が `toast.error` または `throw` で処理されているか（**Sentry.captureException() が存在しないことも確認**）
6. 機能のルートグループに `error.tsx` が存在するか
7. Server Actions 内で `redirect` が try-catch 外にあるか
8. TypeScript コンパイルエラーが 0 件か

チェック通過（PASS）になってから Phase 8 へ進む。
