'use client';

import { ja } from '@/shared/i18n/ja';

const t = ja.deptInstruction.patientIdCheck.barcodeScanGuide;

export function BarcodeScanGuideBanner() {
  return (
    <div className="w-full rounded-md bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
      {t.message}
    </div>
  );
}
