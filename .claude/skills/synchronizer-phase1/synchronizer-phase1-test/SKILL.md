---
name: synchronizer-phase1-test
description: synchronizer Phase 1（型定義）完了後の検証スキル。FE実装がある場合は実装コードとの型整合性を確認し、front_bff_shared と BE の型定義が一致しているかを検証する。TRIGGER when: synchronizer Phase 1（S1-0〜S1-5）が全タスク完了したとき。DO NOT TRIGGER when: Phase 1 未完了のとき、または他の Phase を実行中のとき。
---

# synchronizer-phase1-test: Phase 1 型定義 検証

Phase 1（S1-0〜S1-5）の全タスクが完了したら、このスキルを実行する。
目的は「FE実装が使用する型と front_bff_shared / BE の型が一致しているか」を確認すること。

---

## ステップ 1: FE実装の存在確認

### 1-1: FE実装フォルダの確認

```bash
# 対象機能のフロントエンド実装フォルダを確認
ls -la product/frontend/src/features/{domain}/{LV2}/{LV3}/
```

**確認項目:**

| フォルダ | 存在 | 備考 |
|---------|------|------|
| `api/` | Yes / No | BFF通信関数（必須） |
| `repository/` | Yes / No | 複合API呼び出し |
| `hooks/` | Yes / No | カスタムフック |
| `types/` | Yes / No | ViewModel型 |

**判定:**
- `api/` フォルダが存在する → **FE実装あり（型整合性確認が必要）**
- `api/` フォルダが存在しない → **FE実装なし（型定義のみの検証）**

---

## ステップ 2: FE実装がある場合 — 型整合性確認

### 2-1: api/ 層の型インポート確認

```bash
# api/ 配下の全ファイルを列挙
ls -la product/frontend/src/features/{domain}/{LV2}/{LV3}/api/

# 各ファイルの型インポートを確認
grep -n "^import type" product/frontend/src/features/{domain}/{LV2}/{LV3}/api/*.ts
```

**出力形式:**

```
## api/ 層の型インポート一覧

| ファイル | インポート型 | インポート元パス |
|---------|------------|----------------|
| getTemplates.api.ts | TemplatesResponse | @front_bff_shared/features/{domain}/{LV2}/{LV3}/types/responses/... |
| getFavorites.api.ts | FavoritesResponse | @front_bff_shared/features/{domain}/{LV2}/{LV3}/types/responses/... |
| postSchema.api.ts | SchemaSaveRequest, SchemaSaveResponse | @front_bff_shared/features/{domain}/{LV2}/{LV3}/types/... |
...（全ファイル）
```

### 2-2: front_bff_shared の型定義の存在確認

```bash
# FE実装がインポートしているパスの型定義が実在するか確認
find product/front_bff_shared -path "*{domain}*{LV3}*" -name "*.request.ts" -o -name "*.response.ts"
```

**確認項目:**

| 項目 | 確認方法 | 結果 |
|------|----------|------|
| **インポート元パスの実在** | FE実装の `@front_bff_shared` パスが実在するか | ✅ / ❌ |
| **Request型ファイルの存在** | `types/requests/{機能名}.request.ts` が存在するか | ✅ / ❌ |
| **Response型ファイルの存在** | `types/responses/{機能名}.response.ts` が存在するか | ✅ / ❌ |

### 2-3: 型定義の構造比較

**ステップ A**: FE実装が使用する型をリスト化

```bash
# api/ 層がインポートする型名を抽出
grep "^import type {" product/frontend/src/features/{domain}/{LV2}/{LV3}/api/*.ts | \
  sed 's/.*{ \(.*\) }.*/\1/' | \
  tr ',' '\n' | \
  sort -u
```

**ステップ B**: front_bff_shared の型定義を Read

```bash
# Request型定義を確認
# product/front_bff_shared/features/{domain}/{LV2}/{LV3}/types/requests/{機能名}.request.ts

# Response型定義を確認
# product/front_bff_shared/features/{domain}/{LV2}/{LV3}/types/responses/{機能名}.response.ts
```

**ステップ C**: 型の構造を比較

