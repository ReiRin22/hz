---
name: common-pdf-to-diagram
description: Convert PDF business flow diagrams to Draw.io XML and/or Mermaid format. Use when the user wants to convert PDF diagrams to editable formats.
allowed-tools: Read, Write, Bash
user-invocable: true
argument-hint: ""
---

# PDF to Diagram Conversion Skill

PDFファイルをdraw.io XML形式またはマーメイド形式に変換します。

## いつ読むか

- ユーザーが `/pdf-to-diagram` コマンドを実行したとき
- PDF形式の業務フロー図を編集可能な形式に変換する必要があるとき

## ワークフロー

### Step 1: 対象指定

ユーザーに対象を質問：
- **フォルダ指定**: フォルダ内の全PDFを一括変換
- **ファイル指定**: 個別PDFのみを変換

### Step 2: PDFを読み取り

```bash
# Read ツールでPDF内容を直接読み取る
Read("{pdf_path}")
```

Claude CodeはPDFを直接読み取れる。テキスト抽出ツール不要。

### Step 3: draw.io XML生成

**draw.ioプラグインを使用する**：

1. PDFの内容（業務フロー）を理解する
2. draw.io XML形式で図を生成する
   - プラグインの `~/.claude/plugins/drawio/skills/drawio/SKILL.md` を参照
   - Write ツールで `.drawio` ファイルを直接作成
   - カラーパレット適用（color-palette.md参照）

**カラーパレット**:
- 開始ノード: `fillColor=#90EE90;strokeColor=#2d7600`
- 処理ノード: `fillColor=#87CEEB;strokeColor=#1971c2`
- 判断ノード: `fillColor=#FFD700;strokeColor=#d6b656` (rhombus)
- データノード: `fillColor=#F0E68C;strokeColor=#c6c189` (parallelogram)
- 終了ノード: `fillColor=#FFB6C1;strokeColor=#d6657b`

### Step 4: マーメイド形式への変換確認（オプション）

ユーザーに確認:
> "draw.io形式のファイルを生成しました。マーメイド形式にも変換しますか？"

**YES** の場合:
- 生成したdraw.io XMLを読み取り
- マーメイド構文に変換（`{}`を`""`に置換）
- 出力: `{pdf_basename}.mermaid.md`

**NO** の場合:
- draw.io形式のみで完了

## 出力ファイル

| 形式 | ファイル名 | 説明 |
|---|---|---|
| draw.io XML | `{pdf_basename}.drawio` | draw.io Desktop/VSCode/Webで編集可能 |
| マーメイド | `{pdf_basename}.mermaid.md` | GitHub/GitLabでプレビュー可能（オプション） |

## 重要な注意点

- **JSON中間ファイルは作成しない** - PDFを読み取り→直接draw.io XMLを生成
- **サブエージェントは使用しない** - メインエージェントがdraw.ioプラグインの知識を使って直接生成
- **プラグインの活用** - `~/.claude/plugins/drawio/` のXML生成ノウハウを参照

## 参照

- draw.ioプラグインスキル: `~/.claude/plugins/drawio/skills/drawio/SKILL.md`
- カラーパレット定義: `color-palette.md`
- 業務フローサンプル: `examples/flowchart-sample.md`
