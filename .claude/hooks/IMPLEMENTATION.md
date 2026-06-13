# /omc-teams 3 Hooks実装ドキュメント

## 概要

`/omc-teams 3` コマンド用のhooksシステムを `.claude/` 配下に実装しました。

このシステムは、既存の `.claude/plugins/everything-claude-code` の hooks 仕組みを参考に、プロジェクト固有のワークフローを実現します。

## 作成ファイル

### 1. Hooks設定
- **ファイル**: `.claude/hooks.json`
- **役割**: beforeSubmitPrompt イベントで omc-trigger.js を実行
- **トリガー**: ユーザーが `/omc-teams 3` を入力したとき

### 2. Hook実装
- **ファイル**: `.claude/hooks/omc-trigger.js`
- **役割**: 
  - `/omc-teams 3` コマンドを検出
  - 要件ファイルのパスを構築
  - ワークフロー情報をプロンプトに注入
  - 3エージェント並列実行の準備情報を追加

### 3. コマンド定義
- **ファイル**: `.claude/commands/omc.md`
- **役割**: `/omc-teams 3` コマンドの完全なドキュメント
- **内容**:
  - 用途と前提条件
  - 実行方法
  - 4フェーズのワークフロー
  - エラー処理
  - 参考資料へのリンク

### 4. ドキュメント
- **ファイル**: `.claude/hooks/README.md`
- **役割**: hooks開発ガイドライン
- **内容**:
  - hooks一覧
  - 開発ガイドライン
  - エラーハンドリング
  - パフォーマンスガイド
  - デバッグ方法

### 5. CLAUDE.md更新
- **変更箇所**:
  - コマンド一覧に `/omc-teams 3` を追加
  - ディレクトリ構造に `hooks/` セクションを追加
  - サブエージェントカタログに `app-frontend-detail-design-drafter` を追加

## アーキテクチャ

```
┌─────────────────┐
│  ユーザー入力    │
│  /omc-teams 3   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  beforeSubmitPrompt イベント     │
│  (Claude Code harness)          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  omc-trigger.js                 │
│  - コマンド検出                  │
│  - 要件ファイルパス構築          │
│  - ワークフロー情報注入          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  修正されたプロンプト             │
│  + ワークフロー情報               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  メインエージェント              │
│  - commands/design.md 参照       │
│  - 要件ファイル読み込み          │
│  - 3エージェント並列起動         │
└─────────────────────────────────┘
```

## ワークフロー詳細

### フェーズ1: 要件収集
指定ディレクトリから以下を読み込む:
```
docs/01_アプリ/フロントエンド/検査結果管理/結果入力/
├── RES002.pdf                         (画面仕様書)
├── design-RES002_結果入力.md          (機能設計書)
├── design_detail-RES002_結果入力.md   (詳細設計書)
└── 画面遷移図.drawio.svg               (画面遷移図)
```

### フェーズ2: 設計ゲート判定
- `.claude/commands/design.md` の判定基準に従う
- 必要条件が満たされているかチェック

### フェーズ3: 3エージェント並列起動

#### Agent 1: spec-cross-checker (調査)
```yaml
エージェント: .claude/agents/spec-cross-checker.md
入力: design-RES002_結果入力.md
処理: 既存仕様との重複・競合・依存関係をチェック
出力: 競合リスト、依存関係マップ
```

#### Agent 2: frontend-detail-design-drafter (作成)
```yaml
エージェント: .claude/agents/app-frontend-detail-design-drafter.md
入力: 全要件ファイル
処理: テンプレートに従って詳細設計書ドラフトを作成
出力: docs/02_アプリ基盤/01_フロントエンド・BFF/02_詳細設計書/
      フロントエンド個別詳細設計書_【RES002】結果入力.md
```

#### Agent 3: design-validator (検証)
```yaml
エージェント: .claude/agents/design-validator.md
入力: design_detail-RES002_結果入力.md
処理: 設計書のPRDカバレッジ、core/整合性を検証
出力: 検証レポート（品質スコア、指摘事項リスト）
```

### フェーズ4: 統合判断
```
Gate: CONFIRM
header: "3agents実行結果"
question: |
  ✅ spec-cross-checker: {競合数}件の競合を検出
  ✅ frontend-detail-design-drafter: ドラフト作成完了
  ✅ design-validator: 品質スコア {スコア}/100
  
  次のステップは?
options:
  - "ドラフトを承認して次フェーズへ (推奨)"
  - "指摘事項を修正する"
  - "要件から見直す"
```

## 参考にした既存実装

### everything-claude-code hooks
```
.claude/plugins/everything-claude-code/
├── .cursor/
│   ├── hooks.json              ← hooks設定
│   └── hooks/
│       ├── adapter.js          ← 共通ユーティリティ
│       ├── before-submit-prompt.js  ← プロンプト検証
│       ├── session-start.js    ← セッション開始時処理
│       └── ...その他多数
└── schemas/
    └── hooks.schema.json       ← hooks設定のスキーマ
```

## テスト方法

### 手動テスト
```bash
# hookを直接テスト
echo '{"prompt":"/omc-teams 3 \"RES002の実装をしたい\""}' | node .claude/hooks/omc-trigger.js

# 期待される出力: ワークフロー情報が注入されたJSON
```

### 実行テスト
1. Claude Code で新しいセッションを開始
2. `/omc-teams 3 "RES002の実装をしたい"` を入力
3. ワークフロー情報が表示されることを確認
4. 3エージェントが並列起動されることを確認

## エラーハンドリング

```javascript
try {
  // コマンド検出 & ワークフロー注入
} catch (error) {
  // エラーログ出力
  console.error('[omc-trigger] Error:', error.message);
  
  // 入力をそのまま返す（フックをブロックしない）
  process.stdout.write(raw);
  process.exit(0);  // 必ず成功で終了
}
```

**重要**: すべてのhooksは `exit 0` で終了し、エラー時もフックがブロックされないようにする。

## 今後の拡張

### 追加可能なhooks
- `afterShellExecution`: エージェント実行後の結果集約
- `sessionEnd`: セッション終了時の進捗保存
- `beforeFileEdit`: 設計書編集前の検証

### 追加可能なコマンド
- `/omc status`: 現在の進捗状態を表示
- `/omc resume`: 中断したワークフローを再開
- `/omc validate`: 現在の設計書を検証

## 関連ファイル

| ファイル | 説明 |
|---------|------|
| `.claude/CLAUDE.md` | プロジェクトエントリーポイント |
| `.claude/commands/design.md` | 設計フェーズのゲート定義 |
| `.claude/agents/app-frontend-detail-design-drafter.md` | 詳細設計書作成エージェント |
| `docs/01_アプリ/フロントエンド/検査結果管理/結果入力/` | 要件ファイル格納ディレクトリ |

## 参考資料

- [Everything Claude Code hooks](../.claude/plugins/everything-claude-code/.cursor/hooks/)
- [Hook開発ガイド](README.md)
- [コマンド定義](../commands/omc.md)
- [CLAUDE.md](../CLAUDE.md)
