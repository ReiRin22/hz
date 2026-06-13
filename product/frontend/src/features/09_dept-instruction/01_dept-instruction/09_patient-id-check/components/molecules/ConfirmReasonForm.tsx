'use client';

import { ja } from '@/shared/i18n/ja';
import type { ReasonTemplate } from '../../types/patientIdCheck.viewmodel';

const t = ja.deptInstruction.patientIdCheck.confirmReasonForm;

interface ConfirmReasonFormProps {
  templates: ReasonTemplate[];
  presetCode: string;
  customText: string;
  isSaving: boolean;
  saveError: string | null;
  onPresetChange: (code: string) => void;
  onCustomTextChange: (text: string) => void;
  onSave: () => void;
}

export function ConfirmReasonForm({
  templates,
  presetCode,
  customText,
  isSaving,
  saveError,
  onPresetChange,
  onCustomTextChange,
  onSave,
}: ConfirmReasonFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {t.presetLabel}
        </label>
        <select
          value={presetCode}
          onChange={(e) => onPresetChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t.presetPlaceholder}</option>
          {templates.map((tmpl) => (
            <option key={tmpl.code} value={tmpl.code}>
              {tmpl.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {t.customLabel}
        </label>
        <textarea
          value={customText}
          onChange={(e) => onCustomTextChange(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t.customPlaceholder}
        />
      </div>
      {saveError && (
        <p role="alert" className="text-xs text-red-600">
          {saveError}
        </p>
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSaving ? t.saving : t.save}
      </button>
    </div>
  );
}
