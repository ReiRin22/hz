'use client';

/**
 * 造影剤アレルギー確認ダイアログコンポーネント
 * UIガイドライン準拠: molecules層
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/ContrastAllergyConfirmDialog.tsx
 */

import { AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/atoms/alert-dialog';
import { Button } from '@/shared/components/atoms/button';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Label } from '@/shared/components/atoms/label';

export interface ContrastAllergyConfirmDialogProps {
  /** ダイアログの表示状態 */
  open: boolean;
  /** ダイアログを閉じる処理 */
  onOpenChange: (open: boolean) => void;
  /** 特別指示の入力値 */
  specialInstructions: string;
  /** 特別指示の変更ハンドラ */
  onSpecialInstructionsChange: (value: string) => void;
  /** 「確認して追加」ボタンのクリックハンドラ */
  onConfirm: () => void;
  /** 「キャンセル」ボタンのクリックハンドラ */
  onCancel: () => void;
}

export function ContrastAllergyConfirmDialog({
  open,
  onOpenChange,
  specialInstructions,
  onSpecialInstructionsChange,
  onConfirm,
  onCancel,
}: ContrastAllergyConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <AlertDialogTitle>造影剤アレルギー確認</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            造影剤使用にチェックがついており、かつ造影剤アレルギーありにチェックがついています。特別指示を入力してください。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="grid gap-2">
            <Label htmlFor="special-instructions" className="text-sm font-medium">
              特別指示
            </Label>
            <Textarea
              id="special-instructions"
              value={specialInstructions}
              onChange={(e) => onSpecialInstructionsChange(e.target.value)}
              placeholder="アレルギーに関する特別指示を入力してください"
              className="min-h-[100px] bg-orange-50"
              autoFocus
            />
          </div>
        </div>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            キャンセル
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!specialInstructions.trim()}
            className="bg-orange-500 hover:bg-orange-600"
          >
            確認して追加
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
