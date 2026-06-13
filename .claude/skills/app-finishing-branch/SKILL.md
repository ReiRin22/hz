---
name: app-finishing-branch
description: 実装完了後、全テストが通過した状態で統合方法を決定する — マージ、PR作成、保留、破棄の選択肢を提示しワークフローを実行する
---

# 開発ブランチの完了処理

## 概要

開発作業完了後の統合方法を明確な選択肢で提示し、選択されたワークフローを実行する。

**中核原則:** テスト検証 → 環境検出 → 選択肢提示 → 選択実行 → クリーンアップ。

**開始時に宣言:** 「app-finishing-branch スキルを使用して、この作業を完了します。」

## プロセス

### ステップ1: テスト検証

**選択肢を提示する前に、テストが通過していることを確認:**

```bash
# プロジェクトのテストスイートを実行
cd product/frontend && npm test
cd product/bff && npm test
```

**テスト失敗時:**
```
テストが失敗しています（N件の失敗）。完了前に修正が必要です:

[失敗内容を表示]

テストが通過するまでマージ/PRは進められません。
```

停止。ステップ2に進まない。

**テスト通過時:** ステップ2に進む。

### ステップ2: 環境検出

**選択肢を提示する前にワークスペースの状態を判定:**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
```

これにより表示するメニューとクリーンアップ方法が決定される:

| 状態 | メニュー | クリーンアップ |
|------|---------|---------------|
| `GIT_DIR == GIT_COMMON`（通常リポジトリ） | 標準4選択肢 | worktreeクリーンアップ不要 |
| `GIT_DIR != GIT_COMMON`、名前付きブランチ | 標準4選択肢 | 出自ベース（ステップ6参照） |
| `GIT_DIR != GIT_COMMON`、detached HEAD | 縮小3選択肢（マージなし） | クリーンアップなし（外部管理） |

### ステップ3: ベースブランチ決定

```bash
# ベースブランチを確認（このプロジェクトでは develop）
git merge-base HEAD develop 2>/dev/null
```

または確認: 「このブランチは develop から分岐しています。正しいですか？」

### ステップ4: 選択肢提示

**通常リポジトリおよび名前付きブランチworktree — 正確にこの4選択肢を提示:**

```
実装が完了しました。どうしますか？

1. <base-branch> にローカルでマージする
2. プッシュしてプルリクエストを作成する
3. ブランチをそのまま保持する（後で自分で処理）
4. この作業を破棄する

どの選択肢にしますか？
```

**detached HEAD — 正確にこの3選択肢を提示:**

```
実装が完了しました。detached HEAD（外部管理ワークスペース）です。

1. 新しいブランチとしてプッシュしてプルリクエストを作成
2. そのまま保持する（後で自分で処理）
3. この作業を破棄する

どの選択肢にしますか？
```

**説明を追加しない** — 選択肢は簡潔に。

### ステップ5: 選択実行

#### 選択肢1: ローカルでマージ

```bash
# メインリポジトリルートを取得（CWD安全性のため）
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"

# 最初にマージ — 何かを削除する前に成功を検証
git checkout <base-branch>
git pull
git merge <feature-branch>

# マージ結果でテストを検証
cd product/frontend && npm test && cd ../..
cd product/bff && npm test && cd ../..

# マージ成功後のみ: worktreeクリーンアップ（ステップ6）、次にブランチ削除
```

次に: worktreeクリーンアップ（ステップ6）、次にブランチ削除:

```bash
git branch -d <feature-branch>
```

#### 選択肢2: プッシュしてPR作成

```bash
# ブランチをプッシュ
git push -u origin <feature-branch>

# PR作成
gh pr create --base develop --title "<title>" --body "$(cat <<'EOF'
## 概要
<変更内容を2〜3行で>

## テスト計画
- [ ] <検証手順>
EOF
)"
```

**worktreeをクリーンアップしない** — ユーザーはPRフィードバックへの対応に必要。

#### 選択肢3: そのまま保持

報告: 「ブランチ <name> を保持します。worktreeは <path> に保存されています。」

**worktreeをクリーンアップしない。**

#### 選択肢4: 破棄

**最初に確認:**
```
以下を永久に削除します:
- ブランチ <name>
- すべてのコミット: <commit-list>
- <path> のworktree

