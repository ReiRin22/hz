'use client';

/**
 * オーダーリストヘッダーアクション
 * molecules: タイトルと操作ボタン（一時保存、追加）
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/OrderListHeaderActions.tsx
 */

import { Plus, Save } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';

export interface OrderListHeaderActionsProps {
  onTemporarySaveClick: () => void;
  onAddClick: () => void;
}

export function OrderListHeaderActions({
  onTemporarySaveClick,
  onAddClick
}: OrderListHeaderActionsProps) {
  return (
    <div className="p-3 border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-sm font-medium">オーダーリスト</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onTemporarySaveClick}>
            <Save className="w-4 h-4 mr-1" />
            一時保存
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onAddClick}>
            <Plus className="w-4 h-4 mr-1" />
            追加
          </Button>
        </div>
      </div>
    </div>
  );
}
