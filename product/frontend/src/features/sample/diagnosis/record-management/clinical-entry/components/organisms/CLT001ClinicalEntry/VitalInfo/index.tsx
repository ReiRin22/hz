// src/features/diagnosis/record-management/clinical-entry/components/organisms/CLT001ClinicalEntry/VitalInfo/index.tsx
'use client';

import React from 'react';
import { BloodPressure } from '@/features/sample/diagnosis/record-management/clinical-entry/components/organisms/CLT001ClinicalEntry/VitalInfo/BloodPressure';
import { BloodType } from '@shared/sample/components/organisms/BloodType';

interface VitalInfoProps {
  initialBloodPressure?: string;
  initialBloodType?: string;
  initialRhFactor?: string;
}

export const VitalInfo: React.FC<VitalInfoProps> = ({
  initialBloodPressure,
  initialBloodType,
  initialRhFactor,
}) => {
  return (
    <div className="p-4 border rounded bg-slate-50">
      <span className="text-sm font-bold block mb-3 border-b pb-1">バイタル情報</span>
      <div className="space-y-2">
        <BloodPressure initialValue={initialBloodPressure} />
        <BloodType initialBloodType={initialBloodType} initialRhFactor={initialRhFactor} />
      </div>
    </div>
  );
};
