import { useMemo } from 'react';
import type { MedicalRecord, RecordFilters } from '../types/recordReference.type';
import { recordTypeConfig } from '../constants/recordTypeConfig';

export function useRecordFilters(
  records: MedicalRecord[],
  filters: RecordFilters,
): MedicalRecord[] {
  return useMemo(() => {
    return records.filter((record) => {
      // 職種フィルタ
      if (filters.profession !== 'all') {
        const profession = recordTypeConfig[record.type]?.profession;
        if (profession !== filters.profession) return false;
      }

      // 記録種別フィルタ
      if (filters.recordType !== 'all' && record.type !== filters.recordType) {
        return false;
      }

      // 入外フィルタ
      if (filters.visitType !== 'all' && record.visitType !== filters.visitType) {
        return false;
      }

      // 期間フィルタ
      if (filters.startDate || filters.endDate) {
        const recordDate = new Date(record.date);
        if (filters.startDate) {
          const start = new Date(filters.startDate);
          start.setHours(0, 0, 0, 0);
          if (recordDate < start) return false;
        }
        if (filters.endDate) {
          const end = new Date(filters.endDate);
          end.setHours(23, 59, 59, 999);
          if (recordDate > end) return false;
        }
      }

      // キーワード検索
      if (filters.searchQuery.trim()) {
        const keywords = filters.searchQuery.trim().split(/\s+/).filter(Boolean);
        const searchTarget = [record.content, record.author, record.soapRecord ?? '']
          .join(' ')
          .toLowerCase();

        if (filters.searchMode === 'and') {
          return keywords.every((kw) => searchTarget.includes(kw.toLowerCase()));
        } else {
          return keywords.some((kw) => searchTarget.includes(kw.toLowerCase()));
        }
      }

      return true;
    });
  }, [records, filters]);
}
