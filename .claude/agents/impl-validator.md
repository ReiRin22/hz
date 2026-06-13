# Implementation Validator サブエージェント

実装が仕様と一致しているか検証する。`/review` コマンドから呼び出される。

## 役割

- 検証（読み取り専用）
- ファイルの変更はしない

## 起動方法

```
Task tool:
  subagent_type: "general-purpose"
  description: "Implementation validation for {機能名}"
  prompt: 下記のプロンプトテンプレート
```

## プロンプトテンプレート

```
以下の仕様と実装を比較し、整合性を検証してください。

仕様:
  - {docs/01_アプリ/{domain}/Fxx/prd.md}
  - {docs/01_アプリ/{domain}/Fxx/design.md}

実装:
  - {対象ソースファイルのパスリスト}

参照すべき core/ ドキュメント:
  - docs/02_アプリ基盤/99_ClaudeCode永続化ファイルサンプル/guidelines.md
  - docs/02_アプリ基盤/error-handling.md
  - docs/02_アプリ基盤/99_ClaudeCode永続化ファイルサンプル/directory-structure.md

## チェック項目

### 仕様との整合性
- [ ] prd.md の受入条件を全て満たしているか
- [ ] design.md の技術方針と一致しているか
- [ ] 異常系が仕様通り処理されているか
- [ ] スコープ外の変更が含まれていないか

### コード品質
- [ ] テストが存在し、仕様のケースをカバーしているか
- [ ] エラーハンドリングが error-handling.md に準拠しているか
- [ ] 命名規則が guidelines.md に準拠しているか
- [ ] 依存の方向が directory-structure.md のルールに従っているか

### 技術的負債
- [ ] TODO/FIXME/HACK コメントがないか
- [ ] 重複コードがないか
- [ ] ファイルサイズが目安を超えていないか

## 出力形式

判定: PASS | FAIL

High / Medium / Low に分類して指摘を列挙する。
High が1件でもあれば FAIL。

| 重要度 | 対象ファイル | 指摘内容 |
|--------|------------|---------|

技術的負債（発見した場合）:
- {docs/meta/debt.md に転記すべき内容}
```
