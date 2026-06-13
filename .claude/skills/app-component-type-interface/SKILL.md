---
name: app-component-type-interface
description: Feature コンポーネント新規実装・既存コンポーネントの ref/callback を利用する実装時に必ず適用すること。TRIGGER when: Feature コンポーネント実装・実装計画立案時（app-impl-planner サブエージェント呼び出し前）・型定義の新規作成。DO NOT TRIGGER when: BFF/API 実装のみ、スタイル変更のみ、コードレビューのみ。
---

# 既存コンポーネントとの型インターフェース確認ルール

Feature コンポーネントを新規実装する際、既存の atoms/molecules の型定義を**実装前に必ず Read で確認**してから使用すること。
確認せずに実装すると存在しないメソッドの呼び出し・引数数ミス・型不一致による tsc エラーが発生する（実績あり：BFF-REC001 で3件発生）。

---

## チェックリスト

### 1. ref 型のメソッド一覧確認

`useRef<SomeRef>` を使うコンポーネントを実装する前に、対象の `SomeRef` 型が定義されているファイルを Read し、公開メソッド・引数・戻り値をすべて確認すること。

```typescript
// NG: 型定義を確認せずにメソッドを呼び出す
richTextEditorRef.current?.setContent(value); // setContent は存在しない

// OK: 確認済みの public メソッドのみ呼び出す
richTextEditorRef.current?.applyFormat(format); // applyFormat(format: string): void を確認済み
```

**確認コマンド例:**
```
Read: src/features/.../components/molecules/SomeEditor.tsx
→ useImperativeHandle の return オブジェクトのメソッド名・引数を確認
```

### 2. callback 型の一致確認

親コンポーネントの prop 型と、子コンポーネントが要求する callback 型が一致しているか確認すること。

```typescript
// NG: 型が異なる callback を直接渡す
<RichTextEditor onActiveFormatsChange={onActiveFormatsChange} />
// RichTextEditor → (formats: Set<string>) => void
// 親の prop  → (formats: ActiveFormats) => void  ← 不一致

// OK: アダプターで変換してから渡す
<RichTextEditor
  onActiveFormatsChange={(formats: Set<string>) => {
    onActiveFormatsChange({
      isBold: formats.has("bold"),
      isUnderline: formats.has("underline"),
      isStrikethrough: formats.has("strikethrough"),
      color: formats.has("red") ? "red" : formats.has("yellow") ? "yellow" : "",
    });
  }}
/>
```

### 3. 引数の数・型の確認

インターフェースで定義されているメソッドの引数数を必ず確認すること。

```typescript
// NG: インターフェースの定義を確認せずに実装した関数シグネチャ
const handleFormatApply = (format: string, value?: string) => {
  ref.current?.applyFormat(format, value); // applyFormat は1引数
};

// OK: インターフェース定義（applyFormat: (format: string) => void）に合わせる
const handleFormatApply = (format: string) => {
  ref.current?.applyFormat(format);
};
```

### 4. `as` 型キャストの禁止

`as` キャストで TypeScript のエラーを隠蔽することは禁止。根本の型定義を修正して解消すること。

```typescript
// NG: キャストで型エラーを隠す
const data = value as unknown as TargetType;

// OK: 型定義自体を修正する
```

型エラーが解消できない場合は `// TODO: 型定義の修正が必要` コメントを付けた上でユーザーに判断を仰ぐ。
`as unknown as` の二重キャストは型安全性を完全にバイパスするため特に禁止。

---

## 実装前の確認手順

```
Feature コンポーネント実装着手前
  → ① 利用する organisms / molecules の型定義ファイルを Read
  → ② useImperativeHandle で公開されているメソッド一覧を確認（ref の場合）
  → ③ callback props の型（引数型・引数数）を確認
  → ④ 型エラーを as キャストで誤魔化していないか確認
  → ⑤ 確認内容をもとに Feature コンポーネントを実装
```

---

## 参照

- `.claude/review-missing-perspectives.md` — カテゴリ 1（発生した問題の詳細）
