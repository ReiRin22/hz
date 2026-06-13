'use client';

import { ja } from '@/shared/i18n/ja';
import { CONFIRMER_TYPES, type ConfirmerType } from '../../types/patientIdCheck.viewmodel';

const t = ja.deptInstruction.patientIdCheck.confirmerRadioGroup;

interface ConfirmerRadioGroupProps {
  value: ConfirmerType;
  onChange: (value: ConfirmerType) => void;
}

export function ConfirmerRadioGroup({ value, onChange }: ConfirmerRadioGroupProps) {
  return (
    <fieldset>
      <legend className="sr-only">{t.legend}</legend>
      <div className="flex flex-wrap gap-4">
        {CONFIRMER_TYPES.map((type) => (
          <label key={type} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="confirmer"
              value={type}
              checked={value === type}
              onChange={() => onChange(type)}
              className="accent-blue-600"
            />
            {t.labels[type]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
