# 設計レビュー指摘分析ログ

> 設計レビュー（spec-reviewer）が PASS した際に、再発防止の観点で有用な知見を追記する。  
> 次の設計書を書く前にこのファイルを参照し、過去の指摘パターンをチェックリストとして使う。

---

## 追記フロー

1. spec-reviewer が **PASS** したタイミングで追記する（FE / BFF / BE いずれのレイヤーでも）
2. 形式: `## {機能ID} {機能名}（{レイヤー}）` のセクションを末尾に追加
   - レイヤー: `フロントエンド` / `BFF` / `バックエンド`
3. 書く内容: 「高頻度・再発しやすい指摘パターン」のみ。typo 個別事例は不要
4. 次の設計書作成前に本ファイルを読み、「再発防止チェック」列を自己点検する

---

## 再発防止チェック一覧（累積）

> 全セクションから抽出した「次の設計書で必ず確認する」項目。

| # | カテゴリ | チェック項目 | 初出 |
|---|---------|------------|------|
| C01 | 複数テーブル整合 | 同一UI要素が表示項目テーブル・入力制御テーブル・状態変数一覧の複数箇所に現れる場合、すべての記述が一致しているか | F01 |
| C02 | モード制御 | 参照モード制御で「全入力フィールドを読み取り専用」と書くだけでなく、個別ボタン（BTN_CONFIRM等）の活性/非活性を明示したか | F01 |
| C03 | 状態変数との記法統一 | 表示条件・表示制御の記述に `lockInfo[].lockBy='SELF'` のような直接値を使わず、定義済み状態変数名（`isEditable=true`）で統一したか | F01 |
| C04 | エラーフロー網羅 | エラー表示設計テーブルに定義したエラーコード（E003・E007等）が、対応するボタン押下フローの「失敗」分岐にも個別記載されているか | F01 |
| C05 | コンポーネント種別統一 | UI項目IDのプレフィックス（RDO/TXT/BTN等）・フォーマット列・備考列のコンポーネント種別が一致しているか | F01 |
| C06 | BFF/BE責務の先行定義 | フロントエンド設計書を書く前に、BFF が返すフィールド名・型・判定ロジック（reasonRequired・lockInfo等）を確定させたか | F01 |
| C07 | 必須フィールドのバリデーション | 必須（required）の入力フィールドについて、未入力時の動作（非活性・エラー表示）が定義されているか | F01 |
| C08 | 画面遷移の記述完全性 | 遷移元だけでなく遷移先（または「画面クローズ」）も明記したか | F01 |
| C09 | 監査ログとアクションIDの対応 | 監査ログ対象「○」のボタン/イベントすべてに、アクションIDと発火元（別画面の場合はその旨）が対応しているか | F01 |
| C10 | モック実装時の共通ヘッダー宣言 | バックエンドモック実装であっても、共通設計書が定める全エンドポイント必須ヘッダー（X-Tenant-Id・X-Correlation-ID 等）を `[FromHeader]` で宣言しているか | F01 BE |
| C11 | モック実装時のリクエスト型定義 | ボディありの POST エンドポイントは、モック実装時もリクエスト型（`[FromBody]` バインディング対象）を定義しているか | F01 BE |
| C12 | エラーコードの複数文書間整合 | 機能設計書・詳細設計書・エラー表示設計テーブルの3箇所でエラーコード番号・意味・適用条件が一致しているか | F01 BFF |
| C13 | BFF↔FEエラー対応の完全性 | BFFが返す全エラーコード（VALIDATION_FORMAT等）に対し、FEのエラー表示設計テーブルに対応エントリが存在するか | F01 BFF |
| C14 | BFF全エンドポイントの認可・タイムアウト網羅 | 全エンドポイントに 403 FORBIDDEN・504 TIMEOUT が定義されており、他エンドポイントとの非対称がないか | F01 BFF |
| C15 | BFFレスポンス→FE内部型のマッピング全件確認 | BFF レスポンス型のフィールドが FE 内部型に正しくマッピングされているか。特に命名が異なるフィールド（`isUserAdded`→`isAddedItem` 等）を必ず対応表で確認したか | F01 FE |
| C16 | 共通サービスのシグネチャ事前確認 | hook や mutation を実装する前に、呼び出す共通サービスの関数シグネチャ（引数の数・型・順序）を Read で確認したか | F01 FE |
| C17 | 表示条件 vs 活性/非活性の列誤用 | `isEditable=true` を「表示条件」列に書くと「偽=非表示」と解釈される。モード状態変数は「活性/非活性」列か「参照モード制御」セクションで定義し、表示条件列は「常時表示」以外の場合のみ使うこと | F01 BFF再 |
| C18 | API失敗フローの認可エラー記述 | エラー表示設計テーブルにE004(401)/E005(403)を定義しても、ボタン押下フローの「失敗」分岐に個別記載がないと実装者が判断できない。C04と同様に失敗分岐でも必ず対応コードを列挙すること | F01 BFF再 |
| C19 | AlertDialogのclose経路分離 | `onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}` はActionボタン（"はい"）クリック時にも `onCancel` を発火させる。confirm/cancelの2経路があるダイアログはonOpenChangeを使わず、各ボタンのonClickで明示的に呼び分けること | F01 FE実装 |
| C20 | APIエラーレスポンスのコード別処理 | APIサービス層で `res.ok` でない場合に `res.json()` を読んで `code` フィールドを取得し、設計書で規定されたエラーコード（E003〜E999）ごとの分岐処理を実装したか。`throw new Error(status)` のみでは設計書のエラー表示仕様が動作しない | F01 FE横断 |
| C21 | ヘッダー引数の全レイヤー伝達確認 | controller にヘッダー引数を追加した際は、同一のヘッダーを必要とする全エンドポイントで controller→service→client の全経路に引数が渡されているか grep で一括確認したか | F01 BFF修正後 |
| C22 | catch ブロックのエラー通知漏れ | catch ブロックで状態回復（ボタン再活性化等）を実装した際に、`setErrorMessage` 等のユーザー通知処理も合わせて実装したか。回復処理と通知処理は常にセットで実装すること | F01 FE修正後 |
| C23 | テーブルのヘッダ列とデータ行セルの対称制御 | 条件付き列（`hasTestDate` 等）を持つテーブルで、ヘッダの列表示条件とデータ行のセル表示条件を同一の基準（親から `showXxx` prop を渡す等）で制御し、列数不整合が起きない実装にしたか | F01 FE修正後 |
| C24 | specの期待値と実装の実際の返却値の照合 | 異常系テストを書く際に、実装の `catch` ブロックが実際に返すステータスコード・エラーコードを確認してから期待値を記述したか。実装後に spec を書く際は特に注意すること | F01 BFF修正後 |
| C25 | サービス層間 HttpException パススルー条件の全列挙 | 上位サービスが下位サービスの HttpException をパススルーする catch 条件を定義する際に、下位サービスが返しうる全ステータス（UNAUTHORIZED/FORBIDDEN/INTERNAL_SERVER_ERROR 等）を Read で確認してから列挙したか。最初に追加したステータスのみ列挙すると変換漏れが発生する | F01 BFF最終 |
| C26 | テスト mock 例外型とエラー分岐の一致 | `axios.isAxiosError` 等の型判定でエラーを分岐している hook のテストで、mock 例外に `new AxiosError` ではなく通常 `new Error` を使っていないか確認したか。`new Error` では `isAxiosError` が false になり意図した分岐に到達しない | ORD023 2026-05-11 |
| C27 | hooks 関数の useCallback 必須 | hooks/ の全関数に `useCallback` を付与しているか。Organism 内インライン arrow も `useCallback` で安定化しているか | ORD023 3回目 |
| C28 | hooks 関数の Organism 接続確認 | hooks/ に定義した全関数が Organism の Props/onClick に実際に渡されているか grep で確認したか。未接続関数は機能が「あるように見えて動かない」状態になる | ORD023 3回目 |
| C29 | BE 全エンドポイントの [FromHeader] 統一 | 新エンドポイントを追加した後、コントローラー内の**全メソッド**に X-Tenant-Id / X-Correlation-Id / Authorization の3ヘッダーが揃っているか確認したか。1メソッドだけ追加して他を忘れるパターンに注意 | ORD023 4回目 |
| C30 | ヘッダーキー表記の大文字小文字統一 | HTTP ヘッダーキーは RFC 7230 で case-insensitive だが、実装上は表記を統一すること。BFF clients.ts で `X-Correlation-Id` と `X-Correlation-ID` が混在しないよう grep で全件確認したか | ORD023 4回目 |
| C31 | コールバック引数値の検証欠落 | `toHaveBeenCalledOnce()` のみ確認してコールバックに渡した引数値を `toHaveBeenCalledWith(...)` で検証していないテストがないか確認したか。引数型が通ってもフィールド値が誤っているバグを見逃す | ORD023 追加修正後 |
| C32 | `_` プレフィックス @Headers() の非伝達 | `@Headers()` 引数に `_` プレフィックスを付けた場合、「意図的に未使用」になっていないか確認したか。ヘッダーは controller→service→client の全レイヤーに引数として渡し、axios の `config.headers` に設定すること（C21 特殊ケース） | ORD076 BFF |
| C43 | モックコントローラー共有ストアのスレッドセーフ | `static` フィールドで状態を共有するモックコントローラーでは `ConcurrentDictionary<TKey, TValue>` を使い `TryAdd` / `TryRemove` で操作すること。`List<T>` + `Any` + `Add` の組み合わせは TOCTOU バグを内包する | ORD076-DEP002 BE |
| C44 | モックコントローラー間クロス依存の回避 | 別 Feature のモックコントローラーのクラス名を直接参照しない。中間の静的クラス（`MockStores.cs` 等）を作り間接参照にすること | ORD076-DEP002 BE |
| C45 | `_orderStore` プレースホルダーの `OrderType` 確認 | FE から送られる orderIds の多くは BE ストアに存在せずプレースホルダー（`OrderType: "UNKNOWN"` 等）になる。後続のフィルタ条件が `"UNKNOWN"` を排除しないよう、プレースホルダー生成時に正確な `OrderType` を設定するか、フィルタ条件に `"UNKNOWN"` を含めること | ORD076-DEP002 BE |

