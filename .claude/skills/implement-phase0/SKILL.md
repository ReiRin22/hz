---
name: implement-phase0
description: 実装フェーズ開始前のスコープ確定・コンポーネント設計スキル。Phase 0（T0-1〜T0-6）を実行するときに必ず参照する。TRIGGER when: /implement コマンドで新機能の実装を開始するとき（Phase 1 より前）。やること: ①コンポーネント分割 ②この機能に必要な機能要素の確認 ③他の機能とのページ境界・共有領域の特定 ④shared 振り分け洗い出し（型・フック・ユーティリティ・コンポーネント） ⑤スコープ外コード・ファイルのコメントアウト（復元可能な形式） ⑥実装範囲外領域のプレースホルダー配置（サイズ維持）。DO NOT TRIGGER when: Phase 1 以降のタスクを実行するとき。
---

**作業原則**: このスキルの作業中、不明点があれば作業を中断してユーザーに報告し指示を仰ぐこと。推測や独自判断で進めない。

# Phase 0: スコープ確定・コンポーネント設計

Phase 1（基盤整備）を始める前に必ず完了させること。
このフェーズの目的は「何を作り、何を触らないか」を明確にすること。
曖昧なまま実装に入ると、他機能の破壊・重複実装・手戻りが発生する。

---
## 【最優先】LV3/src フォルダ禁止ルール

LV3 直下に `src/` フォルダを作成・維持してはならない。

`LV3/src/` 配下に以下のフォルダが存在する場合は、Phase 1（T1-1）で必ず LV3 直下へ昇格する。

- `src/components/*` → `components/*`
- `src/data/*` → 静的TSデータなら `assets/*`
- `src/hooks/*` → `hooks/*`
- `src/stores/*` → `stores/*`
- `src/types/*` → `types/*`
- `src/test/*` → `test/*`
- `src/assets/*` → `assets/*`

昇格後、`LV3/src/` 配下が空、または `Attributions.md` / `Guidelines.md` / `index.css` などの不要ファイルのみになった場合、`LV3/src/` は削除する。

`structure_2.md` の許可フォルダ一覧に存在しない `data/` / `guidelines/` / `figma/` などを LV3 直下に新設・維持してはならない。
必要な内容は許可フォルダへ移動し、不要・スコープ外なら `[SCOPE-OUT]` コメントを付けて保存先を tasklist.md に記録する。

## チェックリスト

```
Phase 0: スコープ確定・コンポーネント設計（Phase 1 の前提条件）
├── T0-1: コンポーネント分割
├── T0-2: この機能に必要な機能要素の確認
├── T0-3: 他の機能とのページ境界・共有領域の特定
├── T0-4: shared 振り分け洗い出し（型・フック・ユーティリティ・コンポーネント）
├── T0-5: スコープ外コード・ファイルのコメントアウト（復元可能形式）
└── T0-6: 実装範囲外領域のプレースホルダー配置（サイズ維持）
```

---

## T0-1: コンポーネント分割とファイル再配置

デザイン仕様または設計書の画面設計を見て、コンポーネントを4層に分解する。
**ファイル再配置時は `.claude/commands/structure_2.md` を必ず参照し、正しい配置先を確認すること。**

| 層 | 定義 | 例 |
|---|---|---|
| **Atoms** | これ以上分割できない最小単位 | Button, Input, Icon |
| **Molecules** | Atoms を組み合わせた小さな UI | SearchField, FormRow |
| **Organisms** | 機能の塊として完結する UI | DrawingToolbar, ConfirmDialog |
| **Page** | ルートに対応する最上位コンポーネント | RecordCreationPage |

**structure_2.md の参照ポイント**:
- `features/` の LV1/LV2/LV3 ディレクトリ構造と命名規則（数字プレフィックス必須）
- `components/molecules/` / `components/organisms/` の配置ルール
- `shared/components/atoms/` vs `features/.../components/` の使い分け（Auto-Fix Rules）
- ファイル命名規則テーブル（`*.api.ts` / `use*.ts` / `*.types.ts` 等）

**【必須】非定義フォルダの検出と除去計画**:

