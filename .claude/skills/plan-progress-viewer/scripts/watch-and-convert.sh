#!/usr/bin/env bash
# Watch phase0-plan.md and auto-convert to HTML on changes

PLAN_FILE="${1:-.steering/20260604-REC005_診療記録情報参照/phase0-plan.md}"
OUTPUT_DIR="${2:-/tmp/plan-viewer-429591-1780915732/content}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [[ ! -f "$PLAN_FILE" ]]; then
  echo "❌ Plan file not found: $PLAN_FILE"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
OUTPUT_FILE="$OUTPUT_DIR/phase0-plan.html"

# Initial conversion
echo "🔄 Initial conversion..."
node "$SCRIPT_DIR/convert-plan-to-html.js" "$PLAN_FILE" "$OUTPUT_FILE"

# Watch for changes
echo "👁️  Watching: $PLAN_FILE"
echo "📂 Output: $OUTPUT_FILE"
echo "🔄 Auto-converting on changes..."

while true; do
  # Use inotifywait if available, otherwise poll every 2 seconds
  if command -v inotifywait &> /dev/null; then
    inotifywait -q -e modify,close_write "$PLAN_FILE"
  else
    sleep 2
  fi

  echo "🔄 $(date '+%H:%M:%S') - Change detected, converting..."
  node "$SCRIPT_DIR/convert-plan-to-html.js" "$PLAN_FILE" "$OUTPUT_FILE"
done
