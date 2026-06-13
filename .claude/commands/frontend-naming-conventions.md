# Frontend Naming Conventions

## メタデータ

- **作成日**: 2026-04-14
- **最終更新**: 2026-04-27
- **ステータス**: approved
- **関連ドキュメント**:
  - `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/00.ディレクトリ構成.md`
  - `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/05.コンポーネント設計.md`
  - `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/03.TypeScript型管理とスキーマ共有.md`

---

## 概要

このドキュメントは、`product/frontend/src/` 配下のファイル・ディレクトリの命名規則を定義します。
`new/` 詳細設計書群と実際の `product/` コードベースを照合して策定しています。

---

## ディレクトリ構造の正規定義

### LV3機能フォルダ直下

```
features/<LV1>/<LV2>/<LV3>/
├── <SCREEN_ID>.tsx        # メインコンポーネント（例: REC001.tsx, RES002.tsx）
├── api/                   # この画面でのみ使用するBFF通信ロジック
├── assets/                # この画面固有の画像・静的ファイル
├── components/
│   ├── molecules/         # 特定目的を持つ最小限ロジックを含む部品
│   └── organisms/         # Pageからデータを受け取り複数Moleculeを束ねる
├── hooks/                 # この画面固有の対話ロジック
├── stores/                # この画面の一時的な状態管理（Zustand）
├── repository/            # この画面固有のデータ取得・永続化ロジック（React Query等のラッパー）
├── types/                 # この画面内でのみ使用するUI表示用の型（ViewModel等）
├── test/                  # この画面機能固有の単体テスト・コンポーネントテスト
├── style.css              # Tailwind @apply 等の画面固有スタイル
└── index.ts               # 機能公開窓口

禁止ディレクトリ:
  ❌ src/        （削除対象。直下にファイルを移動して統合する）
  ❌ guidelines/ （削除対象。必要なら docs/ 配下に移動）
  ❌ tmp/        （削除対象）
```

### 共有レイヤー（src/shared/）

```
shared/
├── api/          # 複数機能から参照される基盤API通信定義
├── assets/       # アプリ全体共通素材
├── components/
│   ├── atoms/    # shadcn/ui・Radix UIベースの最小単位（ロジックなし）
│   ├── molecules/ # 汎用部品（2機能以上で再利用時に昇格）
│   └── organisms/ # 複数Moleculeを組み合わせた複合コンポーネント
├── hooks/        # アプリ全体で共有する汎用ロジック
├── stores/       # グローバルステート（Zustand + persistミドルウェア）
├── types/        # アプリケーション全体共通のUI型定義
├── utils/        # ビジネスロジックを含まない汎用関数
└── plugins/      # ライブラリ設定ファイル（axiosClient.ts 等）
```

---

## ファイル命名規則

### 一覧表

| 対象 | 命名規則 | 拡張子 | 例 |
|------|---------|--------|----|
| 画面コンポーネント（ルート） | `{SCREEN_ID}` | `.tsx` | `REC001.tsx`, `RES002.tsx` |
| UIコンポーネント | `{PascalCase}` | `.tsx` | `PatientHeader.tsx`, `ConfirmDialog.tsx` |
| Storybookファイル | `{PascalCase}.stories` | `.tsx` | `ConfirmDialog.stories.tsx` |
| カスタムフック | `use{PascalCase}` | `.ts` | `usePatientData.ts`, `useSchemaCreationActions.ts` |
| API通信ロジック | `{機能名}.api.ts` | `.ts` | `schemaCreation.api.ts`, `patientSearch.api.ts` |
| リポジトリ | `{機能名}Repository` | `.ts` | `schemaCreationRepository.ts` |
| ストア（Zustand） | `{機能名}.store.ts` または `use{機能名}Store.ts` | `.ts` | `schemaCreation.store.ts` |
| 型定義（LV3内） | `{機能名}.types.ts` | `.ts` | `schemaCreation.types.ts`, `Patient.types.ts` |
| 型定義（front_bff_shared） | `{機能名}.types.ts` | `.ts` | `patientUpdate.types.ts` |
| Zodスキーマ（front_bff_shared） | `{機能名}.schema.ts` | `.ts` | `patientUpdate.schema.ts` |
| ユーティリティ関数 | `{機能名}` (camelCase) | `.ts` | `draftStorage.ts`, `predictionEngine.ts` |
| モックデータ | `mock{Resource}` または `mock-data` | `.ts` | `mockPatients.ts`, `mock-data.ts` |
| 定数 | `{内容を表す名詞}` | `.ts` | `medicalData.ts`, `apiEndpoints.ts` |
| テストファイル | `{対象ファイル名}.test` | `.tsx` | `PatientCard.test.tsx` |
| インデックス | `index` | `.ts` | `index.ts` |
| ディレクトリ名 | kebab-case + 番号プレフィックス | — | `01_diagnosis`, `02_result-input` |

### 詳細規則

#### API通信ロジック（`api/`）

```typescript
// ✅ 正しい
api/schemaCreation.api.ts       // 機能名 + .api.ts
api/patientSearch.api.ts

// ❌ 旧パターン（非推奨）
api/getSchema.ts                // 動詞プレフィックスは廃止
api/postFavorite.ts
api/patients-service.ts         // -service.ts サフィックスは廃止
```

新規ファイルは必ず `.api.ts` サフィックスを使用すること。
既存の動詞プレフィックスや `-service.ts` ファイルは大規模修正のタイミングで順次移行する。

#### カスタムフック（`hooks/`）

