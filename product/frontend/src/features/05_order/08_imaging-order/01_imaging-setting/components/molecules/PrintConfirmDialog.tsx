'use client';

/**
 * 帳票印刷確認ダイアログ
 * molecules: 画像オーダー確定時の帳票印刷確認
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/PrintConfirmDialog.tsx
 */

import { Printer } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Label } from '@/shared/components/atoms/label';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/atoms/alert-dialog';

export interface PrintConfirmDialogProps {
  open: boolean;
  selectedReports: {
    imaging: boolean;
    imagingConsent: boolean;
    imagingExplanation: boolean;
  };
  onOpenChange: (open: boolean) => void;
  onSelectedReportsChange: (reports: {
    imaging: boolean;
    imagingConsent: boolean;
    imagingExplanation: boolean;
  }) => void;
  onConfirmWithPrint: () => void;
  onConfirmWithoutPrint: () => void;
}

export function PrintConfirmDialog({
  open,
  selectedReports,
  onOpenChange,
  onSelectedReportsChange,
  onConfirmWithPrint,
  onConfirmWithoutPrint
}: PrintConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-500" />
            <AlertDialogTitle>帳票印刷確認</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            画像検査オーダーに関連する帳票を印刷しますか？
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="imaging-order"
              checked={selectedReports.imaging}
              onCheckedChange={(checked) =>
                onSelectedReportsChange({
                  ...selectedReports,
                  imaging: checked as boolean
                })
              }
            />
            <Label htmlFor="imaging-order" className="text-sm font-normal cursor-pointer">
              画像検査オーダー票
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="imaging-consent"
              checked={selectedReports.imagingConsent}
              onCheckedChange={(checked) =>
                onSelectedReportsChange({
                  ...selectedReports,
                  imagingConsent: checked as boolean
                })
              }
            />
            <Label htmlFor="imaging-consent" className="text-sm font-normal cursor-pointer">
              画像検査同意書
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="imaging-explanation"
              checked={selectedReports.imagingExplanation}
              onCheckedChange={(checked) =>
                onSelectedReportsChange({
                  ...selectedReports,
                  imagingExplanation: checked as boolean
                })
              }
            />
            <Label htmlFor="imaging-explanation" className="text-sm font-normal cursor-pointer">
              画像検査説明書
            </Label>
          </div>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onConfirmWithoutPrint}>
            印刷せずに確定
          </Button>
          <Button onClick={onConfirmWithPrint}>
            <Printer className="w-4 h-4 mr-2" />
            印刷して確定
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
