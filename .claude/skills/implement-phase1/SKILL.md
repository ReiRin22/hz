---
name: implement-phase1
description: Phase 1（基盤整備）のスキル。T1-1〜T1-3 を実行するときに参照する。shared 振り分け実施・ディレクトリ整理・BFF型定義・ViewModel型定義を行う。TRIGGER when: Phase 0（T0-1〜T0-6）が完了し、Phase 1 を開始するとき。やること: ① T0-4 で決定した shared 振り分けを実行 ② src/ 二重化解消 ③ BFF共有型・Zodスキーマ作成 ④ ViewModel型定義。DO NOT TRIGGER when: Phase 0 未完了のとき、または Phase 2 以降を実行するとき。
---

**作業原則**: このスキルの作業中、不明点があれば作業を中断してユーザーに報告し指示を仰ぐこと。推測や独自判断で進めない。

# Phase 1: 基盤整備

Phase 0（T0-1〜T0-6）が完了してから開始する。
Phase 0 の T0-4 で作成した「shared 振り分けリスト」を実行するフェーズ。

---

## チェックリスト

```
Phase 1: 基盤整備（ブロッカー）
├── T1-1: ディレクトリ構造・ファイル整理（shared 振り分け実施 + src/ 解消）
├── T1-2: BFF共有型・Zodスキーマ作成（front_bff_shared）
├── T1-3: ViewModel型定義（features/types/）
└── T1-4: コンポーネント層整理（公開窓口ファイル最小化・molecules/organisms 振り分け）
```

---

## T1-1: ディレクトリ構造・ファイル整理

T0-4 の「shared 振り分けリスト」に従い、**TODO コメントを記録する**。
**実際のファイル移動は行わない。**

> **Phase 1 での作業**: shared 昇格予定ファイルに TODO コメントを追加し、移動計画を記録する
> **Phase 6 以降での作業**: 実際に複数機能から参照される必要が生じた時点で移動を実施する

### ステップ 1: LV3 内 src/ 二重化の解消

`src/` サブフォルダと LV3 直下の両方に同じファイルが存在する場合、直下に統合して `src/` を削除する。

```bash
# 例: src/ 内のファイルを直下へ移動し、src/ を削除
mv LV3/src/types/foo.types.ts LV3/types/foo.types.ts
rm -rf LV3/src/
```

設計書に定義されていないフォルダ（`src/`、`tmp/`、`guidelines/` 等）はすべて削除する。
**必ず中身を先に移動してから削除すること。**

> 移動先が不明な場合は `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/00.ディレクトリ構成.md` を参照し、
> それでも判断できなければ [Gate: ESCALATE] で確認する。

### ステップ 2: shared 振り分けリストの TODO 記録

T0-4 で決定したファイルを将来 shared へ移動するため、TODO として記録する。
**Phase 1 では実際の移動は行わない。**

#### 2-1: TODO コメントを追加する

T0-4 で shared へ昇格予定と判断されたファイルの先頭に TODO コメントを追加する。

```typescript
// TODO [SHARED-MIGRATION]: 将来 product/frontend/src/shared/utils/{domain}/ へ移動予定
// 理由: 複数機能から参照される共通ユーティリティ
// 移動先: src/shared/utils/{domain}/patient.utils.ts

export function formatPatientName(patient: Patient): string {
  // ...
}
```

**TODO コメントの形式**:
```
// TODO [SHARED-MIGRATION]: 将来 {移動先パス} へ移動予定
// 理由: {昇格理由}
// 移動先: {具体的なパス}
```

#### 2-2: 昇格対象ファイル一覧の記録

`.steering/{YYYYMMDD-機能名}/shared-migration-plan.md` に昇格予定ファイルのリストを記録する。

```markdown
# Shared 昇格計画

## 昇格予定ファイル

| カテゴリ | 現在のパス | 移動先パス | 理由 |
|---|---|---|---|
| utils | features/diagnosis/exam/LV3/utils/patient.utils.ts | src/shared/utils/diagnosis/patient.utils.ts | 複数機能から参照 |
| types | features/diagnosis/exam/LV3/types/patient.types.ts | src/shared/types/diagnosis/patient.types.ts | 共通型定義 |
| hooks | features/diagnosis/exam/LV3/hooks/usePatientData.ts | src/shared/hooks/diagnosis/usePatientData.ts | 共通データ取得 |

## 実施時期

Phase 6 完了後、または複数機能で実際に参照が発生した時点で実施する。
```

