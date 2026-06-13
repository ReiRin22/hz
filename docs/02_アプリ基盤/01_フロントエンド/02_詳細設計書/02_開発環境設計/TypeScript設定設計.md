# TypeScript 設定設計

## 配置表

| ファイルパス | 役割 |
|---|---|
| `frontend/tsconfig.json` | フロントエンド TypeScript 設定 |
| `bff/tsconfig.json` | BFF TypeScript 設定 |

> **変更禁止**: アプリ実装チームは `tsconfig.json` を直接修正しない。[開発環境規約.md §1](開発環境規約.md) 参照。

---

## 1. パスエイリアス設定

### インターフェース仕様

```json
{
  "compilerOptions": {
    "paths": {
      "@/shared/*": ["./src/shared/*"],
      "@/features/*": ["./src/features/*"],
      "@/app/*": ["./src/app/*"],
      "@/front_bff_shared/*": ["../front_bff_shared/*"]
    }
  }
}
```

**エイリアス一覧**:

| エイリアス | 解決先 | 用途 |
|---|---|---|
| `@/shared/*` | `./src/shared/*` | 共通コンポーネント・ユーティリティ |
| `@/features/*` | `./src/features/*` | 機能単位モジュール |
| `@/app/*` | `./src/app/*` | アプリケーション固有モジュール |
| `@/front_bff_shared/*` | `../front_bff_shared/*` | モノレポ共有型定義 |

---

## 2. strict mode 設定

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**適用されるチェック**:

| オプション | 効果 |
|---|---|
| `strict: true` | 型チェックを最大化するフラグ群を一括有効化 |
| `noImplicitAny` | 暗黙的 `any` を禁止（明示的な型定義を強制） |
| `strictNullChecks` | `null` / `undefined` を型として扱い、実行時エラーを事前検出 |

---

## 3. ESModules 設定

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

| オプション | 値 | 対応バージョン |
|---|---|---|
| `module` | `ESNext` | Next.js 16 / React 19 のモジュールシステムに対応 |
| `moduleResolution` | `bundler` | バンドラー（webpack/Vite 等）のモジュール解決アルゴリズムを使用 |

---

## 4. ソースマップ設定（デバッグ用）

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

| 設定 | 効果 |
|---|---|
| `sourceMap: true` | `.js.map` ファイルを生成し、TypeScript とのマッピング情報を提供 |

**ソースマップの役割**:
- トランスパイル後の JavaScript コードと元の TypeScript コードを紐付ける
- デバッガーが JavaScript の実行位置を TypeScript の行番号に変換する

`sourceMap` が無い場合、デバッグ時にトランスパイル後の JavaScript が表示され、ブレークポイントが元コードと一致しなくなる。

---

## 5. 起動・ビルドスクリプト

### フロントエンド（`frontend/package.json`）

```json
{
  "scripts": {
    "dev":       "next dev --webpack",
    "dev:debug": "NODE_OPTIONS='--inspect=0.0.0.0:9229' next dev --webpack",
    "build":     "next build --webpack",
    "start":     "next start",
    "lint":      "eslint"
  }
}
```

| スクリプト | 説明 |
|---|---|
| `dev` | 開発サーバーを起動（ホットリロード有効） |
| `dev:debug` | デバッグポート `9229` を公開して開発サーバーを起動 |
| `build` | 本番用ビルドを実行 |
| `start` | ビルド済みアプリケーションを本番モードで起動 |
| `lint` | ESLint によるコードチェックを実行 |

### BFF（`bff/package.json`）

```json
{
  "scripts": {
    "dev":       "tsx watch src/index.ts",
    "dev:debug": "NODE_OPTIONS='--inspect=0.0.0.0:9229' tsx watch src/index.ts",
    "build":     "tsc",
    "start":     "tsx src/index.ts"
  }
}
```

| スクリプト | 説明 |
|---|---|
| `dev` | 開発サーバーを起動（ファイル変更時に自動再起動） |
| `dev:debug` | デバッグポート `9229` を公開して開発サーバーを起動 |
| `build` | TypeScript を JavaScript にトランスパイル |
| `start` | ビルドなしで TypeScript を直接実行 |

> コンテナ起動方法は「開発テスト基盤方式設計書」を参照。

---

## 6. デバッグ開始手順（DevContainer 環境）

DevContainer 環境では `launch.json` を作成せずにデバッグを開始できる。

1. コンテナ内で `npm run dev:debug` を実行
2. VSCode のコマンドパレット（`Ctrl+Shift+P` / `Cmd+Shift+P`）を開く
3. `Debug: Attach to Node Process` を選択
4. `localhost:9229` を選択

**DevContainer 環境の特徴**:

| 項目 | 内容 |
|---|---|
| VSCode の動作場所 | コンテナ内 → `localhost:9229` に直接接続 |
| パスマッピング | `localRoot` / `remoteRoot` 不要 |
| ポート公開 | `docker-compose.yml` でのポート公開不要 |