---

## F01 RES002-result-input（検査結果入力）フロントエンド

### 基本情報

| 項目 | 内容 |
|------|------|
| 機能 | 検査結果入力画面（フロントエンド詳細設計書） |
| レビュー種別 | spec-reviewer（設計書品質レビュー） |
| レビュー回数 | 5回（初回 FAIL → 修正 → FAIL × 3 → PASS） |
| 設計書 | `docs/01_アプリ/フロントエンド/検査結果管理/結果入力/design_detail-RES002_結果入力.md` |

### 指摘サマリー

| 重要度 | 件数 | 主な内容 |
|--------|:----:|---------|
| High | 8 | typo・複数テーブル間の不整合・モード制御定義漏れ |
| Medium | 7 | コンポーネント種別矛盾・エラーフロー不完全・状態変数記法不統一 |
| Low | 9 | typo・文章重複・遷移先記載漏れ・監査対象の定義不整合 |
| 却下 | 5 | BFF/BE責務の移管済み項目・エラーコード体系の意図的設計 |

### 主要指摘パターンと根本原因

**パターン1: 複数テーブル間の記述不一致（High × 2、Medium × 2）**

- BTN_EDIT_REASON_CONFIRM の活性/非活性が表示項目テーブルと入力制御テーブルで食い違い
- BDG_EDIT/BDG_REF の表示条件が状態変数名でなく直接値で記述され、状態変数一覧と乖離
- 根本原因: 同じUI要素を複数テーブルに書く際に「片方を直した後にもう片方を忘れる」

