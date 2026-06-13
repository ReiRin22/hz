# /init

プロジェクトの開発基盤を初期化する。複数セッションにまたがってよい。

**人間への判断委譲は `Skill('common-decision-gate')` のプロトコルに従う。**

---

## 前提

- CLAUDE.md の `{{PROJECT_NAME}}` と `{{1行のプロジェクト説明}}` を事前に埋めておくこと

---

## やること

### 1. プロダクト概要の作成

**何を作るかを明文化するステップ。技術選定よりも先にやる。**

#### 入力の確認 [メインエージェント: 判断]

プロジェクトルートまたは任意の場所に「アイデア.md」や企画書などの参考資料があるか確認する:

```
header: "入力資料"
question: "プロダクトの参考資料（アイデア.md、企画書など）はありますか？"
options:
  - "ある（パスを教える）"
  - "ない（口頭で説明する） (推奨)"
```

#### ヒアリング [メインエージェント: 判断]

参考資料がある場合はそれを読み込んだ上で、ない場合はゼロから、ユーザーと対話する:

- **何を作るか** — プロダクトのビジョン、解決したい課題
- **誰のためか** — ターゲットユーザー
- **何ができればよいか** — コア機能（Must / Should / Could）
- **何をやらないか** — 明示的なスコープ外
- **制約はあるか** — 技術的・ビジネス的制約

#### ドラフト作成 [メインエージェント: 作成]

ヒアリング内容をもとに `docs/02_アプリ基盤/99_ClaudeCode永続化ファイルサンプル/product-brief.md` を作成する。
テンプレート: `docs/templates/core/product-brief.md`

**[Gate: CONFIRM]** プロダクト概要の承認:
```
header: "承認"
question: "プロダクト概要を確認してください。この内容で技術選定に進んでよいですか？"
options:
  - "承認して次へ進む (推奨)"
  - "修正指示を出す"
  - "もう少し要件を詰めたい"
```

承認後、ステータスを `approved` に更新する。

---

### 2. 最低限のcore/ドキュメントを作成（必須4つ）

**product-brief.md の内容を踏まえて** 作成する。

| ファイル | テンプレート | 問うべきこと |
|---------|------------|------------|
| `docs/02_アプリ基盤/99_ClaudeCode永続化ファイルサンプル/tech-stack.md` | `docs/templates/core/tech-stack.md` | 何の言語/FWで作るか |
| `docs/02_アプリ基盤/system-design.md` | `docs/templates/core/system-design.md` | どんな構造にするか |
| `docs/02_アプリ基盤/99_ClaudeCode永続化ファイルサンプル/directory-structure.md` | `docs/templates/core/directory-structure.md` | ファイルをどこに置くか |
| `docs/02_アプリ基盤/99_ClaudeCode永続化ファイルサンプル/guidelines.md` | `docs/templates/core/guidelines.md` | どんなルールで書くか |

**1セッションで全部作る必要はない。1つずつ丁寧に作ってよい。**

### 3. INDEX.md と debt.md を作成

- `docs/01_アプリ/INDEX.md` を作成する（空のテーブル。テンプレート: `docs/templates/spec-index.md`）
- `docs/meta/debt.md` を作成する（空のテーブル。テンプレート: `docs/templates/tech-debt.md`）

### 4. ドメイン設計

**product-brief.md のコア機能をもとに** ユーザーと対話して初期のドメイン構造を決める:
- どのようなドメイン（機能グループ）があるか
- INDEX.md のドメイン一覧に記載する
- `docs/01_アプリ/{domain}/` ディレクトリを作成する

※ ドメインは後から追加・変更できる。最初から完璧にしなくてよい。

### 5. CLAUDE.md を更新

```yaml
session_feature: null
session_phase: idle
session_progress: "init完了。product-brief + docs/02_アプリ基盤/ドキュメント作成済み"
```

---

## 残りのcore/ドキュメント（必要になったら作成）

| ファイル | いつ必要か |
|---------|----------|
| `api-conventions.md` | API機能の設計開始時 |
| `data-strategy.md` | データモデルの設計開始時 |
| `nfr.md` | 非機能要件の明確化が必要になった時 |
| `security.md` | 認証・認可の設計時 |
| `testing-strategy.md` | テスト方針の確立時 |
| `devops.md` | CI/CDの構築時 |
| `observability.md` | 監視の設計時 |
| `error-handling.md` | エラー処理方針の統一が必要になった時 |
| `glossary.md` | チーム内で用語の認識ずれが出た時 |

これらは `/design core/{ファイル名}` で作成できる。

---

## 読んでよいもの

- `CLAUDE.md`
- `docs/templates/` 配下
- `docs/meta/rules.md`
- ユーザーが指定した参考資料（アイデア.md 等）

## セッション終了時

CLAUDE.md の progress を更新する。

例:
```yaml
progress: "init中。product-brief完了、tech-stack.md完了、system-design.mdは次回"
```
