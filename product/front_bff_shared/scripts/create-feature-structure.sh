#!/bin/bash
# front_bff_shared/features/ 配下にフロントエンドと同じ階層構造を作成するスクリプト

set -e

FRONTEND_FEATURES="/home/ke-watanabe/harz2/product/frontend/src/features"
SHARED_FEATURES="/home/ke-watanabe/harz2/product/front_bff_shared/features"

# front_bff_shared/features ディレクトリが存在しない場合は作成
mkdir -p "$SHARED_FEATURES"

echo "フロントエンドの features 構造をスキャン中..."

# フロントエンドの LV3 フォルダ（01_xxx 形式）を取得
find "$FRONTEND_FEATURES" -type d -name "0*_*" | while read -r frontend_dir; do
  # フロントエンドのパスから features/ 以降を抽出
  relative_path="${frontend_dir#$FRONTEND_FEATURES/}"

  # LV1, LV2, LV3 に分解
  IFS='/' read -ra PARTS <<< "$relative_path"

  # LV3 フォルダ（最後の部分）が存在する場合のみ処理
  if [ ${#PARTS[@]} -eq 3 ]; then
    LV1="${PARTS[0]}"
    LV2="${PARTS[1]}"
    LV3="${PARTS[2]}"

    # LV3 から数字とアンダースコアを除去して機能名を作成
    # 例: 01_examination-input -> examination-input
    FEATURE_NAME=$(echo "$LV3" | sed -E 's/^[0-9]+_//')

    # front_bff_shared 側のディレクトリパス
    SHARED_DIR="$SHARED_FEATURES/$LV1/$LV2/$LV3"

    # ディレクトリ作成
    mkdir -p "$SHARED_DIR/types/requests"
    mkdir -p "$SHARED_DIR/types/responses"
    mkdir -p "$SHARED_DIR/schemas"

    # Request 型ファイル
    REQUEST_FILE="$SHARED_DIR/types/requests/${FEATURE_NAME}.request.ts"
    if [ ! -f "$REQUEST_FILE" ]; then
      cat > "$REQUEST_FILE" <<EOF
/**
 * ${FEATURE_NAME} Request 型定義
 * フロントエンド・BFF 共通
 */

export interface ${FEATURE_NAME^}Request {
  // TODO: リクエスト型を定義
}
EOF
      echo "作成: $REQUEST_FILE"
    fi

    # Response 型ファイル
    RESPONSE_FILE="$SHARED_DIR/types/responses/${FEATURE_NAME}.response.ts"
    if [ ! -f "$RESPONSE_FILE" ]; then
      cat > "$RESPONSE_FILE" <<EOF
/**
 * ${FEATURE_NAME} Response 型定義
 * フロントエンド・BFF 共通
 */

export interface ${FEATURE_NAME^}Response {
  // TODO: レスポンス型を定義
}
EOF
      echo "作成: $RESPONSE_FILE"
    fi

    # Schema ファイル
    SCHEMA_FILE="$SHARED_DIR/schemas/${FEATURE_NAME}.schema.ts"
    if [ ! -f "$SCHEMA_FILE" ]; then
      cat > "$SCHEMA_FILE" <<EOF
/**
 * ${FEATURE_NAME} Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const ${FEATURE_NAME}Schema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ${FEATURE_NAME^}SchemaType = z.infer<typeof ${FEATURE_NAME}Schema>;
EOF
      echo "作成: $SCHEMA_FILE"
    fi
  fi
done

echo "✅ front_bff_shared/features/ 構造の作成が完了しました"
echo "📁 作成先: $SHARED_FEATURES"