**パターン2: モード制御の影響範囲の抜け（High × 1、Medium × 1）**

- 参照モードで「編集項目は読み取り専用」とあっても、BTN_CONFIRM の非活性が未定義
- EVT_UI_01 で追加した行の入力フィールドが参照モード制御の対象であることが未明示
- 根本原因: モード制御セクションで「全体方針」を書いた後に個別UI要素への適用確認が漏れる

**パターン3: エラーフローとエラー表示設計テーブルの分離（Medium × 1）**

- エラー表示設計テーブルに E003・E007 を定義したが、確定ボタン押下フローの「失敗」分岐に記載なし
- 根本原因: 「エラー表示設計は別セクションにある」と思い込み、フロー内の記述を省略

**パターン4: BFF/BE責務の未確定による設計書ブロック（High × 1、却下 × 3）**

- lockInfo 構造・reasonRequired 判定ロジックがフロントエンド設計書に書かれたまま
- 確定後に「BFF設計書へ移管」として解決したが、設計書作成前に3層の責務を確定すれば防げた
- 根本原因: フロントエンド設計書から書き始め、BFF/BE の I/F が後から確定した

**パターン5: typo の多発（High × 2、Low × 5）**

- `検査結果参照参照タブ`・`hastestDate`・`バッチ`（→バッジ）・`[確編集理由確定]`・`を参照を実行する` 等
- 根本原因: テーブル行のコピー時や長い文字列の入力時に見落としが発生

### 再発防止チェック（本機能で追加）

→ 累積チェック一覧 C01〜C09 として上部に転記済み。

---

## ETC001/ETC002/ETC005 メニュー・共通ヘッダー（フロントエンド）

### 基本情報

| 項目 | 内容 |
|------|------|
| 機能 | ログイン画面（ETC001）・メニュー画面（ETC002）・右サイドメニュー（ETC005） |
| レビュー種別 | impl-validator + impl-reviewer + consistency-checker（実装レビュー） |
| 設計書 | `docs/01_アプリ/個別機能設計書_メニュー・共通ヘッダー.md` |

### 指摘サマリー

| 重要度 | 件数 | 主な内容 |
|--------|:----:|---------|
| High | 9 | hooks未接続・`"use client"`欠落・パスalias誤記述・const配列ミューテーション・二重ディレクトリ・INDEX.md未登録・App Routerページ未作成・設計書内容混入 |
| Medium | 6 | 層の責務違反（api直接呼び出し）・guard clause二重記述・未使用インポート・テストアサーション欠如・コンポーネント命名逆転・ETC002テスト未作成 |

### 主要指摘パターンと根本原因

**パターン1: 実装済み hooks が Feature コンポーネントに未接続（High）**
- `use-login.ts` が完成しているにも関わらず `ETC001.tsx` の `handleLogin` はモック実装のまま
- 根本原因: Phase4（Hook層）と Phase5（コンポーネント層）の接続確認が実装完了時に行われていない

**パターン2: `"use client"` 欠落の再発（High）**
- 親コンポーネントとは別ファイルに分割された Dialog・Panel に `"use client"` が付与されない
- 根本原因: カテゴリ8として既知だが、新機能実装のたびに再発している

**パターン3: path alias の誤用（High）**
- `../../../../../../@/shared/...` という相対パス+alias混在パターン
- 根本原因: alias → 相対パスへ変換する際に `@/` プレフィックスを残してしまう

