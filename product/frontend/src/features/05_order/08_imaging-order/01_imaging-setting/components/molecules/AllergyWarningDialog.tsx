'use client';

/**
 * アレルギー警告ダイアログ
 * molecules: オーダー確定時のアレルギーチェック警告
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/AllergyWarningDialog.tsx
 */

import { AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/atoms/alert-dialog';
import type { OrderDetail } from '../../types/order-shared.types';

export interface AllergyWarningDialogProps {
  open: boolean;
  warnings: Array<{ order: OrderDetail; matchedAllergy: string }>;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  onCancel: () => void;
}

export function AllergyWarningDialog({
  open,
  warnings,
  onOpenChange,
  onContinue,
  onCancel
}: AllergyWarningDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <AlertDialogTitle>アレルギー警告</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            以下のオーダーで患者のアレルギー情報と一致する項目が見つかりました
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-2 max-h-[300px] overflow-y-auto">
          {warnings.map((warning, index) => (
            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
              <div className="font-medium text-sm">{warning.order.name}</div>
              <div className="text-xs text-red-600 mt-1">
                アレルギー: {warning.matchedAllergy}
              </div>
            </div>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction onClick={onContinue} className="bg-red-500 hover:bg-red-600">
            警告を確認して続行
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
