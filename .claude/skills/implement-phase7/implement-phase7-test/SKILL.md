---
name: implement-phase7-test
description: Phase 7（バリデーション・エラーハンドリング）完了後の検証スキル。design_detail の `## エラー表示設計` に定義された全バリデーションルール・エラーケースが実装されているか・Zodスキーマ+エラー表示の実装・APIエラーハンドリングの統一性（BffApiError）・hooks の console 残存チェック・**hooks で Sentry.captureException() を呼んでいないか**・エラーコード判定が機能側で実装されているか・error.tsx 配置確認・Server Actions 内での redirect 禁止パターン遵守・TypeScript コンパイルが通るかを確認する。TRIGGER when: `/implement` コマンドの Phase 7（T7-1〜T7-4）が全タスク完了したとき。DO NOT TRIGGER when: Phase 7 未完了のとき、または他の Phase を実行中のとき。
---

# implement-phase7-test: Phase 7 バリデーション・エラーハンドリング 検証

Phase 7（T7-1〜T7-4）の全タスクが完了したら、このスキルを実行する。
目的は「設計書に定義された全バリデーションルール・エラーケースが実装されているか」「共通エラー基盤（BffApiError）が整備されているか」「hooks の console が除去されているか」「**hooks で Sentry.captureException() を呼んでいないか**（axiosClient Interceptor が自動送信するため不要）」「エラーコード判定が機能側で実装されているか」「error.tsx が適切に配置されているか」「APIエラーハンドリングが統一されているか」「Next.js の禁止パターンを踏んでいないか」「型エラーがないか」を確認すること。

---

## 参照設計書・規約

このテストで参照する設計書・規約（`implement.md` の 0-1 に相当）：

| 参照先 | 内容 |
|---|---|
| `{design_detail}` `## エラー表示設計` | バリデーションルール・エラーケース・重大度・通知形式 |
| `02_詳細設計書/09_監視エラーハンドリング設計/エラー処理基盤設計.md` | エラー種別・処理フロー・重大度別通知方針（§6.3） |
| `02_詳細設計書/10_BFF設計/エラーハンドリング統合設計.md` | HTTP ステータスコード別の対応方針 |
| `.claude/rules/cross-layer-rules.md` | フロント・BFF・BE 横断の禁止事項・整合性チェックルール |
| `.claude/rules/test-rules.md` | テスト設計の禁止事項・整合性チェックルール |

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`
>
> **`02_詳細設計書/` の参照パス規則**:
> 1. `docs/02_アプリ基盤/{component}/02_詳細設計書/new/{ファイル名}` — 正式版（存在すればこちらを使う）
> 2. `docs/02_アプリ基盤/{component}/02_詳細設計書/{ファイル名}` — 作業中版（正式版がない場合）

---

## ステップ 1: 設計書からバリデーション・エラーケース一覧を抽出

`design_detail`（`docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`）を Read し、
`## エラー表示設計` セクションからバリデーションルールとエラーケースを全件抽出する。

抽出した情報を以下の形式で記録する。

```
## 設計書のバリデーション・エラーケース一覧
| No | 種別 | フィールド/操作 | ルール/エラー条件 | エラーメッセージ | 実装箇所 |
|---|---|---|---|---|---|
| 1 | バリデーション | schemaName | 必須・1〜100文字 | 「名称を入力してください」 | Zodスキーマ |
| 2 | バリデーション | nodes | 最低1件以上 | 「ノードを1件以上追加してください」 | Zodスキーマ |
| 3 | APIエラー | 保存操作 | 409 Conflict | 「既に同名のシェーマが存在します」 | エラーハンドラー |
...（全件）

合計: バリデーション N 件 / APIエラー M 件
```

> `{design_detail}` = `docs/01_アプリ/{domain}/{機能グループ}/design_detail-{機能ID}_{機能名}.md`
>
> **`02_詳細設計書/` の参照パス規則**:
> 1. `docs/02_アプリ基盤/{component}/02_詳細設計書/{ファイル名}` — 作業中版（正式版がない場合はこちらを参照）
> 2. `docs/02_アプリ基盤/{component}/02_詳細設計書/new/{ファイル名}` — 正式版（存在すればこちらを使う）

---

## ステップ 2: クライアントバリデーション実装ファイルを列挙

