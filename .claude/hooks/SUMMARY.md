# /omc-teams 3 Hooks実装 - サマリー

## ✅ 実装完了

`.claude/` 配下に `/omc-teams 3` コマンド用のhooksシステムを実装しました。

## 📁 作成ファイル一覧

```
.claude/
├── hooks.json                        ← hooks設定（beforeSubmitPrompt）
├── commands/omc.md                   ← /omc-teams 3 コマンド定義
├── hooks/
│   ├── omc-trigger.js               ← コマンド検出hook（実行ファイル）
│   ├── README.md                    ← hooks開発ガイド
│   ├── IMPLEMENTATION.md            ← 実装詳細ドキュメント
│   └── SUMMARY.md                   ← このファイル
└── CLAUDE.md                        ← 更新（コマンド追加、ディレクトリ構造更新）
```

## 🎯 機能

### 1. コマンド検出
ユーザーが `/omc-teams 3 "RES001の実装..."` のように入力すると、`beforeSubmitPrompt` イベントで自動的に検出されます。

対応するスクリーンコード例:
- `/omc-teams 3 "RES001の実装をしたい"`
- `/omc-teams 3 "RES002の画面を修正したい"`
- `/omc-teams 3 "REC001 カルテ画面の実装"`

### 2. ワークフロー情報注入
検出後、以下の情報がプロンプトに自動追加されます：
- 📂 要件ファイルのパス
- 🔄 4フェーズのワークフロー説明
- 🤖 3エージェントの役割と入出力
- 📋 設計ゲート参照先

### 3. 3エージェント並列実行サポート
以下のエージェントが並列起動される想定：
- `spec-cross-checker` → 既存仕様との競合チェック
- `frontend-detail-design-drafter` → 詳細設計書ドラフト作成
- `design-validator` → 設計書品質検証

## 🔧 使用方法

### 基本的な使い方
```bash
# Claude Code セッションで入力
/omc-teams 3 "RES001の実装をしたい"
/omc-teams 3 "REC001 カルテ画面の修正"
```

### 期待される動作
1. hookがコマンドを検出
2. ワークフロー情報がプロンプトに注入される
3. 要件ファイル群が読み込まれる
4. `commands/design.md` に従って設計ゲート判定
5. 3エージェントが並列起動される
6. 結果が統合され、次のステップが提案される

## 📋 要件ファイル

reference.md に登録されたスクリーンコードに対応するファイルが自動参照されます:

```
例: RES002
  docs/01_アプリ/フロントエンド/検査結果管理/結果入力/RES002.md
  docs/01_アプリ/フロントエンド/検査結果管理/結果入力/design-RES002_結果入力.md
  docs/01_アプリ/フロントエンド/検査結果管理/結果入力/design_detail-RES002_結果入力.md
```

## ✨ 特徴

### 1. 既存実装を参考
`.claude/plugins/everything-claude-code` のhooks仕組みを参考に実装しました。

### 2. エラーハンドリング
- すべてのhooksは `exit 0` で終了
- エラー時も入力をそのまま返す（ブロックしない）
- stderr にエラーログを出力

### 3. テスト済み
```bash
✅ PASS: Hook detected /omc-teams 3 command and injected workflow
✅ PASS: Normal prompts pass through unchanged
✅ Found: All required files
🎉 All tests passed!
```

## 🚀 次のステップ

### 1. 実行テスト
```bash
# Claude Code で実行
/omc-teams 3 "RES001の実装をしたい"
```

### 2. 要件ファイルの確認
```bash
ls -lh docs/01_アプリ/フロントエンド/検査結果管理/結果入力/
```

### 3. エージェント定義の確認
```bash
cat .claude/agents/app-frontend-detail-design-drafter.md
```

## 📚 ドキュメント

| ファイル | 説明 |
|---------|------|
| [README.md](README.md) | hooks開発ガイドライン |
| [IMPLEMENTATION.md](IMPLEMENTATION.md) | 実装詳細・アーキテクチャ |
| [omc.md](../commands/omc.md) | `/omc-teams 3` コマンド完全ドキュメント |
| [CLAUDE.md](../CLAUDE.md) | プロジェクトエントリーポイント |

## 🔍 トラブルシューティング

### Hook が動作しない場合
```bash
# hook を手動テスト
echo '{"prompt":"/omc-teams 3 \"RES001の実装をしたい\""}' | node .claude/hooks/omc-trigger.js

# hooks.json の確認
cat .claude/hooks.json

# 実行権限の確認
ls -l .claude/hooks/omc-trigger.js
```

### ファイルが見つからない場合
```bash
# 要件ファイルの存在確認
find docs/01_アプリ/フロントエンド/検査結果管理/結果入力 -type f

# エージェント定義の存在確認
ls -l .claude/agents/app-frontend-detail-design-drafter.md
```

## 🎓 参考

- **Everything Claude Code hooks**: [.claude/plugins/everything-claude-code/.cursor/hooks/](../plugins/everything-claude-code/.cursor/hooks/)
- **commands/design.md**: 設計フェーズのゲート定義
- **CLAUDE.md**: プロジェクト全体のルールとフロー

---

**作成日**: 2026-04-15  
**更新日**: 2026-04-17  
**バージョン**: 1.1.0  
**ステータス**: ✅ 実装完了・テスト済み
