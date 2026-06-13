# front_bff_shared

フロントエンド（Next.js）と BFF（NestJS）で共通利用するコード・設定・リソースを配置するディレクトリ。

## ディレクトリ構造

```
front_bff_shared/
├── features/          # 機能別の共通型定義（API リクエスト/レスポンス型等）
├── utils/             # 共通ユーティリティ関数
│   └── phipatterns.ts   # PHI 検出パターン
├── eslint/            # ESLint 共通設定
│   └── base.config.mjs  # 基本設定
├── i18n/              # 国際化リソース
│   ├── features/
│   │   └── common.json  # 共通翻訳リソース
│   └── config.ts        # i18n 設定・ユーティリティ
└── README.md
```

## デプロイ方式

### 開発時（シンボリックリンク）

フロントエンド・BFF それぞれから `front_bff_shared/` をシンボリックリンクで参照する。

```bash
# フロントエンド側
cd product/frontend/src
ln -s ../../front_bff_shared front_bff_shared

# BFF 側
cd product/bff/src
ln -s ../../front_bff_shared front_bff_shared
```

### 本番デプロイ時（実体コピー）

各サーバーのビルド時に `front_bff_shared/` を実体としてコピーする。

```bash
# フロントエンドビルド時
cp -r product/front_bff_shared product/frontend/src/

# BFFビルド時
cp -r product/front_bff_shared product/bff/src/
```

## 使用例

### フロントエンドから

```typescript
import { PATIENT_ID_PATTERN, maskPhiFields } from 'front_bff_shared/utils/phipatterns';
import { formatDate, DEFAULT_LOCALE } from 'front_bff_shared/i18n/config';
```

### BFF から

```typescript
import { PATIENT_ID_PATTERN, isPhiField } from 'front_bff_shared/utils/phipatterns';
import { getValidLocale } from 'front_bff_shared/i18n/config';
```

## 注意事項

- このディレクトリに配置するコードは **環境依存のない純粋な TypeScript** であること
- React コンポーネント・NestJS デコレーター等のフレームワーク固有機能は配置しない
- Node.js 専用 API（`fs`, `path` 等）も配置しない（ブラウザで動作しなくなる）
