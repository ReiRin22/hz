# Claude Code 主要機能まとめ 2026/2/6

## 1. CLAUDE.md（メモリファイル）

セッション開始時に自動で読み込まれるプロジェクトコンテキストファイル。
アーキテクチャ、コーディング規約、ビルドコマンドなどを書いておくと、毎回の説明が不要になる。

配置場所は複数あり、すべて読み込まれる（マージされる）。

| 場所 | 用途 | Git管理 |
| --- | --- | --- |
| `~/CLAUDE.md` | 全プロジェクト共通 | 対象外 |
| `~/.claude/CLAUDE.md` | 全プロジェクト共通 | 対象外 |
| `プロジェクトルート/CLAUDE.md` | チーム共有 | する |
| `.claude/CLAUDE.md` | チーム共有 | する |
| `プロジェクトルート/CLAUDE.local.md` | 個人用 | しない |
| `.claude/CLAUDE.local.md` | 個人用 | しない |

---

## 2. Slash Commands（スラッシュコマンド）

`.claude/commands/` フォルダに `.md` ファイルを配置して作成する、手動で呼び出すワークフロー。

- `/コマンド名` で実行
- `$ARGUMENTS` で引数を受け取れる
- サブフォルダも可能（`/builder/plugin` のように呼び出す）

例: `.claude/commands/test.md`

```
以下のファイルに対して包括的なテストを作成してください:
$ARGUMENTS

テスト要件:
- Jestを使用
- エッジケースを含める
```

実行: `/test MyButton`

---

## 3. Custom Agents（カスタムサブエージェント）

`.claude/agents/` フォルダに `.md` ファイルを配置して定義する、専門タスク用の子エージェント。

- `@エージェント名` で呼び出す
- `.md` ファイルの中身はサブエージェントへのシステムプロンプト
- メインエージェントとは別のコンテキストウィンドウで動作

例: `.claude/agents/reviewer.md`

```
あなたはコードレビューの専門家です。
セキュリティ、パフォーマンス、コーディング規約の観点でレビューしてください。
```

実行: `@reviewer このPRをレビューして`

---

## 4. Skills（スキル）

`.claude/skills/` フォルダに `SKILL.md` を配置。
Commandsとの最大の違いは、タスクにマッチすると自動で起動する点。

```
.claude/skills/
  frontend-design/
    SKILL.md
```

SKILL.md 内に `description` フィールドがあり、ユーザーのタスク内容とマッチすると自動的に読み込まれる。

---

## 5. Hooks（フック）

`.claude/settings.json` 内で定義する。
ツール実行の前後に確定的なスクリプトを自動実行する仕組み。

主なフックイベント:

| フック | タイミング |
| --- | --- |
| SessionStart | セッション開始時 |
| PreToolUse | ツール実行前（Edit, Bashなど） |
| PostToolUse | ツール実行後 |
| PreCompact | コンテキスト圧縮前 |
| UserPromptSubmit | プロンプト送信時 |

設定例（ファイル編集後にPrettierを自動実行）:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit",
      "hooks": [{
        "type": "command",
        "command": "npx prettier --write $CLAUDE_FILE_PATH"
      }]
    }]
  }
}
```

---

## 6. Plugins（プラグイン）

Commands, Agents, Skills, Hooks をまとめてパッケージ化し、GitHubリポジトリ経由で配布・共有する仕組み。

```
/plugin marketplace add anthropics/claude-plugins-official
```

`/plugin` コマンドの Discover タブからインストールできる。

プラグインの構造:

```
plugin-name/
  .claude-plugin/
    plugin.json
  commands/
  agents/
  skills/
  hooks/
  .mcp.json
  README.md
```

---

## 7. MCP（Model Context Protocol）

外部ツールやデータソースとの接続プロトコル。
`.mcp.json` で設定し、GitHub, Slack, DB などと連携できる。

MCP Tool Search 機能により、多数のツールがあっても必要なものだけ遅延読み込みされる。
コンテキスト使用量が10%を超えると自動で軽量インデックスに切り替わる。

---

## 8. Checkpoints（チェックポイント）

コード変更前の状態を自動保存する機能。

- `Esc` 2回押し、または `/rewind` で以前の状態に戻せる
- コード / 会話 / 両方 のいずれかを選んで復元可能
- Claudeの編集のみ対象（ユーザー編集やbashコマンドは対象外）

---

## 9. Sandbox（サンドボックス）

OSレベルでファイルシステムとネットワークを分離する機能。

- `/sandbox` で設定
- 許可されたディレクトリ・ホストのみアクセス可能
- プロンプトインジェクション対策
- 許可プロンプトが84%削減される

---

## 10. Background Tasks（バックグラウンドタスク）

devサーバーなどの長時間プロセスをバックグラウンドで実行し、他の作業をブロックしない。

---

## 11. Plan Mode

`/plan` で計画モードに切り替え。
コードを変更せずに実装計画だけを立てるモード。

---

## 12. LSP Tool

Language Server Protocol を活用したコードインテリジェンス機能。

- 定義へ移動（Go to Definition）
- 参照検索（Find References）
- ホバードキュメント

---

## 13. Claude in Chrome

Chrome拡張機能と連携して、Claude Codeからブラウザを直接操作する機能（Beta）。

---

## 14. Output Styles（出力スタイル）

`.claude/output-styles/` でClaude の応答フォーマットをカスタマイズできる。

---

## 15. Settings（設定ファイル）

`.claude/settings.json` でパーミッション、環境変数、ツール動作を設定する。

| ファイル | 用途 |
| --- | --- |
| `.claude/settings.json` | プロジェクト共有設定 |
| `.claude/settings.local.json` | 個人設定（gitignore対象） |
| `~/.claude/settings.json` | グローバル設定 |

---

## 機能の関係性

```
CLAUDE.md     ... 静的な知識・規約（常に読み込み）
Commands      ... 手動で呼び出すワークフロー（/コマンド名）
Agents        ... 専門タスクを委任するサブエージェント（@名前）
Skills        ... タスクにマッチすると自動起動するプロンプト
Hooks         ... ツール実行前後に走る確定的コード
Plugins       ... 上記すべてをパッケージ化して配布
MCP           ... 外部ツール・データソースとの接続
```