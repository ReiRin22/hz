# エージェント・スキル 命名規則と運用ルール

スキル（`.claude/skills/`）とエージェント（`.claude/agents/`）の作成・配置・運用に関する規約。

---

## 1. 用語の整理

| 種別 | 説明 | 呼び出し元 |
|---|---|---|
| **スキル** | フェーズ知識・ワークフロー定義・品質基準のパック | コマンド（`.claude/commands/`）または CLAUDE.md |
| **エージェント** | 調査・作成・検証を実行するサブエージェント定義 | メインエージェントがサブエージェントとして起動 |

---

## 2. ディレクトリとスコープ

### 共通構造

```
.claude/
  skills/
    {scope}-{skill-name}/
      SKILL.md             ← エントリポイント（必須）
      {supplement}.md      ← 補足資料（任意）
  agents/
    {scope}-{agent-name}.md
```

### スコーププレフィックス

| プレフィックス | 用途 | 例 |
|---|---|---|
| `common-` | 全フェーズ・全ドメインで参照するもの | `common-decision-gate` |
| `app-` | アプリ機能ドメイン固有のもの | （将来追加） |
| `arch-` | インフラ基盤設計フェーズ固有のもの | `arch-poc`, `arch-poc-evaluator.md` |
| `samples-` | 汎用テンプレート・再利用可能な汎用定義 | `samples-prd-drafter.md`, `samples-design-writing` |

---

## 3. ファイル命名規則

### 共通ルール

- **kebab-case**（小文字 + ハイフン区切り）を使用する
- ファイル名に日本語を含めてはならない（MUST NOT）
- 名前は「何をするか」を表す動詞・名詞で構成する

### エージェント: `{target}-{role}.md` または `{role}.md`

| ロール語 | 意味 | 例 |
|---|---|---|
| `researcher` | 既存コード・仕様を調査する | `codebase-researcher.md` |
| `checker` | 競合・整合性を確認する | `spec-cross-checker.md`, `consistency-checker.md` |
| `analyzer` | 影響範囲・構造を分析する | `impact-analyzer.md` |
| `extractor` | 特定情報を抽出・整理する | `poc-item-extractor.md` |
| `drafter` | ドキュメントのドラフトを作成する | `prd-drafter.md`, `design-drafter.md` |
| `planner` | 計画・タスクリストを作成する | `test-planner.md` |
| `reviewer` | 品質・完成度をレビューする | `spec-reviewer.md` |
| `validator` | 仕様との整合性を検証する | `design-validator.md`, `impl-validator.md` |
| `evaluator` | 合否基準と実測値を照合する | `poc-evaluator.md` |

### スキル: `{function-name}/SKILL.md`

スキル名はそのスキルが提供する「知識・フロー」を表す名詞または動名詞にする。

```
decision-gate/   ← 判断委譲の作法
poc/             ← PoC実施ワークフロー
prd-writing/     ← PRD品質基準
design-writing/  ← 設計書品質基準
steering/        ← 作業誘導の品質基準
```

補足資料ファイルは機能を表す名前にする（`QUALITY.md` ではなく `poc-quality.md`）。

---

## 4. ファイルフォーマット

### エージェント（`{name}.md`）

```markdown
# {表示名} サブエージェント

{エージェントが何をするかの1行説明}

## 役割

- {調査（読み取り専用）/ 作成 / 検証（読み取り専用）} のいずれかを明示
- {責務を箇条書きで記載}

## 起動方法

Task tool:
  subagent_type: "general-purpose"
  description: "{タスク説明（英語推奨）}"
  prompt: 下記のプロンプトテンプレート

## プロンプトテンプレート

{プロンプト本文。可変部分は {placeholder} で表す}

## 出力  ← 省略可（出力が複数形式の場合は記載する）

- {出力先ファイル・形式の説明}
```

**フォーマット規則:**
- 役割カテゴリは「調査」「作成」「検証」の3種のみ。新カテゴリを勝手に増やさない
- プロンプトテンプレートはコードブロック（` ``` `）で囲む
- 出力先ファイルパスはプレースホルダーを使って明示する

### スキル（`SKILL.md`）

```markdown
---
name: {スキル名（フォルダ名と一致させる）}
description: {1行説明。コマンドやCLAUDE.mdから参照する際の識別テキスト}
allowed-tools: {許可ツールのカンマ区切りリスト}   ← 省略可
argument-hint: "{引数の説明（例: target）}"         ← user-invocable の場合は必須
user-invocable: true                               ← ユーザーが /name で直接呼ぶ場合のみ追記
---

{スキルの目的・概要}

## いつ読むか  ← 必須

- {このスキルをロードする条件・タイミング}

{本文: ワークフロー / 品質基準 / 作法}
```

**フォーマット規則:**
- `name` は対応フォルダ名と一致させる（検索性確保）
- `allowed-tools` は過不足なく指定する。不要なツールを含めない
- `user-invocable: true` を付ける場合は CLAUDE.md のコマンド表にも記載する

---

## 5. 登録ルール

### エージェント → CLAUDE.md のサブエージェントカタログ

新しいエージェントを作成したら必ず CLAUDE.md の「サブエージェントカタログ」テーブルに追記する。

```
| **{name}** | `.claude/agents/{scope}-{name}.md` | {1行説明} |
```

カテゴリ（調査・作成・検証）の正しいテーブルに追加すること。

### スキル → 参照元コマンドへの記載

スキルを作成したら、参照するコマンドファイル（`.claude/commands/{command}.md`）に `Skill('{name}')` 参照を追記する。  
`user-invocable: true` のスキルは CLAUDE.md のコマンド表にも追記する。

---

## 6. 追加・変更・削除のルール

| 操作 | ルール |
|---|---|
| **追加** | フォーマット規則を満たしてから登録する。スコーププレフィックスを新設しない（既存4種で収める） |
| **変更** | プロンプトテンプレートを変更した場合、変更理由を `docs/meta/framework-retro.md` に記録する |
| **削除** | CLAUDE.md カタログ・参照元コマンドからの参照も同時に削除する。未使用エージェントを放置しない |
| **サンプル昇格** | `samples-` プレフィックスの汎用定義を特定ドメインに特化させる場合、元ファイルを残しつつ特化版を対象スコーププレフィックスで作成する |

---

## 7. 禁止事項

- スコーププレフィックスを勝手に追加しない（必要な場合はPMと合意の上で追加する）
- エージェントに `allowed-tools` フロントマターを付けない（エージェント定義はプロンプトテンプレートで制御する）
- 役割が「調査」「検証」のエージェントはファイルの書き込みをプロンプトに含めない
- 1エージェントファイルに複数の独立したロールを詰め込まない
