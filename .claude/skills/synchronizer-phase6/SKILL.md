---
name: synchronizer-phase6
description: Module 登録（S6-1〜S6-2）。/synchronizer コマンドの Phase 6 で使用する。NestJS モジュールへの Controller / Service / Client 登録と app.module.ts へのインポートを実行する。
---

# synchronizer-phase6

NestJS モジュールへの登録を行う。Phase 6 のタスク（S6-1〜S6-2）を完了させる。

## タスク一覧

### S6-1: `*.module.ts` 作成

**目的**: 機能ごとの NestJS モジュールを作成し、Controller / Service / Client を登録する。

**実装内容**:

1. **モジュールファイル作成**
   - ファイルパス: `product/bff/src/features/{domain}/{feature}/{feature}.module.ts`
   - 命名規則: `{Feature}Module` クラス名（PascalCase）

2. **モジュール定義**
   - `@Module()` デコレータを使用
   - `controllers` 配列に Controller を登録
   - `providers` 配列に Service と Client を登録

3. **実装パターン**:

```typescript
import { Module } from '@nestjs/common';
import { FeatureController } from '@/features/{domain}/{feature}/{feature}.controller';
import { FeatureService } from '@/features/{domain}/{feature}/{feature}.service';
import { FeatureClient } from '@/features/{domain}/{feature}/{feature}.client';

@Module({
  controllers: [FeatureController],
  providers: [
    FeatureService,
    FeatureClient
  ],
})
export class FeatureModule {}
```

**依存モジュールがある場合**（例: 共通マスタを使用する場合）:

```typescript
import { Module } from '@nestjs/common';
import { FeatureController } from '@/features/{domain}/{feature}/{feature}.controller';
import { FeatureService } from '@/features/{domain}/{feature}/{feature}.service';
import { FeatureClient } from '@/features/{domain}/{feature}/{feature}.client';
import { TestItemMasterModule } from '@/shared/master/test-item-master/test-item-master.module';

@Module({
  imports: [TestItemMasterModule],  // 依存する共通マスタモジュールをインポート
  controllers: [FeatureController],
  providers: [
    FeatureService,
    FeatureClient
  ],
})
export class FeatureModule {}
```

**エクスポートが必要な場合**（他のモジュールから使用される場合）:

```typescript
@Module({
  controllers: [FeatureController],
  providers: [
    FeatureService,
    FeatureClient
  ],
  exports: [FeatureService],  // 他のモジュールから使用される Service をエクスポート
})
export class FeatureModule {}
```

**配置ルール**:
- ファイルパス: `product/bff/src/features/{domain}/{feature}/{feature}.module.ts`
- 1機能 = 1モジュール

---

### S6-2: `app.module.ts` へのインポート確認

**目的**: 作成したモジュールを `app.module.ts` にインポートし、NestJS アプリケーションに登録する。

**実装内容**:

1. **`app.module.ts` の編集**
   - ファイルパス: `product/bff/src/app.module.ts`
   - 作成したモジュールを `imports` 配列に追加する

2. **実装パターン**:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// 既存のモジュール
import { BulletinsModule } from '@/features/bulletins/bulletins.module';
import { PatientModule } from '@/features/patient/patient.module';
import { DepartmentsModule } from '@/features/departments/departments.module';

// 新規追加するモジュール
import { FeatureModule } from '@/features/{domain}/{feature}/{feature}.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
    }),
    
    // 既存のモジュール
    BulletinsModule,
    PatientModule,
    DepartmentsModule,
    
    // 新規追加するモジュール
    FeatureModule,  // ← ここに追加
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

**注意点**:
- `imports` 配列の最後に追加する（既存のモジュールの後）
- インポート文も追加する（ファイル上部）

**確認方法**:
```bash
cd product/bff
npm run build
```

ビルドエラーが出ないことを確認する。エラーが出た場合はインポートパスや依存関係を修正する。

---

## 完了条件

Phase 6 は以下が全て完了したら完了とする:

- [ ] S6-1: `*.module.ts` 作成完了
  - モジュールファイルが作成されている
  - Controller / Service / Client が登録されている
  - 依存モジュールがある場合は `imports` に登録されている
- [ ] S6-2: `app.module.ts` へのインポート完了
  - `app.module.ts` の `imports` 配列に追加されている
  - インポート文が追加されている
  - `npm run build` でビルドエラーが出ない

完了後、`.steering/sync-{date}-{feature}/state.md` を更新する:

```yaml
feature: "{domain}/Fxx_機能名"
phase: synchronizer
progress: "Phase 6 完了。次は Phase 7（S7-1: FE API 層実装）から"
last_updated: "YYYY-MM-DD"
completed_phases:
  - "Phase 5: BFF Controller 層 ✅ YYYY-MM-DD"
  - "Phase 6: Module 登録 ✅ YYYY-MM-DD"
```

---

## トラブルシューティング

### ビルドエラー: "Cannot find module"

**原因**: インポートパスが間違っている

**解決方法**:
- `@/features/{domain}/{feature}` のパス指定を確認する
- `tsconfig.json` の `paths` 設定を確認する（`@/*` が `src/*` にマッピングされているか）

### ビルドエラー: "Circular dependency detected"

**原因**: モジュール間の循環依存が発生している

**解決方法**:
- `imports` 配列に不要なモジュールが含まれていないか確認する
- `exports` が必要なモジュールのみをエクスポートする
- 循環依存が発生している場合は、中間モジュールを作成して依存関係を整理する

### ビルドエラー: "Provider is not exported"

**原因**: 他のモジュールから使用される Service が `exports` に登録されていない

**解決方法**:
- 使用される側のモジュールで `exports: [FeatureService]` を追加する
- 使用する側のモジュールで `imports: [FeatureModule]` を追加する

---

## 参照

| 参照先 | 内容 |
|--------|------|
| `.claude/commands/synchronizer.md` | Phase 6 の詳細手順 |
| `docs/02_アプリ基盤/01_フロントエンド・BFF/02_詳細設計書/new/00.ディレクトリ構成.md` | `### BFF` > `(機能名).module.ts` |
| `product/bff/src/features/patient/patient.module.ts` | 実装例 |
| `product/bff/src/app.module.ts` | app.module.ts の構造 |