**パターン4: メタデータ（INDEX.md）更新漏れ（High）**
- ETC002・ETC005 が INDEX.md に未登録のまま実装が進行
- 根本原因: 実装開始時のスコープ宣言で INDEX.md へのエントリ追加を行っていない

**パターン5: 設計書内容の混入（High）**
- `個別機能設計書_メニュー・共通ヘッダー.md` の ETC002 セクションに ORD032 のデータが混入
- 根本原因: Excel→Markdown変換時のシート取り違え

### 第3回レビューで追加判明したパターン

**パターン6: 全サブコンポーネントへの `"use client"` 確認漏れ（High）**
- 直接レビュー指定したファイルは修正済みでも、同一 Feature 内の他コンポーネント（DashboardSection・TemporarySaveSection）に `"use client"` が欠落
- 根本原因: レビュー対象を明示したファイルリストのみ確認し、ディレクトリ全体を走査していない

**パターン7: 暫定実装・未接続ダイアログへの TODO コメント欠落（Medium）**
- `PasswordExpiredDialog` のトリガーが未接続、ICカードスキャン後の処理が暫定実装のまま TODO なし
- 根本原因: 「スコープ外だから実装しない」という判断を TODO コメントに明示しない

**パターン8: `setTimeout` のクリーンアップ漏れ（Medium）**
- イベントハンドラ内の `setTimeout` がアンマウント後に発火するリスク
- 根本原因: `useEffect` 外での非同期処理のライフサイクル管理が見落とされやすい

### 再発防止チェック（累積一覧に追加）

| # | カテゴリ | チェック項目 | 初出 |
|---|---------|------------|------|
| C10 | hooks接続確認 | Feature コンポーネント実装後に `hooks/` ディレクトリを照合し、未接続の hook がないか確認したか | ETC001 |
| C11 | INDEX.md登録 | 実装開始前に INDEX.md に機能エントリ（ID・ステータス・依存関係）を追加したか | ETC002/ETC005 |
| C12 | App Routerページ | Feature コンポーネントに対応する `app/.../page.tsx` が存在し、実際に画面到達可能な状態か確認したか | ETC005 |
| C13 | ディレクトリ全体の `"use client"` | Feature 配下の全 `.tsx` ファイルに `grep -rL '"use client"'` を実行し、Client API 使用ファイルの欠落を確認したか | ETC002（第3回） |
| C14 | 暫定実装の TODO 明示 | スコープ外・未接続の実装には `// TODO:` コメントで理由と将来対応方針を明記したか | ETC001（第3回） |
| C15 | Organism の api/ 直接呼び出し禁止 | Organism・Molecule が `api/` 関数を直接 import していないか確認したか（`hooks/` 経由のみ許可） | ORD023 |
| C16 | unsafe cast の禁止 | `as T`・`as unknown as T` の二重キャストを使っていないか確認したか。型ガード関数またはマッピング関数で narrowing すること | ORD023 |

---

## ORD023 検体検査オーダー（フロントエンド・BFF）

### 基本情報

| 項目 | 内容 |
|------|------|
| 機能 | 検体検査オーダー（ORD023） |
| レビュー種別 | impl-validator + impl-reviewer + consistency-checker（実装レビュー） |
| 結果 | FAIL（高 4件）→ 修正 → FAIL（高 4件）→ 修正 → PASS（2026-05-07）→ FAIL（高 5件）→ 修正 → FAIL（高 2件）→ 修正 → PASS（2026-05-11） |

### 指摘サマリー

| 重要度 | 件数 | 主な内容 |
|--------|:----:|---------|
| High | 4 | Organism の api/ 直接呼び出し・BFFテストの二重キャスト・FEの unsafe cast・MSW ハンドラーの型安全性違反 |
| Medium | 5 | 空 catch ブロック・hardcode confirmedBy・ConfirmButton の disabled 未設定・ConfirmButton 未使用 prop・Confirmed ストーリーの状態未反映 |

### 主要指摘パターンと根本原因

**パターン1: Organism が `api/` 関数を直接呼び出し（High）**
- `SpecimenContentPanel`（Organism）が `useEffect` 内で `getSpecimenSets` を直接 import・呼び出し
- cross-layer-rules: 「Organism からの `api/` 直接呼び出し禁止（`hooks/` 経由のみ）」に違反
- 根本原因: `hooks/` を経由せずに「手っ取り早く」データ取得した

**パターン2: 型安全を回避する `as` キャスト（High × 3）**
- BFF テストモックで `as unknown as SpecimenOrdersClient` 二重キャスト
- FE の `res.confirmedOrders as ConfirmedSpecimenOrder[]` 安全でないキャスト
- MSW POST ハンドラーで `as { items: ...; confirmedBy: string }` キャスト（型ガード未使用）
- 根本原因: 型エラーを「即時解消」するために `as` を使い、根本の型定義を修正しない習慣

**パターン3: BFF Client レスポンスキーと BE JSON キーの不一致（High × 2、二回目レビューで発見）**
- `fetchSpecimenHistory` が `response.data.items` でアクセス。BE は `history` を返す（実行時 `undefined`）
- `fetchSpecimenSets` が `response.data.sets` でアクセス。BE は `specimenSets` を返す（実行時 `undefined`）
- 根本原因: BFF Client 実装時に BE の C# PascalCase → camelCase 変換後のキー名を照合しなかった（Category 22 の再発）