> **注意**: Phase 1 では移動を実施せず、記録のみ行う。実際の移動は Phase 6 以降、
> または複数機能から実際に参照される必要が生じた時点で実施する。

### ステップ 3: 配置確認

移動後、以下を確認する。

```bash
# shared 配下の新規ディレクトリを確認
find product/frontend/src/shared -type d | sort

# import エラーがないか確認（TypeScript コンパイルチェック）
cd product/frontend && npx tsc --noEmit 2>&1 | head -30
```

---

## T1-2: BFF共有型・Zodスキーマ作成（front_bff_shared）

`front_bff_shared/features/{LV1}/{LV2}/{LV3}/` 配下に以下を作成する。

```
front_bff_shared/features/{LV1}/{LV2}/{LV3}/
├── types/
│   └── {機能名}.types.ts    # Request型・Response型を1ファイルで管理
└── schemas/
    └── {機能名}.schema.ts   # Zodスキーマ定義
```

**参照**: `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/03_TypeScript型管理/TypeScript型管理規約.md`
- `## ディレクトリ構造と配置ルール` > `### front_bff_sharedの構成`

**参照**: `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/03_TypeScript型管理/Zodスキーマ基盤設計.md`
- `## Zodスキーマの定義パターン`

**命名規則**:

| 対象 | パターン | 例 |
|------|---------|-----|
| スキーマ変数 | `{機能名}{操作}Schema` | `patientUpdateSchema` |
| Input型 | `{機能名}{操作}Input` | `PatientUpdateInput` |
| Response型 | `{機能名}{操作}Response` | `PatientUpdateResponse` |

---

## T1-3: ViewModel型定義（features/types/）

画面固有の UI 表示用型を `features/{LV1}/{LV2}/{LV3}/types/` 配下に定義する。

**ファイル命名**: `{機能名}.types.ts`

**参照**: `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/03_TypeScript型管理/TypeScript型管理規約.md`
- `### 配置判断基準` > `#### プロジェクト内typesに配置すべき型`

### 定数定義後の既存ファイルへの適用確認（必須）

`types/` に定数（例: `CANVAS_SIZE`、`MAX_ITEMS` 等）を定義した場合、
**既存コンポーネント内のハードコード値を定数に置き換えること**。
定義するだけでは機能しない——実際に参照しているファイルが定数を使うまで修正は完了していない。

```bash
# 例: CANVAS_SIZE = 600 を定義した場合、旧ハードコード値 400 が残っていないか確認
grep -rn "400\b" features/{LV1}/{LV2}/{LV3}/components --include="*.tsx" --include="*.ts"

# 定数が正しく import されているか確認
grep -rn "CANVAS_SIZE" features/{LV1}/{LV2}/{LV3}/components --include="*.tsx" --include="*.ts"
```

| チェック | 確認方法 |
|---|---|
| 旧ハードコード値が残っていない | `grep` で旧値を検索し 0 件であることを確認 |
| 定数が import されて使われている | `grep` で定数名を検索し全参照箇所に存在することを確認 |

> **⚠️ 漏れが起きやすいパターン**: 同名コンポーネントが `components/` 直下と `components/organisms/` の両方に存在する場合、片方だけ更新して終わりにしてしまう。`find` で同名ファイルの重複を確認してから修正すること。
> ```bash
> # 同名ファイルの重複確認
> find features/{LV1}/{LV2}/{LV3}/components -name "{コンポーネント名}.tsx" | sort
> ```

---

---

## T1-4: コンポーネント層整理（公開窓口ファイル最小化）

Phase 0（T0-1）で確定したコンポーネント分割計画に従い、既存ファイルを molecules/organisms に配置し、
公開窓口ファイル（`{機能コード}.tsx`）を最小化する。

**目的**: `REC002.tsx` のような公開窓口ファイルは 1 つの Organism を返すだけにする。
ロジックは Organism 内に集約し、Page 層はルーティングの接点のみを担当する。

### 手順

#### ステップ 1: 既存コンポーネントの配置確認

