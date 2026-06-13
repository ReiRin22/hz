#!/bin/bash

# sync-steering-shared.sh
# 共有サーバーの全員の作業をローカルに集約

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOCK_FILE_UPLOAD="/tmp/sync-steering.lock"
LOCK_FILE_DOWNLOAD="/tmp/sync-steering-shared.lock"

# 色付き出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Steering Sync - ダウンロード（全員分）"
echo "=========================================="
echo ""

# パスの設定
MOUNT_POINT="/mnt/harz-shared"
SHARED_BASE="$MOUNT_POINT/@Harz2025_project-docs/91_個人フォルダ"
# Windowsデスクトップに配置
LOCAL_SHARED="/mnt/c/Users/ke-watanabe/Desktop/.steering-shared"

# ドライランモードのチェック
DRY_RUN=""
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN="--dry-run"
    echo -e "${YELLOW}[DRY RUN モード]${NC}"
    echo ""
fi

# アップロード中のチェック
if [[ -f "$LOCK_FILE_UPLOAD" ]]; then
    echo -e "${YELLOW}⚠ sync-steering.sh が実行中です${NC}"
    echo "完了を待っています..."

    WAIT_COUNT=0
    while [[ -f "$LOCK_FILE_UPLOAD" ]] && [[ $WAIT_COUNT -lt 30 ]]; do
        sleep 1
        WAIT_COUNT=$((WAIT_COUNT + 1))
    done

    if [[ -f "$LOCK_FILE_UPLOAD" ]]; then
        echo -e "${RED}✗ タイムアウト: sync-steering.sh が30秒以上実行中です${NC}"
        echo ""
        echo "手動で確認してください"
        exit 1
    fi

    echo -e "${GREEN}✓ sync-steering.sh が完了しました${NC}"
    echo ""
fi

# ロックファイルのチェック
if [[ -f "$LOCK_FILE_DOWNLOAD" ]]; then
    echo -e "${RED}✗ 既に同期が実行中です${NC}"
    echo ""
    echo "強制的に実行する場合: rm $LOCK_FILE_DOWNLOAD"
    exit 1
fi

# ロックファイル作成
touch "$LOCK_FILE_DOWNLOAD"
trap "rm -f $LOCK_FILE_DOWNLOAD" EXIT

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
    exit 1
fi

echo -e "${GREEN}✓ マウント確認完了${NC}"
echo ""

# ローカルターゲットディレクトリの準備
echo "[2] ローカルターゲットディレクトリの準備"
mkdir -p "$LOCAL_SHARED"
echo -e "${GREEN}✓ $LOCAL_SHARED${NC}"
echo ""

# ディスク容量チェック
echo "[3] ディスク容量チェック"
AVAILABLE=$(df -BM "$PROJECT_ROOT" | awk 'NR==2 {print $4}' | sed 's/M//')
if [[ $AVAILABLE -lt 100 ]]; then
    echo -e "${RED}✗ ディスク容量不足: ${AVAILABLE}MB 残り${NC}"
    echo "最低100MB必要です"
    exit 1
fi
echo -e "${GREEN}✓ 利用可能: ${AVAILABLE}MB${NC}"
echo ""

# 担当者フォルダの検出
echo "[4] 担当者フォルダの検出"
PERSON_FOLDERS=()

# 91_個人フォルダ/.steering/ 配下の担当者フォルダを検出
STEERING_ROOT="$SHARED_BASE/.steering"
if [[ -d "$STEERING_ROOT" ]]; then
    while IFS= read -r -d '' folder; do
        PERSON_NAME=$(basename "$folder")
        # . で始まるフォルダは除外
        if [[ ! "$PERSON_NAME" == .* ]]; then
            PERSON_FOLDERS+=("$PERSON_NAME")
        fi
    done < <(find "$STEERING_ROOT" -maxdepth 1 -type d -print0 2>/dev/null)
fi

if [[ ${#PERSON_FOLDERS[@]} -eq 0 ]]; then
    echo -e "${YELLOW}⚠ 担当者フォルダが見つかりません${NC}"
    echo ""
    echo "確認: $SHARED_BASE"
    echo ""
    echo "以下の構造になっているか確認してください:"
    echo "  91_個人フォルダ/"
    echo "    ├── 渡部/.steering/"
    echo "    ├── 市川/.steering/"
    echo "    └── ..."
    exit 1
fi

echo -e "${GREEN}✓ 検出された担当者: ${#PERSON_FOLDERS[@]} 人${NC}"
for person in "${PERSON_FOLDERS[@]}"; do
    echo "  - $person"
done
echo ""

# 各担当者の state.md を同期
echo "[5] 同期実行"
TOTAL_SYNCED=0

for person in "${PERSON_FOLDERS[@]}"; do
    echo "同期中: $person"

    SOURCE_PATH="$STEERING_ROOT/$person"
    TARGET_PATH="$LOCAL_SHARED/$person"

    mkdir -p "$TARGET_PATH"

    rsync -av $DRY_RUN \
        --exclude='index.html' \
        --exclude='app.js' \
        --exclude='styles.css' \
        --exclude='state-files.json' \
        "$SOURCE_PATH/" \
        "$TARGET_PATH/" 2>/dev/null || {
        echo -e "${YELLOW}  ⚠ スキップ（読み取り権限なし）${NC}"
        continue
    }

    if [[ -z "$DRY_RUN" ]]; then
        COUNT=$(find "$TARGET_PATH" -type f 2>/dev/null | wc -l)
        echo -e "${GREEN}  ✓ ${COUNT} 個のファイルを同期${NC}"
        TOTAL_SYNCED=$((TOTAL_SYNCED + COUNT))
    fi
    echo ""
done

echo -e "${GREEN}=========================================="
echo "✓ 全体同期完了"
echo "==========================================${NC}"
echo ""
echo "ローカル共有フォルダ: $LOCAL_SHARED"
echo "担当者: ${#PERSON_FOLDERS[@]} 人"

if [[ -z "$DRY_RUN" ]]; then
    echo "同期されたファイル総数: ${TOTAL_SYNCED} 個"
fi

echo ""
echo "次のステップ:"
echo "  Progress Dashboard でこのフォルダを読み込んでください"
echo "  パス: $(wslpath -w "$LOCAL_SHARED" 2>/dev/null || echo "$LOCAL_SHARED")"