**パターン4: FAIL 修正時に同一パターンの他ファイルへの適用漏れ（High）**
- `services.spec.ts` の `makeClient` を `Object.create` に修正したが、同一機能の `controllers.spec.ts` の `makeService` は `as unknown as T` のまま残った
- 根本原因: 修正対象を指摘されたファイルに限定し、同一パターンの全ファイルを grep で確認しなかった（Category 25）

**パターン5: BFF 全エンドポイントに共通ヘッダー（correlationId / tenantId / authHeader）が欠落（High・2026-05-11）**
- `SpecimenHistoryController`・`SpecimenSetsController`・`SpecimenItemsMasterController` の全メソッドで `@Headers()` 引数が未定義
- controller → service → client の全レイヤーでヘッダー伝達経路が未実装
- 根本原因: BFF 実装時に既存 feature（`test-results.controller.ts` 等）のパターンを参照せずゼロから実装した。カテゴリ 9/12 の再発

**パターン6: テスト mock 例外型と `isAxiosError` 分岐の不一致（High・2026-05-11）**
- エラー①テストで `new Error` を throw しているが `axios.isAxiosError` が false を返すため「エラー②」の分岐に到達する
- 根本原因: hook の分岐条件（`isAxiosError`）を確認せずにテストを書いた（カテゴリ 31 初出）

**パターン7: hooks 内の全関数への useCallback 欠落（High・2026-05-11）**
- `useSpecimenSections.ts` の `addSingleItem`・`removeItem`・`updateItem`・`clearItems` が全て `useCallback` なし
- Organism 内のインライン arrow（`onRemoveOrder`）も `useCallback` 未使用
- 根本原因: `useCallback` を「最適化オプション」として後回しにし、初期実装では付けない習慣

**パターン8: hooks の関数が UI に未接続（High・2026-05-11）**
- `addItem`・`addCheckedItems`・`removeGroup` が `useSpecimenSections.ts` に実装済みだが、どのコンポーネントからも呼ばれていない
- エラー③（重複追加防止）が実際には動作しない状態
- 根本原因: hooks を設計書ベースで実装したが、Organism への接続確認（C10）を行っていない

### 再発防止チェック（累積一覧に追加）

| # | カテゴリ | チェック項目 | 初出 |
|---|---------|------------|------|
| C17 | BFF Client キー照合 | BFF Client 実装後に、BE の C# フィールド名（PascalCase → camelCase 変換後）と `response.data.xxx` のキー名が一致しているか grep で照合したか | ORD023 |
| C18 | FAIL修正の漏れなし確認 | レビュー指摘を修正した後、同一パターン（二重キャスト・空 catch 等）が同一機能内の他ファイルにも残っていないか grep で確認したか | ORD023 |
| C19 | callback prop の戻り値型 | エラーメッセージを返す可能性がある callback prop を `void` にしていないか。`string \| undefined` 等の戻り値型を使い、呼び出し元で受け取ること | ORD023（再レビュー） |
| C20 | デッドコードファイルの削除/TODO明示 | 実装済みファイルがどこからも import されていないケースがないか確認したか。削除するか `// TODO:` コメントで接続予定を明示すること | ORD023（再レビュー） |
| C21 | テストの条件分岐アサーションスキップ | テストコードで `if (element)` により要素が見つからない場合にアサーションをスキップしていないか。`expect(element).toBeDefined()` を先に入れて必ずアサーションが実行されるようにすること | REC020 |
| C22 | hooks 関数の useCallback 必須 | hooks/ の全関数（addXxx・removeXxx・updateXxx・clearXxx 等）に `useCallback` を付与しているか。Organism 内インライン arrow も `useCallback` で安定化しているか | ORD023（3回目） |
| C23 | hooks 関数の Organism 接続確認 | hooks/ に定義した全関数が対応する Organism の Props または onClick に実際に渡されているか grep で確認したか。未接続の関数は機能が「あるように見えて動かない」状態になる | ORD023（3回目） |

---

## ORD076 オーダー確定（BFF）

### 基本情報

| 項目 | 内容 |
|------|------|
| 機能 | オーダー確定（ORD076） |
| レビュー種別 | impl-validator + impl-reviewer + consistency-checker（実装レビュー） |
| 結果 | FAIL（High 4件）→ 修正 → FAIL（High 6件）→ 修正 → PASS（2026-05-12） |

### 指摘サマリー（今回レビュー）

| 重要度 | 件数 | 主な内容 |
|--------|:----:|---------|
| High | 6 | BFF Client リクエストボディの snake_case 変換漏れ（2件）・BFF Client レスポンスキー不一致・services.test.ts モックデータ型フィールド名不一致・BE ResetOrders の共通ヘッダー未定義・front_bff_shared デッドコード型（4型） |
| Medium | 3 | getForms クエリ配列正規化のリスク・useOrderConfirmInit のサイレントフェイル・削除後リフレッシュ漏れ |

