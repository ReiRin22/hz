# CI パイプライン改善計画書

作成日: 2026-05-26  
対象: GitLab Runner（個人PC ローカルランナー → 共有PC　ローカルランナー）

---

## 0. CI/CD 構成図

### 0.1 パイプラインのステージ構成

![CI構成図](../assets/CIimage.png)

**図の説明:**
- CI パイプラインは5つのステージ（Format → Lint → Build → Unit Test → Integration Test）で構成
- 各ステージには複数のジョブが並列実行可能（共有PCの concurrent 設定に依存）
- パイプライン全体の実行時間は Format（2分）→ Lint（5分）→ Build（5分）→ Unit Test（7分）→ Integration Test（20分）の合計約39分を想定(あくまで予想)

### 0.2 開発者とランナーの接続構成

![CD構成図](../assets/CDimage.png)

**図の説明:**
- 共有サーバ―上（ubuntu）の GitLab Runner（concurrent=3~10）を経由して CI パイプラインを実行
- 共有ランナー用 PC 上の Docker 環境で各ステージ（Format → Lint → Build → Unit Test → Integration Test）を順次実行
- 同じStagesのジョブは並列で実行される
- 変更箇所に関係なくすべてのテストが実行される。

### 0.3 共有サーバー用の運用

**初期構成:**
- 共有PC: 1台（concurrent = 3）
- 推奨スペック: 8コア / 16GB RAM / 100GB SSD

**負荷が高まった場合の対応:**
1. **concurrent 値の引き上げ**
   - `concurrent = 3` → `10` に変更（PCスペックが許す範囲で）
   - テストの負荷を計測し、共有サーバーのCPUとメモリスペックに応じて並列テスト実行数(concurrent)とどのStagesで並列実行を許すか設定する。

2. **Kubernetes への移行（将来的な選択肢）**
   - インフラ提供があれば実施
   - K8sはreplicasの値を変更するとランナーの複製が可能、consurrentsとpoc数で並列テスト実行数を操作する。

**判断基準:**
- CI 実行待機時間が常に5分以上発生する場合は concurrent 値を引き上げ
- 共有サーバー の CPU/メモリ使用率が常時80%を超える場合は PC 追加を検討

---
## 1. 現状分析

### 1.1 既存の実装状況

| カテゴリ | 実装数 | 状態 | 備考 |
|---------|-------|------|------|
| **FE Unit Tests** | 166 ファイル | ✅ 充実 | Vitest, Coverage 70% 閾値 |
| **FE E2E Tests** | 3 ファイル | ⚠️ 最小限 | Playwright, 135 stories に対し極少 |
| **FE Storybook** | 135 ファイル | ✅ 充実 | MSW統合済み、A11y Addon |
| **BFF Tests** | 18 ファイル | ✅ 実装済み | Vitest, Node 環境 |
| **BE Tests** | 7 ファイル | ⚠️ 最小限 | NUnit, アーキテクチャテストのみ |
| **ESLint** | - | ✅ 設定済み | Next.js 推奨ルール |
| **Prettier** | - | ⏹️ デフォルト | 明示的設定なし（改善推奨） |
| **StyleLint** | - | ❌ 未設定 | - |

### 1.2 現在の CI 状態

```yaml
# .gitlab-ci.yml の現状
stages:
  - test       #  when: never でスキップ中
  - ai_review  #  when: never でスキップ中

active:
  - ai_review (Bedrock Claude Sonnet 4.6 + Serena MCP + Context7)

disabled:
  - vitest:test (when: never)
  - e2e:test:auto (when: never)
```

**ランナー設定:**
- タグ: `harz`
- Docker Images: Node 20, Playwright v1.59.1, Python 3.12

---

## 2. 目標アーキテクチャ

### 2.1 パイプライン実行フロー（イベント別）

#### **Push 時: フル CI パイプライン実行**

**ステージ定義:**
1. **Format** — コード整形チェック（Prettier, dotnet format）
2. **Lint** — 静的解析（ESLint, StyleLint, tsc, Roslyn Analyzers）
3. **Build** — ビルド成功確認（FE, BFF, BE, Storybook）
4. **Unit Test** — 単体テスト（Vitest, NUnit, Storybook Test Runner）
5. **Integration Test** — 統合・E2E テスト（Playwright, API テスト）

**実行時間:** 約39分（共有PC: concurrent=3）

---

#### **develop への MR 時: 6ステップフロー（CDimage.png）**

```
┌─────────────┐  ┌──────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────────────────┐
│ 1. Format   │→ │ 2. Lint  │→ │ 3. Build    │→ │ 4. Unit     │→ │ 5. Deploy   │→ │ 6. AI Code Review      │
│             │  │          │  │             │  │    Test     │  │    (Dev)    │  │                        │
│ - Prettier  │  │ - ESLint │  │ - FE        │  │ - Vitest    │  │ - FE/BFF/BE │  │ • Bedrock Claude       │
│ - dotnet    │  │ - TSC    │  │ - BFF       │  │ - NUnit     │  │   to Dev    │  │   Sonnet 4.6           │
│   format    │  │ - StyleL │  │ - BE        │  │ - Storybook │  │   Server    │  │ • Serena MCP           │
│             │  │ - Roslyn │  │             │  │             │  │             │  │ • Context7 MCP         │
└─────────────┘  └──────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └────────────────────────┘
     ❌ 失敗 → パイプライン停止（後続ステージは実行されない）
```

**実行時間:** 約20-25分（Format 1分 + Lint 2分 + Build 6分 + Unit Test 5分 + Deploy 1分 + AI Review 5-10分）

