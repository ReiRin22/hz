// shared/hooks/test-results/useGetTestResults.ts
// クエリキーのみ提供。検査結果取得は use-test-results.ts（features層）で行う
export const testResultsQueryKeys = {
  all: (tenantId: string) => [tenantId, 'test-results'] as const,
  byPatient: (tenantId: string, patientId: string) =>
    [tenantId, 'test-results', 'items', { patientId }] as const,
} as const;