### 主要指摘パターンと根本原因

**パターン1: `@Headers()` アンダースコア変数のヘッダー未伝達（High × 3・C32 初出）**
- `order-confirmation.controllers.ts` 全7エンドポイントで `_tenantId`/`_correlationId`/`_authHeader` を宣言しているが service に一切渡していない
- `order-confirmation.services.ts` の全メソッドにヘッダー引数が存在しない
- `order-confirmation.clients.ts` の全 axios 呼び出しに `config.headers` が設定されていない
- 根本原因: `specimen-orders.clients.ts` の既存パターン（ヘッダー引数→axios headers）を確認せず新規ファイルをゼロから実装した。C21/C32 の再発

**パターン2: 型安全を回避する unsafe cast（High × 1）**
- `order-confirmation.type.ts` の `(typeMap[upstreamType] as OrderType)` で型チェックを回避
- `order-confirmation.services.ts` の `f.formType as MedicalFormType` も同様
- 根本原因: TypeScript の型エラーを `as` キャストで即時解消する習慣（C16 再発）

**パターン3: BFF Client リクエストボディのキーが BE の SnakeCaseLower ポリシーと不一致（High × 2・カテゴリ22追記）**
- `revokeOrder`: `{ revokedBy, reason }` を POST → BE は `revoked_by` を期待（デシリアライズ失敗）
- `outputForms`: `{ formIds }` を POST → BE は `form_ids` を期待（デシリアライズ失敗）
- さらに `outputForms` の **レスポンスキー** も `response.data.outputForms` でアクセスしているが BE は `output_forms` を返す
- 根本原因: BFF Client 実装時に BE の `Program.cs` の `PropertyNamingPolicy = SnakeCaseLower` を確認しなかった（C22 再発）

**パターン4: services.test.ts のモックデータが UpstreamOrder 型のフィールド名と全不一致（High × 1）**
- `UpstreamOrder` 型は snake_case（`order_id`・`order_type` 等）だが、テストモックは camelCase（`orderId`・`orderType` 等）
- `UpstreamMedicalForm` も同様（`formId`→`form_id` 等、7フィールド全不一致）
- 根本原因: テスト作成時に型定義ファイルを Read で確認せずに camelCase でモックを書いた（C29 再発）

**パターン5: BE の新規エンドポイントに共通ヘッダー [FromHeader] が未定義（High × 1・C29 再発）**
- `OrderConfirmationMockController.cs` の `ResetOrders` メソッドのみ X-Tenant-Id 等3ヘッダーが未定義
- 根本原因: 既存エンドポイントを確認せず新規メソッド追加時にヘッダー定義を省略した（C10/C29 再発）

---

## DEP002 検体検査指示（フロントエンド）

### 基本情報

| 項目 | 内容 |
|------|------|
| 機能 | 検体検査指示画面（DEP002） |
| レビュー種別 | impl-validator + impl-reviewer + consistency-checker（実装レビュー） |
| 結果 | FAIL（High 5件）→ 修正 → FAIL（High 2件）→ 修正 → FAIL（High 1件）→ 修正 → PASS（2026-05-12） |

### 指摘サマリー（累計）

| 重要度 | 件数 | 主な内容 |
|--------|:----:|---------|
| High | 5+2+1 | `"use client"` 未宣言・ThreePointCheck 結果ハードコード・`_shared` が部門固有 assets を直接 import・statusCompletion フィルター未実装・OrderType 末尾「ー」不一致（11箇所）・`onOpenChange` 二重クローズリスク・`handleStart` config 判定ロジック誤り |
| Medium | 8+3 | 生理検査ステータス仕様矛盾・console.log 残存・ダイアログ二重発火・OrderType union に `'汎用オーダー'` 欠落・SearchCriteria に `'透析'` SelectItem 欠落 |

### 主要指摘パターン

**パターン1: フィルタ条件の端-to-端実装漏れ（High・C33 初出）**
- `SearchCriteria` が `onSearch` コールバックに `statusCompletion` フィールドを渡しているが、`DeptInstructionScreen.handleFilterOrders` に該当条件分岐が存在しない
- 根本原因: UI コンポーネントと Organism ロジックを別 Phase で実装した際に、SearchCriteria の全フィールドを Organism 側で網羅しているか確認しなかった

**パターン2: `OrderType` リテラル型の末尾「ー」不一致（High・第2回）**
- `deptInstruction.viewmodel.ts` が `'処置オーダ'`/`'注射オーダ'`（末尾ー無し）と定義しているが、`OrderTable.tsx` の 11 箇所が `'処置オーダー'`/`'注射オーダー'`（末尾ー有り）のまま。`order.orderType` との比較が常に `false` になり対象ボタン全非表示になる実行時バグ
- 根本原因: 型定義ファイルを Read で確認せず、日常的な日本語表記（長音あり）でリテラルを書いた

**パターン3: `onOpenChange` 二重クローズリスク（High・第2回・カテゴリ11 再発）**
- `<Dialog open={open} onOpenChange={onClose}>` は確認完了ボタン押下→ストアが `false` → Dialog `open` が `false` になると `onOpenChange(false)` が発火して `onClose` が二重呼び出しされる
- 修正パターン: `onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}`