**トリガー条件:**
- `CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"`
- feature/* → develop への MR 作成時・コミット追加時

**パイプライン停止の仕組み:**
1. Format ステージが失敗 → Lint 以降は実行されない
2. Lint ステージが失敗 → Build 以降は実行されない
3. Build ステージが失敗 → Unit Test 以降は実行されない
4. Unit Test ステージが失敗 → Deploy 以降は実行されない
5. Deploy ステージが失敗 → AI Review は実行されない
6. すべて成功時のみ AI Review が実行される

---

#### **main への MR 時: 7ステップフロー（6ステップ + Integration Test）**

```
┌─────────────┐  ┌──────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐  ┌────────────────────────┐
│ 1. Format   │→ │ 2. Lint  │→ │ 3. Build    │→ │ 4. Unit     │→ │ 5. Deploy   │→ │ 6. Integration   │→ │ 7. AI Code Review      │
│             │  │          │  │             │  │    Test     │  │    (Stg)    │  │    Test          │  │                        │
│ - Prettier  │  │ - ESLint │  │ - FE        │  │ - Vitest    │  │ - FE/BFF/BE │  │ - E2E            │  │ • Bedrock Claude       │
│ - dotnet    │  │ - TSC    │  │ - BFF       │  │ - NUnit     │  │   to Stg    │  │ - API Test       │  │   Sonnet 4.6           │
│   format    │  │ - StyleL │  │ - BE        │  │ - Storybook │  │   Server    │  │ - Playwright     │  │ • Serena MCP           │
│             │  │ - Roslyn │  │             │  │             │  │             │  │                  │  │ • Context7 MCP         │
└─────────────┘  └──────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────────┘  └────────────────────────┘
     ❌ 失敗 → パイプライン停止（後続ステージは実行されない）
```

**実行時間:** 約40-50分（Format 1分 + Lint 2分 + Build 6分 + Unit Test 5分 + Deploy 1分 + Integration Test 20分 + AI Review 5-10分）

**トリガー条件:**
- `CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"`
- develop → main への MR 作成時・コミット追加時

**パイプライン停止の仕組み:**
1. Format ステージが失敗 → Lint 以降は実行されない
2. Lint ステージが失敗 → Build 以降は実行されない
3. Build ステージが失敗 → Unit Test 以降は実行されない
4. Unit Test ステージが失敗 → Deploy 以降は実行されない
5. Deploy ステージが失敗 → Integration Test 以降は実行されない
6. Integration Test ステージが失敗 → AI Review は実行されない
7. すべて成功時のみ AI Review が実行される

**理由（共通）:**
- Format/Lint/Build が通らないコードをテスト・デプロイ・AIレビューしても意味がない
- CI リソースの節約（無駄な実行を防ぐ）
- 開発者へ早期フィードバック（失敗時点で即座に通知）
- main へのマージは Integration Test で本番相当の検証を完了してからマージする

---

### 2.2 ブランチ判定の仕組み

**Q: `git push feature/xxx` からのブランチ判定はどこで行う？**

**A: `.gitlab-ci.yml` の `rules` で判定する（config.toml ではない）**

GitLab Runner の `config.toml` はランナーの実行環境設定（concurrent, executor, リソース制限等）のみを管理します。  
**どのブランチで何を実行するかは `.gitlab-ci.yml` の `rules` ディレクティブで制御します。**

#### 2.2.1 基本的な分岐制御とパイプライン停止

**MR 時は Format → Lint → Build → AI Review の順に実行し、途中で失敗したら停止する。**

```yaml
stages:
  - format
  - lint
  - build
  - unit_test
  - integration_test
  - ai_review

# デフォルトの失敗時動作: ステージが失敗したら後続ステージは実行しない
default:
  retry: 0  # リトライなし（即座に失敗扱い）

# ===== Stage 1: Format =====
# Format が失敗したら、後続の Lint/Build/AI Review は実行されない

format:fe:
  stage: format
  tags: [harz]
  image: node:20
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
  script:
    - cd product/frontend
    - pnpm install --frozen-lockfile
    - pnpm format:check
  allow_failure: false  # 失敗時はパイプライン停止

format:bff:
  stage: format
  tags: [harz]
  image: node:20
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
  script:
    - cd product/bff
    - pnpm install --frozen-lockfile
    - pnpm format:check
  allow_failure: false

format:be:
  stage: format
  tags: [harz]
  image: mcr.microsoft.com/dotnet/sdk:10.0
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
  script:
    - cd product/backend/KarteDomainService
    - dotnet format --verify-no-changes
  allow_failure: false

# ===== Stage 2: Lint =====
# Lint が失敗したら、後続の Build/AI Review は実行されない

lint:fe:eslint:
  stage: lint
  tags: [harz]
  image: node:20
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
  script:
    - cd product/frontend
    - pnpm install --frozen-lockfile
    - pnpm lint
  allow_failure: false

lint:fe:tsc:
  stage: lint
  tags: [harz]
  image: node:20
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
  script:
    - cd product/frontend
    - pnpm install --frozen-lockfile
    - pnpm tsc --noEmit
  allow_failure: false

# ===== Stage 3: Build =====
# Build が失敗したら、後続の AI Review は実行されない

build:fe:
  stage: build
  tags: [harz]
  image: node:20
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
  script:
    - cd product/frontend
    - pnpm install --frozen-lockfile
    - pnpm build
  artifacts:
    paths:
      - product/frontend/.next/
    expire_in: 1 hour
  allow_failure: false

build:bff:
  stage: build
  tags: [harz]
  image: node:20
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
  script:
    - cd product/bff
    - pnpm install --frozen-lockfile
    - pnpm build
  artifacts:
    paths:
      - product/bff/dist/
    expire_in: 1 hour
  allow_failure: false

# ===== Stage 4: Unit Test =====
test:fe:vitest:
  stage: unit_test
  tags: [harz]
  image: node:20
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
  script:
    - cd product/frontend
    - pnpm install --frozen-lockfile
    - pnpm test:coverage
  coverage: '/Lines\s+:\s+(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: product/frontend/coverage/cobertura-coverage.xml
    paths:
      - product/frontend/coverage/
    expire_in: 7 days

test:bff:vitest:
  stage: unit_test
  tags: [harz]
  image: node:20
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
  script:
    - cd product/bff
    - pnpm install --frozen-lockfile
    - pnpm test:coverage

# ===== Stage 5: Integration Test =====
test:fe:e2e:
  stage: integration_test
  tags: [harz]
  image: mcr.microsoft.com/playwright:v1.59.1-jammy
  services:
    - postgres:17
  variables:
    POSTGRES_DB: harz_test
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/harz_test"
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
  script:
    - cd product/frontend
    - pnpm install --frozen-lockfile
    - pnpm test:e2e
  artifacts:
    when: always
    paths:
      - product/frontend/playwright-report/
      - product/frontend/test-results/
    expire_in: 7 days

test:bff:api:
  stage: integration_test
  tags: [harz]
  image: node:20
  services:
    - postgres:17
  variables:
    POSTGRES_DB: harz_test
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/harz_test"
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
  script:
    - cd product/bff
    - pnpm install --frozen-lockfile
    - pnpm test:integration

# ===== AI Review (MR 時のみ) =====
ai_review:
  stage: ai_review
  tags: [harz]
  image: python:3.12
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
  script:
    - pip install -r .gitlab/requirements.txt
    - python .gitlab/mr_review_ci.py
```

**GitLab CI の環境変数:**
- `$CI_PIPELINE_SOURCE`: イベントの種類（`push`, `merge_request_event`, `schedule` 等）
- `$CI_COMMIT_BRANCH`: 現在のブランチ名（例: `feature/login`, `develop`）
- `$CI_COMMIT_REF_NAME`: ブランチまたはタグ名

#### 2.2.2 変更箇所に応じた動的テスト実行（推奨）

**機能単位での開発において、変更された機能のテストのみを実行する:**

現在の FE テストは `ci.env` で手動切り替えを行っているが、これを変更検出スクリプトで自動化する。

**仕組み:**
1. `.gitlab/detect-changed-features.sh` が変更されたファイルから機能コードを抽出
2. 抽出した機能コードから `package.json` のテストスクリプト名を特定
3. `ci.env` を自動生成して該当機能のテストのみ実行

**変更検出スクリプト（`.gitlab/detect-changed-features.sh`）:**

```bash
#!/bin/bash
set -e

echo "=== 変更検出スクリプト開始 ==="

# 変更されたファイル一覧を取得
CHANGED_FILES=$(git diff --name-only ${CI_COMMIT_BEFORE_SHA}..${CI_COMMIT_SHA} 2>/dev/null || echo "")

if [ -z "$CHANGED_FILES" ]; then
  echo "⚠️  変更ファイルが検出できない → 全テスト実行"
  echo "VITEST_SCRIPT=test:run" > ci.env
  echo "E2E_SCRIPT=test:e2e" >> ci.env
  exit 0
fi

# 変更された機能コードを抽出（例: REC002, ORD076）
CHANGED_FEATURES=$(echo "$CHANGED_FILES" | \
  grep -E "product/frontend/src/features/.*/test/" | \
  sed -E 's|product/frontend/src/features/.*/([A-Z]+[0-9]+)/.*|\1|' | \
  sort -u)

# package.json から利用可能なテストスクリプト一覧を取得
AVAILABLE_VITEST=$(grep -oP '"test:[A-Z]+[0-9]+"' package.json | tr -d '"' | tr '\n' ' ')
AVAILABLE_E2E=$(grep -oP '"test:e2e:[A-Z]+[0-9]+"' package.json | tr -d '"' | tr '\n' ' ')

# 実行するスクリプトを決定
VITEST_TARGET=""
E2E_TARGET=""

for feature in $CHANGED_FEATURES; do
  VITEST_SCRIPT="test:$feature"
  E2E_SCRIPT="test:e2e:$feature"
  
  # package.json に該当スクリプトが存在するか確認
  if echo "$AVAILABLE_VITEST" | grep -qw "$VITEST_SCRIPT"; then
    VITEST_TARGET="$VITEST_SCRIPT"
    break  # 最初に見つかった機能のみ実行（複数機能変更時は全テスト実行）
  fi
done

# 機能コードが特定できない、または複数機能変更の場合は全テスト実行
if [ -z "$VITEST_TARGET" ]; then
  echo "⚠️  機能コード特定失敗 または 複数機能変更 → 全テスト実行"
  VITEST_TARGET="test:run"
  E2E_TARGET="test:e2e"
else
  # E2E スクリプトも同様に特定
  E2E_SCRIPT="test:e2e:${VITEST_TARGET#test:}"
  if echo "$AVAILABLE_E2E" | grep -qw "$E2E_SCRIPT"; then
    E2E_TARGET="$E2E_SCRIPT"
  else
    E2E_TARGET="test:e2e"
  fi
fi

# ci.env を生成
echo "VITEST_SCRIPT=$VITEST_TARGET" > ci.env
echo "E2E_SCRIPT=$E2E_TARGET" >> ci.env

echo "✅ テスト対象: $VITEST_TARGET / $E2E_TARGET"
cat ci.env
```

**`.gitlab-ci.yml` への組み込み:**

```yaml
# ===== Stage 4: Unit Test =====

test:fe:vitest:
  stage: unit_test
  tags: [harz]
  image: node:20
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      changes:
        - product/frontend/src/**/*
        - product/frontend/package.json
        - product/frontend/vitest.config.ts
      when: always
  before_script:
    - cd product/frontend
    - chmod +x ../../.gitlab/detect-changed-features.sh
    - ../../.gitlab/detect-changed-features.sh  # ci.env を自動生成
  script:
    - npm ci --no-audit --no-fund
    - source ci.env && npm run $VITEST_SCRIPT -- --reporter=default --reporter=junit --outputFile=junit.xml
  coverage: '/Lines\s+:\s+(\d+\.\d+)%/'
  artifacts:
    when: always
    reports:
      junit: product/frontend/junit.xml
    paths:
      - product/frontend/junit.xml

# ===== Stage 5: Integration Test =====

test:fe:e2e:
  stage: integration_test
  tags: [harz]
  image: mcr.microsoft.com/playwright:v1.59.1-jammy
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      changes:
        - product/frontend/src/**/*
      when: always
  before_script:
    - cd product/frontend
    - chmod +x ../../.gitlab/detect-changed-features.sh
    - ../../.gitlab/detect-changed-features.sh  # ci.env を自動生成
  script:
    - npm ci --no-audit --no-fund --prefer-offline
    # BFF stub 起動
    - |
      node -e "
      const CURRENT_USER = JSON.stringify({
        currentUser: { id: 'ci-user', name: 'CI User', role: '医師', department: 'CI', loginTime: new Date().toISOString() },
        userAlerts: [], proxyApprovalCount: 0, hpkiRemainingTime: ''
      });
      require('http').createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(CURRENT_USER);
      }).listen(3001);
      " &
    - npm run dev &
    - npx wait-on tcp:localhost:3000 --timeout 60000
    - source ci.env && npm run $E2E_SCRIPT
  artifacts:
    when: always
    expire_in: 7 days
    reports:
      junit: gitlab-runner/logs/junit-*.xml
    paths:
      - gitlab-runner/logs/e2e-*.log
      - gitlab-runner/logs/junit-*.xml
      - gitlab-runner/logs/videos/*.webm
```

**実行パターン例:**

| 変更内容 | 自動生成される `ci.env` | 実行されるテスト |
|---------|----------------------|----------------|
| **REC002 機能のみ** | `VITEST_SCRIPT=test:REC002`<br>`E2E_SCRIPT=test:e2e:REC002` | REC002 のテストのみ実行 |
| **ORD076 機能のみ** | `VITEST_SCRIPT=test:ORD076`<br>`E2E_SCRIPT=test:e2e:ORD076` | ORD076 のテストのみ実行 |
| **REC002 + ORD076 同時変更** | `VITEST_SCRIPT=test:run`<br>`E2E_SCRIPT=test:e2e` | 全テスト実行（安全側） |
| **共通コンポーネント修正** | `VITEST_SCRIPT=test:run`<br>`E2E_SCRIPT=test:e2e` | 全テスト実行（安全側） |
| **test/ 以外の変更** | `VITEST_SCRIPT=test:run`<br>`E2E_SCRIPT=test:e2e` | 全テスト実行 |

**メリット:**
- ✅ `ci.env` の手動書き換えが不要
- ✅ REC002 のコード変更 → `test:REC002` だけ実行（約5-10分の短縮）
- ✅ 既存の `package.json` スクリプト定義をそのまま活用
- ✅ 複数機能変更や共通コンポーネント変更時は全テスト実行（安全側に倒す）

**注意点:**
- 変更検出は `git diff` ベースで動作するため、初回コミット時は全テスト実行
- `package.json` にテストスクリプトが定義されていない機能は全テスト実行
- Format / Lint / Build ステージは常に全実行を推奨（変更箇所以外の影響を検出するため）

**BFF / BE の同様の仕組み:**

BFF および BE も FE と同じ方式（変更検出スクリプト + 環境変数ファイル自動生成）を想定する。

- **BFF**: `product/bff/ci.env` を自動生成 → `npm run $BFF_TEST_SCRIPT`
- **BE**: `product/backend/ci.env` を自動生成 → `dotnet test --filter $BE_TEST_FILTER`

各層の `package.json` / `.csproj` にテストスクリプト / フィルター定義を追加し、`.gitlab/detect-changed-features.sh` を BFF/BE 向けに拡張する。

#### 2.2.3 ブランチ名での絞り込み（オプション）

特定のブランチパターンのみで実行したい場合:

```yaml
format:fe:
  stage: format
  rules:
    # feature/* ブランチへの push 時のみ実行
    - if: '$CI_PIPELINE_SOURCE == "push" && $CI_COMMIT_BRANCH =~ /^feature\/.*/'
      when: always
    # develop ブランチへの push 時のみ実行
    - if: '$CI_PIPELINE_SOURCE == "push" && $CI_COMMIT_BRANCH == "develop"'
      when: always
  script:
    - pnpm format:check
