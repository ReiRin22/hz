import type { ModificationReasonOption, ModificationReasonResponse } from '@/front_bff_shared/execution/test-results/types/test-results.api.response';
import { BffApiError, parseBffError, getAuthHeader } from '@/shared/api/test-results/test-results-service';

export const modificationReasonService = {
  async getReasons(correlationId: string, tenantId: string): Promise<ModificationReasonOption[]> {
    const res = await fetch('/bff/modification-reason', {
      headers: {
        'X-Correlation-ID': correlationId,
        'X-Tenant-Id': tenantId,
        'Authorization': getAuthHeader(),
      },
    });
    if (!res.ok) throw await parseBffError(res);
    const data = await res.json() as ModificationReasonResponse;
    return data.reasons;
  },
};
