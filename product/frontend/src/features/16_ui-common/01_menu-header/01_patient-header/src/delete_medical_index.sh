#!/bin/bash

# components/medical/index.tsを削除
# （空のエクスポートのみで実際のコンポーネントは親ディレクトリにあるため）
rm -f components/medical/index.ts

# components/layout/index.tsも削除
# （同様に空のエクスポートのみのため）
rm -f components/layout/index.ts

echo "空のindex.tsファイルを削除しました"

# このスクリプトも削除
rm -- "$0"