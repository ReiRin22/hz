// src/features/diagnosis/record-management/clinical-entry/components/organisms/CLT001ClinicalEntry/VitalInfo/BloodPressure.tsx
'use client';

import React, { useState } from 'react';
import { NumericInputWithLabel } from '@shared/sample/components/molecules/NumericInputWithLabel';

interface BloodPressureProps {
  initialValue?: string;
}

export const BloodPressure: React.FC<BloodPressureProps> = ({ initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <NumericInputWithLabel
        label="BP(上):"
        unit="mmHg"
        placeholder="---"
        value={value}
        onChange={setValue}
      />
      <p className="text-[10px] text-slate-400 mt-2">※前回値: 120/80 (2026/03/10)</p>
    </>
  );
};