```bash
# Zodスキーマファイルを確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3} -name "*.schema.ts" -o -name "*schema*.ts" | sort

# バリデーション関連ファイルを広めに確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3} -name "*.ts" -o -name "*.tsx" | \
  xargs grep -l "z\.object\|z\.string\|z\.number\|zodResolver\|useForm" 2>/dev/null | sort
```

---

## ステップ 3: バリデーションカバレッジチェック（設計 vs 実装の照合）

### 3-1: Zodスキーマの定義確認

設計書で定義されたバリデーションルールが Zod スキーマとして実装されているかを確認する。

```bash
# Zodスキーマの内容を確認
grep -n "z\.\|refine\|superRefine" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/**/*.schema.ts 2>/dev/null

# 型推論の export を確認（Schema から型を生成しているか）
grep -n "z\.infer\|export type" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/**/*.schema.ts 2>/dev/null
```

### 3-2: エラーメッセージの実装確認

設計書のエラーメッセージが Zod スキーマまたはコンポーネントに定義されているかを確認する。

```bash
# エラーメッセージの実装を検索（Zodメッセージ・JSXエラー表示）
grep -rn "message\|エラー\|error" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/ 2>/dev/null | \
  grep -v "node_modules\|.test." | head -30
```

### 3-3: カバレッジ結果表

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 設計書のバリデーションルール数 | N 件 | 記録する |
| Zodスキーマに実装済みのルール数 | N 件以上 | 記録する |
| 未実装のバリデーションルール | 0 件 | 記録する |
| エラーメッセージが設計書と一致 | ✅ | OK / NG |

**ルール**:
- 実装数 ≥ 設計書のルール数 → OK
- 設計書に存在するルールが未実装 → FAIL
- エラーメッセージが設計書と異なる → WARN（意図的な変更か確認を促す）

---

## ステップ 4: 共通エラー基盤チェック（T7-3）

### 4-0: BffApiError の使用確認

```bash
# shared/utils/bff-error.ts の存在確認（基盤ファイル）
ls product/frontend/src/shared/utils/bff-error.ts 2>/dev/null && echo "✅ 存在" || echo "❌ 不在"

# 機能側で import されているか確認
grep -rn "from '@/shared/utils/bff-error'" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/ 2>/dev/null
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| `shared/utils/bff-error.ts` が存在する（基盤ファイル） | ✅ | OK / NG |
| 機能側の api/ または hooks/ で import されている | ✅ | OK / NG |

### 4-1: api/ 通信関数の throw 統一確認

```bash
# 古い throw new Error が残っていないか確認
grep -rn "throw new Error" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/api/ 2>/dev/null
```

出力が空であれば OK。残存があれば FAIL（`classifyHttpError` に置き換える）。

### 4-2: hooks の console 残存チェック

```bash
# hooks に console.log / console.error が残っていないか確認
grep -rn "console\." \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null
```

出力が空であれば OK。残存があれば FAIL（toast.error または throw に置き換える）。

### 4-3: hooks の catch ブロック実装確認

```bash
# catch ブロックの実装を確認（Phase 7 コメントが残っていないか）
grep -rn "Phase 7\|// Phase" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null

# toast.error の使用を確認
grep -rn "toast\.error\|toast\.warning\|router\.push.*login" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null

# 【重要】hooks で Sentry.captureException() を呼んでいないか確認（呼ぶべきでない）
grep -rn "Sentry\.captureException\|import.*Sentry" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/hooks/ 2>/dev/null
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| `// Phase 7` コメントが残っていない | ✅ | OK / NG |
| catch ブロックに `toast.error` または `throw` がある | ✅ | OK / NG |
| **hooks で `Sentry.captureException()` を呼んでいない** | ✅ 呼んでいない | OK / **❌ NG（二重送信になる）** |
| BffApiError.code を使ったエラーコード判定がある（重度・軽微エラー処理 hooks のみ） | ✅ / N/A | OK / NG |
| E401 エラー時の `router.push('/login')` がある（E401 対応 hooks のみ） | ✅ / N/A | OK / NG |

> **重要**：hooks で `Sentry.captureException()` を呼ぶと二重送信になる。
> API エラーは axiosClient Interceptor が、ランタイムエラーは error.tsx が自動送信する。

### 4-4: error.tsx 配置確認

