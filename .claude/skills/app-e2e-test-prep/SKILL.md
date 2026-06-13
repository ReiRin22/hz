---
name: app-e2e-test-prep
description: E2Eテスト実行前の事前準備スキル。新機能のPhase 8（E2Eテスト事前準備）で必ず使用する。TRIGGER when: 新しい画面機能コード（REC/REG/DEP/ORD/RES等）のE2Eテストを初めて追加するとき、または `scripts/server-test.sh` と `scripts/{CODE}-test.js` を新規作成・修正するとき。やること: ①Next.jsルートパスの確認 ②server-test.sh の2箇所修正 ③{CODE}-test.js の新規作成。DO NOT TRIGGER when: テストを実行するだけ（既にファイルが存在する場合）。
---

# E2Eテスト事前準備チェックリスト

E2Eテスト（Phase 9）を実行する前に、この3ステップを必ず完了させること。
未実施のまま `bash .claude/scripts/server-test.sh {CODE}` を実行すると 404 または Timeout になる（実績あり：REC002で発生）

---

## ステップ1: Next.jsルートパスを確認する

まず `find` でルートが実在することを確認してからURLを確定する。

```bash
# {CODE} に実際の機能コードを入れて検索
find product/frontend/src/app -path "*{CODE}*" -name "page.tsx" 2>/dev/null
```

出力例:
```
product/frontend/src/app/diagnosis/record-creation/examination-input/REC002/page.tsx
```

→ URL は `/diagnosis/record-creation/examination-input/REC002` と確定。

**注意**: ファイルが見つからない場合は実装フェーズ（コンポーネント作成）が未完了。テスト事前準備の前に実装を完了させること。

**`/dev/` パス禁止（E2Eテスト・本番遷移パス共通）**: 本番ルート（`src/app/` 直下）が存在する機能のE2Eテストは、必ず本番パスをターゲットにすること。`/dev/` パスは本番レイアウト（AppHeader・ナビゲーションコンテキスト等）が差し込まれず、本番と挙動が乖離する。また、本番ユーザーが遷移するメニューやリンクに `/dev/` パスを使うことも禁止する。本番ルートが存在しない場合のみ `/dev/` を暫定使用可とするが、本番ルート作成後は即座に切り替えること。

---

## ステップ2: `scripts/server-test.sh` を修正する（2箇所）

### 修正箇所 A: E2Eスクリプト選択ブロック

```bash
# ファイル: .claude/scripts/server-test.sh
# 変更前（*)のすぐ上に1行追加する（パスはLV3のtest/フォルダを指定）
case "$_CODE_ARG" in
  REC001) E2E_SCRIPT="$FEATURES_DIR/01_diagnosis/01_record-creation/01_examination-input/test/REC001-test.js" ;;
  REC002) E2E_SCRIPT="$FEATURES_DIR/01_diagnosis/01_record-creation/01_schema-creation/test/REC002-test.js" ;;
  {CODE}) E2E_SCRIPT="$FEATURES_DIR/{LV1}/{LV2}/{LV3}/test/{CODE}-test.js" ;;   # ← 追加
  *)      E2E_SCRIPT="$FEATURES_DIR/01_diagnosis/01_record-creation/01_schema-creation/test/REC002-test.js" ;;
esac
```

### 修正箇所 B: URLマッピング関数

```bash
# 変数 code_to_path() 内の *)より上に追加
{CODE}) echo "/{ステップ1で確認したパス}" ;;   # ← 追加
```

---

## ステップ3: `product/frontend/src/features/{LV1}/{LV2}/{LV3}/test/{CODE}-test.js` を新規作成する

`product/frontend/src/features/01_diagnosis/01_record-creation/01_schema-creation/test/REC002-test.js` を雛形にして、対象LV3の `test/` フォルダに `{CODE}-test.js` を作成する。

### 配置場所の特定

```bash
# structure_2.md のLV3ディレクトリ一覧から対象のLV3パスを確認する
# 例: REC002 → 01_diagnosis/01_record-creation/01_schema-creation/test/
```

### 必須変更箇所（7か所）

| 変更箇所 | 変更前（REC002） | 変更後 |
|---|---|---|
| ファイルヘッダーコメント | `REC002-test.js — Playwright … シェーマ作成機能` | `{CODE}-test.js — Playwright … {機能名}` |
| 関数名 | `async function runREC002(page)` | `async function run{CODE}(page)` |
| CODE_URL_MAP エントリ | `REC002: '/diagnosis/...'` | `{CODE}: '/{ステップ1のパス}'` |
| log() のURL表示 | `` log(`URL: ${BASE_URL}/diagnosis/...`) `` | `` log(`URL: ${BASE_URL}/{パス}`) `` |
| page.goto() | `page.goto(.../REC002, ...)` | `page.goto(.../{CODE}, ...)` |
| テスト内容 | シェーマ作成固有の12ステップ | 新機能固有のUIテストに書き換え |
| 分岐条件 | `CODE === 'REC002' \|\| CODE === ''` | `CODE === '{CODE}' \|\| CODE === ''` |

### 内部パス（変更不要）

`__dirname` からの相対パスはLV3の `test/` フォルダを基点とする:
- `../../../../../../node_modules/playwright` — `product/frontend/node_modules/playwright`
- `../../../../../../../../gitlab-runner/logs` — `harz2/gitlab-runner/logs`

### ロケーターの注意事項

`button[title="..."]` は使わない。多くのコンポーネントに `title` 属性が存在しないため Timeout になる。

```javascript
// NG: title属性を使う
page.locator('button[title="四角形"]')

// OK: テキストフィルタを使う
page.locator('button').filter({ hasText: /^四角$/ }).first()
```

実際のボタンラベルは実装コード（`components/molecules/*.tsx` 等）を確認してから書く。

### テスト構成の目安

```javascript
const TOTAL = 8;  // 機能の複雑さに応じて調整

// 最低限含めるべきテスト
// 1. 画面を開く（page.goto + title確認）
// 2. 主要UI要素の存在確認（ボタン・フォーム等）
// 3. 初期状態の確認（活性/非活性・初期値）
// 4. 主要操作（ボタンクリック・入力）
// 5. バリデーション/エラー確認（必要な場合）
// 6. 確定/送信ボタン（E2Eの最終確認）
```

---

## 完了チェックリスト

```
[ ] ステップ1: find でルートパスの実在を確認した
[ ] ステップ2A: server-test.sh の case ブロック（E2Eスクリプト選択）に追加した
[ ] ステップ2B: server-test.sh の code_to_path() に追加した
[ ] ステップ3: product/frontend/src/features/{LV1}/{LV2}/{LV3}/test/{CODE}-test.js を新規作成した
[ ] 動作確認: bash .claude/scripts/server-test.sh {CODE} で PASS することを確認した
```

---

## 参照

- テンプレートファイル: `product/frontend/src/features/01_diagnosis/01_record-creation/01_schema-creation/test/REC002-test.js`（雛形）
- 修正対象: `.claude/scripts/server-test.sh`
