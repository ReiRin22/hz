# エラー監視ツール GlitchTip 設計書

## 概要

本プロジェクトで採用するエラー監視ツール（GlitchTip）の構築・運用設計を定義する。

**関連ドキュメント**:
- フロントエンド・BFFからの送信実装: [09.監視・エラーハンドリング.md](../../01_フロントエンド/02_詳細設計書/09.監視・エラーハンドリング.md)
- セットアップ手順書: [05_GlitchTipセットアップ手順書.md](../../../00_環境構築手順書/05_GlitchTipセットアップ手順書.md)

---

## 現在の開発フェーズにおける運用方針

### 開発環境での使用方針（2026年5月時点）

**現時点の方針**: 各開発者はGlitchTipを使用しない運用とする

**理由**:
- 開発初期段階のため、エラー監視基盤の運用は不要
- 開発者のローカル環境でのリソース消費を最小化
- 統合テスト環境が未整備

**現状**:
- `develop`ブランチの`docker-compose.yml`でGlitchTip関連のサービスをコメントアウト済み
- エラー送信実装コード（`SentryInitializer.tsx`、`sentry-exception.filter.ts`等）は他のコードに干渉しないよう`develop`ブランチに実装済み
- 環境変数（`NEXT_PUBLIC_SENTRY_DSN`、`SENTRY_DSN`）が未設定の場合、ログ出力のみでGlitchTipへの送信はスキップされる

**GlitchTipが必要になった場合**:
1. [05_GlitchTipセットアップ手順書.md](../../../00_環境構築手順書/05_GlitchTipセットアップ手順書.md) を参照してセットアップ
2. `docker-compose.yml`のコメントアウトを解除
3. 環境変数を設定

### 結合テストフェーズ以降の運用方針（2027年1月予定）

**スケジュール**: 2027年1月頃に予定している結合テストフェーズで本格運用を開始

**整備予定の項目**:
| 整備項目 | 具体的な内容 |
|---|---|
| GlitchTip環境のインフラ選定 | オンプレミス構築 or AWS環境での運用を決定 → 調査資料有（課題チケット#11802 に添付） |
| 統合テスト環境でのGlitchTip環境構築 | 本番想定のDocker Compose構成を統合テスト環境に構築 |
| パフォーマンス監視との統合 | Prometheus/Grafana と連携し、メトリクス・エラーの相関分析を可能にする |
| アラート通知設定 | Slack/メールへのアラート送信設定、通知条件（頻度・重要度）の決定 |
| エラー調査・対応フロー策定 | 運用チーム向けのエラー調査手順書、エスカレーションルールの作成 |
| 運用担当者の決定とトレーニング | GlitchTip運用担当者の選定、管理画面操作・トラブルシューティングのトレーニング実施 |

**現時点で未決定の項目**:
| 未決定項目 | 決定に必要な前提 | 決定期限 | 暫定方針 |
|---|---|---|---|
| 統合監視基盤の具体的な構成 | Prometheus/Loki/Grafana の採用可否決定 | 2026年11月 | 初期はGlitchTip単体運用、統合監視は段階的に導入 |
| 本番環境でのサンプリング率・保持期間 | 想定エラー発生頻度・ストレージ容量の見積もり | 2026年12月 | サンプリング率50%、保持期間1年で開始し、運用実績に応じて調整 |
| バックアップ戦略・高可用性構成 | 本番環境のSLA要件・予算確定 | 2026年12月 | 日次バックアップ必須、高可用性構成は予算に応じて検討 |
| Grafana Faroへの移行タイミング | 統合監視基盤の稼働状況・Faro成熟度の確認 | 2027年6月 | 当面GlitchTip継続、統合監視ニーズ発生時に移行検討 |

---

## GlitchTip採用の背景

### 採用ツール

GlitchTip（Sentry互換のOSS、MITライセンス）

### 採用理由

1. **Sentry SDK互換**: Sentry SDKの実装パターンをそのまま使用可能
2. **データ主権の確保**: 自社のシステム環境内にデータを保存し、外部流出リスクを低減
3. **コスト効率**: インフラコストのみで運用可能
4. **将来的な移行オプション**: Grafana Faroへの移行も視野に入れた柔軟な選択

### 代替案との比較

