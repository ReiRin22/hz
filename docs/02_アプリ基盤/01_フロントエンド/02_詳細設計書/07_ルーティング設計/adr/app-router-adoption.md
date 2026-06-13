# ADR-1: App Router を採用する

* **ステータス**: Accepted
* **決定日**: 2025-10-01
* **関連設計書**: [ルーティング設計規約.md](../ルーティング設計規約.md) §1, §3 / [ルーティング構造設計.md](../ルーティング構造設計.md) §1
* **関連 ADR**: [01章 ADR: nextjs-16-adoption.md](../../01_フロントエンド・BFF共通基盤設計/adr/nextjs-16-adoption.md)

## 背景（Context）

本システムは500機能規模の医療システムであり、以下の要件を満たすルーティング設計が必要:
- 機能数の増加に伴うファイル管理の破綻を防ぐ
- 機密性の高い医療データ（APIキー等）のブラウザ側への露出リスクを低減する
- 独自の「LV1→LV2→LV3」階層構造をソースコード構造として直接表現する

## 検討した選択肢（Options）

### 案A: App Router（採用）

* **メリット**
  * Server Components により、APIキー等をサーバー側で安全に処理できる
  * `layout.tsx` のネスト機能でLV1/LV2/LV3の階層構造を直接表現できる
  * 各LV3ディレクトリ内にapi/components/hooks/storesを閉じ込めるカプセル化が可能
  * Streaming SSRによる段階的な画面表示（高速な初期表示）
* **デメリット**
  * Pages Routerより学習コストが高い
  * Server Components / Client Components の境界管理が必要

### 案B: Pages Router（見送り）

* **メリット**: チームの習熟度が高い場合に開発速度が出やすい
* **デメリット**
  * ファイルシステムベースのカプセル化がApp Routerより弱く、500機能規模で管理破綻のリスクがある
  * RSCがないため、すべてのデータフェッチがクライアントサイドになりやすい（セキュリティリスク）
  * Next.js 16時点でApp Routerが正式版として成熟しており、新規採用の理由がない

## 決定（Decision）

**案A: App Router を採用する。**

3つの採用理由:
1. **500機能の管理（カプセル化と疎結合）**: 各機能ディレクトリ（LV3）内に api/components/hooks/stores を閉じ込めるカプセル化により、大規模開発でのファイル管理の破綻を防ぎ、影響範囲を局所化できる
2. **医療データの整合性**: Server Components により、機密性の高いAPIキーなどをブラウザ側に露出させることなくサーバー側で安全に処理できる
3. **階層設計との親和性**: LV1→LV2→LV3という階層構造を、Next.jsのファイルシステムベースルーティングと `layout.tsx` のネスト機能で直感的に表現できる

## 影響（Consequences）

* **正**: Server Componentsによるセキュリティ向上、初期表示高速化、ディレクトリ構造の維持しやすさ
* **負**: `"use client"` 境界の管理コスト。チームメンバーへのApp Router教育が必要
* **見直しトリガー**: Next.jsがApp Routerを非推奨にした場合、またはPages Routerへの移行コストより大きなメリットが発生した場合

## 参考（References）

* [Next.js 16 App Router 公式ドキュメント](https://nextjs.org/docs/app)
* [01章 ADR: nextjs-16-adoption.md](../../01_フロントエンド・BFF共通基盤設計/adr/nextjs-16-adoption.md) — Next.js 16 バージョン選定の根拠