確認するために 'discard' と入力してください。
```

正確な確認を待つ。

確認された場合:
```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
```

次に: worktreeクリーンアップ（ステップ6）、次に強制ブランチ削除:
```bash
git branch -D <feature-branch>
```

### ステップ6: ワークスペースクリーンアップ

**選択肢1と4のみ実行。** 選択肢2と3は常にworktreeを保持する。

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
WORKTREE_PATH=$(git rev-parse --show-toplevel)
```

**`GIT_DIR == GIT_COMMON` の場合:** 通常リポジトリ、クリーンアップ不要。完了。

**worktreeパスが `.worktrees/`、`worktrees/`、または `~/.config/superpowers/worktrees/` 配下の場合:** Superpowersがこのworktreeを作成 — クリーンアップは我々の責任。

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git worktree remove "$WORKTREE_PATH"
git worktree prune  # 自己修復: 古い登録をクリーンアップ
```

**それ以外の場合:** ホスト環境（ハーネス）がこのワークスペースを所有。削除しない。プラットフォームがワークスペース終了ツールを提供している場合はそれを使用。それ以外はワークスペースをそのまま残す。

## クイックリファレンス

| 選択肢 | マージ | プッシュ | worktree保持 | ブランチクリーンアップ |
|--------|--------|---------|--------------|---------------------|
| 1. ローカルマージ | あり | - | - | あり |
| 2. PR作成 | - | あり | あり | - |
| 3. そのまま保持 | - | - | あり | - |
| 4. 破棄 | - | - | - | あり（強制） |

## よくある間違い

**テスト検証をスキップする**
- **問題:** 壊れたコードをマージ、失敗するPRを作成
- **修正:** 選択肢を提示する前に常にテストを検証

**オープンエンドな質問**
- **問題:** 「次に何をすべきですか？」は曖昧
- **修正:** 正確に4つの構造化された選択肢を提示（detached HEADの場合は3つ）

**選択肢2でworktreeをクリーンアップする**
- **問題:** ユーザーがPR対応に必要なworktreeを削除
- **修正:** 選択肢1と4のみクリーンアップ

**worktree削除前にブランチを削除する**
- **問題:** worktreeがまだブランチを参照しているため `git branch -d` が失敗
- **修正:** 最初にマージ、worktree削除、次にブランチ削除

**worktree内部から git worktree remove を実行**
- **問題:** 削除中のworktree内部でCWDがあるとコマンドがサイレント失敗
- **修正:** `git worktree remove` の前に常にメインリポジトリルートに `cd`

**ハーネス所有のworktreeをクリーンアップする**
- **問題:** ハーネスが作成したworktreeを削除すると幻影状態が発生
- **修正:** `.worktrees/`、`worktrees/`、または `~/.config/superpowers/worktrees/` 配下のworktreeのみクリーンアップ

**破棄時に確認なし**
- **問題:** 誤って作業を削除
- **修正:** タイプ入力による「discard」確認が必要

## レッドフラグ

**決してしない:**
- テスト失敗のまま進める
- マージ結果でテストを検証せずにマージ
- 確認なしで作業を削除
- 明示的なリクエストなしでforce-push
- マージ成功確認前にworktreeを削除
- 自分が作成していないworktreeをクリーンアップする（出自チェック）
- worktree内部から `git worktree remove` を実行

**常に:**
- 選択肢を提示する前にテストを検証
- メニュー提示前に環境を検出
- 正確に4つの選択肢を提示（detached HEADの場合は3つ）
- 選択肢4にはタイプ入力確認を取得
- 選択肢1と4のみworktreeをクリーンアップ
- worktree削除前にメインリポジトリルートに `cd`
- 削除後に `git worktree prune` を実行

## プロジェクト固有の注意事項

このプロジェクトでは:
- ベースブランチは **develop**（main ではない）
- テストは `product/frontend` と `product/bff` の両方で実行が必要
- ブランチ命名規則: `feature/`, `fix/` などのプレフィックス
- CLAUDE.md の `session_progress` を更新後、`session_phase` を `idle` に戻すこと
