---
name: app-turbopack-migration
description: Next.js の webpack から Turbopack への移行を自動化。特に front_bff_shared のシンボリックリンク互換性問題を解決する。Turbopack へ移行する Next.js プロジェクトで使用する。特にフロントエンドと BFF 層間でシンボリックリンクされた共有パッケージを使用しているプロジェクトに適用する。Turbopack 有効化後にシンボリックリンクされた依存関係に関する「モジュールが見つかりません」エラーが発生した場合、または Turbopack の互換性のためにシンボリックリンクベースのモノレポ構造をパッケージベースの解決に変換する必要がある場合に使用する。
allowed-tools: Read, Write, Edit, Bash
---

# Turbopack 移行 — シンボリックリンク解決修正

このスキルは、シンボリックリンクされた共有パッケージ（例: `front_bff_shared` が `frontend/src/` にシンボリックリンクされている）を使用する Next.js プロジェクトの webpack から Turbopack への移行を自動化する。Turbopack はシンボリックリンク解決のサポートが限定的であるため、このスキルはシンボリックリンク構造をパッケージベースのアプローチに変換する。

## このスキルを使用する場合

以下の場合に使用する:
- Next.js プロジェクトを `next dev` から `next dev --turbo` へ移行する
- プロジェクトにシンボリックリンクされた共有パッケージがある（例: `frontend/src/front_bff_shared` → `../../front_bff_shared`）
- Turbopack 有効化後に `モジュールが見つかりません` エラーが発生している
- `@/front_bff_shared/*` のようなインポートパスが Turbopack で動作しない

**このスキルを使用しない場合:**
- プロジェクトが共有依存関係にシンボリックリンクを使用していない
- プロジェクトが Next.js アプリケーションではない
- webpack 設定のみを更新する場合（標準の Next.js アップグレードガイドを使用）

## 移行概要

このスキルは **5 フェーズ** の移行を実行する:

1. **Phase 1**: 共有パッケージを npm パッケージに変換
2. **Phase 2**: すべてのインポートパスを置換
3. **Phase 3**: Next.js とフロントエンド設定を更新
4. **Phase 4**: シンボリックリンクを削除
5. **Phase 5**: i18n JSON ファイルを frontend に移動（デフォルト実行）

**ツール要件:**
- このスキルは **Serena MCP** を推奨するが、必須ではない
- Serena が利用できない場合、各フェーズで代替手段（`grep`, `sed`, `find`, `Read`, `Edit`）を使用
- Serena 利用時は大幅に効率化される（一括検索・置換が高速）

---

## Phase 1: 共有パッケージを npm パッケージに変換

**目標:** 共有パッケージディレクトリに `package.json` を作成する。

### ステップ 1-1: パッケージ名を尋ねる

ユーザーに質問:
「どのスコープ付きパッケージ名を使用すべきですか？（例: `@harz/front-bff-shared`）」

### ステップ 1-2: `package.json` を生成

`product/front_bff_shared/package.json` を以下の内容で作成:

```json
{
  "name": "@harz/front-bff-shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./index.ts",
  "types": "./index.ts",
  "peerDependencies": {
    "zod": "^3.23.8"
  }
}
```

**共有パッケージが実際に使用しているものに基づいて `peerDependencies` を調整する。** 一般的なもの:
- `zod` — Zod スキーマを使用している場合
- `react` — React コンポーネントをエクスポートする場合
- `next` — Next.js の型を使用している場合

**注意:** `exports` フィールドは省略する。これにより:
- ✅ 新しいファイル追加時に `package.json` の更新が不要
- ✅ すべてのパスが自動的にアクセス可能
- ✅ 保守性が向上

---

## Phase 2: インポートパスを置換

**目標:** すべての `@/front_bff_shared/*` インポートを `@harz/front-bff-shared/*` に置換する。

### ステップ 2-1: 古いインポートパスを検索

**Serena が利用可能な場合:**

Serena の `search_for_pattern` を使用:

```typescript
search_for_pattern({
  substring_pattern: "from ['\"]@/front_bff_shared/",
  relative_path: "product/frontend/src"
})
```

**Serena が利用できない場合:**

Bash の `grep` を使用:

```bash
grep -r "from ['\"]@/front_bff_shared/" product/frontend/src/ --include="*.ts" --include="*.tsx"
```

または `Grep` ツールを使用:

```typescript
Grep({
  path: "product/frontend/src",
  regex: "from ['\"]@/front_bff_shared/"
})
```

