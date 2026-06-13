# Harz

## 目次
1. [プロジェクトについて](#プロジェクトについて)
2. [使用技術](#使用技術)
3. [ディレクトリ構成](#ディレクトリ構成)
4. [開発環境構築手順](#開発環境構築手順)
5. [ブランチルール](#ブランチルール)
6. [コミットコメントルール](#コミットコメントルール)

## プロジェクトについて
Harzは、中小規模の療養病棟を保持する病院向けの電子カルテシステムです。
このリポジトリでは、ドキュメント管理、成果物開発、PoC検証を一元的に行い、レビューにも対応します。


## 使用技術
今後追加予定


## ディレクトリ構成
```
project-root/
├─ README.md
├─ docs/                     # 全体設計・方針・判断記録
│  ├─ overview.md
│  ├─ architecture/
│  │  ├─ system.md
│  │  ├─ frontend.md
│  │  └─ backend.md
│  ├─ decisions/
│  │  ├─ ADR-001-tech-stack.md
│  │  └─ ADR-002-frontend-structure.md
│  └─ poc/
│     ├─ poc-001-auth.md
│     ├─ poc-002-state.md
│     └─ poc-003-notification.md
│
├─ infra/                    # インフラ・環境定義
│  ├─ docker/
│  │  ├─ frontend/
│  │  │  └─ Dockerfile
│  │  └─ backend/
│  ├─ compose/
│  │  ├─ docker-compose.dev.yml
│  │  └─ docker-compose.prod.yml
│  └─ k8s/                   # 将来見据えて（空でもOK）
│
├─ frontend/                 # ★フロントエンドはここ
│  ├─ README.md
│  ├─ .gitlab-ci.yml
│  ├─ pocs/                  # フロントエンドPoC置き場
│  │  ├─ auth/
│  │  │  ├─ README.md
│  │  │  └─ src/
│  │  ├─ state/
│  │  └─ notification/
│  │
│  └─ app/                   # 最終成果物（本番コード）
│     ├─ src/
│     │  ├─ app/             # アプリ初期化・ルート
│     │  ├─ pages/           # 画面単位
│     │  ├─ features/        # 業務機能（電子カルテ向き）
│     │  ├─ hooks/
│     │  ├─ services/        # API/BFF 呼び出し
│     │  └─ shared/
│     ├─ public/
│     ├─ package.json
│     └─ tsconfig.json
│
├─ backend/                  # BFF / API（将来）
│  ├─ README.md
│  └─ src/
│
├─ scripts/                  # 横断スクリプト
│  ├─ dev.sh
│  ├─ build.sh
│  └─ lint.sh
│
└─ .gitlab/                  # GitLab運用定義
   ├─ ci/
   │  ├─ frontend.yml
   │  └─ backend.yml
   └─ templates/
```

## 開発環境構築手順
今後追加予定


## ブランチルール
| ブランチ名 | 運用方針 | 補足 |
|-----|-----|-----|
| production | 本番環境へのリリースコードを保持するブランチ。本ブランチの内容を本番環境へデプロイする。 | マージ時レビュー必須 |
| staging | 本番リリース前の結合テスト・検証用ブランチ。本ブランチの内容を検証環境へデプロイする。 | マージ時レビュー必須 |
| develop | 開発用ブランチ。 | マージ時レビュー必須 |
| poc | PoC用ブランチ。 |  |
| feature | 機能単位で独立した開発用ブランチ。develop/pocブランチから機能毎にブランチを切る。 |  |


## コミットコメントルール
`[操作]refs #チケット番号 概要`

●例
[fix]refs #110 削除フラグが更新されない不具合の修正

このセクションを編集
更新SQLの対象カラムに削除フラグが含まれていなかったため追加しました。
操作凡例：
　fix：バグ修正
　add：新規（ファイル）機能追加
　update：機能修正（バグではない）
　remove：削除（ファイル）