```bash
# app/ 配下の error.tsx 一覧
find product/frontend/src/app -name "error.tsx" | sort

# グローバル error.tsx の存在確認
ls product/frontend/src/app/error.tsx 2>/dev/null && echo "グローバル error.tsx あり" || echo "グローバル error.tsx なし"
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| `src/app/error.tsx`（グローバル）が存在する | ✅ | OK / NG |
| 機能が属するルートグループに `error.tsx` が存在する（または グローバルでカバー済み） | ✅ | OK / NG |

---

## ステップ 5: APIエラーハンドリング統一性チェック

### 5-1: エラーハンドラーの実装確認

```bash
# APIエラーハンドリング実装を確認
find product/frontend/src/features/{LV1}/{LV2}/{LV3} -name "*.ts" -o -name "*.tsx" | \
  xargs grep -l "catch\|onError\|handleError\|ApiError" 2>/dev/null | sort
```

### 5-2: エラーコードマッピングの確認

設計書（`02_詳細設計書/10.BFF設計.md` `## エラーハンドリング戦略`）のエラーコードが網羅されているかを確認する。

```bash
# HTTPステータスコード別のハンドリングを確認
grep -rn "status\|400\|401\|403\|404\|409\|422\|500" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/ 2>/dev/null | \
  grep -v "node_modules\|.test.\|comment" | head -30
```

### 5-3: エラーハンドリングの統一性チェック結果表

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| 設計書のAPIエラーケース数 | M 件 | 記録する |
| ハンドラーで対応済みのエラーケース数 | M 件以上 | 記録する |
| 未対応のエラーケース | 0 件 | 記録する |
| エラーハンドリングが一箇所に集約されている | ✅ | OK / NG |

---

## ステップ 6: Server Actions の redirect 禁止パターンチェック

Next.js では Server Actions 内で `redirect()` を `try-catch` の内側で呼ぶことが禁止されている
（`redirect` は内部的に例外を投げるため、catch に捕まって動作しなくなる）。
`product/.agents/skills/next-best-practices/error-handling.md` で詳細を確認できる。

```bash
# Server Actions ファイルを特定
find product/frontend/src -name "*.ts" -o -name "*.tsx" | \
  xargs grep -l "'use server'" 2>/dev/null | sort

# Server Actions 内の try-catch + redirect パターンを検出
grep -n "redirect\|notFound\|forbidden" \
  $(find product/frontend/src -name "*.ts" -o -name "*.tsx" | \
    xargs grep -l "'use server'" 2>/dev/null) 2>/dev/null
```

検出された `redirect` / `notFound` / `forbidden` の呼び出しについて、実際のコードを Read して
`try-catch` ブロックの内側にないことを確認する。

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| Server Actions で `redirect` が try-catch 内にない | ✅ | OK / NG |
| Server Actions で `notFound` が try-catch 内にない | ✅ | OK / NG |
| エラー時は `unstable_rethrow` を使っている（try-catch 内で再スローが必要な場合） | ✅ | OK / NG / N/A |

> Server Actions がない場合はこのステップをスキップし「N/A」と記録する。

---

## ステップ 7: エラー表示コンポーネントの実装確認

設計書の `## エラー表示設計` に定義されたエラー表示箇所が UI に実装されているかを確認する。

```bash
# エラー表示コンポーネント・クラスの実装確認
grep -rn "aria-invalid\|aria-describedby\|role=\"alert\"\|text-red\|text-destructive\|FormMessage\|FieldError" \
  product/frontend/src/features/{LV1}/{LV2}/{LV3}/components/ 2>/dev/null | head -20
```

| チェック項目 | 期待値 | 結果 |
|---|---|---|
| フィールドレベルのエラー表示 | フォームの各フィールドにエラーメッセージ表示あり | OK / NG |
| フォーム全体レベルのエラー表示 | 送信失敗時のトーストまたはバナー表示あり | OK / NG |
| `aria-invalid` / `aria-describedby` などアクセシビリティ対応 | ✅ | OK / NG / N/A |

---

## ステップ 8: TypeScript コンパイルチェック

```bash
cd product/frontend && npx tsc --noEmit 2>&1 | grep -E "schema|validate|error|Error" | head -30
```

バリデーション・エラーハンドリング関連ファイルのコンパイルエラーが 0 件であることを確認する。

---

## ステップ 9: 結果レポート

以下の形式で出力する：

