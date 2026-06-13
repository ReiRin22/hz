# code-quality-reviewer プロンプトテンプレート

code-quality-reviewer のサブエージェントを派遣する時にこのテンプレートを使う。

**目的:** 実装がよく作られているか確認する。clean、tested、maintainable、**規約準拠**。

**仕様準拠レビューが通った後にだけ派遣する。**

```
Task tool (general-purpose):
  requesting-code-review/code-reviewer.md のテンプレートを使用

  DESCRIPTION: [タスクのサマリー、実装者のレポートから]
  PLAN_OR_REQUIREMENTS: [計画ファイル]からのタスクN
  BASE_SHA: [タスク前のコミット]
  HEAD_SHA: [現在のコミット]
  PHASE: [Phase 0〜10 のいずれか]
```

**標準的なコード品質の懸念に加えて、レビュアーは以下を確認すべき:**

- 各ファイルは明確に定義されたインターフェースを持つ1つの明確な責任を持っているか？
- ユニットは独立して理解およびテストできるように分解されているか？
- 実装は計画のファイル構造に従っているか？
- この実装は既に大きい新しいファイルを作成したか、または既存のファイルを大幅に成長させたか？（既存のファイルサイズにフラグを立てないでください — この変更が寄与したものに焦点を当てる。）
- **Phase ごとの規約に準拠しているか？**（下記参照）

---

## Phase ごとの規約確認（必須）

実装された Phase に応じて、規約ファイルを確認すること。

### /implement で呼ばれた場合

**規約ファイル一覧の参照先：**
- `.claude/commands/implement.md` の「0-1. 規約ファイルの存在確認」セクション
- Phase 0〜10 それぞれで確認すべき規約ファイルが記載されている

**確認手順：**
1. `implement.md` を Read して Phase {PHASE} の規約ファイル一覧を取得
2. 各規約ファイルを Read して実装が規約に準拠しているか確認
3. 加えて以下の共通規約も確認：
   - `.claude/rules/cross-layer-rules.md`（フロント・BFF・BE 横断ルール）
   - `.claude/rules/test-rules.md`（テスト設計ルール）

### /synchronizer で呼ばれた場合

**規約ファイル一覧の参照先：**
- `.claude/commands/synchronizer.md` の「0-1. 規約ファイルの存在確認」セクション
- Phase S0〜S9 それぞれで確認すべき規約ファイルが記載されている（整備予定）

**確認手順：**
1. `synchronizer.md` を Read して Phase {PHASE} の規約ファイル一覧を取得
2. 各規約ファイルを Read して実装が規約に準拠しているか確認
3. 加えて以下の共通規約も確認：
   - `.claude/rules/cross-layer-rules.md`（フロント・BFF・BE 横断ルール）
   - `.claude/commands/bff_structure.md`（BFF 構造ルール）

> **注意**: synchronizer.md の規約ファイルセクションは今後整備予定。
> 現在は `.claude/rules/sync-agents.md` と `bff_structure.md` を参照すること。

---

**規約違反の報告方法:**

規約違反を発見した場合、**Important** または **Critical** として報告すること:
- ファイル:行番号を明記
- 違反している規約の具体的な項目を引用
- なぜ規約違反が問題か説明
- 修正方法を提案

**コードレビュアーが返すもの:** 強み、問題（Critical/Important/Minor）、規約違反の有無、評価