T0-1 の最初に以下の手順で LV3 フォルダを監査し、`structure_2.md` に定義されていないフォルダを洗い出す。
検出した非定義フォルダはここでは削除せず、T0-4 の振り分けリストに記録して Phase 1（T1-1）で処置する。

`structure_2.md` が定める **LV3 直下の許可フォルダ一覧**:

```
api/          assets/       components/   hooks/
stores/       types/        test/
```

`components/` 直下は **`molecules/`** と **`organisms/`** のみ許可。それ以外（例: `figma/`）は非定義。

```bash
# ① LV3 直下の非定義フォルダを検出
ALLOWED="api assets components hooks stores types test"
LV3_PATH="product/frontend/src/features/{LV1}/{LV2}/{LV3}"

find "$LV3_PATH" -maxdepth 1 -mindepth 1 -type d | while read dir; do
  name=$(basename "$dir")
  echo "$ALLOWED" | grep -qw "$name" || echo "⚠️ 非定義フォルダ: $dir"
done

# ② components/ 直下の非許可サブフォルダを検出（molecules/ と organisms/ 以外）
COMP_PATH="$LV3_PATH/components"
[ -d "$COMP_PATH" ] && find "$COMP_PATH" -maxdepth 1 -mindepth 1 -type d | while read dir; do
  name=$(basename "$dir")
  case "$name" in molecules|organisms) ;; *) echo "⚠️ components/内の非定義サブフォルダ: $dir" ;; esac
done
```

検出した非定義フォルダごとに以下を判断して tasklist.md の T0-4 セクションに記録する:

| 判断 | 条件 | 処置（T1-1 で実行） |
|---|---|---|
| **ファイルを正規パスへ移動 → フォルダ削除** | 中身がいずれかの許可フォルダ相当（例: `src/components/` → `components/`） | `mv` で正規パスへ移動後 `rm -rf` |
| **ファイルをsharedへ移動 → フォルダ削除** | 他LV3でも使う汎用コード（T0-4 Q1/Q2 に該当） | shared 移動 + `rm -rf` |
| **`assets/` へ移動 → フォルダ削除** | `data/` など静的 TS データファイル（`.ts`）が入っている場合 | `mv` で `assets/` 配下へ移動後 `rm -rf` |
| **そのまま削除** | 不要なドキュメント・一時ファイル等（`Attributions.md`, `Guidelines.md`, `index.css` 等） | `rm -rf` |

**非定義フォルダの解決パターン（REC002 で確認済み）**:

```
01_schema-creation/
  components/
    DrawingCanvas.tsx    ← 正規版
    figma/               ← ⚠️ components/内の非定義サブフォルダ
      ImageWithFallback.tsx  → shared/components/atoms/ へ移動後 figma/ を削除
  data/                  ← ⚠️ LV3直下の非定義フォルダ（静的データ）
    templates.ts             → assets/templates.ts へ移動後 data/ を削除
  src/                   ← ⚠️ LV3直下の非定義フォルダ（全コンポーネントの二重化）
    components/DrawingCanvas.tsx  ← diff で比較。同一なら src/ を削除
    data/templates.ts
    index.css             → 削除
    Attributions.md       → 削除
    guidelines/           → 削除
```

**インポートパス更新の追跡（T0-4 で必ず記録）**:

非定義フォルダのファイルを移動すると、そのファイルを参照している import 文が壊れる。
T0-4 の tasklist に **インポートパス更新リスト** として記録しておき、T1-1 で確実に対処する。

```bash
# src/ を参照している import 文を探す
grep -rn "from.*\/src\/" product/frontend/src --include="*.tsx" --include="*.ts" | grep "01_schema-creation"
```

**空フォルダの作成**:
コンポーネント分割の結果、必要だが未作成のフォルダがある場合は
`mkdir -p` で作成し、`touch .gitkeep` を置いてバージョン管理に含める。

```bash
# 例: LV3 ディレクトリ配下の必須サブフォルダを作成
mkdir -p product/frontend/src/features/{LV1}/{LV2}/{LV3}/{api,components/molecules,components/organisms,hooks,stores,types,test,assets}
find product/frontend/src/features/{LV1}/{LV2}/{LV3} -type d -empty -exec touch {}/.gitkeep \;
```