**期待される結果:** `@/front_bff_shared/` インポートを含むファイルのリスト。

### ステップ 2-2: インポートを置換

**Serena が利用可能な場合:**

一致した各ファイルに対して、Serena の `replace_content` を使用:

```typescript
replace_content({
  relative_path: "product/frontend/src/app/karte/_api/karte.api.ts",
  old_content: "from '@/front_bff_shared/features/karte",
  new_content: "from '@harz/front-bff-shared/features/karte"
})
```

**重要:** ファイルに1つの一致のみが含まれていることを確認していない限り、`replace_all: true` を使用しない。ターゲットを絞った置換を優先する。

**Serena が利用できない場合:**

`sed` または `Edit` ツールを使用:

```bash
# 一括置換（慎重に実行）
find product/frontend/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s|from '\(@/front_bff_shared/\)|from '@harz/front-bff-shared/\1|g" {} +
find product/frontend/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|from "\(@/front_bff_shared/\)|from "@harz/front-bff-shared/\1|g' {} +
```

または、`Read` + `Edit` で1ファイルずつ:

1. `Read` でファイルを読み込む
2. `Edit` で `old_string` / `new_string` を指定して置換
3. 次のファイルへ繰り返し

**パターン:** `@/front_bff_shared/` を `@harz/front-bff-shared/`（Phase 1 のスコープ付きパッケージ名）に置換する。

### ステップ 2-3: カウントを検証

置換後、ユーザーに通知:
「X 個のファイルでインポートを置換しました。検証検索を実行しています...」

**Serena が利用可能な場合:**

検索を再度実行して一致が残っていないことを確認:

```typescript
search_for_pattern({
  substring_pattern: "from ['\"]@/front_bff_shared/",
  relative_path: "product/frontend/src"
})
```

**Serena が利用できない場合:**

`grep` で検証:

```bash
grep -r "from ['\"]@/front_bff_shared/" product/frontend/src/ --include="*.ts" --include="*.tsx" || echo "置換完了: 一致なし"
```

一致が残っている場合は、ステップ 2-2 を繰り返す。

---

## Phase 3: Next.js とフロントエンド設定を更新

**目標:** Turbopack エイリアス設定を追加し、フロントエンドの依存関係を更新する。

### ステップ 3-1: `next.config.ts` を更新

既存の設定を読む:

```typescript
read_file({
  file_path: "product/frontend/next.config.ts"
})
```

`experimental` フィールドに以下を追加:

```typescript
experimental: {
  externalDir: true,
  turbo: {
    resolveAlias: {
      '@harz/front-bff-shared': '../front_bff_shared',
    },
  },
},
```

**既存の webpack 設定を保持する** — 削除しない。これにより、まだ webpack を使用している可能性のある CI システムとの下位互換性を確保する。

**`experimental` が存在しない場合**、作成する。**`turbo` が存在しない場合**、作成する。

### ステップ 3-2: `frontend/package.json` を更新

既存の `package.json` を読む:

```typescript
read_file({
  file_path: "product/frontend/package.json"
})
```

`dependencies` に追加:

```json
"@harz/front-bff-shared": "file:../front_bff_shared"
```

`scripts.dev` を更新（まだ `--turbo` を使用していない場合）:

```json
"dev": "next dev --turbo",
"build": "next build",
```

---

## Phase 4: シンボリックリンクを削除

**目標:** `frontend/src/` のシンボリックリンクを削除する。

### ステップ 4-1: シンボリックリンクのパスを確認

ユーザーに質問:
「シンボリックリンクはどこにありますか？（例: `product/frontend/src/front_bff_shared`）」

### ステップ 4-2: シンボリックリンクを削除

Bash を使用して削除:

```bash
rm product/frontend/src/front_bff_shared
```

**削除を検証:**

```bash
ls -la product/frontend/src/ | grep front_bff_shared
```

grep が何も返さない場合、シンボリックリンクは削除されている。

---

## Phase 5: i18n JSON ファイルを frontend に移動

**目標:** Turbopack の JSON import 問題を回避するため、i18n JSON ファイルを frontend プロジェクトに移動する。

**理論的根拠:** Turbopack 環境では `@harz/front-bff-shared/i18n/*.json` のような外部パッケージからの JSON import が失敗することが多い。事前に JSON ファイルを frontend 内に移動することで、この問題を回避する。

### ステップ 5-1: i18n ディレクトリの存在確認

まず、i18n ディレクトリが存在するか確認:

