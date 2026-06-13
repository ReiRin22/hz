---
name: implement-phase6-test
description: Phase 6（機能実装）完了後の検証スキル。design_detail の `## 操作イベント定義` に定義された全イベントが Organism に実装されているか・楽観的更新とロールバックの有無・確定ボタンの disabled 制御・キャンセル時のストアリセット・TypeScript コンパイルが通るかを確認する。TRIGGER when: `/implement` コマンドの Phase 6（T6-1〜T6-3）が全タスク完了したとき。DO NOT TRIGGER when: Phase 6 未完了のとき、または他の Phase を実行中のとき。
---

# implement-phase6-test: Phase 6 機能実装 検証

Phase 6（T6-1〜T6-3）の全タスクが完了したら、このスキルを実行する。
目的は「設計書の全操作イベントが Organism に実装されているか」「楽観的更新とロールバックが正しく実装されているか」「確定・キャンセルフローが設計通りか」「型エラーがないか」を確認すること。

---

## ステップ 1: 設計書から操作イベント一覧を抽出

`design_detail`（`docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`）を Read し、
`## AI実装制約` > `### 操作イベント定義` セクションから全イベントを抽出する。

抽出した情報を以下の形式で記録する。

```
## 設計書の操作イベント一覧
| No | イベントID | イベント名 | トリガー | 担当フック | API 呼び出し |
|---|---|---|---|---|---|
| 1 | EVT_INIT01 | 初期表示 | マウント | use{機能名}Init | GET |
| 2 | EVT_SELECT01 | 項目選択 | クリック | handleSelectItem | なし |
| 3 | EVT_SUBMIT01 | 確定 | クリック | handleSubmit | POST |
| 4 | EVT_CANCEL01 | キャンセル | クリック | handleCancel | なし |
...（全件）

合計: N 件（うち API 呼び出しあり: N 件）
```

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`

---

## ステップ 2: Organism の実装ファイルを列挙

```bash
# Organism の実装ファイルを確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/organisms \
  -name "*.tsx" | sort

# hooks/ の実装ファイルを確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks \
  -name "*.ts" | sort
