# /implement {{domain/Fxx_機能名}}

実装フェーズを開始または継続する。1セッションで完結しなくてよい。

**メインエージェントの役割は「判断」のみ。計画・検証はサブエージェントに委譲する。**
**人間への判断委譲は `Skill('common-decision-gate')` のプロトコルに従う。**
※ コードの実装自体はメインエージェントが行う（サブエージェントに委譲しない）。

---

## 🚨 重要な Git 操作ルール 🚨

### Phase完了後は必ず git reset を実行する

**Phase完了時（ステップ4）に必ず以下を実行:**

```bash
# Phase のコミット数分だけ reset（ファイルはunstaged状態で保持）
git reset HEAD~${PHASE_COMMITS}
```

**絶対禁止:**
- ❌ git reset をスキップする
- ❌ git push を実行する
- ❌ コミットをステージング状態のまま残す
- ❌ 「オプション」として扱う

**理由:** ユーザーが自分のタイミングでコミット・pushする。エージェントが勝手にpushすることを防止する。

---

## 前提条件

- `/design` で PRD と設計書が作成済みであること
- `/review` で設計が PASS していること

> **設計書が未作成の場合**: 詳細設計書を自動作成しない。機能設計書（`prd-Fxx_*.md` / `design-Fxx_*.md`）や Figma コード等の既存資料をそのまま参照して実装を開始してよい。詳細設計書の作成要否は必ずユーザーに判断を仰ぐこと。

- **デフォルト実装スコープ**: FE(frontend層)のみ。

---

## セッション開始時（毎回やること）(消費:21k)

1. `.steering/` 配下を確認し、対象機能のフォルダ有無で分岐する:
   - **フォルダが存在しない** → 「新規開始の場合」へ（steering 作成のみで終了するセッション）
   - **フォルダが存在する** → `state.md` を読んで「継続の場合」へ
2. `Skill('common-decision-gate')` を意識する
3. `Skill('andrej-karpathy-skills')` を読み込む（実装品質の指針として全フェーズで参照する）
   - **重要**: これはセッション開始時だけの読み物ではない。Phase開始時・各タスク着手前・コンパクト後再開時に必ず再適用する。
   - 余計な実装、隣接コードの改善、未要求の抽象化、ついでのリファクタリングは禁止。
4. **Serena が利用可能であれば積極的に使用する**（コード構造の把握・シンボル検索・参照関係の追跡に活用）
   - プロジェクトのアクティベート: `mcp__plugin_serena_serena__activate_project` で `harz` を指定
   - ファイル検索: `mcp__plugin_serena_serena__find_file` でファイルパターンを検索
   - シンボル構造取得: `mcp__plugin_serena_serena__get_symbols_overview` でファイル内のクラス・関数・変数を取得
   - シンボル検索: `mcp__plugin_serena_serena__find_symbol` で特定のシンボルを検索
   - 参照追跡: `mcp__plugin_serena_serena__find_referencing_symbols` でシンボルの参照箇所を追跡
   - **使用場面**: 既存コードの構造把握、コンポーネント間の依存関係確認、リファクタリング影響範囲の特定
5. state.md の `phase` に応じて分岐する

> **ファイル命名規則**: 各フェーズで新規ファイルを作成・命名する際は必ず `.claude/commands/frontend-naming-conventions.md` を参照すること。

> **Karpathyガード**: 以降のすべての判断・実装・修正で `Skill('andrej-karpathy-skills')` を優先する。現在のタスクIDに直結しない変更を始めそうになったら即停止し、必要なら `docs/meta/debt.md` への記録またはユーザー確認に切り替える。

---

## 新規開始の場合（phase: design → implement へ遷移）

> **このセッションの目標**: `.steering/` フォルダの作成と `tasklist.md` の完成のみ。Phase 0 の実装は**次のセッション**で開始する。

#### ステップ0: steering スケルトン作成 [メインエージェント: 作成]

`Skill('steering')` を読み込む

最初に `.steering/YYYYMMDD-機能名/` フォルダと空のスケルトンファイルを作成する。
これにより、途中でコンテキスト圧縮が起きても次のセッションで「継続の場合」として再開できる。

- `state.md`（以下の内容で初期化）:
  ```yaml
  feature: "{domain}/Fxx_機能名"
  phase: implement
  progress: "steering準備中"
  last_updated: "YYYY-MM-DD"
  phase_preprocessing: {}  # Phase 開始時にスキル実行履歴を記録
  completed_phases: []
  compact_resume: ""
  ```
- `requirements.md`（空のスケルトン: 見出しのみ）
- `design.md`（空のスケルトン: 見出しのみ）
- `tasklist.md`（標準フェーズヘッダーのみ・チェックリストは未記入）
- `session-log.md`（初回エントリを記載）

#### ステップ1: タスク分解 [メインエージェント: 判断]
- `docs/01_アプリ/{domain}/{機能名}/` の PRD と設計書を読む
- ステップ0 で作成したスケルトンに内容を記入する:
  - `state.md` — セッション状態を更新
  - `requirements.md` — スコープ宣言 + PRDから受入条件を転記
  - `design.md` — 設計書から実装方針を転記
  - `tasklist.md` — 実装タスク + テストタスクをチェックリスト形式で列挙（**FE / BFF / BE の3章に分けて記述する**）
  - `session-log.md` — セッションログ（初回エントリを記載）

> **tasklist.md の章構成**:
> ```
> ## FE（フロントエンド）
> - [ ] Phase 0〜10 のタスク
>
> ## BFF
> - [ ] B1-1〜B1-N のタスク
>
> ## BE（バックエンド）
> - [ ] E1-1〜E1-N のタスク
> ```
> 層ごとに独立して進捗が追えるよう章を分ける。スコープ外の層は「スコープ外」と明記して章ごと省略する。

**実装手順**

## STEP 0: 事前確認（不在なら直ちに中断）

以下を順に確認し、**1つでも欠けていれば作業を中断してユーザに報告し指示を仰ぐ**。

### 0-1. 規約ファイルの存在確認

Phase ごとに確認する規約は異なる。

**Phase 0**
| # | パス | 役割 |
|---|---|---|
| 1 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/01_フロントエンド・BFF共通基盤設計/フロントエンド・BFF共通基盤規約.md` | フロントエンド・BFF共通基盤規約（コンポーネントファイル構成・許可フォルダ一覧・shared 昇格条件） |
| 2 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/07_ルーティング設計/ルーティング設計規約.md` | ルーティング設計規約（T0-3 ページ境界特定で参照） |
| 3 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/11_開発規律と品質管理/開発規律と品質管理規約.md` | 開発規律と品質管理規約（コメントアウト構文・プレースホルダー構文） |

**Phase 1**
| # | パス | 役割 |
|---|---|---|
| 1 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/01_フロントエンド・BFF共通基盤設計/フロントエンド・BFF共通基盤規約.md` | フロントエンド・BFF共通基盤規約（ディレクトリ配置・shared 昇格条件・前提I/F） |
| 2 | `docs/02_アプリ基盤/directory-structure.md` `[未整備]` | ディレクトリ構造規約（プロジェクト全体の配置ルール） |

> **directory-structure.md [未整備] について**:
> Phase 1 の規約ファイル #2 `directory-structure.md` は未整備マークです。
> 現在は **代替として `structure_2.md` を参照してください**。
> 将来 `directory-structure.md` として整備され統合される予定です。

**Phase 2**
| # | パス | 役割 |
|---|---|---|
| 1 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/10_BFF設計/BFF設計規約.md` | BFF実装規約（api/ 通信関数・repository/ 複合API・三層責務・命名・経由必須I/F） |
| 2 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/13_セキュリティ基盤設計/セキュリティ基盤規約.md` | セキュリティ規約（CSRF/XSS/PHI マスキング・認証ガード・経由必須I/F） |

**Phase 3**
| # | パス | 役割 |
|---|---|---|
| 1 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/04_状態管理設計/状態管理規約.md` | 状態管理（Zustand / クエリキー / クリーンアップ）の実装規約 |

**Phase 4**
| # | パス | 役割 |
|---|---|---|
| 1 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/04_状態管理設計/状態管理規約.md` | 状態管理規約（カスタムフック分類・クエリキー・基盤I/F利用） |
| 2 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/05_コンポーネント設計/コンポーネント設計規約.md` | コンポーネント設計規約（Hook 配置・命名・UIとの責務分離） |

**Phase 5**
| # | パス | 役割 |
|---|---|---|
| 1 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/05_コンポーネント設計/コンポーネント設計規約.md` | コンポーネント設計（Atomic Design / RSC・RCC境界 / Props型）の実装規約 |
| 2 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/06_UIビジュアル設計/UIビジュアル規約.md` | UIビジュアル規約（デザイントークン / UIライブラリ / 仮想化 / 画像最適化） |

**Phase 6**
| # | パス | 役割 |
|---|---|---|
| 1 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/04_状態管理設計/状態管理規約.md` | 状態管理規約 |
| 2 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/05_コンポーネント設計/コンポーネント設計規約.md` | コンポーネント設計規約 |
| 3 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/09_監視エラーハンドリング設計/監視エラーハンドリング規約.md` | 監視・エラーハンドリング規約 |

