# 同期実装エージェントカタログ（synchronizer フェーズ専用）

メインエージェントは以下のサブエージェントに作業を委譲する。

---

## 調査（読み取り専用）

| エージェント | 定義 | 用途 |
|---|---|---|
| **codebase-researcher** | `.claude/agents/codebase-researcher.md` | 既存コードの構造・パターン・再利用可能モジュールを調査 |
| **spec-cross-checker** | `.claude/agents/spec-cross-checker.md` | 既存仕様との重複・競合・依存関係をチェック |
| **impact-analyzer** | `.claude/agents/impact-analyzer.md` | 変更による影響範囲を分析 |

---

## 作成（ファイルを書き出す）

| エージェント | 定義 | 用途 |
|---|---|---|
| **test-planner** | `.claude/agents/test-planner.md` | PRD受入条件からテストケース一覧を生成（synchronizer Phase 0 完了後） |

---

## 検証（読み取り専用）

| エージェント | 定義 | 用途 |
|---|---|---|
| **impl-validator** | `.claude/agents/impl-validator.md` | 実装と仕様の整合性を検証（Phase 8 整合性チェック） |
| **consistency-checker** | `.claude/agents/consistency-checker.md` | state.md / INDEX.md / .steering/ の整合性を検証（synchronizer 完了時） |

---

## 実装支援

| エージェント | 定義 | 用途 |
|---|---|---|
| **impl-reviewer** | `.claude/agents/app-impl-reviewer.md` | 実装コードのレビュー・`review-missing-perspectives.md` 更新（コード変更なし） |
| **impl-simplifier** | `.claude/agents/app-impl-simplifier.md` | テスト・レビューPASS後に変更ファイルをシンプル化 |
| **server-test-agent** | `.claude/agents/app-server-test-agent.md` | localhost:3000 のフロントエンドサーバーテスト実行・結果レポート |

---

## エージェント使用タイミング

### Phase 0: 準備（スコープ確定・設計）

- **使用しない** — Phase 0 は `Skill('synchronizer-phase0')` が全て実行する

### Phase 1〜7: 型定義・各層実装

- **codebase-researcher** — 既存の型定義・Client 実装パターンを調査するとき
- **spec-cross-checker** — 同じ API を呼び出す他機能の実装を確認するとき
- **impact-analyzer** — 共有型（front_bff_shared）の変更影響を分析するとき

### Phase 8: 整合性チェック

- **impl-validator** — 設計書の API 一覧と実装が全て対応しているかを検証するとき
- **consistency-checker** — state.md / INDEX.md / .steering/ の整合性を検証するとき

### Phase 9: 基盤要素実装

- **codebase-researcher** — 認証・通知・監査ログの既存実装を調査するとき

### 実装完了後

- **impl-reviewer** — 全実装ファイルのレビュー・品質改善提案
- **impl-simplifier** — レビューPASS後のコード簡潔化
- **server-test-agent** — localhost:3000 でのフロントエンドサーバーテスト実行

---

## 使い分けの原則

### メインエージェント（直接実装）

- **型定義** — Phase 1 の全タスク（S1-1〜S1-5）
- **各層実装** — Phase 2〜7 の Controller / Service / Client / API / Repository 実装
- **基盤実装** — Phase 9 の認証・通知・監査ログ実装

### サブエージェント（調査・検証）

- **調査が必要なとき** — codebase-researcher / spec-cross-checker / impact-analyzer
- **整合性確認が必要なとき** — impl-validator / consistency-checker
- **品質改善が必要なとき** — impl-reviewer / impl-simplifier

---

## 禁止事項

- **Phase 0 は Skill('synchronizer-phase0') のみを使用する** — サブエージェントに委譲しない
- **実装タスク（S1-1〜S9-6）はメインエージェントが直接行う** — サブエージェントに委譲しない
- **サブエージェントを連続起動しない** — 調査 → 判断 → 実装 のサイクルで1つずつ使う

---

## 参照

詳細な実装ルールは以下を参照:

- `.claude/commands/synchronizer.md` — 全フェーズのワークフロー
- `.claude/rules/cross-layer-rules.md` — 3層横断の禁止事項
- `.claude/commands/bff_structure.md` — BFF実装の構造ルール
- `.claude/skills/synchronizer-phase0/SKILL.md` — Phase 0 の詳細手順
