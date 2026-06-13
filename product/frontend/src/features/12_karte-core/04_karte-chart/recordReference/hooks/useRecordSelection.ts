import { useState, useCallback } from 'react';
import type { MedicalRecord, CategoryKey } from '../types/recordReference.type';
import { professionPriority, recordTypeConfig } from '../constants/recordTypeConfig';

export function useRecordSelection(records: MedicalRecord[]) {
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<CategoryKey>>(
    new Set(['ownDept', 'allDepts', 'tests']),
  );

  const toggleCategory = useCallback((categoryKey: CategoryKey) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  }, []);

  const sortRecordsByPriority = useCallback(
    (recordsToSort: MedicalRecord[]): MedicalRecord[] => {
      return [...recordsToSort].sort((a, b) => {
        const profA = recordTypeConfig[a.type]?.profession ?? '';
        const profB = recordTypeConfig[b.type]?.profession ?? '';
        return (professionPriority[profA] ?? 999) - (professionPriority[profB] ?? 999);
      });
    },
    [],
  );

  const handleRecordClick = useCallback(
    (
      recordOrRecords: MedicalRecord | MedicalRecord[],
      event: React.MouseEvent,
      onRecordSelect: (record: MedicalRecord | MedicalRecord[]) => void,
    ) => {
      const targets = Array.isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords];
      const ids = targets.map((r) => r.id);

      setSelectedRecordIds((prev) => {
        const next = new Set(prev);
        // Ctrl/Cmd + クリックで複数選択トグル
        if (event.ctrlKey || event.metaKey) {
          for (const id of ids) {
            if (next.has(id)) {
              next.delete(id);
            } else {
              next.add(id);
            }
          }
        } else {
          // 通常クリック: 選択をリセットして対象のみ選択
          next.clear();
          for (const id of ids) {
            next.add(id);
          }
        }
        return next;
      });

      onRecordSelect(recordOrRecords);
    },
    [],
  );

  return {
    selectedRecordIds,
    expandedCategories,
    toggleCategory,
    handleRecordClick,
    sortRecordsByPriority,
    records,
  };
}
