import type { LifestyleRecord } from '../../types/patientInfo.type';
import { useLifestyle } from '../../hooks/useLifestyle';
import { usePatientInfoToast } from '../../hooks/useToast';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.lifestyleTab;

const fieldInput = 'h-8 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';
const fieldSelect = 'h-8 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';

interface LifestyleTabProps {
  record: LifestyleRecord;
  isReadOnly?: boolean;
}

export function LifestyleTab({ record, isReadOnly = false }: LifestyleTabProps) {
  const hook = useLifestyle(record);
  const { showSaveSuccess } = usePatientInfoToast();

  const handleSave = () => {
    hook.saveEdit();
    showSaveSuccess();
  };

  if (hook.isEditing) {
    return (
      <div className="p-4 space-y-6">
        <section className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.smokingStatus}</label>
              <select
                className={fieldSelect}
                value={hook.draft.smokingStatus}
                onChange={(e) =>
                  hook.setDraft((prev) => ({
                    ...prev,
                    smokingStatus: e.target.value as LifestyleRecord['smokingStatus'],
                  }))
                }
              >
                <option value="never">{t.smokingOptions.never}</option>
                <option value="former">{t.smokingOptions.former}</option>
                <option value="current">{t.smokingOptions.current}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.smokingDetail}</label>
              <input
                className={fieldInput}
                value={hook.draft.smokingDetail}
                onChange={(e) => hook.setDraft((prev) => ({ ...prev, smokingDetail: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.alcoholStatus}</label>
              <select
                className={fieldSelect}
                value={hook.draft.alcoholStatus}
                onChange={(e) =>
                  hook.setDraft((prev) => ({
                    ...prev,
                    alcoholStatus: e.target.value as LifestyleRecord['alcoholStatus'],
                  }))
                }
              >
                <option value="never">{t.alcoholOptions.never}</option>
                <option value="occasional">{t.alcoholOptions.occasional}</option>
                <option value="regular">{t.alcoholOptions.regular}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.alcoholDetail}</label>
              <input
                className={fieldInput}
                value={hook.draft.alcoholDetail}
                onChange={(e) => hook.setDraft((prev) => ({ ...prev, alcoholDetail: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs font-medium text-muted-foreground">{t.exerciseHabit}</label>
              <input
                className={fieldInput}
                value={hook.draft.exerciseHabit}
                onChange={(e) => hook.setDraft((prev) => ({ ...prev, exerciseHabit: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.sleepHours}</label>
              <input
                className={fieldInput}
                value={hook.draft.sleepHours}
                onChange={(e) => hook.setDraft((prev) => ({ ...prev, sleepHours: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs font-medium text-muted-foreground">{t.dietRestriction}</label>
              <input
                className={fieldInput}
                value={hook.draft.dietRestriction}
                onChange={(e) => hook.setDraft((prev) => ({ ...prev, dietRestriction: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs font-medium text-muted-foreground">{t.memo}</label>
              <textarea
                className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y"
                value={hook.draft.memo}
                onChange={(e) => hook.setDraft((prev) => ({ ...prev, memo: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-medium px-3 h-8 shadow-sm hover:bg-primary/90 transition-colors"
                  onClick={handleSave}
                >
                  {t.saveBtn}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background text-xs font-medium px-3 h-8 shadow-sm hover:bg-accent transition-colors"
                  onClick={hook.cancelEdit}
                >
                  {t.cancelBtn}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <section className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">{t.smokingStatus}</span>
            <span className="text-sm">{t.smokingOptions[hook.record.smokingStatus]}</span>
          </div>
          {hook.record.smokingDetail && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.smokingDetail}</span>
              <span className="text-sm">{hook.record.smokingDetail}</span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">{t.alcoholStatus}</span>
            <span className="text-sm">{t.alcoholOptions[hook.record.alcoholStatus]}</span>
          </div>
          {hook.record.alcoholDetail && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.alcoholDetail}</span>
              <span className="text-sm">{hook.record.alcoholDetail}</span>
            </div>
          )}
          <div className="flex flex-col gap-1 col-span-2">
            <span className="text-xs font-medium text-muted-foreground">{t.exerciseHabit}</span>
            <span className="text-sm">{hook.record.exerciseHabit || '—'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">{t.sleepHours}</span>
            <span className="text-sm">{hook.record.sleepHours || '—'}</span>
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <span className="text-xs font-medium text-muted-foreground">{t.dietRestriction}</span>
            <span className="text-sm">{hook.record.dietRestriction || '—'}</span>
          </div>
          {hook.record.memo && (
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-xs font-medium text-muted-foreground">{t.memo}</span>
              <span className="text-sm">{hook.record.memo}</span>
            </div>
          )}
        </div>
        {!isReadOnly && (
          <div className="pt-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background text-xs font-medium px-3 h-8 shadow-sm hover:bg-accent transition-colors"
              onClick={hook.startEdit}
            >
              {t.editBtn}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
