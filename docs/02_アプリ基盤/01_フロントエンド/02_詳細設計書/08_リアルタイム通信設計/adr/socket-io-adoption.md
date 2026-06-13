# ADR-1: リアルタイム通信基盤に Socket.io を採用

* **ステータス**: Accepted
* **決定日**: 2025-01-01
* **関連設計書**: [Socket接続基盤設計.md](../Socket接続基盤設計.md) §3
* **関連 ADR**: なし

## 背景（Context）

電子カルテシステムでは、検査結果到着・医師指示・緊急アラートなど、遅延なく伝えるべき情報をサーバーからフロントエンドへプッシュ配信する仕組みが必要だった。マルチテナント環境で複数のユーザー・テナントへの選択的配信を実現し、医療現場の不安定なネットワーク環境にも対応する必要がある。

## 検討した選択肢（Options）

### 案A: Socket.io
* メリット: 自動再接続・Room 機能・HTTPロングポーリングへの自動フォールバック・NestJS 標準統合（`@nestjs/platform-socket.io`）・TypeScript 型安全性
* デメリット: ライブラリ依存（WebSocket 直接実装より抽象度が高い）

### 案B: WebSocket API 直接実装
* メリット: ライブラリ依存なし・軽量
* デメリット: 自動再接続・フォールバック・Room 機能を自前実装が必要。NestJS との統合も手動

### 案C: SSE（Server-Sent Events）
* メリット: HTTP/1.1 対応・シンプル
* デメリット: サーバー→クライアントの単方向通信のみ。`join-room` のようなクライアントからの接続登録イベントに対応できない

## 決定（Decision）

**案A（Socket.io）を採用**。

Room 機能によるマルチテナント環境でのターゲット配信と、自動再接続（Exponential Backoff）による医療現場での堅牢性が必須要件であり、案B・案Cでは自前実装コストが大きい。NestJS との標準統合により追加設定が最小化できる。

## 影響（Consequences）

* Socket.io への依存が発生するため、将来バージョンアップ時に API 変更が影響する可能性がある
* WebSocket が利用できない環境でも HTTPロングポーリングにフォールバックするため、接続成功率が向上する
* **見直しトリガー**: WebSocket のブラウザサポートが改善され Socket.io の抽象化が不要になった場合、または NestJS が提供する WebSocket アダプターが Socket.io を置き換えた場合

## 参考（References）

* [Socket.IO Rooms](https://socket.io/docs/v4/rooms/)
* [Socket.IO Client Options](https://socket.io/docs/v4/client-options/)
* [NestJS Gateways](https://docs.nestjs.com/websockets/gateways)
