import { useState, useCallback } from 'react';
import { TestItem } from '../../../lib/types';
import { testItemsService } from '../api/test-items-service';
import type { TestItemOption } from '@/front_bff_shared/execution/test-results/types/test-results.api.response';

function mapToTestItem(option: TestItemOption): TestItem {
  return {
    code: option.itemCode,
    name: option.itemName,
    unit: option.defaultUnit,
    lowerReference: option.lowerLimit !== null ? String(option.lowerLimit) : '',
    upperReference: option.upperLimit !== null ? String(option.upperLimit) : '',
    judgment: '',
    criticalLower: option.criticalLower,
    criticalUpper: option.criticalUpper,
  };
}

export function useTestItemsSearch() {
  const [filteredItems, setFilteredItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchItems = useCallback(async (correlationId: string, tenantId: string, codeQuery?: string, nameQuery?: string) => {
    try {
      setLoading(true);
      const response = await testItemsService.searchTestItems(correlationId, tenantId, codeQuery, nameQuery);
      setFilteredItems(response.items.map(mapToTestItem));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search test items'));
    } finally {
      setLoading(false);
    }
  }, []);

  const resetSearch = useCallback(() => {
    setFilteredItems([]);
  }, []);

  return {
    filteredItems,
    loading,
    error,
    searchItems,
    resetSearch
  };
}
