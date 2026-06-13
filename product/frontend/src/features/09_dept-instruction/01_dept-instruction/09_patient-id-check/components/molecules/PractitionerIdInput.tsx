'use client';

import { ja } from '@/shared/i18n/ja';

const t = ja.deptInstruction.patientIdCheck.practitionerIdInput;

interface PractitionerIdInputProps {
  value: string;
  validationError: string | null;
  onChange: (id: string) => void;
  onRegister: () => void;
}

export function PractitionerIdInput({
  value,
  validationError,
  onChange,
  onRegister,
}: PractitionerIdInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600">
        {t.label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-describedby={validationError ? 'practitioner-id-error' : undefined}
        />
        <button
          type="button"
          onClick={onRegister}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t.register}
        </button>
      </div>
      {validationError && (
        <p id="practitioner-id-error" role="alert" className="text-xs text-red-600">
          {validationError}
        </p>
      )}
    </div>
  );
}
