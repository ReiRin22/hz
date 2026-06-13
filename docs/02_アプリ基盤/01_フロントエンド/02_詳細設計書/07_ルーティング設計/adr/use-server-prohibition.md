# ADR-2: "use server"（Server Actions）を原則使用しない

* **ステータス**: Accepted
* **決定日**: 2025-10-01
* **関連設計書**: [ルーティング設計規約.md](../ルーティング設計規約.md) §3.1 / [レンダリング設計.md](../レンダリング設計.md) §1.1
* **関連 ADR**: [ADR-1](app-router-adoption.md)

## 背景（Context）

Next.js（App Router）には、データ更新用の機能として `"use server"`（Server Actions）が存在する。本プロジェクトでは採用するかどうかを判断する必要があった。

## 検討した選択肢（Options）

### 案A: "use server" を原則使用しない（採用）

* **メリット**
  * データの流れが `Client(RCC) → BFF API` と最短かつ明快
  * ブラウザからaxios/fetchで直接APIを叩く標準的なREST通信を採用でき、チームの既存知識を活用できる
  * 通信のモニタリング・デバッグが容易
* **デメリット**
  * Next.jsの機能を一部使わないことになる

### 案B: "use server" を活用する（見送り）

* **メリット**: Progressive Enhancement対応が容易
* **デメリット**
  * 認証・認可・バリデーション・データ永続化のロジックがBFF+バックエンド側で既に完備されており、Next.jsサーバーを中継する必要がない
  * フロントエンド（Zod）での即時フィードバックとBFF側での最終保証という「二段構えの責務分離」が崩れる
  * アーキテクチャが複雑になる（Next.jsサーバー→BFF→バックエンドの3段構え）

## 決定（Decision）

**案A: "use server" を原則使用しない。**

4つの理由:
1. **BFF＋バックエンド側での機能完備**: 認証・認可・バリデーション・データ永続化のロジックがBFF+バックエンド側で既に完備されているため、Next.jsサーバーを中継する必要がない
2. **バリデーションの責務分離**: フロントエンド（Zod）は即時フィードバックによるUX向上を担い、データの正当性に関する最終保証はBFF+バックエンド側が直接担う二段構え
3. **アーキテクチャの単純化**: Client(RCC) → BFF APIと直接通信することで、データの流れを最短かつ明快に保つ
4. **標準技術の活用と保守性**: 標準的なREST通信を採用し、チームの既存知識の活用と通信のモニタリング・デバッグを容易にする

## 影響（Consequences）

* **正**: アーキテクチャのシンプルさ維持、BFF/バックエンドとの責務明確化、デバッグのしやすさ
* **負**: Next.js固有のProgressive Enhancement機能は使えない
* **見直しトリガー**: BFFが廃止されフロントエンドから直接DBアクセスが必要になる場合（構成の根本変更）

## 参考（References）

* [Next.js Server Actions 公式ドキュメント](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
