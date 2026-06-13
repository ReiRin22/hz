import { Controller, Post, Get, Param, Query, Body, Headers, Inject, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { TestResultsService } from '@/features/execution/test-results/test-results.service';
import { TestResultSaveRequestSchema } from '@/features/execution/test-results/schemas/test-results-save.schema';
import type {
  TestResultsInitialResponse,
  TestItemSearchResponse,
  ModificationReasonResponse,
  TestResultSaveResponse,
} from '@/front_bff_shared/execution/test-results/types/test-results.api.response';
import type { TestResultSaveRequest } from '@/front_bff_shared/execution/test-results/types/test-results.api.request';

// JWT Middleware が req.user にセットする想定（現在はヘッダから仮取得）
type JwtUser = { sub: string; name: string };

function extractUser(authHeader: string | undefined): JwtUser {
  // TODO: [認証実装] JWT Middleware 実装後は req.user.sub / req.user.name から取得する
  // 参照: docs/02_アプリ基盤/01_フロントエンド・BFF/00_方式設計書/
  return { sub: 'system', name: '未認証ユーザー' };
}

@Controller('')
export class TestResultsController {
  constructor(
    @Inject(TestResultsService)
    private readonly testResultsService: TestResultsService,
  ) {}

  @Post('orders/:orderUuid/test-results')
  @HttpCode(HttpStatus.OK)
  async initTestResults(
    @Param('orderUuid') orderUuid: string,
    @Headers('x-correlation-id') correlationId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('authorization') authHeader: string | undefined,
  ): Promise<TestResultsInitialResponse> {
    // TODO: 構造化ログへ移行する
    console.log(`[EVT_INIT01] orderUuid: ${orderUuid}, correlationId: ${correlationId}`);
    const user = extractUser(authHeader);
    return await this.testResultsService.getInitialData(orderUuid, correlationId, tenantId, user, authHeader ?? '');
  }

  @Get('test-items')
  async searchTestItems(
    @Headers('x-correlation-id') correlationId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('authorization') authHeader: string | undefined,
    @Query('itemName') itemName?: string,
    @Query('itemCode') itemCode?: string,
  ): Promise<TestItemSearchResponse> {
    // TODO: 構造化ログへ移行する
    console.log(`[EVT_ITEM_REF] itemName: ${itemName}, itemCode: ${itemCode}`);
    const params: { itemName?: string; itemCode?: string } = {};
    if (itemName !== undefined) params.itemName = itemName;
    if (itemCode !== undefined) params.itemCode = itemCode;
    return await this.testResultsService.searchTestItems(params, correlationId, tenantId, authHeader ?? '');
  }

  @Get('modification-reason')
  async getModificationReason(
    @Headers('x-correlation-id') correlationId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('authorization') authHeader: string | undefined,
  ): Promise<ModificationReasonResponse> {
    // TODO: 構造化ログへ移行する
    console.log(`[EVT_EDIT_REASON] correlationId: ${correlationId}`);
    return await this.testResultsService.getModificationReasons(correlationId, tenantId, authHeader ?? '');
  }

  @Post('orders/:orderUuid/test-results/save')
  @HttpCode(HttpStatus.OK)
  async saveTestResults(
    @Param('orderUuid') orderUuid: string,
    @Body() rawBody: unknown,
    @Headers('x-correlation-id') correlationId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('authorization') authHeader: string | undefined,
  ): Promise<TestResultSaveResponse> {
    // TODO: 構造化ログへ移行する
    console.log(`[EVT_TEST_RESULT_CONFIRM] orderUuid: ${orderUuid}, correlationId: ${correlationId}`);

    const parsed = TestResultSaveRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new HttpException(
        { type: 'BUSINESS_ERROR', code: 'VALIDATION_FORMAT' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const validatedBody: TestResultSaveRequest = parsed.data;
    return await this.testResultsService.saveTestResults(orderUuid, validatedBody, correlationId, tenantId, authHeader ?? '');
  }
}
