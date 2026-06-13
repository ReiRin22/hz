#!/usr/bin/env bash
# server-test.sh — localhost:3000 自動チェック
# 使い方: bash .claude/scripts/server-test.sh [CODE]
#   CODE: REC001 などの画面コード（省略可）
#   Playwright が使える場合は headed E2E テスト (e2e-test.js) を実行する

set -euo pipefail

# ─── Playwright が使えれば E2E テストを実行して終了 ──────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
FEATURES_DIR="$ROOT_DIR/product/frontend/src/features"

# コードに応じてテストスクリプトを選択
_CODE_ARG="${1:-}"
case "$_CODE_ARG" in
  REC001) E2E_SCRIPT="$FEATURES_DIR/01_diagnosis/01_record-creation/01_examination-input/test/REC001-test.js" ;;
  REC002) E2E_SCRIPT="$FEATURES_DIR/01_diagnosis/01_record-creation/01_schema-creation/test/REC002-test.js" ;;
  REC020) E2E_SCRIPT="$FEATURES_DIR/01_diagnosis/06_patient-list/01_patient-list/test/REC020-test.js" ;;
  ORD023) E2E_SCRIPT="$FEATURES_DIR/05_order/05_specimen-order/01_specimen-setting/test/ORD023-test.js" ;;
  ORD076) E2E_SCRIPT="$FEATURES_DIR/05_order/19_nursing-care-order/03_order-confirm/test/ORD076-test.js" ;;
  ETC001) E2E_SCRIPT="$FEATURES_DIR/16_ui-common/01_menu-header/01_login/test/ETC001-test.js" ;;
  ETC002) E2E_SCRIPT="$FEATURES_DIR/16_ui-common/01_menu-header/01_menu/test/ETC002-test.js" ;;
  ETC003) E2E_SCRIPT="$FEATURES_DIR/16_ui-common/01_menu-header/01_patient-header/test/ETC003-test.js" ;;
  ETC005) E2E_SCRIPT="$FEATURES_DIR/16_ui-common/01_menu-header/01_right-sidemenu/test/ETC005-test.js" ;;
  ETC006) E2E_SCRIPT="$FEATURES_DIR/16_ui-common/01_menu-header/01_user-header/test/ETC006-test.js" ;;
  ETC004) E2E_SCRIPT="$FEATURES_DIR/16_ui-common/01_menu-header/01_left-sidemenu/test/ETC004-test.js" ;;
  DEP002) E2E_SCRIPT="$FEATURES_DIR/09_dept-instruction/01_dept-instruction/02_lab-instruction/test/DEP002-test.js" ;;
  DEP009) E2E_SCRIPT="$FEATURES_DIR/09_dept-instruction/01_dept-instruction/09_patient-id-check/test/DEP009-test.js" ;;
  *)      E2E_SCRIPT="$FEATURES_DIR/01_diagnosis/01_record-creation/01_schema-creation/test/REC002-test.js" ;;
esac
LIB_PATH="/tmp/lib-extract/usr/lib/x86_64-linux-gnu:/tmp/lib-extract/lib/x86_64-linux-gnu"

