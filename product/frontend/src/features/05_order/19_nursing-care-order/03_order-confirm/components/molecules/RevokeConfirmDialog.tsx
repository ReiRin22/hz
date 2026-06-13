'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';

interface RevokeConfirmDialogProps {
  open: boolean;
  isSubstituteUser: boolean;
  onConfirm: (cancelReason: string) => void;
  onClose: () => void;
}

export function RevokeConfirmDialog({
  open,
  isSubstituteUser,
  onConfirm,
  onClose,
}: RevokeConfirmDialogProps) {
  const [cancelReason, setCancelReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (isSubstituteUser && !cancelReason.trim()) {
      setError('取り消し理由を入力してください');
      return;
    }
    setCancelReason('');
    setError('');
    onConfirm(cancelReason);
  };

  const handleClose = () => {
    setCancelReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle data-ui-id="DLG04_LBL_TITLE">確定済みオーダーの取り消し</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm" data-ui-id="DLG04_LBL_DESC">
            このオーダーは既に確定されています。確定済みオーダーを取り消しすると、実施内容や予定に影響が生じる可能性があります。本当に取り消しますか？
          </p>
          <div className="space-y-1">
            <label className="text-sm font-medium" data-ui-id="DLG04_LBL_REASON">
              取り消し理由{isSubstituteUser && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                if (error) setError('');
              }}
              maxLength={256}
              placeholder="取り消し理由を入力してください"
              data-ui-id="DLG04_TXT_REASON"
              aria-invalid={!!error}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" data-ui-id="DLG04_BTN_CANCEL" onClick={handleClose}>
            キャンセル
          </Button>
          <Button variant="destructive" data-ui-id="DLG04_BTN_REVOKE" onClick={handleConfirm}>
            取り消す
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
