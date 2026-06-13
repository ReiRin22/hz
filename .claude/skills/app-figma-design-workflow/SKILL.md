---
name: app-figma-design-workflow
description: Figma makeのTSXソースと機能検討書が揃った状態で機能設計書を作成するとき読み込む。app-figma-screen-extractor/app-design-from-figma-drafterを起動する前に必ず参照する2ステップワークフロー。
allowed-tools: Read, Write, Edit
---

# 機能設計書作成ワークフロー

機能検討書と Figma make で生成した画面ソースが揃った後、機能設計書を作成するためのワークフロー。

## いつ読むか

- 機能検討書と Figma make ソースの両方が揃ったとき
- `app-figma-screen-extractor` または `app-design-from-figma-drafter` を起動する前

---

## インプットの準備

| インプット | 内容 | 場所 |
|-----------|------|------|
| **機能検討書** | スコープ・権限・要件・決定事項 | `docs/01_アプリ/機能設計/機能検討/ORDxxx_xxx_機能検討.md` |
| **Figma make ソース** | 画面を忠実に再現した TSX コンポーネント群 | `docs/01_アプリ/機能設計/Fxx_機能名/ORDxxx/` |

Figma make ソースのフォルダ構成（例: ORD001）:

```
ORD001/
  ORD001.tsx                  ← エントリポイント（画面全体の構成）
  components/
    LeftPanel.tsx             ← 左パネル
    CenterPanel.tsx           ← 中央パネル
    RightPanel.tsx            ← 右パネル
    InjectionOrderPanel.tsx   ← 機能固有パネル
    AllergyWarningDialog.tsx  ← ダイアログ類
    ...
  src/
    data/types.ts             ← 型定義
    hooks/                    ← 状態管理ロジック
```

**ポイント**: エントリポイント（`ORDxxx.tsx`）でパネル構成を把握し、`components/` で各パネル・ダイアログの項目・ボタン配置を確認する。

---

## 機能設計書の作成（2ステップ）

TSXソースをメインエージェントに直接読ませるとトークンを大量消費するため、サブエージェントで中間ファイルに変換してから設計書を作成する。

### Step1: 画面構造サマリーの生成

`app-figma-screen-extractor` エージェントを起動して `screen-summary.md` を生成する。

```
app-figma-screen-extractor を起動してください。

- ソースフォルダ: docs/01_アプリ/機能設計/Fxx_機能名/ORDxxx/
- 出力先: docs/01_アプリ/機能設計/Fxx_機能名/screen-summary.md
```

### Step2: 機能設計書の作成

`app-design-from-figma-drafter` エージェントを起動して `{機能名}機能設計書.md` を生成する。

```
app-design-from-figma-drafter を起動してください。

- 機能検討書: docs/01_アプリ/機能設計/機能検討/ORDxxx_xxx_機能検討.md
- 画面構造サマリー: docs/01_アプリ/機能設計/Fxx_機能名/screen-summary.md
- 出力先: docs/01_アプリ/機能設計/Fxx_機能名/{機能名}機能設計書.md
```

### 外来版設計書がある場合（入院拡張系：注射・処方など）

Step2 に外来版設計書を追加で渡す。

```
app-design-from-figma-drafter を起動してください。

- 機能検討書: docs/01_アプリ/機能設計/機能検討/ORD011_注射指示入力設定_機能検討.md
- 画面構造サマリー: docs/01_アプリ/機能設計/F01_注射指示入力設定/screen-summary.md
- 出力先: docs/01_アプリ/機能設計/F01_注射指示入力設定/注射指示入力設定機能設計書.md
- 外来版設計書（フォーマット見本）: docs/01_アプリ/機能設計/個別機能設計書_注射オーダー.md
```

---

## 1機能IDごとに1フォルダ

機能IDが複数ある場合は、機能ごとに作成セッションを分ける。

```
Fxx_機能名/
  ORDxxx/              ← Figma make ソース（フォルダごと）
  {機能名}機能設計書.md  ← 機能設計書
  prd.md               ← PRD（必要な場合）
```