| ツール | メリット | デメリット | 採用判断 |
|---|---|---|---|
| GlitchTip | オンプレミス、Sentry互換、低コスト | 商用サポートなし | ✅ 採用 |
| Sentry（商用） | 充実したサポート、高機能 | データが外部保存、高コスト | ❌ 不採用 |
| Grafana Faro | Grafana統合、メトリクス連携 | 現時点で成熟度が低い | 🔄 将来移行検討 |

---

## システム構成

### アーキテクチャ（Docker Compose構成）

以下のDocker Compose構成で運用する。

```yaml
services:
  glitchtip-db:
    image: postgres:14
    ports:
      - "5433:5432"
    volumes:
      - glitchtip-db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: glitchtip
      POSTGRES_USER: glitchtip
      POSTGRES_PASSWORD: ${GLITCHTIP_DB_PASSWORD}

  glitchtip-redis:
    image: redis:7-alpine
    ports:
      - "6380:6379"

  glitchtip:
    image: glitchtip/glitchtip:latest
    ports:
      - "8080:8000"
    depends_on:
      - glitchtip-db
      - glitchtip-redis
    environment:
      DATABASE_URL: postgresql://glitchtip:${GLITCHTIP_DB_PASSWORD}@glitchtip-db:5432/glitchtip
      REDIS_URL: redis://glitchtip-redis:6379
      SECRET_KEY: ${GLITCHTIP_SECRET_KEY}
      PORT: 8000
      EMAIL_URL: ${EMAIL_URL}
      # セキュリティ設定
      ENABLE_OPEN_USER_REGISTRATION: "False"
      GLITCHTIP_DOMAIN: ${GLITCHTIP_DOMAIN:-http://localhost:8080}

  glitchtip-worker:
    image: glitchtip/glitchtip:latest
    command: celery -A glitchtip worker -l info
    depends_on:
      - glitchtip-db
      - glitchtip-redis
    environment:
      DATABASE_URL: postgresql://glitchtip:${GLITCHTIP_DB_PASSWORD}@glitchtip-db:5432/glitchtip
      REDIS_URL: redis://glitchtip-redis:6379
      SECRET_KEY: ${GLITCHTIP_SECRET_KEY}

volumes:
  glitchtip-db-data:
```

### サービス構成

| サービス名 | 役割 | ポート | 備考 |
|---|---|---|---|
| `glitchtip-db` | データベース（PostgreSQL） | 5433 | エラーイベントのメタデータを保存 |
| `glitchtip-redis` | キャッシュ（Redis） | 6380 | セッション管理・キャッシュ |
| `glitchtip` | Webサーバー | 8080 | 管理画面・API受信 |
| `glitchtip-worker` | バックグラウンド処理（Celery） | - | 非同期タスク（アラート送信等） |

### ネットワーク構成と実装アーキテクチャ

以下の構成でGlitchTipにエラーを送信する:

```
┌─────────────────────────────────────────────────┐
│ フロントエンド (Next.js)                         │
│  └─ src/shared/plugins/SentryInitializer.tsx   │
│     - Sentry.init() でDSN設定                    │
│     - beforeSend() でPHIフィルタリング           │
│     - setTag() でtenant_id/patient_id付与       │
└─────────────────────────────────────────────────┘
          ↓ HTTP (8080) - エラー情報送信
┌─────────────────────────────────────────────────┐
│ GlitchTip Web (8080)                            │
│  - エラーイベント受信                            │
│  - 管理画面提供                                  │
│  ↓                                               │
│ [GlitchTip Redis]                               │
│  - タスクキュー管理（Celery）                    │
│  - セッション・キャッシュ管理                    │
│  ↓                                               │
│ [GlitchTip DB (PostgreSQL)]                     │
│  - エラーイベント永続化                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ BFF (NestJS)                                    │
│  └─ src/index.ts                                │
│     - Sentry.init() でDSN設定                    │
│     - beforeSend() でPHIフィルタリング           │
│  └─ src/filters/sentry-exception.filter.ts     │
│     - filterPHI() で追加フィルタリング           │
│     - setTag() でtenant_id/trace_id付与          │
└─────────────────────────────────────────────────┘
          ↓ HTTP (8000, コンテナ間通信) - エラー情報送信
┌─────────────────────────────────────────────────┐
│ GlitchTip Web (8000)                            │
│  - エラーイベント受信                            │
│  - 管理画面提供                                  │
│  ↓                                               │
│ [GlitchTip Redis]                               │
│  - タスクキュー管理（Celery）                    │
│  - セッション・キャッシュ管理                    │
│  ↓                                               │
│ [GlitchTip DB (PostgreSQL)]                     │
│  - エラーイベント永続化                          │
└─────────────────────────────────────────────────┘
```

