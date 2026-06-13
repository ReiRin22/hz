import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@shared/components/atoms/alert-dialog';
import { Checkbox } from '@shared/components/atoms/checkbox';
import { useState } from 'react';

interface QuestionnaireDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (issueQuestionnaire: boolean, issueReceptionSheet: boolean) => void;
  patientName: string;
}

export function QuestionnaireDialog({ isOpen, onClose, onConfirm, patientName }: QuestionnaireDialogProps) {
  const [issueQuestionnaire, setIssueQuestionnaire] = useState(true);
  const [issueReceptionSheet, setIssueReceptionSheet] = useState(true);

  const handleConfirm = () => {
    onConfirm(issueQuestionnaire, issueReceptionSheet);
    onClose();
    // リセット
    setIssueQuestionnaire(true);
    setIssueReceptionSheet(true);
  };

  const handleCancel = () => {
    onClose();
    // リセット
    setIssueQuestionnaire(true);
    setIssueReceptionSheet(true);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>受付完了</AlertDialogTitle>
          <AlertDialogDescription>
            {patientName}さんの受付が完了しました。
            <br />
            発行する書類を選択してください。
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="questionnaire" 
              checked={issueQuestionnaire}
              onCheckedChange={(checked) => setIssueQuestionnaire(checked as boolean)}
            />
            <label
              htmlFor="questionnaire"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              問診票を発行する
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="receptionSheet" 
              checked={issueReceptionSheet}
              onCheckedChange={(checked) => setIssueReceptionSheet(checked as boolean)}
            />
            <label
              htmlFor="receptionSheet"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              受付表を発行する
            </label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            確定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}