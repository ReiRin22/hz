# /design {{対象}}

設計フェーズを開始または継続する。1セッションで完結しなくてよい。

**メインエージェントの役割は「判断」のみ。調査・作成・検証はサブエージェントに委譲する。**
**人間への判断委譲は `Skill('common-decision-gate')` のプロトコルに従う。**

対象は3種類:
- **機能設計**: `/design {domain}/Fxx_機能名` → docs/01_アプリ/{domain}/Fxx/ 内のPRD・設計書を作成
- **基盤設計**: `/design 02_アプリ基盤/ファイル名` → docs/02_アプリ基盤/ 内のプロジェクト基盤ドキュメントを作成
- **リファクタリング**: `/design refactor/概要` → ADR + 設計書で構造改善を計画

---

## セッション開始時（毎回やること）

1. `CLAUDE.md` を読み、現在の状態を確認する
2. `Skill('common-decision-gate')` を意識する
3. 対象の種類に応じて下記のいずれかに進む

---

## A. 機能設計（/design {domain}/Fxx_機能名）

### 新規開始の場合（phase: idle）

#### ステップ1: 要件ヒアリング [メインエージェント: 判断]
- ユーザーから要件を聞く
- 何を作るか、なぜ作るかを明確にする

**[Gate: SCOPE]** 要件が固まったら、スコープを確認する:
```
header: "スコープ"
question: "以下のスコープで設計を進めてよいですか？\n\n{スコープの要約}"
options:
  - "このスコープでOK (推奨)"
  - "スコープを広げたい"
  - "スコープを絞りたい"
```

#### ステップ2: 調査 [サブエージェント: 調査]
SCOPE通過後、以下を **並列実行** する:

| サブエージェント | 参照 | やること |
|---|---|---|
| **codebase-researcher** | `.claude/agents/codebase-researcher.md` | 既存コードの構造・パターン・再利用可能モジュールを調査 |
| **spec-cross-checker** | `.claude/agents/spec-cross-checker.md` | 既存仕様との重複・競合・依存関係をチェック |

#### ステップ3: 方針決定 [メインエージェント: 判断]
- 調査結果をユーザーに提示する

**[Gate: APPROACH]** ドメイン配置・設計方針を選択:
```
header: "方針"
question: "調査結果を踏まえて、どの方針で進めますか？"
options:
  - "{推奨案} (推奨)" / description: "{推奨理由}"
  - "{代替案}" / description: "{トレードオフ}"
```

通過後:
- `docs/01_アプリ/INDEX.md` に行を追加する
- CLAUDE.md を更新する
- **条件付き設計の判断** を行う（下記）

##### 条件付き設計の判断

方針・アーキテクチャの内容から、この機能に必要な設計考慮を洗い出す。

1. `docs/templates/design.md` の条件付きセクション（例示）を確認し、該当するものを選定する
2. テンプレートの例示にない設計考慮が必要な場合も同じフォーマットで追加候補に含める
3. 各候補について、対応する `docs/02_アプリ基盤/` ドキュメントの存在を確認する
   - 未作成の場合: 「先に `/design 02_アプリ基盤/xxx` で規約を作成することを推奨」と案内する
   - 作成済みの場合: 設計書で参照する旨を記録する
4. 判断結果をユーザーに提示する

**[Gate: CONFIRM]** 条件付き設計の確認:
```
header: "設計考慮"
question: "この機能に必要な設計考慮を洗い出しました。\n\n{該当する設計考慮の一覧 + 各々の理由}\n{core/未作成があればその旨}\n\nこの内容で設計書作成に進めてよいですか？"
options:
  - "この設計考慮でOK (推奨)"
  - "追加したい設計考慮がある"
  - "不要な設計考慮を外したい"
```

判断結果（確定した設計考慮の一覧）はステップ6で design-drafter に渡す。

#### ステップ4: PRD作成 [サブエージェント: 作成]

| サブエージェント | 参照 | やること |
|---|---|---|
| **prd-drafter** | `.claude/agents/prd-drafter.md` | 要件 + 調査結果からPRDドラフトを作成 |

#### ステップ5: PRDレビュー [メインエージェント: 判断]

**[Gate: RESOLVE]** `[要確認]` `{{要決定}}` があれば1つずつ解決:
```
header: "要決定"
question: "{未決定事項の内容}?"
options:
  - "{選択肢A} (推奨)" / description: "{理由}"
  - "{選択肢B}" / description: "{理由}"
```

全て解決したら:

