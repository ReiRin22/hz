# Steering API Server

`.claude/plans/` 配下の同期スクリプトを実行する独立 API サーバー。
Next.js フロントエンドから独立して動作します。

## 起動

```bash
cd .claude/plans/api
./start.sh
```

バックグラウンドで起動し、`server.log` にログを出力します。

## 停止

```bash
cd .claude/plans/api
./stop.sh
```

## エンドポイント

### POST /sync
同期スクリプト（`sync-all.sh`）を実行

**リクエストボディ**:
```json
{
  "userName": "市川"
}
```

**レスポンス**:
```json
{
  "success": true,
  "userName": "市川",
  "output": "...",
  "error": null
}
```

**例**:
```bash
# デフォルトユーザー（渡部）
curl -X POST http://localhost:3002/sync

# ユーザー名を指定
curl -X POST http://localhost:3002/sync \
  -H "Content-Type: application/json" \
  -d '{"userName":"市川"}'
```

### POST /open-dashboard
ダッシュボード起動スクリプト（`dashboard/open-dashboard.sh`）を実行

```bash
curl -X POST http://localhost:3002/open-dashboard
```

### GET /health
ヘルスチェック

```bash
curl http://localhost:3002/health
```

## 環境変数

- `STEERING_API_PORT`: ポート番号（デフォルト: 3002）
- `STEERING_USER_NAME`: デフォルト同期ユーザー名（デフォルト: 渡部）

## ログ

`server.log` にログが出力されます。

```bash
tail -f .claude/plans/api/server.log
```

## フロントエンドからの使用

`page.tsx` の「実装状況」ボタンをクリックすると:

1. ユーザー名入力プロンプトが表示される
2. 入力されたユーザー名で `POST /sync` が実行される
   - 共有サーバーから全員の実装状況を `.steering-shared/` にダウンロード
3. 同期完了後、`POST /open-dashboard` が実行される
   - `.steering-shared/index.html` がブラウザで開かれる
   - HTTPサーバー（ポート8888）で配信される
4. ダッシュボードで全担当者の実装状況が自動的に表示される

**前提条件**: API サーバーが起動していること（`./start.sh`）
