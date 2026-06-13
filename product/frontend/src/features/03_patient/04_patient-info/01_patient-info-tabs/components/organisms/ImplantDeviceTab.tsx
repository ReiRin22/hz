import type { ImplantDeviceData } from '../../types/patientInfo.type';
import { SectionTable } from '../molecules/SectionTable';
import { RecordMetaInfo } from '../molecules/RecordMetaInfo';
import { DeleteConfirmDialog } from '../molecules/DeleteConfirmDialog';
import { useImplantDevice } from '../../hooks/useImplantDevice';
import { usePatientInfoToast } from '../../hooks/useToast';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.implantDeviceTab;

interface ImplantDeviceTabProps {
  data: ImplantDeviceData;
  isReadOnly?: boolean;
}

export function ImplantDeviceTab({ data, isReadOnly = false }: ImplantDeviceTabProps) {
  const hook = useImplantDevice(data);
  const { showDeleteSuccess } = usePatientInfoToast();

  const handleDeleteConfirm = () => {
    if (!hook.deleteTarget) return;
    if (hook.deleteTarget.type === 'pacemaker') hook.deletePacemaker(hook.deleteTarget.id);
    if (hook.deleteTarget.type === 'aneurysmClip') hook.deleteAneurysmClip(hook.deleteTarget.id);
    if (hook.deleteTarget.type === 'metalImplant') hook.deleteMetalImplant(hook.deleteTarget.id);
    hook.setDeleteTarget(null);
    showDeleteSuccess();
  };

  return (
    <div className="p-4 space-y-6">
      {/* ペースメーカー */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.pacemakerSection}</h3>
        <SectionTable
          columns={[
            { key: 'deviceName', label: t.pacemakerColumns.deviceName },
            { key: 'manufacturer', label: t.pacemakerColumns.manufacturer },
            { key: 'implantDate', label: t.pacemakerColumns.implantDate },
            { key: 'serialNumber', label: t.pacemakerColumns.serialNumber },
          ]}
          rows={hook.data.pacemakers}
          renderDetail={(row) => (
            <div className="space-y-2">
              {row.memo && <p className="text-sm">{row.memo}</p>}
              <RecordMetaInfo meta={row.meta} />
            </div>
          )}
          isReadOnly={isReadOnly}
          onAdd={isReadOnly ? undefined : () => {/* TODO: フォーム実装 */}}
          onDelete={isReadOnly ? undefined : (id) => hook.setDeleteTarget({ type: 'pacemaker', id })}
        />
      </section>

      {/* 動脈瘤クリップ */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.aneurysmClipSection}</h3>
        <SectionTable
          columns={[
            { key: 'location', label: t.aneurysmClipColumns.location },
            { key: 'implantDate', label: t.aneurysmClipColumns.implantDate },
            { key: 'hospital', label: t.aneurysmClipColumns.hospital },
          ]}
          rows={hook.data.aneurysmClips}
          renderDetail={(row) => (
            <div className="space-y-2">
              {row.memo && <p className="text-sm">{row.memo}</p>}
              <RecordMetaInfo meta={row.meta} />
            </div>
          )}
          isReadOnly={isReadOnly}
          onAdd={isReadOnly ? undefined : () => {/* TODO: フォーム実装 */}}
          onDelete={isReadOnly ? undefined : (id) => hook.setDeleteTarget({ type: 'aneurysmClip', id })}
        />
      </section>

      {/* 体内埋込金属 */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.metalImplantSection}</h3>
        <SectionTable
          columns={[
            { key: 'partName', label: t.metalImplantColumns.partName },
            { key: 'materialName', label: t.metalImplantColumns.materialName },
            { key: 'implantDate', label: t.metalImplantColumns.implantDate },
          ]}
          rows={hook.data.metalImplants}
          renderDetail={(row) => (
            <div className="space-y-2">
              {row.memo && <p className="text-sm">{row.memo}</p>}
              <RecordMetaInfo meta={row.meta} />
            </div>
          )}
          isReadOnly={isReadOnly}
          onAdd={isReadOnly ? undefined : () => {/* TODO: フォーム実装 */}}
          onDelete={isReadOnly ? undefined : (id) => hook.setDeleteTarget({ type: 'metalImplant', id })}
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
