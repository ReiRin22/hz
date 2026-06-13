---
description: Storybook 実装計画書（RES002-F0 フォーマット）を生成するコマンド
argument-hint: "{story-id}/{Fxx_機能名}  例: RES002/F1_受診者一覧"
---

# /plan {story-id}/{Fxx_機能名}

Storybook 実装計画書を自動生成し、1機能内で実装できない箇所を IMPL-NOTES.md に記録する。

**メインエージェントの役割は「判断」のみ。調査・作成はサブエージェントに委譲する。**
**人間への判断委譲は `Skill('common-decision-gate')` のプロトコルに従う。**

---

## 前提条件

- `/design` で機能設計書が作成済みであること、**もしくは** `product/frontend/.storybook/` 配下に Excel ファイル（`.xlsx`）か PDF（`.pdf`）が存在すること（両方でも可）
- `product/frontend/.storybook/{story-id}.md` が存在すること

---

## セッション開始時（毎回やること）

1. `CLAUDE.md` を読む
2. `.claude/rules/impl-agents.md` を読んで利用可能なエージェントを把握する
3. `Skill('common-decision-gate')` を意識する

---

## Phase0: プレチェック

以下のファイルが存在するか確認する。不足している場合はユーザーに報告して中断する。

| ファイル | 用途 |
|---|---|
| `product/frontend/.storybook/{story-id}.md` | ストーリーブック定義（スコープの根拠） |
| `docs/01_アプリ/{domain}/{Fxx_機能名}/` または `product/frontend/.storybook/` 配下の `.xlsx` / `.pdf` | 機能設計書（レイヤー別タスクの根拠。いずれか1つ以上あれば可） |
| `.steering/IMPL-NOTES.md` | 残留未確認事項の転記先（存在しなければ drafter が新規作成） |
| `.claude/rules/cross-layer-rules.md` | 遵守ルールチェックの根拠 |
| `.claude/rules/test-rules.md` | 遵守ルールチェックの根拠 |
| `.claude/review-missing-perspectives.md` | 遵守ルールチェックの根拠 |

---

## Phase1: 並列調査

以下を**並列で**起動し、結果を `.steering/YYYYMMDD-{story-id}-{Fxx}/` に書き出す。

| エージェント | 出力ファイル | 調査観点 |
|---|---|---|
| **codebase-researcher** | `research-codebase.md` | テスト命名規約・axiosClient設定・既存型定義・Zustandキー・features配下命名・既存ルートパス・既存エラーコード |
| **spec-cross-checker** | `research-cross-check.md` | cross-layer-rules・test-rules・review-missing-perspectives に対する命令違反・整合性不整合の潜在的リスク |

両ファイルが書き出されてから Phase2 へ進む。

---

## Phase2: スコープ確認ゲート

調査結果を踏まえ、「含める/含めない」表をユーザーに提示する。

**[Gate: SCOPE]**
```yaml
header: "スコープ確認"
question: |
  調査結果をもとに {story-id}/{Fxx_機能名} の実装計画書スコープを提示します。

  ### 含める（{Fxx}）
  {調査結果から導出した実装対象の一覧}

  ### 含めない（据え置き・TODO コメントで明示）
  {調査結果から導出した対象外の一覧}

  このスコープで計画書生成に進んでよいですか？
options:
  - "このスコープでOK → Phase3 へ進む (推奨)"
  - "含める項目を変更したい → スコープを修正してから再確認"
  - "含めない項目を追加したい → スコープを修正してから再確認"
```

---

## Phase3: 計画書生成

Phase2 で確定したスコープを持って `app-script-plan-drafter` を起動する。

| 渡す情報 | 内容 |
|---|---|
| story-id / Fxx_機能名 / domain | 呼び出し引数から取得 |
| `research-codebase.md` | Phase1 の codebase-researcher 出力 |
| `research-cross-check.md` | Phase1 の spec-cross-checker 出力 |
| 確定スコープ | Phase2 ゲートで承認した「含める/含めない」表 |
| 出力先パス | `product/frontend/.storybook/{story-id}-{Fxx}_plan.md` |

計画書ドラフトが書き出されてから Phase4 へ進む。

---

## Phase4: 計画書承認ゲート

**[Gate: CONFIRM]**
```yaml
header: "計画書承認"
question: |
  {出力先パス} に計画書ドラフトを生成しました。
  内容を確認してください。
options:
  - "承認する → IMPL-NOTES.md 更新へ進む (推奨)"
  - "修正指示を出す → app-script-plan-drafter を再起動して再生成 → このゲートへ戻る"
  - "スコープから見直す → Phase2 へ戻る"
```

承認後、`app-script-plan-drafter` に IMPL-NOTES.md 更新を指示する。

---

## セッション終了時（毎回やること）

CLAUDE.md の `session_progress` を更新する。どのフェーズ・どのゲートまで完了したかを明記する。

例:
```yaml
progress: "RES002/F1 Phase2 Gate:SCOPE 待ち。調査完了、スコープ確認中"
```
