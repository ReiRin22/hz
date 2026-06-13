import { useState } from "react";
import { Shield, ShieldCheck, ShieldX, Check, Info, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/components/atoms/dialog";
import { Button } from "@shared/components/atoms/button";
import { Badge } from "@shared/components/atoms/badge";
import { RadioGroup, RadioGroupItem } from "@shared/components/atoms/radio-group";
import { Label } from "@shared/components/atoms/label";
import { Checkbox } from "@shared/components/atoms/checkbox";
import { Alert, AlertDescription } from "@shared/components/atoms/alert";
import { Separator } from "@shared/components/atoms/separator";
import { toast } from "sonner";
import type { MedicalInfoSharingStatus } from "./MedicalInfoSharingBadge";

interface MedicalInfoSharingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  currentData: {
    status: MedicalInfoSharingStatus;
    consentDate?: string;
    expiryDate?: string;
    lastUpdated?: string;
    details?: {
      emergencyMedicalInfo?: boolean;
      prescriptionHistory?: boolean;
      diagnosticImages?: boolean;
      labResults?: boolean;
      referralLetters?: boolean;
    };
  };
  onDataChange?: (newData: any) => void;
}

export function MedicalInfoSharingDialog({
  isOpen,
  onClose,
  patientId,
  patientName,
  currentData,
  onDataChange
}: MedicalInfoSharingDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<MedicalInfoSharingStatus>(currentData.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentDetails, setConsentDetails] = useState({
    emergencyMedicalInfo: currentData.details?.emergencyMedicalInfo || false,
    prescriptionHistory: currentData.details?.prescriptionHistory || false,
    diagnosticImages: currentData.details?.diagnosticImages || false,
    labResults: currentData.details?.labResults || false,
    referralLetters: currentData.details?.referralLetters || false
  });

  // ステータス設定情報
  const statusOptions = [
    {
      value: "full-consent" as MedicalInfoSharingStatus,
      icon: ShieldCheck,
      title: "すべて同意",
      description: "医療情報共有サービスのすべての項目に同意",
      color: "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      isRecommended: true
    },
    {
      value: "partial-consent" as MedicalInfoSharingStatus,
      icon: Shield,
      title: "一部同意",
      description: "選択した項目のみ医療情報を共有",
      color: "border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-800/50",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      isRecommended: false
    },
    {
      value: "no-consent" as MedicalInfoSharingStatus,
      icon: ShieldX,
      title: "同意しない",
      description: "医療情報を共有しない（緊急時を除く）",
      color: "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-800/50",
      iconColor: "text-red-600 dark:text-red-400",
      isRecommended: false
    }
  ];

  const consentItems = [
    { key: 'emergencyMedicalInfo', label: '救急医療情報', description: '緊急時の既往歴・アレルギー情報' },
    { key: 'prescriptionHistory', label: '処方歴', description: '過去の処方薬・服薬情報' },
    { key: 'diagnosticImages', label: '診断画像', description: 'X線・CT・MRI等の画像' },
    { key: 'labResults', label: '検査結果', description: '血液検査・尿検査等の結果' },
    { key: 'referralLetters', label: '紹介状', description: '他院への紹介状・返書' }
  ];

  const handleDetailChange = (key: string, checked: boolean) => {
    setConsentDetails(prev => ({ ...prev, [key]: checked }));
  };

  const handleSubmit = async () => {
    if (selectedStatus === currentData.status && JSON.stringify(consentDetails) === JSON.stringify(currentData.details)) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 実際のアプリケーションでは、ここでサーバーAPIを呼び出します
      await new Promise(resolve => setTimeout(resolve, 500)); // シミュレート
      
      const newData = {
        status: selectedStatus,
        consentDate: selectedStatus !== "no-consent" ? "2024年10月7日" : undefined,
        expiryDate: selectedStatus !== "no-consent" ? "2026年10月6日" : undefined,
        lastUpdated: "2024年10月7日",
        details: selectedStatus === "partial-consent" ? consentDetails : 
                selectedStatus === "full-consent" ? {
                  emergencyMedicalInfo: true,
                  prescriptionHistory: true,
                  diagnosticImages: true,
                  labResults: true,
                  referralLetters: true
                } : undefined
      };

      if (onDataChange) {
        onDataChange(newData);
      }

      const selectedOption = statusOptions.find(option => option.value === selectedStatus);
      toast.success(`医療情報共有設定を「${selectedOption?.title}」に変更しました`, {
        description: `患者: ${patientName} (ID: ${patientId})`
      });

      onClose();
    } catch (error) {
      toast.error("設定の変更に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedStatus(currentData.status);
    setConsentDetails({
      emergencyMedicalInfo: currentData.details?.emergencyMedicalInfo || false,
      prescriptionHistory: currentData.details?.prescriptionHistory || false,
      diagnosticImages: currentData.details?.diagnosticImages || false,
      labResults: currentData.details?.labResults || false,
      referralLetters: currentData.details?.referralLetters || false
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>医療情報共有設定</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 患者情報 */}
          <div className="text-sm text-muted-foreground">
            患者: {patientName} (ID: {patientId})
          </div>

          {/* 設定選択 */}
          <RadioGroup 
            value={selectedStatus} 
            onValueChange={(value) => setSelectedStatus(value as MedicalInfoSharingStatus)}
            className="space-y-3"
          >
            {statusOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                  selectedStatus === option.value 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
                    : option.color
                }`}
              >
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value}
                />
                <div className="flex items-center space-x-2 flex-1">
                  <option.icon className={`w-4 h-4 ${option.iconColor}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{option.title}</span>
                      {option.isRecommended && (
                        <Badge className="bg-green-100 text-green-700 text-xs">推奨</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                  {selectedStatus === option.value && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </Label>
            ))}
          </RadioGroup>

          {/* 詳細設定（一部同意の場合） */}
          {selectedStatus === "partial-consent" && (
            <div className="space-y-3">
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center space-x-2">
                  <Info className="w-4 h-4" />
                  <span>共有する情報を選択</span>
                </h3>
                <div className="space-y-3">
                  {consentItems.map((item) => (
                    <div key={item.key} className="flex items-start space-x-3 p-2 rounded border border-gray-200 dark:border-gray-700">
                      <Checkbox
                        id={item.key}
                        checked={consentDetails[item.key as keyof typeof consentDetails]}
                        onCheckedChange={(checked) => handleDetailChange(item.key, checked as boolean)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label htmlFor={item.key} className="font-medium text-sm cursor-pointer">
                          {item.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 重要事項 */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>重要:</strong> 医療情報共有サービスは、医療の質と安全性向上を目的としています。
              緊急時には同意に関わらず必要な情報が共有される場合があります。
            </AlertDescription>
          </Alert>

          {/* アクションボタン */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="medical-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  変更中...
                </>
              ) : (
                "設定を変更"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}