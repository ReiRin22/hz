# /synchronizer

実装フェーズを開始または継続する。1セッションで完結しなくてよい。

**メインエージェントの役割は「判断」のみ。計画・検証はサブエージェントに委譲する。**
**人間への判断委譲は `Skill('common-decision-gate')` のプロトコルに従う。**
※ コードの実装自体はメインエージェントが行う（サブエージェントに委譲しない）。

---

## 前提条件

- 機能設計書（`design-Fxx_*.md`）または詳細設計書（`design_detail-*.md`）が作成済みであること
- `/implement` の Phase 0〜1 が完了し、ディレクトリ構造・ViewModel型が整備済みであること
- BFF・BE の基盤設定（module 登録・環境変数・Docker 構成）が完了していること

---

## セッション開始時（毎回やること）

1. `CLAUDE.md` を読む
2. `.steering/` 配下を確認し、対象機能のフォルダ有無で分岐する:
   - **フォルダが存在しない** → 「新規開始の場合」へ
   - **フォルダが存在する** → `state.md` を読んで「継続の場合」へ
3. `Skill('common-decision-gate')` を意識する
4. `Skill('steering')` を読み込む
5. `.claude/skills/andrej-karpathy-skills/CLAUDE.md` を読み込む（実装品質の指針として全フェーズで参照する）
6. `.claude/rules/sync-agents.md` を読んで利用可能なエージェントを把握する
7. `.claude/commands/bff_structure.md` を読み込む（BFF実装の構造ルール）
8. `.claude/rules/cross-layer-rules.md` を読み込む（3層横断の禁止事項）
9. **Serena が利用可能であれば積極的に使用する**（コード構造の把握・シンボル検索・参照関係の追跡に活用）
   - プロジェクトのアクティベート: `mcp__plugin_serena_serena__activate_project` で `harz2` を指定
   - ファイル検索: `mcp__plugin_serena_serena__find_file` でファイルパターンを検索
   - シンボル構造取得: `mcp__plugin_serena_serena__get_symbols_overview` でファイル内のクラス・関数・変数を取得
   - シンボル検索: `mcp__plugin_serena_serena__find_symbol` で特定のシンボルを検索
   - 参照追跡: `mcp__plugin_serena_serena__find_referencing_symbols` でシンボルの参照箇所を追跡
   - **使用場面**: 既存コードの構造把握、コンポーネント間の依存関係確認、リファクタリング影響範囲の特定
10. state.md の `phase` に応じて分岐する

---

## 新規開始の場合（phase: implement → synchronizer へ遷移）

### ステップ1: steering スケルトン作成 [メインエージェント: 作成]

`.steering/sync-YYYYMMDD-機能名/` フォルダと以下のスケルトンファイルを作成する:

- `state.md`（`progress: "sync準備中"`）
- `external-api-spec.md`（バックエンドAPIの仕様を記録）
- `viewmodel-mapping.md`（外部レスポンス→ViewModel の変換ロジックを記録）
- `sync-tasklist.md`（標準フェーズヘッダーのみ・チェックリストは未記入）
- `session-log.md`（初回エントリを記載）

### ステップ2: Phase 0 実行 [Skill: synchronizer-phase0]

**synchronizer-phase0 スキルを起動して Phase 0（S0-1〜S0-6）を実行する:**

```typescript
Skill('synchronizer-phase0', {
  featureCode: '{CODE}',  // 例: REC002
  domain: '{domain}',     // 例: 01_diagnosis
  featureName: '{機能名}' // 例: シェーマ作成
})
```

**スキルの動作:**

- **S0-1**: DB 構造の理解（tmp/ 参照）
  - `tmp/docs/02_schema_design.md` を読み込み
  - `tmp/cmn/*.sql` と `tmp/tenant/*.sql` からテーブル一覧を抽出
  - FK 依存関係を抽出
  - `.steering/sync-{date}-{feature}/db-structure-summary.md` に記録

