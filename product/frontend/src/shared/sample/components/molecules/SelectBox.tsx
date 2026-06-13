// src/shared/components/molecules/SelectBox.tsx
'use client';

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectBoxProps {
  options: readonly SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SelectBox: React.FC<SelectBoxProps> = ({
  options,
  value,
  onChange,
  placeholder = '---',
  className = 'border rounded px-2 py-1 text-sm bg-white',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <select className={className} value={value} onChange={handleChange}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
