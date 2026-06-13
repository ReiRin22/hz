"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Badge } from "./badge";
import { ScrollArea } from "./scroll-area";
import { Printer, FileText, FlaskConical, ScanLine, Clipboard, FileCheck, FileOutput, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { MedicalForm } from "@/shared/types";

interface MedicalFormOutputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  forms: MedicalForm[];
  patientName: string;
  patientId: string;
}

const formTypeConfig = {
  PRESCRIPTION: {
    icon: FileText,
    label: "処方箋",
    color: "bg-blue-500",
    textColor: "text-blue-700"
  },
  LAB_REQUEST: {
    icon: FlaskConical,
    label: "検査依頼書",
    color: "bg-purple-500",
    textColor: "text-purple-700"
  },
  IMAGING_REQUEST: {
    icon: ScanLine,
    label: "画像検査依頼書",
    color: "bg-teal-500",
    textColor: "text-teal-700"
  },
  PROCEDURE_CONSENT: {
    icon: Clipboard,
    label: "処置同意書",
    color: "bg-orange-500",
    textColor: "text-orange-700"
  },
  NURSING_INSTRUCTION: {
    icon: FileCheck,
    label: "看護指示書",
    color: "bg-pink-500",
    textColor: "text-pink-700"
  },
  REFERRAL: {
    icon: FileOutput,
    label: "紹介状",
    color: "bg-indigo-500",
    textColor: "text-indigo-700"
  },
  DISCHARGE_SUMMARY: {
    icon: FileText,
    label: "退院サマリー",
    color: "bg-green-500",
    textColor: "text-green-700"
  }
};

const priorityConfig = {
  URGENT: {
    label: "緊急",
    color: "bg-red-600",
    textColor: "text-red-600"
  },
  NORMAL: {
    label: "通常",
    color: "bg-blue-600",
    textColor: "text-blue-600"
  },
  ROUTINE: {
    label: "定期",
    color: "bg-gray-600",
    textColor: "text-gray-600"
  }
};

const statusConfig = {
  DRAFT: {
    label: "下書き",
    color: "bg-gray-500"
  },
  READY: {
    label: "出力可",
    color: "bg-green-600"
  },
  PRINTED: {
    label: "出力済",
    color: "bg-blue-600"
  },
  SENT: {
    label: "送信済",
    color: "bg-purple-600"
  }
};

export function MedicalFormOutputDialog({
  isOpen,
  onClose,
  forms,
  patientName,
  patientId
}: MedicalFormOutputDialogProps) {
  const [selectedFormIds, setSelectedFormIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleForm = (formId: string) => {
    setSelectedFormIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(formId)) {
        newSet.delete(formId);
      } else {
        newSet.add(formId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedFormIds.size === forms.length) {
      setSelectedFormIds(new Set());
    } else {
      setSelectedFormIds(new Set(forms.map(f => f.id)));
    }
  };

  const handlePrint = async () => {
    if (selectedFormIds.size === 0) {
      toast.error("帳票が選択されていません", {
        description: "出力する帳票を選択してください"
      });
      return;
    }

    setIsProcessing(true);

    // 実際の印刷処理をシミュレート
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    const selectedForms = forms.filter(f => selectedFormIds.has(f.id));
    const formNames = selectedForms.map(f => formTypeConfig[f.type].label).join(", ");

    toast.success(`帳票を出力しました`, {
      description: `${selectedFormIds.size}件の帳票: ${formNames}`
    });

    setIsProcessing(false);
    setSelectedFormIds(new Set());
    onClose();
  };

  const handlePreview = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      toast.info(`帳票プレビュー: ${formTypeConfig[form.type].label}`, {
        description: form.name
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-600" />
            帳票出力
          </DialogTitle>
          <DialogDescription>
            患者: {patientName} (ID: {patientId}) - 出力する帳票を選択してください
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 選択コントロール */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedFormIds.size === forms.length ? "すべて解除" : "すべて選択"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedFormIds.size} / {forms.length} 件選択中
              </span>
            </div>
            {forms.some(f => f.priority === 'URGENT') && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                緊急帳票あり
              </Badge>
            )}
          </div>

          {/* 帳票リスト */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {forms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  出力可能な帳票がありません
                </div>
              ) : (
                forms.map(form => {
                  const config = formTypeConfig[form.type];
                  const Icon = config.icon;
                  const isSelected = selectedFormIds.has(form.id);
                  const priorityInfo = form.priority ? priorityConfig[form.priority] : null;
                  const statusInfo = statusConfig[form.status];

                  return (
                    <div
                      key={form.id}
                      className={`p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      } ${form.priority === 'URGENT' ? 'ring-2 ring-red-500/50' : ''}`}
                      onClick={() => handleToggleForm(form.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleForm(form.id)}
                          className="mt-1"
                        />
                        
                        <div className={`p-2 rounded-md ${config.color} text-white flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1">{form.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {form.description}
                          </p>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              作成: {new Date(form.createdAt).toLocaleString('ja-JP', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {form.relatedOrderIds.length > 0 && (
                            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                              関連オーダー: {form.relatedOrderIds.length} 件
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            キャンセル
          </Button>
          <Button
            onClick={handlePrint}
            disabled={selectedFormIds.size === 0 || isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            {isProcessing ? "処理中..." : `出力 (${selectedFormIds.size})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}