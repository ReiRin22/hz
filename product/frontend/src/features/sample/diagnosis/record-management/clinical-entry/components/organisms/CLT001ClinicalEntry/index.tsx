// src/features/diagnosis/record-management/clinical-entry/components/organisms/CLT001ClinicalEntry.tsx
'use client';

import React from 'react';
import { ChiefComplaint } from '@/features/sample/diagnosis/record-management/clinical-entry/components/organisms/CLT001ClinicalEntry/ChiefComplaint';
import { VitalInfo } from '@/features/sample/diagnosis/record-management/clinical-entry/components/organisms/CLT001ClinicalEntry/VitalInfo/index';
import { PrescriptionOrder } from '@/features/sample/diagnosis/record-management/clinical-entry/components/organisms/CLT001ClinicalEntry/PrescriptionOrder';

interface CLT001ClinicalEntryProps {
  initialChiefComplaint?: string;
  initialVitalInfo?: {
    bloodPressure?: string;
    bloodType?: string;
    rhFactor?: string;
  };
  initialPrescriptionOrder?: {
    orders?: string[];
  };
}

export const CLT001ClinicalEntry: React.FC<CLT001ClinicalEntryProps> = ({
  initialChiefComplaint,
  initialVitalInfo,
  initialPrescriptionOrder,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">CLT001</span>
          <h2 className="text-2xl font-bold text-slate-800">診療記録入力</h2>
        </div>
        <div className="space-x-2">
          <button className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 transition-colors">
            一時保存
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors">
            確定登録
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <ChiefComplaint initialValue={initialChiefComplaint} />

        <section className="grid grid-cols-2 gap-4">
          <VitalInfo
            initialBloodPressure={initialVitalInfo?.bloodPressure}
            initialBloodType={initialVitalInfo?.bloodType}
            initialRhFactor={initialVitalInfo?.rhFactor}
          />
          <PrescriptionOrder initialOrders={initialPrescriptionOrder?.orders} />
        </section>
      </div>
    </div>
  );
};
