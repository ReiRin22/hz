import { AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/atoms/alert-dialog';
import { Badge } from '@/shared/components/atoms/badge';

interface AllergyInfo {
  id: string;
  substance: string;
  severity: '軽度' | '中等度' | '重度';
  reaction: string;
  date: string;
}

interface AllergyWarningDialogProps {
  show: boolean;
  drugName: string;
  allergies: AllergyInfo[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function AllergyWarningDialog({
  show,
  drugName,
  allergies,
  onConfirm,
  onCancel
}: AllergyWarningDialogProps) {
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
            薬剤アレルギー警告
          </AlertDialogTitle>
          <AlertDialogDescription>
            この薬剤は患者のアレルギー情報に該当します。それでもこのオーダーを追加しますか？
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-3">
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="font-medium text-red-900 mb-1">{drugName}</div>
            <div className="text-sm text-red-700">
              アレルギー該当薬剤
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">該当するアレルギー:</div>
            {allergies.map((allergy) => (
              <div key={allergy.id} className="p-2 bg-muted rounded text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{allergy.substance}</span>
                  <Badge 
                    variant={allergy.severity === '重度' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {allergy.severity}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  反応: {allergy.reaction}
                </div>
                <div className="text-xs text-muted-foreground">
                  登録日: {allergy.date.replace(/-/g, '/')}
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
