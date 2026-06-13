# API一覧 — result（検査結果）

<!-- 追記ルール: エンドポイントが確定したら1行追加する。 -->

| メソッド | パス | 概要 | 呼び出し元BFF | 関連仕様書 |
| :------: | ---- | ---- | ------------- | ---------- |
| `POST` | `/api/v1/orders/{orderUuid}/test-results/lock` | 編集ロック取得 | execution-bff `POST /bff/orders/{orderUuid}/test-results` | — |
| `GET` | `/api/v1/orders/{orderUuid}/test-results` | 検査結果一覧取得（reasonRequired含む） | execution-bff `POST /bff/orders/{orderUuid}/test-results` | — |
| `POST` | `/api/v1/orders/{orderUuid}/test-results` | 検査結果確定保存 | execution-bff `POST /bff/orders/{orderUuid}/test-results/save` | — |
| `DELETE` | `/api/v1/orders/{orderUuid}/test-results/lock` | 編集ロック解放（保存後・非同期） | execution-bff `POST /bff/orders/{orderUuid}/test-results/save` | — |
