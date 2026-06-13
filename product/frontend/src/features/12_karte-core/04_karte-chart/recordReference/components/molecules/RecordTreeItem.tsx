import { Badge } from '@/shared/components/atoms/badge';
import { FileText } from 'lucide-react';
import type { MedicalRecord } from '../../types/recordReference.type';
import { recordTypeConfig, professionPriority } from '../../constants/recordTypeConfig';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.recordReference.recordTreeItem;

interface RecordTreeItemProps {
  date: string;
  dateRecords: MedicalRecord[];
  isAnyRecordSelected: boolean;
  areAllRecordsSelected: boolean;
  onRecordClick: (recordOrRecords: MedicalRecord | MedicalRecord[], event: React.MouseEvent) => void;
  sortRecordsByPriority: (records: MedicalRecord[]) => MedicalRecord[];
}

export function RecordTreeItem({
  date,
  dateRecords,
  isAnyRecordSelected,
  areAllRecordsSelected,
  onRecordClick,
  sortRecordsByPriority,
}: RecordTreeItemProps) {
  const selectionClass = areAllRecordsSelected
    ? 'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-sm bg-primary/20 border border-primary shadow-sm'
    : isAnyRecordSelected
    ? 'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-sm bg-primary/10 border border-primary/50 shadow-sm'
    : 'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-sm bg-card hover:bg-accent/50';

  const uniqueProfessions = Array.from(
    new Set(dateRecords.map((r) => recordTypeConfig[r.type]?.profession).filter(Boolean)),
  ).sort((a, b) => (professionPriority[a] ?? 999) - (professionPriority[b] ?? 999));

  const uniqueTypes = Array.from(new Set(dateRecords.map((r) => r.type).filter((type) => recordTypeConfig[type]))).sort(
    (a, b) => {
      const pA = professionPriority[recordTypeConfig[a]?.profession ?? ''] ?? 999;
      const pB = professionPriority[recordTypeConfig[b]?.profession ?? ''] ?? 999;
      return pA - pB;
    },
  );

  return (
    <div
      role="button"
      tabIndex={0}
      className={selectionClass}
      onClick={(e) => {
        const toSelect = dateRecords.length > 1 ? sortRecordsByPriority(dateRecords) : dateRecords[0];
        onRecordClick(toSelect, e);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const syntheticEvent = e as unknown as React.MouseEvent;
          const toSelect = dateRecords.length > 1 ? sortRecordsByPriority(dateRecords) : dateRecords[0];
          onRecordClick(toSelect, syntheticEvent);
        }
      }}
    >
      <div className="flex items-center space-x-2">
        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium">{date}</span>

        {/* 入外バッジ */}
        {dateRecords.some((r) => r.visitType) && (
          <div className="flex items-center gap-1">
            {dateRecords.some((r) => r.visitType === 'inpatient') && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-red-50 border-red-300 text-red-700 dark:bg-red-950 dark:border-red-700 dark:text-red-300">
                {t.inpatient}
              </Badge>
            )}
            {dateRecords.some((r) => r.visitType === 'outpatient') && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300">
                {t.outpatient}
              </Badge>
            )}
          </div>
        )}

        {/* 職種表示 */}
        <div className="flex items-center gap-1.5">
          {uniqueProfessions.map((profession) => (
            <span key={profession} className="text-xs text-muted-foreground">
              {profession}
            </span>
          ))}
        </div>
      </div>

      {/* 記録タイプアイコン */}
      <div className="flex items-center space-x-0.5">
        {uniqueTypes.map((type) => {
          const config = recordTypeConfig[type];
          if (!config) return null;
          const Icon = config.icon;
          return (
            <div key={type} className={`p-0.5 rounded text-white ${config.color}`} title={config.label}>
              <Icon className="w-2.5 h-2.5" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
