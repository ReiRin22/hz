import { Badge } from '@/shared/components/atoms/badge';
import { Calendar, Clock, User, CreditCard } from 'lucide-react';
import type { MedicalRecord } from '../../types/recordReference.type';
import { recordTypeConfig } from '../../constants/recordTypeConfig';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.recordReference.recordMetadata;
const tTree = ja.karte.recordReference.recordTreeItem;

interface RecordMetadataProps {
  record: MedicalRecord;
}

export function RecordMetadata({ record }: RecordMetadataProps) {
  const config = recordTypeConfig[record.type];
  const Icon = config.icon;

  return (
    <div className="space-y-3">
      {/* 記録種別バッジ */}
      <div className="flex items-center space-x-2">
        <div className={`p-2 rounded-lg text-white ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{t.recordTypeLabel}</span>
          <span className="text-sm font-semibold">{config.label}</span>
        </div>
      </div>

      {/* メタ情報グリッド */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{t.dateLabel}</span>
            <span className="text-xs font-medium">{record.date}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{t.timeLabel}</span>
            <span className="text-xs font-medium">{record.time}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{t.authorLabel}</span>
            <span className="text-xs font-medium">{record.author}</span>
          </div>
        </div>

        {record.insurance && (
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{t.insuranceLabel}</span>
              <span className="text-xs font-medium">
                {record.insurance.type} / {record.insurance.burden}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 入外バッジ */}
      {record.visitType && (
        <div>
          <Badge
            variant="outline"
            className={record.visitType === 'inpatient'
              ? 'text-xs px-1.5 py-0 h-4 bg-red-50 border-red-300 text-red-700 dark:bg-red-950 dark:border-red-700 dark:text-red-300'
              : 'text-xs px-1.5 py-0 h-4 bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300'}
          >
            {record.visitType === 'inpatient' ? tTree.inpatient : tTree.outpatient}
          </Badge>
        </div>
      )}
    </div>
  );
}
