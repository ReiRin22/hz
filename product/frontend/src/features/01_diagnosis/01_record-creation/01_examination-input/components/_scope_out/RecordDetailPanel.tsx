import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { Separator } from "@/shared/components/atoms/separator";
import { FileText, Heart, Pill, FlaskConical, Copy, CreditCard, Activity, X, Eye, HeartPulse, Edit } from "lucide-react";
import { useMemo } from "react";
import { toast } from 'sonner';

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
  type: "progress" | "vital" | "observation" | "treatment" | "nursing" | "prescription" | "test";
  title: string;
  content: string;
  author: string;
  insurance?: { type: string; burden: string };
  soapRecord?: string;
  vitalSigns?: VitalSigns;
  schemas?: { [key: string]: string };  // シェーマ画像データを保存
  createdAt?: string; // 記録作成日時（ISO 8601形式）
}

interface RecordDetailPanelProps {
  record: Record | null | undefined;
  onApplyRecord?: (record: Record) => void;
  onEditRecord?: (record: Record) => void;
  onClose: () => void;
  editableDays?: number; // 編集可能期間（日数）
}

const recordTypeConfig = {
  progress: { icon: FileText, label: "経過記録", color: "bg-blue-500" },
  vital: { icon: Activity, label: "バイタル記録", color: "bg-red-500" },
  observation: { icon: Eye, label: "観察記録", color: "bg-green-500" },
  treatment: { icon: HeartPulse, label: "治療記録", color: "bg-orange-500" },
  nursing: { icon: Heart, label: "看護記録", color: "bg-green-500" },
  prescription: { icon: Pill, label: "処方履歴", color: "bg-purple-500" },
  test: { icon: FlaskConical, label: "検査結果", color: "bg-orange-500" }
};

// マークアップをHTMLに変換する関数
const markupToHtml = (text: string, schemas?: { [key: string]: string }): string => {
  if (!text) return "";
  
  let html = text;
  
  // シェーマ: [シェーマ:schema_123456] -> 画像表示
  html = html.replace(/\[シェーマ:schema_(\d+)\]/g, (match, schemaId) => {
    try {
      // まずrecord.schemasから取得を試みる（永続化されたデータ）
      let imageData = schemas?.[schemaId];
      
      // なければLocalStorageから取得（一時的なデータ）
      if (!imageData) {
        imageData = localStorage.getItem(`schema_${schemaId}`) || undefined;
      }
      
      console.log(`シェーマID: ${schemaId}, データ存在: ${!!imageData}, ソース: ${schemas?.[schemaId] ? 'record.schemas' : 'localStorage'}`);
      
      if (imageData) {
        return `<div class="my-4 p-2 border-2 border-blue-300 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-950/30 inline-block"><img src="${imageData}" alt="シェーマ" class="max-w-full h-auto rounded" style="max-height: 400px;" /><div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">シェーマ (ID: ${schemaId})</div></div>`;
      } else {
        console.warn(`シェーマ画像が見つかりません: schema_${schemaId}`);
        return `<div class="my-4 p-2 border-2 border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-950/30 inline-block"><div class="text-xs text-red-500 dark:text-red-400 p-2">⚠️ シェーマ画像が見つかりません (ID: ${schemaId})</div></div>`;
      }
    } catch (error) {
      console.error('シェーマ読み込みエラー:', error);
    }
    return match;
  });
  
  // 太字: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 下線: __text__ -> <u>text</u>
  html = html.replace(/__(.*?)__/g, '<u class="underline">$1</u>');
  
  // 赤マーカー: [赤]text[/赤] -> <mark class="bg-red-200">text</mark>
  html = html.replace(/\[赤\](.*?)\[\/赤\]/g, '<mark class="bg-red-200 dark:bg-red-900/50">$1</mark>');
  
  // 黄マーカー: [黄]text[/黄] -> <mark class="bg-yellow-200">text</mark>
  html = html.replace(/\[黄\](.*?)\[\/黄\]/g, '<mark class="bg-yellow-200 dark:bg-yellow-900/50">$1</mark>');
  
  // 見出し: ## text -> <h3>text</h3>
  html = html.replace(/^## (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
  
  // 箇条書き: - text -> <li>text</li>
  const lines = html.split('\n');
  let inList = false;
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('- ')) {
      if (!inList) {
        processedLines.push('<ul class="list-disc list-inside my-2">');
        inList = true;
      }
      processedLines.push(`<li>${line.trim().substring(2)}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }
  
  if (inList) {
    processedLines.push('</ul>');
  }
  
  html = processedLines.join('\n');
  
  // 改行を<br>に変換（ただしHTMLタグ直後は除く）
  html = html.replace(/\n/g, '<br>');
  
  return html;
};

export function RecordDetailPanel({ record, onApplyRecord, onEditRecord, onClose, editableDays }: RecordDetailPanelProps) {
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

  // 記録内容をHTMLに変換（シェーマや文字装飾を表示）
  const recordContentHtml = useMemo(() => {
    const content = record.soapRecord || record.content;
    return markupToHtml(content, record.schemas);
  }, [record.soapRecord, record.content, record.schemas]);

  // 編集可能期間内かどうかをチェック
  const isWithinEditablePeriod = useMemo(() => {
    if (!editableDays) return false;
    
    // 記録作成日時を使用（存在しない場合はdateフィールドを使用）
    let recordDate: Date;
    if (record.createdAt) {
      // createdAtがある場合はそれを使用（ISO 8601形式）
      recordDate = new Date(record.createdAt);
    } else if (record.date.includes('/')) {
      // dateフィールドがスラッシュ区切りの場合（2024/12/27 → 2024-12-27）
      const [year, month, day] = record.date.split('/');
      recordDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    } else {
      recordDate = new Date(record.date);
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - recordDate.getTime();
    const diffInDays = diffInMs / (24 * 60 * 60 * 1000);
    
    console.log('[RecordDetailPanel] 編集可能期間チェック:', {
      recordId: record.id,
      createdAt: record.createdAt,
      recordDate: recordDate.toISOString(),
      now: now.toISOString(),
      diffInDays: diffInDays,
      editableDays: editableDays,
      isWithinPeriod: diffInDays <= editableDays
    });
    
    return diffInDays <= editableDays;
  }, [record.date, record.createdAt, record.id, editableDays]);

  // 編集ボタン押下時のハンドラー
  const handleEditClick = () => {
    if (!onEditRecord) return;
    
    console.log('[RecordDetailPanel] 編集ボタンクリック:', {
      recordId: record.id,
      isWithinEditablePeriod,
      editableDays
    });
    
    if (!isWithinEditablePeriod) {
      // 編集可能期間外の場合は警告を表示
      console.log('[RecordDetailPanel] 警告を表示します');
      toast.warning("編集可能期間を超過しています", {
        description: `この記録は作成から${editableDays}日を超過しています。編集はできません。`,
      });
      console.log('[RecordDetailPanel] toast.warning 呼び出し完了');
      return;
    }
    
    console.log('[RecordDetailPanel] 編集処理を実行します');
    // 編集可能期間内の場合は編集処理を実行
    onEditRecord(record);
  };

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
            {onEditRecord && (
              <Button 
                size="sm" 
                onClick={handleEditClick}
                className="medical-primary hover:bg-blue-700 text-white shadow-sm"
              >
                <Edit className="w-3 h-3 mr-1" />
                編集
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
          <div className="bg-background p-3 rounded-lg text-sm whitespace-pre-wrap max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700" dangerouslySetInnerHTML={{ __html: recordContentHtml }} />
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