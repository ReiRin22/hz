import type { RecordMeta } from '../../types/patientInfo.type';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.recordMetaInfo;

interface RecordMetaInfoProps {
  meta: RecordMeta;
}

export function RecordMetaInfo({ meta }: RecordMetaInfoProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <span className="font-medium">{t.createdBy}</span>
        <span>{meta.createdBy}</span>
      </span>
      <span className="w-px h-3 bg-border" />
      <span className="flex items-center gap-1">
        <span className="font-medium">{t.createdAt}</span>
        <span>{meta.createdAt.slice(0, 10)}</span>
      </span>
      <span className="w-px h-3 bg-border" />
      <span className="flex items-center gap-1">
        <span className="font-medium">{t.updatedBy}</span>
        <span>{meta.updatedBy}</span>
      </span>
      <span className="w-px h-3 bg-border" />
      <span className="flex items-center gap-1">
        <span className="font-medium">{t.updatedAt}</span>
        <span>{meta.updatedAt.slice(0, 10)}</span>
      </span>
    </div>
  );
}
