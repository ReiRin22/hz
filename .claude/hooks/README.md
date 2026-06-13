# Harz Claude Code Hooks

このディレクトリはプロジェクト固有のClaude Code hooksを格納します。

## 構成

```
.claude/hooks/
├── hooks.json      # hook設定ファイル（.claude/hooks.json）
├── omc-trigger.js  # /omc-teams 3 コマンド検出hook
├── reference.md    # スクリーンコード解決辞書（グローバル定義 + コードエントリ）
└── README.md       # このファイル
```

## Hooks一覧

### omc-trigger.js

**イベント**: `beforeSubmitPrompt`
**トリガー**: ユーザーが `/omc-teams 3` を入力

**動作**:
1. プロンプトから `/omc-teams 3` コマンドとスクリーンコードを検出
2. `reference.md` から要件ファイル群・ゲート・スキル・エージェントを解決
3. 入力の「コード の {操作名}」からエージェントを選択（例: `RES002のフロント実装`）
4. 解決された情報をプロンプトに注入し、サブエージェント並列実行を指示

**エージェント選択フォーマット**: `{コード}の{操作名}` または `{コード} の {操作名}`
- 操作名が `agents:` リストの名前と一致するエージェントが選択される
- 一致しない場合は `default_agent` が使われる
- 利用可能な操作名は `reference.md` の「グローバル定義 → エージェント定義」テーブルを参照

**参照**:
- コマンド定義: [.claude/commands/omc.md](../commands/omc.md)
- スクリーンコード辞書 / グローバル定義: [reference.md](reference.md)

## Hook開発ガイドライン

### 1. エラーハンドリング
- すべてのhookは `exit 0` で終了する（ブロッキングを防ぐ）
- エラーは stderr に出力: `console.error('[hook-name] Error:', error)`

### 2. 入出力形式
- 入力: stdin から JSON を受け取る
- 出力: stdout に JSON を出力
- フォーマット:
  ```json
  {
    "prompt": "ユーザー入力",
    "content": "同上（代替キー）",
    "message": "同上（代替キー）"
  }
  ```

### 3. パフォーマンス
- 同期hookは 200ms 以内に完了すること
- 非同期hookは hooks.json で `"async": true` を設定
- タイムアウトは 30s 以内

### 4. デバッグ
```bash
# hookを手動テスト
echo '{"prompt":"/omc-teams 3"}' | node .claude/hooks/omc-trigger.js
```

## 参考

- Everything Claude Code hooks: [.claude/plugins/everything-claude-code/.cursor/hooks/](../plugins/everything-claude-code/.cursor/hooks/)
- Hook schema: [schemas/hooks.schema.json](../plugins/everything-claude-code/schemas/hooks.schema.json)
