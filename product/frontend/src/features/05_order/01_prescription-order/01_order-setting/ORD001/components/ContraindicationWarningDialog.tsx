import { AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/atoms/alert-dialog';
import { Badge } from '@/shared/components/atoms/badge';

interface ContraindicationConflict {
  withDrug: string;
  reason: string;
}

interface ContraindicationWarningDialogProps {
  show: boolean;
  drugName: string;
  conflicts: ContraindicationConflict[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function ContraindicationWarningDialog({
  show,
  drugName,
  conflicts,
  onConfirm,
  onCancel
}: ContraindicationWarningDialogProps) {
  return (
    <AlertDialog open={show} onOpenChange={(open) => {
      if (!open) {
        onCancel();
      }
    }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            併用禁忌警告
          </AlertDialogTitle>
          <AlertDialogDescription>
            この薬剤は現在服用中の薬剤と併用禁忌があります。それでもこのオーダーを追加しますか？
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-3">
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="font-medium text-red-900 mb-1">{drugName}</div>
            <div className="text-sm text-red-700">
              併用禁忌該当薬剤
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">該当する併用禁忌:</div>
            {conflicts.map((conflict) => (
              <div key={conflict.withDrug} className="p-2 bg-muted rounded text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{conflict.withDrug}</span>
                  <Badge 
                    variant="destructive"
                    className="text-xs"
                  >
                    併用禁忌
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  理由: {conflict.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            確認して追加
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
