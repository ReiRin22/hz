import { useState } from "react";
import { Button } from "@shared/components/atoms/button";
import { Badge } from "@shared/components/atoms/badge";
import { Separator } from "@shared/components/atoms/separator";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import { Card, CardContent } from "@shared/components/atoms/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@shared/components/atoms/dialog";
import { 
  FileText, 
  TestTube, 
  LayoutTemplate, 
  FileCheck,
  Send,
  Calendar,
  Download,
  Hospital,
  Activity,
  Pill,
  Monitor,
  FlaskConical,
  Settings,
  Layers
} from "lucide-react";


interface HamburgerMenuProps {
  onDocumentCreate: (type: string) => void;
  onTemplateLoad: (template: string) => void;
  onExternalRecordsView?: () => void;
  onHealthCheckupView?: () => void;
  onDiagnosisRegistration?: () => void;
  onMedicationHistoryView?: () => void;
  onImageViewing?: () => void;
  onTestResultsView?: () => void;
  onSetManagementOpen?: () => void;
  onPrescriptionOrderOpen?: () => void;
  medicationHistory?: any[];
  testResults?: any[];
  imageCount?: number;
}

export function HamburgerMenu({
  onDocumentCreate,
  onTemplateLoad,
  onExternalRecordsView,
  onHealthCheckupView,
  onDiagnosisRegistration,
  onMedicationHistoryView,
  onImageViewing,
  onTestResultsView,
  onSetManagementOpen,
  onPrescriptionOrderOpen,
  medicationHistory = [],
  testResults = [],
  imageCount = 0,
}: HamburgerMenuProps) {
  const menuItems = [
    {
      icon: FileText,
      label: "診断書",
      action: () => onDocumentCreate("medical-certificate"),
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      icon: Send,
      label: "紹介状",
      action: () => onDocumentCreate("referral-letter"),
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      icon: FileCheck,
      label: "処方箋",
      action: () => onDocumentCreate("prescription"),
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      icon: TestTube,
      label: "検査報告",
      action: () => onDocumentCreate("report"),
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  const templateItems = [
    {
      icon: LayoutTemplate,
      label: "内科",
      action: () => onTemplateLoad("internal-medicine"),
      color: "text-cyan-600",
    },
    {
      icon: LayoutTemplate,
      label: "外科",
      action: () => onTemplateLoad("surgery"),
      color: "text-red-600",
    },
    {
      icon: LayoutTemplate,
      label: "小児科",
      action: () => onTemplateLoad("pediatrics"),
      color: "text-pink-600",
    },
    {
      icon: LayoutTemplate,
      label: "整形外科",
      action: () => onTemplateLoad("orthopedics"),
      color: "text-indigo-600",
    },
  ];

  // PatientHeaderから移動してきた機能ボタン
  const patientActionItems = [
    {
      icon: FileText,
      label: "病名登録",
      action: onDiagnosisRegistration,
      color: "text-slate-600",
      bgColor: "bg-slate-50 dark:bg-slate-950",
      badge: null,
    },
    {
      icon: Pill,
      label: "薬歴参照",
      action: onMedicationHistoryView,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      badge: medicationHistory.length > 0 ? medicationHistory.length : null,
    },
    {
      icon: Monitor,
      label: "画像参照",
      action: onImageViewing,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      badge: imageCount > 0 ? imageCount : null,
    },
    {
      icon: FlaskConical,
      label: "検査結果",
      action: onTestResultsView,
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950",
      badge: testResults.length > 0 ? testResults.length : null,
    },
  ];

  return (
    <div className="w-full min-w-[90px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-lg">
      <Card className="h-full border-0 rounded-none">
        <CardContent className="p-2 space-y-2">
          {/* ヘッダー */}
          <div className="text-center">
            <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
              操作
            </h3>
            <Separator />
          </div>

          {/* 患者機能セクション */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground text-center mb-1">
              患者機能
            </div>
            <div className="grid gap-1">
              {patientActionItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={item.action}
                    className={`h-auto p-2 flex flex-row items-center space-x-2 hover:${item.bgColor} transition-colors relative justify-start w-full`}
                  >
                    <div className="relative flex-shrink-0">
                      <IconComponent className={`w-5 h-5 ${item.color}`} />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1 min-w-[12px] h-3 flex items-center justify-center leading-none">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs leading-tight text-left flex-1 min-w-0 truncate">
                      {item.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* 文書作成セクション */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground text-center mb-1">
              文書作成
            </div>
            <div className="grid gap-1">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={item.action}
                    className={`h-auto p-2 flex flex-row items-center space-x-2 hover:${item.bgColor} transition-colors justify-start w-full`}
                  >
                    <IconComponent className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                    <span className="text-xs leading-tight text-left flex-1 min-w-0 truncate">
                      {item.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* テンプレート読み込みセクション */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground text-center mb-1">
              テンプレート
            </div>
            <div className="grid gap-1">
              {templateItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={item.action}
                    className="h-auto p-2 flex flex-row items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors justify-start w-full"
                  >
                    <IconComponent className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                    <span className="text-xs leading-tight text-left flex-1 min-w-0 truncate">
                      {item.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* 情報参照セクション */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground text-center mb-1">
              情報参照
            </div>
            <div className="grid gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onExternalRecordsView}
                className="h-auto p-2 flex flex-row items-center space-x-2 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors justify-start w-full"
              >
                <Hospital className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-xs leading-tight text-left flex-1 min-w-0 truncate">
                  他院情報
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onHealthCheckupView}
                className="h-auto p-2 flex flex-row items-center space-x-2 hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors justify-start w-full"
              >
                <Activity className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span className="text-xs leading-tight text-left flex-1 min-w-0 truncate">
                  健診情報
                </span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* オーダー機能追加 */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground text-center mb-1">
              オーダー
            </div>
            <div className="grid gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrescriptionOrderOpen}
                className="h-auto p-2 flex flex-row items-center space-x-2 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors justify-start w-full"
              >
                <Pill className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-xs leading-tight text-left flex-1 min-w-0 truncate">
                  処方オーダー
                </span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* セット登録機能を追加 */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground text-center mb-1">
              効率化
            </div>
            <div className="grid gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSetManagementOpen}
                className="h-auto p-2 flex flex-row items-center space-x-2 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors justify-start w-full"
              >
                <Layers className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-xs leading-tight text-left flex-1 min-w-0 truncate">
                  セット登録
                </span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* その他の操作 */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground text-center mb-1">
              その他
            </div>
            <div className="grid gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-2 flex flex-row items-center space-x-2 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors justify-start w-full"
              >
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-xs leading-tight text-left flex-1 min-w-0 truncate">
                  予定
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-2 flex flex-row items-center space-x-2 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors justify-start w-full"
              >
                <Download className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-xs leading-tight text-left flex-1 min-w-0 truncate">
                  出力
                </span>
              </Button>

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}