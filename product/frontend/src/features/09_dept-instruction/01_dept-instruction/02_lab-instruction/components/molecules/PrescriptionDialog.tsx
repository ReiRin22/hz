'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/atoms/dialog';
import { Label } from '@shared/components/atoms/label';
import { Textarea } from '@shared/components/atoms/textarea';
import { Button } from '@shared/components/atoms/button';
import { RadioGroup, RadioGroupItem } from '@shared/components/atoms/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/atoms/select';
import { Card, CardContent } from '@shared/components/atoms/card';
import type { Order, PrescriptionData } from '../../types/deptInstruction.viewmodel';
import { i18n } from '@/shared/i18n';

const pd = i18n.deptInstruction.prescriptionDialog;

interface PrescriptionDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: PrescriptionData) => void;
  order: Order | null;
}

export function PrescriptionDialog({ open, onClose, onComplete, order }: PrescriptionDialogProps) {
  const [shouldIssue, setShouldIssue] = useState<string>('yes');
  const [prescriptionType, setPrescriptionType] = useState<'OUTPATIENT' | 'INPATIENT' | 'NARCOTIC'>('OUTPATIENT');
  const [skipReason, setSkipReason] = useState<string>('');

  /* eslint-disable react-hooks/set-state-in-effect -- ダイアログ open 時のフォームリセット */
  useEffect(() => {
    if (open) {
      setShouldIssue('yes');
      setPrescriptionType('OUTPATIENT');
      setSkipReason('');
    }
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleComplete = () => {
    if (shouldIssue === 'no' && !skipReason.trim()) {
      alert(pd.skipAlert);
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
          <DialogTitle>{pd.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">{pd.patientIdLabel}</div>
                  <div>{order.patientId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{pd.patientNameLabel}</div>
                  <div>{order.patientName}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-600">{pd.orderContentLabel}</div>
                  <div className="p-3 bg-gray-50 rounded mt-1">{order.content}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Label>{pd.question}</Label>
            <RadioGroup value={shouldIssue} onValueChange={setShouldIssue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="issue-yes" />
                <Label htmlFor="issue-yes" className="cursor-pointer">{pd.issueYes}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="issue-no" />
                <Label htmlFor="issue-no" className="cursor-pointer">{pd.issueNo}</Label>
              </div>
            </RadioGroup>
          </div>

          {shouldIssue === 'yes' && (
            <div className="space-y-2">
              <Label htmlFor="prescription-type">
                {pd.prescriptionTypeLabel} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={prescriptionType}
                onValueChange={(value: 'OUTPATIENT' | 'INPATIENT' | 'NARCOTIC') => setPrescriptionType(value)}
              >
                <SelectTrigger id="prescription-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pd.prescriptionTypes.map((pt) => (
                    <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {shouldIssue === 'no' && (
            <div className="space-y-2">
              <Label htmlFor="skip-reason">
                {pd.skipReasonLabel} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="skip-reason"
                placeholder={pd.skipReasonPlaceholder}
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>{pd.cancel}</Button>
            <Button variant="ghost" onClick={() => onComplete({ shouldIssue: false })}>{pd.skip}</Button>
            <Button onClick={handleComplete}>
              {shouldIssue === 'yes' ? pd.issue : pd.confirm}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
