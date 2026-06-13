import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TestResult } from '../../../lib/types';
import { testResultsService } from '../api/test-results-service';
import { testResultsQueryKeys } from './useGetTestResults';
import { addTestResultSchema, correctionReasonSchema } from '../../../lib/schemas/testResult.schema';

export function useCreateTestResult(patientId: string, tenantId = 'default') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<TestResult, 'id'>) => {
      addTestResultSchema.parse({
        itemCode: data.itemCode,
        itemName: data.itemName,
        resultValue: data.resultValue,
        unit: data.unit,
      });
      return testResultsService.createTestResult(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: testResultsQueryKeys.byPatient(tenantId, patientId),
      });
    },
  });
}

export function useUpdateTestResult(patientId: string, tenantId = 'default') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<TestResult> }) =>
      testResultsService.updateTestResult(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: testResultsQueryKeys.byPatient(tenantId, patientId),
      });
    },
  });
}

export function useDeleteTestResults(patientId: string, tenantId = 'default') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => testResultsService.deleteTestResults(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: testResultsQueryKeys.byPatient(tenantId, patientId),
      });
    },
  });
}

export function useConfirmTestResults(patientId: string, tenantId = 'default') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, reason, otherText }: { ids: string[]; reason: string; otherText?: string }) => {
      correctionReasonSchema.parse({ reason, otherText });
      const finalReason = reason === 'その他' ? (otherText ?? '') : reason;
      return testResultsService.confirmTestResults(ids, finalReason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: testResultsQueryKeys.byPatient(tenantId, patientId),
      });
    },
  });
}
