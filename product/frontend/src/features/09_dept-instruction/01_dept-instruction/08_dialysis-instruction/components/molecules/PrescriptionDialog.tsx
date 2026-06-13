import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/atoms/dialog';
import { Label } from '@shared/components/atoms/label';
import { Textarea } from '@shared/components/atoms/textarea';
import { Button } from '@shared/components/atoms/button';
import { RadioGroup, RadioGroupItem } from '@shared/components/atoms/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/atoms/select';
import { Card, CardContent } from '@shared/components/atoms/card';
import type { Order, PrescriptionData } from '../../types';

interface PrescriptionDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: PrescriptionData) => void;
  order: Order | null;
}

export function PrescriptionDialog({ open, onClose, onComplete, order }: PrescriptionDialogProps) {
  const [shouldIssue, setShouldIssue] = useState<string>('yes');
  const [prescriptionType, setPrescriptionType] = useState<'院外' | '院内' | '麻薬'>('院外');
  const [skipReason, setSkipReason] = useState<string>('');

  useEffect(() => {
    if (open) {
      setShouldIssue('yes');
      setPrescriptionType('院外');
      setSkipReason('');
    }
  }, [open]);

  const handleComplete = () => {
    if (shouldIssue === 'no' && !skipReason.trim()) {
      alert('処方箋を発行しない場合は理由を入力してください');
      return;
    }

    const data: PrescriptionData = {
      shouldIssue: shouldIssue === 'yes',
      prescriptionType: shouldIssue === 'yes' ? prescriptionType : undefined,
      skipReason: shouldIssue === 'no' ? skipReason : undefined,
      jobId: shouldIssue === 'yes' ? `JOB-${Date.now()}` : undefined
    };

    onComplete(data);
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>処方箋発行（W4・薬剤科専用）</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 患者情報・オーダ概要 */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">患者ID</div>
                  <div>{order.patientId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">氏名</div>
                  <div>{order.patientName}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-600">オーダ内容</div>
                  <div className="p-3 bg-gray-50 rounded mt-1 whitespace-pre-line">{order.content}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 処方箋発行確認 */}
          <div className="space-y-4">
            <Label>処方箋を発行しますか？</Label>
            <RadioGroup value={shouldIssue} onValueChange={setShouldIssue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="issue-yes" />
                <Label htmlFor="issue-yes" className="cursor-pointer">はい（発行する）</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="issue-no" />
                <Label htmlFor="issue-no" className="cursor-pointer">いいえ（発行しない）</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 処方箋区分（発行する場合） */}
          {shouldIssue === 'yes' && (
            <div className="space-y-2">
              <Label htmlFor="prescription-type">
                処方箋区分 <span className="text-red-500">*</span>
              </Label>
              <Select value={prescriptionType} onValueChange={(value: '院外' | '院内' | '麻薬') => setPrescriptionType(value)}>
                <SelectTrigger id="prescription-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="院外">院外処方箋</SelectItem>
                  <SelectItem value="院内">院内処方箋</SelectItem>
                  <SelectItem value="麻薬">麻薬処方箋</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 不発行理由（発行しない場合） */}
          {shouldIssue === 'no' && (
            <div className="space-y-2">
              <Label htmlFor="skip-reason">
                不発行理由 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="skip-reason"
                placeholder="処方箋を発行しない理由を入力してください"
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button variant="ghost" onClick={() => onComplete({ shouldIssue: false })}>
              スキップ
            </Button>
            <Button onClick={handleComplete}>
              {shouldIssue === 'yes' ? '発行' : '確定'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}