**パターン4: `config.threePointCheckStatuses` 判定ロジック誤り（High・第3回）**
- `config.threePointCheckStatuses.includes('開始済')` とハードコードしたため、`threePointCheckStatuses: ['受付済']` を指定した場合に3点チェックが常にスキップされた
- 修正: `config.threePointCheckStatuses.includes(order.status)` — **現在のオーダーステータス**で判定する

**パターン5: `OrderType` union に未登録の値をハードコード（Medium・第3回・カテゴリ37 初出）**
- `'汎用オーダー'` が `OrderType` union に定義されていないにもかかわらず、`OrderTable.tsx` / `SearchCriteria.tsx` でリテラルとして使用
- 修正: `OrderType` union に追加し、`ORDER_TYPE_STATUSES` にも対応エントリを追加する

### 再発防止チェック（累積一覧に追加）

| # | チェック項目 | 初出 |
|---|------------|------|
| C33 | SearchCriteria 等が `onSearch` に渡す全フィールドを列挙し、Organism の絞り込みロジックに全て実装されているか確認したか | DEP002 FE |
| C34 | `OrderType`・`OrderStatus` 等の共有 union 型のリテラルを使う箇所では、型定義ファイルを Read で確認してから文字列を書いたか（末尾「ー」の有無など） | DEP002 FE |
| C35 | コールバック prop 型が `() => void`（引数なし）の場合、内部の Form 状態（チェック値・入力値）が呼び出し元に伝達できないパターンを確認したか。3点チェック・結果入力等、状態を返す必要があるダイアログは `(data: T) => void` で定義すること | DEP002 FE |
| C36 | `config` オブジェクトの optional フィールド（`threePointCheckStatuses` 等）を条件判定に使う場合、`includes('ハードコード値')` ではなく `includes(order.status)` 等の動的値で判定しているか確認したか | DEP002 FE |
| C37 | OrderType union 等の共有型に含まれない値（`'汎用オーダー'` 等）を UI コンポーネントでハードコードしていないか。追加する場合は型定義・`ORDER_TYPE_STATUSES`・SelectItem の3箇所を同時に更新すること | DEP002 FE |
| C38 | BFF レスポンス型（snake_case）から FE ViewModel 型（camelCase）への mapper 関数を hook 内に実装したか。型定義だけ作って代入のみでは実行時に全フィールドが `undefined` になる | DEP009 FE |
| C39 | Zustand store の `reset()` をアンマウント時（`useEffect` cleanup）で呼んでいるか。グローバルシングルトン store は遷移後も状態が残存する | DEP009 FE |
| C40 | store アクション（`setXxx`）を実装した後、それを呼び出す UI 要素（checkbox / button 等）が JSX に実際に存在するか確認したか（store にあるが JSX に存在しないパターン） | DEP009 FE |
| C41 | callback prop（`onComplete` 等）が Organism の全コードパスで呼ばれているか確認したか。`onCancel` は呼ばれていても `onComplete` だけ呼ばれていないパターンに注意 | DEP009 FE |
| C42 | MSW テストモックのレスポンスキーが BFF の実際のレスポンス型（snake_case / camelCase）と一致しているか型定義ファイルを Read で確認したか | DEP009 FE |

---

## REC020 受診者一覧（フロントエンド）

### 基本情報

| 項目 | 内容 |
|------|------|
| 機能 | 受診者一覧画面（フィルタ・ソート・呼び出し・診察キャンセル） |
| レビュー種別 | impl-reviewer + consistency-checker（実装レビュー） |
| 結果 | FAIL（High 2件） |

### 指摘サマリー

| 重要度 | 件数 | 主な内容 |
|--------|:----:|---------|
| High | 2 | Organism の `api/` 直接呼び出し（hooks/ 未作成）・暫定実装の TODO コメント欠落 |
| Medium | 6 | コンポーネント内インライン定義・JST計算の render 毎実行・型定義漏れ・BFF API 未接続への TODO なし × 2・`setTimeout` クリーンアップ漏れ |
| Low | 3 | exhaustive check 未実装・テストアサーション条件分岐スキップ |

### 主要指摘パターンと根本原因

**パターン1: Organism が `hooks/` を持たず `api/` を直接呼び出し（High・C15 再発）**
- `ReceptionPatientListOrganism` が `getReceptionPatients` を直接 import。`hooks/` ディレクトリ自体が未作成
- 根本原因: C15 で記録済みだが、新機能実装のたびに「hooks は後で」と後回しにして再発

**パターン2: BFF 未接続処理への TODO コメント欠落（Medium・C14 再発）**
- `handleCallPatient`・`handleCancelConsultation` がローカル state のみ更新し、BFF API 呼び出しが未実装
- TODO コメントがなく意図が不明確（設計上の省略か実装漏れかが読み取れない）
- 根本原因: C14「暫定実装の TODO 明示」が浸透していない

