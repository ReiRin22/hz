#!/bin/bash

# sync-all.sh
# 両方のスクリプトを順次実行（アップロード → ダウンロード）

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 色付き出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=========================================="
echo "Steering Full Sync"
echo "==========================================${NC}"
echo ""

USER_NAME="${1:-渡部}"

# ドライランモードのチェック
DRY_RUN_FLAG=""
if [[ "$2" == "--dry-run" ]]; then
    DRY_RUN_FLAG="--dry-run"
    echo -e "${YELLOW}[DRY RUN モード]${NC}"
    echo ""
fi

# ステップ1: アップロード
echo -e "${CYAN}[ステップ 1/2] ローカル → 共有サーバー${NC}"
echo ""

"$SCRIPT_DIR/sync-steering.sh" "$USER_NAME" $DRY_RUN_FLAG

if [[ $? -ne 0 ]]; then
    echo ""
    echo -e "${RED}✗ アップロード失敗${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ アップロード完了${NC}"
echo ""

# 2秒待機（ファイルシステムの同期を待つ）
sleep 2

# ステップ2: ダウンロード
echo -e "${CYAN}[ステップ 2/2] 共有サーバー（全員分） → ローカル${NC}"
echo ""

"$SCRIPT_DIR/sync-steering-shared.sh" $DRY_RUN_FLAG

if [[ $? -ne 0 ]]; then
    echo ""
    echo -e "${RED}✗ ダウンロード失敗${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ ダウンロード完了${NC}"
echo ""

# 完了
echo -e "${CYAN}=========================================="
echo "✓ 全体同期完了"
echo "==========================================${NC}"
echo ""
echo "次のステップ:"
echo "  Progress Dashboard を起動してください"
echo "  cd $SCRIPT_DIR/dashboard"
echo "  ./open-dashboard.sh"
echo ""
echo "  または Windows デスクトップの .steering-shared を直接確認"
