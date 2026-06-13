---
name: synchronizer-phase5
description: BFF Controller 層実装（S5-1〜S5-2）。/synchronizer コマンドの Phase 5 で使用する。エンドポイント定義・共通ヘッダー受け取り・Service 呼び出し・Controller 統合テスト作成を実行する。
---

# synchronizer-phase5

BFF Controller 層の実装を行う。Phase 5 のタスク（S5-1〜S5-2）を完了させる。

## タスク一覧

### S5-1: `*.controllers.ts` 実装

**目的**: NestJS Controller 層を実装し、HTTP エンドポイントを定義する。

**実装内容**:

1. **エンドポイント定義**
   - 設計書の `## 呼び出しAPI一覧` からエンドポイントを実装
   - HTTP メソッド（GET / POST / PUT / DELETE）を適切に使用
   - パスパラメータ（`@Param()`）とリクエストボディ（`@Body()`）を定義

2. **共通ヘッダーの受け取り**
   - **全エンドポイントに以下のヘッダーを宣言する**（必須）:
     ```typescript
     @Headers('x-tenant-id') tenantId: string
     @Headers('x-correlation-id') correlationId: string
     @Headers('authorization') authorization: string
     ```
   - これらはフロントエンドの `axiosClient.ts` から送られるヘッダー
   - Service 層に渡す必要があるヘッダーのみを引数として渡す

3. **Service 呼び出し**
   - Controller の責務は「HTTP → Service への橋渡し」のみ
   - **データ整形・ビジネスロジックは Service 層で行う**（Controller には書かない）
   - HTTP レスポンスのステータスコード・ヘッダー設定は Controller で行う

4. **エラーハンドリング**
   - Service 層から throw されたエラーは NestJS の例外フィルターが処理する
   - Controller 内で try-catch を書く必要はない（フィルターに任せる）

**実装パターン**:

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, Headers, Inject, HttpCode, HttpStatus } from '@nestjs/common';
import { FeatureService } from '@/features/{domain}/{feature}/{feature}.service';
import { CreateRequest } from '@/features/{domain}/{feature}/types/{feature}.api.request';
import { FeatureResponse } from '@/front_bff_shared/features/{domain}/{feature}/types/responses/{feature}.response';

@Controller('{feature}')
export class FeatureController {
  constructor(
    @Inject(FeatureService) private readonly featureService: FeatureService
  ) {}

  // GET エンドポイントの例
  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-correlation-id') correlationId: string,
    @Headers('authorization') authorization: string
  ): Promise<FeatureResponse> {
    return await this.featureService.getById(id, tenantId);
  }

  // POST エンドポイントの例
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() request: CreateRequest,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-correlation-id') correlationId: string,
    @Headers('authorization') authorization: string
  ): Promise<FeatureResponse> {
    return await this.featureService.create(request, tenantId);
  }

  // DELETE エンドポイントの例
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-correlation-id') correlationId: string,
    @Headers('authorization') authorization: string
  ): Promise<void> {
    await this.featureService.delete(id, tenantId);
  }
}
```

**配置ルール**:
- ファイルパス: `product/bff/src/features/{domain}/{feature}/{feature}.controller.ts`
- 命名規則: `{Feature}Controller` クラス名（PascalCase）

**禁止事項**（`.claude/rules/cross-layer-rules.md` 参照）:
- Service 層の処理を Controller に書くこと（データ整形・マッピング処理は Service 層）
- HTTP レスポンス操作（status / header 設定）を Service 層に書くこと

---

### S5-2: Controller 統合テスト

**目的**: Controller 層の HTTP エンドポイントが正しく動作するかをテストする。

**実装内容**:

1. **テストファイル作成**
   - ファイルパス: `product/bff/src/features/{domain}/{feature}/{feature}.controller.test.ts`
   - Service 層をモックして Controller のみをテストする

2. **テストケース**
   - 各エンドポイントに対して以下をテスト:
     - 正常系: 正しいリクエストで Service が呼ばれること
     - 異常系（バリデーション失敗）: 400 Bad Request が返ること
     - 異常系（Service エラー）: Service が throw したエラーがフィルターで処理されること

3. **テストパターン**:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';

describe('FeatureController', () => {
  let controller: FeatureController;
  let service: FeatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureController],
      providers: [
        {
          provide: FeatureService,
          useValue: {
            getById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FeatureController>(FeatureController);
    service = module.get<FeatureService>(FeatureService);
  });

  describe('GET /:id', () => {
    it('正常系: Service を呼び出してレスポンスを返す', async () => {
      const mockResponse = { id: '123', name: 'test' };
      jest.spyOn(service, 'getById').mockResolvedValue(mockResponse);

      const result = await controller.getById('123', 'tenant-1', 'corr-1', 'Bearer token');

      expect(service.getById).toHaveBeenCalledWith('123', 'tenant-1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('POST /', () => {
    it('正常系: Service を呼び出してレスポンスを返す', async () => {
      const mockRequest = { name: 'new item' };
      const mockResponse = { id: '456', name: 'new item' };
      jest.spyOn(service, 'create').mockResolvedValue(mockResponse);

      const result = await controller.create(mockRequest, 'tenant-1', 'corr-1', 'Bearer token');

      expect(service.create).toHaveBeenCalledWith(mockRequest, 'tenant-1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE /:id', () => {
    it('正常系: Service を呼び出す', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await controller.delete('123', 'tenant-1', 'corr-1', 'Bearer token');

      expect(service.delete).toHaveBeenCalledWith('123', 'tenant-1');
    });
  });
});
```

**テスト実行**:
```bash
cd product/bff
npm test -- {feature}.controller.test.ts
```

---

## 完了条件

Phase 5 は以下が全て完了したら完了とする:

- [ ] S5-1: `*.controllers.ts` 実装完了
  - 設計書の全エンドポイントが実装されている
  - 全エンドポイントに共通ヘッダー（x-tenant-id / x-correlation-id / authorization）が宣言されている
  - Service 層を呼び出している（データ整形は Service で行っている）
- [ ] S5-2: Controller 統合テスト完了
  - `*.controller.test.ts` が作成されている
  - 全エンドポイントのテストケース（正常系・異常系）がある
  - テストが全て PASS する

完了後、`.steering/sync-{date}-{feature}/state.md` を更新する:

```yaml
feature: "{domain}/Fxx_機能名"
phase: synchronizer
progress: "Phase 5 完了。次は Phase 6（S6-1: Module 登録）から"
last_updated: "YYYY-MM-DD"
completed_phases:
  - "Phase 5: BFF Controller 層 ✅ YYYY-MM-DD"
```

---

## 参照

| 参照先 | 内容 |
|--------|------|
| `.claude/commands/synchronizer.md` | Phase 5 の詳細手順 |
| `.claude/rules/cross-layer-rules.md` | Controller 層の禁止事項 |
| `docs/02_アプリ基盤/01_フロントエンド・BFF/02_詳細設計書/new/10.BFF設計.md` | `## レイヤーの責務定義` > `### Controller 層` |
| `product/bff/src/features/patient/patient.controller.ts` | 実装例 |
| `{design_detail}` | `## 呼び出しAPI一覧`（実装対象のエンドポイント） |
