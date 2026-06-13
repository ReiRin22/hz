'use client';

/**
 * CategoryDisplay - 検査種別表示 (Molecule)
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/CategoryDisplay.tsx
 */

import { Label } from '@/shared/components/atoms/label';

interface CategoryDisplayProps {
  categoryLabel: string;
}

export function CategoryDisplay({ categoryLabel }: CategoryDisplayProps) {
  return (
    <div className="border border-border rounded-lg p-3 space-y-2">
      <Label>検査種別</Label>
      <div className="text-base px-3 py-2 bg-muted rounded-md">
        {categoryLabel}
      </div>
    </div>
  );
}
