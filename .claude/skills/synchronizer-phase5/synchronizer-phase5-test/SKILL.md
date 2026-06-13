---
name: synchronizer-phase5-test
description: Phase 5（BFF Controller 層）完了後の検証スキル。Controller カバレッジ・共通ヘッダー宣言・責務境界・テスト完備を確認する。/synchronizer の Phase 5 完了時に使用する。
---

# synchronizer-phase5-test

Phase 5（BFF Controller 層実装）完了後に実行する検証スキル。

## 検証項目

### 1. Controller カバレッジ検証

**目的**: 設計書の全エンドポイントが Controller に実装されているかを確認する。

**検証手順**:

1. 設計書（`design_detail-{機能ID}_{機能名}.md`）の `## 呼び出しAPI一覧` を読む
2. 各エンドポイント（メソッド + パス）を抽出する
3. `product/bff/src/features/{domain}/{feature}/{feature}.controller.ts` を読む
4. 各エンドポイントに対応する `@Get()` / `@Post()` / `@Put()` / `@Delete()` デコレータが存在するか確認する

**合格基準**:
- 設計書の全エンドポイントが Controller に実装されている
- エンドポイントのパス・HTTP メソッドが設計書と一致している

**不合格の場合**:
- 未実装のエンドポイントをリストアップして報告する

---

### 2. 共通ヘッダー宣言検証

**目的**: 全エンドポイントに共通ヘッダー（`x-tenant-id` / `x-correlation-id` / `authorization`）が宣言されているかを確認する。

**検証手順**:

1. `{feature}.controller.ts` の全メソッドを抽出する
2. 各メソッドの引数に以下の3つが含まれているか確認する:
   - `@Headers('x-tenant-id') tenantId: string`
   - `@Headers('x-correlation-id') correlationId: string`
   - `@Headers('authorization') authorization: string`

**検証パターン**（正規表現）:
```typescript
// 各ヘッダーの宣言パターン
const headerPatterns = {
  tenantId: /@Headers\(['"]x-tenant-id['"]\)\s+\w+:\s+string/,
  correlationId: /@Headers\(['"]x-correlation-id['"]\)\s+\w+:\s+string/,
  authorization: /@Headers\(['"]authorization['"]\)\s+\w+:\s+string/,
};
```

**合格基準**:
- 全エンドポイントに3つの共通ヘッダーが宣言されている

**不合格の場合**:
- ヘッダー宣言が不足しているエンドポイントをリストアップして報告する

---

### 3. 責務境界検証

**目的**: Controller 層が「HTTP → Service への橋渡し」のみを行っており、データ整形・ビジネスロジックを含んでいないかを確認する。

**検証手順**:

1. `{feature}.controller.ts` を読む
2. 以下のパターンが **含まれていないこと** を確認する（禁止パターン）:
   - データ整形処理（`map()` / `filter()` / `reduce()` / Object spread でのフィールド加工）
   - ビジネスロジック（条件分岐・計算処理・バリデーション）
   - 外部 API 呼び出し（`axios.get()` / `fetch()` 等）
   - データベース操作（`repository.find()` / `client.query()` 等）

**禁止パターン例**（これらが Controller に含まれていたら NG）:
```typescript
// NG: データ整形を Controller で行っている
const response = data.map(item => ({
  ...item,
  fullName: `${item.firstName} ${item.lastName}`
}));

// NG: ビジネスロジックを Controller で行っている
if (user.role === 'admin') {
  // 管理者向け処理
}

// NG: 外部 API 呼び出しを Controller で行っている
const result = await axios.get('https://example.com/api/data');
```

**合格基準**:
- Controller のメソッドが Service を呼び出しているだけである
- データ整形・ビジネスロジックが Service 層に委譲されている

**不合格の場合**:
- 禁止パターンが含まれているメソッドをリストアップして報告する

---

### 4. テスト完備検証

**目的**: Controller 統合テスト（`*.controller.test.ts`）が作成され、全エンドポイントのテストケースが含まれているかを確認する。

**検証手順**:

1. `product/bff/src/features/{domain}/{feature}/{feature}.controller.test.ts` が存在するか確認する
2. テストファイル内の `describe()` ブロックを抽出する
3. 各エンドポイントに対応する `describe()` ブロックが存在するか確認する
4. 各 `describe()` ブロック内に以下のテストケースが含まれているか確認する:
   - 正常系テスト（Service を呼び出してレスポンスを返す）
   - 異常系テスト（Service がエラーを throw した場合）

**合格基準**:
- `*.controller.test.ts` が存在する
- 全エンドポイントに対応する `describe()` ブロックがある
- 各エンドポイントに正常系・異常系のテストケースがある
- テストが全て PASS する（`npm test` で確認）

**不合格の場合**:
- テストが不足しているエンドポイントをリストアップして報告する
- テストが FAIL している場合、エラー内容を報告する

---

### 5. テスト実行

**検証手順**:

```bash
cd product/bff
npm test -- {feature}.controller.test.ts
```

**合格基準**:
- 全テストが PASS する

**不合格の場合**:
- FAIL したテストケースとエラー内容を報告する

---

## 検証実行フロー

1. Controller カバレッジ検証 → PASS/FAIL
2. 共通ヘッダー宣言検証 → PASS/FAIL
3. 責務境界検証 → PASS/FAIL
4. テスト完備検証 → PASS/FAIL
5. テスト実行 → PASS/FAIL

全ての検証が PASS したら Phase 5 完了とする。

---

## 出力フォーマット

検証結果は以下のフォーマットで報告する:

```markdown
# Phase 5 検証結果

## 1. Controller カバレッジ検証
- 結果: PASS / FAIL
- 設計書のエンドポイント数: X 個
- Controller の実装数: Y 個
- 未実装のエンドポイント: （FAILの場合のみ）

## 2. 共通ヘッダー宣言検証
- 結果: PASS / FAIL
- ヘッダー宣言が不足しているエンドポイント: （FAILの場合のみ）

## 3. 責務境界検証
- 結果: PASS / FAIL
- 禁止パターンが含まれているメソッド: （FAILの場合のみ）

## 4. テスト完備検証
- 結果: PASS / FAIL
- テストが不足しているエンドポイント: （FAILの場合のみ）

## 5. テスト実行
- 結果: PASS / FAIL
- FAIL したテストケース: （FAILの場合のみ）

---

## 総合判定
- Phase 5 検証: PASS / FAIL
- 次のステップ: Phase 6（Module 登録）へ進む / Phase 5 の修正が必要
```

---

## 参照

| 参照先 | 内容 |
|--------|------|
| `.claude/commands/synchronizer.md` | Phase 5 の完了条件 |
| `.claude/rules/cross-layer-rules.md` | Controller 層の禁止事項 |
| `docs/02_アプリ基盤/01_フロントエンド・BFF/02_詳細設計書/new/10.BFF設計.md` | Controller 層の責務定義 |
| `{design_detail}` | `## 呼び出しAPI一覧` |