**Phase 7**
| # | パス | 役割 |
|---|---|---|
| 1 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/09_監視エラーハンドリング設計/監視エラーハンドリング規約.md` | 監視・エラーハンドリング規約（エラー分類・通知UI・Error Boundary 配置・hooks catch 実装） |
| 2 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/03_TypeScript型管理/TypeScript型管理規約.md` | TypeScript型管理規約（Zod スキーマ定義・型推論・スキーマ配置） |

**Phase 8**
| # | パス | 役割 |
|---|---|---|
| 1 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/12_自動テスト実装/自動テスト実装規約.md` | 自動テスト実装規約 |
| 2 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/12_自動テスト実装/ビジュアルリグレッションテスト基盤設計.md` | ビジュアルリグレッション基盤I/F |

**Phase 9**
| # | パス | 役割 |
|---|---|---|
| 1 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/12_自動テスト実装/自動テスト実装規約.md` | 自動テスト実装規約 |
| 2 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/12_自動テスト実装/単体・コンポーネント・結合テスト基盤設計.md` | Vitest / MSW 基盤I/F |

**Phase 10**
| # | パス | 役割 |
|---|---|---|
| 1 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/12_自動テスト実装/自動テスト実装規約.md` | 自動テスト実装規約 |
| 2 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/12_自動テスト実装/E2Eテスト基盤設計.md` | E2E基盤I/F |
| 3 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/11_開発規律と品質管理/開発規律と品質管理規約.md` | 開発規律と品質管理規約 |

→ 各 Phase 実装前に `Read` で実在を確認。1つでも見つからなければ STOP。

### 0-2. 前提となる基盤I/F・入力資料の存在確認

各規約の冒頭セクション（または「前提」「基盤 I/F 利用規約」等）に列挙された前提を `grep` / `Read` で確認する。

加えて以下の設計書を確認する。これはなくても進める。
- 対象機能の PRD（`docs/01_アプリ/{domain}/{機能グループ}/prd-{Fxx}_{機能名}.md`）
- 対象機能の機能設計書（`docs/01_アプリ/{domain}/{機能グループ}/design-{Fxx}_{機能名}.md`）

1つでも未整備ならば STOP。

### STOP時の報告フォーマット

```
[STOP] Phase 0（implement-phase0）の事前確認に失敗しました。

## 不在の規約ファイル
- <パス>

## 不在の前提I/F・入力資料
- <ファイル/シンボル名>: <根拠となる規約のセクション、または Phase 0 で必要な役割>

## 推奨アクション
- 規約ファイルが未整備の場合: arch-frontend-detail-design-update スキルで規約を整備してください
- 入力資料が未整備の場合: /design コマンドで機能の PRD・設計書を作成してください

作業を中断します。指示をお願いします。
```

---

## STEP 1: 規約全文読み込み

STEP 0 で確認した規約ファイルを `Read` で **全文** 読む。
（要約・部分読み禁止。規約のすべてのルールを把握してから実装する）

- フロントエンド・BFF共通基盤規約
- 開発規律と品質管理規約

規約から参照されている関連設計書は、規約の理解に必要な範囲で参照する。

---

## STEP 3: 実装

### 実装前のKarpathyガード（毎タスク必須）

各 Phase の各タスク（T0-1、T1-1 など）に着手する直前に、必ず `Skill('andrej-karpathy-skills')` を再適用し、以下を1回だけ確認する。

1. 今から実行する `tasklist.md` のタスクIDと成功条件を特定する
2. 変更してよいファイルを、タスク達成に必要な最小範囲に限定する
3. 変更対象外のコード改善・整形・リファクタリングをしない
4. 不明点、仕様外、複数解釈がある場合は実装せず Gate へ進む
5. 変更後の確認方法を決めてから編集する

この確認を行わずに実装へ進んではいけない。

```
Phase 0: スコープ確定・コンポーネント設計（Phase 1 の前提条件）
├── T0-1: コンポーネント分割（Atoms/Molecules/Organisms/Page の4層分解）
├── T0-2: この機能に必要な機能要素の確認（スコープ内/外リスト作成）
├── T0-3: 他の機能とのページ境界・共有領域の特定
├── T0-4: shared 振り分け洗い出し（型・フック・ユーティリティ・コンポーネントの配置先決定）
│         ※ 移動はここでは行わない。決定リストを tasklist.md に記録して Phase 1（T1-1）で実行
├── T0-5: スコープ外コード・ファイルのコメントアウト（復元可能形式）
└── T0-6: 実装範囲外領域のプレースホルダー配置（サイズ維持）
          参照: Skill('implement-phase0')
→ 完了確認: Skill('implement-phase0-test')（実ファイル: `.claude/skills/implement-phase0/implement-phase0-test/SKILL.md`）— PASS 後に state.md 更新・応答終了

Phase 1: 基盤整備（ブロッカー）
├── T1-1: ディレクトリ構造・ファイル整理（T0-4 の振り分けリスト実行 + src/ 二重化解消）
├── T1-2: BFF共有型・Zodスキーマ作成（front_bff_shared）
└── T1-3: ViewModel型定義（features/types/）
          参照: Skill('implement-phase1')
→ 完了確認: pnpm tsc --noEmit → Skill('implement-phase1-test') — PASS 後に state.md 更新・応答終了

Phase 2: API・Repository 層（T1-4 完了後）
├── T2-1: api/ 通信関数実装（エンドポイントごと）
└── T2-2: repository/ 複合API実装（並列呼び出し・保存処理）
→ 完了確認: Skill('implement-phase2-test') — PASS 後に state.md 更新・応答終了

Phase 3: 状態管理（T2-2 完了後）
├── T3-1: Zustandストア実装
└── T3-2: notification.store.ts 実装 ※リアルタイム通知機能を持つ機能のみ
→ 完了確認: Skill('implement-phase3-test') — PASS 後に state.md 更新・応答終了

Phase 4: Hook 層（T3-1 完了後）
├── T4-1: カスタムフック実装（初期化・操作・送信）
└── T4-2: useNotification フック実装 ※リアルタイム通知機能を持つ機能のみ
→ 完了確認: Skill('implement-phase4-test') — PASS 後に state.md 更新・応答終了

Phase 5: コンポーネント層（T4-1 完了後）
├── T5-1: Organism細分化・Molecule抽出
│         Organism の JSX を読み、独立した UI 単位（ヘッダー・フッター・ツールパネル・カード等）を
│         molecule として切り出す。Organism は hook 呼び出しと molecule の組み合わせのみに絞る。
│         molecule は UI の最小単位（atom の組み合わせ）まで細分化し、1つの molecule が
│         肥大化しないよう注意する（目安: molecule の JSX が 50行を超えたらさらに分割を検討）
│         ※ Page.tsx を最小化したときに余剰ロジックが Organism に流れ込む問題をここで防ぐ
├── T5-2: Molecule群実装・既存コンポーネント整理
│         T5-1 で洗い出した molecule を実装し、既存仮配置コンポーネントを整理・確定する
├── T5-3: Organism実装
│         T5-1/T5-2 で整った molecule を使って Organism を組み立てる
│         ⚠️ Phase 3 で実装した Page スコープ Zustand ストアのアンマウントリセットをここで追加する:
│         `useEffect(() => { return () => { use{機能名}Store.getState().reset(); }; }, []);`
├── T5-4: Page層（RSC化）
├── T5-5: {機能ID}.tsx の最小化確認・修正
│         features/{LV1}/{LV2}/{LV3}/{機能ID}.tsx が「Organism への委譲のみ」になっているかを確認する。
│         JSX・状態・ロジックが混在している場合は Organism へ移動し、エントリーファイルを薄くする
│         ※ {機能ID}.tsx はルーティング層と feature 層の境界。ここにロジックを置かない
└── T5-6: importパス確認・修正（{機能ID}.tsx 含む全コンポーネントの import パスを確認し壊れたパスを修正）
→ 完了確認: Skill('implement-phase5-test') — PASS 後に state.md 更新・応答終了

