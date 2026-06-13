import { Card } from "@shared/components/atoms/card";
import { Button } from "@shared/components/atoms/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@shared/components/atoms/alert-dialog";
import { Save, CheckCircle } from "lucide-react";
import { isNewPatient, formatDateToJapanese } from "@/shared/utils/user-header/patient-utils";

interface BulkSaveSectionProps {
  currentPatient: any;
  currentRecord: any;
  orders: any[];
  isSaving: boolean;
  onBulkSave: () => void;
}

export function BulkSaveSection({
  currentPatient,
  currentRecord,
  orders,
  isSaving,
  onBulkSave
}: BulkSaveSectionProps) {
  return (
    <Card className="p-3 medical-bg-primary medical-border-primary border dark:bg-blue-950 dark:border-blue-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 medical-text-primary" />
          <div>
            <div className="text-sm medical-text-primary dark:text-blue-100">
              保存待ちの項目があります
            </div>
            <div className="text-xs medical-text-primary dark:text-blue-300">
              {isNewPatient(currentPatient.patientId) ? "初診記録" : "診療記録"}とオーダー（{orders.length}件）を一括で確定・保存できます
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="default" 
                className="medical-primary hover:bg-blue-700"
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "保存中..." : "一括保存・確定"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>一括保存の確認</AlertDialogTitle>
                <AlertDialogDescription>
                  以下の内容を確定・保存します。確定後は変更できません。
                  <br /><br />
                  • {isNewPatient(currentPatient.patientId) ? "初診記録" : "診療記録"}（{formatDateToJapanese(currentRecord.recordDate)}）
                  <br />
                  • オーダー：{orders.length}件
                  <br /><br />
                  続行しますか？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onBulkSave}
                  className="medical-primary hover:bg-blue-700"
                >
                  確定・保存
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}