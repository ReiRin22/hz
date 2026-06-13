import type { AllergyHistoryData } from '../../types/patientInfo.type';
import { SectionTable } from '../molecules/SectionTable';
import { RecordMetaInfo } from '../molecules/RecordMetaInfo';
import { DeleteConfirmDialog } from '../molecules/DeleteConfirmDialog';
import { useAllergyHistory } from '../../hooks/useAllergyHistory';
import { usePatientInfoToast } from '../../hooks/useToast';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.allergyHistoryTab;

interface AllergyHistoryTabProps {
  data: AllergyHistoryData;
  isReadOnly?: boolean;
}

export function AllergyHistoryTab({ data, isReadOnly = false }: AllergyHistoryTabProps) {
  const hook = useAllergyHistory(data);
  const { showDeleteSuccess } = usePatientInfoToast();

  const handleDeleteConfirm = () => {
    if (!hook.deleteTarget) return;
    if (hook.deleteTarget.type === 'allergy') hook.deleteAllergy(hook.deleteTarget.id);
    if (hook.deleteTarget.type === 'history') hook.deleteMedicalHistory(hook.deleteTarget.id);
    if (hook.deleteTarget.type === 'surgery') hook.deleteSurgery(hook.deleteTarget.id);
    hook.setDeleteTarget(null);
    showDeleteSuccess();
  };

  return (
    <div className="p-4 space-y-6">
      {/* アレルギー */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.allergySection}</h3>
        <SectionTable
          columns={[
            { key: 'allergen', label: t.allergyColumns.allergen },
            { key: 'reaction', label: t.allergyColumns.reaction },
            {
              key: 'severity',
              label: t.allergyColumns.severity,
              render: (row) => t.severityOptions[row.severity],
            },
            { key: 'confirmedDate', label: t.allergyColumns.confirmedDate },
          ]}
          rows={hook.data.allergies}
          renderDetail={(row) => <RecordMetaInfo meta={row.meta} />}
          isReadOnly={isReadOnly}
          onAdd={isReadOnly ? undefined : () => {/* TODO: フォーム実装 */}}
          onDelete={isReadOnly ? undefined : (id) => hook.setDeleteTarget({ type: 'allergy', id })}
        />
      </section>

      {/* 既往歴 */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.historySection}</h3>
        <SectionTable
          columns={[
            { key: 'disease', label: t.historyColumns.disease },
            { key: 'diagnosisDate', label: t.historyColumns.diagnosisDate },
            { key: 'hospital', label: t.historyColumns.hospital },
          ]}
          rows={hook.data.medicalHistories}
          renderDetail={(row) => (
            <div className="space-y-2">
              {row.memo && <p className="text-sm">{row.memo}</p>}
              <RecordMetaInfo meta={row.meta} />
            </div>
          )}
          isReadOnly={isReadOnly}
          onAdd={isReadOnly ? undefined : () => {/* TODO: フォーム実装 */}}
          onDelete={isReadOnly ? undefined : (id) => hook.setDeleteTarget({ type: 'history', id })}
        />
      </section>

      {/* 手術歴 */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.surgerySection}</h3>
        <SectionTable
          columns={[
            { key: 'surgeryName', label: t.surgeryColumns.surgeryName },
            { key: 'surgeryDate', label: t.surgeryColumns.surgeryDate },
            { key: 'hospital', label: t.surgeryColumns.hospital },
          ]}
          rows={hook.data.surgeries}
          renderDetail={(row) => (
            <div className="space-y-2">
              {row.memo && <p className="text-sm">{row.memo}</p>}
              <RecordMetaInfo meta={row.meta} />
            </div>
          )}
          isReadOnly={isReadOnly}
          onAdd={isReadOnly ? undefined : () => {/* TODO: フォーム実装 */}}
          onDelete={isReadOnly ? undefined : (id) => hook.setDeleteTarget({ type: 'surgery', id })}
        />
      </section>

      <DeleteConfirmDialog
        open={hook.deleteTarget !== null}
        onOpenChange={(open) => { if (!open) hook.setDeleteTarget(null); }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