```bash
ls -la product/front_bff_shared/ | grep i18n
```

**i18n ディレクトリが存在しない場合:**
- このフェーズをスキップして Phase 6（検証）へ進む

**i18n ディレクトリが存在する場合:**
- 以下のステップを実行

### ステップ 5-2: json ディレクトリを作成

**重要:** `frontend/src/shared/i18n/` には `json` ディレクトリが存在しないため、先に作成する必要がある。

```bash
mkdir -p product/frontend/src/shared/i18n/json
```

features サブディレクトリも作成:

```bash
mkdir -p product/frontend/src/shared/i18n/json/features
```

### ステップ 5-3: JSON ファイルをコピー

**Serena が利用可能な場合:**

Serena の `list_dir` を使用してすべての JSON ファイルを見つける:

```typescript
list_dir({
  relative_path: "product/front_bff_shared/i18n",
  recursive: true
})
```

**Serena が利用できない場合:**

`find` を使用:

```bash
find product/front_bff_shared/i18n -name "*.json" -type f
```

各 JSON ファイルをコピー:

```bash
# ディレクトリ構造を保持してコピー
cp -r product/front_bff_shared/i18n/* product/frontend/src/shared/i18n/json/
```

または個別にコピー:

```bash
cp product/front_bff_shared/i18n/common.json \
   product/frontend/src/shared/i18n/json/common.json

cp product/front_bff_shared/i18n/features/auth.json \
   product/frontend/src/shared/i18n/json/features/auth.json

# ... すべての JSON ファイルに対して繰り返す
```

### ステップ 5-4: i18n インポートパスを置換

**Serena が利用可能な場合:**

i18n インポートを検索:

```typescript
search_for_pattern({
  substring_pattern: "from ['\"]@harz/front-bff-shared/i18n/",
  relative_path: "product/frontend/src"
})
```

ローカルパスに置換:

```typescript
replace_content({
  old_content: "from '@harz/front-bff-shared/i18n/common.json'",
  new_content: "from '@/shared/i18n/json/common.json'"
})
```

**Serena が利用できない場合:**

`grep` で検索:

```bash
grep -r "from ['\"]@harz/front-bff-shared/i18n/" product/frontend/src/ --include="*.ts" --include="*.tsx"
```

`sed` または `Edit` で置換:

```bash
find product/frontend/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s|@harz/front-bff-shared/i18n/|@/shared/i18n/json/|g" {} +
```

### ステップ 5-5: 依存関係をインストール

移行作業完了後、依存関係を再インストール:

```bash
cd product/frontend && pnpm install
```

**期待される出力:** エラーなし。`file:../front_bff_shared` 依存関係は正しく解決される。

### ステップ 5-6: frontend/src/shared/i18n/ の TypeScript ファイル import パス修正

**目的:** `frontend/src/shared/i18n/` 配下の TypeScript ファイル（`ja.ts`, `request.ts` など）が、JSON ファイルを `@harz/front-bff-shared/i18n/*.json` または絶対パス `@/shared/i18n/json/*.json` から import している場合、**相対パス `./json/...` 形式**に統一する。

**対象ファイル:**
- `product/frontend/src/shared/i18n/ja.ts`
- `product/frontend/src/shared/i18n/request.ts`

**修正内容:**

Phase 5-3 で JSON ファイルを `product/frontend/src/shared/i18n/json/` へコピーしたため、同じディレクトリにある TypeScript ファイルの import パスも更新する必要がある。

**重要:** 正しい形式は**相対パス `./json/...`** である。絶対パス `@/shared/i18n/json/...` や外部パッケージパス `@harz/front-bff-shared/i18n/...` は使用しない。

**置換パターン:**

```diff
- import commonJson from '@harz/front-bff-shared/i18n/ja.json'
+ import commonJson from './json/ja.json'

- import authJson from '@harz/front-bff-shared/i18n/features/auth.json'
+ import authJson from './json/features/auth.json'

- import commonJson from '@/shared/i18n/json/ja.json'
+ import commonJson from './json/ja.json'

- import(`../../../front_bff_shared/i18n/ja.json`)
+ import(`./json/ja.json`)
```

**実行手順:**

**Serena が利用可能な場合:**

```typescript
// ja.ts を検索
search_for_pattern({
  substring_pattern: "from '@harz/front-bff-shared/i18n/",
  relative_path: "product/frontend/src/shared/i18n/ja.ts"
})

// 置換実行
replace_content({
  relative_path: "product/frontend/src/shared/i18n/ja.ts",
  old_content: "from '@harz/front-bff-shared/i18n/common.json'",
  new_content: "from './json/common.json'"
})
```

