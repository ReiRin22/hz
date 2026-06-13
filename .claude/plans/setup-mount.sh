#!/bin/bash
# 共有フォルダマウントセットアップスクリプト
# 使用方法: ./setup-mount.sh

set -e

SHARED_PATH="//10.20.21.198/Harz_共有"
MOUNT_POINT="/mnt/harz-shared"
CREDS_FILE="$HOME/.smb_credentials"

echo "=========================================="
echo "共有フォルダマウントセットアップ"
echo "=========================================="
echo ""

# マウントポイントの確認・作成
echo "[1/5] マウントポイントを確認..."
if [ ! -d "$MOUNT_POINT" ]; then
  echo "  → マウントポイントを作成: $MOUNT_POINT"
  sudo mkdir -p "$MOUNT_POINT"
  echo "  ✓ 作成完了"
else
  echo "  ✓ 既に存在: $MOUNT_POINT"
fi
echo ""

# 認証情報ファイルの作成
echo "[2/5] 認証情報ファイルを確認..."
if [ -f "$CREDS_FILE" ]; then
  echo "  [警告] 認証情報ファイルが既に存在します: $CREDS_FILE"
  echo "         既存のファイルを使用する場合は Enter を押してください。"
  echo "         新しく作成する場合は Ctrl+C で中断してファイルを削除してください。"
  read -r
  echo "  ✓ 既存の認証情報を使用します"
else
  echo "  → 認証情報を入力してください:"
  read -rp "     Username: " USERNAME
  read -srp "     Password: " PASSWORD
  echo ""
  read -rp "     Domain (空の場合は Enter): " DOMAIN

  # 認証情報ファイルを作成
  cat > "$CREDS_FILE" <<EOF
username=$USERNAME
password=$PASSWORD
EOF

  if [ -n "$DOMAIN" ]; then
    echo "domain=$DOMAIN" >> "$CREDS_FILE"
  fi

  chmod 600 "$CREDS_FILE"
  echo "  ✓ 認証情報ファイルを作成: $CREDS_FILE (パーミッション: 600)"
fi
echo ""

# マウント実行
echo "[3/5] ネットワークドライブをマウント..."
if mount | grep -q "$MOUNT_POINT"; then
  echo "  [警告] 既にマウントされています。アンマウントしてから再マウントします。"
  sudo umount "$MOUNT_POINT"
  echo "  → アンマウント完了"
fi

echo "  → マウント実行: $SHARED_PATH → $MOUNT_POINT"
sudo mount -t cifs "$SHARED_PATH" "$MOUNT_POINT" -o credentials="$CREDS_FILE",uid=$(id -u),gid=$(id -g)
echo "  ✓ マウント完了"
echo ""

# マウント確認
echo "[4/5] マウント確認..."
if mount | grep -q "$MOUNT_POINT"; then
  echo "  ✓ マウント成功"
  echo ""
  echo "  共有フォルダの内容（先頭10件）:"
  ls -la "$MOUNT_POINT" | head -10 | sed 's/^/    /'
else
  echo "  ✗ マウント失敗"
  exit 1
fi
echo ""

# fstab への永続化（オプション）
echo "[5/5] fstab への永続化（オプション）"
echo "  マウントを永続化しますか？（再起動後も自動マウント）"
echo "    Y: fstab に追記する"
echo "    N: スキップ（手動マウントのみ）"
read -rp "  選択 (Y/N): " FSTAB_CHOICE

if [[ "$FSTAB_CHOICE" =~ ^[Yy]$ ]]; then
  FSTAB_ENTRY="$SHARED_PATH $MOUNT_POINT cifs credentials=$CREDS_FILE,uid=$(id -u),gid=$(id -g) 0 0"

  if grep -q "$MOUNT_POINT" /etc/fstab; then
    echo "  [警告] /etc/fstab に既にエントリが存在します。スキップします。"
  else
    echo "$FSTAB_ENTRY" | sudo tee -a /etc/fstab > /dev/null
    echo "  ✓ /etc/fstab に追記しました"
  fi
else
  echo "  → fstab への追記をスキップしました"
fi
echo ""

echo "=========================================="
echo "セットアップ完了"
echo "=========================================="
echo ""
echo "マウントポイント: $MOUNT_POINT"
echo "共有フォルダ: $SHARED_PATH"
echo ""
echo "次のステップ:"
echo "  1. 共有 .steering ディレクトリを作成"
echo "  2. 同期スクリプト sync-steering.sh を作成"
echo "  3. 動作確認"
echo ""
