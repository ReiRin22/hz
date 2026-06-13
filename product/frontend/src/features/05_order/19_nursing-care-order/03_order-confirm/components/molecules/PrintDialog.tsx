'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import type { FormViewModel } from '../../types/order-confirm.types';

interface PrintDialogProps {
  open: boolean;
  patientName: string;
  patientId: string;
  allForms: FormViewModel[];
  selectedForms: FormViewModel[];
  onSelectAll: () => void;
  onToggleForm: (formId: string) => void;
  onOutput: (formIds: string[]) => void;
  onClose: () => void;
}

export function PrintDialog({
  open,
  patientName,
  patientId,
  allForms,
  selectedForms,
  onSelectAll,
  onToggleForm,
  onOutput,
  onClose,
}: PrintDialogProps) {
  const selectedCount = selectedForms.length;
  const totalCount = allForms.length;
  const selectedIds = selectedForms.map((f) => f.id);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle data-ui-id="DLG01_LBL_TITLE">帳票出力</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground" data-ui-id="DLG01_LBL_DESC">
            患者{patientName}（{patientId}）- 出力する帳票を選択してください
          </p>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              data-ui-id="DLG01_BTN_ALL"
              onClick={onSelectAll}
            >
              すべて選択
            </Button>
            <span className="text-sm text-muted-foreground" data-ui-id="DLG01_LBL_COUNT">
              {selectedCount}/{totalCount}
            </span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allForms.map((form) => (
              <div key={form.id} className="flex items-center gap-2">
                <Checkbox
                  id={`form-${form.id}`}
                  checked={selectedIds.includes(form.id)}
                  onCheckedChange={() => onToggleForm(form.id)}
                  data-ui-id="DLG01_CHK_FORM"
                />
                <label htmlFor={`form-${form.id}`} className="text-sm cursor-pointer">
                  {form.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" data-ui-id="DLG01_BTN_CANCEL" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            data-ui-id="DLG01_BTN_OUTPUT"
            disabled={selectedCount === 0}
            onClick={() => onOutput(selectedIds)}
          >
            出力（{selectedCount}）
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
