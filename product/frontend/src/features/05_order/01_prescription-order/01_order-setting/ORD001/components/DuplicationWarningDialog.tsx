import { AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/atoms/alert-dialog';
import { Badge } from '@/shared/components/atoms/badge';

interface DuplicationConflict {
  withDrug: string;
  source: 'current' | 'order';
  startDate?: string;
  endDate?: string;
}

interface DuplicationWarningDialogProps {
  show: boolean;
  drugName: string;
  duplicates: DuplicationConflict[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function DuplicationWarningDialog({
  show,
  drugName,
  duplicates,
  onConfirm,
  onCancel
}: DuplicationWarningDialogProps) {
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
            重複投薬警告
          </AlertDialogTitle>
          <AlertDialogDescription>
            この薬剤は重複投薬に該当します。それでもこのオーダーを追加しますか？
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-3">
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="font-medium text-red-900 mb-1">{drugName}</div>
            <div className="text-sm text-red-700">
              重複投薬該当薬剤
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">該当する重複投薬:</div>
            {duplicates.map((duplicate, index) => (
              <div key={`${duplicate.withDrug}-${duplicate.source}-${index}`} className="p-2 bg-muted rounded text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{duplicate.withDrug}</span>
                  <Badge 
                    variant="destructive"
                    className="text-xs"
                  >
                    {duplicate.source === 'current' ? '処方中' : 'オーダー中'}
                  </Badge>
                </div>
                {duplicate.startDate && (
                  <div className="text-xs text-muted-foreground">
                    処方期間: {duplicate.startDate.replace(/-/g, '/')} ～ {duplicate.endDate ? duplicate.endDate.replace(/-/g, '/') : '継続中'}
                  </div>
                )}
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