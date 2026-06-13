import { useState, useEffect, useCallback, useRef } from 'react';
import { TestResult } from '@/shared/types/test-results';
import { testResultsService, BffApiError } from '@/shared/api/test-results/test-results-service';
import type { TestResultItem, LockInfo, UnitOption } from '@/front_bff_shared/execution/test-results/types/test-results.api.response';
import type { TestResultSaveRequest, ModificationReasonInput } from '@/front_bff_shared/execution/test-results/types/test-results.api.request';

function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function mapToTestResult(item: TestResultItem): TestResult {
  return {
    id: item.itemCode,
    itemCode: item.itemCode,
    itemName: item.itemName,
    resultValue: item.resultValue !== null ? String(item.resultValue) : '',
    unit: item.unit,
    referenceValueDisplay: item.referenceValueDisplay,
    judgment: '',
    device: '',
    measurementDateTime: '',
    decimalPlaces: 0,
    comment: '',
    status: 'not-entered',
    hasError: false,
    selected: false,
    previousResultValue: item.previousResultValue !== null ? String(item.previousResultValue) : '',
    hasPreviousResult: item.hasPreviousResult,
    criticalLower: item.criticalLower,
    criticalUpper: item.criticalUpper,
    lowerLimit: item.lowerLimit,
    upperLimit: item.upperLimit,
    testDate: item.testDate ?? '',
    hasTestDate: item.hasTestDate,
    isEditable: true,
    isAddedItem: item.isUserAdded,
    reasonRequired: false,
  };
}

export function useTestResults(orderUuid?: string, tenantId = '') {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [lockInfo, setLockInfo] = useState<LockInfo | null>(null);
  const [reasonRequired, setReasonRequired] = useState(false);
  const [availableUnits, setAvailableUnits] = useState<UnitOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // EVT_INIT01: 画面ロード時に発番した correlation_id を保持
  const correlationIdRef = useRef<string>(generateCorrelationId());

  // EVT_INIT01: POST /bff/orders/{orderUuid}/test-results で初期表示
  const fetchTestResults = useCallback(async () => {
    if (!orderUuid) return;

    try {
      setLoading(true);
      const data = await testResultsService.initTestResults(orderUuid, correlationIdRef.current, tenantId);
      setTestResults(data.testResults.map(mapToTestResult));
      setLockInfo(data.lockInfo);
      setReasonRequired(data.reasonRequired);
      setAvailableUnits(data.availableUnits);
      setError(null);
    } catch (err) {
      setError(err instanceof BffApiError ? err : new Error('SYSTEM_ERROR'));
    } finally {
      setLoading(false);
    }
  }, [orderUuid, tenantId]);

  useEffect(() => {
    fetchTestResults();
  }, [fetchTestResults]);

  // EVT_UI_01: クライアント側のみで項目を追加（API呼び出しなし）
  const addTestResult = useCallback((data: Omit<TestResult, 'id' | 'selected' | 'isAddedItem'>) => {
    const newResult: TestResult = {
      ...data,
      id: `local-${Date.now()}`,
      selected: false,
      isAddedItem: true,
    };
    setTestResults(prev => [newResult, ...prev]);
    return newResult;
  }, []);

  const updateTestResult = useCallback((id: string, field: keyof TestResult, value: TestResult[keyof TestResult]) => {
    setTestResults(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const toggleSelection = useCallback((id: string, selected: boolean) => {
    setTestResults(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected } : item
      )
    );
  }, []);

  const selectAll = useCallback((selected: boolean) => {
    setTestResults(prev =>
      prev.map(item => ({ ...item, selected }))
    );
  }, []);

  // EVT_ROW_DELETE: EVT_UI_01で追加した項目のみクライアント側で削除（API呼び出しなし）
  const deleteSelected = useCallback(() => {
    setTestResults(prev => prev.filter(item => !(item.selected && item.isAddedItem)));
  }, []);

  // EVT_TEST_RESULT_CONFIRM: 全行を確定スコープとしてAPIを呼び出す
  const confirmResults = useCallback(async (reasonCode: string, reasonText?: string) => {
    if (!orderUuid) return;

    const saveItems = testResults.map(r => ({
      itemCode: r.itemCode,
      resultValue: r.resultValue === '' ? 0 : Number(r.resultValue),
      unit: r.unit,
      lowerLimit: r.lowerLimit ?? undefined,
      upperLimit: r.upperLimit ?? undefined,
      testDate: r.testDate ? r.testDate.replace(/\//g, '-') : undefined,
    }));

    const modificationReason: ModificationReasonInput | undefined = reasonRequired
      ? { reasonCode, reasonText }
      : undefined;

    const body: TestResultSaveRequest = {
      testResults: saveItems,
      modificationReason,
    };

    try {
      await testResultsService.confirmTestResults(orderUuid, body, correlationIdRef.current, tenantId);
    } catch (err) {
      setError(err instanceof BffApiError ? err : new Error('SYSTEM_ERROR'));
      throw err;
    }
  }, [orderUuid, testResults, reasonRequired, tenantId]);

  return {
    correlationId: correlationIdRef.current,
    testResults,
    lockInfo,
    reasonRequired,
    availableUnits,
    loading,
    error,
    addTestResult,
    updateTestResult,
    toggleSelection,
    selectAll,
    deleteSelected,
    confirmResults,
    refresh: fetchTestResults,
  };
}