**別機能のコードのコメントアウトルール**:
- 別機能が担当すると思われる箇所は**削除せず**、T0-5 の規約に従ってコメントアウトする
- `[SCOPE-OUT: {機能コード}]` タグを付ける

**成果物（tasklist.md に記録）**:
- コンポーネント一覧（層 / 名前 / 責務 / 主要 props）
- 再利用の可否（`codebase-researcher` に委譲して既存コードを調査する）
- 非定義フォルダの一覧と処置方針（T1-1 で実行）
- インポートパス更新リスト（T1-1 で実行）

---

## T0-2: この機能に必要な機能要素の確認

PRD の受入条件を機能要素単位に分解し、スコープ内外を明示する。

**確認ポイント**:
- PRD の受入条件をすべて列挙する
- 各条件を「スコープ内 ✅」「スコープ外 ❌」に分類する
- スコープ外の要素は T0-5（コメントアウト）または T0-6（プレースホルダー）で処理する

**成果物（tasklist.md に記録）**:
```
## スコープ確認
### スコープ内（実装する）
- [ ] ○○の入力フォーム
- [ ] ○○の保存処理

### スコープ外（今回は実装しない）
- ❌ △△の編集機能 → T0-5 でコメントアウト
- ❌ □□パネル → T0-6 でプレースホルダー配置
```

---

## T0-3: 他の機能とのページ境界・共有領域の特定

同じページ（route）に複数機能が共存する場合、担当領域を明確にする。

**確認手順**:
1. 対象ページの既存コードを読む
2. 他の機能コード（例: `// [SCOPE-OUT: REC001]` タグ）がないか確認する
3. 各機能の担当領域をコメントまたは図で記録する

**ルール**:
- 他機能が担当する領域には **一切手を加えない**
- 境界が不明確な場合は **[Gate: CONFIRM]** で人間に確認してから進む

```tsx
{/* ===== REC001 担当領域ここから ===== */}
{/* （この中は触らない）        */}
{/* ===== REC001 担当領域ここまで ===== */}
```

---

## T0-4: shared 振り分け洗い出し

実装対象の LV3 フォルダ内のファイルを精査し、どのファイルを shared に移すかを決定する。
**移動はこのタスクでは行わない。決定リストを作成し、Phase 1（T1-1）で実行する。**

### 振り分け判定フロー

```
ファイルを見たとき
  │
  ├─ Q1: このLV1の外（他LV1・他機能）でも使うか？
  │     YES → src/shared/{category}/    （アプリ全体 shared）
  │     NO  ↓
  │
  ├─ Q2: このLV1 内の 2つ以上の LV2/LV3 で使うか（または使う可能性があるか）？
  │     YES → src/shared/{category}/{lv1-domain}/    （LV1共通 → アプリ全体sharedで管理）
  │     NO  ↓
  │
  ├─ Q3: 同一LV3内で src/ サブフォルダと直下の両方に重複コピーがあるだけか？
  │     YES → src/ を削除して LV3 直下に1つに統合（shared移動不要）
  │     NO  ↓
  │
  └─ そのままLV3内に留める（移動不要）
```

### 振り分け先の配置パス

| カテゴリ | 配置先パス | 昇格条件 |
|---------|----------|---------|
| api | `src/shared/api/{domain}/` | 複数の LV3 が同じ BFF エンドポイントを呼ぶ |
| assets | `src/shared/assets/` | 複数 LV3 で同じ画像・SVG を参照する |
| components（atoms） | `src/shared/components/atoms/` | LV1 をまたいで同じ最小 UI を使う |
| components（molecules） | `src/shared/components/molecules/` | LV1 をまたいで同じ UI ブロックを使う |
| hooks | `src/shared/hooks/{domain}/` | 複数 LV3 で同じロジック（認証監視・ナビゲーションガード等）を使う |
| stores | `src/shared/stores/` | Domain または Global スコープ — **詳細判定は Phase 3 / T3-1 へ委ねる（後述）** |
| types | `src/shared/types/{domain}/` または `front_bff_shared/` | フロントのみ共有 → `shared/types/`、BFF 境界をまたぐ → `front_bff_shared/` |
| utils | `src/shared/utils/{domain}/`（未存在の場合は新規作成） | LV3 をまたいで同じ純粋関数（日付・文字列変換等）を使う |
| 定数 | `src/shared/constants/{domain}/`（未存在の場合は新規作成） | 複数 LV3 で同じ定数を使う |
| モック | `src/shared/mocks/{domain}/`（未存在の場合は新規作成） | 複数 LV3 から参照されるモックデータ |

