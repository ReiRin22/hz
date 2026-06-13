import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/atoms/card";
import { Badge } from "@shared/components/atoms/badge";
import { Button } from "@shared/components/atoms/button";
import { Separator } from "@shared/components/atoms/separator";
import { FileText, Heart, Pill, FlaskConical, Copy, CreditCard, Activity, X } from "lucide-react";

interface VitalSigns {
  bloodPressure?: string;
  pulse?: string;
  temperature?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
}

interface Record {
  id: string;
  date: string;
  time: string;
  type: "progress" | "nursing" | "prescription" | "test";
  title: string;
  content: string;
  author: string;
  insurance?: { type: string; burden: string };
  soapRecord?: string;
  vitalSigns?: VitalSigns;
}

interface RecordDetailPanelProps {
  record: Record | null | undefined;
  onApplyRecord?: (record: Record) => void;
  onClose: () => void;
}

const recordTypeConfig = {
  progress: { icon: FileText, label: "経過記録", color: "bg-blue-500" },
  nursing: { icon: Heart, label: "看護記録", color: "bg-green-500" },
  prescription: { icon: Pill, label: "処方履歴", color: "bg-purple-500" },
  test: { icon: FlaskConical, label: "検査結果", color: "bg-orange-500" }
};

export function RecordDetailPanel({ record, onApplyRecord, onClose }: RecordDetailPanelProps) {
  // 防御的コード: recordまたはtypeが無効な場合の処理
  if (!record || !record.type || !recordTypeConfig[record.type]) {
    return (
      <Card className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-2 border-dashed border-red-300 dark:border-red-600">
        <div className="text-center p-6 space-y-3">
          <div className="text-red-600 dark:text-red-400">
            記録データが無効または見つかりません
          </div>
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </Card>
    );
  }

  const config = recordTypeConfig[record.type];
  const Icon = config.icon;

  return (
    <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 relative overflow-hidden transition-shadow duration-200 hover:shadow-2xl h-full flex flex-col">
      {/* 装飾的な背景 */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full -translate-y-12 translate-x-12" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full translate-y-10 -translate-x-10" />
      
      <CardHeader className="pb-4 relative z-10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl text-white shadow-lg ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold medical-text-primary">記録詳細</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {config.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {record.date} {record.time}
                </span>
              </div>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {onApplyRecord && (
              <Button 
                size="sm" 
                onClick={() => onApplyRecord(record)}
                className="medical-primary hover:bg-blue-700 text-white shadow-sm"
              >
                <Copy className="w-3 h-3 mr-1" />
                Do
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10 flex-1 overflow-y-auto">
        {/* 基本情報 */}
        <div className="space-y-3">
          <div>
            <span className="font-medium text-sm text-muted-foreground">タイトル: </span>
            <span className="text-sm">{record.title}</span>
          </div>
          
          <div>
            <span className="font-medium text-sm text-muted-foreground">記録者: </span>
            <span className="text-sm">{record.author}</span>
          </div>
          
          {record.insurance && (
            <div>
              <span className="font-medium text-sm text-muted-foreground">保険情報: </span>
              <div className="flex items-center space-x-1 inline-flex">
                <CreditCard className="w-3 h-3" />
                <span className="text-sm">{record.insurance.type} ({record.insurance.burden})</span>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* 記録内容 */}
        <div>
          <span className="font-medium text-sm text-muted-foreground block mb-2">記録内容:</span>
          <div className="bg-background p-3 rounded-lg text-sm whitespace-pre-wrap max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700">
            {record.soapRecord || record.content}
          </div>
        </div>
        
        {/* バイタルサイン */}
        {record.vitalSigns && Object.values(record.vitalSigns).some(value => value) && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-4 h-4 medical-text-primary" />
              <span className="font-medium text-sm text-muted-foreground">バイタルサイン:</span>
            </div>
            <div className="bg-background p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 gap-2 text-sm">
                {record.vitalSigns.bloodPressure && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">血圧:</span>
                    <span className="font-medium">{record.vitalSigns.bloodPressure}</span>
                  </div>
                )}
                {record.vitalSigns.pulse && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">脈拍:</span>
                    <span className="font-medium">{record.vitalSigns.pulse} bpm</span>
                  </div>
                )}
                {record.vitalSigns.temperature && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">体温:</span>
                    <span className="font-medium">{record.vitalSigns.temperature} °C</span>
                  </div>
                )}
                {record.vitalSigns.respiratoryRate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">呼吸数:</span>
                    <span className="font-medium">{record.vitalSigns.respiratoryRate} 回/分</span>
                  </div>
                )}
                {record.vitalSigns.oxygenSaturation && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SpO2:</span>
                    <span className="font-medium">{record.vitalSigns.oxygenSaturation} %</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}