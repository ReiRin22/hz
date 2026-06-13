---
name: synchronizer-phase6-test
description: Phase 6（Module 登録）完了後の検証スキル。モジュールファイル存在・providers/controllers 登録・app.module.ts インポート・ビルド成功を確認する。/synchronizer の Phase 6 完了時に使用する。
---

# synchronizer-phase6-test

Phase 6（Module 登録）完了後に実行する検証スキル。

## 検証項目

### 1. モジュールファイル存在検証

**目的**: 機能モジュールファイル（`*.module.ts`）が正しいパスに作成されているかを確認する。

**検証手順**:

1. 以下のパスにモジュールファイルが存在するか確認する:
   ```
   product/bff/src/features/{domain}/{feature}/{feature}.module.ts
   ```

**合格基準**:
- モジュールファイルが存在する

**不合格の場合**:
- ファイルが存在しないことを報告する

---

### 2. モジュール定義検証

**目的**: モジュールファイルに Controller / Service / Client が正しく登録されているかを確認する。

**検証手順**:

1. `{feature}.module.ts` を読む
2. `@Module()` デコレータが存在するか確認する
3. `controllers` 配列に Controller が登録されているか確認する
4. `providers` 配列に Service と Client が登録されているか確認する

**検証パターン**:

```typescript
// 必須パターン
@Module({
  controllers: [FeatureController],  // Controller が登録されている
  providers: [
    FeatureService,  // Service が登録されている
    FeatureClient    // Client が登録されている
  ],
})
export class FeatureModule {}
```

**合格基準**:
- `@Module()` デコレータが存在する
- `controllers` 配列に Controller が登録されている
- `providers` 配列に Service と Client が登録されている

**不合格の場合**:
- 不足している登録をリストアップして報告する

---

### 3. インポート文検証

**目的**: モジュールファイルに必要なインポート文が全て含まれているかを確認する。

**検証手順**:

1. `{feature}.module.ts` を読む
2. 以下のインポート文が存在するか確認する:
   - `import { Module } from '@nestjs/common';`
   - `import { FeatureController } from '@/features/{domain}/{feature}/{feature}.controller';`
   - `import { FeatureService } from '@/features/{domain}/{feature}/{feature}.service';`
   - `import { FeatureClient } from '@/features/{domain}/{feature}/{feature}.client';`

**合格基準**:
- 全ての必須インポート文が存在する

**不合格の場合**:
- 不足しているインポート文をリストアップして報告する

---

### 4. app.module.ts インポート検証

**目的**: 作成したモジュールが `app.module.ts` に登録されているかを確認する。

**検証手順**:

1. `product/bff/src/app.module.ts` を読む
2. 作成したモジュールのインポート文が存在するか確認する:
   ```typescript
   import { FeatureModule } from '@/features/{domain}/{feature}/{feature}.module';
   ```
3. `@Module()` デコレータの `imports` 配列に登録されているか確認する:
   ```typescript
   @Module({
     imports: [
       // ...他のモジュール
       FeatureModule,  // ← ここに登録されている
     ],
   })
   ```

**合格基準**:
- モジュールのインポート文が存在する
- `imports` 配列に登録されている

**不合格の場合**:
- インポート文または `imports` 配列への登録が不足していることを報告する

---

### 5. 依存モジュール検証（該当する場合のみ）

**目的**: 機能が共通マスタや他のモジュールに依存している場合、それらが正しくインポートされているかを確認する。

**検証手順**:

1. `.steering/sync-{date}-{feature}/api-analysis.md` の `## 依存する共通マスタ一覧` を読む
2. 依存マスタがリストアップされている場合、`{feature}.module.ts` の `imports` 配列に該当モジュールが登録されているか確認する

**検証パターン**:

```typescript
import { TestItemMasterModule } from '@/shared/master/test-item-master/test-item-master.module';

@Module({
  imports: [TestItemMasterModule],  // ← 依存マスタモジュールがインポートされている
  controllers: [FeatureController],
  providers: [FeatureService, FeatureClient],
})
export class FeatureModule {}
```