```

#### 2.2.4 現在の推奨設定

**本プロジェクトでは以下のシンプルな分岐を推奨:**

| イベント | トリガー条件 | 実行内容 |
|---------|------------|---------|
| **Push** | `$CI_PIPELINE_SOURCE == "push"` | Format / Lint / Build / Unit Test / Integration Test（全5ステージ） |
| **MR** | `$CI_PIPELINE_SOURCE == "merge_request_event"` | AI Code Review のみ |

**理由:**
- ブランチ名でのフィルタリングは不要（すべての push で CI を実行することで品質を保証）
- main/develop ブランチは保護設定により、MR 経由でのみマージ可能
- feature/* ブランチでの開発中も常に CI が動作することで早期に問題を検出

**補足:**
- `config.toml` の `[[runners]]` セクションにも `tags` でランナーを選択可能ですが、これは「どのランナーを使うか」の指定であり、「どのブランチで実行するか」の制御ではありません。

---

### 2.3 パイプライン停止の仕組み

#### 2.3.1 GitLab CI のデフォルト動作

**ステージが失敗したら、後続のステージは実行されない（デフォルト動作）:**

```
Format (失敗) → Lint (スキップ) → Build (スキップ) → AI Review (スキップ)
```

**GitLab CI は以下のルールで動作:**
1. 同一ステージ内の複数ジョブは並列実行される
2. **1つでもジョブが失敗したら、そのステージは失敗扱い**
3. **前のステージが失敗したら、後続のステージは実行されない**
4. `allow_failure: true` を設定したジョブは、失敗してもステージは成功扱い

#### 2.3.2 MR 時のパイプライン停止設定

**すべてのジョブに `allow_failure: false` を明示:**

```yaml
format:fe:
  stage: format
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
  script:
    - pnpm format:check
  allow_failure: false  # 失敗時はパイプライン停止（デフォルトでも false だが明示）
```

**`allow_failure` の動作:**

| 設定値 | 失敗時の動作 | 用途 |
|-------|------------|------|
| `false`（デフォルト） | ステージ失敗 → 後続ステージはスキップ | Format, Lint, Build で使用 |
| `true` | ステージ成功扱い → 後続ステージは実行 | 実験的なジョブ、オプショナルなチェック |

#### 2.3.3 config.toml での設定は不要

**パイプライン停止制御は `.gitlab-ci.yml` で完結:**
- `allow_failure: false` の設定だけで実現可能
- `config.toml` は Runner の実行環境設定のみ（concurrent, executor, リソース制限等）
- パイプライン停止のための追加設定は不要

**config.toml の役割（再確認）:**
- ✅ 同時実行数の制御（`concurrent = 3`）
- ✅ Docker Executor の設定（image, volumes, リソース制限）
- ✅ キャッシュ設定
- ❌ パイプライン停止制御（`.gitlab-ci.yml` の役割）

#### 2.3.4 実行例

**成功パターン:**
```
Format (成功) → Lint (成功) → Build (成功) → AI Review (実行)
```

**Format 失敗パターン:**
```
Format (format:fe 失敗) → パイプライン停止
                       → Lint はスキップ
                       → Build はスキップ
                       → AI Review はスキップ
```

**Lint 失敗パターン:**
```
Format (成功) → Lint (lint:fe:eslint 失敗) → パイプライン停止
                                           → Build はスキップ
                                           → AI Review はスキップ
```

**Build 失敗パターン:**
```
Format (成功) → Lint (成功) → Build (build:fe 失敗) → パイプライン停止
                                                     → AI Review はスキップ
```

**開発者への通知:**
- GitLab は失敗したステージの情報をメール/Slack/GitLab UI で即座に通知
- 開発者は Format 失敗時点で修正に着手できる（AI Review を待つ必要なし）

---

## 3. 各ステージの詳細設計

### 3.1 Stage 1: Format

| ジョブ名 | 対象 | コマンド | 備考 |
|---------|------|---------|------|
| `check:protected-files` | 全体 | `bash .gitlab/check_protected_files.sh` | プロテクトファイルチェック |
| `format:fe` | FE | `pnpm prettier --check "src/**/*.{ts,tsx}"` | .prettierrc 追加必要 |
| `format:bff` | BFF | `pnpm prettier --check "src/**/*.ts"` | 同上 |
| `format:be` | BE | `dotnet format --verify-no-changes` | .editorconfig 使用 |

**Prettier を選んだ理由:**

基盤側の詳細な選定理由は [docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/11.開発規律と品質管理.md](../../02_アプリ基盤/01_フロントエンド/02_詳細設計書/11.開発規律と品質管理.md) を参照。

1. **VSCode の自動整形機能（Format on Save）と相性が良い**
   - VSCode 拡張機能が `node_modules/prettier` を自動的に呼び出す
   - 保存時に自動整形されるため、手動コマンド実行が不要
   - CI での Format チェック失敗を事前に防げる

2. **チーム全体でバージョンとルールを統一**
   - `package.json` でバージョンを固定し、全員が同じ整形結果を得られる
   - `.prettierrc` で統一ルールを共有（semi, singleQuote, trailingComma 等）
   - メンバー間での整形結果の差異を完全に排除

3. **CI/CD での自動チェックが可能**
   - `npx prettier --check .` で整形チェックを品質ゲートとして機能させる
   - MR 時の Format ステージで自動的に検証

4. **開発体験の向上**
   - スタイルの統一により、レビュー時に本質的でない差分（スペース、改行位置等）を排除
   - レビューが設計やロジックに集中でき、効率化される
   - マージコンフリクトの削減（スペースや改行の違いによるコンフリクトが発生しにくい）

5. **ESLint との役割分担**
   - ESLint: 「コードの正しさ」をチェック（未使用変数、型エラー等）
   - Prettier: 「コードの見た目」を機械的に統一（整形のみ）
   - 両者を組み合わせることで、品質と可読性の両方を担保

**プロテクトファイルチェック（Format ステージの最初に実行）:**

Format ステージでは、コード整形チェックの前に **プロテクトファイル** の diff チェックを実行します。これにより、意図しない重要ファイルの変更・削除を早期に検出します。

**チェック対象ファイル:**

| カテゴリ | ファイル | チェック内容 |
|---------|---------|------------|
| **Docker 設定** | `Dockerfile`, `docker-compose.yml`, `.dockerignore` | 意図しない編集・削除の検出 |
| **依存関係** | `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `node_modules/` | `node_modules/` が Git に追加されていないか |
| **Prettier 設定** | `.prettierrc`, `.prettierignore` | 設定ファイルの削除・破壊的変更の検出 |
| **ESLint 設定** | `eslint.config.mjs`, `.eslintrc.*`, `.eslintignore` | 設定ファイルの削除・破壊的変更の検出 |
| **TypeScript 設定** | `tsconfig.json`, `tsconfig.*.json` | 設定ファイルの削除・破壊的変更の検出 |
| **エラー監視** | `glitchtip.*.config.js`, `.glitchtipclirc` | GlitchTip 設定の削除・破壊的変更の検出 |
| **環境変数** | `.env.example`, `.env.local` (Git 管理外) | `.env.local` が誤って Git に追加されていないか |
| **CI/CD 設定** | `.gitlab-ci.yml`, `.gitlab/**/*` | CI 設定の意図しない変更の検出 |
| **Windows 移動ファイル** | `*:Zone.Identifier` | Windows から Linux へのファイル移動時に生成される不要ファイルを検出・削除 |

**チェックスクリプト例（`.gitlab/check_protected_files.sh`）:**

