# 設計判断記録（ADR: Architecture Decision Records）

本フォルダは、11章「開発規律と品質管理」の詳細設計書から派生した「**なぜそう設計したか**」の記録を格納する。
詳細設計書は **What と How（決定済みの契約）** のみを記述し、**Why（決定の経緯・代替案・トレードオフ）** は本フォルダで管理する。

> 章ごとに `02_詳細設計書/{章番号}_{章名}/adr/` の構造で配置する。本フォルダは 11章配下のもの。

---

## ファイル命名規則

```
{kebab-case-slug}.md
```

- **slug**: 決定の対象を端的に表す英小文字＋ハイフン
- 章番号はフォルダ階層で表現するため、ファイル名に含めない

---

## 運用ルール

| ルール | 内容 |
|---|---|
| **不変原則** | Accepted な ADR の本文は原則変更しない。判断が変わった場合は新しい ADR を起こし、旧 ADR のステータスを `Superseded by [新ADR]` に更新する |
| **粒度** | 1判断 = 1ファイル。複数論点を1ファイルに混ぜない |
| **被参照優先** | 詳細設計書側に Why を書きたくなったら、まず該当 ADR を作成し、設計書からは1行で「根拠: [ADR-xx](adr/xxx.md)」とリンクする |
| **検索性** | ADR から詳細設計書へ、詳細設計書から ADR へ、双方向リンクを必ず維持する |

---

## ADR 一覧（本章）

| ADR | タイトル | ステータス | 決定日 |
|---|---|---|---|
| [ADR-1](prettier-trailing-comma-all.md) | Prettier `trailingComma` を `all` に設定する | Accepted | 2025-10-01 |
| [ADR-2](prettier-npm-and-vscode-extension.md) | Prettier は npm パッケージと VSCode 拡張機能の両方を併用する | Accepted | 2025-10-01 |
| [ADR-3](storybook-adoption.md) | UI コンポーネント開発に Storybook を採用する | Accepted | 2025-10-01 |
