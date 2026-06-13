# DevOps

> 最終更新: YYYY-MM-DD

## 環境

| 環境 | 用途 | デプロイ方式 |
|------|------|------------|
| local | 開発 | 手動 |
| dev | 検証 | {{PR マージで自動}} |
| staging | リリース前確認 | {{手動トリガー}} |
| production | 本番 | {{承認後デプロイ}} |

## CI パイプライン

```
push/PR
  → lint + typecheck
  → 単体テスト
  → 結合テスト
  → ビルド
  → （PR時）E2Eテスト
  → （マージ時）デプロイ
```

- ツール: {{GitHub Actions / GitLab CI / CircleCI}}
- 実行条件: {{全PR / 特定ブランチ}}

## CD パイプライン

- デプロイ方式: {{ローリング / Blue-Green / Canary}}
- ロールバック: {{自動 / 手動、手順の概要}}
- デプロイ先: {{AWS / GCP / Azure / Vercel / オンプレ}}

## コンテナ（使用する場合）

- ランタイム: {{Docker / Podman}}
- オーケストレーション: {{k8s / ECS / なし}}
- レジストリ: {{ECR / GCR / Docker Hub}}

## インフラ管理

- IaC: {{Terraform / CDK / CloudFormation / なし}}
- シークレット管理: {{Vault / AWS Secrets Manager / .env（開発のみ）}}

## ブランチ戦略

- メインブランチ: {{main}}
- 機能ブランチ: {{feature/Fxx-description}}
- リリースブランチ: {{必要に応じて}}
- 命名規則: {{feature/ / fix/ / chore/}}
