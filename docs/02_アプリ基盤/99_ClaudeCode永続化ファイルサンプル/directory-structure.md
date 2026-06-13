# ディレクトリ構造

> 最終更新: 2026-03-19

## 構成パターン

採用: **feature-first（LV1/LV2/LV3の3階層）**

選定理由: bulletproof-react をベースに、業務フロー単位でコードを凝集させる。
画面・API・型・テストをLV3フォルダ内に同居させることで、機能変更の影響範囲を局所化する。

---

## フロントエンド (`frontend/`)

```
frontend/
  src/
    app/
      (group-name)/           # ルートグループ。URLに影響せず共通レイアウトを適用 (例: (auth), (karte))
        [path-name]/          # URLパスセグメント
          page.tsx            # Server Component。BFFからデータフェッチしfeaturesへ渡す
          layout.tsx          # グループ共通ヘッダー・サイドメニュー・プロバイダー
          loading.tsx         # ルート遷移時のローディングUI
          error.tsx           # ランタイムエラーのキャッチと復旧UI
      error.tsx               # BFF通信エラー等、全般的なシステムエラー境界
      globals.css             # Tailwind CSS v4 グローバルテーマ・変数定義
      layout.tsx              # アプリ全体共通レイアウト・全Provider設定
      loading.tsx             # アプリデフォルトローディング
      page.tsx                # TOP画面
    features/
      {LV1_機能群}/            # LV1: 大分類 (例: 診療記録・診断管理)
        {LV2_業務フロー}/       # LV2: 業務フロー単位 (例: 診療記録作成・管理)
          {LV3_画面機能}/       # LV3: 画面単位。_付きは他画面から参照不可
            api/              # BFF通信ロジック (axiosClient使用)
              OO.api.ts
            assets/           # 画面固有の画像・アイコン・静的ファイル
            components/
              molecules/      # 画面固有の小部品 (例: UserUpdateForm)
              organisms/      # 複数Moleculesを束ねる大部品・仮想スクロール実装
            hooks/            # 画面固有カスタムフック (useQueryなど)
            stores/           # 画面スコープのZustand store（画面離脱時に破棄）
            types/            # ViewModelなど画面固有UI型定義
              OO.type.ts
            style.css         # 画面固有スタイル (@apply 等)
            test/             # コロケーションテスト (Vitest/MSW)
            index.ts          # 機能公開インターフェース
          index.ts            # LV2公開インターフェース
        {LV1機能名}_shared/    # LV1内共通 (components/ stores/ hooks/ 等)
    _shared/                  # LV1跨ぎ共通
    api/                      # 共通API通信定義 (axiosClientインスタンス・共通API)
    assets/                   # ロゴ・フォントなどアプリ全体の素材
    components/
      atoms/                  # shadcn/ui ベースの最小UI部品 (Button, Input等)
      molecules/              # 汎用部品 (SearchBox, ModalWrapper等)
    hooks/                    # アプリ全体共通フック (認証状態監視・共通バリデーション)
    stores/                   # グローバルZustandストア (永続化データ含む)
    types/                    # アプリ全体共通UI型定義
    styles/                   # Tailwind設定・テーマ変数の一元管理
    utils/                    # 日付操作・文字列変換など汎用関数（ビジネスロジック含まない）
    plugins/                  # ライブラリ設定 (axiosClient, Sentry, setup.ts等)
    _test/                    # 共通部品・共通Hooks・共通Utilsの単体テスト
    mocks/                    # MSWハンドラー定義・テスト用ダミーデータ (JSON)
  front_bff_shared/           # シンボリックリンク → projectroot/front_bff_shared
  Dockerfile
  next.config.ts
  tsconfig.json
  package.json
  ...
```

---

## フロントとBFFの共有 (`front_bff_shared/`)

フロントとBFFで共有する型・スキーマを管理。シンボリックリンクにより双方で同期する。

```
front_bff_shared/
  features/
    {LV1}/
      {LV2}/
        {LV3}/
          types/
            request/
              {機能名}.api.request.ts   # 送信データ型定義 (BFF Controller ↔ フロント API)
            response/
              {機能名}.api.response.ts  # 受信データ型定義 (BFF集形ロジック ↔ フロントPresentation)
            schemas/
              {機能名}.schema.ts        # Zodバリデーションルール (フロント入力検証 ↔ BFF受信チェック)
            _shared/                   # LV2内共有型
        _shared/                       # LV1全体共通型・スキーマ
```

---

## BFF (`bff/`) ※調整中

```
bff/
  src/
    features/
      {機能}/
        {業務名}.controllers.ts   # リクエスト受取・適切なServiceへ振り分け
        {業務名}.services.ts      # ビジネスルール計算・データ加工
        {業務名}.clients.ts       # 外部API・マイクロサービスへの接続クライアント
        {業務名}.module.ts        # モジュールファイル (NestJS)
        types/
          {業務名}.api.request.ts
          {業務名}.api.response.ts
          {機能名}.type.ts        # 機能内のみで使う型定義
    shared/
      utils/
        auth.util.ts              # 認証・ログの共通ロジック
        logger.util.ts
      types/
        auth.ts                   # BFF内部共通型
      plugins/
        decryption.middleware.ts  # APIリクエスト前処理 (復号)
        server.ts                 # サーバー起動・エントリーポイント
        routes.ts                 # 全ルート一覧。URLエンドポイントとControllerを紐付け
  front_bff_shared/               # root/sharedへのシンボリックリンク (ビルド用)
```

---

## バックエンド (`backend/`) ※TODO（検討中）

---

## 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| ディレクトリ | kebab-case | `user-profile/` |
| コンポーネントファイル | PascalCase | `UserProfileCard.tsx` |
| APIファイル | camelCase + `.api.ts` | `getUserProfile.api.ts` |
| ユーティリティファイル | camelCase | `formatDate.ts` |
| テストファイル | `対象.test.tsx` / `対象.flow.test.tsx` | `UserForm.test.tsx` |
| 型定義ファイル | `OO.type.ts` | `user.type.ts` |
| スキーマファイル | `OO.schema.ts` | `user.schema.ts` |

## 依存ルール

```
フロントエンド
  features (LV3) → features (LV3 _shared) → features (LV1 _shared) → _shared   OK
  features (LV3) → 別LV3 (直接参照)                                              NG
  features       → api / components / hooks / stores / utils / plugins          OK
  app/           → features                                                      OK

front_bff_shared → フロントエンド / BFF (依存される側)                             OK
フロントエンド / BFF → front_bff_shared                                           OK

BFF → バックエンド                                                                OK
フロントエンド → バックエンド (直接)                                                NG
```

## ファイルサイズの目安

| 対象 | 上限目安 | 超えた場合 |
|------|---------|----------|
| ソースファイル | 300行 | 責務分割する |
| テストファイル | 500行 | describe単位で分割する |
| ドキュメント | 300行 | 論理単位で分割する |
