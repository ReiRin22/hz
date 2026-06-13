import { Button } from '@/shared/components/atoms/button';
import { FileText, Save, Check } from 'lucide-react';

type RecordInputHeaderMoleculeProps = {
  isEditable: boolean;
  confirmButtonDisabled: boolean;
  /** E001/E002 バリデーションエラー（フィールド → メッセージ） */
  validationErrors?: Partial<Record<'recordDate' | 'soapContent', string>>;
  onSaveDraft: () => void;
  onConfirm: () => void;
};

export function RecordInputHeaderMolecule({
  isEditable,
  confirmButtonDisabled,
  validationErrors,
  onSaveDraft,
  onConfirm,
}: RecordInputHeaderMoleculeProps) {
  const errorMessages = validationErrors
    ? Object.values(validationErrors).filter(Boolean)
    : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-base">記録入力</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!isEditable}
            onClick={onSaveDraft}
          >
            <Save className="w-4 h-4 mr-1" />
            一時保存
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={!isEditable || confirmButtonDisabled}
            onClick={onConfirm}
            className="medical-primary"
          >
            <Check className="w-4 h-4 mr-1" />
            確定
          </Button>
        </div>
      </div>
      {errorMessages.length > 0 && (
        <ul className="mt-1 space-y-0.5" role="alert">
          {errorMessages.map((msg) => (
            <li key={msg} className="text-sm text-red-600">{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
