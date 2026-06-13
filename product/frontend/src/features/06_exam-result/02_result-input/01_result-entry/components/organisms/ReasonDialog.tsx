import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Label } from '@/shared/components/atoms/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/atoms/radio-group';
import type { ModificationReasonOption } from '@/front_bff_shared/execution/test-results/types/test-results.api.response';

interface ReasonDialogProps {
  open: boolean;
  reasons: ModificationReasonOption[];
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string, otherText?: string) => void;
}

const OTHER_CODE = 'OTHER';

export function ReasonDialog({ open, reasons, onOpenChange, onConfirm }: ReasonDialogProps) {
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [freeText, setFreeText] = useState<string>('');

  const handleConfirm = () => {
    if (!canConfirm) return;
    const otherText = selectedCode === OTHER_CODE ? freeText : undefined;
    onConfirm(selectedCode, otherText);
    reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const reset = () => {
    setSelectedCode('');
    setFreeText('');
  };

  const isOtherSelected = selectedCode === OTHER_CODE;
  const canConfirm = selectedCode && (selectedCode !== OTHER_CODE || freeText.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>検査結果修正理由</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>修正理由を選択してください</Label>
            <RadioGroup
              data-ui-id="RDO_EDIT_REASON"
              value={selectedCode}
              onValueChange={setSelectedCode}
            >
              {reasons.map((reason) => (
                <div key={reason.code} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.code} id={reason.code} />
                  <Label htmlFor={reason.code} className="font-normal cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {isOtherSelected && (
            <div className="space-y-2">
              <Label htmlFor="freeText">詳細を入力してください</Label>
              <Textarea
                data-ui-id="TXT_EDIT_REASON"
                id="freeText"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="理由を入力してください"
                rows={4}
                className="resize-none"
                maxLength={300}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            data-ui-id="BTN_CANCEL"
            data-action-id="ACT_CANCEL"
            data-event-id="EVT_CANCEL_DIALOG"
            variant="outline"
            onClick={handleCancel}
          >
            キャンセル
          </Button>
          <Button
            data-ui-id="BTN_EDIT_REASON_CONFIRM"
            data-action-id="ACT_EDIT_REASON_CONFIRM"
            data-event-id="EVT_EDIT_REASON_CONFIRM"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="bg-blue-600 hover:bg-blue-700"
          >
            確定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
