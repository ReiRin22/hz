import { Controller, Get, Headers, Inject, Query } from '@nestjs/common';
import { TestItemMasterService } from '@shared/master/test-item-master/test-item-master.service';
import type { TestItemListResponse } from '@/front_bff_shared/sample/master/types/test-item-master.api.response';

@Controller('bff/test-item')
export class TestItemMasterController {
  constructor(
    @Inject(TestItemMasterService)
    private readonly testItemMasterService: TestItemMasterService,
  ) {}

  @Get('lists')
  async getTestItemLists(
    @Headers('x-correlation-id') correlationId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('authorization') authHeader: string | undefined,
    @Query('itemName') itemName?: string,
    @Query('itemCode') itemCode?: string,
  ): Promise<TestItemListResponse> {
    // TODO: 構造化ログへ移行する
    console.log(`[EVT_ITEM_MASTER_REF] itemName: ${itemName}, itemCode: ${itemCode}`);
    const params: { itemName?: string; itemCode?: string } = {};
    if (itemName !== undefined) params.itemName = itemName;
    if (itemCode !== undefined) params.itemCode = itemCode;
    return await this.testItemMasterService.getTestItems(params, correlationId, tenantId, authHeader ?? '');
  }
}
