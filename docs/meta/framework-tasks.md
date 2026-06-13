# フレームワーク改善タスク

`framework-retro.md` で検出された問題を分析・タスク化し、優先度と対応時期を管理する。

---

## ステータス

| ステータス | 意味 |
|---|---|
| `未着手` | タスク化済み、未対応 |
| `進行中` | 対応作業中 |
| `完了` | 修正適用済み |

## 対応時期

| ラベル | 意味 |
|---|---|
| `今すぐ` | 修正内容が明確。動かす前に直すべき/直せる |
| `動かしてから` | 実プロジェクトで使わないと適切な修正が判断できない |

---

## 今すぐ

### T-01 design.md / design-drafter.md / INDEX.md のパスを実際の構造に統一
- **元RETRO**: R-03
- **ステータス**: 完了
- **修正箇所**: `.claude/commands/design.md` + `.claude/agents/design-drafter.md` + `docs/01_アプリ/INDEX.md`
- **修正内容**:
  - `design.md` コマンド内の `docs/spec/INDEX.md` → `docs/01_アプリ/INDEX.md`
  - `design.md` コマンド内の `docs/core/` → `docs/02_アプリ基盤/`
  - `design-drafter.md` の出力先 `docs/spec/{domain}/Fxx/design.md` → `docs/01_アプリ/{domain}/Fxx/design.md`
  - `design-drafter.md` の `docs/core/` 参照 → `docs/02_アプリ基盤/`
  - `INDEX.md` のドメインパス `docs/spec/{domain}/` → `docs/01_アプリ/{domain}/`

### T-02 /poc コマンドの CLAUDE.md フィールド名を正しい名称に修正
- **元RETRO**: R-06
- **ステータス**: 完了
- **修正箇所**: `.claude/commands/poc.md`（+ 他コマンドも確認）
- **修正内容**:
  - `active_feature` → `session_feature`
  - `phase` → `session_phase`
  - `progress` → `session_progress`
  - `design.md` / `implement.md` / `fix.md` も同様のフィールド名を使っていれば統一する

---

## 動かしてから

### T-03 アプリ基盤詳細設計の作成フロー・エージェントを整備
- **元RETRO**: R-02, R-04
- **ステータス**: 未着手
- **修正箇所**: `.claude/commands/design.md` + `.claude/agents/`（新規エージェント）
- **修正内容**:
  - `/design` コマンドにセクションD「アプリ基盤詳細設計（`/design 02_アプリ基盤/{component}/xxx`）」を追加
  - 入力: PoC報告書（report.md）の「詳細設計への引き継ぎ事項」+ ヒアリング
  - 出力先: `docs/02_アプリ基盤/{component}/02_詳細設計書/`
  - 専用エージェント（`infra-design-drafter` 等）の定義、または `core-design-drafter` の拡張
- **保留理由**: 成果物フォーマット・必要セクションは最初の1件を実際に作ってから確定する

### T-04 汎用エージェントをプロジェクト向けに調整する
- **元RETRO**: R-01
- **ステータス**: 未着手
- **修正箇所**: `.claude/agents/design-drafter.md` / `prd-drafter.md` / `spec-reviewer.md` / `design-validator.md` 等
- **保留理由**: `/design` フェーズを実際に動かして「どこが不足しているか」を確認してから調整する

### T-05 codebase-researcher の起動条件を実装済みフェーズに限定
- **元RETRO**: R-05
- **ステータス**: 未着手
- **保留理由**: 設計フェーズを動かして「空の報告が返る」問題が実際に発生するか確認してから修正する
