#!/bin/bash

# API Wrapper for open-dashboard.sh
# Usage: ./open-dashboard.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# open-dashboard.sh を実行
"$SCRIPT_DIR/../dashboard/open-dashboard.sh"