**合格基準**:
- 依存マスタがある場合、全ての依存モジュールが `imports` 配列に登録されている
- 依存マスタがない場合、この検証はスキップ

**不合格の場合**:
- 不足している依存モジュールをリストアップして報告する

---

### 6. ビルド検証

**目的**: モジュール登録後に BFF プロジェクトがビルドできるかを確認する。

**検証手順**:

```bash
cd product/bff
npm run build
```

**合格基準**:
- ビルドが成功する（exit code 0）
- ビルドエラーが出ない

**不合格の場合**:
- ビルドエラーの内容を報告する
- エラーの原因（インポートパス誤り・循環依存・型エラー等）を特定する

---

## 検証実行フロー

1. モジュールファイル存在検証 → PASS/FAIL
2. モジュール定義検証 → PASS/FAIL
3. インポート文検証 → PASS/FAIL
4. app.module.ts インポート検証 → PASS/FAIL
5. 依存モジュール検証 → PASS/FAIL/SKIP
6. ビルド検証 → PASS/FAIL

全ての検証が PASS したら Phase 6 完了とする。

---

## 出力フォーマット

検証結果は以下のフォーマットで報告する:

```markdown
# Phase 6 検証結果

## 1. モジュールファイル存在検証
- 結果: PASS / FAIL
- ファイルパス: `product/bff/src/features/{domain}/{feature}/{feature}.module.ts`
- 存在確認: ✅ / ❌

## 2. モジュール定義検証
- 結果: PASS / FAIL
- `@Module()` デコレータ: ✅ / ❌
- `controllers` 配列: ✅ / ❌
- `providers` 配列: ✅ / ❌
- 不足している登録: （FAILの場合のみ）

## 3. インポート文検証
- 結果: PASS / FAIL
- 不足しているインポート文: （FAILの場合のみ）

## 4. app.module.ts インポート検証
- 結果: PASS / FAIL
- インポート文: ✅ / ❌
- `imports` 配列への登録: ✅ / ❌

## 5. 依存モジュール検証
- 結果: PASS / FAIL / SKIP
- 依存マスタ一覧: （該当する場合のみ）
- 不足している依存モジュール: （FAILの場合のみ）

## 6. ビルド検証
- 結果: PASS / FAIL
- ビルドエラー: （FAILの場合のみ）

---

## 総合判定
- Phase 6 検証: PASS / FAIL
- 次のステップ: Phase 7（FE API 層実装）へ進む / Phase 6 の修正が必要
```

---

## トラブルシューティング

### FAIL: "Cannot find module"

**原因**: インポートパスが間違っている

**解決方法**:
- `@/features/{domain}/{feature}` のパス指定を確認する
- `tsconfig.json` の `paths` 設定を確認する

### FAIL: "Circular dependency detected"

**原因**: モジュール間の循環依存が発生している

**解決方法**:
- `imports` 配列に不要なモジュールが含まれていないか確認する
- 循環依存の原因となっているモジュールを特定し、依存関係を整理する

### FAIL: "Provider is not exported"

**原因**: 他のモジュールから使用される Service が `exports` に登録されていない

**解決方法**:
- 使用される側のモジュールで `exports: [FeatureService]` を追加する

---

## 参照

| 参照先 | 内容 |
|--------|------|
| `.claude/commands/synchronizer.md` | Phase 6 の完了条件 |
| `.claude/skills/synchronizer-phase6/SKILL.md` | Phase 6 の実装手順 |
| `docs/02_アプリ基盤/01_フロントエンド・BFF/02_詳細設計書/new/00.ディレクトリ構成.md` | `### BFF` > `(機能名).module.ts` |
| `.steering/sync-{date}-{feature}/api-analysis.md` | `## 依存する共通マスタ一覧` |
