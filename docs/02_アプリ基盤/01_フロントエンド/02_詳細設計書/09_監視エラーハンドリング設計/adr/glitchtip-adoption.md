# ADR-1: エラー監視ツールに GlitchTip（Sentry 互換 OSS）を採用する

* **ステータス**: Accepted
* **決定日**: 2026-05-22
* **関連設計書**: [GlitchTip連携設計.md](../GlitchTip連携設計.md) §1
* **関連 ADR**: [phi-filter-whitelist.md](phi-filter-whitelist.md)（PHI 削除戦略と一体）

## 背景

電子カルテはマルチテナントの医療情報（PHI）を扱うため、エラー監視ツールへ送信されるイベントに PHI が混入することは重大な漏洩事故に直結する。
SaaS 型エラー監視（Sentry.io 等）は外部にイベントを送信するため、PHI 含有可能性のあるデータの管理境界を「ベンダーのデータセンター」に置くことになり、医療情報のホスティング条件・第三者監査要件と整合しない。
一方で Sentry 互換クライアント SDK のエコシステム（`@sentry/nextjs`、`@sentry/node` 等）は成熟しており、開発生産性の観点では Sentry SDK に依存したい。

## 検討した選択肢

### 案A: Sentry SaaS（sentry.io）
* **メリット**: ホスティング・スケール・運用の負担ゼロ。ダッシュボード機能が最も成熟
* **デメリット**: PHI 含有可能性のあるデータが外部送信されるため、医療情報のホスティング条件・第三者監査要件と整合しない。コストもユーザー数に比例して増加

### 案B: GlitchTip（Sentry 互換 OSS、自前ホスト）
* **メリット**: SDK・ダッシュボードのコア機能が Sentry 互換で `@sentry/nextjs` `@sentry/node` をそのまま使える。自前ホストにより PHI を社内境界に留められる
* **デメリット**: ダッシュボードの一部高度機能（Performance / Profiling 等）は Sentry SaaS より限定的。運用負担が発生する

### 案C: 独自エラー収集基盤
* **メリット**: 完全に要件最適化できる
* **デメリット**: 構築・保守コストが極めて大きい。SDK・ダッシュボードを自作する価値が乏しい

## 決定

**案B（GlitchTip）を採用する**。

* SDK は `@sentry/nextjs`（フロント）・`@sentry/node`（BFF）を使用する
* GlitchTip サーバー本体の構築・運用は別ドキュメント（[01_エラー監視ツール_GlitchTip設計.md](../../../05_システム監視・通知サービス/02_詳細設計書/01_エラー監視ツール_GlitchTip設計.md)）に委ねる
* PHI 含有可能性のあるフィールドは Sentry SDK の `beforeSend` フックで送信前に削除する（[ADR-7](phi-filter-whitelist.md)）

## 影響

### 正の影響
* PHI を社内境界内に留められる
* Sentry SDK エコシステムをそのまま利用できるため、開発生産性は SaaS と同等
* ライセンス・利用人数によるコスト増がない

### 負の影響
* GlitchTip サーバー（PostgreSQL・Redis・ワーカー）の構築・運用負担が発生する
* 一部の Sentry SaaS 専用機能（Profiling 等）は利用できない

### 見直しトリガー
* GlitchTip の互換性が `@sentry/nextjs` の最新バージョンに追従できなくなった場合
* 病院ホスティング条件が変更され、PHI を一定の保護下で外部送信できる体制が整った場合

## 参考

* GlitchTip 公式: https://glitchtip.com/
* Sentry SDK 公式: https://docs.sentry.io/
* [01_エラー監視ツール_GlitchTip設計.md](../../../05_システム監視・通知サービス/02_詳細設計書/01_エラー監視ツール_GlitchTip設計.md)
