'use client';

/**
 * 特別指示入力 - ImagingOrderDetailPanel用UI部品
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/SpecialInstructionsInput.tsx
 */

import { MessageSquare } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Label } from '@/shared/components/atoms/label';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Badge } from '@/shared/components/atoms/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';

export interface SpecialInstructionsInputProps {
  value: string;
  availableInstructions: string[];
  onChange: (value: string) => void;
  onToggleInstruction: (instruction: string) => void;
}

const MY_COMMENTS = [
  '体動困難のため介助が必要',
  'ペースメーカー留置あり',
  '体位変換困難',
  '意思疎通困難',
  '聴力低下あり',
  '視力低下あり',
  '車椅子使用中',
  'ストレッチャー使用',
  '酸素投与中',
  '点滴施行中'
];

export function SpecialInstructionsInput({
  value,
  availableInstructions,
  onChange,
  onToggleInstruction
}: SpecialInstructionsInputProps) {
  const handleAddMyComment = (comment: string) => {
    const current = value || '';
    const newValue = current ? `${current}\n${comment}` : comment;
    onChange(newValue);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label>特別指示</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              <MessageSquare className="w-3 h-3" />
              Myコメント
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Myコメント</h4>
              <p className="text-xs text-muted-foreground">よく使うコメントを選択</p>
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {MY_COMMENTS.map((comment) => (
                  <Button
                    key={comment}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-auto py-2 whitespace-normal text-left"
                    onClick={() => handleAddMyComment(comment)}
                  >
                    {comment}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {availableInstructions.map((instruction) => (
          <Badge
            key={instruction}
            variant={value?.includes(instruction) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onToggleInstruction(instruction)}
          >
            {instruction}
          </Badge>
        ))}
      </div>
      <Textarea
        placeholder="特別指示があれば入力してください"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    </div>
  );
}