```
## Phase 7 バリデーション・エラーハンドリング チェック結果

### 📋 バリデーションカバレッジチェック
- 設計書のバリデーションルール数: N 件
- Zodスキーマ実装済みルール数: N 件
- 未実装のルール: （なし / {ルール名}）
- エラーメッセージ一致: ✅ / ⚠️ WARN（{不一致箇所}）
- → ✅ PASS / ❌ FAIL（未実装: {ルール名}）

### 📋 共通エラー基盤チェック（T7-3）
- `shared/utils/bff-error.ts` 存在（基盤ファイル）: ✅ / ❌
- 機能側で `bff-error.ts` を import している: ✅ / ❌
- api/ の `throw new Error` 残存: （なし / {ファイル名}）
- hooks の `console.` 残存: （なし / {ファイル名}）
- hooks の `// Phase 7` コメント残存: （なし / {ファイル名}）
- **hooks で `Sentry.captureException()` を呼んでいない**: ✅ / ❌ {ファイル名}
- hooks catch に `toast.error` または `throw` あり: ✅ / ❌
- hooks で BffApiError.code を使ったエラーコード判定あり（重度・軽微のみ）: ✅ / ❌ / N/A
- グローバル `app/error.tsx` 存在: ✅ / ❌
- 機能ルートグループの `error.tsx` カバー: ✅ / ❌
- → ✅ PASS / ❌ FAIL

### 📋 APIエラーハンドリング統一性チェック
- 設計書のAPIエラーケース数: M 件
- ハンドラー実装済みケース数: M 件
- 未対応のエラーケース: （なし / {ケース名}）
- エラーハンドリング集約: ✅ 一箇所に集約 / ❌ 分散している
- → ✅ PASS / ❌ FAIL（未対応: {ケース名}）

### 📋 Server Actions redirect 禁止パターンチェック
- redirect が try-catch 内にない: ✅ / ❌ {ファイル名:行番号}
- notFound が try-catch 内にない: ✅ / ❌ {ファイル名:行番号}
- → ✅ PASS / ❌ FAIL / N/A（Server Actions なし）

### 📋 エラー表示 UI チェック
- フィールドレベルのエラー表示: ✅ / ❌
- フォーム全体レベルのエラー表示: ✅ / ❌
- アクセシビリティ対応（aria-*）: ✅ / ❌ / N/A
- → ✅ PASS / ❌ FAIL

### 📋 TypeScript コンパイルチェック
- バリデーション・エラー関連ファイルのエラー数: N 件
- → ✅ 0 件 / ❌ N 件エラー

### 📊 サマリ
- バリデーションカバレッジ: ✅ / ❌
- APIエラーハンドリング統一: ✅ / ❌
- Server Actions redirect 禁止: ✅ / ❌ / N/A
- エラー表示 UI: ✅ / ❌
- TypeScript: ✅ / ❌
→ 総合: PASS / FAIL
```

---

## ステップ 9: Gate（FAIL がある場合のみ）

FAIL 項目がある場合：

```yaml
header: "Phase 7 FAIL"
question: "以下の未実装・エラーがあります。修正しますか？"
options:
  - "修正する（推奨）" / description: "FAIL 項目を修正してから再度テストを実行"
  - "スキップする" / description: "意図的な未実装として記録してから次フェーズへ進む"
```

「修正する」が選択された場合、FAIL 項目を修正後にステップ 1 から再実行する。

---

## 完了条件

- [ ] 設計書 `## エラー表示設計` の全バリデーションルールが Zodスキーマに実装されている
- [ ] エラーメッセージが設計書と一致している（または意図的な差異として記録済み）
- [ ] 設計書の全APIエラーケースがエラーハンドラーで対応されている
- [ ] `shared/utils/bff-error.ts` が存在し、機能側で import されている
- [ ] api/ で `classifyHttpError()` を使用している（`throw new Error` が残っていない）
- [ ] hooks で `console.log` / `console.error` が残っていない
- [ ] **hooks で `Sentry.captureException()` を呼んでいない**（axiosClient Interceptor が自動送信）
- [ ] hooks で BffApiError.code を使ったエラーコード判定が実装されている（重度・軽微エラー処理のみ）
- [ ] Server Actions 内で `redirect` / `notFound` / `forbidden` が try-catch の外にある（または N/A）
- [ ] エラー表示が UI に実装されている（フィールドレベル・フォームレベル）
- [ ] TypeScript コンパイルエラーが 0 件
- [ ] サマリが出力された
