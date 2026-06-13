# ADR-7: PHI フィルタを `beforeSend` ホワイトリスト方式で行う

* **ステータス**: Accepted
* **決定日**: 2026-05-22
* **関連設計書**: [GlitchTip連携設計.md](../GlitchTip連携設計.md) §3.2, §4.4
* **関連 ADR**: [glitchtip-adoption.md](glitchtip-adoption.md)（GlitchTip 採用と一体）

## 背景

電子カルテはマルチテナントの医療情報（PHI: Protected Health Information）を扱い、エラー監視ツールへ送信されるイベントに PHI が混入することは重大な漏洩事故に直結する。
Sentry SDK は既定で `event.request.cookies` / `event.request.headers` / `event.user.email` 等を自動収集するため、何もしないと PHI 含有可能性のあるフィールドが GlitchTip に送信される。

## 検討した選択肢

### 案A: ブラックリスト方式（既知の PHI フィールドだけ削除）
* **メリット**: 必要最小限の削除で済む
* **デメリット**: 漏れが発生しやすい。新しい PHI フィールドが追加された際に都度フィルタを更新する運用負担が発生する。漏れ＝事故

### 案B: ホワイトリスト方式（既知の安全フィールド以外は全て削除）
* **メリット**: 漏れが構造的に発生しない（明示許可しないと送信されない）
* **デメリット**: 安全フィールドの登録漏れがあると、本来送信したかったフィールドが落ちる（事故ではないが運用調整が発生）

### 案C: 機械学習による PHI 検出
* **メリット**: 自動的に PHI を判定できる
* **デメリット**: ROI が見合わない。誤検知も発生する

## 決定

**案B（ホワイトリスト方式）を採用する**。Sentry SDK の `beforeSend` フックで以下の戦略を取る。

* `event.request.cookies`: 一律削除（セッション ID・認証トークン等の機密情報を含むため）
* `event.request.headers`: 一律削除（Authorization・X-User-Name 等の PHI 含有可能性）
* `event.user.email`: 一律削除（メールアドレスは PHI）
* `extra.body`（BFF のみ）: PHI マスク用正規表現パターン（`front_bff_shared/utils/phiPatterns.ts`）でホワイトリスト的にフィルタリング

許可フィールド（明示的に送信するもの）:
* `tags.tenant_id` / `tags.trace_id` / `tags.patient_id`（病院運用上の識別子。PHI 非該当）
* `user.id`（病院スタッフのシステム内 ID。PHI 非該当）
* `user.ip_address`（病院スタッフ端末情報。PHI 非該当）
* `extra.url` / `extra.method` / `extra.status` 等（HTTP メタ情報）

## 影響

### 正の影響
* PHI 漏れが構造的に発生しない
* `phiPatterns.ts` の更新は基盤チームの責務として明確化される
* PHI 判定の責務が `beforeSend` に集約される

### 負の影響
* 安全フィールドの登録漏れがあると、本来送信したかったフィールドが落ちる（運用調整発生）
* `extra.body` の PHI マスク正規表現の精度が GlitchTip イベントの有用性を左右する

### 見直しトリガー
* 病院ホスティング条件が変更され、PHI を含むデータの送信が許可された場合
* `phiPatterns.ts` の更新運用負担が想定を大きく上回った場合

## 参考

* OWASP: Logging Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
* Sentry: Filtering Events — https://docs.sentry.io/platforms/javascript/configuration/filtering/
* `front_bff_shared/utils/phiPatterns.ts`（実装ファイル）