**[Gate: CONFIRM]** PRDの承認:
```
header: "PRD承認"
question: "PRDの内容を確認してください。"
options:
  - "承認して設計書作成へ進む (推奨)"
  - "修正指示を出す → prd-drafter を再起動して再作成する → 完了後にこのゲートへ戻る"
  - "要件からやり直す → ステップ1へ戻る"
```

#### ステップ6: 設計書作成 [サブエージェント: 作成]

design-drafter に以下を渡す:
- PRD + 調査結果 + core/ドキュメント
- **ステップ3で確定した設計考慮の一覧**（どの条件付きセクションを展開するか）

| サブエージェント | 参照 | やること |
|---|---|---|
| **design-drafter** | `.claude/agents/design-drafter.md` | PRD + 調査結果 + core/ドキュメント + 設計考慮の一覧から設計書ドラフトを作成 |

**[Gate: CONFIRM]** 機能設計書ドラフトの承認:
```
header: "機能設計書ドラフト承認"
question: "機能設計書ドラフトの内容を確認してください。"
options:
  - "承認する (推奨)"
  - "修正指示を出す → design-drafter を再起動して再作成する → 完了後にこのゲートへ戻る"
  - "PRDから見直す → ステップ5へ戻る"
```

承認後:
- FE詳細設計書が必要な場合 → ステップ6-FEへ
- BFF設計書が必要な場合（FEスキップまたは6-FE完了後） → ステップ6-BFFへ
- いずれも不要な場合 → ステップ7へ

##### ステップ6-FE: フロントエンド設計書を作成する場合の追加手順

機能設計書ドラフト承認後に以下を実行する。

**6-FE-0: フロントエンド詳細設計書ドラフト作成 [サブエージェント: 作成]**

| サブエージェント | 参照 | やること |
|---|---|---|
| **detail-design-drafter（FE）** | `.claude/agents/app-detail-design-drafter.md` | 機能設計書をもとにフロントエンド詳細設計書ドラフトを作成 |

**[Gate: CONFIRM]** FE詳細設計書ドラフトの承認:
```
header: "FE詳細設計書ドラフト承認"
question: "フロントエンド詳細設計書ドラフトの内容を確認してください。"
options:
  - "承認して画面一覧追記へ進む (推奨)"
  - "修正指示を出す → detail-design-drafter（FE）を再起動して再作成する → 完了後にこのゲートへ戻る"
```

**6-FE-1: 事後追記 [サブエージェント: 作成]**

FE詳細設計書ドラフト承認後、画面一覧へ追記する。

**[Gate: CONFIRM]** 追記内容を提示してユーザー承認を得る:
```
header: "画面一覧への追記"
question: "以下の内容を画面一覧に追記します。よいですか？\n\n{追記予定の行（画面ID / 画面名 / 説明 / 機能ID）}"
options:
  - "追記する (推奨)"
  - "内容を修正してから追記する → 修正後に再度このゲートで確認する"
  - "今回は追記しない → BFF設計書が必要な場合は 6-BFF-1 へ、不要な場合はステップ7へ"
```

承認後:

| サブエージェント | 参照 | やること |
|---|---|---|
| **spec-registry-updater** | `.claude/agents/app-spec-registry-updater.md` | `docs/01_アプリ/フロントエンド/一覧/画面一覧.md` に1行追記 |

追記完了後:
- BFF設計書が必要な場合 → 6-BFF-1へ
- BFF不要の場合 → ステップ7へ

---

##### ステップ6-BFF: BFF設計書を作成する場合の追加手順

BFF設計書（BFF定義書_【xxx】xxx.md）のドラフト作成が含まれる場合、**FE詳細設計書が存在すること（6-FE-0承認済み、または既存）を確認した上で**以下を順番に実行する。
FE詳細設計書が存在しない場合は、先に 6-FE（ステップ6-FE-0）を完了してから 6-BFF-1 へ進むこと。

**6-BFF-1: 事前チェック [サブエージェント: 調査]**

detail-design-drafter（BFF）を起動する前に、使用予定APIを一覧と照合する。

| サブエージェント | 参照 | やること |
|---|---|---|
| **spec-registry-checker** | `.claude/agents/app-spec-registry-checker.md` | 設計書から使用予定の定義（API・エラーコード等）を抽出し `docs/01_アプリ/BFF/一覧/` および `docs/01_アプリ/一覧/` と照合 |

照合結果（未登録APIの有無）をユーザーに提示する。

