import { AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/atoms/alert-dialog';
import { Badge } from '@/shared/components/atoms/badge';

interface CurrentPatient {
  age: number;
  gender: 'male' | 'female';
  isPregnant?: boolean;
  isLactating?: boolean;
  renalFunction?: 'normal' | 'mild' | 'moderate' | 'severe';
  hepaticFunction?: 'normal' | 'mild' | 'moderate' | 'severe';
  diagnoses?: string[];
}

interface PatientAttributeWarningDialogProps {
  show: boolean;
  drugName: string;
  warnings: Array<{ category: string; message: string; severity: 'prohibited' | 'caution' }>;
  currentPatient: CurrentPatient;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PatientAttributeWarningDialog({
  show,
  drugName,
  warnings,
  currentPatient,
  onConfirm,
  onCancel
}: PatientAttributeWarningDialogProps) {
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
            患者属性適合性警告
          </AlertDialogTitle>
          <AlertDialogDescription>
            この薬剤は患者の属性に適合していません。それでもこのオーダーを追加しますか？
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-3">
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="font-medium text-red-900 mb-1">{drugName}</div>
            <div className="text-sm text-red-700">
              患者属性適合性該当薬剤
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">該当する禁忌事項・注意事項:</div>
            {warnings.map((warning, index) => (
              <div key={`${warning.category}-${index}`} className="p-2 bg-muted rounded text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{warning.category}</span>
                  <Badge 
                    variant={warning.severity === 'prohibited' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {warning.severity}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {warning.message}
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

export default PatientAttributeWarningDialog;