# 設計判断記録（ADR: Architecture Decision Records）

本フォルダは、08章「リアルタイム通信設計」の詳細設計書から派生した「**なぜそう設計したか**」の記録を格納する。
詳細設計書は **What と How（決定済みの契約）** のみを記述し、**Why（決定の経緯・代替案・トレードオフ）** は本フォルダで管理する。

> 章ごとに `02_詳細設計書/{章番号}_{章名}/adr/` の構造で配置する。本フォルダは 08章配下のもの。

---

## ファイル命名規則

```
{kebab-case-slug}.md
```

* **slug**: 決定の対象を端的に表す英小文字＋ハイフン。
* 章番号はフォルダ階層で表現するため、ファイル名に含めない。

---

## ADR 一覧（本章）

| ADR | タイトル | ステータス |
|---|---|---|
| [ADR-1](socket-io-adoption.md) | リアルタイム通信基盤に Socket.io を採用 | Accepted |
| [ADR-2](delivery-unit-scope.md) | 配信単位をユーザー単位・テナント単位の2種に限定 | Accepted |
| [ADR-3](rest-websocket-separation.md) | REST API と WebSocket の役割分離（非破壊的アドオン設計） | Accepted |
