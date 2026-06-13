# API一覧 — master（マスタ参照）

<!-- 追記ルール: エンドポイントが確定したら1行追加する。 -->

| メソッド | パス | 概要 | 呼び出し元BFF | 関連仕様書 |
| :------: | ---- | ---- | ------------- | ---------- |
| `GET` | `/api/v1/master/units` | 単位マスタ取得 | execution-bff `POST /bff/orders/{orderUuid}/test-results`（Parallel） | — |
| `GET` | `/api/v1/master/modification-reasons` | 修正理由マスタ取得 | execution-bff `GET /bff/modification-reason` | — |
| `GET` | `/api/v1/master/test-items` | 検査項目マスタ検索 | master-bff `GET /bff/test-item/lists` | — |
