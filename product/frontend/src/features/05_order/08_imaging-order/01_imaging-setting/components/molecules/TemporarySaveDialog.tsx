'use client';

/**
 * 一時保存ダイアログ
 * molecules: オーダーの一時保存用ダイアログ
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/TemporarySaveDialog.tsx
 */

import { Save } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/atoms/dialog';
import { Label } from '@/shared/components/atoms/label';

export interface TemporarySaveDialogProps {
  open: boolean;
  saveName: string;
  onOpenChange: (open: boolean) => void;
  onSaveNameChange: (name: string) => void;
  onSave: () => void;
}

export function TemporarySaveDialog({
  open,
  saveName,
  onOpenChange,
  onSaveNameChange,
  onSave
}: TemporarySaveDialogProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && saveName.trim()) {
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>一時保存</DialogTitle>
          <DialogDescription>
            現在のオーダー内容を一時保存します
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="save-name">保存名</Label>
            <Input
              id="save-name"
              value={saveName}
              onChange={(e) => onSaveNameChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="保存名を入力"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={onSave} disabled={!saveName.trim()}>
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
