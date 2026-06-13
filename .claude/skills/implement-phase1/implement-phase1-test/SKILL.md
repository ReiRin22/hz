---
name: implement-phase1-test
description: Phase 1（基盤整備）完了後のディレクトリ構造検証スキル。`.claude/commands/structure_2.md` に定義された期待構造と実際のファイルシステムを照合し、不足ディレクトリと余剰ファイルをレポートする（削除はしない）。TRIGGER when: `/implement` コマンドの Phase 1（T1-1〜T1-3）が全タスク完了したとき。不足ディレクトリがあれば .gitkeep 付きで自動作成するか確認する。DO NOT TRIGGER when: Phase 1 未完了のとき、または他の Phase を実行中のとき。
---

# implement-phase1-test: Phase 1 ディレクトリ構造検証

Phase 1（基盤整備）の全タスク（T1-1〜T1-3）が完了したら、このスキルを実行する。
目的は「structure_2.md が定義する期待構造」と「実際のファイルシステム」の乖離を発見し、
不足を補い、余剰を確認することで、以降のフェーズを安全に進められる状態を作ること。

---

## ステップ 1: 期待構造の読み込み

`.claude/commands/structure_2.md` を Read で読み込み、以下の4つのルートを把握する。

| ルート | 説明 |
|---|---|
| `frontend/src/app/` | App Router ルーティング層 |
| `frontend/src/features/` | ビジネス機能の実装層（LV1/LV2/LV3） |
| `frontend/src/shared/` | システム全体共通資産 |
| `front_bff_shared/` | フロント・BFF 共有型・スキーマ |

structure_2.md の「実際のディレクトリ構成（チェックリスト準拠）」セクションにある
features/ の確定済みディレクトリ構成（LV1〜LV3）を全て抽出する。

---

## ステップ 2: 実際のディレクトリ一覧を取得

```bash
# features/ の実ディレクトリ一覧
find product/frontend/src/features -type d | sort

# shared/ の実ディレクトリ一覧
find product/frontend/src/shared -type d | sort

# app/ の実ディレクトリ一覧
find product/frontend/src/app -type d | sort

# front_bff_shared/ の実ディレクトリ一覧
find product/front_bff_shared -type d | sort
```

プロジェクトルート（`product/` が存在しない場合は `frontend/` や `src/` から試みる）。

---

## ステップ 3: 不足チェック

structure_2.md に定義されているが実際に存在しないディレクトリを列挙する。

特に LV3 ディレクトリ配下の以下サブフォルダが抜けやすいため重点チェック：
- `api/`
- `components/molecules/`
- `components/organisms/`
- `hooks/`
- `stores/`
- `types/`
- `test/`
- `assets/`

---

## ステップ 4: 余剰チェック

実際に存在するが structure_2.md に定義されていないパスを列挙する。
**削除はしない。** 意図的な追加か、誤配置かを人間が判断するための情報提供のみ行う。

---

## ステップ 5: 結果レポート

以下の形式で出力する：

```
## Phase 1 ディレクトリ構造チェック結果

### ✅ 一致（存在する）
- frontend/src/features/01_diagnosis/ ... N件
（長いリストは折りたたんで件数のみ表示してよい）

### ⚠️ 不足（structure_2.md にあるが存在しない）
- frontend/src/features/06_exam-result/01_result-view/01_result-display/api/
- frontend/src/features/06_exam-result/01_result-view/01_result-display/hooks/
- ...
→ 作成が必要なディレクトリ一覧（.gitkeep を置いて空フォルダとして作成可能）

### 🔍 余剰（存在するが structure_2.md に定義なし）
- frontend/src/features/tmp_work/
- ...
→ 削除はしない。意図的な追加か確認すること

### 📊 サマリ
- 一致: N件 / 不足: N件 / 余剰: N件
```

---

## ステップ 6: Gate: CONFIRM（不足がある場合のみ）

不足ディレクトリが1件以上ある場合、以下のゲートを提示する：

