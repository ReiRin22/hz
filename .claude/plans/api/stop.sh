#!/bin/bash

# Steering API Server 停止スクリプト

PORT="${STEERING_API_PORT:-3002}"

if lsof -ti:$PORT >/dev/null 2>&1; then
    echo "Stopping server on port $PORT..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    echo "Server stopped"
else
    echo "No server running on port $PORT"
fi