**ポート説明**:
- **8080**: 外部（ブラウザ）からのアクセス用
- **8000**: コンテナ間通信用（BFF → GlitchTip）

#### 各コンポーネントの処理内容

| コンポーネント | 処理内容 | 実装箇所 |
|---|---|---|
| **初期化** | Sentry.init() でDSN・サンプリング率設定 | SentryInitializer.tsx / index.ts |
| **フィルタリング** | beforeSend() でcookies/headers/email除去 | SentryInitializer.tsx / index.ts |
| **タグ付与** | setTag() で監査情報（tenant_id等）追加 | SentryInitializer.tsx / sentry-exception.filter.ts |
| **エラー送信** | Sentry.captureException() で自動送信 | フレームワークの自動計装 |
| **追加フィルタリング** | filterPHI() でPHI含有フィールドを削除 | sentry-exception.filter.ts (BFFのみ) |

---

## データ管理

### データ保持期間

- **デフォルト**: 1年
- **カスタマイズ**: 管理画面から設定変更可能

**設定方法**:
1. GlitchTip管理画面にログイン
2. プロジェクト設定 > Data Retention
3. 保持期間を設定（日数で指定）

### サンプリング率

| 環境 | サンプリング率 | 理由 |
|---|---|---|
| 開発環境 | 100% | 全エラーを送信して詳細な調査を可能にする |
| 本番環境 | 50% | サーバー負荷を軽減しつつ、十分な統計情報を収集 |

**設定箇所**:
- フロントエンド: `SentryInitializer.tsx` の `tracesSampleRate`
- BFF: `index.ts` の `tracesSampleRate`

### ストレージ容量見積もり

【TBD】本番運用開始後に実測値をもとに記載

**見積もり指標**:
- エラー発生頻度（件/日）
- 1イベントあたりの平均サイズ（KB）
- 保持期間（日）

---

## セキュリティ

### アクセス制御

#### 管理画面アクセス

**認証方式**: ユーザー名・パスワード認証

**アカウント管理**:
- 初回セットアップ時に管理者アカウントを作成
- 追加ユーザーは管理画面から招待
- ユーザー登録の公開を無効化（`ENABLE_OPEN_USER_REGISTRATION: "False"`）

**アクセス権限**:
- 管理者: 全プロジェクトの閲覧・設定変更
- メンバー: 割り当てられたプロジェクトの閲覧のみ

#### API接続

**認証方式**: DSN（Data Source Name）による認証

**DSN形式**: `http://<PROJECT_KEY>@<HOST>:<PORT>/<PROJECT_ID>`

**DSN管理**:
- プロジェクトごとに個別のDSNを発行
- DSNの漏洩時は再発行して無効化

### PHI保護方針

**基本方針**: クライアントサイド・サーバーサイド両方で送信前にPHIフィルタリングを実施

#### 削除対象フィールド

| フィールド | 削除理由 |
|---|---|
| `event.request.cookies` | セッションID、認証トークン等の機密情報を含む可能性 |
| `event.request.headers` | Authorization、X-User-Name等のPHI含有可能性あり |
| `event.user.email` | 患者・ユーザーのメールアドレスはPHI |
| `extra.body` 内のPHI項目 | 患者名、生年月日、診断情報等のPHI含有可能性（ホワイトリスト方式でフィルタリング） |

#### 送信するフィールド

| フィールド | 送信理由 |
|---|---|
| `user.id` | ユーザーIDのみ（個人を特定できる名前等は含まない） |
| `user.ip_address` | 病院スタッフの端末情報として必要（個人情報非該当） |
| `tags.tenant_id` | テナント識別用（病院名等は含まない） |
| `tags.patient_id` | 患者IDのみ（患者名等は含まない） |

#### 実装箇所

- **フロントエンド**: `SentryInitializer.tsx` の `beforeSend` フック
- **BFF**: `index.ts` の `beforeSend` フックおよび `sentry-exception.filter.ts` の `filterPHI()`

詳細: [09.監視・エラーハンドリング.md](../../01_フロントエンド/02_詳細設計書/09.監視・エラーハンドリング.md) を参照

### HTTPS通信

**開発環境**: HTTP通信（localhost）

**本番環境**: HTTPS通信を必須とする
- リバースプロキシ（nginx等）でSSL/TLS終端
- Let's Encrypt等で証明書を取得

---

