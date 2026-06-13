import { Injectable } from '@nestjs/common';
import { axiosClient } from '@shared/plugins/bffAxiosClient';
import type { TestItemListResponse } from '@/front_bff_shared/sample/master/types/test-item-master.api.response';

type TestItemsQueryParams = {
  itemName?: string;
  itemCode?: string;
};

@Injectable()
export class TestItemMasterClient {
  // TODO: DB設計確定後に masterDomainService 設計書と照合して実装を更新すること（現在はモックデータ）
  async fetchTestItems(
    params: TestItemsQueryParams,
    correlationId: string,
    tenantId: string,
    authHeader: string,
  ): Promise<TestItemListResponse> {
    const query = new URLSearchParams();
    if (params.itemName !== undefined) query.set('itemName', params.itemName);
    if (params.itemCode !== undefined) query.set('itemCode', params.itemCode);
    const qs = query.toString();

    const response = await axiosClient.get<TestItemListResponse>(
      `/api/v1/master/test-items${qs ? `?${qs}` : ''}`,
      { headers: { 'X-Correlation-ID': correlationId, 'X-Tenant-Id': tenantId, 'Authorization': authHeader } },
    );
    return response.data;
  }
}
