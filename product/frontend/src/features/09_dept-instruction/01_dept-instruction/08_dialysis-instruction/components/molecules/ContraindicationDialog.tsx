import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/atoms/dialog';
import { Button } from '@shared/components/atoms/button';
import { Badge } from '@shared/components/atoms/badge';
import { useState } from 'react';
import type { Order, Contraindication } from '../../types';

interface ContraindicationDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  contraindications: Contraindication[];
}

export function ContraindicationDialog({ open, onClose, order, contraindications }: ContraindicationDialogProps) {
  const [confirmedItems, setConfirmedItems] = useState<Set<string>>(new Set());

  if (!order) return null;

  const handleConfirm = (id: string) => {
    setConfirmedItems(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">特記事項詳細</DialogTitle>
        </DialogHeader>

        {/* 患者情報 - 固定 */}
        <div className="space-y-1 text-sm pb-4 border-b">
          <div>
            <span className="font-medium">患者:</span> {order.patientName} ({order.patientId})
          </div>
          <div>
            <span className="font-medium">生年月日:</span> {order.birthDate} ({order.age}歳 {order.gender})
          </div>
          {order.height && order.weight && (
            <div>
              <span className="font-medium">身長・体重:</span> {order.height}cm / {order.weight}kg
            </div>
          )}
        </div>

        {/* 特記事項リスト - スクロール可能 */}
        <div className="space-y-3 overflow-y-auto flex-1 py-4">
          {contraindications.map((item) => (
            <div
              key={item.id}
              className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500 text-white"
                    >
                      {item.type}
                    </Badge>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">詳細:</span> {item.reason}
                  </div>
                  <div className="text-xs text-gray-600">
                    登録日: {item.registeredDate} | 登録元: {item.registeredBy}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {contraindications.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              特記事項はありません
            </div>
          )}
        </div>

        {/* 閉じるボタン */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}