```bash
#!/bin/bash
set -e

echo "=== プロテクトファイルチェック ==="

# Git diff で変更されたファイル一覧を取得
CHANGED_FILES=$(git diff --name-only $CI_COMMIT_BEFORE_SHA..$CI_COMMIT_SHA)

# チェック対象のプロテクトファイルパターン
PROTECTED_PATTERNS=(
  "Dockerfile"
  "docker-compose.yml"
  ".dockerignore"
  "package.json"
  "package-lock.json"
  "pnpm-lock.yaml"
  ".prettierrc"
  ".prettierignore"
  "eslint.config.mjs"
  ".eslintrc"
  ".eslintignore"
  "tsconfig.json"
  "glitchtip.*.config.js"
  ".glitchtipclirc"
  ".gitlab-ci.yml"
  ".gitlab/"
)

# 禁止ファイルパターン（Git に追加してはいけないファイル）
FORBIDDEN_PATTERNS=(
  "node_modules/"
  ".env.local"
  ".env.production"
  "*.log"
  "*.secret"
  ".DS_Store"
  "*:Zone.Identifier"
)

# プロテクトファイルの変更チェック
for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if echo "$CHANGED_FILES" | grep -q "$pattern"; then
    echo "⚠️  警告: プロテクトファイル '$pattern' が変更されています"
    echo "   変更が意図的かどうか確認してください。"
    # 警告のみ（エラーにはしない）
  fi
done

# 禁止ファイルの追加チェック
for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
  if echo "$CHANGED_FILES" | grep -q "$pattern"; then
    echo "❌ エラー: 禁止ファイル '$pattern' が Git に追加されています"
    echo "   このファイルは Git に含めるべきではありません。"
    echo "   .gitignore を確認してください。"
    exit 1  # パイプライン停止
  fi
done

echo "✅ プロテクトファイルチェック完了"
```

**`.gitlab-ci.yml` への追加:**

```yaml
check:protected-files:
  stage: format
  tags: [harz]
  image: alpine/git:latest
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
  script:
    - chmod +x .gitlab/check_protected_files.sh
    - .gitlab/check_protected_files.sh
  allow_failure: false  # 禁止ファイルが検出されたらパイプライン停止
```

**チェックの動作:**

| 検出内容 | 動作 |
|---------|------|
| プロテクトファイルの変更 | ⚠️ 警告のみ（パイプラインは継続） |
| 禁止ファイルの追加（`node_modules/`, `.env.local` 等） | ❌ エラー（パイプライン停止） |

**前提条件:**
- [ ] `.gitlab/check_protected_files.sh` スクリプトを作成
- [ ] `.prettierrc` を FE/BFF に追加
- [ ] FE に `pnpm format` スクリプト追加
- [ ] BFF に `pnpm format` スクリプト追加
- [ ] 開発者の VSCode に Prettier 拡張機能をインストール推奨
- [ ] VSCode の `settings.json` に `"editor.formatOnSave": true` を設定推奨

**推定実装時間:** 21時間（プロテクトファイルチェックスクリプト作成1時間 + 設定ファイル作成 + スクリプト追加 + テスト20時間）

---

### 3.2 Stage 2: Lint