> **`{domain}`** = LV1 のドメイン名（例: `diagnosis`、`exam-result`）

> **stores の昇格は Phase 3 / T3-1 で判定する**
> T0-4 の時点では「Page / Domain / Global のどのスコープか」を仮分類するにとどめる。
> 実装が固まる Phase 3 で最終判定し、Domain・Global スコープのものだけ `src/shared/stores/` へ移動する。
> Page スコープ（画面離脱で破棄してよい状態）は LV3/stores/ に留める。

### ファイル種別ごとの経験則

| ファイル種別 | デフォルト判断 |
|-----------|-------------|
| `*.types.ts` / `*-types.ts` | 複数LV3で同一定義があれば shared へ（差異があれば diff 確認してから統合） |
| `use*.ts`（フック） | 汎用ロジックなら shared へ。画面固有状態を持つなら LV3 に留める |
| `*-utils.ts` / `*.utils.ts` | 純粋関数はほぼ shared 候補。積極的に共有化 |
| `*.api.ts` / `get*.ts` / `post*.ts` | 1画面だけが使う → LV3。複数 LV3 が同じエンドポイントを呼ぶ → `shared/api/` |
| `*.store.ts` | スコープ仮判定のみ（Page → LV3 留め、Domain/Global → Phase 3 で `shared/stores/` 昇格判定） |
| `*.repository.ts` | 画面固有ロジック。基本 LV3 に留める |
| 汎用 UI コンポーネント（`ImageWithFallback` 等） | atoms/molecules に昇格 |
| assets（画像・SVG） | 1画面だけが使う → LV3/assets/。複数 LV3 で共有 → `shared/assets/` |
| `mock*.ts` / `*-data.ts` | 単一LV3固有なら残す。複数から参照なら `src/shared/mocks/` へ |

### 注意点

- 同名ファイルが複数箇所に存在する場合は **diff で内容を確認する**。差異があれば網羅的な方を採用し、差異の理由を記録する
- `src/shared/utils/` / `src/shared/constants/` / `src/shared/mocks/` は現状存在しない場合がある。Phase 1（T1-1）で新規作成する
- 既存 shared（`src/shared/api/`、`src/shared/hooks/`、`src/shared/types/` 等）のパターンを参照して命名を統一する

**成果物（tasklist.md に記録）**:
```
## T0-4 shared 振り分けリスト
### アプリ全体 shared に移動
- [ ] components/figma/ImageWithFallback.tsx → shared/components/atoms/image-with-fallback.tsx
      （複数LV3に重複あり。figma/ フォルダも削除）

### 非定義フォルダの整理
- [ ] src/ を削除: components/* と data/* はルート直下に正規版あり。diff で同一確認後 rm -rf
- [ ] data/templates.ts → assets/templates.ts（data/ は非定義フォルダ。静的データなので assets/ へ）

### インポートパス更新リスト（T1-1 で実施）
- [ ] REC002.tsx: `./src/components/DrawingCanvas` → `./components/DrawingCanvas`
- [ ] REC002.tsx: `./src/components/ColorPicker` → `./components/ColorPicker`
- [ ] REC002.tsx: `./src/components/MedicalTemplates` → `./components/MedicalTemplates`
- [ ] REC002.tsx: `./src/data/templates` → `./assets/templates`

### LV3 に留める（移動不要）
- api/（Phase 2 で新規作成予定）
- stores/schemaCreation.store.ts（Phase 3 で新規作成予定）
- assets/templates.ts（Phase 2 でAPI移行後に削除予定）
```

