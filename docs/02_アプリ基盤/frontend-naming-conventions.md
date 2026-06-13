# Frontend Naming Conventions

## メタデータ

- **作成日**: 2026-04-14
- **最終更新**: 2026-04-14
- **ステータス**: draft
- **関連ドキュメント**: 
  - `.claude/commands/structure_1.md` (ディレクトリ構造の正規定義)
  - `docs/02_アプリ基盤/directory-structure.md` (プロジェクト全体構造)

---

## 概要

このドキュメントは、`product/frontend` 配下のファイル・ディレクトリの命名規則と構造の正規化ルールを定義します。

**目的**:
- コードベース全体で一貫した命名規則を確立する
- 既存の不統一を解消するための移行計画を提供する
- 新規ファイル作成時の判断基準を明確にする

---

## 現状の問題点

### 1. ディレクトリ構造の不統一

#### 問題: `src/` サブディレクトリの重複

**現状**: 13個のLV3機能フォルダで `src/` サブディレクトリが残存

```
features/01/01/01/REC001/
├── components/          # ✅ 正しい配置
├── hooks/               # ✅ 正しい配置
├── types/               # ✅ 正しい配置
├── utils/               # ✅ 正しい配置
└── src/                 # ❌ 削除すべき古いコピー
    ├── constants/       # （重複）
    └── utils/           # （重複）
```

**影響範囲**:
- REC001, REC002, REC005, REC006, REC018, REC019, REC020
- ORD001
- ETC001, ETC002, ETC003, ETC004, ETC005

**調査結果**: 
- REC001, REC005, REC018などでは、直下のディレクトリとsrc/配下が**完全に同一**（diffで差分なし）
- つまり、src/配下は単なる古いコピーであり、安全に削除可能

#### 問題: `src/app/shared/` の残存

**現状**: `src/app/shared/` が部分的に残存

```
src/
├── app/
│   └── shared/          # ❌ 削除済み（2026-04-14に統合完了）
└── shared/              # ✅ 正しい配置
    ├── components/
    │   └── atoms/       # shadcn/uiコンポーネント
    ├── plugins/
    └── stores/
```

**ステータス**: 解決済み（2026-04-14）

### 2. ファイル命名の不統一

#### 型定義ファイル

**現状**: `-types.ts` サフィックスを使用

```typescript
// 現在
patient-types.ts
medical-types.ts
ui-types.ts
set-registration-types.ts
```

**structure_1.md の規約**: `{機能名}.type.ts`

```typescript
// 推奨
patient.type.ts
medical.type.ts
ui.type.ts
setRegistration.type.ts
```

**影響範囲**: 
- features/配下のほぼ全ての型定義ファイル（約50ファイル）

#### Utilsファイル

**現状**: `-utils.ts` サフィックスを使用

```typescript
// 現在
patient-utils.ts
draft-storage.ts
prediction-engine.ts
```

**考慮点**:
- `-utils.ts` は慣例的に許容範囲
- しかし、一部のファイル（`draft-storage.ts`, `prediction-engine.ts`）はサフィックスなし
- 統一性の観点から検討が必要

**推奨方針**: 
- utils/ ディレクトリ内のファイルは明示的に `-utils.ts` サフィックスは不要
- ファイル名は機能を表す名詞または動詞で命名（例: `draftStorage.ts`, `predictionEngine.ts`）

---

## 命名規則（確定版）

### ディレクトリ構造

#### LV3機能フォルダ直下

```
features/{LV1}/{LV2}/{LV3}/
├── {LV3機能名}.tsx              # メインコンポーネント（例: REC001.tsx）
├── api/                         # BFF通信ロジック（この画面専用）
│   └── *.api.ts
├── assets/                      # 画面固有の画像・静的ファイル
├── components/                  # この画面専用のMolecules/Organisms
│   ├── molecules/
│   │   └── *.tsx
│   └── organisms/
│       └── *.tsx
├── hooks/                       # この画面固有の対話ロジック
│   └── use*.ts
├── stores/                      # この画面の一時的な状態管理
│   └── *.store.ts
├── types/                       # この画面内専用の型定義
│   └── *.type.ts
├── utils/                       # この画面固有のユーティリティ
│   └── *.ts
├── data/                        # モックデータ・定数（必要に応じて）
│   └── *.ts
├── constants/                   # 定数定義（必要に応じて）
│   └── *.ts
├── style.css                    # Tailwind @apply等の画面固有スタイル
├── test/                        # テストファイル
│   ├── *_test.tsx               # 単体テスト
│   └── *_flow.test.tsx          # 結合テスト
└── index.ts                     # 機能公開窓口
```

