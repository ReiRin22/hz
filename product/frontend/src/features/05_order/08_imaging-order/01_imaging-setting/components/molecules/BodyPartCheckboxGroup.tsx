'use client';

/**
 * 画像オーダー - 検査部位チェックボックスグループ
 * molecules: 検査部位の複数選択UI
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/BodyPartCheckboxGroup.tsx
 */

import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Label } from '@/shared/components/atoms/label';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';

export interface BodyPartCheckboxGroupProps {
  availableBodyParts: string[];
  selectedBodyParts: string[];
  onToggle: (bodyPart: string) => void;
}

export function BodyPartCheckboxGroup({
  availableBodyParts,
  selectedBodyParts,
  onToggle
}: BodyPartCheckboxGroupProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">検査部位（複数選択可）</Label>
      <div className="border border-border rounded-lg bg-white overflow-hidden">
        <ScrollArea className="h-[240px]">
          <div className="p-3 space-y-2">
            {availableBodyParts.length === 0 ? (
              <div className="text-sm text-muted-foreground p-2">選択可能な部位がありません</div>
            ) : (
              availableBodyParts.map((part) => (
                <label
                  key={part}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded transition-colors"
                >
                  <Checkbox
                    checked={selectedBodyParts.includes(part)}
                    onCheckedChange={() => onToggle(part)}
                  />
                  <span className="text-sm">{part}</span>
                </label>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      {selectedBodyParts.length > 0 && (
        <div className="text-xs text-muted-foreground px-1">
          選択中 ({selectedBodyParts.length}件): {selectedBodyParts.join(', ')}
        </div>
      )}
    </div>
  );
}
