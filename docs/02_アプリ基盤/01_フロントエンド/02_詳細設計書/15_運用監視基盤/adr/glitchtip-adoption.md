# ADR-5: エラー監視ツールを GlitchTip（Sentry互換OSS）に確定する

* **ステータス**: Accepted
* **決定日**: 2026-06-01
* **関連設計書**: [フロントエンド性能監視設計.md](../フロントエンド性能監視設計.md) §1, [ログ・トレース連携設計.md](../ログ・トレース連携設計.md) §1
* **関連 ADR**: [sentry-tentative-adoption.md](sentry-tentative-adoption.md)（旧判断を本 ADR が覆す）, [sampling-rate-by-env.md](sampling-rate-by-env.md), [monitoring-layer-responsibility.md](monitoring-layer-responsibility.md)

## 背景

ADR-1 では「Sentry SaaS を仮採用し、セルフホスト型 OSS への移行余地を残す」と決定した。その後 09章の実装フェーズで、医療情報システムとして以下の判断が確定した:

* PHI 外部送信リスクの観点からクラウド SaaS（Sentry）は本採用できない
* GlitchTip（MITライセンス、Sentry互換OSS）がオンプレミス運用で同等機能を提供できることを PoC で確認
* `@sentry/nextjs` / `@sentry/node` SDK をそのまま使用できるため、コード変更が最小化される
* ADR-1 の「見直しトリガー：PHI 外部送信に関する規制要件が強化された場合」が実質的に確定した

## 検討した選択肢

### 案A: Sentry SaaS を本採用する
* **メリット**: 高機能、公式サポートあり、設定が容易。
* **デメリット**: PHI データが外部サーバーへ送信されるリスク。医療情報システムとして規制要件を満たせない可能性。SaaS コストが高い。

### 案B: GlitchTip（Sentry互換OSS）をオンプレミスで採用する
* **メリット**: データ主権確保（自社インフラ内にデータ保存）。Sentry SDK 互換のため実装変更が最小。MITライセンスでコスト効率が高い。
* **デメリット**: 商用サポートなし。インフラ運用コストが発生する。

### 案C: Grafana Faro を初期から採用する
* **メリット**: Prometheus/Loki/Grafana との統合監視が可能。
* **デメリット**: 現時点で成熟度が低い。`@sentry/nextjs` から SDK 変更が必要で実装コストが大きい。

## 決定

**案B（GlitchTip）を採用する**。

* エラー監視ツールを GlitchTip（Sentry互換OSS）に確定する
* SDK は `@sentry/nextjs`（フロントエンド）/ `@sentry/node`（BFF）を継続使用。設定ファイル（`SentryInitializer.tsx`）の DSN を GlitchTip のエンドポイントに向ける
* 性能監視（`tracesSampleRate`）も同一 SDK 経由で GlitchTip へ送信する
* 将来的に統合監視ニーズが高まった場合は Grafana Faro への移行を検討する（SDK 変更が必要）

## 影響

### 正の影響
* 医療情報システムとして PHI データを外部送信しないことを確実にできる
* Sentry SDK 互換のため、既存の `beforeSend` PHI フィルタリング・タグ付与実装をそのまま活用できる
* インフラコストのみで運用可能

### 負の影響
* GlitchTip コンテナの運用管理（バックアップ、バージョン管理）が必要
* 商用サポートがないため、障害時は OSS コミュニティ頼りとなる

### 見直しトリガー
* Grafana Faro が機能・成熟度面で GlitchTip と同等以上になり、統合監視の必要性が高まった場合
* GlitchTip OSS の開発が停止した場合

## 参考

* [09_監視エラーハンドリング設計/](../../09_監視エラーハンドリング設計/監視エラーハンドリング規約.md)
* [01_エラー監視ツール_GlitchTip設計.md](../../../../../05_システム監視・通知サービス/02_詳細設計書/01_エラー監視ツール_GlitchTip設計.md)
* [フロントエンド性能監視設計.md](../フロントエンド性能監視設計.md)
