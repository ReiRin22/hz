import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@shared/components/atoms/dialog';
import { Button } from '@shared/components/atoms/button';
import { Label } from '@shared/components/atoms/label';
import { Checkbox } from '@shared/components/atoms/checkbox';
import { Alert, AlertDescription } from '@shared/components/atoms/alert';
import { Printer, Info } from 'lucide-react';
import type { OrderType } from '../../types';

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

  // 選択されたオーダ種が変更された場合、選択をリセット
  useEffect(() => {
    if (open) {
      setSelectedTypes([]);
    }
  }, [open, selectedOrderTypes]);

  const labelTypes = [
    { id: 'specimen-label', label: '検体ラベル', description: '検体容器に貼付するラベル' },
    { id: 'tube-label', label: 'スピッツラベル', description: '採血管に貼付するラベル' },
  ];

  // オーダ種別に発行可能な帳票を定義
  const getDocumentTypesForOrderType = (orderType: OrderType) => {
    switch (orderType) {
      case '処方':
        return [
          { id: 'prescription-external', label: '処方箋（院外）', description: '院外処方箋' },
          { id: 'medication-info', label: '薬剤情報提供文書', description: '薬の詳細情報' },
          { id: 'medicine-bag', label: '薬袋', description: '薬袋ラベル' },
          { id: 'medicine-notebook-label', label: 'おくすり手帳に貼るラベル', description: 'お薬手帳用シール' },
          { id: 'prescription-copy', label: '処方内容（控え）', description: '処方内容の控え' },
          { id: 'internal-prescription-voucher', label: '院内処方引換券', description: '院内処方の引換券' },
        ];
      case '注射オーダ':
        return [
          { id: 'injection-sheet', label: '注射箋', description: '注射指示書' },
        ];
      case '内視鏡検査':
        return [
          { id: 'exam-instruction', label: '検査説明書', description: '内視鏡検査の説明書' },
        ];
      case '画像検査':
        return [
          { id: 'exam-instruction', label: '検査説明書', description: '画像検査の説明書' },
        ];
      case '服薬指導':
        return [
          { id: 'guidance-request', label: '指導依頼書', description: '服薬指導依頼書' },
        ];
      case '栄養':
        return [
          { id: 'guidance-request', label: '指導依頼書', description: '栄養指導依頼書' },
        ];
      case 'リハビリ':
        return [
          { id: 'rehab-request', label: 'リハビリ依頼箋', description: 'リハビリテーション依頼書' },
        ];
      default:
        return [];
    }
  };

  // 選択されたオーダ種から利用可能な帳票を取得
  const getAvailableDocumentTypes = () => {
    const allDocuments: { id: string; label: string; description: string }[] = [];
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

  const items = type === 'label' ? labelTypes : documentTypes;

  const handleToggle = (id: string) => {
    setSelectedTypes(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handlePrint = () => {
    if (selectedTypes.length === 0) {
      return;
    }
    onPrint(selectedTypes);
    setSelectedTypes([]);
  };

  const handleCancel = () => {
    setSelectedTypes([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            {type === 'label' ? 'ラベル印刷' : '帳票発行'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label>
              {type === 'label' ? '印刷するラベルを選択してください' : '発行する帳票を選択してください'}
            </Label>
            {items.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border">
                選択されたオーダ種では発行可能な帳票がありません
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
                    <Label
                      htmlFor={item.id}
                      className="cursor-pointer"
                    >
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
            キャンセル
          </Button>
          <Button
            onClick={handlePrint}
            disabled={selectedTypes.length === 0}
          >
            <Printer className="mr-2 h-4 w-4" />
            {type === 'label' ? 'ラベル印刷' : '帳票発行'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}