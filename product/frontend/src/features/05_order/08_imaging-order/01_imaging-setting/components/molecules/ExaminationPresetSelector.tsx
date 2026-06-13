'use client';

/**
 * ExaminationPresetSelector - 検査プリセット選択 (Molecule)
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/ExaminationPresetSelector.tsx
 */

import { Button } from '@/shared/components/atoms/button';
import { Label } from '@/shared/components/atoms/label';

interface PresetOption {
  id: string;
  name: string;
  description: string;
  bodyParts: string;
  directions: string[];
  laterality: string[];
  radiationCondition: string;
  positions: string[];
  functionalConditions: string[];
}

interface ExaminationPresetSelectorProps {
  presets: PresetOption[];
  onSelectPreset: (preset: PresetOption) => void;
}

export function ExaminationPresetSelector({
  presets,
  onSelectPreset
}: ExaminationPresetSelectorProps) {
  if (presets.length === 0) return null;

  return (
    <div className="border border-border rounded-lg p-3 space-y-2">
      <Label>検査プリセット</Label>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            variant="outline"
            size="sm"
            className="h-auto py-3 text-xs flex flex-col items-start gap-1"
            onClick={() => onSelectPreset(preset)}
          >
            <span className="font-medium">{preset.name}</span>
            <span className="text-[10px] text-muted-foreground">
              {preset.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
