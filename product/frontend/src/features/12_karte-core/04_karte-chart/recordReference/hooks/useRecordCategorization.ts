import { useMemo, useCallback } from 'react';
import type { MedicalRecord, CategoryKey } from '../types/recordReference.type';

type GroupedByDate = Record<string, MedicalRecord[]>;
type GroupedByCategory = Record<CategoryKey, GroupedByDate>;

const TEST_TYPES = new Set<MedicalRecord['type']>([
  'test', 'bacteriology', 'pathology', 'physiology', 'endoscopy', 'radiology',
]);

function getCategoryForRecord(record: MedicalRecord): CategoryKey {
  if (TEST_TYPES.has(record.type)) return 'tests';
  // TODO: 「自科」判定ロジックは BFF からの科情報と照合して決定する
  // 現時点では inpatient を allDepts、それ以外を ownDept に仮分類
  if (record.visitType === 'outpatient') return 'allDepts';
  return 'ownDept';
}

export function useRecordCategorization(filteredRecords: MedicalRecord[]) {
  const groupedRecords = useMemo<GroupedByCategory>(() => {
    const result: GroupedByCategory = { ownDept: {}, allDepts: {}, tests: {} };

    for (const record of filteredRecords) {
      const categoryKey = getCategoryForRecord(record);
      if (!result[categoryKey][record.date]) {
        result[categoryKey][record.date] = [];
      }
      result[categoryKey][record.date].push(record);
    }

    // 各カテゴリ内の日付を降順ソート
    for (const key of Object.keys(result) as CategoryKey[]) {
      const sorted: GroupedByDate = {};
      for (const date of Object.keys(result[key]).sort((a, b) => b.localeCompare(a))) {
        sorted[date] = result[key][date];
      }
      result[key] = sorted;
    }

    return result;
  }, [filteredRecords]);

  const getCategoryCount = useCallback((categoryKey: CategoryKey): number => {
    return Object.values(groupedRecords[categoryKey]).flat().length;
  }, [groupedRecords]);

  return { groupedRecords, getCategoryCount };
}