- **S0-2**: API 分析
  - design_detail から API 一覧を抽出
  - BFF定義書から API 詳細を抽出
  - S0-1 の DB 構造サマリを参照して対象テーブルを推定
  - **依存する共通マスタを洗い出し**（`bff/src/shared/master/` に実装が必要なマスタを特定）
  - PostgreSQL 操作を推定（SELECT/INSERT/UPDATE/DELETE）
  - FK 依存関係から実装順序を決定
  - `.steering/sync-{date}-{feature}/api-analysis.md` に記録

- **S0-3**: ViewModel 設計
  - 外部レスポンス型 → ViewModel 型の変換ロジック設計
  - `.steering/sync-{date}-{feature}/viewmodel-mapping.md` に記録

- **S0-4**: infrastructure_scope の判断
  - none / auth / realtime / all のいずれかを判断

- **S0-5**: タスク分解完了
  - `.steering/sync-{date}-{feature}/sync-tasklist.md` を作成

- **S0-6**: state.md 更新
  - Phase 0 完了を記録

**出力ファイル**:
- `.steering/sync-{date}-{feature}/db-structure-summary.md`
- `.steering/sync-{date}-{feature}/api-analysis.md`
- `.steering/sync-{date}-{feature}/viewmodel-mapping.md`
- `.steering/sync-{date}-{feature}/sync-tasklist.md`
- `.steering/sync-{date}-{feature}/state.md`

> **注意**: BE がモック実装の場合、Controller 層で固定値を返す実装にする。
> BFF の Client 層にモックデータを置かない（`.claude/rules/cross-layer-rules.md` 参照）。

### ステップ3: Phase 0 完了確認 [メインエージェント: 判断]

synchronizer-phase0 スキルが以下の内容で `sync-tasklist.md` を自動生成する:

