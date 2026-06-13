# ESLint 設定設計

## 配置表

```
front_bff_shared/
  └── eslint/
      └── base.config.mjs   # 共通 ESLint 設定（フロントエンド + BFF）

frontend/
  └── eslint.config.mjs     # フロントエンド用 ESLint 設定（共通 + 固有）

bff/
  └── eslint.config.mjs     # BFF 用 ESLint 設定（共通 + 固有）
```

> **変更禁止**: アプリ実装チームは ESLint 設定ファイルを直接修正しない。[開発環境規約.md §1](開発環境規約.md) 参照。

---

## 1. 設定ファイルの管理体制

- 共通ルールは `front_bff_shared/eslint/base.config.mjs` で一元管理
- 各プロジェクト（frontend / bff）は共通設定をインポートし、固有設定を追加する
- 変更が必要な場合は基盤チームに相談すること

---

## 2. 共通設定（`front_bff_shared/eslint/base.config.mjs`）

### 実装

```javascript
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin,
    },
    rules: {
      'import/no-cycle': 'error',
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
        ],
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
```

### 使用プラグイン

| 分類 | 名称 | 役割 |
|---|---|---|
| 基本ルールセット | `@eslint/js` | JavaScript 推奨ルール |
| TypeScript | `@typescript-eslint/eslint-plugin` | TypeScript 専用ルール |
| 拡張プラグイン | `eslint-plugin-import` | 依存関係・インポート順序の検出 |

### 共通適用ルール

| ルール名 | 役割 | 具体的な運用例 |
|---|---|---|
| `import/no-cycle` | 循環参照の禁止 | A と B のファイルが互いに呼び出し合う循環状態をビルドエラーにする |
| `import/order` | インポート順序の固定 | `ライブラリ` → `src/shared/` → `機能内 repository/api/` の順に統一 |
| `@typescript-eslint/no-unused-vars` | 未使用変数の禁止 | 定義しただけで使用されていない変数・インポートをエラーとする（`_` 始まりは除外） |
| `@typescript-eslint/no-explicit-any` | `any` 型の禁止 | 型定義の放棄を禁止し、型安全性を強制する |

---

## 3. 各プロジェクトでのインポート方法

```javascript
// frontend/eslint.config.mjs
import sharedConfig from '@/front_bff_shared/eslint/base.config.mjs';

export default [
  ...sharedConfig,
  // フロントエンド固有の設定を追加
];
```

```javascript
// bff/eslint.config.mjs
import sharedConfig from '@/front_bff_shared/eslint/base.config.mjs';

export default [
  ...sharedConfig,
  // BFF 固有の設定を追加
];
```

---

## 4. フロントエンド特有の設定

### 使用プラグイン

| 分類 | 名称 | 役割 |
|---|---|---|
| 標準ルールセット | `eslint-config-next` | Next.js / React のベストプラクティスを強制 |
| React Hooks | `eslint-plugin-react-hooks` | React Hooks の正しい使用方法を強制 |
| アクセシビリティ | `eslint-plugin-jsx-a11y` | アクセシビリティ対応を支援 |

### フロントエンド特有ルール

| ルール名 | 役割 | 具体的な運用例 |
|---|---|---|
| `no-restricted-imports` | 特定パスのインポート禁止 | `features/` から `app/` への逆参照を禁止。他機能の `api/` や `repository/` を `index.ts` を介さず直接参照することをエラーにする |
| `react-hooks/rules-of-hooks` | Hooks の正しい使用 | React Hooks をコンポーネント内でのみ使用することを強制 |
| `react-hooks/exhaustive-deps` | 依存配列チェック | `useEffect` の依存配列漏れを検知 |
| `jsx-a11y/alt-text` | alt 属性の必須化 | 画像に `alt` 属性を必須化 |
| `jsx-a11y/aria-props` | ARIA 属性の正しい使用 | ARIA 属性の正しい使用を強制 |

### 機能間参照の自動検出

`no-restricted-imports` ルールにより、機能間の直接参照をビルドエラー化する。

```javascript
// eslint.config.mjs（設定例）
{
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/features/*/**'],
            message: '機能間の直接参照は禁止です。複数機能で使用するコンポーネントは shared/ に配置してください。'
          }
        ]
      }
    ]
  }
}
```

エラー表示例:
```
error: 機能間の直接参照は禁止です。複数機能で使用するコンポーネントは shared/ に配置してください。
  import { Button } from '@/features/patient/components/Button'
                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

> 根拠: [ADR-2](adr/eslint-dependency-rules.md)

---

## 5. BFF 特有の設定

### BFF 特有ルール

| ルール名 | 役割 | 具体的な運用例 |
|---|---|---|
| `no-console` | console.log の警告 | `console.log` を警告（本番では Logger 等を使用）。`console.warn` / `console.error` は許可 |
| `@typescript-eslint/no-floating-promises` | 非同期処理の適切な使用 | Promise を適切に `await` または `catch` する |
| `@typescript-eslint/explicit-function-return-type` | 戻り値の型定義 | 関数の戻り値の型を明示的に定義することを推奨（warn） |

---

## 6. ESLint 実行方法

### 手動実行

```bash
# リントチェック
npm run lint

# 自動修正可能なエラーを修正
npm run lint:fix
```

### package.json への設定

```json
// frontend
{
  "scripts": {
    "lint":     "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix"
  }
}

// bff（.tsx を除外）
{
  "scripts": {
    "lint":     "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix"
  }
}
```

### 保存時の自動実行（VSCode）

VSCode 拡張機能「ESLint」をインストールすることで、ファイル保存時に自動でリントチェックと修正が実行される。
DevContainer 環境では拡張機能が自動的にインストール・有効化される。

`.vscode/settings.json` は `frontend/.vscode/` および `bff/.vscode/` に配置し、リポジトリにコミットして全開発者で共有する（基盤チームが整備・保守。アプリ実装チームによる直接変更は不可）。

`.vscode/settings.json`:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### CI/CD での実行【TODO】

プルリクエスト時の自動チェックとエラー時のマージ禁止については、CI/CD パイプラインの整備後に追記予定。

> ※ 詳細なカスタムルール、エラーレベル（error/warn）の調整方針は今後の検証を経て確定次第追記予定。
