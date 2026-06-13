'use client';

/**
 * SaveDialog - 一時保存ダイアログ (Molecule)
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/SaveDialog.tsx
 */

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';

interface SaveDialogProps {
  open: boolean;
  saveName: string;
  onOpenChange: (open: boolean) => void;
  onSaveNameChange: (name: string) => void;
  onSave: () => void;
}

export function SaveDialog({
  open,
  saveName,
  onOpenChange,
  onSaveNameChange,
  onSave
}: SaveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>一時保存</DialogTitle>
          <DialogDescription>
            現在のオーダー内容を一時保存します。保存名を入力してください。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="save-name">保存名</Label>
            <Input
              id="save-name"
              value={saveName}
              onChange={(e) => onSaveNameChange(e.target.value)}
              placeholder="例: 高血圧セット"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={onSave} disabled={!saveName.trim()}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