```markdown
# 3層同期実装タスクリスト

## Phase 0: 準備（スコープ確定・設計）

- [x] S0-1: DB 構造の理解（tmp/ 参照）
- [x] S0-2: API 分析（マスタアクセスパターン・PostgreSQL 操作推定・実装順序決定）
- [x] S0-3: ViewModel 設計（外部レスポンス型 → ViewModel 型の変換ロジック概要）
- [x] S0-4: infrastructure_scope の判断（none / auth / realtime / all）
- [x] S0-5: タスク分解完了（本タスクリスト作成完了）
- [ ] S0-6: state.md 更新（progress: "sync準備完了。次は Phase 1 から"）

## Phase 1: 型定義（FE / BFF / BE）

- [ ] S1-1: BE リクエスト型・レスポンス型定義（C# record / class）
- [ ] S1-2: BFF internal 型定義（`*.api.request.ts` / `*.api.response.ts`）
- [ ] S1-3: BFF → FE 共有型定義（`front_bff_shared/features/*/types/responses/*.response.ts`）
- [ ] S1-4: FE ViewModel 型定義（`features/*/types/*.type.ts`）
- [ ] S1-5: Zod スキーマ定義（`front_bff_shared/features/*/schemas/*.schema.ts`）
          ※ 型の配置ルール・移設方法は `Skill('synchronizer-phase1')` を参照

## Phase 1.5: 依存マスタ実装（S0-2 で洗い出されたマスタのみ）

※ 依存マスタが既存の場合はスキップ。未実装の場合のみ以下を実行:

**{マスタ名1}** （例: test-item-master）
- [ ] M1-1: BFF Client 層（`bff/src/shared/master/{マスタ名}/{マスタ名}.client.ts`）
- [ ] M1-2: BFF Service 層（`bff/src/shared/master/{マスタ名}/{マスタ名}.service.ts`）
- [ ] M1-3: BFF Controller 層（`bff/src/shared/master/{マスタ名}/{マスタ名}.controller.ts`）
- [ ] M1-4: Module 登録（`{マスタ名}.module.ts` + `app.module.ts`）
- [ ] M1-5: BE Controller モック実装（`backend/Controllers/Master/{マスタ名}Controller.cs`）

**{マスタ名2}** （該当する場合のみ追加）
- [ ] M2-1: BFF Client 層
- [ ] M2-2: BFF Service 層
- [ ] M2-3: BFF Controller 層
- [ ] M2-4: Module 登録
- [ ] M2-5: BE Controller モック実装

※ Phase 1.5 完了後、state.md に「依存マスタ: {マスタ名} 実装完了」を記録してから Phase 2 へ進む

## Phase 2: フロントエンド API 層実装

- [ ] S2-1: フロントエンド API 層実装（axiosClient パターン）
          ※ `features/{domain}/{LV2}/{LV3}/api/` 配下の全ファイルに axiosClient パターンを実装
          ※ React Query + axiosClient パターンを使用する（参考: `product/frontend/src/shared/sample/api/useBloodTypeMaster.ts`）
          ※ BFF エンドポイントを呼び出す実装（BE 層は不要）
- [ ] S2-2: 既存 fetch 実装を axiosClient + React Query に変換
          ※ `features/{domain}/{LV2}/{LV3}/api/` 配下の既存 `*.api.ts` ファイルで fetch を使っているものを検出
          ※ 各ファイルで以下の変更を実施:
            1. 元の fetch 実装をコメントアウト
            2. axiosClient + useMutation/useQuery を使った実装に書き換え
            3. GET操作は useQuery、POST/PUT/DELETE操作は useMutation を使用
            4. repository 層から直接呼べるように async function も提供（Hook版との併用パターン）
          ※ 変換パターン例:
            ```typescript
            // 元のfetch実装（コメントアウト）
            // export async function deleteItem(params: { id: string }): Promise<void> {
            //   const res = await fetch(`${BFF_URL}/items/${params.id}`, { method: 'DELETE' });
            //   if (!res.ok) throw new Error(...);
            // }

            // axiosClient版（repository層用）
            export async function deleteItem(params: { id: string }): Promise<void> {
              await axiosClient.delete(`/items/${encodeURIComponent(params.id)}`);
            }

            // Hook版（コンポーネント用）
            export const useDeleteItem = () => {
              return useMutation({ mutationFn: deleteItem });
            };
            ```

## Phase 3: BFF Client 層

- [ ] S3-1: `*.clients.ts` 実装 — axios で BE エンドポイントを呼び出す
          ※ BFF 層にモックデータを置かない。BE がモック中でも axios.get/post で BE を呼ぶ実装にする

## Phase 4: BFF Service 層

- [ ] S4-1: `*.services.ts` 実装 — Client 呼び出し・データ整形・ViewModel マッピング
          ※ HTTP レスポンス操作（status / header 設定）は Service に書かない
- [ ] S4-2: 変換ロジックの単体テスト（`*.services.test.ts`）

## Phase 5: BFF Controller 層

- [ ] S5-1: `*.controllers.ts` 実装 — エンドポイント定義・共通ヘッダー受け取り・Service 呼び出し
          ※ 全エンドポイントに X-Tenant-Id / X-Correlation-ID / Authorization の @Headers() を宣言する
          ※ フロントエンドの axiosClient.ts から送られるヘッダーを受け取る
- [ ] S5-2: Controller 統合テスト（`*.controllers.test.ts`）

## Phase 6: Module 登録

- [ ] S6-1: `*.module.ts` 作成 — Controller / Service / Client を NestJS モジュールに登録
- [ ] S6-2: `app.module.ts` へのインポート確認

## Phase 7: FE API 層・Repository 層

- [ ] S7-1: `api/*.api.ts` 実装 — BFF エンドポイント呼び出し（axiosClient 使用）
          ※ 全 API 関数は `frontend/.../LV2/api/` 配下に配置する
          ※ React Query + axiosClient パターンを使用する（参考: `product/frontend/src/shared/sample/api/useBloodTypeMaster.ts`）
- [ ] S7-2: `repository/*.repository.ts` 実装 — 並列呼び出し・保存処理
- [ ] S7-3: API 層の単体テスト（MSW でモック）

## Phase 8: 整合性チェック

- [ ] S8-1: 型の整合性（`front_bff_shared/` の型が BFF の `*.type.ts` と構造一致）
- [ ] S8-2: エラーコードの整合性（BFF が返すエラーコードが一覧に登録済み）
- [ ] S8-3: エンドポイントカバレッジ（設計書の API 一覧と実装が全て対応）

## Phase 9: 基盤要素実装（infrastructure_scope により必須/任意が決まる）

**infrastructure_scope: none の場合**: Phase 9 全タスクスキップ可  
**infrastructure_scope: auth の場合**: S9-1 + S9-2 必須、他は任意  
**infrastructure_scope: realtime の場合**: S9-3 必須、他は任意  
**infrastructure_scope: all の場合**: Phase 9 全タスク必須

- [ ] S9-1: 認証・セッション管理（JWT検証・AuthGuard・authStore・Cookie管理）
          ※ LV3機能単位の通信に含まれない全プロジェクト共通の認証基盤
- [ ] S9-2: ミドルウェア層（security.middleware / decryption.middleware / RequestContext）
          ※ 全エンドポイント共通の前処理・後処理
- [ ] S9-3: リアルタイム通知（NotificationGateway / useNotification / notification.store）
          ※ Socket.io による WebSocket 通信基盤
- [ ] S9-4: i18n リソース管理（front_bff_shared/i18n/ の labels / validation / errors）
          ※ 全機能で共有するメッセージリソース
- [ ] S9-5: 監査ログ（auditLogClient.ts 実装・送信タイミング確認）
          ※ 全操作イベントの監査ログ送信基盤
- [ ] S9-6: Store ライフサイクル管理（storeRegistry.ts / tenantStore.ts 実装）
          ※ 全 Store の初期化・破棄を一括管理
```

tasklist 完成後、`state.md` を以下の内容で更新して**このセッションを終了する**:

```yaml
feature: "{domain}/Fxx_機能名"
phase: synchronizer
progress: "sync準備完了。次は SY1-1（BE 型定義）から"
last_updated: "YYYY-MM-DD"
infrastructure_scope: "none"  # none | auth | realtime | all（SY9の実装範囲を明示）
```

**`infrastructure_scope` の判断基準**:

| 値 | 意味 | SY9 の対象 |
|---|---|---|
| `none` | 機能固有の通信のみ（認証・通知不要） | SY9 スキップ可 |
| `auth` | 認証必須（ログイン後の操作） | SY9-1（認証）+ SY9-2（ミドルウェア）必須 |
| `realtime` | リアルタイム通知必須 | SY9-3（通知）必須 |
| `all` | 認証・通知・監査ログ全て必須 | SY9 全タスク必須 |

初回の機能では `all` を推奨（基盤を一度実装すれば、2回目以降は再利用のみ）。

---

## 継続の場合（phase: synchronizer）

- `.steering/sync-{対象}/state.md` を読む
- `.steering/sync-{対象}/sync-tasklist.md` を読む
- 先頭の未完了タスク `[ ]` から再開する

---

## 実装ループ

1. `sync-tasklist.md` から先頭の未完了タスク `[ ]` を1つ取得する
2. そのタスクを実装する [メインエージェント: 実装]
3. 完了したら `[ ]` → `[x]` に更新する
4. **現在の Phase の全タスクが `[x]` になったら state.md を更新してから次の Phase へ進む**
5. 1に戻る

### ルール

- **Phase 単位で完了を記録する** — 現在の Phase の全タスクが `[x]` になるまで次の Phase に進んではいけない
- **各 Phase 完了時に必ず `state.md` の `completed_phases` に記録してから次へ進む**
- 技術的に不要になったタスクは `[x] ~~タスク名~~ (理由: ...)` で記録する
- 型定義の不整合を発見したら `viewmodel-mapping.md` を更新してから修正する
- `.claude/rules/cross-layer-rules.md` の禁止事項に違反していないか常に確認する

### Phase 完了時の state.md 記録

Phase の全タスクが `[x]` になったら **即座に** `state.md` を更新する:

```yaml
feature: "{domain}/Fxx_機能名"
phase: synchronizer
progress: "Phase 4 完了。次は Phase 5（S5-1: BFF Controller 実装）から"
last_updated: "YYYY-MM-DD"
infrastructure_scope: "all"  # none | auth | realtime | all
completed_phases:
  - "Phase 0: 準備 ✅ YYYY-MM-DD"
  - "Phase 1: 型定義（FE / BFF） ✅ YYYY-MM-DD"
  - "Phase 2: フロントエンド API 層実装 ✅ YYYY-MM-DD"
  - "Phase 3: BFF Client 層 ✅ YYYY-MM-DD"
  - "Phase 4: BFF Service 層 ✅ YYYY-MM-DD"
```

---

## 実装フェーズの完了

### ステップ1: 完了確認 [メインエージェント: 判断]
- sync-tasklist.md の全タスクが `[x]` であることを確認する
- テスト・lint・型チェックが通ることを確認する

### ステップ2: 整合性チェック [メインエージェント: 実装]

`.claude/rules/cross-layer-rules.md` の「整合性チェックルール」に従って以下を確認する:

1. **型の整合性**:
   - [ ] `front_bff_shared/` の型が BFF の `*.type.ts` と構造一致しているか
   - [ ] フロントエンドの ViewModel 型が BFF レスポンス型の部分集合になっているか
   - [ ] Zod スキーマの型推論（`z.infer<typeof schema>`）と TypeScript 型定義が乖離していないか

2. **エラーコードの整合性**:
   - [ ] BFF が返すエラーコード（`E-xxxx`）が `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/05_エラー方針.md` の一覧に登録済みか
   - [ ] フロントエンドのエラーハンドラーが、登録済みのエラーコードのみをハンドリングしているか

3. **エンドポイントカバレッジ**:
   - [ ] 設計書の `## 呼び出しAPI一覧` と実装が全て対応しているか
   - [ ] BFF の Controller エンドポイント数 = FE の api/ 関数数 = 設計書の API 数

### ステップ3: アーキテクチャ図生成（オプション）

SY8 完了後、機能の完全なデータフローを可視化するため、高解像度アーキテクチャ図を生成する。

**生成手順**:

1. Graphviz (dot) ファイルを作成する（`/tmp/{機能ID}-architecture.dot`）
2. 以下の要素を含める:
   - Layout 層（Root Layout / Route Group Layout / Header / Sidemenu）
   - Page 層（Server Component / Props 渡し）
   - Feature 層（Organism / Molecule / Hooks / Store / Repository / API）
   - shared/（ErrorBoundary / axiosClient）
   - front_bff_shared/（types / schemas）
   - BFF 層（Controller / Service / Client / shared/filters / shared/utils）
   - Backend 層（Controller / Service / Shared/ErrorHandling / Shared/Validation / Database）
   - データフロー（矢印）
   - エラーフロー（赤点線）
3. Graphviz で PNG 生成:
   ```bash
   dot -Tpng /tmp/{機能ID}-architecture.dot -o .omc/plans/{機能ID}-full-architecture-hq.png
   ```
4. 対応表ドキュメント作成（`.omc/plans/{機能ID}-architecture-mapping.md`）:
   - synchronizer.md の各フェーズ（SY1〜SY8）と図の対応箇所
   - cross-layer-rules.md の禁止事項との対応
   - データフローの完全な経路

**Graphviz 設定**:
```dot
digraph {機能ID}_Architecture {
    graph [rankdir=LR, bgcolor=transparent, dpi=300, fontname="Arial", splines=polyline];
    node [shape=box, style="rounded,filled", fontname="Arial", fontsize=10];
    edge [fontname="Arial", fontsize=9];
    
    // サブグラフでレイヤーをグループ化
    // fillcolor で色分け（Layout: #e1f5ff, Page: #fff9c4, Feature: #f3e5f5, etc.）
    // エラーフローは [style=dashed, color=red]
}
```

**参考**: `.omc/plans/res002-full-architecture-hq.png` / `.omc/plans/res002-architecture-mapping.md`

### ステップ4: 完了報告

整合性チェック結果を添えて state.md を更新し、次のステップを 1 行で案内して応答を終了する。
（例: 「3層同期完了。整合性 OK。アーキテクチャ図生成完了。次は `/implement` の Phase 4（Hook 層）を実行してください。」）

---

## セッション終了時（毎回やること）

1. `session-log.md` にエントリを追記する（Skill('steering') のフォーマットに従う）
2. `.steering/sync-{対象}/state.md` の `progress` / `last_updated` を更新する

例:
```yaml
feature: "{domain}/Fxx_機能名"
phase: synchronizer
progress: "SY5 完了。sync-tasklist 7/8完了。次は SY6-1（Module 登録）から"
last_updated: "YYYY-MM-DD"
completed_phases:
  - "Phase 1: 型定義（FE / BFF / BE） ✅ YYYY-MM-DD"
  - "Phase 1.5: 依存マスタ実装（test-item-master） ✅ YYYY-MM-DD"
  - "Phase 2: BE Controller モック実装 ✅ YYYY-MM-DD"
  - "Phase 3: BFF Client 層 ✅ YYYY-MM-DD"
  - "Phase 4: BFF Service 層 ✅ YYYY-MM-DD"
  - "Phase 5: BFF Controller 層 ✅ YYYY-MM-DD"
```

---

## 参照設計書

| タスク | 参照ファイル | 見出し |
|--------|------------|--------|
| **Phase 0** 準備 | `.steering/sync-{対象}/` | `db-structure-summary.md` / `api-analysis.md` / `viewmodel-mapping.md` |
| | `.steering/sync-{対象}/db-structure-summary.md` | 機能関連テーブル詳細（テーブル名・論理名・説明・主キー・格納データ・FK依存関係） |
| **S1-1〜S1-5** Phase 1 型定義 | `Skill('synchronizer-phase1')` | 型の役割分担・配置ルール・移設方法 |
| | `{design_detail}` | `## 呼び出しAPI一覧` |
| | `.claude/rules/cross-layer-rules.md` | `## 禁止事項` > `### 型安全性` |
| **M1-1〜M1-5** Phase 1.5 依存マスタ実装 | `.steering/sync-{対象}/api-analysis.md` | `## 依存する共通マスタ一覧` |
| | `product/bff/src/shared/master/test-item-master/` | 実装例（既存マスタの構造を参考にする） |
| | `.claude/rules/cross-layer-rules.md` | `## 禁止事項` > `### BE モック実装` |
| **S2-1〜S2-3** Phase 2 BE Controller モック | `{design_detail}` | `## 呼び出しAPI一覧` |
| | `.claude/rules/cross-layer-rules.md` | `## 禁止事項` > `### 型安全性` |
| **S3-1** BFF Client 層 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/10.BFF設計.md` | `## レイヤーの責務定義` > `### Client 層` |
| | `.claude/rules/cross-layer-rules.md` | `## 禁止事項` > `### BE モック実装` |
| **S4-1〜S4-2** BFF Service 層 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/10.BFF設計.md` | `## レイヤーの責務定義` > `### Service 層` |
| | `.claude/rules/cross-layer-rules.md` | `## 禁止事項` > `### 層の責務` |
| **S5-1〜S5-2** BFF Controller 層 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/10.BFF設計.md` | `## レイヤーの責務定義` > `### Controller 層` |
| **S6-1〜S6-2** Module 登録 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/00.ディレクトリ構成.md` | `### BFF` > `(機能名).module.ts` |
| **S7-1〜S7-3** Phase 7 FE API・Repository | `.claude/commands/implement.md` | `## 標準フェーズ構成` > `Phase 2` |
| | `product/frontend/src/shared/sample/api/useBloodTypeMaster.ts` | React Query + axiosClient パターン実装例 |
| **S8-1〜S8-3** 整合性チェック | `.claude/rules/cross-layer-rules.md` | `## 整合性チェックルール` |
| **S9-1** 認証・セッション管理 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/07.認証とセキュリティ.md` | `## JWT検証フロー` / `## AuthGuard実装` |
| **S9-2** ミドルウェア層 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/10.BFF設計.md` | `## ミドルウェア層の実装` |
| **S9-3** リアルタイム通知 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/08.リアルタイム通信.md` | `## Socket.io実装` |
| **S9-4** i18n リソース管理 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/03.TypeScript型管理とスキーマ共有.md` | `## 多言語対応（i18n）リソースの共有` |
| **S9-5** 監査ログ | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/09.監視・エラーハンドリング.md` | `## 監査ログ送信` |
| **S9-6** Store ライフサイクル管理 | `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/04.状態管理設計.md` | `## storeRegistry実装` |

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`
