---
name: implement-phase10-test
description: Phase 10（storyファイル整理 + E2Eテスト・依存グラフ）完了後の検証スキル。T10-1〜T10-4 が全て完了していることを確認する。TRIGGER when: `/implement` コマンドの Phase 10（T10-1〜T10-4）が全タスク完了したとき。DO NOT TRIGGER when: Phase 10 未完了のとき、または他の Phase を実行中のとき。
---

# implement-phase10-test: Phase 10 storyファイル整理 + E2Eテスト・依存グラフ 検証

Phase 10（T10-1〜T10-4）の全タスクが完了したら、このスキルを実行する。
目的は「storyファイルが stories/ に移動済みか」「E2Eテスト事前準備が完了しているか」「依存グラフが生成されているか」を確認すること。

---

## ステップ 0: T10-0 確認 — {CODE}.tsx → index.tsx リネーム確認

```bash
# index.tsx が存在するか
ls product/frontend/src/features/{LV1}/{LV2}/{LV3}/index.tsx 2>/dev/null && echo "存在する" || echo "NG: 存在しない"

# {CODE}.tsx が削除されているか（0件が期待値）
ls product/frontend/src/features/{LV1}/{LV2}/{LV3}/{CODE}.tsx 2>/dev/null && echo "NG: まだ存在する" || echo "OK: 削除済み"

# 空の index.ts が削除されているか（0件が期待値）
ls product/frontend/src/features/{LV1}/{LV2}/{LV3}/index.ts 2>/dev/null && echo "NG: まだ存在する" || echo "OK: 削除済み"

# app/ 側に旧 import パス（/{CODE}）が残っていないか（0件が期待値）
grep -rn "from.*{LV3}/{CODE}[\"']" product/frontend/src/app/ 2>/dev/null
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| `index.tsx` が存在する | ✅ | OK / NG |
| `{CODE}.tsx` が存在しない | 0件 | OK / NG |
| 空の `index.ts` が存在しない | 0件 | OK / NG |
| `app/` 側に旧 import パスが残っていない | 0件 | OK / NG |

---

## ステップ 1: T10-1 確認 — stories/ フォルダへの移動確認

```bash
# stories/ フォルダにファイルが存在するか
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/stories -name "*.stories.tsx" 2>/dev/null | sort

# components/ 配下に storyファイルが残っていないか（0件が期待値）
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/components -name "*.stories.tsx" 2>/dev/null

# test/ 配下に旧パス（components/...stories）の import が残っていないか（0件が期待値）
grep -rn "from.*components.*\.stories" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/test/ 2>/dev/null
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| `stories/` 配下に `.stories.tsx` が存在する | 1件以上 | 記録する |
| `components/` 配下に `.stories.tsx` が残っていない | 0件 | OK / NG |
| `test/` 配下に `components/...stories` import が残っていない | 0件 | OK / NG |

---

## ステップ 2: T10-2 確認 — server-test.sh の修正確認

```bash
grep "{CODE}" .claude/scripts/server-test.sh
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| case ブロックに `{CODE})` エントリがある | ✅ | OK / NG |
| `code_to_path()` 関数に `{CODE})` エントリがある | ✅ | OK / NG |

---

## ステップ 3: T10-3 確認 — {CODE}-test.js の存在確認

```bash
find product/frontend/src/features -path "*/test/{CODE}-test.js" -type f 2>/dev/null
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| `{CODE}-test.js` が存在する | 1件 | OK / NG |

---

## ステップ 4: T10-4 確認 — 依存グラフ生成確認

```bash
find docs/01_アプリ -name "*-graph.png" 2>/dev/null
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| `{CODE}-graph.png` が存在する | 1件 | OK / N/A |

---

## ステップ 8: TypeScript コンパイルチェック

```bash
cd product/frontend && npx tsc --noEmit 2>&1 | grep -E "error TS" | grep -v "node_modules" | head -20
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| features/{LV1}/{LV2}/{LV3} 配下の TS エラーが 0件 | 0件 | 記録する |

---

## ステップ 9: 結果レポート

以下の形式で出力する：

```
## Phase 10 storyファイル整理 + E2Eテスト・依存グラフ チェック結果

### 📋 T10-0: {CODE}.tsx → index.tsx リネーム確認
- index.tsx の存在: ✅ / ❌
- {CODE}.tsx の削除: ✅ / ❌（まだ存在）
- 空 index.ts の削除: ✅ / ❌（まだ存在）
- app/ 旧 import パスなし: ✅ / ❌（残存: {パス}）
- → ✅ PASS / ❌ FAIL

### 📋 T10-1: stories/ フォルダへの移動確認
- stories/ 配下の .stories.tsx: ✅ N件（{パス一覧}） / ❌ 0件
- components/ 配下に残存なし: ✅ / ❌（残存: {パス}）
- test/ 配下の旧 import なし: ✅ / ❌（残存: {パス}）
- → ✅ PASS / ❌ FAIL

### 📋 T10-2: server-test.sh 修正確認
- case ブロックに {CODE}) エントリあり: ✅ / ❌
- code_to_path() に {CODE}) エントリあり: ✅ / ❌
- → ✅ PASS / ❌ FAIL

### 📋 T10-3: {CODE}-test.js 存在確認
- ファイルの存在: ✅（{パス}） / ❌
- → ✅ PASS / ❌ FAIL

### 📋 T10-4: 依存グラフ生成確認
- {CODE}-graph.png の存在: ✅（{パス}） / N/A
- → ✅ PASS / N/A

### 📋 TypeScript コンパイルチェック
- TSエラー数: N件
- → ✅ 0件 / ❌ N件エラー

### 📊 サマリ
- T10-1 stories/ 移動: ✅ / ❌
- T10-2 server-test.sh 修正: ✅ / ❌
- T10-3 {CODE}-test.js: ✅ / ❌
- T10-4 依存グラフ: ✅ / N/A
- TypeScript: ✅ / ❌
→ 総合: PASS / FAIL
```

---

## ステップ 10: Gate（FAIL がある場合のみ）

FAIL 項目がある場合：

```yaml
header: "Phase 10 FAIL"
question: "以下の未完了・エラーがあります。修正しますか？"
options:
  - "修正する（推奨）" / description: "FAIL 項目を修正してから再度テストを実行"
  - "スキップする" / description: "意図的な未完了として記録してから次フェーズへ進む"
```

---

## 完了条件

- [ ] `stories/molecules/` または `stories/organisms/` 配下に `.stories.tsx` が存在する
- [ ] `components/` 配下に `.stories.tsx` が残っていない（0件）
- [ ] `test/` 配下のテストファイルに `../components/...stories` の旧 import が残っていない（0件）
- [ ] `server-test.sh` の case ブロックと `code_to_path()` に `{CODE})` エントリが追加されている
- [ ] `product/frontend/src/features/{LV1}/{LV2}/{LV3}/test/{CODE}-test.js` が存在する
- [ ] `{CODE}-graph.png` が `docs/01_アプリ/` 配下に存在する（または N/A として記録）
- [ ] TypeScript コンパイルエラーが 0件
- [ ] サマリが出力された
