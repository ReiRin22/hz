# UIビジュアル規約

フロントエンド基盤が提供するデザインシステム・UIライブラリ・リスト仮想化・画像最適化の上で **アプリ実装チームが守るべき規約** を定義する。

| 関連文書 | 内容 |
|---|---|
| [デザインシステム基盤設計.md](デザインシステム基盤設計.md) | Tailwind CSS v4 / `globals.css` / `@theme` トークン |
| [UIライブラリ基盤設計.md](UIライブラリ基盤設計.md) | shadcn/ui / Radix UI 連携と配置 |
| [リスト仮想化基盤設計.md](リスト仮想化基盤設計.md) | react-virtuoso 利用パターン |
| [画像最適化基盤設計.md](画像最適化基盤設計.md) | next/image 利用と `next.config.ts` 管理 |

---

## 1. 適用範囲

本規約は **Molecules / Atoms 以下の層**（`shared/components/atoms/*`、`shared/components/molecules/*`、`features/*/components/*`）の実装に適用する。Pages・Organisms 層も UI 描画に関わる範囲は本規約に従う。

| 範囲 | 対象 |
|---|---|
| 適用 | スタイリング、UI コンポーネント呼び出し、リスト描画、画像表示 |
| 適用外 | API 通信、フォーム制御、状態管理（各章の規約に従う） |

---

## 2. 基盤 I/F 利用規約（最重要）

> 基盤が提供する I/F を **経由しない実装は禁止する**。バイパス実装はビジュアルリグレッション・LCP 劣化・SSRF・XSS リスクを引き起こす。

### 2.1 必ず経由する I/F とバイパス禁止 API

| 用途 | ✅ 経由必須 I/F | ⛔ バイパス禁止 | 詳細 |
|---|---|---|---|
| デザイントークン参照 | `@theme` 経由の Tailwind ユーティリティクラス（`bg-primary` 等）または CSS 変数（`var(--primary-color)`） | 色値・余白値の直書き（`#0066cc`、`16px` 等）、コンポーネント内 `<style>` タグ、`style={{...}}` インラインスタイル | [デザインシステム基盤設計.md](デザインシステム基盤設計.md) §2 |
| カスタムクラス定義 | `globals.css` 内に `@apply` で定義 | コンポーネントファイル内での独自 CSS（`<style>` ブロック等）、各機能配下の独自 `.css` ファイル | [デザインシステム基盤設計.md](デザインシステム基盤設計.md) §3 |
| UI コンポーネント | `@/shared/components/atoms/ui/{name}` から import | UI ライブラリの直接 npm 依存（`react-aria` 等の独自選定）、`<button>` 直書きでのスタイル再発明 | [UIライブラリ基盤設計.md](UIライブラリ基盤設計.md) §3, §4 |
| 大規模リスト描画（1000件以上） | `Virtuoso`（`react-virtuoso`） | `Array.map()` での全件 DOM 描画、独自仮想化実装 | [リスト仮想化基盤設計.md](リスト仮想化基盤設計.md) §2, §5 |
| 画像表示 | `next/image` の `Image` コンポーネント | `<img>` タグ、`background-image` での外部 URL 直接指定 | [画像最適化基盤設計.md](画像最適化基盤設計.md) §1 |
| 外部画像ドメイン | `next.config.ts` の `images.remotePatterns` に登録済みのドメイン | 未登録ドメインの URL 渡し、`http://` プロトコルの画像 | [画像最適化基盤設計.md](画像最適化基盤設計.md) §3 |

### 2.2 例外

| ケース | 条件 |
|---|---|
| プロトタイプ・検証コード | 本番投入前に基盤 I/F 経由へ移すこと |
| 基盤チームによる基盤実装 | 本規約の対象外（基盤 I/F の実装側） |
| 99件以下の小規模リスト | 仮想化不要。通常の `Array.map()` でよい |
| デバッグ時の一時的なインラインスタイル | コミット前に削除すること |

### 2.3 PR レビュー観点（grep ターゲット）

| 観点 | 検出ターゲット |
|---|---|
| `<img>` タグ混入 | `<img\s` を grep（`atoms/ui/` 配下を除く）|
| インラインスタイル混入 | `style=\{\{` を grep |
| 色値直書き | `#[0-9a-fA-F]{3,6}` をコンポーネントファイルで grep（`globals.css` 以外）|
| 独自 CSS ファイル | `features/**/*.css` の存在確認 |
| 仮想化漏れ | `.map\(` で大量データを描画している箇所がないか目視 |
| 未許可ドメイン | `next/image` の `src` に渡している外部 URL を `next.config.ts` と照合 |

ESLint で機械的に検出可能なものは、`@next/next/no-img-element`（`<img>` 検出）等のルールを有効化して PR ブロックする。

---

## 3. 各論ルール

### 3.1 スタイリング

#### Do

- Tailwind ユーティリティクラスを **直接** 記述する（最初の選択肢）
- 10個以上のクラス連結・3箇所以上の繰り返し・複数状態を持つ場合は、`globals.css` に `@apply` でカスタムクラス化する
- shadcn/ui コンポーネントをベースに利用する。必要に応じて `atoms/ui/` 配下のファイルを直接編集してカスタマイズ