---

## T0-5: スコープ外コード・ファイルのコメントアウト（復元可能形式）

スコープ外のコードは**削除せず**、復元できる形でコメントアウトする。
将来の実装者が「なぜここにあるのか」を理解できるよう、理由を必ず添える。

### コメントアウト規約

**TSX / TS ファイル**:
```tsx
{/* [SCOPE-OUT: REC002] 将来的に実装予定の○○機能 */}
{/* <SomeComponent prop={value} /> */}
```

**CSS / SCSS ファイル**:
```css
/* [SCOPE-OUT: REC002] 将来的に実装予定の○○スタイル */
/* .some-class { display: flex; } */
```

**画像ファイル**:
- ファイル自体は **削除しない**
- `import` 行だけコメントアウトする

```ts
// [SCOPE-OUT: REC002] 将来的に使用予定の画像
// import heroImage from './assets/hero.png';
```

### 記録（tasklist.md に追記）

```
## スコープ外管理
| ファイル | コメントアウト箇所 | 機能コード | 理由 |
|---|---|---|---|
| SomePanel.tsx | <AdvancedSettings /> | REC002 | 詳細設定は次フェーズ |
```

---

## T0-6: 実装範囲外領域のプレースホルダー配置（サイズ維持）

他機能が担当する領域は削除せず、**元のサイズを保ったままプレースホルダーに置き換える**。
サイズを維持しないとレイアウトが崩れ、他機能の実装時に手戻りが発生する。

### プレースホルダーの書き方

```tsx
{/* [PLACEHOLDER: REC002] ○○パネル（他機能担当、幅×高さ維持） */}
<div
  style={{ width: '元の幅px', height: '元の高さpx' }}
  className="bg-gray-100 border border-dashed border-gray-300"
  aria-hidden="true"
/>
```

**必須ポイント**:
- `style` 属性に元の `width` / `height` を **px で明示**する
- `aria-hidden="true"` を付けてスクリーンリーダーから除外する
- 配置後はブラウザ（または Storybook）でレイアウト崩れがないことを **目視確認**する

### サイズがわからない場合

1. デザイン仕様書のコンポーネント寸法を参照する
2. 既存コードの `className` から Tailwind のサイズクラスを推測する（例: `w-64 h-32` → `width: 256px, height: 128px`）
3. それでも不明な場合は `[Gate: CONFIRM]` で人間に確認する

---

## Phase 0 完了確認

全タスクが完了したら以下の手順で確認してから Phase 1 へ進む。

### 自動確認スキル

`Skill('implement-phase0-test')` を呼び出す。
（スキルファイルパス: `.claude/skills/implement-phase0/implement-phase0-test/SKILL.md`、name: `app-implement-phase0-test`）

Skill ツールで呼び出せない場合は以下のインラインチェックリストで代替する。

### インラインチェックリスト（フォールバック）

- [ ] T0-1: コンポーネント一覧（層/名前/責務）が tasklist.md に記録されている
- [ ] T0-1: 非定義フォルダ一覧と処置方針が tasklist.md に記録されている
- [ ] T0-1: インポートパス更新リストが tasklist.md に記録されている
- [ ] T0-2: スコープ内/外リストが tasklist.md に記録されている
- [ ] T0-3: 他機能との境界が明示されている（不明な場合は人間の確認を得ている）
- [ ] T0-4: shared 振り分けリストが tasklist.md に記録されている（移動は Phase 1 で実施）
- [ ] T0-5: スコープ外コードにすべて `[SCOPE-OUT: {機能コード}]` タグが付いている
- [ ] T0-6: 他機能担当領域のプレースホルダーが配置されている（または不要と判断済み）

```bash
# T0-5 で記録したファイルに実際にタグが存在するかを確認
grep -rn "SCOPE-OUT" product/frontend/src/features/{LV1}/{LV2}/{LV3} --include="*.tsx" --include="*.ts"
```

全チェックが通過したら state.md を更新して応答を終了する。Phase 1 は次のセッションで開始する。