**パターン3: テストアサーションを条件分岐でスキップ（Low・新規 C21）**
- `FilterBarExtra.test.tsx` で `if (allBtn) { expect(...) }` というパターン
- 要素が見つからない場合にテストが暗黙的にパスする（偽陽性）
- 根本原因: `getBy*` の代わりに `find()` + `if` で書いてしまう

---

## DEP009 患者取り違い防止チェック（フロントエンド）

### 基本情報

| 項目 | 内容 |
|------|------|
| 機能 | 患者取り違い防止チェック（3点チェック: 患者・物品・実施者バーコード照合） |
| レビュー種別 | impl-validator + impl-reviewer + consistency-checker（実装レビュー） |
| 結果 | FAIL（High 9件・Medium 6件） |

### 指摘サマリー

| 重要度 | 件数 | 主な内容 |
|--------|:----:|---------|
| High | 9 | BFF snake_case → ViewModel camelCase mapper 未実装・`onComplete` 未呼び出し・MSW モックキー名不一致・`CheckItem.tsx` デッドコード・`setPatientVisualConfirmed` の UI 接続欠落・store `reset()` 未呼び出し・`keypress` deprecated |
| Medium | 6 | store 全体一括 subscribe・型定義ファイルへの `"use client"` 不要付与・未使用 import・E001 エラー表示文字列の仕様乖離 |

### 主要指摘パターンと根本原因

**パターン1: BFF snake_case → ViewModel camelCase の mapper 欠落（High × 2・C38 初出）**
- `PostPatientIdCheckCompleteResponse`（`session_id`/`completed_at`/`recorded_at`）を `PatientIdCheckResult`（`sessionId`/`completedAt`/`recordedAt`）に変換する mapper が `usePatientIdCheckSubmit` に存在しない
- MSW テストモックも camelCase で書かれており、BFF の実際の snake_case 型と不一致
- 根本原因: ViewModel 型定義は camelCase で作成したが、BFF 型（snake_case）との変換処理を実装し忘れた

**パターン2: `onComplete` callback が全コードパスで未呼び出し（High・C41 初出）**
- `onCancel` は `AlertDialog` の「はい」ボタンで呼ばれているが、`onComplete` は `handleSubmit` のどのパスでも呼ばれない
- `router.back()` を直接呼んでおり、呼び出し元（`DEP009.tsx`）の `handleComplete` が実行されない
- 根本原因: submit 後の「成功コールバック」の接続確認を Phase 6 完了時に行っていない（C28 相当）

**パターン3: store アクションが実装済みだが JSX に呼び出し UI が存在しない（High・C40 初出）**
- `setPatientVisualConfirmed` が store に実装・`deriveChecked` の計算式にも含まれているが、患者セクションの JSX に対応するチェックボックスが存在しない
- 物品セクションには `setItemVisualChecked` を呼ぶチェックボックスが存在するため非対称な実装になっていた
- 根本原因: store 実装（Phase 3）とコンポーネント実装（Phase 5）の間で store アクションの対称性を確認していない

**パターン4: Zustand グローバル store の `reset()` 未呼び出し（High・C39 初出）**
- `reset()` が store に定義されているが `usePatientIdCheckInit` の useEffect cleanup で呼ばれていない
- ユーザーが画面を離れて再訪問すると前回のスキャン結果・確認状態が残存する
- 根本原因: Zustand store がグローバルシングルトンであるため、コンポーネントのアンマウット時にリセットが必要なことを見落とした

### 再発防止チェック（累積一覧 C38〜C42 として上部に転記済み）

---

## DEP009 患者取り違い防止チェック（BFF・バックエンド）

### 基本情報

| 項目 | 内容 |
|------|------|
| 機能 | 患者取り違い防止チェック BFF（NestJS）+ BE モック（ASP.NET） |
| レビュー種別 | impl-reviewer（実装レビュー） |
| 結果 | PASS（High 0件・Medium 4件） |

### 指摘サマリー

| 重要度 | 件数 | 主な内容 |
|--------|:----:|---------|
| High | 0 | — |
| Medium | 4 | BFF api.response.ts が re-export のみでマッピング不要を未明示・Zod 日時フィールドの形式バリデーション欠如（C6 再発）・`X-Correlation-Id` 表記不統一（C30 再発）・BE モックの TODO コメント欠落 |

### 主要指摘パターン

**パターン1: Zod 日時フィールドに `datetime()` バリデーション未適用（C6 再発）**
- `completed_at`・`timestamp` が `z.string().min(1)` のみで ISO 8601 形式チェックなし
- `z.string().datetime({ offset: true })` で形式を強制すること
- 根本原因: 日時フィールドのバリデーション要件を見落とし `min(1)` で妥協

**パターン2: re-export のみの BFF 内部型ファイルにマッピング不要の根拠コメントがない（Medium）**
- `patient-id-check.api.response.ts` が `front_bff_shared` の型を全 re-export するだけで、Service に mapper 関数が存在しない
- 「現状は Upstream 型と front_bff_shared 型が同一構造のためマッピング不要」を NOTE コメントで明示すること
- 根本原因: 設計判断（意図的なマッピング省略）が無言で実装され、将来の変更時に判断根拠が失われる

