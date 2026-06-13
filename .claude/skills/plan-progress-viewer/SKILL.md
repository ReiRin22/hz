---
name: plan-progress-viewer
description: 実装計画の進捗を localhost で視覚的に確認する。writing-plan の後、インラインまたは並列実行を選択した後に使用する。
---

# 実装計画進捗ビューア

実装計画ファイル（`.steering/*/tasklist.md` や `superpowers/plans/*.md`）の進捗をブラウザでリアルタイムに表示します。

**開始時のアナウンス:** "plan-progress-viewer を起動します。ブラウザで進捗を確認できます。"

## いつ使うか

- writing-plan スキル完了後
- インラインまたは並列実行を選択した後
- 実装中に進捗を別タブで確認したい場合

## プロセス

### 1. サーバー起動の提案

実装開始前にユーザーに確認:

```
実装計画の進捗をブラウザで確認できます。localhost サーバーを起動しますか？

- 起動する（推奨）: タスクの進捗をリアルタイムで表示
- 起動しない: エディタでファイルを直接確認
```

### 2. サーバー起動

ユーザーが同意した場合、起動スクリプトを実行:

```bash
bash .claude/skills/plan-progress-viewer/scripts/start-server.sh \
  --plan-file ".steering/YYYYMMDD-機能名/tasklist.md"
```

**起動成功時の出力**:
```json
{
  "type": "server-started",
  "port": 52341,
  "url": "http://localhost:52341",
  "plan_file": ".steering/YYYYMMDD-機能名/tasklist.md"
}
```

### 3. ユーザーに通知

```
✅ 進捗ビューアを起動しました

📊 ブラウザで進捗を確認:
   http://localhost:52341

実装を開始します。タスク完了時に進捗が自動更新されます。
```

### 4. 実装中の更新

#### 手動更新（TodoWrite 未使用時）

`TodoWrite` ツールが利用できない環境では、タスク完了時に以下のスクリプトで `tasklist.md` を更新する:

```bash
bash .claude/skills/plan-progress-viewer/scripts/update-task.sh \
  .steering/YYYYMMDD-機能名/tasklist.md \
  "T1-1"
```

更新後、自動的にブラウザに反映されます:
- チェックボックス `[ ]` → `[x]` の変更を検知
- WebSocket 経由でブラウザに push
- 進捗バーとタスク一覧がリアルタイム更新

#### Edit ツールでの直接更新

または `Edit` ツールで直接チェックボックスを更新:

```
Edit(
  file_path=".steering/YYYYMMDD-機能名/tasklist.md",
  old_string="- [ ] T1-1: タスク名",
  new_string="- [x] T1-1: タスク名"
)
```

### 5. 実装完了後

すべてのタスクが完了したら:

```bash
bash .claude/skills/plan-progress-viewer/scripts/stop-server.sh
```

## サーバーの仕様

### 監視対象ファイル

以下のパターンのファイルを監視:
- `.steering/*/tasklist.md`
- `.steering/*/superpowers/plans/*.md`
- `superpowers/plans/*.md`

### 表示内容

1. **進捗サマリー**:
   - 完了タスク数 / 総タスク数
   - 進捗パーセンテージ
   - 推定残り時間（タスク完了速度から算出）

2. **Phase 別進捗**:
   - Phase 0: スコープ確定（3/5 完了）
   - Phase 1: 基盤整備（0/3 未着手）
   - ...

3. **タスク一覧**:
   - [x] 完了タスク（グレーアウト）
   - [ ] 未完了タスク（通常表示）
   - 現在実行中のタスク（ハイライト）

4. **セッション情報**:
   - 開始時刻
   - 経過時間
   - 最終更新時刻

### ポート

環境変数 `PLAN_VIEWER_PORT` で指定可能（デフォルト: ランダム 49152-65535）

### 自動停止

以下の場合に自動停止:
- 親プロセス（AI セッション）終了時
- 30 分間アクセスなし

## 統合

**実装スキルとの連携**:
- `executing-plans` — tasklist.md 更新時に自動反映
- `subagent-driven-development` — タスク完了時に自動反映
- `implementing` — Phase 完了時に自動反映

**writing-plan からの起動**:
```
writing-plan 完了
  ↓
ユーザーに実行方法を提案
  - インライン実行
  - 並列実行（別セッション）
  ↓
plan-progress-viewer 起動提案
  ↓
（同意した場合）サーバー起動
  ↓
実装開始（executing-plans / subagent-driven-development）
```

## 注意事項

- サーバーは localhost のみバインド（外部公開なし）
- ファイル変更は 1 秒ごとにポーリング
- WebSocket 接続が切れても再接続可能
- 複数の計画ファイルを同時監視可能
