import type { AccessControlData } from '../../types/patientInfo.type';
import { useAccessControl } from '../../hooks/useAccessControl';
import { usePatientInfoToast } from '../../hooks/useToast';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.accessControlTab;

const fieldSelect = 'h-8 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';

interface AccessControlTabProps {
  data: AccessControlData;
}

/** admin のみ表示・編集可能 */
export function AccessControlTab({ data }: AccessControlTabProps) {
  const hook = useAccessControl(data);
  const { showSaveSuccess } = usePatientInfoToast();

  const handleSaveVip = () => {
    hook.saveVipSetting();
    showSaveSuccess();
  };

  return (
    <div className="p-4 space-y-6">
      {/* VIP設定 */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.vipSection}</h3>
        {hook.isEditingVip ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.isVip}</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vip-switch"
                  className="h-4 w-4 accent-primary cursor-pointer"
                  checked={hook.vipDraft.isVip}
                  onChange={(e) => hook.setVipDraft((prev) => ({ ...prev, isVip: e.target.checked }))}
                />
                <label htmlFor="vip-switch" className="text-sm cursor-pointer">
                  {hook.vipDraft.isVip ? t.vipOn : t.vipOff}
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t.restrictionLevel}</label>
              <select
                className={fieldSelect}
                value={hook.vipDraft.restrictionLevel}
                onChange={(e) =>
                  hook.setVipDraft((prev) => ({
                    ...prev,
                    restrictionLevel: e.target.value as AccessControlData['vipSetting']['restrictionLevel'],
                  }))
                }
              >
                <option value="none">{t.restrictionLevelOptions.none}</option>
                <option value="partial">{t.restrictionLevelOptions.partial}</option>
                <option value="full">{t.restrictionLevelOptions.full}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs font-medium text-muted-foreground">{t.vipMemo}</label>
              <textarea
                className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y"
                value={hook.vipDraft.memo}
                onChange={(e) => hook.setVipDraft((prev) => ({ ...prev, memo: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-medium px-3 h-8 shadow-sm hover:bg-primary/90 transition-colors"
                  onClick={handleSaveVip}
                >
                  {t.saveBtn}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background text-xs font-medium px-3 h-8 shadow-sm hover:bg-accent transition-colors"
                  onClick={hook.cancelVipEdit}
                >
                  {t.cancelBtn}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.isVip}</span>
              <span className="text-sm">{hook.data.vipSetting.isVip ? t.vipOn : t.vipOff}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{t.restrictionLevel}</span>
              <span className="text-sm">{t.restrictionLevelOptions[hook.data.vipSetting.restrictionLevel]}</span>
            </div>
            {hook.data.vipSetting.memo && (
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-xs font-medium text-muted-foreground">{t.vipMemo}</span>
                <span className="text-sm">{hook.data.vipSetting.memo}</span>
              </div>
            )}
            <div className="flex flex-col gap-1 col-span-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background text-xs font-medium px-3 h-8 shadow-sm hover:bg-accent transition-colors"
                onClick={hook.startVipEdit}
              >
                {t.editBtn}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ユーザー管理 */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.userAccessSection}</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">{t.userAccessColumns.userName}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">{t.userAccessColumns.role}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">{t.userAccessColumns.canView}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">{t.userAccessColumns.canEdit}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">{t.userAccessColumns.grantedBy}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 w-16" />
            </tr>
          </thead>
          <tbody>
            {hook.data.userAccesses.map((ua) => (
              <tr key={ua.id} className="border-b hover:bg-muted/40 transition-colors">
                <td className="px-3 py-2 text-sm">{ua.userName}</td>
                <td className="px-3 py-2 text-sm">{ua.role}</td>
                <td className="px-3 py-2 text-sm">{ua.canView ? t.yes : t.no}</td>
                <td className="px-3 py-2 text-sm">{ua.canEdit ? t.yes : t.no}</td>
                <td className="px-3 py-2 text-sm">{ua.grantedBy}</td>
                <td className="px-3 py-2 text-sm w-16">
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline"
                    onClick={() => hook.revokeAccess(ua.userId)}
                  >
                    {t.revokeBtn}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