Phase 6: 機能実装（T5-3 完了後）
├── T6-1: 主要操作の完全実装
├── T6-2: サーバー連携（楽観的更新など）
└── T6-3: 確定・キャンセル処理
→ 完了確認: Skill('implement-phase6-test') — PASS 後に state.md 更新・応答終了

Phase 7: バリデーション・エラーハンドリング（T6-3 完了後）
├── T7-1: クライアントバリデーション
├── T7-2: APIエラーハンドリング統一
├── T7-3: 共通エラー基盤実装
│         ① shared/utils/bff-error.ts 作成（BffApiError + classifyHttpError）
│         ② api/ 通信関数の throw を BffApiError に統一
│         ③ hooks の catch ブロック完全実装（toast.error または throw で error.tsx に委譲）
│         ④ error.tsx 配置確認
└── T7-4: .gitkeep クリーンアップ
→ 完了確認: Skill('implement-phase7-test') — PASS 後に state.md 更新・応答終了

Phase 8: Storybookセットアップ・story作成（Phase 7-3 完了後）
├── T8-1: Storybookセットアップ確認（.storybook/main.ts / preview.ts / package.json スクリプト）
│         参照: Skill('implement-phase8')
├── T8-2: molecules story作成（atom相当の小粒コンポーネントを含む）
│         ※ features 内に atoms/ フォルダは作らない。小粒コンポーネントも molecules/ に配置する
│         ※ title は 'LV1フォルダ名/molecules/コンポーネント名' 形式にする
│         参照: Skill('implement-phase8')
├── T8-3: organisms story作成
│         ※ canvas + Zustand store を内包する heavy organism。props 境界のみ注入
│         ※ title は 'LV1フォルダ名/organisms/コンポーネント名' 形式にする
│         ※ api/ ファイルが `process.env.NEXT_PUBLIC_*` を参照している場合、Vite バンドルに
│           `process` が存在せず import 時クラッシュが起きる。
│           `.storybook/main.ts` の `viteFinal` に `config.define = { 'process.env': {} }` を
│           追加することで解消する（詳細: Skill('implement-phase8') セクション 3 main.ts）
│         参照: Skill('implement-phase8')
├── T8-4: story title 確認（全 .stories.tsx の title が規定形式か grep で検証・修正）
│         参照: Skill('implement-phase8')
└── T8-5: hooks/ 操作イベント一覧メモ作成（Phase 9 の args/actions 準備）
          hooks/ 配下を読み、操作関数を整理して .steering/*/phase9-actions-memo.md に書き出す
          参照: Skill('implement-phase8')
→ 完了確認: Skill('implement-phase8-test') — PASS 後に state.md 更新・応答終了
```
（Phase 8 タスク番号: T8-1 セットアップ確認 / T8-2 molecules story / T8-3 organisms story / T8-4 title確認 / T8-5 Phase9準備メモ）
```

Phase 9: Storybookテスト実装（Phase 8 完了後）
├── T9-1: API通信が必要なstoryファイルの特定
│         api/ → repository/ → hooks/ → components の依存チェーンを逆トレースし、
│         API呼び出しが発生するコンポーネントに対応するstoryファイルを洗い出す
│         結果は「storyファイル・判定・使用APIエンドポイント全リスト」を tasklist.md に表形式で記録する
│         参照: Skill('implement-phase9')
├── T9-2: 該当storyファイルへのMSW設定追加
│         特定した対象storiesに parameters.msw.handlers を追加する
│         参照: Skill('implement-phase9')
├── T9-3: test/ 配下にstoryテストファイルを作成（MSWあり対象）
│         T9-1 で特定した API通信あり（MSW対象）のstoryのテストファイルを LV3の test/ 直下に作成する
│         ファイル名: {storyファイル名}.test.tsx（test/stories/ サブディレクトリは作らない）
│         import: expect/test/describe は vitest から、within は @storybook/test から
│         参照: Skill('implement-phase9')
├── T9-4: 全storyファイルへのactions追加
│         import { action } from '@storybook/addon-actions' を全storyファイルに追加し、
│         args のコールバック props を action() でラップして Storybook Actions タブで確認できるようにする
│         対象: molecules / organisms の全 .stories.tsx
│         参照: Skill('implement-phase9')
├── T9-5: MSWありテストファイルに AAA パターンのコンポーネントテストを実装
│         React Testing Library + MSW node サーバー（setupServer/msw/node）を使い、
│         Arrange / Act / Assert 形式で各 Story のインタラクションを検証する
│         ・初期表示の要素・disabled 状態の確認（Act なし）
│         ・ボタン押下 → コールバック呼び出し（vi.fn() で検証）
│         ・ボタン押下 → ダイアログ表示（waitFor で非同期確認）
│         参照: Skill('implement-phase9')
├── T9-6: MSW server.boundary + server.use によるテスト独立化
│         参照: Skill('implement-phase9')
├── T9-7: storyファイル parameters.msw.handlers の整合確認
│         参照: Skill('implement-phase9')
├── T9-8: Vitest 統合テスト設定（vitest.config.ts 作成・test スクリプト確認）
│         参照: Skill('implement-phase9')
├── T9-9: MSW不要コンポーネントのstoryテストファイル作成
│         T9-1 で MSW不要と判定した molecules の全storyファイルに対応する
│         テストファイルを LV3の test/ 直下に作成する
│         ファイル名: {storyファイル名}.test.tsx
│         RTL の render + screen を使い、composeStories で story を合成してレンダリングする
│         参照: Skill('implement-phase9')
├── T9-10: RTL + カバレッジ C0/C1/C2 対応 Vitest 設定
│         vitest.config.ts の coverage セクションに C0/C1/C2 のしきい値を追加する
│         ・C0（statements 80%）・C1（branches 70%）・C2（functions 80%）
│         reporter: ['text', 'json', 'html', 'lcov']
│         参照: Skill('implement-phase9')
└── T9-11: CI テスト実行設定（2ファイルのみ、gitlab-ci.yml は触らない）
          product/frontend/ci.env に VITEST_SCRIPT / E2E_SCRIPT を設定する
          package.json に test:{機能コード} スクリプトを追加する
          参照: Skill('implement-phase9')
→ 完了確認: Skill('implement-phase9-test') — PASS 後に state.md 更新・応答終了

Phase 10: storyファイル整理 + E2Eテスト・依存グラフ（Phase 9 完了後）
├── T10-0: {CODE}.tsx → index.tsx リネーム（依存グラフ生成前に実施）
│         ① features/{LV3}/ 直下の空 index.ts を削除する
│         ② {CODE}.tsx を index.tsx にリネームする（git mv 推奨）
│         ③ app/ 側で {CODE} を直接 import しているファイルの import パスから "/コード名" を除去する
│         ④ pnpm tsc --noEmit でエラーゼロを確認する
│         参照: Skill('implement-phase10') `## T10-0`
├── T10-1: stories/ フォルダへの storyファイル移動（components/ と同階層に stories/organisms/ stories/molecules/ を作成し移動・storiesファイルのimportパス更新・test/配下のstoriesファイルimportパスも更新）
├── T10-2: scripts/server-test.sh の修正（case 2箇所）
├── T10-3: scripts/{CODE}-test.js の新規作成（REC002-test.js を雛形に）（Playwright Testing Agents を使用）
├── T10-3v: {CODE}-test.js の動画・ログエクスポート確認（recordVideo / context.close / videoPath rename の3点）
├── T10-3r: 生成テストのユーザーレビュー（AskUserQuestion でプレビュー提示 → 改善ループ → 承認後に次へ）
└── T10-4: 依存グラフ生成（depcruise で dot → png を生成し docs/01_アプリ/{LV1}/{LV2}/ に保存）
→ 完了確認: Skill('implement-phase10-test') — PASS 後に state.md 更新・応答終了（GITLABのパイプラインですべてのテスト結果がPASS確認で終了）

---


**各タスクで参照する設計書**：

| タスク | 参照ファイル | 見出し |
|--------|------------|--------|
| **Phase 0: T0-1〜T0-6** スコープ確定・shared 振り分け洗い出し | | |
| | Skill('implement-phase0') | 全章（STEP 3 の規約準拠実装手順） |
| | `01_フロントエンド・BFF共通基盤設計/フロントエンド・BFF共通基盤規約.md` | 全章（コンポーネントファイル構成・許可フォルダ一覧・shared 昇格条件） |
| | `11_開発規律と品質管理/開発規律と品質管理規約.md` | 全章（コメントアウト構文・プレースホルダー構文） |
| **T0-3** ページ境界特定 | `07_ルーティング設計/ルーティング設計規約.md` | 全章（ページ境界・ルーティング規則） |
| | | |
| **Phase 1: T1-1〜T1-3** 基盤整備・shared 振り分け実行 | | |
| | Skill('implement-phase1') | 全章（STEP 3 の規約準拠実装手順） |
| | `01_フロントエンド・BFF共通基盤設計/フロントエンド・BFF共通基盤規約.md` | `§6 ディレクトリ・ファイル配置規約` / BFF型・Zodスキーマ配置ルール |
| | `directory-structure.md [未整備]` | （代替: structure_2.md または 01_共通基盤規約 §6） |

> **T1-1 注意 — 未定義フォルダの削除手順**:
> 設計書に定義されていないフォルダ（例: `src/`、`tmp/` 等）は削除する。
> **必ず中身を先に外に出してから削除すること。**
> 手順: ① 中身を設計書の正しい配置先へ移動 → ② 空になったことを確認 → ③ フォルダ削除
> 移動先が不明な場合は `## ディレクトリ構成` を参照し、それでも判断できなければ [Gate: ESCALATE] で確認する。

| **Phase 2: T2-1〜T2-2** API・Repository 層 | | |
| | Skill('implement-phase2') | 全章（STEP 3 の規約準拠実装手順） |
| | `10_BFF設計/BFF設計規約.md` | 全章（三層責務・命名規則・経由必須I/F） |
| | `13_セキュリティ基盤設計/セキュリティ基盤規約.md` | 全章（CSRF/XSS/PHIマスキング・認証ガード） |

> **T2-1 注意**: `design_detail` と AI実装制約でエンドポイント数が異なる場合は **件数が多い方を採用する**。少ない方を選ぶと未実装の API が発生する。件数が同数の場合は AI実装制約を採用する。

| **Phase 3: T3-1〜T3-2** 状態管理 | | |
| | Skill('implement-phase3') | 全章（STEP 3 の規約準拠実装手順） |
| | `04_状態管理設計/状態管理規約.md` | 全章（Zustand・クエリキー・クリーンアップ機構） |
| **T3-2** notification.store ※optional | `08_リアルタイム通信設計/リアルタイム通信規約.md` | `## 通知ストア設計` |
| | | |
| **Phase 4: T4-1〜T4-2** Hook 層 | | |
| | Skill('implement-phase4') | 全章（STEP 3 の規約準拠実装手順） |
| | `04_状態管理設計/状態管理規約.md` | 全章（フック分類・クエリキー設計） |
| | `05_コンポーネント設計/コンポーネント設計規約.md` | 全章（Hook 配置・依存方向） |
| **T4-2** useNotification ※optional | `08_リアルタイム通信設計/リアルタイム通信規約.md` | `## useNotificationフック` / `## Socket.io接続設定` / `## 再接続戦略` |
| | | |
| **Phase 5: T5-1〜T5-6** コンポーネント層 | | |
| | Skill('implement-phase5') | 全章（STEP 3 の規約準拠実装手順） |
| | `05_コンポーネント設計/コンポーネント設計規約.md` | 全章（Atomic Design・Props型・RSC/RCC境界） |
| | `06_UIビジュアル設計/UIビジュアル規約.md` | 全章（デザイントークン・UIライブラリ・画像最適化） |
| **T5-5** {機能ID}.tsx 最小化 | — | `{機能ID}.tsx` が Organism への委譲のみになっているか確認し、余剰 JSX・ロジックを Organism へ移動する |
| **T5-6** importパス確認・修正 | — | `{機能ID}.tsx` + features 内の全コンポーネントの import パスを `grep` で確認し、存在しないパスを修正する |
| | | |
| **Phase 6: T6-1〜T6-3** 機能実装（操作イベント連携） | | |
| | Skill('implement-phase6') | 全章（STEP 3 の規約準拠実装手順） |
| | `04_状態管理設計/状態管理規約.md` | 全章（楽観的更新・ロールバック） |
| | `05_コンポーネント設計/コンポーネント設計規約.md` | 全章（Organism と hooks の責務分離） |
| | `09_監視エラーハンドリング設計/監視エラーハンドリング規約.md` | 全章（エラー処理基盤・通知基盤） |
| | | |
| **Phase 7: T7-1〜T7-4** バリデーション・エラーハンドリング | | |
| | Skill('implement-phase7') | 全章（STEP 3 の規約準拠実装手順） |
| | `09_監視エラーハンドリング設計/監視エラーハンドリング規約.md` | 全章（エラー分類・Error Boundary・通知UI） |
| | `03_TypeScript型管理/TypeScript型管理規約.md` | 全章（Zod スキーマ定義・型推論） |
| **T7-4** .gitkeep クリーンアップ | — | ファイルが存在するディレクトリの `.gitkeep` を削除する |
| | | |
| **Phase 8: T8-1〜T8-5** Storybookセットアップ・story作成 | | |
| | Skill('implement-phase8') | 全章（STEP 3 の規約準拠実装手順） |
| | `12_自動テスト実装/自動テスト実装規約.md` | 全章（story 配置・命名・1 Story = 1 状態） |
| | `12_自動テスト実装/ビジュアルリグレッションテスト基盤設計.md` | 全章（Storybook 基盤I/F・MSW ローダー） |
| | | |
| **Phase 9: T9-1〜T9-6** Storybookテスト強化（MSW・Vitest） | | |
| | Skill('implement-phase9') | 全章（STEP 3 の規約準拠実装手順） |
| | `12_自動テスト実装/自動テスト実装規約.md` | 全章（MSW ハンドラ・Vitest 設定） |
| | `12_自動テスト実装/単体・コンポーネント・結合テスト基盤設計.md` | 全章（Vitest / MSW 基盤I/F） |
| | | |
| **Phase 10: T10-1〜T10-4** E2Eテスト + READMEドキュメント | | |
| | Skill('implement-phase10') | 全章（STEP 3 の規約準拠実装手順） |
| | `12_自動テスト実装/自動テスト実装規約.md` | 全章（E2E 必須シナリオ・テスト命名） |
| | `12_自動テスト実装/E2Eテスト基盤設計.md` | 全章（Playwright 基盤I/F・URL マッピング） |
| | `11_開発規律と品質管理/開発規律と品質管理規約.md` | 全章（READMEテンプレート・依存グラフ生成） |
| **T10-2〜T10-3** E2Eテスト事前準備 | Skill('app-e2e-test-prep') | 全章（Playwright Testing Agents を使用） |

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`
> （機能固有の詳細設計書。実装時の主参照）
>
> **2種類の設計書の使い分け**:
> - Phase 1〜7 の実装タスク → `design_detail-*` を主参照（AI実装制約・操作イベント定義・状態管理ルールが含まれる）
> - `/review` や設計検証（spec-reviewer / design-validator） → `フロントエンド個別詳細設計書_*` を参照（番号付き章構成の正式設計書）
>
> **`design_detail` ファイルがない場合の代替参照**:
> `design_detail-{機能ID}_{機能名}.md` が存在しない場合は、`design-{機能ID}_{機能名}.md`（機能設計書）を参照してください。
> - `design_detail-*` がある → そちらを優先（詳細設計書）
> - `design_detail-*` がない → `design-*` を参照（機能設計書）
>
> **`02_詳細設計書/` の参照パス規則**:
> 上記テーブルで `02_詳細設計書/` を参照する場合、規約ファイル（`*規約.md`）を優先参照する。
> - 規約ファイルあり → `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/{NN}_{カテゴリ}/{カテゴリ}規約.md` を使う
> - 規約ファイルなし → `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/{NN}_{カテゴリ}/{基盤設計ファイル}.md` を使う
> - （過去の参照） `new/` 版 → 規約化済みのため原則使用しない（規約ファイルを優先）

---

## 規約ファイル一覧（`docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/` 配下）

以下の規約ファイルが Phase 0〜10 の実装で参照される。
実装中に参照が必要になった場合は、該当する規約ファイルを確認すること。

| # | カテゴリ | 規約ファイル | 主な内容 |
|---|---|---|---|
| 01 | フロントエンド・BFF共通基盤設計 | `フロントエンド・BFF共通基盤規約.md` | axiosClient 利用規約・マルチテナント制御・認証ヘッダー・ディレクトリ配置 |
| 02 | 開発環境設計 | `開発環境規約.md` | tsconfig 設定・環境変数・ESLint 設定 |
| 03 | TypeScript型管理 | `TypeScript型管理規約.md` | front_bff_shared 配置・Zod スキーマ |
| 04 | 状態管理設計 | `状態管理規約.md` | Zustand / React Query / React Hook Form 利用規約 |
| 05 | コンポーネント設計 | `コンポーネント設計規約.md` | Atomic Design 分類・Props設計・RSC/RCC境界 |
| 06 | UIビジュアル設計 | `UIビジュアル規約.md` | Tailwind実装規約・UIライブラリ利用・画像最適化 |
| 07 | ルーティング設計 | `ルーティング設計規約.md` | App Router・動的ルート・ページ境界 |
| 08 | リアルタイム通信設計 | `リアルタイム通信規約.md` | Socket.io・通知ストア・WebSocket 接続 |
| 09 | 監視エラーハンドリング設計 | `監視エラーハンドリング規約.md` | エラー分類・Error Boundary・GlitchTip連携 |
| 10 | BFF設計 | `BFF設計規約.md` | 三層アーキテクチャ・Controller/Service/Client 責務 |
| 11 | 開発規律と品質管理 | `開発規律と品質管理規約.md` | Prettier・Storybook・README整備 |
| 12 | 自動テスト実装 | `自動テスト実装規約.md` | Vitest・Playwright・MSW・ビジュアルリグレッション |
| 13 | セキュリティ基盤設計 | `セキュリティ基盤規約.md` | CSRF対策・XSS対策・PHIマスキング |
| 15 | 運用監視基盤 | `運用監視規約.md` | Core Web Vitals・GlitchTip・メトリクス |

> **規約ファイルと基盤設計ファイルの関係:**
> - 規約ファイル（`*規約.md`）: アプリ実装チームが守るべきルール（経由必須 I/F・禁止事項・命名規則）
> - 基盤設計ファイル（`*設計.md`）: 基盤チームが提供する I/F 仕様・実装パターン・ADR
> - 実装時は規約ファイルを優先参照し、詳細な I/F 仕様が必要になったら基盤設計ファイルを確認する

**Next.js ベストプラクティス参照**（`product/.agents/skills/next-best-practices/`）:

| フェーズ | スキルファイル | 参照ポイント |
|---|---|---|
| Phase 1 | `file-conventions.md` | page.tsx / layout.tsx / error.tsx の配置ルール、ルートセグメント規則 |
| Phase 1 | `directives.md` | `'use client'` / `'use server'` / `'use cache'` の使い分け |
| Phase 1 | `bundling.md` | serverExternalPackages / transpilePackages 設定、問題パッケージ表 |
| Phase 1 | `runtime-selection.md` | Node.js vs Edge ランタイムの選択（デフォルトは Node.js） |
| Phase 2 | `route-handlers.md` | GET/POST エンドポイント実装・Route Handler vs Server Actions 使い分け表 |
| Phase 2 | `data-patterns.md` | データ取得の決定木（Server Component / Server Actions / Route Handlers） |
| Phase 2 | `async-patterns.md` | Next.js 15+: cookies / headers / params の async 化必須、型定義パターン |
| Phase 2 | `functions.md` | cookies / headers / after 等のサーバー関数 API |
| Phase 4 | `functions.md` | useRouter / usePathname / useSearchParams / useParams の API 仕様 |
| Phase 4 | `suspense-boundaries.md` | useSearchParams は静的ルートで Suspense 境界が必須 |
| Phase 5 | `rsc-boundaries.md` | 非シリアライズ可能 Props（Date / Map / 関数等）の検出と修正パターン |
| Phase 5 | `hydration-error.md` | ハイドレーションエラーの原因と修正（window / 日付 / ランダム値） |
| Phase 5 | `image.md` | next/image 必須・remotePatterns・sizes・priority 設定 |
| Phase 5 | `async-patterns.md` | Pages / Layouts での `Promise<params>` 型・`React.use()` パターン |
| Phase 6 | `parallel-routes.md` | モーダルパターン（@slot / インターセプティングルート）・`router.back()` で閉じる |
| Phase 6 | `metadata.md` | generateMetadata・OG 画像生成（next/og）・Sitemap |
| Phase 6 | `scripts.md` | next/script の Loading Strategy・Google Analytics / GTM |
| Phase 7 | `error-handling.md` | **必読**: Server Actions 内で `redirect` を try-catch で囲まない・`unstable_rethrow` / `notFound` / `forbidden` |
| Phase 9 | `debug-tricks.md` | `/_next/mcp` エンドポイント（get_errors / get_routes / get_logs）でのデバッグ（E2E事前準備・テスト実行時） |

tasklist.md が完成したら、`state.md` を以下の内容で更新して**このセッションを終了する**。Phase 0 の実装は次のセッションで「継続の場合」として開始する。

- `.steering/YYYYMMDD-機能名/state.md` を更新する:
  ```yaml
  feature: "{domain}/Fxx_機能名"
  phase: implement
  progress: "steering作成完了。次は Phase 0 (T0-1: コンポーネント分割) から"
  last_updated: "YYYY-MM-DD"
  ```
- `docs/01_アプリ/INDEX.md` のステータスを `implement` に更新する
- **応答を終了する。Phase 0 の実装はここでは開始しない。**

---

## 継続の場合（phase: implement）

- `.steering/{対象}/state.md` を読む
- `.steering/{対象}/tasklist.md` を読む
- `.steering/{対象}/session-log.md` の最新エントリを確認する
- 先頭の未完了タスク `[ ]` から再開する

---

## Phase 開始時の前処理（スキル実行判定）

継続セッションで Phase の最初のタスクを開始する前に、必要なスキルが未実行の場合は実行する。

### フロー

1. **現在の Phase を特定する**
   - `tasklist.md` の最初の未完了タスク `[ ]` から Phase を判定
   - 例: `[ ] T0-1: コンポーネント分割` → Phase 0

2. **state.md の phase_preprocessing を確認する**
   - 該当 Phase のスキル実行履歴を確認
   - 未実行（記録なし）の場合は次のステップへ

3. **Phase 別スキル実行マトリクスを参照して実行する**

### Phase 別スキル実行マトリクス

| Phase | super-brainstorming-lite | writing-plan | subagent-driven-development or executing-plans | super-validation-before-completion | finishing-a-development-branch | 実行条件 |
|-------|------------------------|-------------|------------------------------------------------------|----------------------------------|-------------------------------|---------|
| **Phase 0** | ✅ 必須 | ✅ 必須 | ⚠️ 非推奨（スキップ推奨） | ✅ 必須 | ⚠️ 非推奨（通常スキップ） | 無条件で実行 |
| **Phase 1** | ❌ 不要 | ✅ 必須 | ⚠️ 非推奨（スキップ推奨） | ✅ 必須 | ⚠️ 非推奨（通常スキップ） | 無条件で実行 |
| **Phase 2** | ❌ 不要 | ✅ 必須 | ⚠️ 非推奨（スキップ推奨） | ✅ 必須 | ⚠️ 非推奨（通常スキップ） | 無条件で実行 |
| **Phase 3** | ❌ 不要 | ✅ 必須 | ⚠️ 非推奨（スキップ推奨） | ✅ 必須 | ⚠️ 非推奨（通常スキップ） | 無条件で実行 |
| **Phase 4** | ❌ 不要 | ✅ 必須 | ⚠️ 非推奨（スキップ推奨） | ✅ 必須 | ⚠️ 非推奨（通常スキップ） | 無条件で実行 |
| **Phase 5** | ❌ 不要 | ✅ 必須 | ⚠️ 非推奨（スキップ推奨） | ✅ 必須 | ⚠️ 非推奨（通常スキップ） | 無条件で実行 |
| **Phase 6** | ❌ 不要 | ✅ 必須 | ⚠️ 非推奨（スキップ推奨） | ✅ 必須 | ⚠️ 非推奨（通常スキップ） | 無条件で実行 |
| **Phase 7** | ❌ 不要 | ✅ 必須 | ⚠️ 非推奨（スキップ推奨） | ✅ 必須 | ⚠️ 非推奨（通常スキップ） | 無条件で実行 |
| **Phase 8** | ✅ 必須 | ✅ 必須 | ⚠️ 非推奨（スキップ推奨） | ✅ 必須 | ⚠️ 非推奨（通常スキップ） | story 方針が設計書に未記載 & (organisms 5個以上 または Zustand store 内包 organism 2個以上) の場合は brainstorming も実行 |
| **Phase 9** | ✅ 必須 | ✅ 必須 | ⚠️ 非推奨（スキップ推奨） | ✅ 必須 | ⚠️ 非推奨（通常スキップ） | 無条件で実行 |
| **Phase 10** | ✅ 必須 | ✅ 必須 | ⚠️ 非推奨（スキップ推奨） | ✅ 必須 | ⚠️ 非推奨（通常スキップ） | E2E シナリオが設計書に未記載 & (受入条件 10項目以上 または 複数ロール関与) の場合は brainstorming も実行 |

**実行フロー**:
各 Phase で以下の順序で **必ず全て** 実行する:
1. **super-brainstorming-lite**（Phase 0 / Phase 8 / Phase 10 の条件付き実行のみ）
2. **writing-plan**（全 Phase 必須）
3. **⚠️ subagent-driven-development / executing-plans は使用しない（推奨）**
   - これらのスキルはオーバーヘッドが大きく、実装効率を下げるため使用しない
   - メインエージェントが直接実装を行う方がシンプルで速い
   - 特別な理由がない限り、ステップ3はスキップして実装作業へ進む
4. 実装作業（各 Phase のタスク T0-1〜T10-7）
5. **⚠️ super-validation-before-completion**（全 Phase 必須・実行しない場合は Phase 未完了）
   ```
   Skill('super-validation-before-completion')
   ```
6. **⚠️ Phase テストスキル**（全 Phase 必須・実行しない場合は Phase 未完了）
   ```
   Skill('implement-phase{N}-test')
   ```
   - FAIL の場合: `git reset HEAD~1` で修正 → 再度テストスキル実行 → 応答終了
   - PASS の場合: 次のステップへ
7. **⚠️ finishing-a-development-branch**（全 Phase 必須・Phase テスト PASS 後）
   ```
   Skill('finishing-a-development-branch')
   ```
   - merge / PR / keep / discard の4択を提示
   - 選択実行後に state.md 更新 → 応答終了

**⚠️ 検証3ステップ（5〜7）を実行せずに Phase 完了を宣言することは禁止。**

**（参考）subagent-driven-development / executing-plans の説明**:
- **subagent-driven-development**: タスクごとに独立したサブエージェントを起動し、タスク間でレビューを行う。柔軟性が高いが、オーバーヘッドがやや大きい（非推奨）
- **executing-plans**: 現在のセッション内でテストファースト原則に従って実装する。シンプルで速いが、並列性が低い（非推奨）

これらのスキルは特別な理由がない限り使用しない。メインエージェントが直接実装する方が効率的。

### スキル実行の詳細

#### Phase 0: super-brainstorming-lite → writing-plan

**実行タイミング**: Phase 0 の T0-1 開始前（state.md の phase_preprocessing.phase_0 が空の場合）

**実行順序**:

1. **super-brainstorming-lite を起動**

```
Skill('super-brainstorming-lite')
args: |
  機能: {domain}/Fxx_機能名
  フェーズ: Phase 0（スコープ確定・コンポーネント設計）
  
  以下を brainstorming してください:
  
  1. コンポーネント分割の境界
     - Atoms: 最小の UI 要素（Button / Input / Label 等）
     - Molecules: Atoms の組み合わせ（FormField / SearchBox 等）
     - Organisms: Molecules + hooks（DataTable / FormPanel 等）
     - Page: Organisms の配置のみ（ロジックなし）
  
  2. shared 昇格候補
     - 型定義（front_bff_shared / shared/types）
     - カスタムフック（shared/hooks）
     - ユーティリティ（shared/utils）
     - 共通コンポーネント（shared/components）
  
  3. 他機能との境界
     - ページ境界（このページで完結 or 他ページと連携）
     - 共有 UI 領域（ヘッダー・サイドバー・モーダル等）
     - 共有状態（グローバルストア or ページ内ローカルストア）
  
  4. スコープ外コードの特定
     - コメントアウト対象（未実装の関数・未使用の import）
     - プレースホルダー配置（実装範囲外の UI 領域）
  
  参照ファイル:
  - docs/01_アプリ/{domain}/{機能グループ}/design-Fxx_{機能名}.md
  - docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/01_フロントエンド・BFF共通基盤規約.md
  - docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/05_コンポーネント設計規約.md
```

2. **writing-plan を起動**（brainstorming 完了後）

**事前準備**: writing-plan 起動前に以下を確認・読み込む
- 対象機能の設計書（PRD / 機能設計書 / 詳細設計書）
- 当該 Phase の規約ファイル（`implement.md` の「0-1. 規約ファイルの存在確認」を参照）
- brainstorming の出力結果

```
Skill('writing-plan')
args: |
  機能: {domain}/Fxx_機能名
  Phase: {Phase番号}  # 例: 0, 1, 2, ...
  目的: Phase {Phase番号} の実装計画を作成
  
  ## 入力ファイル
  
  ### 設計書（必須）
  - docs/01_アプリ/{domain}/{機能グループ}/prd-Fxx_{機能名}.md
  - docs/01_アプリ/{domain}/{機能グループ}/design-Fxx_{機能名}.md
  - docs/01_アプリ/{domain}/{機能グループ}/design_detail-Fxx_{機能名}.md（存在する場合）
  
  ### 規約ファイル（Phase ごとに異なる）
  - `implement.md` の「0-1. 規約ファイルの存在確認」を Read
  - Phase {Phase番号} の規約ファイル一覧を取得
  - 各規約ファイルを Read して計画に反映する
  
  ### brainstorming 結果
  - 前ステップで出力された brainstorming の分析結果
  
  ## 出力先
  
  .steering/{日付}-{機能名}/phase{Phase番号}-plan.md
  
  ## 構成
  
  ### 1. コンポーネント分割表（Phase 0, 5 の場合）
  | 層 | コンポーネント名 | 責務 | 配置パス |
  |---|---|---|---|
  | Atoms | ... | ... | features/.../components/atoms/... |
  | Molecules | ... | ... | features/.../components/molecules/... |
  | Organisms | ... | ... | features/.../components/organisms/... |
  | Page | ... | ... | app/.../page.tsx |
  
  ### 2. shared 振り分けリスト（Phase 0, 1 の場合）
  | 元パス | 移動先パス | 理由 |
  |---|---|---|
  | features/.../xxx.type.ts | front_bff_shared/types/xxx.type.ts | BFF との共有型 |
  | features/.../useXxx.ts | shared/hooks/useXxx.ts | 複数機能から参照 |
  
  ### 3. スコープ外コード一覧（Phase 0 の場合）
  | ファイル | 行範囲 | コメントアウト理由 |
  |---|---|---|
  | features/.../xxx.tsx | 50-80 | 未実装機能（Phase 10 で実装予定） |
  
  ### 4. プレースホルダー配置箇所（Phase 0 の場合）
  | 領域 | サイズ維持方法 |
  |---|---|
  | サイドバー | 固定幅 200px の空 div |
  
  ### 5. 規約遵守チェックポイント（全 Phase 必須）
  | 規約ファイル | チェック項目 | 実装時の注意点 |
  |---|---|---|
  | {規約ファイル名} | {チェック項目} | {実装者への注意事項} |
  
  ※ Phase ごとの規約ファイルから重要なチェックポイントを抽出して記載する
```

3. **state.md を更新**

```yaml
phase_preprocessing:
  phase_0:
    brainstorming: "completed"
    writing_plan: "completed"
    executed_at: "YYYY-MM-DD HH:MM"
```

4. **T0-1 タスク実装へ進む**

---

#### Phase 8: 条件付き super-brainstorming-lite

**実行判定**:

```bash
# 以下の条件をすべて満たす場合のみ実行
1. design_detail-*.md に「## Storybook 実装計画」セクションが存在しない
   AND
2. 以下のいずれかに該当:
   - organisms/ 配下のコンポーネント数が 5 以上
   - Zustand store を内包する organism が 2 以上
```

**実行内容**（条件を満たす場合のみ）:

```
Skill('super-brainstorming-lite')
args: |
  機能: {domain}/Fxx_機能名
  フェーズ: Phase 8（Storybook セットアップ）
  
  以下を brainstorming してください:
  
  1. 各 organism の状態バリエーション
     - 初期状態（データなし・空配列）
     - ローディング中（Skeleton 表示）
     - エラー状態（エラーメッセージ表示）
     - データあり（正常表示）
  
  2. story の args 設計
     - props の組み合わせパターン
     - コールバック props のモック方法（action() 使用）
     - Zustand store のモック方法（初期値注入）
  
  3. MSW が必要な story の特定
     - api/ ファイルを呼び出す hooks を持つ organism
     - repository/ を呼び出す hooks を持つ organism
  
  参照ファイル:
  - src/features/{LV3}/components/organisms/*.tsx
  - src/features/{LV3}/hooks/*.ts
  - docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/12_自動テスト実装規約.md
```

**state.md を更新**:

```yaml
phase_preprocessing:
  phase_8:
    brainstorming: "completed" # または "skipped"
    executed_at: "YYYY-MM-DD HH:MM"
```

---

#### Phase 10: 条件付き super-brainstorming-lite

**実行判定**:

```bash
# 以下の条件をすべて満たす場合のみ実行
1. design_detail-*.md に「## E2E テストシナリオ」セクションが存在しない
   AND
2. 以下のいずれかに該当:
   - PRD の受入条件が 10 項目以上
   - 複数のユーザーロール（患者・医師・看護師等）が関与する
```

**実行内容**（条件を満たす場合のみ）:

```
Skill('super-brainstorming-lite')
args: |
  機能: {domain}/Fxx_機能名
  フェーズ: Phase 10（E2E テスト）
  
  以下を brainstorming してください:
  
  1. golden path（正常な操作フロー）
     - ユーザーがページに到達してから目的を達成するまでの最短経路
     - 各ステップで確認すべき要素・状態
  
  2. エラー境界
     - バリデーション失敗（必須項目未入力・形式エラー）
     - API エラー（500 / 401 / 403）
     - ネットワークエラー（タイムアウト）
  
  3. エッジケース
     - 同時操作（複数タブ・複数ユーザー）
     - 権限不足（閲覧のみ・編集不可）
     - データ境界（0件・1件・大量件数）
  
  参照ファイル:
  - docs/01_アプリ/{domain}/{機能グループ}/prd-Fxx_{機能名}.md（受入条件）
  - docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/12_自動テスト実装規約.md
```

**state.md を更新**:

```yaml
phase_preprocessing:
  phase_10:
    brainstorming: "completed" # または "skipped"
    executed_at: "YYYY-MM-DD HH:MM"
```

---

### ルール

- **各タスク開始前に `Skill('andrej-karpathy-skills')` の Runtime Self-Check を行い、現在のタスクに直結しない変更を禁止する**
- **現在のPhaseの全タスクが `[x]` になるまで次のPhaseに進んではいけない**
- **Phase（FE）または B フェーズ（BFF）が完了したら必ず `state.md` の `completed_phases` に記録してから次のPhaseへ進む**
- タスクが大きすぎたら分割してから実装する
- 技術的に不要になったタスクは `[x] ~~タスク名~~ (理由: ...)` で記録する
- 仕様変更が必要になったら **designフェーズに戻る**（下記ゲートで判断を仰ぐ）
- tasklist.md を更新せずに次のタスクへ進んではいけない
- 技術的負債を発見したら `docs/meta/debt.md` に記録する
- 設計書に従った実装はユーザー承認なしで進める。ユーザーへの確認は Gate のみ
  （「設計書に従った実装」= `design_detail-*.md` の AI実装制約・操作イベント定義・状態管理ルールにより実装方法が特定できる場合。複数の実装方法がありAIが選択できない場合は Gate: APPROACH を使う）

### Phase 完了時の自動フロー

Phase N の全タスクが `[x]` になったら、**必ず以下の順序で実行する**:

0. **規約順守チェック（メインエージェントが直接実行）**

**担当:** メインエージェント（スキルではなく直接実行）

**手順:**
1. STEP 0-1 で確認した規約ファイルを再度 Read
2. 規約の全見出し・全箇条書きルールを列挙
3. 各ルールについて以下を確認:
   - tasklist.md に記録されているか
   - コード上にタグ（`// SCOPE-OUT` 等）が適切に配置されているか
   - 禁止事項（`any` 型、二重キャスト等）を使用していないか
4. 不適合があれば修正 → 再点検（PASSするまで繰り返し）
5. PASS結果をユーザに報告

> **注意:** スキル側にチェックリストは置かない。規約から動的に組み立てる。

### Phase 完了時の必須検証フロー（3ステップ）

**⚠️ 重要**: Phase の全タスク完了後、以下の3ステップを **必ず順番に** 実行する。
どれか1つでも実行しない場合、Phase は未完了とみなす。

#### ステップ1: `super-validation-before-completion` 実行

```
Skill('super-validation-before-completion')
```

   > **スキル内で自動実行される検証項目**:
   > - Prettier 自動フォーマット（**Phase変更ファイルのみ** — 自動修正あり）
   >   - `git diff --cached` でステージング済みファイルを動的に取得
   >   - frontend配下のts/tsx/json/mdのみ対象
   >   - ファイル数ゼロの場合はスキップ
   > - Prettier 検証（`npx prettier --check` — Phase変更ファイルのみ）
   > - ESLint（`npx eslint` — **Phase変更ファイルのみ** — 自動修正なし）
   >   - ステージング済みのts/tsxファイルのみ検証
   >   - エラーがある場合は手動で修正する必要がある
   > - TypeScript 型チェック（`npx tsc --noEmit` — **Phase変更ファイルのみ**）
   >   - ステージング済みのts/tsxファイルのみ型チェック
   >   - 速度を優先し、Phase変更ファイルの型エラーのみを検出
   >   - 依存ファイルの型エラーは検出されない可能性がある（トレードオフ）
   > - 修正があった場合の自動コミット作成（Prettierの自動修正のみ）
   >
   > **注意:** 規約順守チェックは **ステップ0（メインエージェント）** で既に実行済み
   >
   > **PASS 条件**:
   > - 全検証項目でエラーがゼロであること
   > - FAIL の場合は修正してから再度スキルを実行する
   >
   > **Phase 0 の特記事項**:
   > - Phase 0 はコード生成前の設計フェーズだが、`super-validation-before-completion` は必須実行
   > - コンポーネント分割・shared 振り分け洗い出しの完全性をチェックする

#### ステップ2: Phase テストスキル実行

```
Skill('implement-phase0-test')    # Phase 0 の場合
Skill('implement-phase1-test')    # Phase 1 の場合
Skill('implement-phase2-test')    # Phase 2 の場合
... （以下同様）
```

**テスト結果で分岐する**:
   - **FAIL（未完了項目あり）**: 
     未完了タスクを修正する。修正方法（3つの選択肢）:
     - **オプション A（推奨）**: コミットを取り消してから修正 → 再コミット
       ```bash
       git reset HEAD~1              # コミット取り消し（ファイルは変更されない）
       # ここで手動またはAIでファイルを修正する
       git add .
       git commit -m "fix: Phase N TN-X 修正（エラー内容）"
       ```
       - `git reset` はコミット履歴だけを削除し、ファイル内容は保持される
       - 修正後に再コミットすることでクリーンな履歴を作成
     - **オプション B**: 追加の修正コミットを作成
       - 修正の経緯が履歴に残る
       - 大きい修正（ロジック変更）に適している
     - **オプション C**: `git commit --amend` で上書き
       - コミット数が増えない
       - 小さい修正（typo、命名等）に適している
     
     修正後に再度テストスキルを起動する。**PASS するまでこのステップを繰り返す。**
   - **PASS**: 次のステップ（セッション終了処理）へ進む

#### ステップ3: `finishing-a-development-branch` 実行（通常は不要）

**⚠️ 推奨: worktree は使用しない**

通常の開発フローでは worktree を使用せず、通常ブランチで作業することを推奨します。
worktree は複雑さを増すため、特別な理由がない限り避けてください。

**通常ブランチの場合（推奨）:**

```
finishing-a-development-branch スキルはスキップします。
ステップ4（セッション終了前の選択肢提示）へ進みます。

origin への push と PR 作成はユーザーが任意のタイミングで実行してください:
- コミット確認: git log --oneline -5
- Push: git push origin <branch-name>
- PR作成: gh pr create
```

**worktree の場合（非推奨・特殊ケースのみ）:**

まず環境を確認:

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)

if [ "$GIT_DIR" = "$GIT_COMMON" ]; then
  echo "通常ブランチで作業中 — finishing-a-development-branch をスキップ"
else
  echo "worktree で作業中 — finishing-a-development-branch を実行"
fi
```

worktree を使用している場合のみ `Skill('finishing-a-development-branch')` を実行:
   - **Step 1**: 環境検出（worktree であることを確認）
   - **Step 2**: ベースブランチ特定（main / master）
   - **Step 3**: 3択提示（1. merge / 2. キープ / 3. 破棄）
   - **Step 4**: 選択された操作を実行
   - **Step 5**: worktree クリーンアップ（Option 1/3 のみ）

   **注意:** 
   - origin への push は行わない（ユーザーが手動実行）
   - PR 作成は `gh pr create` をユーザーが手動実行する

---

#### ステップ4: Phase完了後の git reset（必須実行）

**🚨 CRITICAL: Phase完了後は必ず git reset を実行すること 🚨**

Phase完了後、以下の手順を**選択肢なしで必ず実行**する:

```bash
# 1. Phase のコミット数を数える
git log --oneline -10

# 2. Phase の開始コミットまで reset（コミット履歴削除・ファイルはunstaged状態で保持）
# 例: Phase で 4個のコミットを作った場合
PHASE_COMMITS=4
git reset HEAD~${PHASE_COMMITS}

# 3. 結果確認
git status
# → 変更内容はワーキングツリーに残っているが、ステージングされていない状態
```

**結果:**
- コミット履歴が削除される
- ファイルの変更内容は残る（ワーキングツリーに存在）
- ステージングされていない状態（staged/committed ではない）
- ユーザーが後で任意のタイミングで `git add` → `git commit` → `git push` を実行

**理由:**
- ユーザーが自分のタイミングでコミット・push できる
- Phase 完了後のコミット内容を自由に調整できる
- 開発中の細かいコミット履歴が残らない
- **エージェントが勝手に push することを防止する**

**禁止事項:**
- ❌ git reset をスキップしてはならない
- ❌ 「オプション」として扱ってはならない
- ❌ ユーザーに選択を求めてはならない
- ❌ Phase完了後に git push を実行してはならない
- ❌ コミットをまとめる（squash）などの追加操作をしてはならない

---

#### ステップ5: state.md 更新 + 応答終了

git reset 実行後、**即座に state.md を更新し、応答を終了する。**
次の Phase へは絶対に進まない。続きはユーザーが次のセッションで再開する。

   > **⚠️ MUST**: どの Phase であっても、finishing-a-development-branch PASS 後に Claude が自発的に次の Phase へ進むのは禁止。
   > state.md の書き込みと応答終了が完了するまで他の作業を一切行わない。

   > **⚠️ MUST**: Phase 完了時・応答終了時に **`CLAUDE.md` を更新してはいけない**。
   > 進捗管理は `.steering/YYYYMMDD-機能名/state.md` のみで行う。CLAUDE.md の `session_progress` 更新は禁止。

### フェーズ完了時の state.md 記録

Phase N または B フェーズ（BFF）の全タスクが `[x]` になったら **即座に** `state.md` を更新する:

```yaml
feature: "{domain}/Fxx_機能名"
phase: implement
progress: "Phase N 完了。次は Phase N+1 (TN+1-1: タスク名) から"
last_updated: "YYYY-MM-DD"
phase_preprocessing:  # 追加: Phase 開始時のスキル実行履歴
  phase_0:
    brainstorming: "completed"
    writing_plan: "completed"
    executed_at: "YYYY-MM-DD HH:MM"
  phase_1:
    brainstorming: "skipped"
    writing_plan: "skipped"
  # ... 各 Phase の実行履歴を記録
completed_phases:
  - "Phase 0: スコープ確定・コンポーネント設計 ✅ YYYY-MM-DD"
  - "Phase 1: 基盤整備 ✅ YYYY-MM-DD"
  # ... 完了した FE Phase を順に追記
  - "B1: 型定義・モジュール構成 ✅ YYYY-MM-DD"
  - "B2: Client 層（axios 実装） ✅ YYYY-MM-DD"
  # ... 完了した BFF Phase を順に追記
compact_resume: |
  ## コンパクト後の再開情報
  完了済み: Phase 0〜N（FE）、B1〜BN（BFF）
  次のタスク: TN+1-1 タスク名 または BN+1-1 タスク名
  実装済みファイル（主要なもの）:
    - src/features/xxx/types/xxx.type.ts
    - src/features/xxx/stores/xxx.store.ts
    - bff/src/features/xxx/xxx.clients.ts
  注意事項: （引き継ぎが必要な判断・ハマりポイント等）
```

### /compact（コンテキスト圧縮）前の必須手順

コンテキストが逼迫して `/compact` を実行する前に、**必ず以下を完了させてから実行する**:

1. `tasklist.md` の現在の進捗を確認・更新する（`[x]` が正確か確認）
2. `state.md` の `compact_resume` フィールドを最新化する:
   - 完了済みのPhase（`completed_phases`）
   - 次に実行するタスク（タスクID + タスク名）
   - 実装済みの主要ファイルパス
   - 引き継ぎが必要な判断・注意事項
3. `session-log.md` に中断エントリを追記する

**コンパクト後の再開手順（セッション開始時）**:
1. `state.md` の `compact_resume` を読む
2. `tasklist.md` で未完了タスク `[ ]` を確認する
3. `compact_resume` に記載の「次のタスク」から再開する

### 実装中の想定外 [メインエージェント: 判断]

**[Gate: ESCALATE]** 仕様外の問題が見つかった場合:
```
header: "確認"
question: "{問題の概要}。仕様範囲外の変更が必要になりました。どうしますか？"
options:
  - "このまま続行する" / description: "{続行した場合の影響}"
  - "/design に戻って仕様を修正する (推奨)" / description: "仕様を正式に更新してから実装を再開"
  - "作業を中断して相談する" / description: "一旦止めて方針を再検討"
```

## 全実装フェーズの完了(implement-phase10終了後)

#### ステップ1: 完了確認 [メインエージェント: 判断]
- tasklist.md の全タスクが `[x]` であることを確認する
- テスト・lint・型チェックが通ることを確認する

#### ステップ2: 整合性チェック [サブエージェント: 検証]

| サブエージェント | 参照 | やること |
|---|---|---|
| **consistency-checker** | `.claude/agents/consistency-checker.md` | state.md / INDEX.md / .steering/ の整合性を検証 |

#### ステップ3: 完了報告

整合性チェック結果を添えて state.md を更新し、次のステップを 1 行で案内して応答を終了する。
（例: 「全タスク完了。整合性 OK。次は `/review` を実行してください。」）

---

## セッション終了時（毎回やること）

> **⚠️ MUST**: セッション終了時・応答終了時に **`CLAUDE.md` を更新してはいけない**。
> 進捗状態は `.steering/YYYYMMDD-機能名/state.md` が正。CLAUDE.md の `session_progress` 更新は禁止。

1. `session-log.md` にエントリを追記する（Skill('steering') のフォーマットに従う）
2. `.steering/{対象}/state.md` の `progress` / `last_updated` / `compact_resume` を更新する

例:
```yaml
feature: "{domain}/Fxx_機能名"
phase: implement
progress: "Phase 3 完了。tasklist 9/15完了。次はT4-1（カスタムフック実装）から"
last_updated: "YYYY-MM-DD"
phase_preprocessing:  # 追加: 各 Phase のスキル実行履歴
  phase_0:
    brainstorming: "completed"
    writing_plan: "completed"
    executed_at: "YYYY-MM-DD HH:MM"
  phase_1:
    brainstorming: "skipped"
    writing_plan: "skipped"
  phase_2:
    brainstorming: "skipped"
    writing_plan: "skipped"
  phase_3:
    brainstorming: "skipped"
    writing_plan: "skipped"
completed_phases:
  - "Phase 0: スコープ確定・コンポーネント設計 ✅ YYYY-MM-DD"
  - "Phase 1: 基盤整備 ✅ YYYY-MM-DD"
  - "Phase 2: API・Repository 層 ✅ YYYY-MM-DD"
  - "Phase 3: 状態管理 ✅ YYYY-MM-DD"
  # BFF フェーズも同様に追記する（例）
  # - "B1: 型定義・モジュール構成 ✅ YYYY-MM-DD"
  # - "B2: Client 層（axios 実装） ✅ YYYY-MM-DD"
compact_resume: |
  ## コンパクト後の再開情報
  完了済み: Phase 0〜3（FE）、B1〜B2（BFF）
  次のタスク: T4-1 カスタムフック実装（初期化・操作・送信）
  実装済みファイル（主要なもの）:
    - src/features/xxx/types/xxx.type.ts
    - src/features/xxx/api/xxx.api.ts
    - src/features/xxx/stores/xxx.store.ts
    - bff/src/features/xxx/xxx.clients.ts
  注意事項: ○○のAPIレスポンス型が仕様書と異なるため要確認
```
