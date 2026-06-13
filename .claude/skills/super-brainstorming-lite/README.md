# super-brainstorming-lite

実装前の設計確認スキル。/implement コマンドの Phase 0 開始前に使用する。

## 概要

設計書の内容から実装方針を対話的に確認し、実装のズレを防ぐ。

```
/implement {domain}/Fxx_機能名
  ↓
steering スケルトン作成
  ↓
Skill('super-brainstorming-lite') ← ここで使う
  ├─ 1. プロジェクトコンテキスト探索
  ├─ 2. 実装スコープ確認 [Gate: SCOPE]
  ├─ 3. 技術選択確認 [Gate: APPROACH]
  ├─ 4. ファイル構造確認 [Gate: CONFIRM]
  └─ 5. 実装方針確認 [Gate: CONFIRM]
  ↓
テスト計画
  ↓
タスク分解
  ↓
Phase 0〜10 実装
```

## ファイル構成

```
.claude/skills/super-brainstorming-lite/
├── SKILL.md                    # スキル本体
├── README.md                   # このファイル
├── visual-companion_ja.md      # ビジュアルコンパニオンガイド
└── scripts/                    # ビジュアルコンパニオンスクリプト
    ├── start-server.sh
    ├── stop-server.sh
    ├── server.cjs
    ├── frame-template.html
    └── helper.js
```

## 使い方

### 1. 自動起動（推奨）

`.claude/commands/implement.md` に統合済みの場合、自動的に起動される。

### 2. 手動起動

```
Skill('super-brainstorming-lite')
```

## 出力

- `.steering/YYYYMMDD-機能名/design.md` — 実装方針を記録
- `.steering/YYYYMMDD-機能名/tasklist.md` — Phase 一覧を追記

## いつ使うか

**必須:**
- フロントエンド機能の実装（UI/UX が関わる）
- 複数の技術選択肢がある機能
- ファイル構造が複雑な機能

**スキップ:**
- API のみの機能
- バグ修正（既存仕様の範囲内）
- 設計書が存在しない場合

## オプション: ビジュアルコンパニオン

UI 機能の場合、モックアップやレイアウトをブラウザで確認できる。

**使用条件:**
- フロントエンド機能
- レイアウト・配置の選択肢がある
- ユーザーが承認した場合

**起動:**

```bash
.claude/skills/super-brainstorming-lite/scripts/start-server.sh --project-dir /home/ke-watanabe/harz2
```

詳細: `visual-companion_ja.md`

## implement.md への統合方法

`.claude/commands/implement.md` のステップ0 と ステップ1 の間に追加:

```markdown
#### ステップ0.5: 実装前設計確認 [Skill: super-brainstorming-lite]

**トリガー条件:**
- 設計書が存在する
- フロントエンド実装を含む機能

**スキップ条件:**
- API のみの機能
- バグ修正
- 設計書が存在しない

**実行:**

\`\`\`
Skill('super-brainstorming-lite')
\`\`\`

出力:
- `.steering/YYYYMMDD-機能名/design.md`
- `.steering/YYYYMMDD-機能名/tasklist.md`
```

## 参考

- 元のスキル: `super/tmp/superpowers/skills/brainstorming/`
- 統合プラン: `docs/meta/brainstorming-migration-plan.md`
- スキルフロー: `docs/meta/superpowers-skill-flow.md`