> 詳細: [デザインシステム基盤設計.md](デザインシステム基盤設計.md) §3

#### Don't

- インラインスタイル（`style={{...}}`）を使用する（デバッグ時を除く）
- コンポーネントファイル内に `<style>` タグを記述する
- Tailwind と同等の機能を CSS 変数で再定義する（重複）
- グローバル CSS クラス名を無秩序に増やす（命名衝突）

### 3.2 UI コンポーネント利用

#### Do

- Dialog・Tooltip・Select 等の振る舞いが必要な要素は shadcn/ui 経由で利用する
- shadcn/ui に存在しないプリミティブは `@radix-ui/react-*` を直接利用する
- カスタマイズは `atoms/ui/` 配下のファイルを直接編集する（`cn()` 上書きの多用は避ける）

#### Don't

- `<button>`・`<input>` 等を生で多用してアクセシビリティを再発明する
- shadcn/ui 以外の UI ライブラリを独自にインストールする（基盤チーム承認必須）

### 3.3 大規模リスト

#### Do

- 1000件以上のデータは `Virtuoso` で必ず仮想化する
- 100〜999件でも、行内に画像・複雑な式があれば仮想化する
- 仮想化リストは `features/<LV1>/<LV2>/<LV3>/components/organisms/` 配下に配置する
- SSR 初期データは `initialItemCount` と組み合わせる

> 詳細: [リスト仮想化基盤設計.md](リスト仮想化基盤設計.md) §4, §5

#### Don't

- 1000件以上のデータを通常の `Array.map()` で全件描画する
- `Virtuoso` の `style.height` 指定を省略する（動かない）
- 仮想化リストを Atoms / Molecules 層に配置する

### 3.4 画像表示

#### Do

- すべての画像表示で `next/image` の `Image` コンポーネントを使う
- ファーストビュー内・リスト上位 10件程度に `priority` を付与する
- `fill` 利用時は親要素に `relative`（`position: relative`）を必ず指定する
- 画像読み込み失敗のフォールバック UI を用意する

> 詳細: [画像最適化基盤設計.md](画像最適化基盤設計.md) §4, §5, §6

#### Don't

- `<img>` タグで画像を表示する
- 外部ドメインの画像を `next.config.ts` 未登録のまま `next/image` に渡す
- リスト全要素に `priority={true}` を付与する（preload 対象が増えすぎ LCP が悪化）
- `priority` をモーダル内画像に付与する

---

## 4. 命名規則

### 4.1 CSS 変数

| 用途 | 命名パターン | 例 |
|---|---|---|
| 色 | `--{用途}-color` | `--primary-color`, `--danger-color` |
| 余白 | `--spacing-{サイズ}` | `--spacing-sm`, `--spacing-lg` |
| フォントサイズ | `--font-size-{サイズ}` | `--font-size-base`, `--font-size-lg` |
| 角丸 | `--radius-{サイズ}` | `--radius-sm`, `--radius-md` |
| 影 | `--shadow-{サイズ}` | `--shadow-sm`, `--shadow-lg` |

### 4.2 カスタム CSS クラス

| 対象 | 命名パターン | 例 |
|---|---|---|
| 機能固有クラス | `{機能名}-{要素名}` | `karte-button`, `patient-card` |
| 状態クラス | `is-{状態}` | `is-active`, `is-loading` |

### 4.3 コンポーネントファイル

| 対象 | 命名規則 | 例 |
|---|---|---|
| コンポーネント | PascalCase + `.tsx` | `VirtualizedKarteList.tsx`, `PatientAvatar.tsx` |
| shadcn/ui 由来 | lowercase + `.tsx` | `button.tsx`, `dialog.tsx`（CLI が生成する形式に従う） |

---

## 5. 責務サマリ

アプリチームが実装時に確認すべき1ページサマリ。

| やりたいこと | 経由する I/F | 設計書 |
|---|---|---|
| 色・余白・フォントを使う | Tailwind ユーティリティクラス（`bg-primary` 等） | [デザインシステム基盤設計.md](デザインシステム基盤設計.md) §2 |
| よく使うスタイル組合せを名前付け | `globals.css` の `@apply` カスタムクラス | [デザインシステム基盤設計.md](デザインシステム基盤設計.md) §3 |
| Button / Input / Dialog 等を出す | `@/shared/components/atoms/ui/{name}` | [UIライブラリ基盤設計.md](UIライブラリ基盤設計.md) §3 |
| Context Menu 等の特殊プリミティブを出す | `@radix-ui/react-*` 直接利用 | [UIライブラリ基盤設計.md](UIライブラリ基盤設計.md) §4.2 |
| 1000件以上のリストを表示する | `Virtuoso`（`react-virtuoso`） | [リスト仮想化基盤設計.md](リスト仮想化基盤設計.md) §4 |
| 画像を表示する | `next/image` の `Image` | [画像最適化基盤設計.md](画像最適化基盤設計.md) §4 |
| 外部ドメインの画像を表示する | `next.config.ts` 追加依頼 → `next/image` | [画像最適化基盤設計.md](画像最適化基盤設計.md) §3 |
