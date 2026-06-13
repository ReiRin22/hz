import { Injectable } from '@nestjs/common';
import { axiosClient } from '@shared/plugins/bffAxiosClient';
import type { TestResultSaveItem, ModificationReasonInput } from '@/front_bff_shared/execution/test-results/types/test-results.api.request';
import type {
  BackendTestResultsGetResponse,
  BackendLockAcquireResponse,
  BackendUnitRecord,
  BackendUnitsGetResponse,
  BackendModificationReasonRecord,
  BackendModificationReasonsGetResponse,
  BackendSaveResponse,
} from '@/features/execution/test-results/types/backend.type';

@Injectable()
export class TestResultsClient {
  async acquireLock(orderUuid: string, correlationId: string, tenantId: string, authHeader: string): Promise<BackendLockAcquireResponse> {
    const response = await axiosClient.post<BackendLockAcquireResponse>(
      `/api/v1/orders/${orderUuid}/test-results/lock`,
      {},
      { headers: { 'X-Correlation-ID': correlationId, 'X-Tenant-Id': tenantId, 'Authorization': authHeader } },
    );
    return response.data;
  }

  async fetchTestResults(orderUuid: string, correlationId: string, tenantId: string, authHeader: string): Promise<BackendTestResultsGetResponse> {
    const response = await axiosClient.get<BackendTestResultsGetResponse>(
      `/api/v1/orders/${orderUuid}/test-results`,
      { headers: { 'X-Correlation-ID': correlationId, 'X-Tenant-Id': tenantId, 'Authorization': authHeader } },
    );
    return response.data;
  }

  async fetchUnits(correlationId: string, tenantId: string, authHeader: string): Promise<BackendUnitRecord[]> {
    const response = await axiosClient.get<BackendUnitsGetResponse>(
      '/api/v1/master/units',
      { headers: { 'X-Correlation-ID': correlationId, 'X-Tenant-Id': tenantId, 'Authorization': authHeader } },
    );
    return response.data.units;
  }

  async fetchModificationReasons(correlationId: string, tenantId: string, authHeader: string): Promise<BackendModificationReasonRecord[]> {
    const response = await axiosClient.get<BackendModificationReasonsGetResponse>(
      '/api/v1/master/modification-reasons',
      { headers: { 'X-Correlation-ID': correlationId, 'X-Tenant-Id': tenantId, 'Authorization': authHeader } },
    );
    return response.data.reasons;
  }

  async saveTestResults(
    orderUuid: string,
    testResults: TestResultSaveItem[],
    modificationReason: ModificationReasonInput | undefined,
    correlationId: string,
    tenantId: string,
    authHeader: string,
  ): Promise<BackendSaveResponse> {
    const body: Record<string, unknown> = {
      testResults: testResults.map((r) => ({
        itemCode: r.itemCode,
        resultValue: r.resultValue,
        unit: r.unit,
        ...(r.lowerLimit !== undefined ? { lowerLimit: r.lowerLimit } : {}),
        ...(r.upperLimit !== undefined ? { upperLimit: r.upperLimit } : {}),
        ...(r.testDate !== undefined ? { testDate: r.testDate } : {}),
      })),
    };
    if (modificationReason !== undefined) {
      body['modificationReason'] = {
        reasonCode: modificationReason.reasonCode,
        ...(modificationReason.reasonText !== undefined ? { reasonText: modificationReason.reasonText } : {}),
      };
    }
    const response = await axiosClient.post<BackendSaveResponse>(
      `/api/v1/orders/${orderUuid}/test-results`,
      body,
      { headers: { 'X-Correlation-ID': correlationId, 'X-Tenant-Id': tenantId, 'Authorization': authHeader } },
    );
    return response.data;
  }

  // fireAndForget: 保存成功後のロック解放失敗はユーザー操作を妨げない（設計書仕様）。エラーログは呼び出し元が担う
  releaseLock(orderUuid: string, tenantId: string, authHeader: string): Promise<void> {
    return axiosClient
      .delete(`/api/v1/orders/${orderUuid}/test-results/lock`, {
        headers: { 'X-Tenant-Id': tenantId, 'Authorization': authHeader },
      })
      .then(() => undefined);
  }
}
