#!/usr/bin/env bash
# Update task status in tasklist.md
# Usage: update-task.sh <tasklist.md> <task-id>
# Example: update-task.sh .steering/20260610-REC005/tasklist.md "T1-1"

set -e

TASKLIST_FILE="$1"
TASK_ID="$2"

if [[ -z "$TASKLIST_FILE" || -z "$TASK_ID" ]]; then
  echo "Usage: $0 <tasklist.md> <task-id>"
  exit 1
fi

if [[ ! -f "$TASKLIST_FILE" ]]; then
  echo "❌ File not found: $TASKLIST_FILE"
  exit 1
fi

# Update checkbox [ ] -> [x] for the specified task
if grep -q "- \[ \] ${TASK_ID}:" "$TASKLIST_FILE"; then
  sed -i "s/- \[ \] ${TASK_ID}:/- [x] ${TASK_ID}:/" "$TASKLIST_FILE"
  echo "✅ Updated: $TASK_ID in $TASKLIST_FILE"
  exit 0
elif grep -q "- \[x\] ${TASK_ID}:" "$TASKLIST_FILE"; then
  echo "ℹ️  Already completed: $TASK_ID"
  exit 0
else
  echo "⚠️  Task not found: $TASK_ID"
  exit 1
fi
