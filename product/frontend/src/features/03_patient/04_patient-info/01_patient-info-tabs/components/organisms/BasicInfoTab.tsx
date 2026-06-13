import type { BasicInfoRecord } from '../../types/patientInfo.type';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.basicInfoTab;

interface BasicInfoTabProps {
  record: BasicInfoRecord;
  onChange: (record: BasicInfoRecord) => void;
}

const fieldInput = 'h-8 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';
const fieldInputReadonly = `${fieldInput} bg-muted text-muted-foreground cursor-not-allowed opacity-70`;

export function BasicInfoTab({ record, onChange }: BasicInfoTabProps) {
  const handleChange = (field: keyof BasicInfoRecord, value: string) => {
    onChange({ ...record, [field]: value });
  };

  return (
    <div className="p-4 space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.systemLinkedSection}</h3>
        <p className="text-xs text-muted-foreground">{t.systemLinkedNote}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.patientId}</label>
            <input className={fieldInputReadonly} value={record.patientId} readOnly disabled />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.name}</label>
            <input className={fieldInputReadonly} value={record.name} readOnly disabled />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.nameKana}</label>
            <input className={fieldInputReadonly} value={record.nameKana} readOnly disabled />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.birthDate}</label>
            <input className={fieldInputReadonly} value={record.birthDate} readOnly disabled />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.gender}</label>
            <input className={fieldInputReadonly} value={t.genderOptions[record.gender]} readOnly disabled />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.bloodType}</label>
            <input className={fieldInputReadonly} value={record.bloodType === 'unknown' ? t.bloodTypeUnknown : t.bloodTypeFormat(record.bloodType)} readOnly disabled />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.insuranceNumber}</label>
            <input className={fieldInputReadonly} value={record.insuranceNumber} readOnly disabled />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.editableSection}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs font-medium text-muted-foreground">{t.address}</label>
            <input
              className={fieldInput}
              value={record.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.phone}</label>
            <input
              className={fieldInput}
              value={record.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.emergencyContact}</label>
            <input
              className={fieldInput}
              value={record.emergencyContact}
              onChange={(e) => handleChange('emergencyContact', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.emergencyPhone}</label>
            <input
              className={fieldInput}
              value={record.emergencyPhone}
              onChange={(e) => handleChange('emergencyPhone', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.occupation}</label>
            <input
              className={fieldInput}
              value={record.occupation}
              onChange={(e) => handleChange('occupation', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.nationality}</label>
            <input
              className={fieldInput}
              value={record.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.religion}</label>
            <input
              className={fieldInput}
              value={record.religion}
              onChange={(e) => handleChange('religion', e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">{t.admissionSection}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs font-medium text-muted-foreground">{t.primaryDiagnosis}</label>
            <input className={fieldInputReadonly} value={record.primaryDiagnosis} readOnly disabled />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.admissionDate}</label>
            <input className={fieldInputReadonly} value={record.admissionDate} readOnly disabled />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.ward}</label>
            <input className={fieldInputReadonly} value={record.ward} readOnly disabled />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t.room}</label>
            <input className={fieldInputReadonly} value={record.room} readOnly disabled />
          </div>
        </div>
      </section>
    </div>
  );
}
