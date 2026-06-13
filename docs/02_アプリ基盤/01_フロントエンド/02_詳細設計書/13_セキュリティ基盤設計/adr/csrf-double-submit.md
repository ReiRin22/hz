# ADR-2: CSRF対策に Double Submit Cookie パターンを採用する

* **ステータス**: Accepted
* **決定日**: 2026-05-22
* **関連設計書**: [CSRF対策設計.md](../CSRF対策設計.md) §1.2
* **関連 ADR**: [httponly-cookie.md](httponly-cookie.md)（HttpOnly Cookie 採用と一体）

## 背景

認証セッションを HttpOnly Cookie で管理する方針（[ADR-1](httponly-cookie.md)）の結果、Cookie はブラウザが自動送信するため、悪意のあるサイトが本システムへ POST を仕掛ける CSRF 攻撃に対する対策が必要となる。

CSRF 攻撃の主要なリスクは「認証済みユーザーが意図しない操作（患者情報の変更・削除等）を強制される」こと。電子カルテとして患者データの完全性が損なわれる重大事故になり得る。

IPA「安全なウェブサイトの作り方」では CSRF 対策の根本的解決策として、ワンタイムトークンによる検証を推奨している。

## 検討した選択肢

### 案A: SameSite Cookie + CORS のみで対策
* **メリット**: 実装が軽量。CSRFトークン用ミドルウェア・エンドポイント不要。
* **デメリット**: SameSite は古いブラウザでサポートされない場合がある。CORS は Pre-flight が走らないリクエスト（`<form action>` POST 等）には効かない。IPA 推奨の根本的解決ではない。電子カルテとしての要求水準に対し防御層が薄い。

### 案B: Synchronizer Token Pattern（サーバーセッションでトークン管理）
* **メリット**: 強固。トークンがサーバー側にも保管されるため、ハイジャック耐性が高い。
* **デメリット**: ステートレスな BFF 設計と相性が悪い（セッションストレージが必要）。マルチインスタンス展開時に共有ストレージが必要。

### 案C: Double Submit Cookie（Cookie とヘッダーの双方にトークンを持たせ、BFF で照合）
* **メリット**: ステートレスに実装可能。フロント・BFF の Axios インターセプターで完全自動化できるため、アプリ実装者が意識不要。`SameSite=Strict` Cookie と組み合わせれば XSS でトークン窃取されてもクロスサイト送信できない。
* **デメリット**: Cookie 改竄耐性が SameSite に依存する（が、SameSite=Strict があれば実質的に問題なし）。

## 決定

**案C（Double Submit Cookie）を採用する**。

* BFF が `/api/csrf-token` で `XSRF-TOKEN` Cookie（`httpOnly: false`、`SameSite=Strict`）を発行。
* フロントの Axios インターセプターが POST/PUT/DELETE/PATCH 時に Cookie からトークンを読み出し、`X-CSRF-Token` ヘッダーに付与する。
* BFF のミドルウェアが Cookie とヘッダーのトークン一致を検証し、不一致なら 403 Forbidden。
* GET / HEAD / OPTIONS は副作用がないため検証対象外。
* 案A（SameSite + CORS のみ）は補助対策として併用する（保険的多層防御）。

## 影響

### 正の影響
* IPA 推奨の根本的解決策に準拠。セキュリティ監査での説明が容易。
* ステートレスに実装でき、BFF のスケールアウトに影響しない。
* アプリ実装者は `axiosClient` を経由するだけで全自動。CSRF を意識せず実装できる。

### 負の影響
* CSRFトークン発行エンドポイント・検証ミドルウェア・Axios インターセプターの実装と維持が必要。
* `httpOnly: false` Cookie が1つ増えるが、認証セッション本体ではないため漏洩しても影響は限定的。

### 見直しトリガー
* W3C Fetch Metadata（`Sec-Fetch-Site` 等）の普及により、ブラウザ側のクロスサイト判定が標準化された場合、CSRFトークン廃止を検討する余地がある（要 ADR 起票）。
* SameSite=Strict のサポートが全ブラウザで保証され、かつブラウザ側 CSRF 防御が標準化された段階で再評価。

## 参考

* IPA「安全なウェブサイトの作り方」CSRF 対策（根本的解決策）
* OWASP: Cross-Site Request Forgery Prevention Cheat Sheet
* [CSRF対策設計.md](../CSRF対策設計.md)
* [httponly-cookie.md](httponly-cookie.md)