## エラー重要度分類とアラート設定

### 重要度分類

| 重要度 | 説明 | 対象エラー例 | アラート対象 |
|---|---|---|---|
| **Critical** | システム全体に影響、即座対応必要 | サーバー側エラー（5xx）、重要APIの通信断 | ✓ |
| **High** | 特定機能が利用不可、早急対応必要 | データ整合性エラー、更新競合、権限不足（403） | ✓ |
| **Medium** | 一部機能に支障、計画的対応 | バリデーション失敗、任意項目のエラー | - |
| **Low** | 軽微な問題、通常対応 | 任意機能の一時的エラー | - |

### アラート設定

#### 通知対象

**対象**: CriticalおよびHigh分類のエラーのみ

**アラート条件例**:
- 500エラーが1分間に5回以上発生
- Criticalエラーが1件でも発生
- 特定のエラーパターンが繰り返し発生

#### 通知先

【TBD】運用担当者確定後に記載

**候補**:
- メール通知: 運用担当者のメールアドレス
- Slack通知: 専用チャンネル
- PagerDuty等の運用ツール連携

#### 通知設定手順

1. GlitchTip管理画面にログイン
2. プロジェクト設定 > Alerts
3. Alert Ruleを作成
   - 条件: エラー頻度、エラーレベル等
   - 通知先: メール、Webhook（Slack等）
4. テスト送信で動作確認

---

## 高可用性・バックアップ

### 高可用性戦略

【TBD】本番環境の要件確定後に記載

**検討事項**:
- GlitchTip Webサーバーの冗長化（複数インスタンス + ロードバランサー）
- PostgreSQLのレプリケーション（マスター・スレーブ構成）
- Redisのクラスタ構成（Sentinel / Cluster）

### バックアップ戦略

#### バックアップ対象

- PostgreSQLデータベース（エラーイベント、プロジェクト設定、ユーザー情報）

#### バックアップ頻度

【TBD】運用方針確定後に記載

**候補**:
- 日次バックアップ: 深夜帯に自動実行
- 週次バックアップ: 長期保存用

#### 保持期間

【TBD】運用方針確定後に記載

**候補**:
- 日次バックアップ: 30日間
- 週次バックアップ: 1年間

#### バックアップ手順

```bash
# PostgreSQLのバックアップ
docker exec glitchtip-db pg_dump -U glitchtip glitchtip > backup_$(date +%Y%m%d).sql

# リストア手順
docker exec -i glitchtip-db psql -U glitchtip glitchtip < backup_YYYYMMDD.sql
```

---

## 運用

### 初期セットアップ手順

詳細: [05_GlitchTipセットアップ手順書.md](../../../00_環境構築手順書/05_GlitchTipセットアップ手順書.md) を参照

**概要**:
1. Docker Composeで全サービスを起動
2. 管理者アカウントを作成
3. プロジェクトを作成（Frontend用、BFF用）
4. DSNを取得して環境変数に設定
5. テストエラーを送信して動作確認

### ダッシュボードの見方

#### エラー一覧画面

**主要機能**:
- テナントIDでフィルタリング（タグ検索: `tenant_id:hospital-a`）
- trace_idでフロントエンド・BFFのエラーを紐付け
- 発生頻度、最終発生日時を確認
- エラーステータス（New / Resolved / Ignored）の管理

**操作**:
- エラーをクリックして詳細画面へ遷移
- Resolvedにして解決済みマーク
- Ignoreで今後の通知を無効化

#### エラー詳細画面

**表示情報**:
- スタックトレース（ファイル名、行番号、関数名）
- Breadcrumbs（操作履歴、最大50件）
- 監査情報（`tenant_id`、`user_id`、`patient_id`）
- リクエスト情報（URL、メソッド、ステータスコード）
- コンテキスト情報（ブラウザ、OS、ランタイムバージョン）

**操作**:
- Similar Issuesで類似エラーを確認
- Commentsでチーム内コミュニケーション
- Linkで外部チケット（GitHub Issue等）と紐付け

### エラー調査手順

1. **GlitchTip管理画面でエラー一覧を確認**
   - 新規エラーを確認
   - 発生頻度が高いエラーを優先

2. **テナントIDでフィルタリングして影響範囲を特定**
   - タグ検索: `tenant_id:hospital-a`
   - 特定の病院のみで発生しているかを確認

3. **trace_idでフロントエンド・BFFのエラーを突き合わせ**
   - 同じ`trace_id`を持つイベントを検索
   - エラーの発生経路を追跡

