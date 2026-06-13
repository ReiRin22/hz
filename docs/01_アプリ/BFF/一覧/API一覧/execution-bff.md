# API一覧 — execution-bff（実施・結果）

<!-- 追記ルール: エンドポイントが確定したら1行追加する。 -->

| メソッド | パス | 概要 | 呼び出し元画面 | 関連仕様書 |
| :------: | ---- | ---- | -------------- | ---------- |
| `POST` | `/bff/orders/{orderUuid}/test-results` | 検査結果初期表示・編集ロック取得 | 【RES002】結果入力 | [BFF定義書_【RES002】結果入力](../../execution-bff/結果入力/BFF定義書_【RES002】結果入力.md) |
| `GET` | `/bff/test-items` | 検査項目マスタ検索（検索ダイアログ用） | 検査項目検索ダイアログ | [BFF定義書_【RES002】結果入力](../../execution-bff/結果入力/BFF定義書_【RES002】結果入力.md) |
| `GET` | `/bff/modification-reason` | 修正理由マスタ取得（修正理由ダイアログ用） | 検査結果修正理由ダイアログ | [BFF定義書_【RES002】結果入力](../../execution-bff/結果入力/BFF定義書_【RES002】結果入力.md) |
| `POST` | `/bff/orders/{orderUuid}/test-results/save` | 検査結果確定保存 | 【RES002】結果入力 | [BFF定義書_【RES002】結果入力](../../execution-bff/結果入力/BFF定義書_【RES002】結果入力.md) |
