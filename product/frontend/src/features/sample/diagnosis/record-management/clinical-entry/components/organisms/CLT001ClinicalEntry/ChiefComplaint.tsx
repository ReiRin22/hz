// src/features/diagnosis/record-management/clinical-entry/components/organisms/ChiefComplaint.tsx
'use client';

import React, { useState } from 'react';

interface ChiefComplaintProps {
  initialValue?: string;
}

export const ChiefComplaint: React.FC<ChiefComplaintProps> = ({ initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  return (
    <section>
      <label className="block text-sm font-bold text-slate-700 mb-2">主訴・所見</label>
      <textarea
        className="w-full h-40 p-4 border rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        placeholder="患者の訴え、客観的所見を入力してください..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </section>
  );
};
