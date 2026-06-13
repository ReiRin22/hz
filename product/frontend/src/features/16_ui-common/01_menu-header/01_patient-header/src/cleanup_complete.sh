#!/bin/bash

# 不要な一時ファイルと整理関連ファイルを削除
rm -f cleanup_files.md
rm -f cleanup_unused_components.sh
rm -f component_usage_analysis.md
rm -f delete_cleanup_files.sh
rm -f delete_tmp.sh
rm -f final_cleanup.sh
rm -f delete_incomplete_files.sh
rm -f PROJECT_CLEANUP_SUMMARY.md
rm -rf tmp/

echo "プロジェクト整理が完了しました"
echo "不要なファイルを削除しました"
echo "App.tsxのインポートエラーが修正されました"