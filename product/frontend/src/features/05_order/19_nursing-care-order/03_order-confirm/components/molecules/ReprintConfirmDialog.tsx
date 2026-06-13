'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';

interface ReprintConfirmDialogProps {
  open: boolean;
  orderDiff: string;
  onConfirmOnly: () => void;
  onReprint: () => void;
  onClose: () => void;
}

export function ReprintConfirmDialog({
  open,
  orderDiff,
  onConfirmOnly,
  onReprint,
  onClose,
}: ReprintConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle data-ui-id="DLG05_LBL_TITLE">帳票の再出力確認</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm whitespace-pre-wrap" data-ui-id="DLG05_LBL_DIFF">
            {orderDiff}
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            data-ui-id="DLG05_BTN_CANCEL"
            onClick={onClose}
          >
            キャンセル
          </Button>
          <Button
            variant="outline"
            data-ui-id="DLG05_BTN_CONFIRM_ONLY"
            onClick={onConfirmOnly}
          >
            確定のみ
          </Button>
          <Button data-ui-id="DLG05_BTN_REPRINT" onClick={onReprint}>
            再出力
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
