---
name: arch-poc
description: PoCフェーズを開始または継続する
argument-hint: "{target} (例: 01_フロントエンド・BFF)"
user-invocable: true
---

人間への判断委譲は `Skill('decision-gate')` のプロトコルに従う。
成果物の品質基準は [poc-quality.md](poc-quality.md)を参照する。

## チェックポイントファイル

`docs/02_アプリ基盤/{target}/03_PoC検証/state.md` に現在の進捗を保存する。
セッションをまたいでもここから再開できる。

```yaml
# PoC State: {target}
next_step: 1               # 次に実行するステップ。Step3中は "3-A/1" のように項目番号を付ける
last_updated: YYYY-MM-DD

completed:                 # 完了済みステップの要約（追記専用）
  # - "Step1: PoC開発計画作成 (項目数: X, 高優先度: Y)"
  # - "Step2: 項目承認済み"
  # - "Step3-0: TBD解消済み (X件)"
  # - "Step3 #1: {項目名} → 合格/不合格"
  # - "Step3-E全項目承認 → report.md承認 (判定: 採用)"
  # ...

items_progress:            # 各PoC項目の進捗（項目番号: ステータス）
  # 1: null               # null | planned | implemented | run | evaluated | approved
  # 2: null

decisions:                 # 重要な決定事項
  items_confirmed: null    # true
  tbds_resolved: []        # 解消済みTBDの箇所リスト
  go_nogo: null            # "採用" | "条件付き採用" | "不採用"
  adopted_technology: null # 最終的に採用する技術名
  report_approved: null    # true

notes: ""                  # 特記事項・次セッションへの申し送り
```

---

## セッション開始時（毎回やること）

1. `docs/02_アプリ基盤/{target}/03_PoC検証/state.md` が存在するか確認する
   - **存在する（継続）**: state.md を読み、`next_step` から再開する。completed と decisions を人間に提示する
   - **存在しない（初回）**: state.md を上記フォーマットで作成し、Step1 から開始する
2. CLAUDE.md の `session_feature` と `session_phase` を `poc/{target}` / `poc` に更新する
3. `Skill('decision-gate')` を意識する

> **注意（AIへ）**: セッション開始のアナウンス（「初回セッションです」「継続セッションです」等）は最初の1回のみ出力する。ツールロード後の応答で同じアナウンスを繰り返さない。

---

## インプット

`docs/02_アプリ基盤/{target}/00_方式設計書/` 配下のファイルをインプットとして使用する。
対応フォーマット: `.md` / `.htm` / `.html`（Word HTML形式を含む）。ファイル数は1本でも複数でもよい。

---

## 成果物ファイル一覧

| ファイル | 作成ステップ | 作成者 | 用途 |
|---|---|---|---|
| `docs/02_アプリ基盤/{target}/03_PoC検証/state.md` | セッション開始時 | メインエージェント | 進捗管理・セッション引き継ぎ |
| `docs/02_アプリ基盤/{target}/00_計画書/{target}PoC開発計画.md` | Step1 | poc-item-extractor | PoC項目・フェーズ構成 |
| `docs/02_アプリ基盤/{target}/03_PoC検証/item_{N:02}_{略称}.md` | Step3-A | メインエージェント | 1項目の計画→実装→結果→判定を集約（項目数分作成） |
| `poc/{target_en}/{N}_{略称}/` | Step3-B | メインエージェント | PoCソースコード（`{target_en}` はターゲット名の英語表記。複数項目が同一ディレクトリを共有可） |
| `docs/02_アプリ基盤/{target}/03_PoC検証/report.md` | 全項目完了後 | poc-evaluator | 総合評価・採用判定・詳細設計への引き継ぎ |

> `{N:02}` = 2桁ゼロ埋め番号（例: 01, 02）、`{略称}` = 項目の略称・日本語可・6文字以内（例: `item_01_性能検証.md`）

---

## ステップ1: PoC項目洗い出し [サブエージェント: 調査]

