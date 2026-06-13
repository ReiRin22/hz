import type { PhilosophyRecord } from '../../types/patientInfo.type';
import { useAcp } from '../../hooks/useAcp';
import { usePatientInfoToast } from '../../hooks/useToast';
import { RecordMetaInfo } from '../molecules/RecordMetaInfo';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.philosophyTab;

const fieldInput = 'h-8 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';
const fieldSelect = 'h-8 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';

interface PhilosophyTabProps {
  records: PhilosophyRecord[];
  isReadOnly?: boolean;
}

export function PhilosophyTab({ records, isReadOnly = false }: PhilosophyTabProps) {
  const hook = useAcp(records);
  const { showSaveSuccess } = usePatientInfoToast();

  const handleSave = () => {
    hook.saveEdit();
    showSaveSuccess();
  };

  const latestRecord = hook.records.find((r) => r.isLatest);

  if (hook.isEditing && hook.draft) {
    return (
      <div className="p-4 space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.latestSection}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs font-medium text-muted-foreground">{t.endOfLifeWish}</label>
              <textarea
                className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y"
                value={hook.draft.endOfLifeWish}
                onChange={(e) => hook.setDraft((prev) => prev ? { ...prev, endOfLifeWish: e.target.value } : prev)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.resuscitationWish}</label>
              <select
                className={fieldSelect}
                value={hook.draft.resuscitationWish}
                onChange={(e) => hook.setDraft((prev) => prev ? { ...prev, resuscitationWish: e.target.value as PhilosophyRecord['resuscitationWish'] } : prev)}
              >
                <option value="do">{t.wishOptions.do}</option>
                <option value="doNot">{t.wishOptions.doNot}</option>
                <option value="undecided">{t.wishOptions.undecided}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.artificialNutritionWish}</label>
              <select
                className={fieldSelect}
                value={hook.draft.artificialNutritionWish}
                onChange={(e) => hook.setDraft((prev) => prev ? { ...prev, artificialNutritionWish: e.target.value as PhilosophyRecord['artificialNutritionWish'] } : prev)}
              >
                <option value="do">{t.wishOptions.do}</option>
                <option value="doNot">{t.wishOptions.doNot}</option>
                <option value="undecided">{t.wishOptions.undecided}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.mechanicalVentilationWish}</label>
              <select
                className={fieldSelect}
                value={hook.draft.mechanicalVentilationWish}
                onChange={(e) => hook.setDraft((prev) => prev ? { ...prev, mechanicalVentilationWish: e.target.value as PhilosophyRecord['mechanicalVentilationWish'] } : prev)}
              >
                <option value="do">{t.wishOptions.do}</option>
                <option value="doNot">{t.wishOptions.doNot}</option>
                <option value="undecided">{t.wishOptions.undecided}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.decisionMaker}</label>
              <input
                className={fieldInput}
                value={hook.draft.decisionMaker}
                onChange={(e) => hook.setDraft((prev) => prev ? { ...prev, decisionMaker: e.target.value } : prev)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.decisionMakerPhone}</label>
              <input
                className={fieldInput}
                value={hook.draft.decisionMakerPhone}
                onChange={(e) => hook.setDraft((prev) => prev ? { ...prev, decisionMakerPhone: e.target.value } : prev)}
              />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs font-medium text-muted-foreground">{t.memo}</label>
              <textarea
                className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y"
                value={hook.draft.memo}
                onChange={(e) => hook.setDraft((prev) => prev ? { ...prev, memo: e.target.value } : prev)}
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
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.latestSection}</h3>
        {latestRecord ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-xs font-medium text-muted-foreground">{t.endOfLifeWish}</span>
              <span className="text-sm">{latestRecord.endOfLifeWish || '—'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.resuscitationWish}</span>
              <span className="text-sm">{t.wishOptions[latestRecord.resuscitationWish]}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.artificialNutritionWish}</span>
              <span className="text-sm">{t.wishOptions[latestRecord.artificialNutritionWish]}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.mechanicalVentilationWish}</span>
              <span className="text-sm">{t.wishOptions[latestRecord.mechanicalVentilationWish]}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.decisionMaker}</span>
              <span className="text-sm">{latestRecord.decisionMaker || '—'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.decisionMakerPhone}</span>
              <span className="text-sm">{latestRecord.decisionMakerPhone || '—'}</span>
            </div>
            {latestRecord.memo && (
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-xs font-medium text-muted-foreground">{t.memo}</span>
                <span className="text-sm">{latestRecord.memo}</span>
              </div>
            )}
            <div className="flex flex-col gap-1 col-span-2">
              <RecordMetaInfo meta={latestRecord.meta} />
            </div>
            {!isReadOnly && (
              <div className="flex flex-col gap-1 col-span-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background text-xs font-medium px-3 h-8 shadow-sm hover:bg-accent transition-colors"
                  onClick={hook.startEdit}
                >
                  {t.editBtn}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">{t.empty}</p>
        )}
      </section>
    </div>
  );
}
