'use client';

import { ja } from '@/shared/i18n/ja';

const t = ja.deptInstruction.patientIdCheck.barcodeReadInfoCard;

type ReadStatus = 'waiting' | 'ok' | 'ng';

interface BarcodeReadInfoCardProps {
  status: ReadStatus;
  scannedValue?: string;
  expectedValue?: string;
}

const statusClassNames: Record<ReadStatus, string> = {
  waiting: 'bg-gray-50 border-gray-200 text-gray-500',
  ok:      'bg-green-50 border-green-200 text-green-700',
  ng:      'bg-orange-50 border-orange-200 text-orange-700',
};

export function BarcodeReadInfoCard({ status, scannedValue, expectedValue }: BarcodeReadInfoCardProps) {
  return (
    <div className={`rounded-md border px-3 py-2 text-sm ${statusClassNames[status]}`}>
      <div className="font-medium">{t.title}</div>
      <div className="mt-1">{t.statusLabels[status]}</div>
      {scannedValue && (
        <div className="mt-1 font-mono text-xs">{t.scannedValue(scannedValue)}</div>
      )}
      {status === 'ng' && expectedValue && (
        <div className="mt-0.5 font-mono text-xs">{t.expectedValue(expectedValue)}</div>
      )}
    </div>
  );
}
