# 実装エージェントカタログ（implement / fix フェーズ専用）

メインエージェントは以下のサブエージェントに作業を委譲する。

| エージェント | 定義 | 用途 |
|---|---|---|
| **impl-planner** | `.claude/agents/app-impl-planner.md` | 実装計画の立案（コード変更なし） |
| **impl-reviewer** | `.claude/agents/app-impl-reviewer.md` | 実装コードのレビュー・`review-missing-perspectives.md` 更新（コード変更なし） |
| **impl-simplifier** | `.claude/agents/app-impl-simplifier.md` | テスト・レビューPASS後に変更ファイルをシンプル化 |
| **server-test-agent** | `.claude/agents/app-server-test-agent.md` | localhost:3000 のフロントエンドサーバーテスト実行・結果レポート |
| **test-planner** | `.claude/agents/test-planner.md` | PRD受入条件からテストケース一覧を生成（implement ステップ1） |
| **consistency-checker** | `.claude/agents/consistency-checker.md` | state.md / INDEX.md / .steering/ の整合性を検証（implement 完了時） |
| **script-plan-drafter** | `.claude/agents/app-script-plan-drafter.md` | Storybook 実装計画書の自動生成と IMPL-NOTES.md 更新（/plan コマンド専用） |
