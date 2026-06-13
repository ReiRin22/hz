# ビジュアルコンパニオンガイド

モックアップ、図、オプションを表示するためのブラウザベースの視覚的ブレインストーミングコンパニオン。

## 使用タイミング

セッションごとではなく、質問ごとに決定します。テスト: **ユーザーは読むよりも見ることでこれをよりよく理解できるか?**

**ブラウザを使用** — コンテンツ自体が視覚的な場合:

- **UI モックアップ** — ワイヤーフレーム、レイアウト、ナビゲーション構造、コンポーネント設計
- **アーキテクチャ図** — システムコンポーネント、データフロー、関係マップ
- **サイドバイサイドの視覚的比較** — 2つのレイアウト、2つのカラースキーム、2つの設計方向の比較
- **デザインの洗練** — 外観と感触、間隔、視覚的階層に関する質問
- **空間的関係** — ステートマシン、フローチャート、図としてレンダリングされたエンティティ関係

**ターミナルを使用** — コンテンツがテキストまたは表形式の場合:

- **要件とスコープの質問** — 「X とは何を意味するか?」、「どの機能がスコープ内か?」
- **概念的な A/B/C 選択** — 言葉で説明されたアプローチ間の選択
- **トレードオフリスト** — 長所/短所、比較表
- **技術的決定** — API 設計、データモデリング、アーキテクチャアプローチの選択
- **明確化質問** — 答えが言葉であるもの、視覚的な好みではないもの

UI トピック*に関する*質問が自動的に視覚的な質問になるわけではない。「どのようなウィザードが欲しいか?」は概念的 — ターミナルを使用。「これらのウィザードレイアウトのどれが正しいと感じるか?」は視覚的 — ブラウザを使用。

## 仕組み

サーバーはディレクトリで HTML ファイルを監視し、最新のものをブラウザに提供します。`screen_dir` に HTML コンテンツを書き込み、ユーザーはブラウザでそれを確認してオプションをクリックして選択できます。選択は `state_dir/events` に記録され、次のターンで読み取ります。

**コンテンツフラグメント vs 完全なドキュメント:** HTML ファイルが `<!DOCTYPE` または `<html` で始まる場合、サーバーはそのまま提供します（ヘルパースクリプトを注入するだけ）。それ以外の場合、サーバーは自動的にフレームテンプレートでコンテンツをラップします — ヘッダー、CSS テーマ、選択インジケーター、すべてのインタラクティブインフラストラクチャを追加します。**デフォルトでコンテンツフラグメントを記述します。** ページの完全な制御が必要な場合のみ、完全なドキュメントを記述します。

## セッションの開始

```bash
# 永続性を持つサーバーの起動（モックアップをプロジェクトに保存）
scripts/start-server.sh --project-dir /path/to/project

# 返答: {"type":"server-started","port":52341,"url":"http://localhost:52341",
#           "screen_dir":"/path/to/project/.superpowers/brainstorm/12345-1706000000/content",
#           "state_dir":"/path/to/project/.superpowers/brainstorm/12345-1706000000/state"}
```

レスポンスから `screen_dir` と `state_dir` を保存します。ユーザーに URL を開くように伝えます。

**接続情報の検索:** サーバーは起動 JSON を `$STATE_DIR/server-info` に書き込みます。サーバーをバックグラウンドで起動して stdout をキャプチャしなかった場合は、そのファイルを読んで URL とポートを取得します。`--project-dir` を使用する場合は、セッションディレクトリの `<project>/.superpowers/brainstorm/` を確認します。

**注意:** モックアップが `.superpowers/brainstorm/` に永続化され、サーバーの再起動後も存続するように、プロジェクトルートを `--project-dir` として渡します。それがない場合、ファイルは `/tmp` に行き、クリーンアップされます。`.superpowers/` がまだ `.gitignore` に追加されていない場合は、ユーザーに追加を促してください。

**プラットフォーム別のサーバー起動:**

**Claude Code (macOS / Linux):**
```bash
# デフォルトモードが機能 — スクリプト自体がサーバーをバックグラウンド化
scripts/start-server.sh --project-dir /path/to/project
```

**Claude Code (Windows):**
```bash
# Windows は自動検出してフォアグラウンドモードを使用し、ツール呼び出しをブロックします。
# サーバーが会話ターン間で存続するように、Bash ツール呼び出しで run_in_background: true を使用します。
scripts/start-server.sh --project-dir /path/to/project
```
Bash ツール経由でこれを呼び出す場合は、`run_in_background: true` を設定します。次に、次のターンで `$STATE_DIR/server-info` を読んで URL とポートを取得します。

