'use client';

import type { ReactNode } from 'react';

type SectionStatus = 'pending' | 'ok' | 'ng';
type SectionType = 'patient' | 'item' | 'practitioner';

interface PatientIdCheckSectionProps {
  title: string;
  status: SectionStatus;
  sectionType: SectionType;
  timestamp?: string;
  children: ReactNode;
}

const borderBySectionType: Record<SectionType, string> = {
  patient: 'border-blue-500',
  item: 'border-orange-500',
  practitioner: 'border-green-500',
};

export function PatientIdCheckSection({
  title,
  status,
  sectionType,
  timestamp,
  children,
}: PatientIdCheckSectionProps) {
  return (
    <section
      className={`rounded-lg border-2 ${borderBySectionType[sectionType]} bg-white p-4 space-y-3`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full border-4 ${
            status === 'ok'
              ? 'bg-green-500 border-green-600'
              : 'bg-gray-200 border-gray-300'
          }`}
        >
          {status === 'ok' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <div className="w-7 h-7 rounded-full border-4 border-gray-400" />
          )}
        </div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        {timestamp && (
          <span className="ml-auto text-xs text-gray-400">{timestamp}</span>
        )}
      </div>
      {children}
    </section>
  );
}
