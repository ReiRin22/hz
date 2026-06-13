'use client';

/**
 * 記録リストアイテムコンポーネント
 *
 * 参照元: 【ORD032～ORD035】src/components/features/chart/_components/molecules/RecordListItem.tsx
 */

import * as React from 'react';
import { Calendar } from 'lucide-react';
import { Badge } from '@/shared/components/atoms/badge';

interface RecordListItemProps {
  id: number;
  date: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}

export const RecordListItem: React.FC<RecordListItemProps> = ({ id, date, count, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-2 rounded text-xs hover:bg-accent transition-colors ${
        isSelected ? 'bg-accent' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Calendar className="w-3 h-3 text-muted-foreground" />
        <span>{date}</span>
      </div>
      {count > 0 && (
        <Badge variant="secondary" className="h-4 px-1 text-xs">
          {count}
        </Badge>
      )}
    </button>
  );
};
