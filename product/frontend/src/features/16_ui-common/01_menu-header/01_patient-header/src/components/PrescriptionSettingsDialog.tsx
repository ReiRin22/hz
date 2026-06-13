import { useState } from "react";
import { FileCheck, FileX, AlertTriangle, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";
import { Card } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { RadioGroup, RadioGroupItem } from "@/shared/components/atoms/radio-group";
import { Label } from "@/shared/components/atoms/label";
import { toast } from "sonner";
import type { PrescriptionStatus } from "./PrescriptionStatusBadge";

interface PrescriptionSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  currentStatus: PrescriptionStatus;
  onStatusChange?: (newStatus: PrescriptionStatus) => void;
}

export function PrescriptionSettingsDialog({
  isOpen,
  onClose,
  patientId,
  patientName,
  currentStatus,
  onStatusChange
}: PrescriptionSettingsDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<PrescriptionStatus>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ステータス設定情報
  const statusOptions = [
    {
      value: "electronic" as PrescriptionStatus,
      icon: FileCheck,
      title: "電子処方箋",
      description: "電子処方箋システムを使用（推奨）",
      color: "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      isRecommended: true
    },
    {
      value: "paper" as PrescriptionStatus,
      icon: FileX,
      title: "紙処方箋",
      description: "従来の紙ベースの処方箋で発行",
      color: "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50",
      iconColor: "text-gray-600 dark:text-gray-400",
      isRecommended: false
    },
    {
      value: "disconnected" as PrescriptionStatus,
      icon: AlertTriangle,
      title: "システム未連携",
      description: "システム障害時の一時的設定",
      color: "border-orange-300 bg-orange-50 dark:border-orange-600 dark:bg-orange-800/50",
      iconColor: "text-orange-600 dark:text-orange-400",
      isRecommended: false
    }
  ];

  const handleSubmit = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 実際のアプリケーションでは、ここでサーバーAPIを呼び出します
      await new Promise(resolve => setTimeout(resolve, 500)); // シミュレート
      
      if (onStatusChange) {
        onStatusChange(selectedStatus);
      }

      const selectedOption = statusOptions.find(option => option.value === selectedStatus);
      toast.success(`処方箋発行形態を「${selectedOption?.title}」に変更しました`, {
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
    setSelectedStatus(currentStatus);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <span>処方箋発行形態</span>
          </DialogTitle>
          <DialogDescription>
            患者の処方箋発行形態を設定します。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 患者情報 */}
          <div className="text-sm text-muted-foreground">
            患者: {patientName} (ID: {patientId})
          </div>

          {/* 設定選択 */}
          <RadioGroup 
            value={selectedStatus} 
            onValueChange={(value) => setSelectedStatus(value as PrescriptionStatus)}
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
                selectedStatus === currentStatus ? "変更" : "変更"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}