**Serena が利用できない場合:**

```bash
# grep で確認
grep "@harz/front-bff-shared/i18n/" product/frontend/src/shared/i18n/*.ts

# sed で一括置換（シンプルなパターン）
sed -i "s|@harz/front-bff-shared/i18n/|./json/|g" product/frontend/src/shared/i18n/*.ts
```

または `Edit` ツールで個別に置換:

1. `Read` でファイルを読み込む
2. `Edit` で `old_string` / `new_string` を指定して置換
3. 次のファイルへ繰り返し

**検証:**

```bash
# @harz/front-bff-shared/i18n/ への参照が残っていないことを確認
grep -r "@harz/front-bff-shared/i18n/" product/frontend/src/shared/i18n/
```

何も出力されなければ修正完了。

### ステップ 5-7: front_bff_shared から i18n を削除（オプション）

**注意:** この手順は、BFF 側で i18n JSON を参照していない場合のみ実行してください。

```bash
rm -rf product/front_bff_shared/i18n
```

---

## 移行完了

すべてのフェーズが完了しました。以下を確認してください:

**次のステップ:**
1. `pnpm dev` で開発サーバーを起動
2. エラーがないか確認
3. TypeScript の型が正しく解決されているか確認（必要に応じて `tsc --noEmit`）
4. i18n JSON ファイルが正しく読み込まれているか確認
5. 既存の機能が正常に動作するかテスト

---

## 変更内容のサマリー

このスキルを実行すると、以下の変更が行われます:

### 追加されるファイル
- `product/front_bff_shared/package.json` — npm パッケージ定義
- `product/frontend/src/shared/i18n/json/**/*.json` — i18n JSON ファイル（front_bff_shared から移動）

### 変更されるファイル
- `product/frontend/next.config.ts` — Turbopack alias 設定追加
- `product/frontend/package.json` — dependencies に `@harz/front-bff-shared` 追加、`scripts.dev` を `--turbo` に変更
- `product/frontend/src/**/*.ts(x)` — すべてのインポートパス置換

### 削除されるファイル/ディレクトリ
- `product/frontend/src/front_bff_shared` — シンボリックリンク削除
- `product/front_bff_shared/i18n/` — （オプション）frontend に移動後に削除可能

---

## トラブルシューティング

### エラー: `Cannot find module '@harz/front-bff-shared'`

**原因:** `pnpm install` がローカルパッケージをリンクしなかった。

**修正:**
```bash
cd product/frontend && pnpm install --force
```

### エラー: `Module not found: Can't resolve '@harz/front-bff-shared/features/...'`

**原因:** Turbopack が外部パッケージの解決に失敗している。

**修正1:** `next.config.ts` の `resolveAlias` が正しく設定されているか確認:
```typescript
turbo: {
  resolveAlias: {
    '@harz/front-bff-shared': '../front_bff_shared',
  },
}
```

**修正2:** `pnpm install --force` を実行してパッケージリンクを再作成する。

### エラー: i18n JSON が読み込めない

**原因:** Phase 5 で JSON ファイルの移動またはインポートパス置換が不完全。

**修正:**
1. `product/frontend/src/shared/i18n/json/` に JSON ファイルが存在するか確認:
   ```bash
   ls -R product/frontend/src/shared/i18n/json/
   ```
2. インポートパスが `@/shared/i18n/json/*` になっているか確認:
   ```bash
   grep -r "@harz/front-bff-shared/i18n/" product/frontend/src/
   ```
   何も出力されなければ置換完了。出力がある場合はステップ 5-4 を再実行。

### エラー: `ReferenceError: window is not defined`（移行後）

**原因:** クライアント専用ライブラリがサーバーコンポーネントでインポートされている。

**修正:** これは Turbopack 移行とは無関係。サーバー非互換パッケージの処理方法については、`product/.agents/skills/next-best-practices/bundling.md`（5-41行目）を参照。

---

## 参考資料

一般的な Turbopack 移行ガイダンス（シンボリックリンク固有ではない）については、以下を参照:
- `product/.agents/skills/next-best-practices/bundling.md`（162-181行目）
- Next.js 公式ドキュメント: https://nextjs.org/docs/app/building-your-application/upgrading/from-webpack-to-turbopack

このスキルは、これらの参考資料ではカバーされていないシンボリックリンク解決問題と i18n JSON import 問題に特化している。
