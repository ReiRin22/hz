'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@shared/components/atoms/dialog';
import { Button } from '@shared/components/atoms/button';
import { Label } from '@shared/components/atoms/label';
import { Checkbox } from '@shared/components/atoms/checkbox';
import { Alert, AlertDescription } from '@shared/components/atoms/alert';
import { Printer, Info } from 'lucide-react';
import type { OrderType } from '../../types/deptInstruction.viewmodel';
import { i18n } from '@/shared/i18n';

const pd = i18n.deptInstruction.printDialog;

interface PrintDialogProps {
  open: boolean;
  onClose: () => void;
  onPrint: (selectedTypes: string[]) => void;
  selectedCount: number;
  type: 'label' | 'document';
  selectedOrderTypes: OrderType[];
}

export function PrintDialog({
  open,
  onClose,
  onPrint,
  selectedCount,
  type,
  selectedOrderTypes
}: PrintDialogProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  /* eslint-disable react-hooks/set-state-in-effect -- ダイアログ open 時の選択リセット */
  useEffect(() => {
    if (open) {
      setSelectedTypes([]);
    }
  }, [open, selectedOrderTypes]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const getDocumentTypesForOrderType = (orderType: OrderType) => {
    switch (orderType) {
      case 'PRESCRIPTION':
        return [
          { id: 'prescription-external', label: '処方箋（院外）', description: '院外処方箋' },
          { id: 'medication-info', label: '薬剤情報提供文書', description: '薬の詳細情報' },
          { id: 'medicine-bag', label: '薬袋', description: '薬袋ラベル' },
          { id: 'medicine-notebook-label', label: 'おくすり手帳に貼るラベル', description: 'お薬手帳用シール' },
          { id: 'prescription-copy', label: '処方内容（控え）', description: '処方内容の控え' },
          { id: 'internal-prescription-voucher', label: '院内処方引換券', description: '院内処方の引換券' },
        ];
      case 'INJECTION':
        return [
          { id: 'injection-sheet', label: '注射箋', description: '注射指示書' },
        ];
      case 'ENDOSCOPY':
        return [
          { id: 'exam-instruction', label: '検査説明書', description: '内視鏡検査の説明書' },
        ];
      case 'IMAGING':
        return [
          { id: 'exam-instruction', label: '検査説明書', description: '画像検査の説明書' },
        ];
      case 'MEDICATION_GUIDANCE':
        return [
          { id: 'guidance-request', label: '指導依頼書', description: '服薬指導依頼書' },
        ];
      case 'NUTRITION':
        return [
          { id: 'guidance-request', label: '指導依頼書', description: '栄養指導依頼書' },
        ];
      case 'REHABILITATION':
        return [
          { id: 'rehab-request', label: 'リハビリ依頼箋', description: 'リハビリテーション依頼書' },
        ];
      default:
        return [];
    }
  };

  const getAvailableDocumentTypes = () => {
    const documentMap = new Map<string, { id: string; label: string; description: string }>();
    selectedOrderTypes.forEach(orderType => {
      const docs = getDocumentTypesForOrderType(orderType);
      docs.forEach(doc => {
        if (!documentMap.has(doc.id)) {
          documentMap.set(doc.id, doc);
        }
      });
    });
    return Array.from(documentMap.values());
  };

  const documentTypes = getAvailableDocumentTypes();
  const items = type === 'label' ? pd.labelTypes : documentTypes;

  const handleToggle = (id: string) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    if (selectedTypes.length === 0) return;
    onPrint(selectedTypes);
    setSelectedTypes([]);
  };

  const handleCancel = () => {
    setSelectedTypes([]);
    onClose();
  };

  const title = type === 'label' ? pd.titleLabel : pd.titleDocument;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {pd.selectedCount(selectedCount)}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Label>
              {type === 'label' ? pd.selectLabel : pd.selectDocument}
            </Label>
            {items.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border">
                {pd.noDocuments}
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <Checkbox
                    id={item.id}
                    checked={selectedTypes.includes(item.id)}
                    onCheckedChange={() => handleToggle(item.id)}
                  />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={item.id} className="cursor-pointer">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {pd.cancel}
          </Button>
          <Button onClick={handlePrint} disabled={selectedTypes.length === 0}>
            <Printer className="mr-2 h-4 w-4" />
            {title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
