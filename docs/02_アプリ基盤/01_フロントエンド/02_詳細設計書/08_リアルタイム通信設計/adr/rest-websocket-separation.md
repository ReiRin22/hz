# ADR-3: REST API と WebSocket の役割分離（非破壊的アドオン設計）

* **ステータス**: Accepted
* **決定日**: 2025-01-01
* **関連設計書**: [Socket接続基盤設計.md](../Socket接続基盤設計.md) §5, [BFF通知Gateway設計.md](../BFF通知Gateway設計.md) §2.1
* **関連 ADR**: [ADR-1](socket-io-adoption.md)

## 背景（Context）

既存のフロントエンドは React Query を用いた REST API 通信基盤を持っていた。リアルタイム通知基盤を追加する際に、既存の通信基盤との役割分担を明確にする必要があった。また、BFF の WebSocket Gateway が既存の REST API エンドポイントと同一プロセスに同居する設計になっている。

## 検討した選択肢（Options）

### 案A: REST API と WebSocket を役割分離し、非破壊的に追加
* メリット: 既存の React Query 基盤を変更せず、WebSocket をサーバープッシュ専用として追加できる。障害が局所化される
* デメリット: 2つの通信経路を維持するため、運用・監視が複数になる

### 案B: WebSocket に統一（REST API を WebSocket へ移行）
* メリット: 通信経路が単一化される
* デメリット: 既存の REST API 基盤（React Query・Axios）の全面置き換えが必要。移行コストと障害リスクが大きい

## 決定（Decision）

**案A（役割分離・非破壊的アドオン）を採用**。

REST API は要求応答モデル（データ取得・更新）、WebSocket はサーバープッシュモデル（リアルタイム通知）として明確に役割を分離する。既存基盤を阻害しないことで、リアルタイム通知基盤の追加が既存機能に影響しない。

## 影響（Consequences）

* フロントエンドは REST API（React Query / Axios）と Socket.io クライアントの2つの通信経路を持つ
* BFF は REST エンドポイントと WebSocket Gateway を同一プロセスで管理する
* `namespace: notifications` により WebSocket 通信の名前空間を分離し、他の WebSocket 用途（将来的なチャット等）との混在を防ぐ
* **見直しトリガー**: WebSocket をデータ取得にも活用する要件（リアルタイムデータ同期等）が確定した場合

