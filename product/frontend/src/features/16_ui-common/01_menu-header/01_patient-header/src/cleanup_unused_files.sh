#!/bin/bash

echo "=== Harz医療システム 未使用ファイル削除 ==="

# 1. 整理関連の一時ファイルを削除
echo "整理関連一時ファイルを削除中..."
rm -f cleanup_complete.sh
rm -f cleanup_files.md
rm -f cleanup_unused_components.sh
rm -f component_usage_analysis.md
rm -f delete_cleanup_files.sh
rm -f delete_incomplete_files.sh
rm -f delete_tmp.sh
rm -f final_cleanup.sh
rm -f PROJECT_CLEANUP_SUMMARY.md

# 2. tmpディレクトリとその内容を削除
echo "tmpディレクトリを削除中..."
rm -rf tmp/

# 3. 未使用のユーティリティファイルを削除
echo "未使用ユーティリティファイルを削除中..."
rm -f utils/learning-engine.ts
rm -f utils/prediction-engine.ts
rm -f utils/context-analyzer.ts

# 4. 未使用の型定義ファイルを削除
echo "未使用型定義ファイルを削除中..."
rm -f types/learning-types.ts

# 5. 重複コンポーネントを削除（componentsディレクトリに既に存在するため）
echo "重複コンポーネントを削除中..."
rm -f components/medical/MedicalRecordInput.tsx
rm -f components/medical/OrderInput.tsx

# 6. このスクリプト自体も削除
echo "クリーンアップ完了！"
echo "削除されたファイル:"
echo "- 整理関連一時ファイル (9個)"
echo "- tmpディレクトリ"
echo "- 未使用ユーティリティファイル (3個)"
echo "- 未使用型定義ファイル (1個)"
echo "- 重複コンポーネント (2個)"

# 最後にこのスクリプトも削除
rm -- "$0"