**[Gate: CONFIRM]** 未登録APIがある場合:
```
header: "未登録API"
question: "以下のAPIがまだ一覧に登録されていません。\n\n{未登録APIのリスト}\n\nBFF設計書作成後に一覧へ追記します。このまま設計書作成に進んでよいですか？"
options:
  - "進む（設計書作成後に追記する）(推奨)"
  - "先に一覧の整合性を確認したい → 確認完了後に 6-BFF-2 へ戻る"
```

**6-BFF-2: BFF設計書ドラフト作成 [サブエージェント: 作成]**

| サブエージェント | 参照 | やること |
|---|---|---|
| **detail-design-drafter（BFF）** | `.claude/agents/app-detail-design-drafter.md` | フロントエンド設計書をもとにBFF設計書ドラフトを作成 |

**[Gate: CONFIRM]** BFF設計書ドラフトの承認:
```
header: "BFF設計書ドラフト承認"
question: "BFF設計書ドラフトの内容を確認してください。"
options:
  - "承認して一覧追記・BEモック作成へ進む (推奨)"
  - "承認するがBEモック定義書は不要 → 6-BFF-3（一覧追記）のみ実施してステップ7へ"
  - "修正指示を出す → detail-design-drafter（BFF）を再起動して再作成する → 完了後にこのゲートへ戻る"
```

**6-BFF-3: 事後追記 [サブエージェント: 作成]**

BFF設計書ドラフト承認後、一覧ファイルへ未登録エントリを追記する。

| サブエージェント | 参照 | やること |
|---|---|---|
| **spec-registry-updater** | `.claude/agents/app-spec-registry-updater.md` | checker の照合結果（未登録定義）を `docs/01_アプリ/BFF/一覧/` および `docs/01_アプリ/一覧/` 配下の各ファイルに追記 |

**6-BFF-4: バックエンドモック定義書ドラフト作成 [サブエージェント: 作成]**

| サブエージェント | 参照 | やること |
|---|---|---|
| **detail-design-drafter（BEモック）** | `.claude/agents/app-detail-design-drafter.md` | BFF定義書をもとにバックエンドモック定義書ドラフトを作成 |

**[Gate: CONFIRM]** BEモック定義書ドラフトの承認:
```
header: "BEモック定義書ドラフト承認"
question: "バックエンドモック定義書ドラフトの内容を確認してください。"
options:
  - "承認してレビューへ進む (推奨)"
  - "修正指示を出す → detail-design-drafter（BEモック）を再起動して再作成する → 完了後にこのゲートへ戻る"
```

#### ステップ7: 設計書レビュー [メインエージェント: 判断]

**[Gate: RESOLVE]** `[要確認]` の解決（ステップ5と同様）

**[Gate: APPROACH]** 技術選択が複数ある場合:
```
header: "技術選択"
question: "{技術的な選択の内容}?"
options:
  - "{選択肢A} (推奨)" / description: "{メリット・デメリット}"
  - "{選択肢B}" / description: "{メリット・デメリット}"
```

**[Gate: CONFIRM]** 設計書の承認:
```
header: "設計承認"
question: "設計書の内容を確認してください。"
options:
  - "承認して検証へ進む (推奨)"
  - "修正指示を出す → 各設計書の担当ステップ（6-FE-0 / 6-BFF-2 / 6-BFF-4）へ戻る → 修正完了後にステップ7へ戻る"
  - "PRDから見直す → ステップ5へ戻る"
```

#### ステップ8: 設計検証 [サブエージェント: 検証]

| サブエージェント | 参照 | やること |
|---|---|---|
| **design-validator** | `.claude/agents/design-validator.md` | PRDカバレッジ + core/整合性を検証 |

#### ステップ9: 最終判断 [メインエージェント: 判断]

**[Gate: PHASE]** 検証結果を踏まえてフェーズ遷移を判断:
```
header: "次のステップ"
question: "検証結果: {結果の要約}。次のステップは？"
options:
  - "/review に進む (推奨)"
  - "指摘事項を修正する → ステップ7へ戻る"
  - "一旦保留する"
```

### 詳細設計から開始する場合（機能設計書が既存）

機能設計書（design-Fxx_*.md）が既に存在し、詳細設計書のみを新規作成する場合。

#### ステップD1: 対象レイヤーの確認 [メインエージェント: 判断]

- 既存の機能設計書を読み込む
- 作成する詳細設計書のレイヤー（FE / BFF / BE）を確認する

**[Gate: CONFIRM]** 作成対象を確認:
```
header: "詳細設計書の作成対象"
question: "以下のレイヤーの詳細設計書を作成します。よいですか？\n\n{対象レイヤーの一覧}"
options:
  - "この対象でOK (推奨)"
  - "対象を変更したい → D1の「作成する詳細設計書のレイヤーを確認する」に戻る"
```