各型について以下を確認:

| 型名 | フィールド数 | フィールド名 | 型の一致 | 結果 |
|------|-------------|-------------|---------|------|
| `SchemaSaveRequest` | 2 | `canvasJson`, `thumbnailBase64` | `string`, `string` | ✅ / ❌ |
| `SchemaSaveResponse` | 2 | `schemaUuid`, `savedAt` | `string`, `string` | ✅ / ❌ |
| `TemplatesResponse` | 2 | `templates`, `favoriteTemplateIds` | `TemplateItem[]`, `string[]` | ✅ / ❌ |
...（全型）

**不一致パターンの検出:**

| パターン | 例 | 判定 |
|---------|----|----|
| **フィールド名の不一致** | FE実装: `canvasJson` / front_bff_shared: `imageData` | ❌ FAIL |
| **フィールド数の不一致** | FE実装: 2フィールド / front_bff_shared: 4フィールド | ❌ FAIL |
| **ネスト構造の不一致** | FE実装: `templates[]` 分離 / front_bff_shared: `templates[].isFavorite` 統合 | ❌ FAIL |
| **型の不一致** | FE実装: `string` / front_bff_shared: `number` | ❌ FAIL |

### 2-4: repository/ 層の型使用確認

```bash
# repository/ の実装を確認
ls -la product/frontend/src/features/{domain}/{LV2}/{LV3}/repository/

# 型インポートと戻り値の型を確認
grep -n "^import type\|Promise<" product/frontend/src/features/{domain}/{LV2}/{LV3}/repository/*.ts
```

**確認項目:**

| 項目 | 確認方法 | 期待値 | 結果 |
|------|----------|--------|------|
| **api/ 関数のインポート** | `import { get{Resource} } from '../api/get{Resource}.api'` | すべてインポート | ✅ / ❌ |
| **戻り値の型** | `Promise<{ResourceName}Response>` | front_bff_shared の型と一致 | ✅ / ❌ |
| **型変換の有無** | BFF レスポンス → ViewModel への変換 | 必要に応じて実装 | ✅ / N/A |

---

## ステップ 3: BE型定義の整合性確認

### 3-1: BE型定義ファイルの確認

```bash
# BE型定義ファイルの存在確認
find product/backend/KarteDomainService/Features -name "*Models.cs" | grep -i "{domain}"
```

### 3-2: BE型定義のリスト化

```bash
# BE型定義を抽出
grep -n "public sealed record\|public record" product/backend/KarteDomainService/Features/{Domain}/Models/{機能名}Models.cs
```

**出力例:**

```
## BE型定義一覧

| 行番号 | 型名 | 用途 |
|-------|------|------|
| 6 | SchemaSaveRequest | POST /api/schemas リクエスト |
| 16 | SchemaUpdateRequest | PUT /api/schemas/{schemaUuid} リクエスト |
| 23 | SchemaSaveResponse | POST /api/schemas レスポンス |
| 31 | SchemaGetResponse | GET /api/schemas/{schemaUuid} レスポンス |
...（全型）
```

### 3-3: BE型と front_bff_shared の型を比較

**ステップ A**: front_bff_shared の型を Read

```bash
# Request型を Read
# product/front_bff_shared/features/{domain}/{LV2}/{LV3}/types/requests/{機能名}.request.ts

# Response型を Read
# product/front_bff_shared/features/{domain}/{LV2}/{LV3}/types/responses/{機能名}.response.ts
```

**ステップ B**: BE型定義を Read

```bash
# BE型定義を Read
# product/backend/KarteDomainService/Features/{Domain}/Models/{機能名}Models.cs
```

**ステップ C**: 型の構造を比較（命名規則の変換を考慮）

