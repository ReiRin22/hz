import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { Separator } from "@/shared/components/atoms/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/atoms/accordion";
import { 
  FileText, Heart, Pill, FlaskConical, X, Copy, CreditCard, Activity,
  Syringe, Scissors, Microscope, Eye, ImageIcon as LucideImageIcon, 
  Droplets, BookOpen, Cross
} from "lucide-react";

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
  type: 
    | "progress"        // 経過記録
    | "nursing"         // 看護記録
    | "prescription"    // 処方
    | "injection"       // 注射
    | "treatment"       // 処置
    | "test"            // 検体検査
    | "bacteriology"    // 細菌検査
    | "pathology"       // 病理検査
    | "physiology"      // 生理検査
    | "endoscopy"       // 内視鏡
    | "radiology"       // 画像検査
    | "rehabilitation"  // リハビリ
    | "dialysis"        // 透析
    | "guidance"        // 指導
    | "surgery"         // 手術
    | "vital"           // バイタルサイン
    | "observation";    // 観察記録
  content: string;
  author: string;
  insurance?: { type: string; burden: string };
  soapRecord?: string;
  schema?: string;  // シェーマ画像のURL
  vitalSigns?: VitalSigns;
}

interface RecordDetailPanelProps {
  record: Record | Record[] | null | undefined;  // 単一または複数の記録を受け取る
  onApplyRecord?: (record: Record) => void;
  onClose: () => void;
}

const recordTypeConfig = {
  progress: { icon: FileText, label: "経過記録", color: "bg-blue-500", isOrder: false, detailLabel: "記録内容" },
  nursing: { icon: Heart, label: "看護記録", color: "bg-green-500", isOrder: false, detailLabel: "記録内容" },
  prescription: { icon: Pill, label: "処方", color: "bg-purple-500", isOrder: true, detailLabel: "処方内容" },
  injection: { icon: Syringe, label: "注射", color: "bg-pink-500", isOrder: true, detailLabel: "注射内容" },
  treatment: { icon: Scissors, label: "処置", color: "bg-cyan-500", isOrder: true, detailLabel: "処置内容" },
  test: { icon: FlaskConical, label: "検体検査", color: "bg-orange-500", isOrder: true, detailLabel: "検査項目" },
  bacteriology: { icon: Microscope, label: "細菌検査", color: "bg-amber-600", isOrder: true, detailLabel: "検査項目" },
  pathology: { icon: Microscope, label: "病理検査", color: "bg-red-600", isOrder: true, detailLabel: "検査項目" },
  physiology: { icon: Activity, label: "生理検査", color: "bg-teal-500", isOrder: true, detailLabel: "検査項目" },
  endoscopy: { icon: Eye, label: "内視鏡", color: "bg-indigo-500", isOrder: true, detailLabel: "検査部位・目的" },
  radiology: { icon: LucideImageIcon, label: "画像検査", color: "bg-slate-600", isOrder: true, detailLabel: "検査部位・目的" },
  rehabilitation: { icon: Activity, label: "リハビリ", color: "bg-lime-500", isOrder: true, detailLabel: "リハビリ内容" },
  dialysis: { icon: Droplets, label: "透析", color: "bg-sky-600", isOrder: true, detailLabel: "透析内容" },
  guidance: { icon: BookOpen, label: "指導", color: "bg-emerald-500", isOrder: false, detailLabel: "指導内容" },
  surgery: { icon: Cross, label: "手術", color: "bg-rose-600", isOrder: true, detailLabel: "手術内容" },
  vital: { icon: Activity, label: "バイタル", color: "bg-red-500", isOrder: false, detailLabel: "記録内容" },
  observation: { icon: Eye, label: "観察記録", color: "bg-gray-500", isOrder: false, detailLabel: "観察内容" }
};