#### ステップD2: 詳細設計書作成 [サブエージェント: 作成]

対象レイヤーに応じて、以下と同じ手順を実行する:
- FEの場合: ステップ6-FE（6-FE-0 + 6-FE-1 含む）
- BFFの場合: ステップ6-BFF（6-BFF-1〜6-BFF-4 含む）
- BEモックのみの場合: ステップ6-BFF-4（前提: BFF定義書が存在すること。存在しない場合は先に「BFFの場合」のステップ6-BFFを完了してから戻ること）

#### ステップD3: 設計書レビュー・検証

ステップ7〜9 と同じ手順を実行する。

### 継続の場合（phase: design）
- progress を確認し、中断したステップから再開する
- 必要に応じてサブエージェントを再実行する

---

## B. 基盤設計（/design 02_アプリ基盤/ファイル名）

#### ステップ1: ヒアリング [メインエージェント: 判断]
- ユーザーと対話しながら設計内容を決める

#### ステップ2: 作成 [メインエージェント or サブエージェント]
- 内容がシンプルならメインエージェントがテンプレートに沿って作成
- 複雑なら専用のサブエージェントに委譲

#### ステップ3: 検証

**[Gate: CONFIRM]** 作成物の承認:
```
header: "承認"
question: "{ファイル名} の内容を確認してください。"
options:
  - "承認する (推奨)"
  - "修正指示を出す → ステップ2に戻って再作成する"
```

承認後: CLAUDE.md の `session_progress` を更新する。

### 対象ファイル一覧

| ファイル | テンプレート |
|---------|------------|
| `docs/02_アプリ基盤/99_ClaudeCode永続化ファイルサンプル/tech-stack.md` | `docs/templates/core/tech-stack.md` |
| `docs/02_アプリ基盤/system-design.md` | `docs/templates/core/system-design.md` |
| `docs/02_アプリ基盤/99_ClaudeCode永続化ファイルサンプル/directory-structure.md` | `docs/templates/core/directory-structure.md` |
| `docs/02_アプリ基盤/api-conventions.md` | `docs/templates/core/api-conventions.md` |
| `docs/02_アプリ基盤/data-strategy.md` | `docs/templates/core/data-strategy.md` |
| `docs/02_アプリ基盤/nfr.md` | `docs/templates/core/nfr.md` |
| `docs/02_アプリ基盤/security.md` | `docs/templates/core/security.md` |
| `docs/02_アプリ基盤/observability.md` | `docs/templates/core/observability.md` |
| `docs/02_アプリ基盤/testing-strategy.md` | `docs/templates/core/testing-strategy.md` |
| `docs/02_アプリ基盤/devops.md` | `docs/templates/core/devops.md` |
| `docs/02_アプリ基盤/99_ClaudeCode永続化ファイルサンプル/guidelines.md` | `docs/templates/core/guidelines.md` |
| `docs/02_アプリ基盤/glossary.md` | `docs/templates/core/glossary.md` |
| `docs/02_アプリ基盤/error-handling.md` | `docs/templates/core/error-handling.md` |

---

## C. リファクタリング（/design refactor/概要）

#### ステップ1: 影響分析 [サブエージェント: 調査]

| サブエージェント | 参照 | やること |
|---|---|---|
| **impact-analyzer** | `.claude/agents/impact-analyzer.md` | リファクタリング対象の影響範囲を分析 |

#### ステップ2: 方針決定 [メインエージェント: 判断]

**[Gate: APPROACH]** 実施判断:
```
header: "リファクタ"
question: "影響分析の結果: {要約}。どうしますか？"
options:
  - "この範囲で実施する (推奨)"
  - "範囲を絞って実施する → ステップ1に戻って影響分析を再実行する"
  - "今は実施しない → フロー終了（CLAUDE.md を idle に戻す）"
```

通過後: ADR を作成する

#### ステップ3: 設計 [サブエージェント: 作成]
- `.steering/YYYYMMDD-refactor-概要/` に design.md と tasklist.md を作成

#### ステップ4: `/implement` で実装する（通常の実装フローに合流）

---

## セッション終了時（毎回やること）

CLAUDE.md の progress を更新する。**どのステップ・どのゲートまで完了したか**を明記する。

例:
```yaml
progress: "auth/F03 ステップ5 Gate:CONFIRM待ち。PRDドラフト完了、ユーザー承認待ち"
```
