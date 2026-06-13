# ADR-5: CSP styleSrc に `'unsafe-inline'` を許容する

* **ステータス**: Accepted
* **決定日**: 2026-05-22
* **関連設計書**: [セキュリティミドルウェア設計.md](../セキュリティミドルウェア設計.md) §3.2
* **関連 ADR**: [xss-defense-in-depth.md](xss-defense-in-depth.md)

## 背景

CSP `style-src` ディレクティブを `'self'` のみに制限した場合、インラインスタイル（`<div style="...">`、`style` 属性、CSS-in-JS のスタイル注入）が全て遮断される。

本システムは UI フレームワークとして Tailwind CSS / Tailwind v4 系を採用予定（[01章 技術スタック設計.md](../../01_フロントエンド・BFF共通基盤設計/技術スタック設計.md) 参照）。Tailwind CSS は基本的にユーティリティクラスを使用するためインラインスタイルを必要としないが、以下のケースで動的スタイル注入が発生する:

* React の `style={{ ... }}` プロパティ（条件付きスタイル・動的計算値）
* shadcn/ui や Radix UI 等のコンポーネントライブラリが内部で動的スタイル注入を行う
* ローディングインジケータの動的な進捗値（`width: ${progress}%`）

`unsafe-inline` を許容すべきか、`nonce` ベースに切り替えるかの判断が必要。

## 検討した選択肢

### 案A: `style-src 'self'` のみ（インライン全禁止）
* **メリット**: CSS 経由の攻撃（CSS インジェクション）を最小化。
* **デメリット**: React `style={{ ... }}` 利用箇所が大量に CSP 違反となり実用不可。コンポーネントライブラリの大半が動作しなくなる。

### 案B: `style-src 'self' 'unsafe-inline'`
* **メリット**: 既存の React / Tailwind / コンポーネントライブラリがそのまま動作。
* **デメリット**: CSS インジェクション攻撃（外部スタイルでフィッシング UI を作る等）の経路が残る。ただし XSS が成立しない限り実害は限定的。

### 案C: `style-src 'self' 'nonce-{random}'`（nonce ベース）
* **メリット**: インラインスタイルを安全に許可しつつ、攻撃者が知らない nonce を要求できる。
* **デメリット**: 全インラインスタイルに nonce 属性を付与する必要があり、React の `style` プロパティに対する自動付与の仕組みが標準で存在しない。実装コストが高い。
* React の Server Components では nonce 統合が進んでいるが、本プロジェクトの構成（[07_ルーティング設計/ルーティング設計規約.md](../../07_ルーティング設計/ルーティング設計規約.md)）でも全動的スタイルへの伝搬は容易ではない。

## 決定

**案B（`'unsafe-inline'` 許容）を採用する**。

| 項目 | 内容 |
|---|---|
| `style-src` | `'self'`, `'unsafe-inline'` |
| `script-src` | `'self'` のみ（`unsafe-inline` を許容しない） |
| 補完策 | XSS 主防御は React 自動エスケープ（[ADR-3](xss-defense-in-depth.md)）。XSS が成立しない限り CSS インジェクションも成立しない |

`script-src` には `unsafe-inline` を許容しない。スクリプト実行は外部 JS 注入の主要経路であり、緩めるべきではない。

## 影響

### 正の影響
* React / Tailwind / shadcn/ui 等の既存ライブラリがそのまま動作する。
* 開発スピードが阻害されない。

### 負の影響
* CSS インジェクション攻撃に対する CSP の防御層が薄くなる。ただし XSS 主防御（React 自動エスケープ + DOMPurify）が成立していれば実害なし。
* セキュリティ監査で `unsafe-inline` の許容理由を説明する必要がある（本 ADR で代替）。

### 見直しトリガー
* React Server Components や Next.js が CSP nonce の自動伝搬を標準サポートし、運用負荷が許容範囲になった場合は案C への移行を検討する。
* CSS-in-JS ライブラリが `nonce` 属性付与を標準サポートした場合も同様。
* セキュリティ監査で `unsafe-inline` 排除を要求された場合は再評価する。

## 参考

* MDN: CSP `style-src`、`unsafe-inline`、`nonce`
* OWASP: Content Security Policy Cheat Sheet
* [セキュリティミドルウェア設計.md](../セキュリティミドルウェア設計.md) §3.2
* [xss-defense-in-depth.md](xss-defense-in-depth.md)
* [01_フロントエンド・BFF共通基盤設計/技術スタック設計.md](../../01_フロントエンド・BFF共通基盤設計/技術スタック設計.md)