**禁止事項**:
- ❌ `src/` サブディレクトリの作成
- ❌ `guidelines/` ディレクトリの作成（ドキュメントは `docs/` 配下に配置）
- ❌ `tmp/` ディレクトリの作成
- ❌ `cleanup_*.sh` 等のスクリプトの配置

### ファイル命名規則

#### API通信ロジック

```typescript
// ファイル名
{機能名}.api.ts

// 例
getUserAPI.ts
savePatient.api.ts
fetchMedicalRecords.api.ts
```

**命名パターン**:
- 動詞 + 名詞のcamelCase
- `.api.ts` サフィックス必須

#### カスタムフック

```typescript
// ファイル名
use{機能名}.ts

// 例
useUserUpdateForm.ts
usePatientData.ts
useKeyboardShortcuts.ts
```

**命名パターン**:
- `use` プレフィックス必須
- PascalCaseで機能を表現
- `.ts` 拡張子（JSXを含む場合は `.tsx`）

#### 型定義

```typescript
// ファイル名
{ドメイン名}.type.ts

// 例
patient.type.ts
medical.type.ts
ui.type.ts
setRegistration.type.ts
```

**命名パターン**:
- ドメイン名をcamelCaseで表現
- `.type.ts` サフィックス必須
- 複数の型が含まれる場合も単数形を使用（例: `patient.type.ts` 内に `Patient`, `PatientList`, `PatientDetail` など）

#### Utilsファイル

```typescript
// ファイル名（utils/ディレクトリ内）
{機能名}.ts

// 例
draftStorage.ts
predictionEngine.ts
patientFormatter.ts
dateHelper.ts
```

**命名パターン**:
- camelCaseで機能を表現
- サフィックスは不要（`utils/` ディレクトリ配置で用途が自明）
- 具体的な役割を表す名詞または動詞

#### Storeファイル

```typescript
// ファイル名
{ドメイン名}.store.ts
use{ドメイン名}.ts  // Zustandの場合

// 例
patient.store.ts
usePatientStore.ts
uiState.store.ts
useUiState.ts
```

**命名パターン**:
- Zustandの場合: `use{ドメイン名}.ts`（hookとして扱う）
- その他: `{ドメイン名}.store.ts`

#### コンポーネント

```typescript
// ファイル名
{ComponentName}.tsx

// 例
GlobalHeader.tsx
PatientDetailDialog.tsx
UserUpdateForm.tsx
```

**命名パターン**:
- PascalCase必須
- 複合語は単語ごとに大文字（例: `PatientDetailDialog`）
- サフィックス不要（ファイルの配置で種類が判断できる）

#### データ・定数ファイル

```typescript
// ファイル名
{内容を表す名詞}.ts

// 例
mockPatients.ts
sampleData.ts
medicalData.ts
apiEndpoints.ts
```

**命名パターン**:
- camelCaseで内容を表現
- `mock-` プレフィックスはモックデータに使用

#### テストファイル

```typescript
// 単体テスト
{対象ファイル名}_test.tsx

// 結合テスト
{対象ファイル名}_flow.test.tsx

// 例
UserUpdateForm_test.tsx
UserUpdateForm_flow.test.tsx
```

**命名パターン**:
- 対象ファイル名 + `_test.tsx` or `_flow.test.tsx`
- アンダースコアで区切る

---

## 移行計画

### フェーズ1: ディレクトリ構造の正規化（優先度: 高）

#### タスク1-1: 重複src/ディレクトリの削除

**対象**: 以下のLV3機能フォルダ

```
features/01/01/01/REC001/src/
features/01/01/01/REC002/src/
features/01/02/01/REC005/src/
features/01/02/02/REC006/src/
features/01/04/03/REC018/src/
features/01/05/01/REC019/src/
features/01/06/01/REC020/src/
features/05/01/01/ORD001/src/
features/17/01/01/ETC001/src/
features/17/01/01/ETC002/src/
features/17/01/01/ETC003/src/
features/17/01/01/ETC004/src/
features/17/01/01/ETC005/src/
```

**作業内容**:

1. **重複確認が完了しているもの（即削除可能）**:
   - REC001/src/ - constants/, utils/が直下と完全同一
   - REC005/src/ - 同様
   - REC018/src/ - hooks/が直下と完全同一