| サブエージェント | 参照 | やること |
|---|---|---|
| **poc-item-extractor** | `.claude/agents/arch/poc-item-extractor.md` | 方式設計書からPoC項目を抽出・整理 → `docs/02_アプリ基盤/{target}/00_計画書/{target}PoC開発計画.md` |

**[Checkpoint]** 完了後に state.md を更新する:
```yaml
next_step: 2
completed:
  - "Step1: PoC開発計画作成 (項目数: X, 高優先度: Y)"
```

---

## ステップ2: 項目確認 [メインエージェント: 判断]

**[Gate: CONFIRM]** PoC項目の承認:
```
header: "PoC項目確認"
question: "PoC開発計画を作成しました。\n\n{PoC開発計画の要約}\n\nこの内容でPoCを進めてよいですか？"
options:
  - "この項目でOK (推奨)"
  - "項目を追加したい"
  - "項目を削除・修正したい"
```

**[Checkpoint]** 承認後に state.md を更新する:
```yaml
next_step: 3
decisions:
  items_confirmed: true
```

---

## ステップ3: PoCソース作成（人間×AI連携ミニサイクル）

PoC開発計画のPoC項目を **1項目ずつ** 以下のミニサイクルで進める。
粒度が大きい項目は、このサイクル内でさらに実装計画を細分化する。

---

### Step3-0: TBD解消 [メインエージェント: 判断]

PoC開発計画の「PoCへの影響あり」TBDを人間に確認する。
合否基準が確定しない項目は実装できないため、先に解消する。

**[Gate: CONFIRM]** TBD解消:
```
header: "TBD確認"
question: "実装前に以下のTBDを確認してください。\n\n{影響ありTBDの一覧}\n\n各項目の方針を教えてください。"
options:
  - "全て決定した → PoC開発計画に追記して次へ"
  - "一部未定のまま進む → 未定項目はスキップ扱いにする"
```

**[Checkpoint]** 完了後に state.md を更新する:
```yaml
next_step: "3-A/1"
decisions:
  tbds_resolved: ["{解消した箇所1}", "{解消した箇所2}"]
```

---

### Step3-A: 実装計画 [メインエージェント: 作成]

対象項目（`items_progress` で `null` の最初の項目）の実装計画を
`docs/02_アプリ基盤/{target}/03_PoC検証/item_{N:02}_{項目名略称}.md` に作成する。

**ファイルフォーマット**: `docs/templates/poc-item.md` を参照して作成する（計画 → 実装詳細 → 実行結果 → 判定を1ファイルに集約）。

**[Gate: CONFIRM]** 実装計画承認:
```
header: "#{N} 実装計画確認"
question: "item_{N:02}_{略称}.md を作成しました。\n\n{計画の要約}\n\nこの計画でよいですか？"
options:
  - "この計画でOK → 実装開始"
  - "修正指示を出す → 計画を修正して再提示"
  - "この項目はスキップする → 次項目の3-Aへ"
```

**[Checkpoint]** 承認後に state.md を更新する:
```yaml
items_progress:
  {N}: planned
```

---

### Step3-B: 実装 [メインエージェント: 作成]

承認された計画に基づいてコードを実装する。
出力先: `poc/{target_en}/{N}_{項目名略称}/`（`{target_en}` はターゲット名の英語表記。既存ディレクトリのソースコードを流用する場合は新規作成不要。その場合は実装計画に流用元を明記する）

実装完了後、`item_{N:02}_{略称}.md` の「3. 実装詳細」セクションを追記する:
- 実装した主要な技術要素（設計上のポイント・工夫）
- 検証の核となるコード抜粋

**[Checkpoint]** 完了後に state.md を更新する:
```yaml
items_progress:
  {N}: implemented
notes: "#{N} 実装完了。実行待ち。実行結果を item_{N:02}_{略称}.md の「4. 実行結果」セクションに貼り付け後、/poc {target} を再実行してください"
```

---

### Step3-C: 検証 [human + サブエージェント: poc-evaluator]

