#!/bin/bash

# Steering API Server 自動起動スクリプト
# サーバーが停止していれば起動、起動済みなら何もしない

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/server.pid"
PORT="${STEERING_API_PORT:-3002}"

# ヘルスチェック
if curl -s -f "http://localhost:$PORT/health" > /dev/null 2>&1; then
  echo "✅ Steering API Server は既に起動しています (Port: $PORT)"
  exit 0
fi

# PIDファイルが存在するが、プロセスが存在しない場合は削除
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if ! ps -p "$PID" > /dev/null 2>&1; then
    echo "⚠️  古いPIDファイルを削除します"
    rm "$PID_FILE"
  fi
fi

# サーバーを起動
echo "🚀 Steering API Server を起動しています..."
cd "$SCRIPT_DIR"
./start.sh

# 起動確認（最大10秒待機）
for i in {1..10}; do
  sleep 1
  if curl -s -f "http://localhost:$PORT/health" > /dev/null 2>&1; then
    echo "✅ Steering API Server が起動しました (Port: $PORT)"
    exit 0
  fi
done

echo "❌ Steering API Server の起動に失敗しました"
exit 1
