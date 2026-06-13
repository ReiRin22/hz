# 設計判断記録（ADR: Architecture Decision Records）

本フォルダは、09章「監視・エラーハンドリング設計」の詳細設計書から派生した「**なぜそう設計したか**」の記録を格納する。
詳細設計書は **What と How（決定済みの契約）** のみを記述し、**Why（決定の経緯・代替案・トレードオフ）** は本フォルダで管理する。

---

## ファイル命名規則

```
{kebab-case-slug}.md
```

* **slug**: 決定の対象を端的に表す英小文字＋ハイフン
* 章番号はフォルダ階層で表現するため、ファイル名に含めない

---

## ADR テンプレート

各 ADR ファイルは以下のセクション構成に従う。

```markdown
# ADR-{連番}: {決定内容の要約}

* **ステータス**: Accepted / Superseded by [...] / Deprecated
* **決定日**: YYYY-MM-DD
* **関連設計書**: [{設計書名}](../{設計書名}.md) §X.Y
* **関連 ADR**: [yyy.md](yyy.md)（あれば）

## 背景（Context）
## 検討した選択肢（Options）
## 決定（Decision）
## 影響（Consequences）
## 参考（References）
```

連番は本フォルダ内（章内）でゼロパディングなしの単純連番（`ADR-1`, `ADR-2`, ...）とする。

---

## 運用ルール

| ルール | 内容 |
|---|---|
| **不変原則** | Accepted な ADR の本文は原則変更しない。判断が変わった場合は新 ADR を起こし、旧 ADR のステータスを `Superseded by [新ADR]` に更新する |
| **粒度** | 1判断 = 1ファイル。複数論点を1ファイルに混ぜない |
| **被参照優先** | 詳細設計書側に Why を書きたくなったら、まず該当 ADR を作成し、設計書からは1行で「根拠: [ADR-xx](adr/xxx.md)」とリンクする |
| **検索性** | ADR から詳細設計書へ、詳細設計書から ADR へ、双方向リンクを必ず維持する |

---

## 詳細設計書との関係

| 文書 | 内容 | 読者 |
|---|---|---|
| **詳細設計書**（本フォルダの親）| 決定済みの I/F・データ構造・シーケンス | 基盤実装者・保守者・アプリチーム |
| **ADR**（本フォルダ） | 決定の Why・代替案・トレードオフ | 仕様変更を検討する人・将来の保守者 |
| **規約**（`監視エラーハンドリング規約.md`） | アプリ実装が守る Do/Don't | アプリチーム・アプリ Claude Code |

---

## ADR 一覧（本章）

| ADR | タイトル | ステータス |
|---|---|---|
| [ADR-1](glitchtip-adoption.md) | エラー監視ツールに GlitchTip（Sentry 互換 OSS）を採用する | Accepted |
| [ADR-2](global-error-boundary-only.md) | Error Boundary はグローバル一段に集約する | Accepted |
| [ADR-3](rfc-9457-localization.md) | BFF エラーレスポンスを RFC 9457 ベースにプロジェクトローカライズする | Accepted |
| [ADR-4](exclude-business-errors.md) | 業務エラー（バリデーション）を GlitchTip 送信対象外とする | Accepted |
| [ADR-5](zod-custom-as-invalid-format.md) | Zod の `custom`（superRefine）を `INVALID_FORMAT` 固定にマッピングする | Accepted |
| [ADR-6](frontend-error-codes.md) | フロント E-code は `errors[].code` から内部マッピングで導出する | Accepted |
| [ADR-7](phi-filter-whitelist.md) | PHI フィルタを `beforeSend` ホワイトリスト方式で行う | Accepted |
| [ADR-8](breadcrumbs-vs-audit-log.md) | Breadcrumbs と 14章操作ログを別経路にする | Accepted |
| [ADR-9](tenant-id-acquisition.md) | `tenant_id` の取得方式をエラー経路ごとに分ける | Accepted |