**Codex:**
```bash
# Codex はバックグラウンドプロセスを刈り取ります。スクリプトは CODEX_CI を自動検出して
# フォアグラウンドモードに切り替えます。通常通り実行 — 追加フラグ不要。
scripts/start-server.sh --project-dir /path/to/project
```

**Gemini CLI:**
```bash
# --foreground を使用し、シェルツール呼び出しで is_background: true を設定して
# プロセスがターン間で存続するようにします
scripts/start-server.sh --project-dir /path/to/project --foreground
```

**他の環境:** サーバーは会話ターン間でバックグラウンドで実行し続ける必要があります。環境がデタッチされたプロセスを刈り取る場合は、`--foreground` を使用して、プラットフォームのバックグラウンド実行メカニズムでコマンドを起動します。

URL がブラウザから到達できない場合（リモート/コンテナ化されたセットアップでは一般的）、ループバックではないホストをバインドします:

```bash
scripts/start-server.sh \
  --project-dir /path/to/project \
  --host 0.0.0.0 \
  --url-host localhost
```

返された URL JSON で印刷されるホスト名を制御するには `--url-host` を使用します。

## ループ

1. **サーバーが生きているか確認**、次に **HTML を書き込む** — `screen_dir` の新しいファイルに:
   - 各書き込み前に、`$STATE_DIR/server-info` が存在することを確認します。存在しない場合（または `$STATE_DIR/server-stopped` が存在する場合）、サーバーがシャットダウンしています — 続行する前に `start-server.sh` で再起動します。サーバーは30分の非アクティブ後に自動終了します。
   - セマンティックなファイル名を使用: `platform.html`、`visual-style.html`、`layout.html`
   - **ファイル名を再利用しない** — 各画面は新しいファイルを取得
   - Write ツールを使用 — **cat/heredoc を使用しない**（ターミナルにノイズをダンプする）
   - サーバーは自動的に最新のファイルを提供

2. **ユーザーに何を期待するかを伝えてターンを終了:**
   - URL を思い出させる（最初だけでなく、すべてのステップ）
   - 画面上の内容の簡単なテキスト要約を提供（例: 「ホームページの3つのレイアウトオプションを表示」）
   - ターミナルで応答するように依頼: 「見てみて、どう思うか教えてください。良ければオプションをクリックして選択してください。」

3. **次のターン** — ユーザーがターミナルで応答した後:
   - 存在する場合は `$STATE_DIR/events` を読む — これにはユーザーのブラウザインタラクション（クリック、選択）が JSON 行として含まれる
   - ユーザーのターミナルテキストとマージして全体像を取得
   - ターミナルメッセージが主なフィードバック; `state_dir/events` は構造化されたインタラクションデータを提供

4. **反復または前進** — フィードバックが現在の画面を変更する場合、新しいファイルを書き込む（例: `layout-v2.html`）。現在のステップが検証された場合のみ次の質問に進む。

5. **ターミナルに戻るときにアンロード** — 次のステップがブラウザを必要としない場合（例: 明確化質問、トレードオフの議論）、古いコンテンツをクリアするために待機画面をプッシュ:

   ```html
   <!-- filename: waiting.html (または waiting-2.html など) -->
   <div style="display:flex;align-items:center;justify-content:center;min-height:60vh">
     <p class="subtitle">ターミナルで続行中...</p>
   </div>
   ```

   これにより、ユーザーが会話が進んでいる間に解決された選択を見つめることを防ぎます。次の視覚的な質問が来たら、通常通り新しいコンテンツファイルをプッシュします。

6. 完了するまで繰り返します。

## コンテンツフラグメントの記述

ページ内に入るコンテンツだけを記述します。サーバーは自動的にフレームテンプレートでラップします（ヘッダー、テーマ CSS、選択インジケーター、すべてのインタラクティブインフラストラクチャ）。

**最小限の例:**

```html
<h2>どちらのレイアウトが良いですか?</h2>
<p class="subtitle">可読性と視覚的階層を考慮してください</p>

<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>シングルカラム</h3>
      <p>クリーンで焦点を絞った読書体験</p>
    </div>
  </div>
  <div class="option" data-choice="b" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>2カラム</h3>
      <p>サイドバーナビゲーションとメインコンテンツ</p>
    </div>
  </div>
</div>
```

以上です。`<html>`、CSS、`<script>` タグは不要。サーバーがすべて提供します。

## 利用可能な CSS クラス

フレームテンプレートは、コンテンツ用にこれらの CSS クラスを提供します:

### オプション（A/B/C 選択）

```html
<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>タイトル</h3>
      <p>説明</p>
    </div>
  </div>
</div>
```