export function RecordDetailPanel({ record, onApplyRecord, onClose }: RecordDetailPanelProps) {
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  
  // 配列かどうかをチェック
  const isMultipleRecords = Array.isArray(record);
  
  // 複数記録の場合
  if (isMultipleRecords) {
    const records = record as Record[];
    if (records.length === 0) {
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

    // 複数記録を縦に並べて表示
    const firstRecord = records[0];
    const lastRecord = records[records.length - 1];
    const isSameDate = firstRecord.date === lastRecord.date;
    
    return (
      <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 relative overflow-hidden transition-shadow duration-200 hover:shadow-2xl h-full flex flex-col gap-2">
        {/* 装飾的な背景 */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full translate-y-10 -translate-x-10" />
        
        <CardHeader className="pb-0 pt-3 px-4 relative z-10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold medical-text-primary">記録詳細</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-2 relative z-10 flex-1 overflow-y-auto pt-2">
          <Accordion 
            type="multiple" 
            defaultValue={records.map(r => r.id)} 
            className="space-y-2"
            key={records.map(r => r.id).join(',')}  // recordsが変わったら再マウント
          >
            {records.map((rec, index) => {
              const config = recordTypeConfig[rec.type];
              const Icon = config.icon;
              
              return (
                <AccordionItem key={rec.id} value={rec.id} className="border rounded-lg shadow-sm">
                  <AccordionTrigger className="px-4 py-2.5 hover:no-underline hover:bg-accent/50 rounded-t-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`p-2 rounded-lg text-white shadow-md ${config.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col items-start flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-sm">
                            {config.label}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground mt-1">
                          {rec.date} {rec.time}
                        </span>
                      </div>
                      {onApplyRecord && config.isOrder && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            onApplyRecord(rec);
                          }}
                          className="medical-primary hover:bg-blue-700 text-white shadow-sm h-7 text-xs px-3 rounded-md flex items-center cursor-pointer transition-colors"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Do
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-4 pb-4 pt-3">
                    <div className="space-y-3">
                      {/* 記録者・保険情報 */}
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">記録者: {rec.author}</span>
                        </div>
                        {rec.insurance && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">保険情報: </span>
                            <div className="flex items-center space-x-1 inline-flex">
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>{rec.insurance.type} ({rec.insurance.burden})</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Separator />
                      
                      {/* オーダー・記録内容 */}
                      <div>
                        <span className="font-medium text-sm text-muted-foreground block mb-2">{config.detailLabel}:</span>
                        <div className="bg-muted/30 p-3 rounded text-sm whitespace-pre-wrap">
                          {rec.soapRecord || rec.content}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    );
  }

  // 単一記録の場合（元のロジック）
  const singleRecord = record as Record;
  
  // 防御的コード: recordまたはtypeが無効な場合の処理
  if (!singleRecord || !singleRecord.type || !recordTypeConfig[singleRecord.type]) {
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

  const config = recordTypeConfig[singleRecord.type];
  const Icon = config.icon;

  return (
    <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 relative overflow-hidden transition-shadow duration-200 hover:shadow-2xl h-full flex flex-col gap-2">
      {/* 装飾的な背景 */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full -translate-y-12 translate-x-12" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full translate-y-10 -translate-x-10" />
      
      <CardHeader className="pb-0 pt-3 px-4 relative z-10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold medical-text-primary">記録詳細</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 relative z-10 flex-1 overflow-y-auto pt-2">
        <Accordion 
          type="multiple" 
          defaultValue={[singleRecord.id]} 
          className="space-y-2"
          key={singleRecord.id}  // recordが変わったら再マウント
        >
          <AccordionItem value={singleRecord.id} className="border rounded-lg shadow-sm">
            <AccordionTrigger className="px-4 py-2.5 hover:no-underline hover:bg-accent/50 rounded-t-lg">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`p-2 rounded-lg text-white shadow-md ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-sm">
                      {config.label}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground mt-1">
                    {singleRecord.date} {singleRecord.time}
                  </span>
                </div>
                {onApplyRecord && config.isOrder && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplyRecord(singleRecord);
                    }}
                    className="medical-primary hover:bg-blue-700 text-white shadow-sm h-7 text-xs px-3 rounded-md flex items-center cursor-pointer transition-colors"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Do
                  </div>
                )}
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-4 pb-4 pt-3">
              <div className="space-y-3">
                {/* 記録者・保険情報 */}
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">記録者: {singleRecord.author}</span>
                  </div>
                  {singleRecord.insurance && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">保険情報: </span>
                      <div className="flex items-center space-x-1 inline-flex">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{singleRecord.insurance.type} ({singleRecord.insurance.burden})</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* オーダー・記録内容 */}
                <div>
                  <span className="font-medium text-sm text-muted-foreground block mb-2">{config.detailLabel}:</span>
                  <div className="bg-muted/30 p-3 rounded text-sm whitespace-pre-wrap space-y-3">
                    <div>
                      {singleRecord.soapRecord || singleRecord.content}
                    </div>
                    
                    {/* シェーマ */}
                    {singleRecord.schema && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="relative group w-32">
                          <img 
                            src={singleRecord.schema} 
                            alt="シェーマ画像" 
                            className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSchemaModalOpen(true)}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">クリックで拡大</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* シェーマモーダル */}
        {schemaModalOpen && singleRecord.schema && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSchemaModalOpen(false)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img 
                src={singleRecord.schema} 
                alt="シェーマ画像（拡大）" 
                className="w-full h-full object-contain rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                onClick={() => setSchemaModalOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}