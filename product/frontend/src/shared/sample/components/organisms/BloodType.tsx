// src/shared/components/organisms/BloodType.tsx
'use client';

import React, { useState } from 'react';
import { SelectBox } from '@shared/sample/components/molecules/SelectBox';
import { useBloodTypeMaster } from '@shared/sample/api/useBloodTypeMaster';

interface BloodTypeProps {
  initialBloodType?: string;
  initialRhFactor?: string;
}

export const BloodType: React.FC<BloodTypeProps> = ({
  initialBloodType = '',
  initialRhFactor = '',
}) => {
  const [bloodType, setBloodType] = useState(initialBloodType);
  const [rhFactor, setRhFactor] = useState(initialRhFactor);

  // 血液型マスタデータを取得
  const { data: masterData, isLoading } = useBloodTypeMaster();

  if (isLoading || !masterData) {
    return (
      <div className="flex items-center space-x-2 mt-4">
        <span className="text-xs w-12 text-slate-500">血液型:</span>
        <span className="text-xs text-slate-400">読み込み中...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 mt-4">
      <span className="text-xs w-12 text-slate-500">血液型:</span>
      <SelectBox
        options={masterData.bloodTypes}
        placeholder="---"
        value={bloodType}
        onChange={setBloodType}
      />
      <SelectBox
        options={masterData.rhFactors}
        placeholder="---"
        value={rhFactor}
        onChange={setRhFactor}
      />
    </div>
  );
};
