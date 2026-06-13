---
name: app-figma-make-ui
description: Figma Make 生成コードをプロジェクトへ組み込む際のスタイル・DOM・i18n・アクセシビリティルール。TRIGGER when: UI 実装計画の立案（app-impl-planner サブエージェント呼び出し前を含む）、Figma Make コードの移植、新規機能追加、新規コンポーネント作成、新規画面追加、既存コンポーネントのスタイル変更。DO NOT TRIGGER when: BFF/API 実装のみ、テスト実行、非 UI リファクタリング、コードレビューのみ。
---

# Figma Make UI コードの扱いルール

このプロジェクトの UI コードは Figma Make で生成されたものです。
以下のルールを**必ず遵守**してください。

## スタイルの定義方法

- スタイルは `src/_shared/styles/globals.css` の `@layer components` にセマンティックなクラスとして定義し、`className` からはそのクラス名で参照すること
- インライン Tailwind の羅列（`className="flex items-center gap-2 ..."` のような直接記述）は禁止
- 既存のスタイルを変更する場合も globals.css 側のクラス定義を修正すること（視覚的な結果は維持）

## 禁止事項（UI 構造の変更）

- HTML/JSX の DOM 構造・要素の並び順を変更すること
- レイアウト構造（flex/grid/padding/margin 等）を変更すること
- コンポーネントの props インターフェースを変更すること（追加は可）

## 許可事項（Next.js 移行に必要な変更のみ）

- ファイルの移動（ディレクトリ配置の変更）
- `"use client"` ディレクティブの追加（hooks/イベントハンドラーを持つ Client Component）
- import パスの修正（移動に伴う相対パス・エイリアスの更新）
- hooks / service 層の追加
- API 呼び出し処理・状態管理の追加

## `'use client'` 付与ルール

**付与すべきケース（いずれか1つでも該当すれば必須）:**
- `useState` / `useEffect` / `useRef` 等の React hooks を使用する
- `onClick` / `onChange` 等のイベントハンドラーを持つ
- ブラウザ API（`localStorage` / `sessionStorage` 等）を使用する
- イベントハンドラーを props として受け取る（organisms 等）
- カスタム hooks ファイル（`use*.ts`）

**付与してはいけないケース:**
- 型定義ファイル（`.type.ts` / `.types.ts`）
- 定数ファイル（`.constants.ts`）
- 純粋な Server Component（fetch のみ・インタラクションなし）

## `.map()` の `key` ルール

- `key={index}` は**禁止**
- 一意な ID フィールドがある場合は `key={item.id}` を使う
- ID がない場合は一意性が保証できる文字列フィールドを使う（例: `key={item.name}`）
- 複合キーが必要な場合はテンプレートリテラルで作る（例: `` key={`${section}-${idx}`} ``）

## アクセシビリティチェックリスト

### クリッカブルな非ボタン要素

`<div>` / `<img>` / `<tr>` 等にクリックイベントを付ける場合:

```tsx
// NG
<div onClick={handleClick}>...</div>

// OK
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
>...</div>
```

※ `<tr role="button">` はテーブルのセマンティクスを壊すため禁止。`tabIndex` + `onKeyDown` のみで対応する。

### ダイアログ

shadcn/ui の `<Dialog>` を使う場合は自動付与されるため追加不要。
ネイティブ実装の場合は以下を付与:

```tsx
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">...</h2>
```

### ローディング・エラー・通知表示

```tsx
// ローディング
<div role="status" aria-live="polite">読み込み中...</div>

// エラー
<div role="alert">エラーが発生しました</div>

// 読み取り専用通知・動的バッジ
<p role="status" aria-live="polite">読み取り専用です</p>
```

## テキスト・ラベルの i18n 対応

Figma Make が生成したコンポーネント内のベタ書きテキストは、**コンポーネントに直接書かず i18n ファイルに追記して参照すること**。

### i18n ファイルの配置

```
src/_shared/i18n/ja.ts   ← 唯一の翻訳ファイル
```

**ファイル構造（キー命名規則）:**

```ts
export const ja = {
  [LV1機能名]: {
    [LV3機能名]: {
      [コンポーネント名camelCase]: {
        [要素名]: "ラベル文字列",
        [動的な要素名]: (arg: 型) => `テンプレート文字列 ${arg}`,
      },
    },
  },
} as const;
```

### フロー（実装手順）

```
① コンポーネント内のベタ書きテキストを特定する
  → ② src/_shared/i18n/ja.ts の該当機能キー配下に追記する
  → ③ コンポーネント内で ja オブジェクトを import し、キーで参照する
  → ④ ベタ書きテキストを参照に差し替える
```

## 判断基準

「この変更は UI の見た目に影響するか？」に YES の場合：
1. **影響範囲を明示する**（どのコンポーネント・どのスタイルが変わるか）
2. **変更しないことによる問題を明示する**
3. **ユーザーに判断を仰ぐ**（変更すべきか・代替案があるかを確認してから実施する）