4. **Breadcrumbsで再現手順を確認**
   - エラー発生前の操作履歴を確認
   - 「どのボタンを押したか」「どのページに遷移したか」を特定

5. **スタックトレースで発生箇所を特定**
   - ファイル名・行番号から該当コードを確認
   - ソースマップが有効な場合、元のTypeScriptコードが表示される

### 定期メンテナンス【TBD】

#### データベースメンテナンス例

**VACUUM実行**（PostgreSQL）:
```bash
# 週次で実行等
docker exec glitchtip-db psql -U glitchtip -d glitchtip -c "VACUUM ANALYZE;"
```

#### 古いイベントの削除例

GlitchTipは保持期間を超えたイベントを自動削除します。手動削除が必要な場合:

```bash
# 例: 90日以前のイベントを削除
docker exec glitchtip-db psql -U glitchtip -d glitchtip -c "DELETE FROM events_event WHERE timestamp < NOW() - INTERVAL '90 days';"
```

#### ディスク容量監視例

運用監視基盤での監視設定

**監視項目**:
- PostgreSQLデータベースのサイズ
- Dockerボリュームの使用量
- アラート閾値: 80%超過で警告、90%超過でクリティカル

---

## 将来の移行戦略

### Amazon Managed Grafanaへの移行

#### 移行トリガー

Grafana統合ダッシュボードでの一元監視が必要になった時点

**具体例**:
- メトリクス（CPU・メモリ）とエラーの相関分析が必要
- Loki（ログ）とエラーの統合ビューが必要
- Prometheusアラートとエラーアラートの統合管理が必要

#### 基本方針

- GlitchTip（Sentry互換）からGrafana Faroへ移行
- Prometheus/Loki/Grafanaによる統合監視基盤との連携により、メトリクス・ログ・エラーの時系列統合が可能

#### 移行時の考慮事項

| 項目 | 変更内容 | 影響範囲 |
|---|---|---|
| **エラー収集SDK** | `@sentry/nextjs` → `@grafana/faro-web-sdk`<br>`@sentry/node` → `@grafana/faro-node-sdk` | フロントエンド・BFF両方 |
| **テナントID付与** | `Sentry.setTag()` → `faro.setContext()` | 送信実装コード |
| **PHIフィルタリング** | `beforeSend` → Faro独自のフック | フィルタリング実装 |
| **ログ検索** | GlitchTip UI → Grafana Explore | 運用手順 |

#### 移行手順（概要）

【TBD】具体的な移行手順・スケジュールは運用方針確定後に詳細化

1. Grafana Faroの検証環境構築
2. テスト環境で並行運用（GlitchTip + Faro）
3. データ整合性確認
4. 段階的に本番環境へ移行
5. GlitchTipの廃止

---

## 付録

### プロジェクトDSN一覧

| プロジェクト | DSN | 用途 | 設定箇所 |
|---|---|---|---|
| Frontend | `http://<key1>@localhost:8080/1` | フロントエンドのエラー収集 | `frontend/.env.local` の `NEXT_PUBLIC_SENTRY_DSN` |
| BFF | `http://<key2>@glitchtip:8000/1` | BFFのエラー収集 | `bff/.env` の `SENTRY_DSN` |

**DSN取得方法**:
1. GlitchTip管理画面にログイン
2. プロジェクトを選択
3. Settings > Client Keys (DSN)
4. DSNをコピーして環境変数に設定

### トラブルシューティング

#### GlitchTipにエラーが送信されない

**確認事項**:
1. DSNが正しく設定されているか（環境変数）
2. GlitchTipサービスが起動しているか（`docker ps`）
3. ネットワーク接続が正常か（`curl http://localhost:8080`）
4. ブラウザコンソールで送信エラーが出ていないか

**解決方法**:
- 環境変数を再確認して再起動
- GlitchTipのログを確認: `docker logs glitchtip`

#### エラーがGlitchTipに表示されない

**原因**:
- サンプリング率が低く、エラーが送信されていない
- プロジェクトIDが間違っている

**解決方法**:
- サンプリング率を100%に変更して再テスト
- DSNのプロジェクトIDを確認

#### Breadcrumbsが記録されない

**原因**:
- `maxBreadcrumbs` が0に設定されている
- 自動計装が無効化されている

**解決方法**:
- `maxBreadcrumbs: 50` を明示的に設定
- Sentry.init()の設定を確認