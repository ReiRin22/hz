import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@shared/components/atoms/dialog';
import { Button } from '@shared/components/atoms/button';
import { Label } from '@shared/components/atoms/label';
import { RadioGroup, RadioGroupItem } from '@shared/components/atoms/radio-group';
import { Textarea } from '@shared/components/atoms/textarea';
import { Alert, AlertDescription } from '@shared/components/atoms/alert';
import { Info, FileText, X } from 'lucide-react';
import type { Order } from '../../types';

interface MedicationInfoDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: MedicationInfoData) => void;
  order: Order | null;
}

export interface MedicationInfoData {
  shouldIssue: boolean;
  skipReason?: string;
  jobId?: string;
}

export function MedicationInfoDialog({
  open,
  onClose,
  onComplete,
  order
}: MedicationInfoDialogProps) {
  const [shouldIssue, setShouldIssue] = useState<boolean>(true);
  const [skipReason, setSkipReason] = useState<string>('');

  const handleComplete = () => {
    const jobId = shouldIssue ? `MED-${Date.now()}` : undefined;

    onComplete({
      shouldIssue,
      skipReason: shouldIssue ? undefined : skipReason,
      jobId
    });

    // フォームをリセット
    setShouldIssue(true);
    setSkipReason('');
  };

  const handleCancel = () => {
    setShouldIssue(true);
    setSkipReason('');
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            薬剤情報提供文書発行
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 患者情報 */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>患者ID: {order.patientId}</div>
                <div>患者名: {order.patientName}</div>
                <div>オーダ内容: {order.content}</div>
              </div>
            </AlertDescription>
          </Alert>

          {/* 発行判断 */}
          <div className="space-y-3">
            <Label>薬剤情報提供文書を発行しますか？</Label>
            <RadioGroup
              value={shouldIssue ? 'yes' : 'no'}
              onValueChange={(value) => setShouldIssue(value === 'yes')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="issue-yes" />
                <Label htmlFor="issue-yes" className="cursor-pointer">
                  発行する
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="issue-no" />
                <Label htmlFor="issue-no" className="cursor-pointer">
                  発行しない
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 発行する場合の説明 */}
          {shouldIssue && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <div className="space-y-2">
                  <p>薬剤情報提供文書には以下の情報が記載されます：</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>薬剤名、用法・用量</li>
                    <li>効能・効果</li>
                    <li>主な副作用</li>
                    <li>服用時の注意事項</li>
                    <li>保管方法</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* 発行しない場合の理由入力 */}
          {!shouldIssue && (
            <div className="space-y-2">
              <Label htmlFor="skipReason">発行しない理由</Label>
              <Textarea
                id="skipReason"
                placeholder="薬剤情報提供文書を発行しない理由を記載してください"
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                rows={4}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            キャンセル
          </Button>
          <Button onClick={handleComplete}>
            <FileText className="mr-2 h-4 w-4" />
            確定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