```

各 Organism ファイルのイベントハンドラー接続状況を確認する。

```bash
# Organism でのハンドラー接続を確認（onClick / onChange / Props 渡し）
grep -n "onClick\|onChange\|onSubmit\|handle\|disabled" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/organisms/*.tsx 2>/dev/null
```

---

## ステップ 3: 操作イベントカバレッジチェック（設計 vs 実装の照合）

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 設計書のイベント数 | N 件 | 記録する |
| Organism に接続済みのハンドラー数 | N 件以上 | 記録する |
| 設計書に存在するが未実装のイベント | 0 件 | 記録する |

**ルール**:
- 実装数 ≥ 設計書の数 → OK
- 設計書に存在するイベントが Organism で未実装 → FAIL
- 実装に設計書外のハンドラーがある場合 → 警告（意図的な追加か確認を促す）

---

## ステップ 4: サーバー連携チェック（楽観的更新・Mutation）

### 4-1: 楽観的更新の実装確認

```bash
# TanStack Query パターン（onMutate / cancelQueries / setQueryData）
grep -rn "onMutate\|cancelQueries\|setQueryData\|getQueryData" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null

# Zustand パターン（snapshot / スナップショット変数）
grep -rn "snapshot\|_optimistic\|const prev" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null
```

### 4-2: ロールバック処理の確認

```bash
# TanStack Query パターン（onError での復元）
grep -rn "onError\|context?.previous\|context\.previous" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null

# Zustand パターン（catch でのスナップショット復元）
grep -rn "setFormData(snapshot\|setData(snapshot\|} catch" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null
```

### 4-3: onSettled / invalidateQueries の確認（TanStack Query のみ）

```bash
grep -rn "onSettled\|invalidateQueries" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 楽観的更新（onMutate / snapshot）が実装されている | ✅ あり | OK / NG / N/A |
| ロールバック処理（onError / catch）が実装されている | ✅ あり | OK / NG |
| 再取得（onSettled / invalidateQueries）が実装されている | ✅ あり（TanStack Query 使用時） | OK / NG / N/A |

> API 呼び出しのないイベントのみの場合は N/A として記録する。

---

## ステップ 5: 確定・キャンセルフローチェック

### 5-1: 二重送信防止（確定ボタンの disabled 制御）

```bash
# disabled + isSubmitting / isPending の組み合わせを確認
grep -rn "disabled.*isSubmitting\|disabled.*isPending\|isSubmitting.*disabled\|isPending.*disabled" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/organisms/*.tsx 2>/dev/null
```

### 5-2: 確定成功後のナビゲーション確認

```bash
# router.push / router.back の使用を確認
grep -rn "router\.push\|router\.back\|router\.replace" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null
```

### 5-3: キャンセル時のストアリセット確認

```bash
# handleCancel に reset() 呼び出しがあるか確認
grep -rn "handleCancel\|reset()" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 確定ボタンに `disabled={isSubmitting}` または `disabled={isPending}` がある | ✅ | OK / NG |
| 確定成功後に `router.push` または `router.back` が呼ばれる | ✅ | OK / NG |
| キャンセル時に `reset()` が呼ばれる | ✅ | OK / NG |
| キャンセル時に `router.back()` が呼ばれる | ✅ | OK / NG |

---

## ステップ 6: エラー表示チェック

Phase 6 では最低限 `console.error` + 基本 UI フィードバックが実装されていることを確認する（詳細化は Phase 7）。

```bash
# console.error の存在確認
grep -rn "console\.error" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null

# エラー状態の UI 反映確認（isError / error メッセージ表示等）
grep -rn "isError\|errorMessage\|setError\|toast\." \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/ 2>/dev/null | \
  grep -v "test\." | head -10
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| エラー発生時に `console.error` が呼ばれる | ✅ あり | OK / NG |
| エラー状態が何らかの形で UI にフィードバックされる（警告表示・メッセージ等） | ✅ あり（Phase 7 で詳細化可） | OK / 要改善 |

---

## ステップ 7: 命名規則チェック

structure_2.md の命名規則に準拠しているかを確認する。

```bash
# hooks/ のファイル名確認（use{機能名}{Init/Actions/Submit}.ts）
ls -1 product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null

# organisms/ のファイル名確認（{機能名}Organism.tsx）
ls -1 product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/organisms/ 2>/dev/null
```

| チェック項目 | 期待パターン | 結果 |
|---|---|---|
| hooks/ ファイル名 | `use{機能名}{Init/Actions/Submit}.ts`（camelCase） | OK / NG |
| organisms/ ファイル名 | `{機能名}Organism.tsx`（PascalCase） | OK / NG |
| index.ts が存在する | `features/{LV1}/{LV2}/{LV3}/index.ts` | OK / NG |

```bash
# index.ts の存在確認
ls product/frontend/src/features/{LV1}/{LV2}/{LV3}/index.ts 2>/dev/null || echo "MISSING: index.ts"
```

---

## ステップ 8: TypeScript コンパイルチェック

```bash
cd product/frontend && npx tsc --noEmit 2>&1 | grep -E "organisms/|hooks/" | head -30
```

organisms/ と hooks/ に関するコンパイルエラーが 0 件であることを確認する。

---

## ステップ 9: 結果レポート

以下の形式で出力する：

```
## Phase 6 機能実装 チェック結果

### 📋 操作イベントカバレッジチェック
- 設計書のイベント数: N 件
- Organism 実装済みハンドラー数: N 件
- 未実装のイベント: （なし / {イベントID}）
- → ✅ PASS / ❌ FAIL（未実装: {イベントID}）

### 📋 サーバー連携チェック
- 楽観的更新（onMutate / snapshot）: ✅ あり / ❌ なし / N/A
- ロールバック（onError / catch）: ✅ あり / ❌ なし
- 再取得（onSettled / invalidateQueries）: ✅ あり / ❌ なし / N/A
- → ✅ PASS / ❌ FAIL

### 📋 確定・キャンセルフローチェック
- 確定ボタン disabled 制御: ✅ あり / ❌ なし
- 確定後ナビゲーション（router.push / router.back）: ✅ あり / ❌ なし
- キャンセル時 reset(): ✅ あり / ❌ なし
- キャンセル時 router.back(): ✅ あり / ❌ なし
- → ✅ PASS / ❌ FAIL

### 📋 エラー表示チェック
- console.error の存在: ✅ あり / ❌ なし
- UI フィードバック: ✅ あり / ⚠️ 要改善（Phase 7 で対応）
- → ✅ PASS / ⚠️ WARN

### 📋 命名規則チェック
- hooks/ ファイル名（use{機能名}{Init/Actions/Submit}.ts）: ✅ / ❌
- organisms/ ファイル名（{機能名}Organism.tsx）: ✅ / ❌
- index.ts の存在: ✅ / ❌
- → ✅ PASS / ❌ FAIL

### 📋 TypeScript コンパイルチェック
- organisms/ + hooks/ エラー数: N 件
- → ✅ 0 件 / ❌ N 件エラー

### 📊 サマリ
- 操作イベントカバレッジ: ✅ / ❌
- サーバー連携: ✅ / ❌
- 確定・キャンセルフロー: ✅ / ❌
- エラー表示: ✅ / ⚠️
- 命名規則: ✅ / ❌
- TypeScript: ✅ / ❌
→ 総合: PASS / FAIL
```

---

## ステップ 10: Gate（FAIL がある場合のみ）

FAIL 項目がある場合：

```yaml
header: "Phase 6 FAIL"
question: "以下の未実装・エラーがあります。修正しますか？"
options:
  - "修正する（推奨）" / description: "FAIL 項目を修正してから再度テストを実行"
  - "スキップする" / description: "意図的な未実装として記録してから次フェーズへ進む"
```

「修正する」が選択された場合、FAIL 項目を修正後にステップ 1 から再実行する。

---

## 完了条件

- [ ] 設計書の全操作イベントが Organism に実装されている
- [ ] API 呼び出しのある操作に楽観的更新が実装されている（API 呼び出しなしの機能は N/A）
- [ ] ロールバック処理（onError / catch でのスナップショット復元）が実装されている
- [ ] 確定ボタンに `disabled={isSubmitting}` が設定されている
- [ ] 確定成功後のナビゲーションが実装されている
- [ ] キャンセル時に `reset()` と `router.back()` が呼ばれる
- [ ] エラー時に最低限の UI フィードバックがある（console.error 以上）
- [ ] ファイル名・命名規則に準拠している
- [ ] `index.ts` が存在する
- [ ] TypeScript コンパイルエラーが 0 件
- [ ] サマリが出力された