```yaml
header: "ディレクトリ不足の対応"
question: "不足ディレクトリが {N} 件あります。.gitkeep を置いて空フォルダとして作成しますか？"
options:
  - "作成する（推奨）" / description: "mkdir -p + touch .gitkeep で全不足フォルダを作成"
  - "スキップする" / description: "後で手動作成する"
  - "一部だけ選択する" / description: "リストを確認して必要なものだけ作成"
```

「作成する」が選択された場合：

```bash
# 例（実際のパスはステップ3で特定したものを使う）
mkdir -p product/frontend/src/features/06_exam-result/01_result-view/01_result-display/api
touch product/frontend/src/features/06_exam-result/01_result-view/01_result-display/api/.gitkeep
# ... 全不足ディレクトリに対して繰り返す
```

作成後、再度 `find` で確認して「不足: 0件」になったことを報告する。

---

---

## ステップ 7: コンポーネント層チェック（T1-4 が実施された場合）

T1-4（コンポーネント層整理）が tasklist.md に含まれ `[x]` になっている場合、
以下の追加チェックを実行する。

### 7-1: 公開窓口ファイルの最小化確認

```bash
# 対象の {機能コード}.tsx の行数を確認（20行以下が目標）
wc -l features/{LV1}/{LV2}/{LV3}/{機能コード}.tsx
```

公開窓口ファイルが行数 20 行以内 かつ 1 つの Organism を return するだけであれば OK。

### 7-2: molecules/ および organisms/ の配置確認

```bash
# molecules/ 配下のファイルを確認
find features/{LV1}/{LV2}/{LV3}/components/molecules -name "*.tsx" | sort

# organisms/ 配下のファイルを確認
find features/{LV1}/{LV2}/{LV3}/components/organisms -name "*.tsx" | sort
```

| チェック項目 | 基準 |
|---|---|
| molecules/ に最低 1 つ以上の .tsx ファイルがある | OK |
| organisms/ に最低 1 つの統合 Organism がある | OK（SchemaCreationOrganism 等） |
| organisms/ に Canvas 系コンポーネントがある | OK（DrawingCanvas 等） |

### 7-3: assets/ への静的データ移動確認

```bash
# assets/ 内に SVG / テンプレートデータファイルがあるか確認
find features/{LV1}/{LV2}/{LV3}/assets -name "*.tsx" -o -name "*.ts" | sort
```

### 7-4: TypeScript コンパイル確認（schema-creation スコープ）

```bash
npx tsc --noEmit 2>&1 | grep "{機能コード}" | head -20
```

0 件であることを確認する。

### 7-5: コンポーネント層チェック結果レポート

```
## T1-4 コンポーネント層チェック結果

### ✅ 公開窓口ファイル最小化
- {機能コード}.tsx: N行（目標 20行以下）→ OK / NG

### ✅ molecules/ 配置
- ファイル数: N件
  - ColorPickerPanel.tsx ✅
  - ...

### ✅ organisms/ 配置
- ファイル数: N件
  - DrawingCanvas.tsx ✅
  - SchemaCreationOrganism.tsx ✅
  - ...

### ✅ assets/ 静的データ
- MedicalTemplates.tsx ✅
- templates.ts ✅

### ✅ TypeScript コンパイル
- {機能コード} スコープ: 0件 ✅

### 📊 T1-4 サマリ
- 公開窓口最小化: OK / NG
- molecules/ 配置: OK / NG
- organisms/ 配置: OK / NG
- TypeScript: 0件エラー / N件エラー
```

---

## 完了条件

- [ ] 不足ディレクトリが 0件、または「スキップ」を選択して意図的に確認済み
- [ ] 余剰ディレクトリの一覧が人間に提示された
- [ ] サマリが出力された
- [ ] （T1-4 が実施された場合）公開窓口ファイルが最小化されている
- [ ] （T1-4 が実施された場合）molecules/ organisms/ に適切なファイルが配置されている
- [ ] （T1-4 が実施された場合）TypeScript コンパイルが 0 エラー
