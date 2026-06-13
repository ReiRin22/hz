import type { TestResultsInitialResponse, BffErrorResponse } from '@/front_bff_shared/execution/test-results/types/test-results.api.response';
import type { TestResultSaveRequest } from '@/front_bff_shared/execution/test-results/types/test-results.api.request';

export class BffApiError extends Error {
  constructor(
    public readonly type: string,
    public readonly code: string,
    public readonly httpStatus: number,
    public readonly lockedByUserName?: string,
  ) {
    super(code);
  }
}

export async function parseBffError(res: Response): Promise<BffApiError> {
  try {
    const body = await res.json() as BffErrorResponse;
    return new BffApiError(body.type ?? 'SYSTEM_ERROR', body.code ?? 'SYSTEM_ERROR', res.status, body.lockedByUserName);
  } catch {
    return new BffApiError('SYSTEM_ERROR', 'SYSTEM_ERROR', res.status);
  }
}

// TODO: [認証実装] JWT Middleware 実装後はセッションから取得する（req.user.sub / req.user.name）
// 参照: docs/02_アプリ基盤/01_フロントエンド・BFF/00_方式設計書/
export function getAuthHeader(): string {
  return 'Bearer mock-token';
}

export const testResultsService = {
  async initTestResults(orderUuid: string, correlationId: string, tenantId: string): Promise<TestResultsInitialResponse> {
    const res = await fetch(`/bff/orders/${orderUuid}/test-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
        'X-Tenant-Id': tenantId,
        'Authorization': getAuthHeader(),
      },
    });
    if (!res.ok) throw await parseBffError(res);
    return res.json() as Promise<TestResultsInitialResponse>;
  },

  async confirmTestResults(orderUuid: string, body: TestResultSaveRequest, correlationId: string, tenantId: string): Promise<void> {
    const res = await fetch(`/bff/orders/${orderUuid}/test-results/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
        'X-Tenant-Id': tenantId,
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await parseBffError(res);
  },
};