**複数選択:** コンテナに `data-multiselect` を追加すると、ユーザーが複数のオプションを選択できます。各クリックでアイテムがトグルされます。インジケーターバーにカウントが表示されます。

```html
<div class="options" data-multiselect>
  <!-- 同じオプションマークアップ — ユーザーは複数を選択/選択解除できる -->
</div>
```

### カード（視覚的デザイン）

```html
<div class="cards">
  <div class="card" data-choice="design1" onclick="toggleSelect(this)">
    <div class="card-image"><!-- モックアップコンテンツ --></div>
    <div class="card-body">
      <h3>名前</h3>
      <p>説明</p>
    </div>
  </div>
</div>
```

### モックアップコンテナ

```html
<div class="mockup">
  <div class="mockup-header">プレビュー: ダッシュボードレイアウト</div>
  <div class="mockup-body"><!-- モックアップ HTML --></div>
</div>
```

### 分割ビュー（サイドバイサイド）

```html
<div class="split">
  <div class="mockup"><!-- 左 --></div>
  <div class="mockup"><!-- 右 --></div>
</div>
```

### 長所/短所

```html
<div class="pros-cons">
  <div class="pros"><h4>長所</h4><ul><li>利点</li></ul></div>
  <div class="cons"><h4>短所</h4><ul><li>欠点</li></ul></div>
</div>
```

### モック要素（ワイヤーフレーム構築ブロック）

```html
<div class="mock-nav">ロゴ | ホーム | 概要 | お問い合わせ</div>
<div style="display: flex;">
  <div class="mock-sidebar">ナビゲーション</div>
  <div class="mock-content">メインコンテンツエリア</div>
</div>
<button class="mock-button">アクションボタン</button>
<input class="mock-input" placeholder="入力フィールド">
<div class="placeholder">プレースホルダーエリア</div>
```

### タイポグラフィとセクション

- `h2` — ページタイトル
- `h3` — セクション見出し
- `.subtitle` — タイトル下のセカンダリテキスト
- `.section` — 下部マージン付きのコンテンツブロック
- `.label` — 小文字の大文字ラベルテキスト

## ブラウザイベント形式

ユーザーがブラウザでオプションをクリックすると、インタラクションが `$STATE_DIR/events` に記録されます（1行に1つの JSON オブジェクト）。新しい画面をプッシュすると、ファイルは自動的にクリアされます。

```jsonl
{"type":"click","choice":"a","text":"オプション A - シンプルなレイアウト","timestamp":1706000101}
{"type":"click","choice":"c","text":"オプション C - 複雑なグリッド","timestamp":1706000108}
{"type":"click","choice":"b","text":"オプション B - ハイブリッド","timestamp":1706000115}
```

完全なイベントストリームはユーザーの探索パスを示します — 決定する前に複数のオプションをクリックする可能性があります。最後の `choice` イベントが通常は最終選択ですが、クリックのパターンは、尋ねる価値のある躊躇や好みを明らかにすることができます。

`$STATE_DIR/events` が存在しない場合、ユーザーはブラウザとやり取りしませんでした — ターミナルテキストのみを使用します。

## 設計のヒント

- **質問に忠実度をスケール** — レイアウトにはワイヤーフレーム、洗練度の質問には洗練
- **各ページで質問を説明** — 「どのレイアウトがよりプロフェッショナルに感じるか?」だけでなく「1つを選んでください」
- **前進する前に反復** — フィードバックが現在の画面を変更する場合、新しいバージョンを記述
- **画面あたり最大2〜4オプション**
- **重要な場合は実際のコンテンツを使用** — 写真ポートフォリオの場合、実際の画像を使用（Unsplash）。プレースホルダーコンテンツは設計の問題を隠す。
- **モックアップをシンプルに保つ** — レイアウトと構造に焦点を当て、ピクセルパーフェクトなデザインではない

## ファイル命名

- セマンティックな名前を使用: `platform.html`、`visual-style.html`、`layout.html`
- ファイル名を再利用しない — 各画面は新しいファイルである必要がある
- 反復の場合: `layout-v2.html`、`layout-v3.html` のようにバージョンサフィックスを追加
- サーバーは変更時刻によって最新のファイルを提供

## クリーンアップ

```bash
scripts/stop-server.sh $SESSION_DIR
```

セッションが `--project-dir` を使用した場合、モックアップファイルは後で参照するために `.superpowers/brainstorm/` に永続化されます。`/tmp` セッションのみが停止時に削除されます。

## リファレンス

- フレームテンプレート（CSS リファレンス）: `scripts/frame-template.html`
- ヘルパースクリプト（クライアント側）: `scripts/helper.js`
