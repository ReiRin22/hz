# ADR-1: 認証セッショントークンを HttpOnly Cookie に格納する

* **ステータス**: Accepted
* **決定日**: 2026-05-22
* **関連設計書**:
    * [セキュリティミドルウェア設計.md](../セキュリティミドルウェア設計.md) §2.3
    * [XSS対策設計.md](../XSS対策設計.md) §1.1
* **関連 ADR**: [04_状態管理設計/adr/auth-no-persist.md](../../04_状態管理設計/adr/auth-no-persist.md)（authStore に persist を採用しない判断と一体）

## 背景

電子カルテはマルチテナントの医療情報（PHI）を扱うため、XSS による認証トークン窃取は重大な情報漏洩事故に直結する。

ブラウザでトークンを保管する候補として `localStorage` / `sessionStorage` / Cookie がある。`localStorage` / `sessionStorage` は JavaScript から読み取り可能であるため、XSS 攻撃時にスクリプトが認証トークンを直接窃取できてしまう。

認証基盤連携サービス方式設計書 2.1.2.9 の認証情報の保管要件と整合させる必要がある。

## 検討した選択肢

### 案A: localStorage に AT/RT を保管
* **メリット**: ブラウザリロード後の認証状態復元が即座（API 呼び出し不要）。
* **デメリット**: XSS 攻撃時に JavaScript からトークンを直接読み取れる。攻撃者は CSRF を組み合わせる必要すらなく、API を直接呼び出せる。

### 案B: sessionStorage に AT を保管
* **メリット**: タブを閉じれば消える。
* **デメリット**: タブ生存期間中は XSS から読み取れるため案A と同等のリスク。

### 案C: HttpOnly Cookie でセッション/RT を BFF が管理し、JavaScript からは触れない
* **メリット**: XSS でも JavaScript から Cookie を読み取れない。トークン窃取被害が物理的に発生しない。`SameSite=Strict` も同時に効くため CSRF 補助にもなる。
* **デメリット**: Cookie が自動送信されるため CSRF 対策（[adr/csrf-double-submit.md](csrf-double-submit.md)）を別途必要とする。BFF 側で Cookie 発行・検証実装が必要。

## 決定

**案C を採用する**。

* 認証セッション・リフレッシュトークン (RT) は `HttpOnly + Secure + SameSite=Strict` Cookie で BFF が発行・管理する。
* `localStorage` / `sessionStorage` への認証情報保管を完全に禁止する（運用方法は [セキュリティ基盤規約.md](../セキュリティ基盤規約.md) §2.3 に集約）。
* CSRF 対策として Double Submit Cookie パターン（[ADR-2](csrf-double-submit.md)）を併用する。
* AT のメモリ保持と RT 再発行フローは [04_状態管理設計/adr/auth-no-persist.md](../../04_状態管理設計/adr/auth-no-persist.md) を参照。

## 影響

### 正の影響
* XSS 被害時の認証トークン窃取が物理的に不可能となる。
* `SameSite=Strict` により CSRF 攻撃の主要ベクターを遮断できる（CSRFトークンと二重防御）。
* 認証情報の保管位置が BFF Cookie に集中し、フロントの状態管理が単純化する。

### 負の影響
* Cookie が自動送信されるため、CSRF 対策ミドルウェアの実装が必須となる。
* ローカル開発環境で Cookie 動作（特に `Secure` / `SameSite`）の検証が複雑化する（HTTPS 必須等）。
* 異なるサブドメイン構成（フロント・BFF を別ドメインで運用する場合）では Cookie の Domain 属性設計が必要。

### 見直しトリガー
* CSP / Trusted Types 等で XSS リスクが構造的に低減できた場合は、UX 重視の保管方式（メモリ + IndexedDB 等）を再検討する余地がある（要 ADR 起票）。
* 認証基盤の仕様変更で Cookie ベース認証が利用できなくなった場合、Authorization ヘッダー方式 + メモリ保管への変更が必要。

## 参考

* 認証基盤連携サービス方式設計書 2.1.2.9
* OWASP: HTML5 Security Cheat Sheet — Local Storage / Cookies
* フロントエンド方式設計書「4.セキュリティ・アクセス統制」4.4節
* [04_状態管理設計/adr/auth-no-persist.md](../../04_状態管理設計/adr/auth-no-persist.md)