| ジョブ名 | 対象 | コマンド | 備考 |
|---------|------|---------|------|
| `lint:fe:eslint` | FE (TS/TSX) | `pnpm eslint` | ✅ 既存設定あり |
| `lint:fe:stylelint` | FE (CSS) | `pnpm stylelint "src/**/*.css"` | ⚠️ 設定ファイル追加必要 |
| `lint:fe:tsc` | FE (型) | `pnpm tsc --noEmit` | ✅ 可能 |
| `lint:bff:eslint` | BFF (TS) | `pnpm eslint "src/**/*.ts"` | ⚠️ eslint.config.mjs 追加必要 |
| `lint:bff:tsc` | BFF (型) | `pnpm tsc --noEmit` | ✅ 可能 |
| `lint:be:analyzer` | BE (C#) | `dotnet build --no-restore /p:TreatWarningsAsErrors=true` | ✅ 既存 Roslyn 使用 |

**ESLint を選んだ理由:**
- **TypeScript/React/Next.js のデファクトスタンダード**
  - JavaScript/TypeScript エコシステムで最も広く使われている静的解析ツール
  - React の公式ドキュメントでも推奨されている
- **豊富なルールセットとプラグイン**
  - `@typescript-eslint`: TypeScript 特有の問題を検出
  - `eslint-plugin-react`: React コンポーネントのベストプラクティスをチェック
  - `eslint-plugin-react-hooks`: Hooks の依存配列の抜け漏れを検出
  - Next.js は `eslint-config-next` で推奨設定を提供
- **コードの問題を事前に検出**
  - 未使用変数、到達不可能なコード、誤った比較演算子などを検出
  - バグの温床となるパターンを自動で発見
- **チーム全体でのコード品質の統一**
  - ルール設定をプロジェクトで共有することで、全員が同じ基準でコードを書ける
  - レビュー時の指摘ポイントが減り、本質的な設計議論に集中できる
- **VSCode との統合**
  - VSCode の ESLint 拡張機能により、コーディング中にリアルタイムで問題を検出
  - 自動修正機能（`eslint --fix`）で一部の問題を自動解決

**参考**: 詳細な設定は [docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/02.開発環境.md](../../02_アプリ基盤/01_フロントエンド/02_詳細設計書/02.開発環境.md) を参照

**前提条件:**
- [ ] FE に `.stylelintrc` 追加（Tailwind CSS 対応ルール）
- [ ] BFF に `eslint.config.mjs` 追加
- [ ] `pnpm lint` スクリプトの統合化
- [ ] 開発者の VSCode に ESLint 拡張機能をインストール推奨

**個人ランナーでの並列実行:**
- ❌ **不可** — GitLab CI Free Tier の個人ランナーは 1 並列のみ
- Kubernetes 移行後は `parallel: 3-6` で並列化可能

**推定実装時間:** 20時間

---

### 3.3 Stage 3: Build

| ジョブ名 | 対象 | コマンド | 備考 |
|---------|------|---------|------|
| `build:fe` | FE | `pnpm build` | Next.js Webpack ビルド |
| `build:bff` | BFF | `pnpm build` | TypeScript → JS コンパイル |
| `build:be` | BE | `dotnet build --configuration Release` | .NET 10 |
| `build:storybook` | Storybook | `pnpm build-storybook` | 静的ビルド |

**artifacts:**
- FE: `.next/`（次ステージで使用）
- BFF: `dist/`（次ステージで使用）
- BE: `bin/Release/`
- Storybook: `storybook-static/`

**並列実行:**

**推定実装時間:** 20時間

---

### 3.4 Stage 4: Unit Test

| ジョブ名 | 対象 | コマンド | Coverage | 備考 |
|---------|------|---------|----------|------|
| `test:fe:vitest` | FE Unit | `pnpm test:coverage` | 70% 閾値 | ✅ 166 テスト |
| `test:bff:vitest` | BFF Unit | `pnpm test:coverage` | 未設定 | ✅ 18 テスト |
| `test:be:nunit` | BE Unit | `dotnet test --collect:"XPlat Code Coverage"` | 未設定 | ⚠️ 7 テストのみ |
| `test:storybook:vitest` | Storybook | `pnpm test-storybook` | - | ⚠️ 未実装 |

**Coverage レポート:**
- HTML レポートを artifacts として保存
- MR コメントに Coverage サマリーを投稿（スクリプト追加必要）
-

**並列実行:**  可能

**前提条件:**

**推定実装時間:**    時間（Coverage 設定 + BE カバレッジ統合 + Storybook Test Runner 設定）

---

### 3.5 Stage 5: Integration Test

| ジョブ名 | 対象 | コマンド | 備考 |
|---------|------|---------|------|
| `test:fe:e2e` | FE E2E | `pnpm test:e2e` | ⚠️ 3 spec のみ → 大幅増強必要 |
| `test:bff:api` | BFF API | `pnpm test:integration` | ⚠️ 未実装 |
| `test:be:api` | BE API | `dotnet test --filter Category=Integration` | ⚠️ 未実装 |

**サービス依存:**
- PostgreSQL (docker service)
- Next.js dev server (FE E2E 用)

**artifacts:**
- Playwright traces, screenshots, videos

**並列実行:**
- ❌ **不推奨** — E2E テストは順次実行が安全
- 個人ランナーでは順次実行

**前提条件:**
- [ ] E2E テストの大幅な追加実装（135 stories → 最低 30-50 E2E spec）
- [ ] BFF 統合テスト実装（Supertest または Vitest HTTP テスト）
- [ ] BE 統合テスト実装（WebApplicationFactory + TestContainers）
- [ ] PostgreSQL service コンテナの追加

**推定実装時間:** 
- E2E 追加実装: 時間（1 spec あたり 1-1.5h × 50 spec）
- BFF 統合テスト: 時間
- BE 統合テスト: 時間
- CI 統合: 時間

**合計推定: 60時間超**

---

## 4. 段階的実装ロードマップ

### Phase 0: AI MR Review の品質向上（2.5週間）

**現在の設定（`.claude/cicd/mr_review_ci.py`）:**

| 項目 | 現在の設定値 | 目的 |
|------|------------|------|
| **Serena MCP: ファイル数上限** | `changed_files[:100]` | 最初の100ファイルのみ分析（Claude input token 削減） |
| **Serena MCP: シンボル数上限** | `symbols[:30]` | 1ファイルあたり最初の30シンボルのみ表示（token 削減） |
| **Context7 MCP: 技術スタック** | `react`, `next.js`, `zustand`, `typescript` | ライブラリドキュメント参照対象 |
| **diff 分割閾値** | 未実装（全 diff を一度に送信） | Phase 0 で実装予定（500行以上で分割） |

**現在の課題:**
- 大きな MR（100ファイル超、500行超の diff）で Claude input token が膨大になる
- Serena で100ファイル × 30シンボルの情報を送ると、レビュー本体の token が圧迫される
- Context7 でライブラリドキュメントを取得すると、さらに token が増加
- 結果として Claude のレビュー精度が低下する

**タスク:**
1. **Context7 MCP の導入（✅ 実装済み）**
   - `.gitlab/mr_review_ci.py` への Context7 統合（完了）
   - ライブラリドキュメント参照機能の追加（完了）
   - Next.js, React, Zustand, TypeScript のドキュメント取得設定（完了）

2. **長 diff のレビュー分割機能（🚧 未実装）**
   - diff サイズの自動判定（500行以上で分割）
   - ファイルグループ別レビュー（FE / BFF / BE）
   - 複数回のレビューコメント投稿機能
   - レビュー結果のサマリー統合

3. **Serena/Context7 の token 最適化（🚧 未実装）**
   - Serena: ファイル数上限を100 → 60に削減（40%削減）
   - Serena: シンボル数上限を30 → 20に削減（33%削減）
   - Context7: 必要なライブラリのみ動的に取得（現在は全4ライブラリを毎回取得）
   - 変更ファイルの拡張子でフィルタリング（.ts, .tsx, .cs のみ対象）

4. **レビュー品質の向上**
   - Serena MCP の活用強化（コード分析精度向上）
   - レビュー観点の明確化（セキュリティ / パフォーマンス / 保守性）
   - false positive の削減（既存プロジェクトのコンテキスト学習）

5. **CI 統合の改善**
   - レビュー失敗時の適切なエラーハンドリング
   - レビュー時間のモニタリング
   - トークン使用量の最適化

**推定時間:** 20時間

**成果物:**
- ✅ 長い diff でも高品質なレビューが受けられる
- ✅ ライブラリ使用方法の正確な指摘が可能
- ✅ Claude の応答品質が大幅に向上

**詳細設計:**
```python
# .gitlab/mr_review_ci.py の改善例
def split_diff_by_size(diff_content: str, max_lines: int = 500) -> list[str]:
    """diff を適切なサイズに分割"""
    pass

def review_with_context7(file_path: str, diff: str) -> str:
    """Context7 でライブラリドキュメント取得してレビュー"""
    pass

def post_review_comments_in_batches(mr_iid: int, comments: list) -> None:
    """複数回に分けてレビューコメント投稿"""
    pass
```

---

### Phase 1: Lint の整備（2週間）

**タスク:**
1. `.prettierrc` を FE/BFF に追加
2. `.stylelintrc` を FE に追加（Tailwind CSS 対応）
3. BFF に `eslint.config.mjs` 追加
4. `lint:*` ジョブを `.gitlab-ci.yml` に追加
5. ローカルランナーでテスト実行
6. pre-commit hook の設定（オプション）

**推定時間:** 15時間

**成果物:**
- ✅ Lint ステージが動作
- ✅ MR で静的解析が自動実行される
- ✅ コードスタイルの統一

---

### Phase 2: Build & Unit Test の有効化（1.5週間）

**タスク:**
1. `build:*` ジョブを `.gitlab-ci.yml` に追加
2. artifacts 設定の追加
3. BFF の vitest.config.ts に coverage 閾値追加
4. BE に coverlet.collector 追加
5. `test:fe:vitest` と `test:bff:vitest` の `when: never` を削除
6. Coverage レポート artifacts 設定
7. MR への Coverage サマリー投稿機能

**推定時間:** 12時間

**成果物:**
- ✅ Build ステージが動作
- ✅ Unit Test ステージが動作
- ✅ Coverage レポートが MR で確認可能

---

### Phase 3: Storybook Test の増強（2週間）

**タスク:**
1. **Storybook Test Runner のセットアップ**
   - `@storybook/test-runner` のインストール
   - Vitest との統合設定
   - `test:storybook:vitest` ジョブの追加
2. **Visual Regression Test の導入**
   - Playwright を使った screenshot 比較
   - `@storybook/addon-interactions` の活用
   - ベースライン画像の管理（Git LFS 推奨）
   - 差分検出の閾値設定
3. **MSW ハンドラーのテストカバレッジ検証**
   - API モックの動作確認
   - エラーケースのテスト追加

**推定時間:** 15時間

**成果物:**
- ✅ Storybook のコンポーネントテストが自動実行される
- ✅ Visual Regression Test で UI 変更を自動検出
- ✅ screenshot diff が MR で確認可能

**Visual Regression Test の実装例:**
```typescript
// .storybook/test-runner.ts
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

export const postRender = async (page, context) => {
  const image = await page.screenshot();
  expect(image).toMatchImageSnapshot({
    customSnapshotsDir: '__snapshots__',
    customSnapshotIdentifier: context.id,
    failureThreshold: 0.01, // 1% の差異まで許容
    failureThresholdType: 'percent',
  });
};
```

---

### Phase 4: E2E テストの増強（2.5週間）

**タスク:**
1. E2E テスト計画の策定（135 stories → 20-30 E2E spec）
2. **優先度の高いフローを選定**
   - ログイン・ログアウト
   - 患者検索・詳細表示
   - カルテ記録・編集・削除
   - 診療予約・変更・キャンセル
   - 処方入力・修正
3. E2E テストの段階的実装（1 sprint = 10 spec × 2 sprint）
4. `test:fe:e2e` ジョブの有効化
5. Playwright traces の artifacts 設定
6. E2E テスト実行時間の最適化

**推定時間:** 20時間

**成果物:**
- ✅ 主要なユーザーフローが E2E でカバーされる
- ✅ Playwright レポートが MR で確認可能
- ✅ E2E テスト実行時間が 15 分以内

**Note:** 当初の 50 spec から 20-30 spec に削減。重複する E2E テストを避け、Storybook Test と役割分担。

---

### Phase 5: その他テスト開発

**BFF / BE のテスト開発はアプリ基盤側で対応**

BFF および BE の統合テスト・単体テストは、アプリケーション基盤チームが別途実装します。
詳細な計画・実装・CI 統合は基盤側のドキュメントを参照してください。

**対象:**
- BFF 統合テスト（API エンドポイント、認証・認可）
- BE 統合テスト（PostgreSQL DB 操作、FHIR リソース変換）
- CI 統合（PostgreSQL service コンテナ、`test:bff:api`, `test:be:api` ジョブ）
- ✅ 基盤チームが確立され、継続的なテスト追加が可能

---

### Phase 6: Kubernetes 移行の準備（将来的な選択肢）

**現在の構成:**
- 共有ランナー用 PC（ubuntu）で `concurrent = 3` の Docker Executor を使用
- 固定サーバーでの運用（手動でのリソース管理）

**Kubernetes 移行のメリット（インフラ提供があれば検討）:**

#### A. Autoscaling（リソースの自動拡張・縮小）
- **自動スケールアウト:** ジョブが増えた際に自動で Pod（実行環境）を追加作成
- **自動スケールイン:** ジョブ完了後、未使用の Pod を自動削除してコスト削減
- **Horizontal Pod Autoscaler (HPA):** CPU/メモリ使用率に応じて自動でノード（サーバー）を増設
- **Karpenter（AWS環境）:** クラスター側で自動的にEC2インスタンスを追加・削除

#### B. リソース管理の効率化
- **要求量（requests）と上限値（limits）の明示:**
  ```yaml
  variables:
    KUBERNETES_CPU_REQUEST: "4"         # 4コア空いてないと実行しない
    KUBERNETES_MEMORY_REQUEST: "8Gi"    # 8GB空いてないと実行しない
    KUBERNETES_CPU_LIMIT: "8"
    KUBERNETES_MEMORY_LIMIT: "16Gi"
  ```
- **自動キュー待機:** リソース不足時、Kubernetes側が自動でジョブを pending 状態にする
- **「エグゼキューター数をいくつに設定すれば安全か？」という計算から解放**

#### C. 並列実行の最大化
- 共有PC: `concurrent = 3`（固定）
- Kubernetes: 必要に応じて Pod を動的に増やすため、理論上は無制限に並列実行可能
- CI実行時間が **約25分（60%短縮）** に到達可能

#### D. 障害耐性の向上
- Pod障害時の自動再起動
- ノード障害時の自動フェイルオーバー
- 共有PC故障時のリスクを分散

**移行の判断基準:**
- 現在の共有PC（concurrent = 3）で CI実行時間が約39分に短縮される
- **Kubernetesへの移行は、インフラ提供があり、かつ以下の条件を満たす場合のみ検討:**
  - CI実行頻度が高く、さらなる短縮が必要（25分以下を目指す）
  - 複数プロジェクトで Runner を共有したい
  - Autoscaling によるコスト最適化が見込める
  - クラウド（AWS, GCP, Azure）環境が利用可能

**タスク（Kubernetes 環境が提供された場合のみ実施）:**
1. `.gitlab-ci.yml` の `parallel` 設定追加（コメントアウト状態）
2. Kubernetes GitLab Runner の設定ファイル作成
3. Docker Image のキャッシュ戦略最適化
4. 並列実行のテスト（ローカルでは順次、K8s で並列）
5. リソース制限の設定（CPU / Memory）

**推定時間:** 15時間

**成果物:**
- ✅ Kubernetes 移行時に即座に並列実行が有効化できる設定
- ✅ Docker Image のキャッシュで CI 実行時間が短縮
- ✅ リソース使用量の最適化

---

## 5. 共有ランナーの設定戦略

### 5.1 共有ランナー用 PC の config.toml 設定

**対象:** 1台の ubuntu PC を5人の開発者で共有するシナリオ

**設定ファイル:** `/etc/gitlab-runner/config.toml`

**重要:** パイプライン停止処理は `.gitlab-ci.yml` の `allow_failure: false` で制御されるため、config.toml 側での追加設定は不要。

```toml
# 全体設定
concurrent = 3  # 同時に実行できる総ジョブ数（推奨: 3〜5）
check_interval = 0

# Session Server（デバッグ用）
[session_server]
  session_timeout = 1800

# Runner 登録（各開発者またはプロジェクト単位）
[[runners]]
  name = "harz-shared-runner"
  url = "https://gitlab.com/"
  token = "YOUR_RUNNER_TOKEN"  # GitLab から取得
  executor = "docker"
  
  # この Runner 単位の同時実行数制限
  limit = 3  # concurrent と同じか以下に設定
  
  # Docker Executor 設定
  [runners.docker]
    tls_verify = false
    image = "node:20"  # デフォルトイメージ
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    volumes = ["/cache"]  # キャッシュ用ボリューム
    shm_size = 0
    
    # リソース制限（推奨設定）
    memory = "4g"        # ジョブ1つあたりの最大メモリ
    memory_swap = "4g"
    cpus = "2"           # ジョブ1つあたりの最大CPU数
    
  # キャッシュ設定
  [runners.cache]
    Type = "local"
    Shared = true
    [runners.cache.local]
      BasePath = "/srv/gitlab-runner/cache"
```

**設定のポイント:**
- `concurrent = 3`: 同時に3ジョブまで実行可能（PC性能に応じて3〜5に調整）
- `limit = 3`: この Runner 登録で同時に実行できるジョブ数を制限
- `memory = "4g"`: 1ジョブあたり4GBまで使用可（合計12GB想定）
- `cpus = "2"`: 1ジョブあたり2コアまで使用（合計6コア想定）

**リソース見積もり例（concurrent = 3 の場合）:**
- CPU: 最低6コア以上推奨（3ジョブ × 2コア/ジョブ）
- メモリ: 最低12GB以上推奨（3ジョブ × 4GB/ジョブ）
- ディスク: SSD 100GB以上（Docker イメージキャッシュ用）

**concurrent の決め方:**
```
concurrent = min(
  floor(CPU_CORES / 2),
  floor(MEMORY_GB / 4)
)

例: 8コア / 16GB のマシン
  → concurrent = min(8/2, 16/4) = min(4, 4) = 3〜4 が適切
```

### 5.2 並列実行の制約

**共有 PC の GitLab Runner（concurrent = 3）:**
- ✅ **3ジョブまで並列実行可能** — ただし `.gitlab-ci.yml` で並列化設定が必要
- ⚠️ **同一ステージ内のジョブのみ並列化** — 異なるステージは順次実行

**実行フロー:**
```
Format (順次) → Lint (最大3並列) → Build (最大3並列) → Unit Test (最大3並列) → Integration Test (順次)
```

**各ステージ内のジョブの並列実行例（concurrent = 3 の場合）:**
```
Stage: Lint (6ジョブ)
  ├─ lint:fe:eslint   ┐
  ├─ lint:fe:stylelint├─ 同時実行（3ジョブ）
  ├─ lint:fe:tsc      ┘
  └─ lint:bff:eslint  ┐
  └─ lint:bff:tsc     ├─ 次の2ジョブを実行
  └─ lint:be:analyzer ┘
```

### 5.3 実行時間の見積もり

| ステージ | ジョブ数 | 平均実行時間 | 平均使用メモリ | 合計時間（順次） | 合計時間（共有PC: concurrent=3） |
|---------|---------|------------|--------------|----------------|------------------------------|
| Format | 3 | 30秒 | 0.5GB | 1.5分 | 1分（3並列） |
| Lint | 6 | 1分 | 1GB | 6分 | 2分（3+3並列） |
| Build | 4 | 2-3分 | 3GB | 10分 | 6分（3+1並列） |
| Unit Test | 4 | 2-5分 | 2GB | 14分 | 10分（3+1並列） |
| Integration Test | 3 | 5-15分 | 4GB | 30分 | 20分（3並列） |
| **合計** | **20** | - | **最大4GB/ジョブ** | **約62分** | **約39分（37%短縮）** |

**平均使用メモリの測定方法:**
- GitLab CI の `docker stats` コマンドで実行中のコンテナメモリ使用量を監視
- 各ジョブの実行中に `docker stats --no-stream <container_id>` を定期的に実行し、ピーク値を記録

**Kubernetes 移行後（完全並列実行）:**
- Format: 30秒（並列不要）
- Lint: 1分（6ジョブ並列）
- Build: 3分（4ジョブ並列）
- Unit Test: 5分（4ジョブ並列）
- Integration Test: 15分（並列不推奨）
- **合計: 約25分（60%短縮）**

---

## 6. 前提条件と追加実装タスク

### 7.1 設定ファイルの追加

| ファイル | 対象 | 内容 | 推定時間 |
|---------|------|------|---------|
| `product/frontend/.prettierrc` | FE | Prettier 設定 | 30分 |
| `product/bff/.prettierrc` | BFF | Prettier 設定 | 30分 |
| `product/frontend/.stylelintrc` | FE | StyleLint 設定（Tailwind 対応） | 1時間 |
| `product/bff/eslint.config.mjs` | BFF | ESLint 設定 | 1時間 |
| `product/backend/KarteDomainService/.editorconfig` | BE | EditorConfig（既存を強化） | 30分 |

### 7.2 package.json スクリプトの追加

**FE (`product/frontend/package.json`):**
```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\"",
    "stylelint": "stylelint \"src/**/*.css\"",
    "test-storybook": "test-storybook"
  }
}
```

**BFF (`product/bff/package.json`):**
```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "lint": "eslint \"src/**/*.ts\"",
    "test:integration": "vitest --run --config vitest.integration.config.ts"
  }
}
```

**推定時間:** 1時間

### 7.3 NuGet パッケージの追加 (BE)

**`product/backend/KarteDomainService/KarteDomainService.Tests.csproj`:**
```xml
<ItemGroup>
  <PackageReference Include="coverlet.collector" Version="6.0.0" />
  <PackageReference Include="Testcontainers.PostgreSql" Version="4.0.0" />
</ItemGroup>
```

**推定時間:** 30分

### 7.4 Storybook Test Runner のセットアップ

**FE (`product/frontend/`):**
```bash
pnpm add -D @storybook/test-runner
```

**`package.json` に追加:**
```json
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

**推定時間:** 2-3時間（Vitest 統合設定含む）

---

## 8. 全体スケジュールと工数見積もり

### 8.1 実装フェーズ別工数

| フェーズ | タスク | 推定時間 |
|---------|-------|---------|
| **Phase 0** | AI MR Review 品質向上（Context7 導入、長 diff 分割） | 20時間 |
| **Phase 1** | Lint 整備（Prettier, StyleLint, ESLint） | 15時間 |
| **Phase 2** | Build & Unit Test 有効化（Coverage レポート含む） | 12時間 |
| **Phase 3** | Storybook Test 増強（Visual Regression Test 含む） | 15時間 |
| **Phase 4** | E2E テスト増強（20-30 spec、優先度重視） | 20時間 |
| **Phase 5** | BFF/BE 統合テスト（基盤チーム作成） | 25時間 |
| **Phase 6** | Kubernetes 移行準備（インフラ提供時のみ） | 15時間 |
| **合計（Phase 0-5）** | - | **107時間** |
| **合計（K8s含む）** | - | **122時間** |


---

## 9. Storybook Visual Regression Test の補足

### 9.1 実装方法

**使用ツール:**
- `@storybook/test-runner` (Playwright ベース)
- `jest-image-snapshot` (screenshot 比較)

**ワークフロー:**
1. 各 story を Playwright でレンダリング
2. screenshot を取得
3. ベースライン画像と比較
4. 差分が閾値（1%）を超えたら失敗

**ベースライン管理:**
- `__snapshots__/` ディレクトリに保存
- Git LFS で管理（サイズが大きいため）
- 意図的な UI 変更時は `--updateSnapshot` で更新

### 9.2 CI での実行

```yaml
test:storybook:visual:
  stage: unit_test
  tags: [harz]
  image: mcr.microsoft.com/playwright:v1.59.1-jammy
  script:
    - cd product/frontend
    - pnpm install --frozen-lockfile
    - pnpm build-storybook
    - pnpm test-storybook
  artifacts:
    when: on_failure
    paths:
      - product/frontend/__image_snapshots__/__diff_output__/
    expire_in: 7 days
```

### 9.3 差分レポート

- CI で失敗時、`__diff_output__/` に差分画像が保存される
- MR コメントに差分画像を自動投稿（スクリプト追加必要）
- 開発者は差分を確認して承認 or 修正

**推定実装時間（Phase 3 に含む）:** 5時間

---

## 10. GitLab CI/CD 設定ファイル（サンプル）

### 10.1 概要

以下は、2.1節で定義したパイプライン実行フローを実装した `.gitlab-ci.yml` のサンプルです。

**トリガー条件:**
- **develop への MR 時:** Format → Lint → Build → Unit Test → Deploy(Dev) → AI Review（6ステージ）
- **main への MR 時:** Format → Lint → Build → Unit Test → Deploy(Stg) → Integration Test → AI Review（7ステージ）

**パイプライン停止の仕組み:**
- 各ステージで `allow_failure: false` を設定し、失敗時は後続ステージを実行しない

---

### 10.2 develop ブランチへの MR 時の設定

```yaml
# ═══════════════════════════════════════════════════════════════════
# Harz CI/CD Pipeline - develop ブランチへの MR 時（6ステージ構成）
# ═══════════════════════════════════════════════════════════════════
# Stages:
#   1. format         - コード整形チェック（Prettier, dotnet format）
#   2. lint           - 静的解析（ESLint, StyleLint, tsc, Roslyn Analyzers）
#   3. build          - ビルド成功確認（FE, BFF, BE, Storybook）
#   4. unit_test      - 単体テスト（Vitest, NUnit, Storybook Test Runner）
#   5. deploy_dev     - Dev サーバーへのデプロイ
#   6. ai_review      - AI コードレビュー（Bedrock Claude Sonnet 4.6）
#
# Runner: harz (concurrent=3)
# トリガー: feature/* → develop への MR 作成時・コミット追加時
# ═══════════════════════════════════════════════════════════════════

stages:
  - format
  - lint
  - build
  - unit_test
  - deploy_dev
  - ai_review

# デフォルトの失敗時動作: ステージが失敗したら後続ステージは実行しない
default:
  retry: 0  # リトライなし（即座に失敗扱い）

# ═══════════════════════════════════════════════════════════════════
# Stage 1: Format - コード整形チェック
# ═══════════════════════════════════════════════════════════════════

format:fe:
  stage: format
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run format:check
  allow_failure: false  # 失敗時はパイプライン停止

format:bff:
  stage: format
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/bff
  script:
    - npm ci --no-audit --no-fund
    - npm run format:check
  allow_failure: false

format:be:
  stage: format
  image: mcr.microsoft.com/dotnet/sdk:10.0
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/backend/KarteDomainService
  script:
    - dotnet format --verify-no-changes
  allow_failure: false

# ═══════════════════════════════════════════════════════════════════
# Stage 2: Lint - 静的解析
# ═══════════════════════════════════════════════════════════════════

lint:fe:eslint:
  stage: lint
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run lint
  allow_failure: false

lint:fe:tsc:
  stage: lint
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npx tsc --noEmit
  allow_failure: false

lint:fe:stylelint:
  stage: lint
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run stylelint
  allow_failure: false

lint:bff:eslint:
  stage: lint
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/bff
  script:
    - npm ci --no-audit --no-fund
    - npm run lint
  allow_failure: false

lint:be:roslyn:
  stage: lint
  image: mcr.microsoft.com/dotnet/sdk:10.0
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/backend/KarteDomainService
  script:
    - dotnet build /warnaserror
  allow_failure: false

# ═══════════════════════════════════════════════════════════════════
# Stage 3: Build - ビルド成功確認
# ═══════════════════════════════════════════════════════════════════

build:fe:
  stage: build
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run build
  artifacts:
    paths:
      - product/frontend/.next/
    expire_in: 1 hour
  allow_failure: false

build:bff:
  stage: build
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/bff
  script:
    - npm ci --no-audit --no-fund
    - npm run build
  artifacts:
    paths:
      - product/bff/dist/
    expire_in: 1 hour
  allow_failure: false

build:be:
  stage: build
  image: mcr.microsoft.com/dotnet/sdk:10.0
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/backend/KarteDomainService
  script:
    - dotnet build --configuration Release
  artifacts:
    paths:
      - product/backend/KarteDomainService/bin/Release/
    expire_in: 1 hour
  allow_failure: false

build:storybook:
  stage: build
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run build-storybook
  artifacts:
    paths:
      - product/frontend/storybook-static/
    expire_in: 1 hour
  allow_failure: false

# ═══════════════════════════════════════════════════════════════════
# Stage 4: Unit Test - 単体テスト
# ═══════════════════════════════════════════════════════════════════

test:fe:vitest:
  stage: unit_test
  image: node:20
  tags:
    - harz
  variables:
    NODE_OPTIONS: "--max-old-space-size=4096"
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run test:run -- --coverage
  artifacts:
    when: always
    reports:
      junit: product/frontend/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: product/frontend/coverage/cobertura-coverage.xml
    paths:
      - product/frontend/coverage/
    expire_in: 7 days
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  allow_failure: false

test:bff:vitest:
  stage: unit_test
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/bff
  script:
    - npm ci --no-audit --no-fund
    - npm run test:run -- --coverage
  artifacts:
    when: always
    reports:
      junit: product/bff/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: product/bff/coverage/cobertura-coverage.xml
    paths:
      - product/bff/coverage/
    expire_in: 7 days
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  allow_failure: false

test:be:nunit:
  stage: unit_test
  image: mcr.microsoft.com/dotnet/sdk:10.0
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/backend/KarteDomainService
  script:
    - dotnet test --configuration Release --logger "junit;LogFilePath=TestResults/junit.xml" --collect:"XPlat Code Coverage"
  artifacts:
    when: always
    reports:
      junit: product/backend/KarteDomainService/TestResults/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: product/backend/KarteDomainService/TestResults/*/coverage.cobertura.xml
    paths:
      - product/backend/KarteDomainService/TestResults/
    expire_in: 7 days
  allow_failure: false

test:storybook:
  stage: unit_test
  image: mcr.microsoft.com/playwright:v1.59.1-jammy
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run build-storybook
    - npm run test-storybook
  artifacts:
    when: on_failure
    paths:
      - product/frontend/__image_snapshots__/__diff_output__/
    expire_in: 7 days
  allow_failure: false

# ═══════════════════════════════════════════════════════════════════
# Stage 5: Deploy (Dev) - Dev サーバーへのデプロイ
# ═══════════════════════════════════════════════════════════════════

deploy:dev:
  stage: deploy_dev
  image: alpine:latest
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - apk add --no-cache openssh-client rsync
  script:
    - echo "Deploying to Dev server..."
    # SSH 経由でデプロイ（鍵は CI/CD Variables で設定）
    - mkdir -p ~/.ssh
    - echo "$DEV_SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh-keyscan -H $DEV_SERVER_HOST >> ~/.ssh/known_hosts
    # Frontend デプロイ
    - rsync -avz --delete product/frontend/.next/ $DEV_SERVER_USER@$DEV_SERVER_HOST:/var/www/harz/frontend/
    # BFF デプロイ
    - rsync -avz --delete product/bff/dist/ $DEV_SERVER_USER@$DEV_SERVER_HOST:/var/www/harz/bff/
    # Backend デプロイ
    - rsync -avz --delete product/backend/KarteDomainService/bin/Release/ $DEV_SERVER_USER@$DEV_SERVER_HOST:/var/www/harz/backend/
    # サービス再起動
    - ssh $DEV_SERVER_USER@$DEV_SERVER_HOST "sudo systemctl restart harz-frontend harz-bff harz-backend"
    - echo "✅ Deploy to Dev server completed"
  allow_failure: false

# ═══════════════════════════════════════════════════════════════════
# Stage 6: AI Code Review（MR 作成時のみ実行）
# ═══════════════════════════════════════════════════════════════════

ai_review:
  stage: ai_review
  image: python:3.12-slim
  tags:
    - harz
  variables:
    PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"
    WORKSPACE_PATH: "/builds/harz/harz"
    LOG_DIR: "$CI_PROJECT_DIR/gitlab-runner/logs/cicd"
  cache:
    paths:
      - .cache/pip
      - .cache/npm
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: always
  before_script:
    - 'apt-get update && apt-get install -y curl git procps'
    - 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash -'
    - 'apt-get install -y nodejs'
    - 'node --version && npm --version'
    - 'pip install boto3 requests --quiet'
    - 'mkdir -p "$LOG_DIR"'
    # リソースモニタリング開始
    - 'chmod +x .gitlab/monitor-resources.sh'
    - '.gitlab/monitor-resources.sh resource-usage-ai-review.log &'
    - 'echo $! > monitor.pid'
    - 'echo "Serena MCP Server を HTTP モードで起動中..."'
    - 'pip install git+https://github.com/oraios/serena --quiet || (echo "Serena install failed" && exit 1)'
    - 'serena start-mcp-server --transport streamable-http --host 127.0.0.1 --port 8000 --project "$WORKSPACE_PATH" --log-level INFO > "$LOG_DIR/serena.log" 2>&1 & echo $! > "$LOG_DIR/serena.pid"'
    - 'echo "Serena MCP Server PID: $(cat "$LOG_DIR/serena.pid")"'
    - 'echo "Waiting for Serena to initialize (30 seconds)..."'
    - 'sleep 30'
    - 'ps aux | grep serena || echo "Warning: Serena process not found"'
    - 'curl -s http://127.0.0.1:8000/ || echo "Warning: Serena HTTP endpoint not responding"'
    - 'tail -20 "$LOG_DIR/serena.log" || true'
  script:
    - 'cd .claude/cicd'
    - 'python mr_review_ci.py'
  after_script:
    # リソースモニタリング停止
    - 'kill $(cat monitor.pid) 2>/dev/null || true'
    - 'echo "=== Resource Usage (AI Review) ==="'
    - 'tail -20 resource-usage-ai-review.log || true'
    - 'echo "=== Serena Log ==="'
    - 'cat "$LOG_DIR/serena.log" || true'
    - 'if [ -f "$LOG_DIR/serena.pid" ]; then kill $(cat "$LOG_DIR/serena.pid") 2>/dev/null || true; fi'
    - 'echo "AI レビュー完了"'
  artifacts:
    when: always
    expire_in: 7 days
    paths:
      - gitlab-runner/logs/cicd/*.log
      - resource-usage-ai-review.log
  timeout: 20 minutes
  allow_failure: true  # AI Review は失敗してもマージ可能
```

---

### 10.3 main ブランチへの MR 時の設定

```yaml
# ═══════════════════════════════════════════════════════════════════
# Harz CI/CD Pipeline - main ブランチへの MR 時（7ステージ構成）
# ═══════════════════════════════════════════════════════════════════
# Stages:
#   1. format              - コード整形チェック（Prettier, dotnet format）
#   2. lint                - 静的解析（ESLint, StyleLint, tsc, Roslyn Analyzers）
#   3. build               - ビルド成功確認（FE, BFF, BE, Storybook）
#   4. unit_test           - 単体テスト（Vitest, NUnit, Storybook Test Runner）
#   5. deploy_staging      - Staging サーバーへのデプロイ
#   6. integration_test    - 統合・E2E テスト（Playwright, API テスト）
#   7. ai_review           - AI コードレビュー（Bedrock Claude Sonnet 4.6）
#
# Runner: harz (concurrent=3)
# トリガー: develop → main への MR 作成時・コミット追加時
# ═══════════════════════════════════════════════════════════════════

stages:
  - format
  - lint
  - build
  - unit_test
  - deploy_staging
  - integration_test
  - ai_review

# デフォルトの失敗時動作: ステージが失敗したら後続ステージは実行しない
default:
  retry: 0  # リトライなし（即座に失敗扱い）

# ═══════════════════════════════════════════════════════════════════
# Stage 1: Format - コード整形チェック（develop と同様）
# ═══════════════════════════════════════════════════════════════════

format:fe:
  stage: format
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run format:check
  allow_failure: false

format:bff:
  stage: format
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/bff
  script:
    - npm ci --no-audit --no-fund
    - npm run format:check
  allow_failure: false

format:be:
  stage: format
  image: mcr.microsoft.com/dotnet/sdk:10.0
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/backend/KarteDomainService
  script:
    - dotnet format --verify-no-changes
  allow_failure: false

# ═══════════════════════════════════════════════════════════════════
# Stage 2: Lint - 静的解析（develop と同様）
# ═══════════════════════════════════════════════════════════════════

lint:fe:eslint:
  stage: lint
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run lint
  allow_failure: false

lint:fe:tsc:
  stage: lint
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npx tsc --noEmit
  allow_failure: false

lint:fe:stylelint:
  stage: lint
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run stylelint
  allow_failure: false

lint:bff:eslint:
  stage: lint
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/bff
  script:
    - npm ci --no-audit --no-fund
    - npm run lint
  allow_failure: false

lint:be:roslyn:
  stage: lint
  image: mcr.microsoft.com/dotnet/sdk:10.0
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/backend/KarteDomainService
  script:
    - dotnet build /warnaserror
  allow_failure: false

# ═══════════════════════════════════════════════════════════════════
# Stage 3: Build - ビルド成功確認（develop と同様）
# ═══════════════════════════════════════════════════════════════════

build:fe:
  stage: build
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run build
  artifacts:
    paths:
      - product/frontend/.next/
    expire_in: 1 hour
  allow_failure: false

build:bff:
  stage: build
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/bff
  script:
    - npm ci --no-audit --no-fund
    - npm run build
  artifacts:
    paths:
      - product/bff/dist/
    expire_in: 1 hour
  allow_failure: false

build:be:
  stage: build
  image: mcr.microsoft.com/dotnet/sdk:10.0
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/backend/KarteDomainService
  script:
    - dotnet build --configuration Release
  artifacts:
    paths:
      - product/backend/KarteDomainService/bin/Release/
    expire_in: 1 hour
  allow_failure: false

build:storybook:
  stage: build
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run build-storybook
  artifacts:
    paths:
      - product/frontend/storybook-static/
    expire_in: 1 hour
  allow_failure: false

# ═══════════════════════════════════════════════════════════════════
# Stage 4: Unit Test - 単体テスト（develop と同様）
# ═══════════════════════════════════════════════════════════════════

test:fe:vitest:
  stage: unit_test
  image: node:20
  tags:
    - harz
  variables:
    NODE_OPTIONS: "--max-old-space-size=4096"
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run test:run -- --coverage
  artifacts:
    when: always
    reports:
      junit: product/frontend/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: product/frontend/coverage/cobertura-coverage.xml
    paths:
      - product/frontend/coverage/
    expire_in: 7 days
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  allow_failure: false

test:bff:vitest:
  stage: unit_test
  image: node:20
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/bff
  script:
    - npm ci --no-audit --no-fund
    - npm run test:run -- --coverage
  artifacts:
    when: always
    reports:
      junit: product/bff/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: product/bff/coverage/cobertura-coverage.xml
    paths:
      - product/bff/coverage/
    expire_in: 7 days
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  allow_failure: false

test:be:nunit:
  stage: unit_test
  image: mcr.microsoft.com/dotnet/sdk:10.0
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/backend/KarteDomainService
  script:
    - dotnet test --configuration Release --logger "junit;LogFilePath=TestResults/junit.xml" --collect:"XPlat Code Coverage"
  artifacts:
    when: always
    reports:
      junit: product/backend/KarteDomainService/TestResults/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: product/backend/KarteDomainService/TestResults/*/coverage.cobertura.xml
    paths:
      - product/backend/KarteDomainService/TestResults/
    expire_in: 7 days
  allow_failure: false

test:storybook:
  stage: unit_test
  image: mcr.microsoft.com/playwright:v1.59.1-jammy
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund
    - npm run build-storybook
    - npm run test-storybook
  artifacts:
    when: on_failure
    paths:
      - product/frontend/__image_snapshots__/__diff_output__/
    expire_in: 7 days
  allow_failure: false

# ═══════════════════════════════════════════════════════════════════
# Stage 5: Deploy (Staging) - Staging サーバーへのデプロイ
# ═══════════════════════════════════════════════════════════════════

deploy:staging:
  stage: deploy_staging
  image: alpine:latest
  tags:
    - harz
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - apk add --no-cache openssh-client rsync
  script:
    - echo "Deploying to Staging server..."
    # SSH 経由でデプロイ（鍵は CI/CD Variables で設定）
    - mkdir -p ~/.ssh
    - echo "$STAGING_SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh-keyscan -H $STAGING_SERVER_HOST >> ~/.ssh/known_hosts
    # Frontend デプロイ
    - rsync -avz --delete product/frontend/.next/ $STAGING_SERVER_USER@$STAGING_SERVER_HOST:/var/www/harz/frontend/
    # BFF デプロイ
    - rsync -avz --delete product/bff/dist/ $STAGING_SERVER_USER@$STAGING_SERVER_HOST:/var/www/harz/bff/
    # Backend デプロイ
    - rsync -avz --delete product/backend/KarteDomainService/bin/Release/ $STAGING_SERVER_USER@$STAGING_SERVER_HOST:/var/www/harz/backend/
    # サービス再起動
    - ssh $STAGING_SERVER_USER@$STAGING_SERVER_HOST "sudo systemctl restart harz-frontend harz-bff harz-backend"
    - echo "✅ Deploy to Staging server completed"
  allow_failure: false

# ═══════════════════════════════════════════════════════════════════
# Stage 6: Integration Test - 統合・E2E テスト（main への MR 時のみ）
# ═══════════════════════════════════════════════════════════════════

test:e2e:playwright:
  stage: integration_test
  image: mcr.microsoft.com/playwright:v1.59.1-jammy
  tags:
    - harz
  variables:
    CI: "true"
    E2E_BASE_URL: "https://staging.harz.example.com"  # Staging サーバーの URL
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/frontend
  script:
    - npm ci --no-audit --no-fund --prefer-offline
    # Staging サーバーに対して E2E テストを実行
    - npm run test:e2e
  artifacts:
    when: always
    expire_in: 7 days
    reports:
      junit: gitlab-runner/logs/junit-*.xml
    paths:
      - gitlab-runner/logs/e2e-*.log
      - gitlab-runner/logs/junit-*.xml
      - gitlab-runner/logs/videos/*.webm
  allow_failure: false

test:api:integration:
  stage: integration_test
  image: node:20
  tags:
    - harz
  variables:
    API_BASE_URL: "https://staging-api.harz.example.com"  # Staging BFF の URL
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - cd product/bff
  script:
    - npm ci --no-audit --no-fund
    # Staging BFF に対して API 統合テストを実行
    - npm run test:integration
  artifacts:
    when: always
    reports:
      junit: product/bff/junit-integration.xml
    paths:
      - product/bff/junit-integration.xml
    expire_in: 7 days
  allow_failure: false

# ═══════════════════════════════════════════════════════════════════
# Stage 7: AI Code Review（MR 作成時のみ実行）
# ═══════════════════════════════════════════════════════════════════

ai_review:
  stage: ai_review
  image: python:3.12-slim
  tags:
    - harz
  variables:
    PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"
    WORKSPACE_PATH: "/builds/harz/harz"
    LOG_DIR: "$CI_PROJECT_DIR/gitlab-runner/logs/cicd"
  cache:
    paths:
      - .cache/pip
      - .cache/npm
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: always
  before_script:
    - 'apt-get update && apt-get install -y curl git procps'
    - 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash -'
    - 'apt-get install -y nodejs'
    - 'node --version && npm --version'
    - 'pip install boto3 requests --quiet'
    - 'mkdir -p "$LOG_DIR"'
    # リソースモニタリング開始
    - 'chmod +x .gitlab/monitor-resources.sh'
    - '.gitlab/monitor-resources.sh resource-usage-ai-review.log &'
    - 'echo $! > monitor.pid'
    - 'echo "Serena MCP Server を HTTP モードで起動中..."'
    - 'pip install git+https://github.com/oraios/serena --quiet || (echo "Serena install failed" && exit 1)'
    - 'serena start-mcp-server --transport streamable-http --host 127.0.0.1 --port 8000 --project "$WORKSPACE_PATH" --log-level INFO > "$LOG_DIR/serena.log" 2>&1 & echo $! > "$LOG_DIR/serena.pid"'
    - 'echo "Serena MCP Server PID: $(cat "$LOG_DIR/serena.pid")"'
    - 'echo "Waiting for Serena to initialize (30 seconds)..."'
    - 'sleep 30'
    - 'ps aux | grep serena || echo "Warning: Serena process not found"'
    - 'curl -s http://127.0.0.1:8000/ || echo "Warning: Serena HTTP endpoint not responding"'
    - 'tail -20 "$LOG_DIR/serena.log" || true'
  script:
    - 'cd .claude/cicd'
    - 'python mr_review_ci.py'
  after_script:
    # リソースモニタリング停止
    - 'kill $(cat monitor.pid) 2>/dev/null || true'
    - 'echo "=== Resource Usage (AI Review) ==="'
    - 'tail -20 resource-usage-ai-review.log || true'
    - 'echo "=== Serena Log ==="'
    - 'cat "$LOG_DIR/serena.log" || true'
    - 'if [ -f "$LOG_DIR/serena.pid" ]; then kill $(cat "$LOG_DIR/serena.pid") 2>/dev/null || true; fi'
    - 'echo "AI レビュー完了"'
  artifacts:
    when: always
    expire_in: 7 days
    paths:
      - gitlab-runner/logs/cicd/*.log
      - resource-usage-ai-review.log
  timeout: 20 minutes
  allow_failure: true  # AI Review は失敗してもマージ可能
```

---

### 10.4 設定ファイルの使い分け

| ブランチ | トリガー | ステージ数 | Integration Test | Deploy 先 |
|---------|---------|-----------|------------------|----------|
| **develop** | feature/* → develop への MR | 6 | なし | Dev サーバー |
| **main** | develop → main への MR | 7 | **あり**（Playwright E2E + API Test） | Staging サーバー |

**注意:**
- 上記の設定を `.gitlab-ci.yml` に統合する際は、`rules` の条件分岐により自動的に適切なステージが実行されます
- CI/CD Variables（`DEV_SSH_PRIVATE_KEY`, `STAGING_SSH_PRIVATE_KEY` 等）は GitLab の Settings > CI/CD > Variables で設定してください
