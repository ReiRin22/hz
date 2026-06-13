import type { VaccinationRecord } from '../../types/patientInfo.type';
import { SectionTable } from '../molecules/SectionTable';
import { RecordMetaInfo } from '../molecules/RecordMetaInfo';
import { DeleteConfirmDialog } from '../molecules/DeleteConfirmDialog';
import { useVaccination } from '../../hooks/useVaccination';
import { usePatientInfoToast } from '../../hooks/useToast';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.vaccinationTab;

interface VaccinationTabProps {
  records: VaccinationRecord[];
  isReadOnly?: boolean;
}

export function VaccinationTab({ records, isReadOnly = false }: VaccinationTabProps) {
  const hook = useVaccination(records);
  const { showDeleteSuccess } = usePatientInfoToast();

  const handleDeleteConfirm = () => {
    if (!hook.deleteTargetId) return;
    hook.deleteRecord(hook.deleteTargetId);
    hook.setDeleteTargetId(null);
    showDeleteSuccess();
  };

  return (
    <div className="p-4 space-y-6">
      <section className="space-y-3">
        <SectionTable
          columns={[
            { key: 'vaccineName', label: t.columns.vaccineName },
            { key: 'vaccinationDate', label: t.columns.vaccinationDate },
            { key: 'lotNumber', label: t.columns.lotNumber },
            { key: 'administrator', label: t.columns.administrator },
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
