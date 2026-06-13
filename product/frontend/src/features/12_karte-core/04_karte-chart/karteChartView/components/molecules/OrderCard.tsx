'use client';

/**
 * オーダーカードコンポーネント
 *
 * 参照元: 【ORD032～ORD035】src/components/features/chart/_components/molecules/OrderCard.tsx
 */

import * as React from 'react';
import { Edit, Trash2, Clock } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Badge } from '@/shared/components/atoms/badge';
import { Card, CardContent } from '@/shared/components/atoms/card';

interface OrderCardProps {
  id: string;
  type: 'prescription' | 'injection' | 'lab' | 'imaging' | 'treatment';
  name: string;
  iconBgColor: string;
  icon: React.ReactNode;
  badgeLabel?: string;
  badgeClassName?: string;
  details: Array<{ label?: string; value: string }>;
  scheduledTime?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  prescription: '処方',
  injection: '注射',
  lab: '検体検査',
  imaging: '画像検査',
  treatment: '処置',
};

export const OrderCard: React.FC<OrderCardProps> = ({
  id,
  type,
  name,
  iconBgColor,
  icon,
  badgeLabel,
  badgeClassName,
  details,
  scheduledTime,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 ${iconBgColor} rounded flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium">
                {TYPE_LABELS[type] ?? ''}
              </span>
              {badgeLabel && (
                <Badge variant="outline" className={badgeClassName}>
                  {badgeLabel}
                </Badge>
              )}
              <span className="text-sm">{name}</span>
            </div>

            <div className="text-xs text-muted-foreground space-y-0.5">
              {details.map((detail, index) => (
                <div key={index}>
                  {detail.label ? `${detail.label}：${detail.value}` : detail.value}
                </div>
              ))}
              {scheduledTime && (
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>基準予定：{scheduledTime}</span>
                </div>
              )}
            </div>
          </div>

          {(onEdit || onDelete) && (
            <div className="flex gap-1 flex-shrink-0">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600"
                  onClick={onEdit}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                  onClick={onDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
