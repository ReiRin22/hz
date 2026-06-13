'use client';

/**
 * LoadDialog - 一時保存読み込みダイアログ (Molecule)
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/LoadDialog.tsx
 */

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';
import { Trash2 } from 'lucide-react';
import type { SavedOrderData } from '../../types/order-shared.types';

interface LoadDialogProps {
  open: boolean;
  savedOrderDataList: SavedOrderData[];
  onOpenChange: (open: boolean) => void;
  onLoad: (saveData: SavedOrderData) => void;
  onDelete: (saveId: string) => void;
}

export function LoadDialog({
  open,
  savedOrderDataList,
  onOpenChange,
  onLoad,
  onDelete
}: LoadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>一時保存データの読み込み</DialogTitle>
          <DialogDescription>
            一時保存されたオーダー内容を読み込みます。
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          {savedOrderDataList.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              保存されたデータがありません
            </div>
          ) : (
            <div className="space-y-2">
              {savedOrderDataList.map((saveData) => (
                <div
                  key={saveData.id}
                  className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="font-medium">{saveData.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {saveData.orders.length}件のオーダー • {new Date(saveData.savedAt).toLocaleString('ja-JP')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        onLoad(saveData);
                        onOpenChange(false);
                      }}
                    >
                      読み込み
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(saveData.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
