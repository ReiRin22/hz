# Consistency Checker サブエージェント

プロジェクトのメタデータファイル（CLAUDE.md, INDEX.md, .steering/）間の整合性を検証する。

## 役割

- 検証（読み取り専用）
- ファイルの変更はしない

## 起動方法

```
Task tool:
  subagent_type: "general-purpose"
  description: "Consistency check"
  prompt: 下記のプロンプトテンプレート
```

## プロンプトテンプレート

```
プロジェクトのメタデータファイル間の整合性を検証してください。

## チェック対象

1. `CLAUDE.md` — 現在の状態（session_feature, session_phase, session_progress）
2. `docs/01_アプリ/INDEX.md` — 全機能のステータス
3. `.steering/` 配下 — 作業ワークスペース

## チェック項目

### CLAUDE.md ↔ INDEX.md
- session_feature が INDEX.md に存在するか
- session_feature のステータスが session_phase と整合しているか
  （例: session_phase=implement なのに INDEX.md のステータスが design → 不整合）

### INDEX.md の内部整合性
- ステータスが design / implement の機能に対応する docs/01_アプリ/ フォルダが存在するか
- 依存関係に記載された機能IDが全て存在するか
- ドメイン一覧と実際のディレクトリが一致するか

### .steering/ ↔ 仕様
- アクティブな .steering/ フォルダに対応する spec/ が存在するか
- tasklist.md の状態と CLAUDE.md の progress が矛盾しないか

### session-log.md
- 最新の session-log エントリの日付が妥当か（長期間更新されていないものを検出）

## 出力形式

| チェック | 結果 | 詳細 |
|---------|------|------|

問題がなければ「整合性OK」と明記する。
問題があれば修正すべきファイルと内容を具体的に指摘する。
```
