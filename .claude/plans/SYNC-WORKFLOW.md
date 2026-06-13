# Steering 同期ワークフロー

Progress Dashboard用の.steeringフォルダ同期システム

## 概要

```
個人作業（ローカル）
  ↓ sync-steering.sh
共有サーバー（個人フォルダ）
  ↓ sync-steering-shared.sh
ローカル共有（全員分集約）
  ↓
Progress Dashboard で表示
```

---

## 前提条件

1. **共有サーバーのマウント完了**
   ```bash
   cd /home/ke-watanabe/harz2/.claude/plans
   ./set-up-mount.sh
   ```

2. **ローカルに .steering フォルダが存在**
   ```
   /home/ke-watanabe/harz2/.steering/
   ├── 渡部/
   │   ├── プロジェクトA/
   │   │   └── state.md
   │   └── プロジェクトB/
   │       └── state.md
   └── progress-dashboard/
   ```

---

## 使い方

### 方法1: 一括実行（推奨）

**すべてを自動実行:**

```bash
cd /home/ke-watanabe/harz2/.claude/plans
./sync-all.sh
```

または、ユーザー名を指定:

```bash
./sync-all.sh 渡部
```

**ドライラン（実際には同期しない）:**

```bash
./sync-all.sh 渡部 --dry-run
```

---

### 方法2: 個別実行

#### ステップ1: ローカル → 共有サーバー（アップロード）

```bash
cd /home/ke-watanabe/harz2/.claude/plans
./sync-steering.sh
```

または、ユーザー名を指定:

```bash
./sync-steering.sh 渡部
```

#### ステップ2: 共有サーバー（全員分） → ローカル（ダウンロード）

```bash
./sync-steering-shared.sh
```

---

## 同期されるファイル

### アップロード（sync-steering.sh）

- **ソース**: `/home/ke-watanabe/harz2/.steering/`
- **ターゲット**: `共有サーバー/91_個人フォルダ/.steering/渡部/`
- **対象**: `state.md` のみ
- **除外**: `progress-dashboard/`, スクリプトファイル

### ダウンロード（sync-steering-shared.sh）

- **ソース**: `共有サーバー/91_個人フォルダ/*/. steering/`
- **ターゲット**: `/home/ke-watanabe/harz2/.steering-shared/`
- **対象**: 全担当者の `state.md`

---

## フォルダ構造

### ローカル

```
/home/ke-watanabe/harz2/
├── .steering/              # 個人作業フォルダ
│   ├── 渡部/
│   │   ├── プロジェクトA/
│   │   │   └── state.md
│   │   └── プロジェクトB/
│   │       └── state.md
│   └── progress-dashboard/
│
├── .steering-shared/       # 全員分の集約フォルダ（同期後に作成）
│   ├── 渡部/
│   │   ├── プロジェクトA/state.md
│   │   └── プロジェクトB/state.md
│   └── 市川/
│       └── プロジェクトC/state.md
│
└── .claude/plans/
    ├── sync-steering.sh
    ├── sync-steering-shared.sh
    └── sync-all.sh
```

### 共有サーバー

```
\\10.20.21.198\Harz_共有\@Harz2025_project-docs\91_個人フォルダ\
├── .steering/
│   ├── 渡部/
│   │   ├── プロジェクトA/
│   │   │   └── state.md
│   │   └── プロジェクトB/
│   │       └── state.md
│   └── 市川/
│       └── プロジェクトC/
│           └── state.md
└── (その他の個人フォルダ)
```

---

## Progress Dashboard との連携

### 同期後にダッシュボードを起動

```bash
cd /home/ke-watanabe/harz2/.steering
./start-local.sh
```

または PowerShell:

```powershell
Start-Local.ps1 を右クリック → "PowerShell で実行"
```

### スキャン時に選択するフォルダ

```
\\wsl.localhost\Ubuntu-24.04\home\ke-watanabe\harz2\.steering-shared
```

**重要: `.steering-shared` を選択してください（`.steering` ではありません）**

---

## トラブルシューティング

### マウントポイントが見つかりません

**症状:**
```
✗ マウントポイントが見つかりません: /mnt/10.20.21.198
```

**対処:**
```bash
cd /home/ke-watanabe/harz2/.claude/plans
./set-up-mount.sh
```

---

### 既に同期が実行中です

**症状:**
```
✗ 既に同期が実行中です
```

**対処:**
```bash
rm /tmp/sync-steering.lock
# または
rm /tmp/sync-steering-shared.lock
```

---

### 担当者フォルダが見つかりません

**症状:**
```
⚠ 担当者フォルダが見つかりません
```

**原因:** 共有サーバーに `.steering` フォルダが存在しない

**対処:**
1. 先に `sync-steering.sh` を実行してアップロード
2. 共有サーバーの構造を確認:
   ```
   91_個人フォルダ/
     ├── 渡部/.steering/
     └── 市川/.steering/
   ```

---

### ディスク容量不足

**症状:**
```
✗ ディスク容量不足: XXX MB 残り
```

**対処:**
不要なファイルを削除してから再実行

---

## 定期実行（オプション）

cron で自動同期する場合:

```bash
# 毎日 18:00 に同期
0 18 * * * /home/ke-watanabe/harz2/.claude/plans/sync-all.sh >> /tmp/sync-log.txt 2>&1
```

---

## 更新フロー

```
1. ローカルで作業
   → .steering/渡部/プロジェクトA/state.md 更新

2. アップロード
   → ./sync-steering.sh

3. ダウンロード（全員分）
   → ./sync-steering-shared.sh

4. ダッシュボードで確認
   → ./start-local.sh
   → ブラウザでスキャン → .steering-shared を選択
```

---

## まとめ

| スクリプト | 目的 | 頻度 |
|---|---|---|
| **sync-all.sh** | 一括実行（アップロード + ダウンロード） | 作業後 |
| **sync-steering.sh** | 個人作業をアップロード | 作業終了時 |
| **sync-steering-shared.sh** | 全員分をダウンロード | 確認時 |

**推奨ワークフロー:** 作業終了時に `./sync-all.sh` を実行
