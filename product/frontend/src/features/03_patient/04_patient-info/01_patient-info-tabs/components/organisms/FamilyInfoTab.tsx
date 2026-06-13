import type { FamilyInfoData } from '../../types/patientInfo.type';
import { SectionTable } from '../molecules/SectionTable';
import { RecordMetaInfo } from '../molecules/RecordMetaInfo';
import { DeleteConfirmDialog } from '../molecules/DeleteConfirmDialog';
import { useFamilyInfo } from '../../hooks/useFamilyInfo';
import { usePatientInfoToast } from '../../hooks/useToast';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.familyInfoTab;

const fieldInput = 'h-8 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';

interface FamilyInfoTabProps {
  data: FamilyInfoData;
  isReadOnly?: boolean;
}

export function FamilyInfoTab({ data, isReadOnly = false }: FamilyInfoTabProps) {
  const hook = useFamilyInfo(data);
  const { showDeleteSuccess, showSaveSuccess } = usePatientInfoToast();

  const handleDeleteConfirm = () => {
    if (!hook.deleteTargetId) return;
    hook.deleteFamilyMember(hook.deleteTargetId);
    hook.setDeleteTargetId(null);
    showDeleteSuccess();
  };

  const handleSaveGuarantor = () => {
    hook.saveGuarantor();
    showSaveSuccess();
  };

  return (
    <div className="p-4 space-y-6">
      {/* 家族一覧 */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.familySection}</h3>
        <SectionTable
          columns={[
            { key: 'name', label: t.familyColumns.name },
            { key: 'relationship', label: t.familyColumns.relationship },
            { key: 'phone', label: t.familyColumns.phone },
            {
              key: 'isEmergencyContact',
              label: t.familyColumns.isEmergencyContact,
              render: (row) => row.isEmergencyContact ? t.yes : '',
            },
          ]}
          rows={hook.data.familyMembers}
          renderDetail={(row) => (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">{t.familyColumns.birthDate}</span>
                  <span className="text-sm">{row.birthDate}</span>
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="text-xs font-medium text-muted-foreground">{t.familyColumns.address}</span>
                  <span className="text-sm">{row.address}</span>
                </div>
              </div>
              <RecordMetaInfo meta={row.meta} />
            </div>
          )}
          isReadOnly={isReadOnly}
          onAdd={isReadOnly ? undefined : () => {/* TODO: フォーム実装 */}}
          onDelete={isReadOnly ? undefined : (id) => hook.setDeleteTargetId(id)}
        />
      </section>

      {/* 保証人情報 */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.guarantorSection}</h3>
        {hook.isEditingGuarantor ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.guarantorColumns.name}</label>
              <input
                className={fieldInput}
                value={hook.guarantorDraft.name}
                onChange={(e) => hook.setGuarantorDraft((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.guarantorColumns.relationship}</label>
              <input
                className={fieldInput}
                value={hook.guarantorDraft.relationship}
                onChange={(e) => hook.setGuarantorDraft((prev) => ({ ...prev, relationship: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.guarantorColumns.phone}</label>
              <input
                className={fieldInput}
                value={hook.guarantorDraft.phone}
                onChange={(e) => hook.setGuarantorDraft((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs font-medium text-muted-foreground">{t.guarantorColumns.address}</label>
              <input
                className={fieldInput}
                value={hook.guarantorDraft.address}
                onChange={(e) => hook.setGuarantorDraft((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-medium px-3 h-8 shadow-sm hover:bg-primary/90 transition-colors"
                  onClick={handleSaveGuarantor}
                >
                  {t.saveBtn}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background text-xs font-medium px-3 h-8 shadow-sm hover:bg-accent transition-colors"
                  onClick={hook.cancelGuarantorEdit}
                >
                  {t.cancelBtn}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.guarantorColumns.name}</span>
              <span className="text-sm">{hook.data.guarantor.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.guarantorColumns.relationship}</span>
              <span className="text-sm">{hook.data.guarantor.relationship}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.guarantorColumns.phone}</span>
              <span className="text-sm">{hook.data.guarantor.phone}</span>
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-xs font-medium text-muted-foreground">{t.guarantorColumns.address}</span>
              <span className="text-sm">{hook.data.guarantor.address}</span>
            </div>
            {!isReadOnly && (
              <div className="flex flex-col gap-1 col-span-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background text-xs font-medium px-3 h-8 shadow-sm hover:bg-accent transition-colors"
                  onClick={() => hook.setIsEditingGuarantor(true)}
                >
                  {t.editBtn}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <DeleteConfirmDialog
        open={hook.deleteTargetId !== null}
        onOpenChange={(open) => { if (!open) hook.setDeleteTargetId(null); }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
