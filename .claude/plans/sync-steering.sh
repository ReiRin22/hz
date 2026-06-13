#!/bin/bash

# sync-steering.sh
# ローカルの個人作業を共有サーバーへアップロード

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOCK_FILE="/tmp/sync-steering.lock"

# 色付き出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Steering Sync - アップロード"
echo "=========================================="
echo ""

# ユーザー名の特定（引数または環境変数から）
USER_NAME="${1:-渡部}"
echo "ユーザー: ${USER_NAME}"
echo ""

# パスの設定
LOCAL_STEERING="$PROJECT_ROOT/.steering"
MOUNT_POINT="/mnt/harz-shared"
SHARED_BASE="$MOUNT_POINT/@Harz2025_project-docs/91_個人フォルダ"
TARGET_PATH="$SHARED_BASE/.steering/${USER_NAME}"

# ドライランモードのチェック
DRY_RUN=""
if [[ "$2" == "--dry-run" ]]; then
    DRY_RUN="--dry-run"
    echo -e "${YELLOW}[DRY RUN モード]${NC}"
    echo ""
fi

# ロックファイルのチェック
if [[ -f "$LOCK_FILE" ]]; then
    echo -e "${RED}✗ 既に同期が実行中です${NC}"
    echo "別のターミナルで sync-steering.sh が実行中の可能性があります"
    echo ""
    echo "強制的に実行する場合: rm $LOCK_FILE"
    exit 1
fi

# ロックファイル作成
touch "$LOCK_FILE"
trap "rm -f $LOCK_FILE" EXIT

# マウント確認
echo "[1] 共有サーバーのマウント確認"
if [[ ! -d "$MOUNT_POINT" ]]; then
    echo -e "${RED}✗ マウントポイントが見つかりません: $MOUNT_POINT${NC}"
    echo ""
    echo "以下を実行してマウントしてください:"
    echo "  cd $SCRIPT_DIR"
    echo "  ./set-up-mount.sh"
    exit 1
fi

if [[ ! -d "$SHARED_BASE" ]]; then
    echo -e "${RED}✗ 共有フォルダが見つかりません: $SHARED_BASE${NC}"
    echo ""
    echo "マウントが正しく設定されているか確認してください"
    exit 1
fi

echo -e "${GREEN}✓ マウント確認完了${NC}"
echo ""

# ローカルフォルダの確認
echo "[2] ローカルフォルダの確認"
if [[ ! -d "$LOCAL_STEERING" ]]; then
    echo -e "${RED}✗ ローカルフォルダが見つかりません: $LOCAL_STEERING${NC}"
    exit 1
fi

STATE_FILE_COUNT=$(find "$LOCAL_STEERING" -name "state.md" ! -path "*/progress-dashboard/*" | wc -l)
echo -e "${GREEN}✓ ローカル state.md: ${STATE_FILE_COUNT} 個${NC}"
echo ""

# ターゲットディレクトリの作成
echo "[3] ターゲットディレクトリの準備"
if [[ ! -d "$TARGET_PATH" ]]; then
    echo "作成中: $TARGET_PATH"
    mkdir -p "$TARGET_PATH"
fi
echo -e "${GREEN}✓ ターゲット準備完了${NC}"
echo ""

# rsync実行
echo "[4] 同期実行"
echo "ソース: $LOCAL_STEERING/"
echo "ターゲット: $TARGET_PATH/"
echo ""

rsync -av $DRY_RUN \
    --include='*/' \
    --exclude='progress-dashboard' \
    --delete \
    "$LOCAL_STEERING/" \
    "$TARGET_PATH/"

if [[ $? -eq 0 ]]; then
    echo ""
    echo -e "${GREEN}=========================================="
    echo "✓ 同期完了"
    echo "==========================================${NC}"
    echo ""
    echo "ターゲット: $TARGET_PATH"

    if [[ -z "$DRY_RUN" ]]; then
        SYNCED_COUNT=$(find "$TARGET_PATH" -name "state.md" | wc -l)
        echo "同期された state.md: ${SYNCED_COUNT} 個"
    fi

    echo ""
    echo "次のステップ:"
    echo "  ./sync-steering-shared.sh を実行して全員の作業をダウンロード"
else
    echo ""
    echo -e "${RED}✗ 同期失敗${NC}"
    exit 1
fi
