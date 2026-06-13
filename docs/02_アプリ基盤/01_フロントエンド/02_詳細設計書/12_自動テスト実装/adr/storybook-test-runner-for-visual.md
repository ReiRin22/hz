# ADR-4: ビジュアルリグレッションに Storybook + Test Runner を採用する

* **ステータス**: Accepted
* **決定日**: 2026-05-28
* **関連設計書**: [ビジュアルリグレッションテスト基盤設計.md](../ビジュアルリグレッションテスト基盤設計.md) §1, §2
* **関連 ADR**: [ADR-1](test-pyramid-and-classification.md)、[ADR-3](playwright-as-e2e.md)

## 背景

UI コード変更による意図しない見た目の変化（フォントずれ・余白崩れ・色相変化）を自動検出する仕組みが必要。電子カルテはマスタ・一覧・フォーム等の UI 部品が多数あり、Atomic Design（[05章 コンポーネント設計](../../05_コンポーネント設計/)）で Atoms/Molecules/Organisms に階層化されている。

要件:

* デザイナー/エンジニアの双方が単独コンポーネントの状態を確認できるカタログ機構があること
* PR で変更したコンポーネントを CI が自動検出し、差分画像をアーティファクトに残せること
* MSW で API 通信を含む状態（Empty / Success / Error）も検証できること
* アクセシビリティ（a11y）の自動チェックが組み込めること
* E2E（[ADR-3](playwright-as-e2e.md)）と CI 基盤を共通化できること

## 検討した選択肢

### 案A: Chromatic SaaS（Storybook 公式）を採用
* メリット: ベースライン管理・差分承認 UI が SaaS で完結する
* デメリット:
  - 医療データを扱うため、画像を外部 SaaS にアップロードする運用は情報管理ポリシー上のハードルが高い
  - 月額コストがコンポーネント数に応じて増加する
  - GitLab Runner 主体の自社 CI 運用と承認フローが二重化する

### 案B: Storybook + Storybook Test Runner（Playwright ベース、自社 GitLab Runner で実行）
* メリット:
  - Story ファイル（`*.stories.tsx`）でコンポーネントカタログとビジュアルリグレッションを兼ねられる
  - ベースライン画像を自社（MBC サーバー）で保管でき、外部 SaaS への医療関連 UI 流出を回避
  - `msw-storybook-addon` で API モック状態を Story として定義できる
  - `@storybook/addon-a11y` でアクセシビリティ検証を同梱できる
  - 内部で Playwright を使うため、E2E（[ADR-3](playwright-as-e2e.md)）と CI ランタイム・トレース基盤を共通化
* デメリット: 差分承認フロー・ベースライン更新の運用設計を自社で組む必要がある

### 案C: Playwright のスクリーンショット比較を直接利用
* メリット: 追加ライブラリ不要
* デメリット:
  - コンポーネント単位の状態を網羅するカタログ機構が無く、差分起点の特定が困難
  - デザイナー連携用の Story ビューを別途用意する必要がある
  - a11y addon 等のエコシステムが使えない

## 決定

**案B を採用する**。

* ランタイム: `@storybook/react-vite` + `@storybook/test-runner`
* 設定: `frontend/.storybook/main.ts`（stories パターン・addons・aliases）と `frontend/.storybook/preview.ts`（mswLoader・a11y parameter）
* MSW 連携: `msw-storybook-addon` の `mswLoader` を `preview.ts` の loaders に登録
* ベースライン保管: MBC サーバー（暫定）。将来は AWS S3 等のマネージド S3 系を検討
* 命名規則: `features/{LV1}/{LV2}/{LV3}/{Atomic}/{Component}/{Story名}.png`
* 差分承認: GitLab アーティファクトで差分画像を確認 → 承認後 `--update-snapshots` で再生成 → MBC サーバーへ自動アップロード

## 影響

### 正の影響
* ベースライン画像が社内インフラに留まり、医療関連 UI の SaaS 流出を回避できる
* Story を「カタログ + テスト + a11y チェック」の 3 役で再利用でき、メンテナンス対象を最小化できる
* Playwright を E2E と Visual で共有でき、CI セットアップが統一される

### 負の影響
* 差分承認 UI を独自に運用する必要があり、初期構築コストが Chromatic より高い
* ベースライン保管先が MBC サーバー暫定運用のままだと、ストレージ・バックアップ責任が長期化する

### 見直しトリガー
* MBC サーバーから AWS S3 等のマネージドサービスへの移行が決まった場合（保管経路の変更）
* Storybook Test Runner の保守が停滞した場合（代替: Playwright 単独 + 自前 Story ローダー）
* 情報管理ポリシーが見直され、SaaS 利用が許容された場合は Chromatic 再評価

## 参考

* Storybook 公式: https://storybook.js.org/
* Storybook Test Runner: https://storybook.js.org/docs/writing-tests/test-runner
* msw-storybook-addon: https://github.com/mswjs/msw-storybook-addon