**人間（定性評価）:**
1. `poc/{target_en}/{N}_{略称}/` のコードを環境で実行する
2. 実行ログ・測定結果を `item_{N:02}_{略称}.md` の「4. 実行結果」セクションに貼り付ける
3. 実行時の所見・懸念事項・予期せぬ挙動を「定性評価（人間）」に記入する
4. `/poc {target}` を再実行する

**AI（定量評価）— poc-evaluator:**

| サブエージェント | やること |
|---|---|
| **poc-evaluator** | `item_{N:02}_{略称}.md` の実行結果を読み、合否基準と数値照合 → 「AI評価（定量）」セクションに記入 |

**[Checkpoint]** 完了後に state.md を更新する:
```yaml
items_progress:
  {N}: run
```

---

### Step3-D: 総合判定 [メインエージェント: 判断]

`item_{N:02}_{略称}.md` の「AI評価（定量）」と「定性評価（人間）」を統合し、
「総合判定」セクションに記入する。

**[Checkpoint]** 完了後に state.md を更新する:
```yaml
items_progress:
  {N}: evaluated
completed:
  - "Step3 #{N}: {項目名} → {合格|不合格|スキップ}"
```

---

### Step3-E: 項目承認 [human]

**[Gate: CONFIRM]** 項目承認:
```
header: "#{N} 項目承認"
question: "{項目名} の検証結果:\n\n{Step3-D の総合判定の要約}\n\nこの項目の結果を承認しますか？"
options:
  - "承認 → 次の項目へ (Step3-Aへ戻る)"
  - "承認 → 全項目完了 (追加検証確認へ)"
  - "再検証する → Step3-Aへ戻り計画を修正"
```

**[Checkpoint]** 完了後に state.md を更新する:
```yaml
items_progress:
  {N}: approved
```

---

### 追加検証確認 [メインエージェント: 判断]

全項目の承認後に実施する。

**[Gate: CONFIRM]**:
```
header: "追加検証確認"
question: "全項目が承認されました。\n\n{完了項目の判定サマリ}\n\n追加で検証が必要な項目はありますか？"
options:
  - "追加不要 → 報告書作成へ"
  - "項目を追加する → PoC開発計画に追記してStep3-Aへ戻る"
```

追加不要の場合、連続実行してよい:

| サブエージェント | 参照 | やること |
|---|---|---|
| **poc-evaluator** | `.claude/agents/arch/poc-evaluator.md` | 全 `item_{N:02}_{略称}.md` を集約して総合評価・報告書を生成 → `report.md` |

**[Gate: GO/NOGO + 承認]** 報告書確認・採用判断:
```
header: "PoC報告書 確認・採用判断"
question: "報告書を作成しました。\n\n{report.mdの要約}\n\n{target} をこのプロジェクトで採用しますか？"
options:
  - "採用する・承認 (推奨)"
  - "条件付き採用・承認 → 条件を report.md に追記"
  - "採用しない → 代替技術を選定して Step3-A に戻る"
  - "報告書を修正する → 修正指示を出す"
```

**[Checkpoint]** 承認後に state.md を更新する:
```yaml
next_step: done
decisions:
  go_nogo: "採用"           # または "条件付き採用" / "不採用（{旧} → {新} へ再選定）"
  adopted_technology: "{technology}"
  report_approved: true
completed:
  - "全項目承認 → report.md承認 (判定: {採用|条件付き採用})"
```

不採用の場合: 代替技術を選定し、`next_step: "3-A"` に戻す。

承認後:
- CLAUDE.md の session_phase を `idle` に戻し、session_progress を更新する
- `/design 02_アプリ基盤/{対応ファイル}` で詳細設計書を作成できる状態になった旨を案内する

---

## セッション終了時（毎回やること）

1. state.md の `last_updated` と `notes` を更新する
2. CLAUDE.md の session_progress を更新する

```yaml
session_progress: "poc/{target} Step{N}完了。次: Step{N+1}。state.md参照"
```
