---
name: implement-phase8-test
description: Phase 8（Storybookセットアップ・story作成）完了確認スキル。T8-1〜T8-5 の全項目が実装されているかを検証する。TRIGGER when: Phase 8 の全タスクが [x] になったとき。
---

# Phase 8 完了確認

Phase 8 の全タスクが `[x]` になったら以下の項目を順番に確認する。
全項目 PASS で phase8-test PASS とする。

---

## T8-1〜T8-3: Storybook基本セットアップ確認

```bash
# 設定ファイルの存在確認
ls product/frontend/.storybook/main.ts && echo "main.ts OK"
ls product/frontend/.storybook/preview.ts && echo "preview.ts OK"

# framework 確認
grep "react-vite" product/frontend/.storybook/main.ts && echo "framework OK"

# process.env 定義確認
grep "process.env" product/frontend/.storybook/main.ts && echo "process.env define OK"

# スクリプト確認
grep '"storybook"' product/frontend/package.json && echo "storybook script OK"
grep '"build-storybook"' product/frontend/package.json && echo "build-storybook script OK"

# storiesファイルの存在確認（molecules/organisms）
find product/frontend/src -name "*.stories.tsx" | wc -l
```

**PASS 条件:**
- [ ] `.storybook/main.ts` が存在し `react-vite` フレームワークを使用
- [ ] `.storybook/main.ts` の `viteFinal` に `config.define = { 'process.env': {} }` が設定されている
- [ ] `.storybook/preview.ts` が存在し `globals.css` をインポートしている
- [ ] `storybook` / `build-storybook` スクリプトが package.json にある
- [ ] molecules・organisms に `.stories.tsx` ファイルが存在する

---

## T8-3b: Storybookビルド成功確認（Phase 9 への必須ゲート）

**⚠️ この確認が PASS しない限り Phase 9 には進んではならない。**

```bash
cd product/frontend && npm run build-storybook 2>&1 | tail -5
```

**PASS 条件:**
- [ ] `✓ built in` または `info => Output directory:` が出力される（エラーなし）
- [ ] `error` / `Error` を含む行がない

**FAIL した場合の対処:**
1. エラーメッセージを特定する
2. 該当 `.stories.tsx` を修正してから再実行する
3. PASS するまで Phase 9 に進まない

---

## T8-4: story title 形式確認

```bash
# 全 stories の title を抽出して確認
grep -r "title:" product/frontend/src --include="*.stories.tsx"
```

**PASS 条件:**
- [ ] 全 `.stories.tsx` の title が `'LV1/LV2/LV3/(molecules|organisms)/コンポーネント名'` 形式になっている（`src/features/` 以降の全フォルダを含む）
- [ ] LV3 のみ・LV1 のみなど途中省略の title が存在しない

---

## T8-5: Phase 9 準備メモ確認

```bash
# メモファイルの存在確認
find .steering -name "phase9-actions-memo.md" 2>/dev/null
```

**PASS 条件:**
- [ ] `.steering/{機能}/phase9-actions-memo.md` が存在する
- [ ] ファイル内に「hooks/ 操作イベント一覧」テーブルが記載されている
- [ ] ファイル内に「Phase 9 argTypes 候補」セクションが記載されている

---

## T8-6: ブラウザで story 表示を目視確認（ユーザー前でのデモ）

**⚠️ この手順はユーザーの前で実施する。自動化スクリプトの結果だけで代替してはならない。**

### ステップ1: Storybook サーバーを起動する

```bash
# product/frontend ディレクトリで実行
cd product/frontend && npm run storybook -- --no-open 2>&1 &
# 起動完了を待つ（"Storybook X.X.X for react-vite started" が出るまで）
sleep 20
# 使用ポートを確認
cat /tmp/storybook-port.txt 2>/dev/null || grep -o "localhost:[0-9]*" <<< "$(jobs -l)" || echo "確認: ログ末尾のポートを使う"
```

起動ログ末尾の `Local: http://localhost:{PORT}/` でポートを確認する。

### ステップ2: ブラウザを開く

**WSL 環境（Windows ブラウザを直接起動）:**

```bash
# ポートを実際の値に差し替えて実行（例: 6006 または 6007）
SB_PORT=6007  # ← ログで確認したポートに変更
cmd.exe /c start "" "http://localhost:${SB_PORT}/?path=/story/01_schema-creation-molecules-colorpickerpanel--black"
```

**Mac / Linux 環境:**

```bash
SB_PORT=6006
open "http://localhost:${SB_PORT}/?path=/story/01_schema-creation-molecules-colorpickerpanel--black" 2>/dev/null \
  || xdg-open "http://localhost:${SB_PORT}/?path=/story/01_schema-creation-molecules-colorpickerpanel--black"
```

### ステップ3: 対象機能の全 story を目視確認する

ブラウザ左サイドバーで `01_schema-creation` ツリーを展開し、以下を順に開いて表示されることを確認する。

| グループ | Story | 確認ポイント |
|---|---|---|
| molecules/ColorPickerPanel | Black / Red / Custom | カラーサークルとパレットボタンが表示される |
| molecules/DrawingToolPanel | PenSelected / EraserSelected / RectangleSelected | 選択ツールがハイライトされる |
| molecules/FooterActionBar | Idle / Submitting | Submitting でボタンが disabled + "保存中..." になる |
| molecules/TemplateSelectorPanel | Default / WithSelectedTemplate / WithFavorites | テンプレートグリッドと★アイコンが表示される |
| molecules/ToolbarPanel | Default | undo / redo / クリア / 反転ボタンが表示される |
| organisms/DrawingCanvas | PenTool / EraserTool / WithTemplate | キャンバスが描画可能な状態で表示される |
| organisms/SchemaCreationOrganism | NewMode / EditMode | 全体レイアウト（キャンバス＋パネル＋フッター）が表示される |

**別機能（他の LV1/LV2/LV3 フォルダ）の story は確認対象外。**

**PASS 条件:**
- [ ] ブラウザが開き Storybook UI が表示される
- [ ] サイドバーに `01_schema-creation` ツリーが存在する
- [ ] molecules 配下の全 5 コンポーネントの story が表示エラーなく開ける
- [ ] organisms 配下の全 2 コンポーネントの story が表示エラーなく開ける

**FAIL（story が真っ白 / エラー表示）した場合:**
1. ブラウザの DevTools Console でエラーを確認する
2. `process.env` 参照エラーなら `.storybook/main.ts` の `viteFinal` に `config.define = { 'process.env': {} }` が設定されているか再確認
3. import エラーなら該当 `.stories.tsx` の import パスを修正して `npm run build-storybook` を再実行する

---

## 総合判定

上記全チェックリストが `[x]` になれば **Phase 8 PASS**。

**PASS後の処理:**
1. `state.md` の `completed_phases` に `Phase 8: Storybookセットアップ・story作成 ✅ YYYY-MM-DD` を追記
2. `state.md` の `progress` を `Phase 8 完了。次は Phase 9 (T9-1: API通信が必要なstoryファイルの特定) から` に更新
3. 応答を終了する（Phase 9 には自発的に進まない）
