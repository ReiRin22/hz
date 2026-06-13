import { useQuery } from '@tanstack/react-query';
import { testResultsService } from '../api/test-results-service';

/**
 * クエリキー規約: [tenantId, domain, scope, params?]
 * 設計書: docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/14.状態管理設計.md
 */
export const testResultsQueryKeys = {
  all: (tenantId: string) => [tenantId, 'test-results'] as const,
  byPatient: (tenantId: string, patientId: string) =>
    [tenantId, 'test-results', 'items', { patientId }] as const,
} as const;

export function useGetTestResults(patientId: string | undefined, tenantId = 'default') {
  return useQuery({
    queryKey: testResultsQueryKeys.byPatient(tenantId, patientId ?? ''),
    queryFn: () => testResultsService.getTestResults(patientId!),
    enabled: !!patientId,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}
