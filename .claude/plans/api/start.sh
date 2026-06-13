#!/bin/bash

# Steering API Server 起動スクリプト

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${STEERING_API_PORT:-3002}"

echo "Starting Steering API Server on port $PORT..."

# 既存のサーバーをチェック
if lsof -ti:$PORT >/dev/null 2>&1; then
    echo "Port $PORT is already in use"
    echo "Stopping existing server..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# サーバーを起動（バックグラウンド、ログなし）
cd "$SCRIPT_DIR"
nohup node server.js >/dev/null 2>&1 &
PID=$!

echo "Server started (PID: $PID)"
echo ""
echo "Test with:"
echo "  curl http://localhost:$PORT/health"
