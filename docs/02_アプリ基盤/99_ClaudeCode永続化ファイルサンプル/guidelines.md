# 開発規約

> 最終更新: 2026-03-19

フロントエンド/BFFの詳細設計は `docs/core/frontend/` を参照すること。
本ファイルはプロジェクト全体の規約サマリーとして機能する。

## コーディングスタイル

以下の3層構造で静的テストを実施する。詳細 → [11.開発規律と品質管理.md](frontend/11.開発規律と品質管理.md)

| 分類 | ツール | 役割 |
|------|--------|------|
| 静的型解析 | TypeScript (`strict: true`) | 型定義の不整合・null安全の強制 |
| 構文解析 | ESLint | `any`型禁止・未使用変数検知・React Hooks誤用防止 |
| コード整形 | Prettier | インデント・改行・セミコロンの自動統一 |

- **`any`型は原則禁止**。型定義不明な場合は `unknown` + 型ガードを使用する
- 実行タイミング: 保存時（IDE）+ コミット前（husky + lint-staged）+ CI（GitLab Pipeline）

## 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| ディレクトリ | kebab-case | `user-profile/` |
| コンポーネントファイル | PascalCase | `UserProfileCard.tsx` |
| ユーティリティ・フックファイル | camelCase | `useUserUpdate.ts` |
| APIファイル | camelCase + `.api.ts` | `getUserProfile.api.ts` |
| 型定義ファイル | `OO.type.ts` | `user.type.ts` |
| スキーマファイル | `OO.schema.ts` | `user.schema.ts` |
| 変数・関数 | camelCase | `getUserById` |
| Reactコンポーネント | PascalCase | `UserProfileCard` |
| 型・インターフェース | PascalCase | `UserViewModel` |
| 定数 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |

## アーキテクチャ規約

- **型共有**: BFF通信用の型はフロントで独自定義（二重定義）禁止。必ず `front_bff_shared` を経由する
- **page.tsx**: 必ず Server Component として実装。BFFからデータ取得しOrganismへ渡す
- **`'use client'`**: `useState`/`useEffect`/イベントリスナー/ブラウザAPIを使う最小単位にのみ付与する
- **状態管理**: サーバー状態はReact Query、UI状態はZustand。フォーム状態はReact Hook Form
- **API通信**: axiosClientを経由する。直接の `fetch` や `axios` インスタンス生成は禁止

詳細 → [07a.ルーティングとレンダリング設計方針.md](frontend/07a.ルーティングとレンダリング設計方針.md)

## テスト規約

詳細 → [12.自動テスト実装.md](frontend/12.自動テスト実装.md)

- Unit/UIテスト: Vitest + React Testing Library + MSW
- テストファイルはコロケーション配置（LV3 `test/` ディレクトリ内）
- 命名: `OO.test.tsx`（単体）、`OO.flow.test.tsx`（結合・操作フロー）
- 共通部品のテストは `_test/` に配置
- E2Eテスト: TODO

## セキュリティ規約

詳細 → [13.セキュリティ基盤設計.md](frontend/13.セキュリティ基盤設計.md)

- 患者情報（PHI）をログに出力しない。Sentryのマスク処理を必ず通す
- ユーザー入力はZodスキーマでバリデーションする
- DOMPurifyでHTMLをサニタイズする（XSS対策）
- 認可チェックはBFF側で行う。フロントの表示制御のみに依存しない

## Git運用

### ブランチ戦略

```
main          ← 本番リリースブランチ
develop       ← 統合ブランチ
feature/{issue番号}-{概要}   ← 機能開発
fix/{issue番号}-{概要}       ← バグ修正
```

### コミットメッセージ

```
{type}: {概要（日本語可）}

type: feat / fix / refactor / test / docs / chore / style
```

### PR

- タイトル: コミットメッセージと同形式
- 本文: 変更の背景・影響範囲・スクリーンショット（UI変更時）
- マージ条件: レビュー承認1名以上 + GitLab CI パス

## コードレビュー基準

| 観点 | 確認すること |
|------|------------|
| 正確性 | PRDの受入条件を満たしているか |
| 型安全 | `any`型がないか。Zodスキーマと型が整合しているか |
| 可読性 | 命名は適切か。ロジックの意図が読み取れるか |
| 責務 | ファイル配置ルール（directory-structure.md）に従っているか |
| テスト | テストが追加されているか。境界値・異常系をカバーしているか |
| セキュリティ | 入力検証・認可チェックが漏れていないか。PHIのログ出力がないか |

## ドキュメント規約

- `docs/` 配下は300行以内。超えた場合は論理単位で分割する
- 言語: 日本語
- 仕様書の要件強度は RFC 2119 キーワード（MUST / SHOULD / MAY 等）で明示する

## 詳細設計ドキュメント一覧

| ファイル | 内容 |
|---------|------|
| [01.フロントエンド・BFF共通基盤設計.md](frontend/01.フロントエンド・BFF共通基盤設計.md) | アーキテクチャ全体・レイヤー責務 |
| [02.開発環境.md](frontend/02.開発環境.md) | 開発環境構築 |
| [03.TypeScript型管理とスキーマ共有.md](frontend/03.TypeScript型管理とスキーマ共有.md) | 型設計・Zodスキーマ |
| [04.状態管理設計.md](frontend/04.状態管理設計.md) | React Query / Zustand |
| [05.コンポーネント設計.md](frontend/05.コンポーネント設計.md) | Atoms / Molecules / Organisms |
| [06.UI実装とビジュアル設計.md](frontend/06.UI実装とビジュアル設計.md) | Tailwind / shadcn/ui |
| [07a.ルーティングとレンダリング設計方針.md](frontend/07a.ルーティングとレンダリング設計方針.md) | App Router / RSC / RCC |
| [07b.型安全性とパフォーマンス最適化.md](frontend/07b.型安全性とパフォーマンス最適化.md) | front_bff_shared / Core Web Vitals |
| [08.リアルタイム通信.md](frontend/08.リアルタイム通信.md) | Socket.io |
| [09.監視・エラーハンドリング.md](frontend/09.監視・エラーハンドリング.md) | Sentry / エラー境界 |
| [10.BFF設計.md](frontend/10.BFF設計.md) | NestJS BFF設計 |
| [11.開発規律と品質管理.md](frontend/11.開発規律と品質管理.md) | ESLint / Prettier / Storybook |
| [12.自動テスト実装.md](frontend/12.自動テスト実装.md) | Vitest / RTL / MSW |
| [13.セキュリティ基盤設計.md](frontend/13.セキュリティ基盤設計.md) | 認証・XSS・PHI保護 |
| [14.操作監査ログ基盤.md](frontend/14.操作監査ログ基盤.md) | 監査ログ設計 |
| [15.運用監視基盤.md](frontend/15.運用監視基盤.md) | Prometheus / Grafana / Loki |
