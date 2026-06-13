# ADR-2: テストランナーに Vitest を採用する

* **ステータス**: Accepted
* **決定日**: 2026-05-28
* **関連設計書**: [単体・コンポーネント・結合テスト基盤設計.md](../単体・コンポーネント・結合テスト基盤設計.md) §1, §2
* **関連 ADR**: [ADR-1](test-pyramid-and-classification.md)

## 背景

Unit / Component / Integration の 3 レベルを単一ランナーで賄える前提でテスト基盤を構築する。フロントエンドは Next.js（Vite ベースではないが React + ESM）で構成され、`front_bff_shared/` への参照（モノレポ・シンボリックリンク）と `tsconfig.json` のパスエイリアス（`@/...`）をテスト環境でも維持する必要がある。

## 検討した選択肢

### 案A: Jest を採用
* メリット: 採用実績が豊富。社内ナレッジが多い。React Testing Library とのドキュメント整備が長い。
* デメリット:
  - ESM 対応が後追いで、`front_bff_shared/` のスキーマ（Zod、ESM 配布）を扱うときの設定が煩雑
  - `tsconfig.paths` のサポートが `ts-jest` / `@swc/jest` 等の追加ライブラリに依存
  - Watch モードの実行速度が Vitest 比で遅い
  - Vite ベースの Storybook 設定（[ADR-4](storybook-test-runner-for-visual.md)）と設定が分かれる

### 案B: Vitest を採用
* メリット:
  - ネイティブ ESM。Zod スキーマ・`front_bff_shared/` を素直に解決
  - `vite.config.ts` 系の設定（`resolve.alias` / `preserveSymlinks`）を流用でき、Storybook 側の設定とも整合する
  - Watch モード／HMR が高速で、医療データ変換ロジック等の高速イテレーションに有利
  - Jest 互換 API（`describe` / `it` / `expect`）+ `@testing-library/jest-dom` がそのまま使える
* デメリット: Jest と比較すると国内ナレッジが少ない。MSW + Vitest の組み合わせで一部の周辺ライブラリが追従途上のことがある

### 案C: Node.js 標準テストランナー（`node --test`）
* メリット: ランタイム同梱で外部依存が最小
* デメリット: jsdom 統合・カスタムマッチャー・ファイル監視 UI が貧弱で、コンポーネントテスト用途には未成熟

## 決定

**案B を採用する**。

* テストランナーは `vitest` に統一する
* 設定ファイルは `frontend/vitest.config.ts` に集約し、`test.environment: 'jsdom'`、`test.setupFiles: [...setup.ts]`、`resolve.preserveSymlinks: true`、`resolve.alias` に `@` を割り当てる
* セットアップ（`@testing-library/jest-dom` のインポート・`afterEach` クリーンアップ）は `frontend/src/shared/plugins/setup.ts` に集約する

## 影響

### 正の影響
* `front_bff_shared/` のシンボリックリンク経由参照がテスト時にも維持され、型と検証ロジックが本番と一致する
* Storybook（Vite）と設定構造が揃い、パスエイリアス・プラグインを共通化できる
* Watch モードが高速で、開発体験が向上する

### 負の影響
* Jest 前提のサンプル記事・OSS テンプレートを移植する場合、軽微な書き換えが必要
* Vitest 周辺の MSW 連携・Coverage プロバイダ（v8/istanbul）の選択責任を基盤チームが負う

### 見直しトリガー
* `front_bff_shared/` の配布形態が CommonJS のみになる等、ESM 前提が崩れた場合
* Jest 7 以降で ESM ネイティブ対応が大幅に改善し、Vitest の優位性が失われた場合

## 参考

* Vitest 公式: https://vitest.dev/
* `front_bff_shared/` のスキーマ共有方針（[03章 TypeScript型管理](../../03_TypeScript型管理/)）
