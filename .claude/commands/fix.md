# /fix {{domain/Fxx_機能名}} {{概要}}

バグ修正・障害対応のフロー。PRDは不要だが、原因分析と回帰テストは必須。

**メインエージェントの役割は「判断」のみ。調査・検証はサブエージェントに委譲する。**
**人間への判断委譲は `Skill('common-decision-gate')` のプロトコルに従う。**

対象の例: `/fix auth/F01_login ログイン時に500エラー`

---

## セッション開始時

1. `CLAUDE.md` を読む
2. `Skill('common-decision-gate')` を意識する
3. `Skill('steering')` を読み込む

---

## 手順

### ステップ1: 影響分析 [サブエージェント: 調査]

| サブエージェント | 参照 | やること |
|---|---|---|
| **codebase-researcher** | `.claude/agents/codebase-researcher.md` | バグ関連の既存コードを調査 |
| **impact-analyzer** | `.claude/agents/impact-analyzer.md` | 修正による影響範囲を事前分析 |

※ 並列実行可。対象機能の仕様も同時に読む: `docs/01_アプリ/{domain}/Fxx/prd.md`, `design.md`

### ステップ2: 原因特定と方針決定 [メインエージェント: 判断]

- 調査結果をもとに原因を特定する
- `.steering/YYYYMMDD-fix-概要/` を作成する
- `requirements.md` にバグ概要・再現手順・スコープを記録する
- `design.md` に原因と修正方針を記録する

**[Gate: APPROACH]** 修正方針の選択:
```
header: "方針"
question: "原因: {原因の要約}。修正方針をどうしますか？"
options:
  - "{推奨する修正方針} (推奨)" / description: "{修正内容と影響範囲}"
  - "{代替の修正方針}" / description: "{トレードオフ}"
  - "/design に切り替える" / description: "仕様範囲外の変更が必要"
```

**[Gate: SCOPE]** 影響範囲が広い場合:
```
header: "スコープ"
question: "影響範囲: {影響範囲の要約}。このスコープで修正を進めてよいですか？"
options:
  - "このスコープでOK (推奨)"
  - "スコープを絞りたい"
  - "影響が大きいので /design に切り替える"
```

### ステップ3: 修正 + 回帰テスト [メインエージェント: 実装]

- **バグを再現するテストを先に書き、失敗を確認してから修正する**
- 修正を実装する
- 修正後、テストが通ることを確認する

### ステップ4: 修正検証 [サブエージェント: 検証]

| サブエージェント | 参照 | やること |
|---|---|---|
| **impl-validator** | `.claude/agents/impl-validator.md` | 修正が仕様と整合しているか検証 |
| **impl-reviewer** | `.claude/agents/app-impl-reviewer.md` | 修正コードのレビュー・`review-missing-perspectives.md` 更新 |

### ステップ5: 完了判断 [メインエージェント: 判断]

- 検証結果を確認する

**[Gate: PHASE]** 次のステップへの遷移:
```
header: "次のステップ"
question: "修正完了。検証結果: {結果の要約}。次のステップは？"
options:
  - "/review に進む (推奨)"
  - "追加の修正をする"
  - "一旦保留する"
```

通過後:
- `.steering/` の tasklist を更新する
- `session-log.md` にエントリを追記する
- 仕様変更が必要だった場合は `docs/01_アプリ/{domain}/Fxx/` も更新する
- 影響が2機能以上に及ぶ場合は ADR を作成する
- CLAUDE.md を更新する

---

## ルール

- 仕様の範囲外の変更が必要な場合は `/design` に切り替える
- 「ついでにリファクタリング」は禁止。バグ修正のみに集中する
- 修正完了後 `/review` を実行する