`components/` 直下に Organism 相当・Molecule 相当のファイルが残っていないか確認する。

```bash
# components/ 直下の .tsx ファイルを列挙（molecules/ organisms/ 直下を除く）
find components/ -maxdepth 1 -name "*.tsx" | sort
```

#### ステップ 2: molecules/ へ移動するファイルの特定

Molecule 基準（参考）：
- 2〜3 個の Atom を組み合わせた UI パーツ
- 単体で機能完結しない（Organism から受け取る props に依存する）
- 例: ColorPickerPanel, ToolSelector, PenSizeSlider, ImageUploadButton, TemplateItem

```bash
# 移動例
cp components/ColorPicker.tsx components/molecules/ColorPickerPanel.tsx
```

#### ステップ 3: organisms/ へ移動するファイルの特定

Organism 基準（参考）：
- 複数 Molecule + 独自ロジックを持つ機能の塊
- Canvas 管理、フォーム管理、パネル管理など完結した責務を持つ
- 例: DrawingCanvas, TemplatePanel, SchemaCreationOrganism

```bash
# 移動例
cp components/DrawingCanvas.tsx components/organisms/DrawingCanvas.tsx
```

#### ステップ 4: assets/ への移動

静的データファイル（SVG コンポーネントマップ、テンプレートデータ等）を assets/ に移動する。
`data/` や `components/` に混在している場合は必ず assets/ に集約する。

```bash
# 移動例
cp components/MedicalTemplates.tsx assets/MedicalTemplates.tsx
```

#### ステップ 5: SchemaCreationOrganism（または相当する統合 Organism）の作成

公開窓口ファイルが参照するすべてのロジックを 1 つの Organism に集約する。
以下をこの Organism に移動する：
- useState による状態（ツール選択、色、ブラシサイズ、テンプレート選択 等）
- イベントハンドラー（handleUndo, handleClear, handleFlipHorizontal 等）
- useEffect（ペースト処理 等）
- JSX レイアウト全体

```tsx
// components/organisms/SchemaCreationOrganism.tsx
export default function SchemaCreationOrganism({ onSave, onCancel }: Props) {
  // ← 旧 REC002Page の全ロジック
  return ( /* レイアウト全体 */ );
}
```

#### ステップ 6: 公開窓口ファイルの最小化

`{機能コード}.tsx`（例: `REC002.tsx`）は以下の最小形式にする。

```tsx
"use client";
import SchemaCreationOrganism from './components/organisms/SchemaCreationOrganism';

interface REC002PageProps {
  onSave?: (imageData: string) => void;
  onCancel?: () => void;
}

export default function REC002Page({ onSave, onCancel }: REC002PageProps = {}) {
  return <SchemaCreationOrganism onSave={onSave} onCancel={onCancel} />;
}
```

#### ステップ 7: インポートパスの更新

移動後、各ファイル内の import パスを更新する。

```bash
# 参照先が変わったファイルを検索
grep -rn "from.*ColorPicker" src/features --include="*.tsx" --include="*.ts"
```

#### ステップ 8: TypeScript コンパイル確認

```bash
npx tsc --noEmit 2>&1 | grep "{機能コード}" | head -20
```

エラーが 0 件であることを確認してから次のステップへ進む。

### 注意事項

- 旧ファイル（`components/ColorPicker.tsx` 等）は削除しない。Phase 5 で正式に整理する。
  ただし REC002.tsx 等の公開窓口ファイルからの直接参照は削除し、新パスに統一する。
- SCOPE-OUT タグは移動先のファイルでも維持する。

---

## Phase 1 完了後: ディレクトリ構造チェック

Phase 1（T1-1〜T1-3）が全て `[x]` になったら、次のフェーズへ進む前に
**`Skill('implement-phase1-test')`** を起動してディレクトリ構造を検証する。

このスキルは以下を行う：
1. `.claude/commands/structure_2.md` の期待構造と実ファイルシステムを照合
2. **不足ディレクトリ** を列挙し、`.gitkeep` 付きで作成するか確認
3. **余剰ファイル・ディレクトリ** を列挙（削除はしない、確認のみ）

チェック通過（不足0件 または スキップ確認済み）になってから Phase 2 へ進む。