# .debが未展開なら展開する
if [[ ! -f /tmp/lib-extract/usr/lib/x86_64-linux-gnu/libnspr4.so ]]; then
  if ls "$ROOT_DIR"/libnspr4*.deb >/dev/null 2>&1; then
    mkdir -p /tmp/lib-extract
    for deb in "$ROOT_DIR"/*.deb; do
      dpkg-deb -x "$deb" /tmp/lib-extract 2>/dev/null || true
    done
  fi
fi

PW_CHECK="node -e \"require('playwright')\" 2>/dev/null"
if command -v node >/dev/null 2>&1 && [[ -f "$E2E_SCRIPT" ]] && \
   ( eval "$PW_CHECK" || LD_LIBRARY_PATH="$LIB_PATH" node -e "require('$ROOT_DIR/product/frontend/node_modules/playwright')" 2>/dev/null ); then
  echo ""
  echo "📺  ブラウザを開いてE2Eテストを実行します..."
  echo ""
  exec env LD_LIBRARY_PATH="$LIB_PATH" DISPLAY="${DISPLAY:-:0}" node "$E2E_SCRIPT" "${1:-}"
fi

echo ""
echo "⚠  Playwright 未インストール — curl による基本チェックに切り替えます"
echo ""

BASE_URL="${SERVER_TEST_URL:-http://localhost:3000}"
CODE="${1:-}"
LOG_DIR="$ROOT_DIR/gitlab-runner/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/server-test-$(date +%Y%m%d-%H%M%S).log"

# ─── カラー ────────────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

pass=0
fail=0
total=0

# ─── テスト実行ヘルパー ────────────────────────────────────────
run_check() {
  local label="$1"
  local url="$2"
  local expect_code="${3:-200}"

  total=$((total + 1))
  printf "${CYAN}[%d] checking:${NC} %s ... " "$total" "$label"

  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null || echo "000")

  if [[ "$status" == "$expect_code" ]]; then
    pass=$((pass + 1))
    printf "${GREEN}✓ %s${NC}\n" "$status"
    echo "[PASS] $label ($url) => $status" >> "$LOG_FILE"
  else
    fail=$((fail + 1))
    printf "${RED}✗ %s (expected %s)${NC}\n" "$status" "$expect_code"
    echo "[FAIL] $label ($url) => $status (expected $expect_code)" >> "$LOG_FILE"
  fi
}

# ─── コード → URLパスマッピング（実際のNext.jsルート）────────────
code_to_path() {
  case "$1" in
    REC001) echo "/dev/diagnosis/record-creation/examination-input/REC001" ;;
    REC002) echo "/dev/diagnosis/record-creation/examination-input/REC002" ;;
    REC005) echo "/01/02/01/REC005" ;;
    REC006) echo "/01/02/02/REC006" ;;
    REC018) echo "/01/04/03/REC018" ;;
    REC019) echo "/01/05/01/REC019" ;;
    REC020) echo "/dev/diagnosis/patient-list/patient-list/REC020" ;;
    ORD023) echo "/dev/order/specimen-order/specimen-setting/ORD023" ;;
    ORD076) echo "/dev/order/nursing-care-order/order-confirm/ORD076" ;;
    REG001) echo "/04/01/01/REG001" ;;
    REG003) echo "/04/01/02/REG003" ;;
    ORD001) echo "/05/01/01/ORD001" ;;
    RES002) echo "/06/02/01/RES002" ;;
    DEP001) echo "/09/01/01/DEP001" ;;
    DEP002) echo "/dept-instruction/lab-instruction" ;;
    DEP003) echo "/09/01/03/DEP003" ;;
    DEP008) echo "/09/01/08/DEP008" ;;
    DEP009) echo "/dept-instruction/patient-id-check/DEP009" ;;
    DEP011) echo "/09/01/11/DEP011" ;;
    ETC001) echo "/ui-common/menu-header/login" ;;
    ETC002) echo "/ui-common/menu-header/menu" ;;
    ETC003) echo "/ui-common/menu-header/patient-header/ETC003" ;;
    ETC004) echo "/dev/ui-common/menu-header/left-sidemenu/ETC004" ;;
    ETC005) echo "/ui-common/menu-header/right-sidemenu/ETC005" ;;
    ETC006) echo "/dev/ui-common/menu-header/user-header/ETC006" ;;
    *) echo "" ;;
  esac
}

# ─── ヘッダ ────────────────────────────────────────────────────
echo ""
echo "========================================"
printf "${CYAN}  Harz Server Test${NC}\n"
echo "  BASE_URL : $BASE_URL"
echo "  CODE     : ${CODE:-（全体チェック）}"
echo "  LOG      : $LOG_FILE"
echo "========================================"
echo ""
echo "SERVER TEST START: $(date)" >> "$LOG_FILE"
echo "BASE_URL: $BASE_URL" >> "$LOG_FILE"
echo "CODE: ${CODE:-none}" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# ─── 基本チェック ─────────────────────────────────────────────
run_check "サーバー起動確認 (トップ)" "$BASE_URL/" "200"

# ─── コード固有チェック ────────────────────────────────────────
if [[ -n "$CODE" ]]; then
  path=$(code_to_path "$CODE")
  if [[ -n "$path" ]]; then
    run_check "${CODE} 画面ルート (${path})" "${BASE_URL}${path}" "200"
    # 画面のHTMLにコードが含まれているか確認
    body=$(curl -s --max-time 5 "${BASE_URL}${path}" 2>/dev/null || echo "")
    total=$((total + 1))
    printf "${CYAN}[%d] checking:${NC} %s ... " "$total" "${CODE} ページ内容確認"
    if echo "$body" | grep -q "$CODE"; then
      pass=$((pass + 1))
      printf "${GREEN}✓ コードIDを確認${NC}\n"
      echo "[PASS] ${CODE} ページ内容確認 => コードID '$CODE' をHTML内に発見" >> "$LOG_FILE"
    else
      fail=$((fail + 1))
      printf "${RED}✗ コードID '${CODE}' が見つからない${NC}\n"
      echo "[FAIL] ${CODE} ページ内容確認 => コードID '$CODE' がHTML内に見当たらない" >> "$LOG_FILE"
    fi
  else
    printf "${YELLOW}⚠ コード '${CODE}' のURLマッピングが未定義です。基本チェックのみ実行します。${NC}\n"
    echo "[WARN] No URL mapping for code: $CODE" >> "$LOG_FILE"
  fi
fi

# ─── サマリー ──────────────────────────────────────────────────
echo ""
echo "========================================"
if [[ $fail -eq 0 ]]; then
  printf "${GREEN}  ✓ ALL PASSED: %d/%d${NC}\n" "$pass" "$total"
else
  printf "${RED}  ✗ %d FAILED / %s PASSED / %d total${NC}\n" "$fail" "$pass" "$total"
fi
echo "  ログ: $LOG_FILE"
echo "========================================"
echo ""

echo "" >> "$LOG_FILE"
echo "SUMMARY: pass=$pass fail=$fail total=$total" >> "$LOG_FILE"
echo "END: $(date)" >> "$LOG_FILE"

# 失敗がある場合は非ゼロで終了
exit $fail
