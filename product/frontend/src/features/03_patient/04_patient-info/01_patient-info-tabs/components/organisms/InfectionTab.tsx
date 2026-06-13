import type { InfectionRecord } from '../../types/patientInfo.type';
import { SectionTable } from '../molecules/SectionTable';
import { RecordMetaInfo } from '../molecules/RecordMetaInfo';
import { DeleteConfirmDialog } from '../molecules/DeleteConfirmDialog';
import { useInfection } from '../../hooks/useInfection';
import { usePatientInfoToast } from '../../hooks/useToast';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.infectionTab;

interface InfectionTabProps {
  records: InfectionRecord[];
  /** staff ロールは read-only */
  isReadOnly?: boolean;
}

export function InfectionTab({ records, isReadOnly = false }: InfectionTabProps) {
  const hook = useInfection(records);
  const { showDeleteSuccess } = usePatientInfoToast();

  const handleDeleteConfirm = () => {
    if (!hook.deleteTargetId) return;
    hook.deleteRecord(hook.deleteTargetId);
    hook.setDeleteTargetId(null);
    showDeleteSuccess();
  };

  return (
    <div className="p-4 space-y-6">
      {isReadOnly && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2" role="status" aria-live="polite">{t.readonlyNotice}</p>
      )}
      <section className="space-y-3">
        <SectionTable
          columns={[
            { key: 'infectionName', label: t.columns.infectionName },
            { key: 'testDate', label: t.columns.testDate },
            {
              key: 'result',
              label: t.columns.result,
              render: (row) => t.resultOptions[row.result],
            },
          ]}
          rows={hook.records}
          renderDetail={(row) => (
            <div className="space-y-2">
              {row.memo && <p className="text-sm">{row.memo}</p>}
              <RecordMetaInfo meta={row.meta} />
            </div>
          )}
          isReadOnly={isReadOnly}
          onAdd={isReadOnly ? undefined : () => {/* TODO: フォーム実装 */}}
          onDelete={isReadOnly ? undefined : (id) => hook.setDeleteTargetId(id)}
        />
      </section>

      <DeleteConfirmDialog
        open={hook.deleteTargetId !== null}
        onOpenChange={(open) => { if (!open) hook.setDeleteTargetId(null); }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