2. **移行が必要なもの**:
   - ETC001/src/ - components/, guidelines/を移動
   - ETC002/src/ - components/, data/, guidelines/を移動
   - ETC003/src/ - components/, hooks/, types/, utils/, constants/を移動（tmpは削除、cleanup_*.shは削除）
   - ETC004/src/ - guidelines/のみ（削除検討）
   - ETC005/src/ - imports/, guidelines/を移動
   - ORD001/src/ - data/, hooks/, imports/, utils/を移動（guidelines/は削除検討）
   - REC002/src/ - components/, data/を移動（guidelines/は削除検討）
   - REC006/src/ - components/, types/を移動（guidelines/は削除検討）
   - REC019/src/ - guidelines/のみ（削除検討）
   - REC020/src/ - data/を移動（guidelines/は削除検討）

**実行手順**:

```bash
# 例: REC001の重複削除
cd features/01/01/01/REC001/
rm -rf src/

# 例: ETC003の移行（重複チェック後）
cd features/17/01/01/ETC003/
# 重複していないファイルのみ移動
# mv src/components/* components/ 2>/dev/null || true
# mv src/hooks/* hooks/ 2>/dev/null || true
# ...
# 不要ファイルの削除
rm -f src/cleanup_*.sh
rm -rf src/tmp/
rm -rf src/guidelines/
# 空になったsrcを削除
rmdir src/ || rm -rf src/
```

**注意事項**:
- 移動前に必ず `diff` で重複確認
- `guidelines/` ディレクトリは原則削除（必要ならdocs/配下に移動）
- `cleanup_*.sh` などのスクリプトは削除
- `tmp/` ディレクトリは削除

### フェーズ2: ファイル名のリネーム（優先度: 中）

#### タスク2-1: 型定義ファイルのリネーム

**対象**: `-types.ts` サフィックスを持つ全ファイル

**リネーム対象一覧** (約50ファイル):

```
# LV3機能フォルダ内
patient-types.ts         → patient.type.ts
medical-types.ts         → medical.type.ts
ui-types.ts              → ui.type.ts
set-registration-types.ts → setRegistration.type.ts
learning-types.ts        → learning.type.ts
```

**影響**: 
- import文の一括置換が必要
- 推定影響範囲: 200-300ファイル

**実行手順**:

```bash
# 1. リネーム実行（例: REC001）
cd features/01/01/01/REC001/types/
mv patient-types.ts patient.type.ts
mv medical-types.ts medical.type.ts
mv ui-types.ts ui.type.ts
mv set-registration-types.ts setRegistration.type.ts

# 2. import文の一括置換（プロジェクト全体）
# find/sedまたはIDEのリファクタリング機能を使用
```

**自動化スクリプト案**:

```bash
#!/bin/bash
# rename-types.sh

find product/frontend/src/features -name "*-types.ts" | while read file; do
  dir=$(dirname "$file")
  base=$(basename "$file" -types.ts)
  # kebab-case → camelCase変換
  new_base=$(echo "$base" | sed -r 's/-([a-z])/\U\1/g')
  new_file="$dir/${new_base}.type.ts"
  
  echo "Renaming: $file → $new_file"
  mv "$file" "$new_file"
done
```

**import文の置換**:

```bash
# 例: patient-types.ts → patient.type.ts
find product/frontend/src -name "*.ts" -o -name "*.tsx" | xargs sed -i \
  's|from "\(.*\)/patient-types"|from "\1/patient.type"|g'
```

#### タスク2-2: Utilsファイルのリネーム（任意）

**対象**: `-utils.ts` サフィックスを持つファイル

**リネーム候補**:

```
patient-utils.ts → patientFormatter.ts  # 役割を明確化
```

**判断基準**:
- 現状の `-utils.ts` も慣例的に許容範囲
- ただし、ファイル内の具体的な役割が明確な場合はより具体的な名前に変更を推奨
- 例: `patient-utils.ts` が主にフォーマット処理なら `patientFormatter.ts`

**優先度**: 低（任意）

---

## 検証・適合性チェック

### 自動チェックスクリプト

以下のスクリプトで命名規則への適合をチェック可能:

