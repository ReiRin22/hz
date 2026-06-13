'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';

interface EditConfirmDialogProps {
  open: boolean;
  isSubstituteUser: boolean;
  onConfirm: (editReason: string) => void;
  onClose: () => void;
}

export function EditConfirmDialog({
  open,
  isSubstituteUser,
  onConfirm,
  onClose,
}: EditConfirmDialogProps) {
  const [editReason, setEditReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (isSubstituteUser && !editReason.trim()) {
      setError('編集理由を入力してください');
      return;
    }
    setEditReason('');
    setError('');
    onConfirm(editReason);
  };

  const handleClose = () => {
    setEditReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle data-ui-id="DLG03_LBL_TITLE">確定済みオーダーの編集</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm" data-ui-id="DLG03_LBL_DESC">
            このオーダーは既に確定されています。確定済みオーダーを編集すると、実施内容や予定に影響が生じる可能性があります。本当に編集しますか？
          </p>
          <div className="space-y-1">
            <label className="text-sm font-medium" data-ui-id="DLG03_LBL_REASON">
              編集理由{isSubstituteUser && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              value={editReason}
              onChange={(e) => {
                setEditReason(e.target.value);
                if (error) setError('');
              }}
              maxLength={256}
              placeholder="編集理由を入力してください"
              data-ui-id="DLG03_TXT_REASON"
              aria-invalid={!!error}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" data-ui-id="DLG03_BTN_CANCEL" onClick={handleClose}>
            キャンセル
          </Button>
          <Button data-ui-id="DLG03_BTN_EDIT" onClick={handleConfirm}>
            編集する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
