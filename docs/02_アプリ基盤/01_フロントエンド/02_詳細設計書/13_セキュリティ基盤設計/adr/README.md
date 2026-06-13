# 設計判断記録（ADR: Architecture Decision Records）

本フォルダは、13章「セキュリティ基盤設計」の詳細設計書から派生した「**なぜそう設計したか**」の記録を格納する。
詳細設計書は **What と How（決定済みの契約）** のみを記述し、**Why（決定の経緯・代替案・トレードオフ）** は本フォルダで管理する。

> 章ごとに `02_詳細設計書/{章番号}_{章名}/adr/` の構造で配置する。本フォルダは 13章配下のもの。

---

## ファイル命名規則

```
{kebab-case-slug}.md
```

* **slug**: 決定の対象を端的に表す英小文字＋ハイフン。
* 章番号はフォルダ階層で表現するため、ファイル名に含めない。

例:
* `httponly-cookie.md` — 認証セッション/RT は HttpOnly Cookie に格納する判断
* `csrf-double-submit.md` — CSRF対策に Double Submit Cookie パターンを採用する判断
* `xss-defense-in-depth.md` — XSS 多層防御で React 自動エスケープを主防御層とする判断

---

## ADR テンプレート

各 ADR ファイルは以下のセクション構成に従う。

```markdown
# ADR-{連番}: {決定内容の要約}

* **ステータス**: Accepted / Superseded by [...] / Deprecated
* **決定日**: YYYY-MM-DD
* **関連設計書**: [XSS対策設計.md](../XSS対策設計.md) §X.Y
* **関連 ADR**: [yyy.md](yyy.md)（あれば）

## 背景（Context）

何が課題で、何を判断する必要があったか。前提条件・制約・関連する外部仕様を記載する。

## 検討した選択肢（Options）

### 案A: ...
* メリット
* デメリット

### 案B: ...

## 決定（Decision）

採用した案と、その採用理由。否定した案がなぜ落ちたかも明記する。

## 影響（Consequences）

決定によって生じる正負の帰結。将来見直すべきトリガー条件があれば書く。

## 参考（References）

外部ドキュメント・仕様書・社内議事録等。
```

連番は本フォルダ内（章内）でゼロパディングなしの単純連番（`ADR-1`, `ADR-2`, ...）とする。複数章をまたぐ判断は最初に登場した章の ADR フォルダに置き、他章からはリンクで参照する。

---

## 運用ルール

| ルール | 内容 |
|---|---|
| **不変原則** | Accepted な ADR の本文は原則変更しない。判断が変わった場合は新しい ADR を起こし、旧 ADR のステータスを `Superseded by [新ADR]` に更新する |
| **粒度** | 1判断 = 1ファイル。複数論点を1ファイルに混ぜない |
| **被参照優先** | 詳細設計書側に Why を書きたくなったら、まず該当 ADR を作成し、設計書からは1行で「根拠: [ADR-xx](adr/xxx.md)」とリンクする |
| **検索性** | ADR から詳細設計書へ、詳細設計書から ADR へ、双方向リンクを必ず維持する |

---

## 詳細設計書との関係

| 文書 | 内容 | 読者 |
|---|---|---|
| **詳細設計書**（本フォルダの親）| 決定済みの I/F・データ構造・シーケンス | 基盤実装者・保守者・アプリチーム |
| **ADR**（本フォルダ） | 決定の Why・代替案・トレードオフ | 仕様変更を検討する人・将来の保守者 |
| **規約**（`セキュリティ基盤規約.md`） | アプリ実装が守る Do/Don't | アプリチーム・アプリ Claude Code |

詳細設計書には「なぜなら…」「…のため」といった経緯記述を原則書かない。安全側に倒した判断（例: HttpOnly Cookie を採用する理由）など、**設計が後退するリスクを抑える必要がある場合のみ**、設計書本文に1〜2行の根拠と ADR へのリンクを残してよい。

---

## ADR 一覧（本章）

| ADR | タイトル | 決定日 | ステータス |
|---|---|---|---|
| [ADR-1](httponly-cookie.md) | 認証セッショントークンを HttpOnly Cookie に格納する | 2026-05-22 | Accepted |
| [ADR-2](csrf-double-submit.md) | CSRF対策に Double Submit Cookie パターンを採用する | 2026-05-22 | Accepted |
| [ADR-3](xss-defense-in-depth.md) | XSS 多層防御で React 自動エスケープを主防御層とする | 2026-05-22 | Accepted |
| [ADR-4](frame-embedding-prohibited.md) | iframe 埋め込みを完全禁止する（X-Frame-Options DENY + frame-ancestors 'none'） | 2026-05-22 | Accepted |
| [ADR-5](csp-style-unsafe-inline.md) | CSP styleSrc に `'unsafe-inline'` を許容する | 2026-05-22 | Accepted |