```bash
#!/bin/bash
# check-naming-conventions.sh

echo "=== ディレクトリ構造チェック ==="

# 1. src/ サブディレクトリの検出
src_dirs=$(find product/frontend/src/features -type d -name "src")
if [ -n "$src_dirs" ]; then
  echo "❌ 不正なsrc/ディレクトリが見つかりました:"
  echo "$src_dirs"
else
  echo "✅ src/ディレクトリなし"
fi

# 2. guidelines/ ディレクトリの検出
guideline_dirs=$(find product/frontend/src/features -type d -name "guidelines")
if [ -n "$guideline_dirs" ]; then
  echo "⚠️ guidelines/ディレクトリが見つかりました（削除推奨）:"
  echo "$guideline_dirs"
fi

echo ""
echo "=== ファイル命名チェック ==="

# 3. 旧型定義ファイルの検出
old_types=$(find product/frontend/src/features -name "*-types.ts")
if [ -n "$old_types" ]; then
  echo "⚠️ 旧命名規則の型定義ファイル:"
  echo "$old_types" | wc -l
  echo "ファイルが見つかりました"
else
  echo "✅ 型定義ファイルの命名規則に適合"
fi

# 4. API通信ロジックの検出（.api.tsサフィックスチェック）
# （現状API通信ロジックがないため参考）
api_files=$(find product/frontend/src/features -path "*/api/*.ts" ! -name "*.api.ts")
if [ -n "$api_files" ]; then
  echo "⚠️ .api.tsサフィックスがないAPIファイル:"
  echo "$api_files"
fi

echo ""
echo "=== 完了 ==="
```

### 手動チェックリスト

- [ ] すべてのLV3フォルダ直下に `src/` ディレクトリが存在しない
- [ ] `src/app/shared/` が存在しない（`src/shared/` のみ）
- [ ] 型定義ファイルが `.type.ts` サフィックスを使用している
- [ ] カスタムフックが `use` プレフィックスを持つ
- [ ] コンポーネントがPascalCaseで命名されている
- [ ] API通信ロジックが `api/` ディレクトリ内に配置され `.api.ts` サフィックスを持つ

---

## 新規ファイル作成ガイドライン

### 型定義を追加する場合

```typescript
// ✅ 良い例
// features/03/01/02/PAT007/types/search.type.ts

export interface PatientSearchCriteria {
  name?: string;
  birthDate?: Date;
}

export interface PatientSearchResult {
  id: string;
  name: string;
  // ...
}
```

```typescript
// ❌ 悪い例
// features/03/01/02/PAT007/types/patient-search-types.ts  // 命名規則違反
```

### カスタムフックを追加する場合

```typescript
// ✅ 良い例
// features/03/01/02/PAT007/hooks/usePatientSearch.ts

export const usePatientSearch = () => {
  // ...
};
```

```typescript
// ❌ 悪い例
// features/03/01/02/PAT007/hooks/patient-search-hook.ts  // 命名規則違反
```

### API通信ロジックを追加する場合

```typescript
// ✅ 良い例
// features/03/01/02/PAT007/api/searchPatient.api.ts

import { axiosClient } from '@/shared/plugins/axios.client';

export const searchPatientAPI = async (criteria: PatientSearchCriteria) => {
  // ...
};
```

```typescript
// ❌ 悪い例
// features/03/01/02/PAT007/api/patient-search.ts  // .api.tsサフィックスがない
```

---

## FAQ

### Q1: 既存の `-types.ts` ファイルをすぐにリネームする必要がありますか？

**A**: いいえ。フェーズ2は優先度「中」としています。以下の順序で進めることを推奨します：

1. 新規ファイルは必ず `.type.ts` を使用
2. 既存ファイルは、大規模な修正時に一括でリネーム
3. import文の置換は自動化スクリプトで実行

### Q2: `guidelines/` ディレクトリ内のファイルはどうすべきですか？

**A**: 以下の方針で対応してください：

- **ドキュメント類**: `docs/02_アプリ基盤/` または `docs/01_アプリ/{domain}/` に移動
- **一時的なメモ**: 不要なら削除
- **生成物や自動生成ファイル**: 削除

### Q3: `src/` ディレクトリ削除後、import文は自動で更新されますか？

**A**: いいえ。以下の対応が必要です：

1. **移動前に影響範囲を確認**: `grep -r "from.*src/" product/frontend/src/`
2. **IDEのリファクタリング機能を使用**: VSCodeの "Rename Symbol" など
3. **手動で修正**: `../../src/` → `../` のようにパスを1階層上げる

---

## 参考資料

- `.claude/commands/structure_1.md` - Frontend Directory Structure（正規定義）
- `docs/02_アプリ基盤/directory-structure.md` - プロジェクト全体のディレクトリ構造
- Bulletproof React: https://github.com/alan2207/bulletproof-react
- shadcn/ui Naming Conventions: https://ui.shadcn.com/docs

---

## 変更履歴

| 日付 | 変更内容 | 担当 |
|------|---------|------|
| 2026-04-14 | 初版作成 | Claude |
