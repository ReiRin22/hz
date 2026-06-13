---
name: finishing-a-development-branch
description: git worktree を使用して実装した場合のみ使用。実装完了後に worktree のクリーンアップとブランチの統合方法（merge / keep / discard）を選択する。origin への push は行わない（ユーザーが手動で実行）
---

# 開発ブランチを仕上げる（worktree 使用時のみ）

## 概要

**このスキルは git worktree を使用している場合のみ実行する。**
通常のブランチで作業している場合は、このスキルをスキップする。

worktree のクリーンアップとブランチの統合方法を選択する。

**中核原則:** 環境を検出する -> 選択肢を提示する -> 選択を実行する -> worktree をクリーンアップする。

**開始時に宣言:** "I'm using the finishing-a-development-branch skill to complete this work."

**注意:** 
- このスキルは、事前のステップ（例: super-validation-before-completion や Phase-test スキル）でテストが既に通っていることを前提とする。テストを再実行しない。
- origin への push は行わない。ユーザーが任意のタイミングで手動実行する。

## プロセス

### Step 1: 環境を検出する

**選択肢を提示する前に、ワークスペース状態を判断する:**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
```

これにより表示するメニューとクリーンアップ方法が決まる。

| 状態 | メニュー | クリーンアップ |
|------|----------|----------------|
| `GIT_DIR == GIT_COMMON` (通常 repo) | **このスキルをスキップ** | なし |
| `GIT_DIR != GIT_COMMON` (worktree) | 3 選択肢（merge / keep / discard） | provenance-based (Step 5 参照) |

### Step 2: ベースブランチを決める

```bash
# よくあるベースブランチを試す
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

または尋ねる: "This branch split from main - is that correct?"

### Step 3: 選択肢を提示する

**worktree を使用している場合 - 正確にこの 3 選択肢を提示する:**

```text
Implementation complete. What would you like to do with this worktree?

1. Merge back to <base-branch> locally
2. Keep the branch as-is (I'll handle it later)
3. Discard this work

Which option?
```

**通常 repo の場合:**

```text
通常ブランチで作業しています。finishing-a-development-branch スキルをスキップします。
ユーザーが手動で以下を実行してください:
- コミット確認: git log
- Push: git push origin <branch-name>
- PR作成: gh pr create
```

**説明を追加しない** - 選択肢は簡潔に保つ。

### Step 4: 選択を実行する

#### Option 1: ローカルでマージ

```bash
# CWD 安全のため main repo root を取得する
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"

# 先にマージする - 何かを削除する前に成功を検証する
git checkout <base-branch>
git pull
git merge <feature-branch>

# マージ結果でテストを検証する
<test command>

# マージ成功後だけ: worktree cleanup (Step 5)、その後ブランチ削除
```

その後、worktree cleanup (Step 5) を実行し、ブランチを削除する。

```bash
git branch -d <feature-branch>
```

#### Option 2: そのまま保持

報告: "Keeping branch <name>. Worktree preserved at <path>."

**worktree を cleanup しない。**

#### Option 3: 破棄

**先に確認する:**

```text
This will permanently delete:
- Branch <name>
- All commits: <commit-list>
- Worktree at <path>

Type 'discard' to confirm.
```

正確な確認を待つ。

確認されたら:

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
```

その後、worktree cleanup (Step 5) を実行し、ブランチを強制削除する。

```bash
git branch -D <feature-branch>
```

### Step 5: ワークスペースを cleanup する

**Options 1 と 3 の場合だけ実行する。** Option 2 は常に worktree を保持する。

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
WORKTREE_PATH=$(git rev-parse --show-toplevel)
```

**`GIT_DIR == GIT_COMMON` の場合:** 通常 repo。cleanup すべき worktree はない。完了。

**worktree path が `.worktrees/`、`worktrees/`、または `~/.config/superpowers/worktrees/` 配下の場合:** Superpowers が作成した worktree なので cleanup してよい。

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git worktree remove "$WORKTREE_PATH"
git worktree prune  # 自己修復: 古い登録を掃除する
```

**それ以外:** ホスト環境 (harness) がこのワークスペースを所有している。削除してはならない。プラットフォームに workspace-exit ツールがあれば使う。なければワークスペースを残す。

## クイックリファレンス

| Option | Merge | Keep Worktree | Cleanup Branch |
|--------|-------|---------------|----------------|
| 1. Merge locally | yes | - | yes |
| 2. Keep as-is | - | yes | - |
| 3. Discard | - | - | yes (force) |

**注意:** origin への push は行わない。ユーザーが手動で実行する。

## よくある間違い

**自由回答の質問**
- **問題:** "次に何をしますか?" は曖昧
- **修正:** 正確に 4 つの構造化選択肢を出す (detached HEAD なら 3 つ)

**Option 2 で worktree を cleanup する**
- **問題:** 後で作業を続ける可能性がある worktree を削除してしまう
- **修正:** cleanup は Options 1 と 3 のみ

**worktree 削除前にブランチを削除する**
- **問題:** worktree がブランチを参照しているため `git branch -d` が失敗する
- **修正:** 先にマージ、worktree 削除、その後ブランチ削除

**削除対象 worktree 内から `git worktree remove` を実行する**
- **問題:** コマンドが失敗する
- **修正:** worktree remove 前に必ず main repo root へ `cd` する

**harness 管理の worktree を cleanup する**
- **問題:** harness が作った worktree を削除すると phantom state が生じる
- **修正:** `.worktrees/`、`worktrees/`、`~/.config/superpowers/worktrees/` 配下だけ cleanup する

**破棄の確認なし**
- **問題:** 誤って作業を削除する
- **修正:** typed "discard" confirmation を要求する

## 危険信号

**絶対にしない:**

- 確認なしに作業を削除する
- 明示依頼なしに force-push する
- マージ成功確認前に worktree を削除する
- 自分が作っていない worktree を cleanup する
- worktree 内から `git worktree remove` を実行する

**常にする:**

- メニュー提示前に環境を検出する
- 正確に 4 選択肢を提示する (detached HEAD なら 3)
- Option 4 では typed confirmation を得る
- worktree cleanup は Options 1 と 4 のみ
- worktree 削除前に main repo root へ `cd` する
- 削除後に `git worktree prune` を実行する