| 型名 | front_bff_shared フィールド | BE (C#) フィールド | 命名規則変換 | 型の一致 | 結果 |
|------|----------------------------|-------------------|-------------|---------|------|
| `SchemaSaveRequest` | `canvasJson: string` | `CanvasJson: string` | ✅ camelCase → PascalCase | ✅ | ✅ PASS |
| `SchemaSaveRequest` | `thumbnailBase64: string` | `ThumbnailBase64: string` | ✅ camelCase → PascalCase | ✅ | ✅ PASS |
| `TemplatesResponse` | `templates: TemplateItem[]` | `Templates: List<TemplateItem>` | ✅ PascalCase | ✅ | ✅ PASS |
...（全フィールド）

**命名規則変換ルール:**

| TypeScript | C# | 正しい変換例 |
|-----------|----|----|
| `camelCase` | `PascalCase` | `canvasJson` → `CanvasJson` ✅ |
| `templateId` | `TemplateId` | `templateId` → `TemplateId` ✅ |
| `isFavorite` | `IsFavorite` | `isFavorite` → `IsFavorite` ✅ |

**不一致パターンの検出:**

| パターン | 例 | 判定 |
|---------|----|----|
| **命名規則違反** | TypeScript: `canvasJson` / C#: `canvasjson` | ❌ FAIL |
| **フィールド名の不一致** | TypeScript: `canvasJson` / C#: `ImageData` | ❌ FAIL |
| **フィールド数の不一致** | TypeScript: 2フィールド / C#: 4フィールド | ⚠️ WARNING（理由を確認） |
| **型の不一致** | TypeScript: `string` / C#: `int` | ❌ FAIL |

---

## ステップ 4: TypeScript コンパイルチェック

### 4-1: front_bff_shared のコンパイル

```bash
# front_bff_shared のコンパイルチェック
cd product/frontend && npx tsc --noEmit 2>&1 | grep "front_bff_shared" | head -20
```

**期待値:** エラー 0 件

### 4-2: api/ / repository/ のコンパイル

```bash
# api/ と repository/ のコンパイルチェック
cd product/frontend && npx tsc --noEmit 2>&1 | grep -E "api/|repository/" | head -30
```

**期待値:** エラー 0 件

### 4-3: 型推論の一致確認（Zodスキーマ）

```bash
# Zodスキーマの型推論を確認
grep -A5 "z.infer" product/front_bff_shared/features/{domain}/{LV2}/{LV3}/schemas/{機能名}.schema.ts
```

**確認項目:**

| 項目 | 確認方法 | 結果 |
|------|----------|------|
| **Zodスキーマの存在** | `{機能名}.schema.ts` が存在するか | ✅ / ❌ |
| **型推論の定義** | `z.infer<typeof schema>` が定義されているか | ✅ / ❌ |
| **型推論の一致** | TypeScript 型定義と Zod スキーマが一致するか | ✅ / ❌ |

---

## ステップ 5: FE実装がない場合 — 型定義のみの検証

**FE実装がない場合（api/ フォルダが存在しない場合）は以下を確認:**

### 5-1: front_bff_shared の型定義の存在確認

```bash
# front_bff_shared の型定義が存在するか確認
ls -la product/front_bff_shared/features/{domain}/{LV2}/{LV3}/types/requests/
ls -la product/front_bff_shared/features/{domain}/{LV2}/{LV3}/types/responses/
```

**確認項目:**

| 項目 | 結果 |
|------|------|
| `types/requests/{機能名}.request.ts` | ✅ / ❌ |
| `types/responses/{機能名}.response.ts` | ✅ / ❌ |

### 5-2: BE型定義との整合性確認（ステップ 3 と同じ）

FE実装がない場合でも、BE型定義と front_bff_shared の型が一致しているかを確認する。

---

## ステップ 6: 結果レポート

以下の形式で出力する：

```
## Phase 1 型定義 チェック結果

### 📋 FE実装の存在確認
- api/ フォルダ: ✅ 存在 / ❌ 存在しない
- repository/ フォルダ: ✅ 存在 / ❌ 存在しない
- hooks/ フォルダ: ✅ 存在 / ❌ 存在しない
- types/ フォルダ: ✅ 存在 / ❌ 存在しない

### 📋 FE実装がある場合 — 型整合性確認

#### api/ 層の型インポート
- api/ ファイル数: N 件
- 型インポート総数: N 件
- インポート元パスの実在: ✅ すべて存在 / ❌ 不在あり

#### 型定義の構造比較
| 型名 | フィールド数 | front_bff_shared | FE実装 | 結果 |
|------|-------------|-----------------|--------|------|
| SchemaSaveRequest | 2 | ✅ 一致 | ✅ 使用中 | ✅ PASS |
| SchemaSaveResponse | 2 | ✅ 一致 | ✅ 使用中 | ✅ PASS |
| TemplatesResponse | 2 | ❌ 不一致 | ✅ 使用中 | ❌ FAIL |
...（全型）

**不一致の詳細:**
- TemplatesResponse: FE実装は `favoriteTemplateIds: string[]` を期待するが、front_bff_shared では `templates[].isFavorite: boolean` に統合されている

#### repository/ 層の型使用
- repository/ ファイル数: N 件
- api/ 関数のインポート: ✅ すべて経由 / ❌ 直接 fetch あり
- 戻り値の型: ✅ 一致 / ❌ 不一致

### 📋 BE型定義の整合性確認

#### BE型定義一覧
- BE型定義ファイル: `product/backend/KarteDomainService/Features/{Domain}/Models/{機能名}Models.cs`
- BE型定義数: N 件

#### BE型と front_bff_shared の比較
| 型名 | front_bff_shared | BE (C#) | 命名規則 | 型の一致 | 結果 |
|------|-----------------|---------|---------|---------|------|
| SchemaSaveRequest | canvasJson | CanvasJson | ✅ | ✅ | ✅ PASS |
| SchemaSaveRequest | thumbnailBase64 | ThumbnailBase64 | ✅ | ✅ | ✅ PASS |
| TemplatesResponse | templates | Templates | ✅ | ✅ | ✅ PASS |
...（全フィールド）

**不一致の詳細:**
- （不一致がある場合のみ記載）

### 📋 TypeScript コンパイルチェック
- front_bff_shared エラー数: N 件
- api/ エラー数: N 件
- repository/ エラー数: N 件
- → ✅ 0 件 / ❌ N 件エラー

### 📋 Zodスキーマ確認
- Zodスキーマファイル: ✅ 存在 / ❌ 存在しない
- 型推論の定義: ✅ あり / ❌ なし
- 型推論の一致: ✅ 一致 / ❌ 不一致

### 📊 サマリ
- FE実装と front_bff_shared の整合性: ✅ / ❌
- BE型定義と front_bff_shared の整合性: ✅ / ❌
- TypeScript コンパイル: ✅ / ❌
- Zodスキーマ: ✅ / ❌
→ 総合: PASS / FAIL
```

---

## ステップ 7: Gate（FAIL がある場合のみ）

FAIL 項目がある場合：

```yaml
header: "Phase 1 FAIL"
question: "以下の型不一致・エラーがあります。修正しますか？"
options:
  - "修正する（推奨）" / description: "FAIL 項目を修正してから再度テストを実行"
  - "スキップする" / description: "意図的な不一致として記録してから次フェーズへ進む"
```

「修正する」が選択された場合、FAIL 項目を修正後にステップ 1 から再実行する。

---

## 完了条件

### FE実装がある場合

- [ ] FE実装の api/ 層がインポートする型が front_bff_shared に存在する
- [ ] FE実装が使用する型と front_bff_shared の型が一致している
- [ ] repository/ が api/ 関数を経由している（直接 fetch なし）
- [ ] BE型定義と front_bff_shared の型が一致している（命名規則変換を考慮）
- [ ] TypeScript コンパイルエラーが 0 件
- [ ] Zodスキーマの型推論が TypeScript 型定義と一致している
- [ ] サマリが出力された

### FE実装がない場合

- [ ] front_bff_shared の型定義ファイルが存在する
- [ ] BE型定義と front_bff_shared の型が一致している（命名規則変換を考慮）
- [ ] TypeScript コンパイルエラーが 0 件
- [ ] Zodスキーマの型推論が TypeScript 型定義と一致している
- [ ] サマリが出力された

---

## 次のステップ

Phase 1-test が PASS したら Phase 2（BFF Controller 層）に進む。
FAIL 項目がある場合は修正後に再度このスキルを実行する。
