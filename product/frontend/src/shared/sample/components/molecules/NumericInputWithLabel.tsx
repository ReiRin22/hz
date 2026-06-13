// src/shared/components/molecules/NumericInputWithLabel.tsx
'use client';

import React from 'react';

interface NumericInputWithLabelProps {
  label: string;
  unit?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  labelWidth?: string;
}

export const NumericInputWithLabel: React.FC<NumericInputWithLabelProps> = ({
  label,
  unit,
  placeholder = '---',
  value,
  onChange,
  labelWidth = 'w-12',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // 数値と小数点のみ許可
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange?.(inputValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className={`text-xs ${labelWidth} text-slate-500`}>{label}</span>
      <input
        type="text"
        className="border rounded px-2 py-1 w-20 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {unit && <span className="text-xs text-slate-400">{unit}</span>}
    </div>
  );
};
