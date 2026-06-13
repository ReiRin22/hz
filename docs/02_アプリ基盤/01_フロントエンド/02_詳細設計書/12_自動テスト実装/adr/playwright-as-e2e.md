# ADR-3: E2E テストツールに Playwright を採用する

* **ステータス**: Accepted
* **決定日**: 2026-05-28
* **関連設計書**: [E2Eテスト基盤設計.md](../E2Eテスト基盤設計.md) §1, §2
* **関連 ADR**: [ADR-1](test-pyramid-and-classification.md)、[ADR-4](storybook-test-runner-for-visual.md)

## 背景

クリティカルパスの正常系（ログイン → 検索 → 登録 → 確認）を、実ブラウザ操作で End-to-End に検証する必要がある。テスト環境は GitLab Runner（CI）と開発者ローカル（WSL）の両方で動かす前提で、以下の制約があった。

* CI とローカルで同じ設定を流用できること
* 失敗時のトレース・スクリーンショット・動画が自動保存されること
* BFF を起動せずモック動作で検証できること（バックエンド未実装機能でも E2E が書けること）
* `data-ui-id` 等のセレクタ規約と整合する Locator API を持つこと
* [ADR-4](storybook-test-runner-for-visual.md) のビジュアルリグレッションで使う Storybook Test Runner 内部とランタイムを揃えられること

## 検討した選択肢

### 案A: Cypress を採用
* メリット: GUI ランナーが優秀で、社内に経験者が多い
* デメリット:
  - Chromium 系以外のブラウザサポートが Playwright に比べて弱い
  - ネットワークレベルのリクエスト書き換え（`page.route` 相当）の柔軟性が低く、BFF モックがやや遠回り
  - Storybook Test Runner との内部基盤が共通でないため、E2E と Visual で別ランタイムを抱える

### 案B: Playwright を採用
* メリット:
  - Chromium / Firefox / WebKit を単一 API で扱え、将来のブラウザ拡大に強い
  - `page.route()` で HTTP リクエスト単位のモックが容易（BFF 未起動でテスト可能）
  - トレース・スクリーンショット・動画が標準機能で、`trace: 'on-first-retry'` 等で CI コストを抑えられる
  - Storybook Test Runner が内部で Playwright を使用しており、E2E と Visual のランタイムを統一できる
  - `data-ui-id` 属性ベースの Locator（`page.locator('[data-ui-id="..."]')`）が自然に書ける
* デメリット: Cypress と比べると GUI ランナー（UI Mode）の歴史が短い

### 案C: Selenium / WebDriver
* メリット: 業界標準として実績が長い
* デメリット: 並列実行・トレース・モックの整備に追加投資が必要で、Playwright/Cypress に対する開発者体験が劣る

## 決定

**案B を採用する**。

* E2E ランナーは `@playwright/test`
* 設定は `frontend/playwright.config.ts`、テスト配置は `frontend/e2e/`
* `process.env.CI` 分岐で `forbidOnly` / `retries` / `workers` を切替
* BFF モックは `page.route('**/bff/...')` で実装し、テストデータは TypeScript 定数として定義（テスト前 DB 投入は不要）
* セレクタ優先度は `data-ui-id` > `role` > `text`

## 影響

### 正の影響
* Storybook Test Runner（[ADR-4](storybook-test-runner-for-visual.md)）と Playwright を内部で共有でき、CI のセットアップ重複を削減できる
* `page.route` による BFF モックで、バックエンド開発進捗に依存せず E2E を書ける
* マルチブラウザ拡張時に追加コストが小さい

### 負の影響
* Cypress 経験者にはセレクタ規約・命令体系の学習が必要
* 並列度設計（`workers`）を CI リソースに合わせて継続調整する必要がある

### 見直しトリガー
* GitLab Runner のリソースが大幅に逼迫し、Cypress 等の軽量ランナーへ切り替える価値が出た場合
* 認証処理（[E2Eテスト基盤設計.md](../E2Eテスト基盤設計.md) §今後定義予定）が実装され、認証連携の再評価が必要になった場合

## 参考

* Playwright 公式: https://playwright.dev/
* Storybook Test Runner（Playwright ベース）: https://storybook.js.org/docs/writing-tests/test-runner