```typescript
// ✅ 正しい
usePatientData.ts
useSchemaCreationActions.ts
useGetTestResults.ts

// ❌ 旧パターン（非推奨）
use-patient.ts      // kebab-case は廃止
use-test-results.ts
```

新規ファイルは必ず `use{PascalCase}.ts` を使用すること。

#### 型定義（`types/`）

LV3機能フォルダ内の型定義は `.types.ts` サフィックスを使用する。

```typescript
// ✅ 正しい
schemaCreation.types.ts
Patient.types.ts

// ❌ 旧パターン（非推奨）
patient-types.ts    // ハイフン区切り + -types は廃止
types.ts            // 汎称ファイル名は廃止（ドメイン名を付ける）
schemaCreation.viewModel.ts  // .viewModel.ts は非標準
```

#### Zodスキーマ（`lib/schemas/` または `front_bff_shared/`）

```typescript
// ✅ 正しい（front_bff_shared 内）
patientUpdate.schema.ts

// ✅ 正しい（LV3内 lib/schemas/）
testResult.schema.ts

// ❌ 旧パターン（非推奨）
testResult.schema.ts に camelCase ファイル名が混在している場合
→ kebab-case に統一: test-result.schema.ts
```

#### ストア（`stores/`）

```typescript
// ✅ 正しい
schemaCreation.store.ts    // ファイル名は .store.ts サフィックス
testResultForm.store.ts

// エクスポート名は use{PascalCase}Store
export const useSchemaCreationStore = create(...)
export const useTestResultFormStore = create(...)
```

#### コンポーネント（`components/`）

- **メインコンポーネント**: `function` 宣言（named export）を使用。`default export` は使用しない
- **内部ロジック・イベントハンドラー**: アロー関数で定義
- **配置ルール**:
  - `atoms/` — ロジックを持たない最小単位。`src/shared/components/atoms/` のみ
  - `molecules/` — 初期配置は `LV3/components/molecules/`。2機能以上で再利用時に `shared/` へ昇格
  - `organisms/` — `LV3/components/organisms/`。機能固有ロジックを持つ
  - `templates/` — レイアウト定義（`src/shared/components/` または LV3直下）

```tsx
// ✅ 正しい
export function PatientHeader({ patient, onSelect }: PatientHeaderProps) {
  const handleClick = () => onSelect(patient.id);
  return <div onClick={handleClick}>{patient.name}</div>;
}

// ❌ 間違い
export default function PatientHeader(...) {}  // default export 禁止
export const PatientHeader = (...) => {};       // メインコンポーネントのアロー関数禁止
```

---

## front_bff_shared の命名規則

```
front_bff_shared/
└── features/
    └── <LV1>/
        └── <LV2>/
            └── <LV3>/
                ├── types/
                │   └── {機能名}.types.ts    # Request型・Response型を1ファイルで管理
                └── schemas/
                    └── {機能名}.schema.ts   # Zodスキーマ定義
```

変数・型の命名パターン（すべてローワーキャメルケース）:

| 対象 | パターン | 例 |
|------|---------|-----|
| スキーマ変数 | `{機能名}{操作}Schema` | `patientUpdateSchema` |
| Input型 | `{機能名}{操作}Input` | `PatientUpdateInput` |
| Response型 | `{機能名}{操作}Response` | `PatientUpdateResponse` |

---

## 移行計画

<!-- ### フェーズ1: `src/` サブディレクトリの削除（優先度: 高）

対象フォルダ（13件）の `src/` 配下を確認し、重複していれば削除、
固有コンテンツがあれば直下へ移動してから `src/` を削除する。

```
削除対象:
features/01/01/01/REC001/src/
features/01/01/02/REC002/src/
features/01/02/01/REC005/src/
features/01/02/02/REC006/src/
features/01/04/03/REC018/src/
features/01/05/01/REC019/src/
features/01/06/01/REC020/src/
features/05/01/01/ORD001/src/
features/17/01/01/ETC001-005/src/ -->
```

### フェーズ1: ファイル命名の統一（優先度: 中）

新規ファイルは即時適用。既存ファイルは大規模修正時に順次移行。

| 旧パターン | 新パターン | 対象数（概算） |
|-----------|-----------|------------|
| `*-types.ts` | `*.types.ts` | ~50ファイル |
| `use-*.ts`（kebab-case） | `use*.ts`（camelCase） | ~10ファイル |
| `*-service.ts` / `get*.ts` / `post*.ts` | `*.api.ts` | ~20ファイル |
| `*.viewModel.ts` | `*.types.ts` | ~数ファイル |

---

## 検証スクリプト

```bash
#!/bin/bash
# check-naming-conventions.sh

BASE="product/frontend/src/features"

echo "=== src/ サブディレクトリ ==="
find "$BASE" -type d -name "src" && echo "❌ 削除対象あり" || echo "✅ なし"

echo "=== 旧型定義命名 (*-types.ts) ==="
find "$BASE" -name "*-types.ts" | wc -l | xargs -I{} echo "{} 件"

echo "=== kebab-case フック (use-*.ts) ==="
find "$BASE" -name "use-*.ts" | wc -l | xargs -I{} echo "{} 件"

echo "=== 旧APIファイル (*-service.ts) ==="
find "$BASE" -path "*/api/*-service.ts" | wc -l | xargs -I{} echo "{} 件"
```

---

## 変更履歴

| 日付 | 変更内容 |
|------|---------|
| 2026-04-14 | 初版作成 |
| 2026-04-27 | tmp/詳細設計書群・product/実コードと照合して全面改訂。repository/を正式ディレクトリとして追加、API命名規則を`.api.ts`に統一、型定義を`.types.ts`に統一、コンポーネント定義規約（function宣言・named export）を追記 |
