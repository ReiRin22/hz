import type { TestItemSearchResponse } from '@/front_bff_shared/execution/test-results/types/test-results.api.response';
import { BffApiError, parseBffError, getAuthHeader } from '@/shared/api/test-results/test-results-service';

export const testItemsService = {
  async searchTestItems(correlationId: string, tenantId: string, codeQuery?: string, nameQuery?: string): Promise<TestItemSearchResponse> {
    const params = new URLSearchParams();
    if (codeQuery?.trim()) params.set('itemCode', codeQuery.trim());
    if (nameQuery?.trim()) params.set('itemName', nameQuery.trim());
    const url = `/bff/test-items${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, {
      headers: {
        'X-Correlation-ID': correlationId,
        'X-Tenant-Id': tenantId,
        'Authorization': getAuthHeader(),
      },
    });
    if (!res.ok) throw await parseBffError(res);
    return res.json() as Promise<TestItemSearchResponse>;
  },
};
