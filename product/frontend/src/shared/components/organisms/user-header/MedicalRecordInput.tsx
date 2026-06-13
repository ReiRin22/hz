import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/atoms/card";
import { Textarea } from "@shared/components/atoms/textarea";
import { Input } from "@shared/components/atoms/input";
import { Label } from "@shared/components/atoms/label";
import { Button } from "@shared/components/atoms/button";
import { Badge } from "@shared/components/atoms/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@shared/components/atoms/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/components/atoms/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@shared/components/atoms/command";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import { Separator } from "@shared/components/atoms/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/atoms/tabs";
import { 
  FileText, 
  Save, 
  Plus, 
  Palette, 
  Mic, 
  MicOff, 
  MessageSquare,
  Edit,
  Zap,
  Check,
  ChevronDown,
  Volume2
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { SchemaCreation } from "./SchemaCreation";
import { SetQuickAccess } from "./SetQuickAccess";
import { MyCommentManagementDialog, type MyComment } from "./MyCommentManagementDialog";
import { toast } from "sonner";

import type { RegisteredSet, SetApplyOptions } from "@/shared/types/user-header/set-registration-types";

interface MedicalRecordInputProps {
  record: {
    recordDate: string;
    soapRecord: string;
    vitalSigns: {
      bloodPressure: string;
      pulse: string;
      temperature: string;
      respiratoryRate: string;
      oxygenSaturation: string;
    };
  };
  onRecordChange: (record: any) => void;
  onSave: () => void;
  isEditable: boolean;
  onNewRecordMode?: () => void;
  selectedRecordId?: string;
  onRecordEdit?: () => void;
  onSetApply?: (set: RegisteredSet, options: SetApplyOptions) => void;
  onSetManagementOpen?: () => void;
}

// テンプレートデータ
const soapTemplates = [
  {
    id: 'general',
    name: '一般診療',
    content: `S (Subjective - 主観的情報):
主訴：
現病歴：
既往歴：
家族歴：
社会歴：

O (Objective - 客観的情報):
バイタルサイン：
身体所見：
検査結果：

A (Assessment - 評価・診断):
診断：
鑑別診断：

P (Plan - 計画・治療方針):
治療方針：
処方：
次回予定：`
  },
  {
    id: 'followup',
    name: 'フォローアップ',
    content: `S (Subjective - 主観的情報):
前回診療後の経過：
症状の変化：
服薬状況：

O (Objective - 客観的情報):
バイタルサイン：
身体所見：
検査結果：

A (Assessment - 評価・診断):
現状評価：
治療効果：

P (Plan - 計画・治療方針):
継続治療：
調整内容：
次回予定：`
  },
  {
    id: 'emergency',
    name: '救急外来',
    content: `S (Subjective - 主観的情報):
主訴：
発症時刻・状況：
既往歴：
アレルギー：

O (Objective - 客観的情報):
バイタルサイン：
意識レベル：
身体所見：
緊急検査：

A (Assessment - 評価・診断):
緊急度：
診断：

P (Plan - 計画・治療方針):
緊急処置：
入院適応：
継続治療：`
  }
];

// デフォルトのコメントデータ（Myコメント - ユーザー個人用）
// 実際のデータはLocalStorageから読み込まれる
const defaultMyComments: MyComment[] = [
  { 
    id: 'my1', 
    title: '定期検査フォロー', 
    content: '次回検査: CBC, CRP, HbA1c\n外来予約: 4週間後',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'my2', 
    title: '薬剤調整', 
    content: '降圧薬の用量調整を検討\nBP目標: <130/80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'my3', 
    title: '生活指導', 
    content: '食事療法: 減塩指導\n運動療法: ウォーキング30分/日',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'my4', 
    title: '緊急時対応', 
    content: '胸痛時: ニトロ舌下\n救急搬送基準: 5分持続',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'my5', 
    title: '専門医紹介', 
    content: '循環器科紹介状作成予定\n予約調整中',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

// コメントデータ（患者別コメント - 特定患者用）
const patientComments = [
  { id: 'pt1', title: 'アレルギー情報', content: 'ペニシリン系抗生剤: アナフィラキシー既往\n代替薬: セフェム系を使用' },
  { id: 'pt2', title: '既往歴注意', content: '心筋梗塞後: 2022年3月\n冠動脈ステント留置済み（LAD）\n抗血小板薬2剤併用中' },
  { id: 'pt3', title: '服薬コンプライアンス', content: '時々内服忘れあり\n次回来院時に服薬カレンダー提案' },
  { id: 'pt4', title: '社会的背景', content: '独居、キーパーソン: 長女\n訪問看護導入検討中' },
  { id: 'pt5', title: '検査値推移', content: 'HbA1c: 7.5→7.2→6.8%（改善傾向）\nLDL-C: 目標値達成' },
];

// コメントデータ（診療科コメント - 科全体の共有情報）
const departmentComments = [
  { id: 'dept1', title: '糖尿病管理方針', content: 'HbA1c目標: <7.0%（高齢者は<7.5%）\n低血糖リスクに注意' },
  { id: 'dept2', title: '高血圧管理方針', content: '降圧目標: <130/80 mmHg\n75歳以上: <140/90 mmHg' },
  { id: 'dept3', title: '脂質異常症管理', content: 'LDL-C目標: 一次予防<120, 二次予防<100\nスタチン導入基準' },
  { id: 'dept4', title: '抗凝固薬使用時', content: 'PT-INR目標範囲の確認\n出血リスク評価必須' },
  { id: 'dept5', title: '検査オーダー定型', content: '定期検査セット: CBC, 生化学, HbA1c\n3ヶ月毎フォロー' },
];

export function MedicalRecordInput({
  record,
  onRecordChange,
  onSave,
  isEditable,
  onNewRecordMode,
  selectedRecordId,
  onRecordEdit,
  onSetApply,
  onSetManagementOpen,
}: MedicalRecordInputProps) {
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [isSchemaDialogOpen, setIsSchemaDialogOpen] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isMyCommentManagementOpen, setIsMyCommentManagementOpen] = useState(false);
  const [myComments, setMyComments] = useState<MyComment[]>(defaultMyComments);
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // LocalStorageからMyコメントを読み込む
  useEffect(() => {
    try {
      const stored = localStorage.getItem("harz_my_comments");
      if (stored) {
        setMyComments(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Myコメント読み込みエラー:", error);
    }
  }, []);

  // セット適用処理
  const handleSetApply = (set: RegisteredSet, options: SetApplyOptions) => {
    if (set.comprehensive?.medicalRecord || set.medicalRecord) {
      const medicalRecord = set.comprehensive?.medicalRecord || set.medicalRecord;
      if (medicalRecord) {
        let newSoapRecord = record.soapRecord;
        
        if (options.overwrite) {
          // 完全上書き
          newSoapRecord = [
            medicalRecord.subjective ? `S (Subjective - 主観的情報):\n${medicalRecord.subjective}` : '',
            medicalRecord.objective ? `\nO (Objective - 客観的情報):\n${medicalRecord.objective}` : '',
            medicalRecord.assessment ? `\nA (Assessment - 評価・診断):\n${medicalRecord.assessment}` : '',
            medicalRecord.plan ? `\nP (Plan - 計画・治療方針):\n${medicalRecord.plan}` : '',
          ].filter(Boolean).join('\n');
        } else if (options.merge) {
          // マージ（空文字列の場合は単純に適用、既存内容がある場合は追加）
          const hasExistingContent = record.soapRecord.trim().length > 0;
          const parts = [];
          
          if (hasExistingContent && medicalRecord.subjective) {
            parts.push(`\n\n--- セット追加: ${set.name} ---`);
            parts.push(`S: ${medicalRecord.subjective}`);
          } else if (medicalRecord.subjective) {
            parts.push(`S (Subjective - 主観的情報):\n${medicalRecord.subjective}`);
          }
          
          if (medicalRecord.objective) {
            const prefix = hasExistingContent ? 'O: ' : '\nO (Objective - 客観的情報):\n';
            parts.push(`${prefix}${medicalRecord.objective}`);
          }
          
          if (medicalRecord.assessment) {
            const prefix = hasExistingContent ? 'A: ' : '\nA (Assessment - 評価・診断):\n';
            parts.push(`${prefix}${medicalRecord.assessment}`);
          }
          
          if (medicalRecord.plan) {
            const prefix = hasExistingContent ? 'P: ' : '\nP (Plan - 計画・治療方針):\n';
            parts.push(`${prefix}${medicalRecord.plan}`);
          }
          
          newSoapRecord = record.soapRecord + parts.join('\n');
        }

        const newRecord = {
          ...record,
          soapRecord: newSoapRecord
        };
        
        onRecordChange(newRecord);
        onRecordEdit?.();
      }
    }
    
    // 親コンポーネントにも通知
    onSetApply?.(set, options);
  };

  // ダミー音声入力のサンプルテキスト
  const dummyVoiceTexts = [
    "患者様は胸痛を訴えており、呼吸困難感も認められます。",
    "血圧は140/90mmHg、脈拍は85回/分で安定しています。",
    "前回の診察から症状の改善が見られます。",
    "バイタルサイン安定。意識清明。顔色良好。",
    "心音整、雑音なし。呼吸音清、副雑音なし。",
    "糖尿病の管理目標を達成しつつあります。HbA1cは7.2%でした。",
    "処方薬の変更により、副作用は軽減されています。",
    "次回は2週間後の再診を予定します。"
  ];

  // 自動保存機能
  useEffect(() => {
    const timer = setTimeout(() => {
      if (record.soapRecord && record.soapRecord.trim() !== "") {
        localStorage.setItem(`medicalRecord_${record.recordDate}`, JSON.stringify(record));
        setLastSavedTime(new Date());
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [record]);

  // テキスト変更ハンドラー
  const handleInputChange = (field: string, value: string) => {
    const newRecord = { ...record, [field]: value };
    onRecordChange(newRecord);
    onRecordEdit?.();

    // カーソル位置を更新
    if (field === 'soapRecord' && textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      setCursorPosition(cursorPos);
    }
  };

  // 保存時間の表示
  const formatSaveTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // ダミー音声入力（デモ版）
  // 実際のマイク許可は不要

  // ダミー音声レベルアニメーション
  const startAudioAnalysis = () => {
    const updateLevel = () => {
      if (!isListening) return;
      
      // ランダムな音声レベルをシミュレート（20-80%の範囲）
      const randomLevel = 20 + Math.random() * 60;
      setAudioLevel(randomLevel);
      
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  // 音声レベル分析の停止
  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setAudioLevel(0);
  };

  // ダミー音声入力のシミュレーション
  const simulateVoiceInput = () => {
    // ランダムなテキストを選択
    const randomText = dummyVoiceTexts[Math.floor(Math.random() * dummyVoiceTexts.length)];
    
    // 暫定テキストをシミュレート（文字を徐々に表示）
    let currentText = '';
    let charIndex = 0;
    
    const interimInterval = setInterval(() => {
      if (charIndex < randomText.length && isListening) {
        currentText += randomText[charIndex];
        setInterimTranscript(currentText);
        charIndex++;
      } else {
        clearInterval(interimInterval);
        
        // 1秒後に確定
        setTimeout(() => {
          if (isListening) {
            const newText = record.soapRecord + (record.soapRecord ? '\n' : '') + randomText;
            handleInputChange("soapRecord", newText);
            setInterimTranscript('');
            toast.success("音声を認識しました");
            
            // さらに音声入力を続ける（3-6秒後に次のテキスト）
            const nextDelay = 3000 + Math.random() * 3000;
            recognitionRef.current = setTimeout(() => {
              if (isListening) {
                simulateVoiceInput();
              }
            }, nextDelay);
          }
        }, 1000);
      }
    }, 50); // 50msごとに1文字追加
  };

  // 音声入力の開始/停止（デモ版）
  const toggleVoiceInput = () => {
    if (isListening) {
      // 停止
      if (recognitionRef.current) {
        clearTimeout(recognitionRef.current);
        recognitionRef.current = null;
      }
      setIsListening(false);
      setIsVoiceRecording(false);
      setInterimTranscript('');
      stopAudioAnalysis();
      toast.info("音声入力を停止しました");
    } else {
      // 開始
      setIsListening(true);
      setIsVoiceRecording(true);
      
      // 音声レベルアニメーション開始
      startAudioAnalysis();
      
      toast.success("音声入力を開始しました（デモ版）", {
        duration: 2000
      });
      
      // 1秒後にダミー音声入力開始
      setTimeout(() => {
        if (isListening) {
          simulateVoiceInput();
        }
      }, 1000);
    }
  };

  // コメントの適用
  const applyComment = (comment: { id: string; title: string; content: string }) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart || record.soapRecord.length;
    const beforeCursor = record.soapRecord.substring(0, cursorPos);
    const afterCursor = record.soapRecord.substring(cursorPos);
    
    // コメントを挿入
    const commentText = `\n--- ${comment.title} ---\n${comment.content}\n`;
    const newText = beforeCursor + commentText + afterCursor;
    
    handleInputChange("soapRecord", newText);
    setShowComments(false);
    
    // カーソル位置を調整（挿入したコメントの後ろに移動）
    setTimeout(() => {
      const newCursorPos = cursorPos + commentText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
    
    toast.success(`コメント「${comment.title}」を挿入しました`);
  };

  // Myコメント更新時のハンドラー
  const handleMyCommentsUpdate = (updatedComments: MyComment[]) => {
    setMyComments(updatedComments);
  };

  // テンプレートの適用
  const applyTemplate = (template: typeof soapTemplates[0]) => {
    handleInputChange("soapRecord", template.content);
    setShowTemplates(false);
    toast.success(`${template.name}テンプレートを適用しました`);
  };

  // シェーマを診療記録に挿入
  const handleSchemaInsert = (imageData: string) => {
    const schemaText = `\n\n[シェーマ追加: ${new Date().toLocaleString('ja-JP')}]\n`;
    const newRecord = {
      ...record,
      soapRecord: record.soapRecord + schemaText
    };
    
    onRecordChange(newRecord);
    onRecordEdit?.();
    setIsSchemaDialogOpen(false);
    
    toast.success("シェーマを診療記録に追加しました");
    
    const schemaId = Date.now();
    localStorage.setItem(`schema_${schemaId}`, imageData);
  };

  return (
    <>
      {/* Myコメント管理ダイアログ */}
      <MyCommentManagementDialog
        open={isMyCommentManagementOpen}
        onOpenChange={setIsMyCommentManagementOpen}
        onCommentsUpdate={handleMyCommentsUpdate}
      />

      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>診察記録入力</span>

            {lastSavedTime && (
              <Badge variant="secondary" className="text-xs">
                自動保存: {formatSaveTime(lastSavedTime)}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {selectedRecordId && (
              <Button
                onClick={onNewRecordMode}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Plus className="w-4 h-4 mr-1" />
                新規
              </Button>
            )}
            <Button
              onClick={() => {
                // 一時保存処理
                onSave();
                toast.success("一時保存しました");
              }}
              variant="outline"
              size="sm"
              disabled={!isEditable}
            >
              <Save className="w-4 h-4 mr-1" />
              一時保存
            </Button>
            <Button
              onClick={() => {
                // 確定処理
                onSave();
                toast.success("記録を確定しました");
              }}
              variant="default"
              size="sm"
              disabled={!isEditable}
              className="medical-primary"
            >
              <Check className="w-4 h-4 mr-1" />
              確定
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* 日付入力 */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Label htmlFor="record-date" className="text-sm font-medium">
              記録日付 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="record-date"
              type="date"
              value={record.recordDate}
              onChange={(e) => handleInputChange("recordDate", e.target.value)}
              disabled={!isEditable}
              className="mt-1"
            />
          </div>
        </div>

        {/* SOAP記録入力エリア */}
        <div className="space-y-4 flex-1">
          <div className="flex flex-col space-y-3">
            <Label htmlFor="soap-record" className="text-base font-medium">
              診察記録（SOAP形式） <span className="text-destructive">*</span>
            </Label>
            
            {/* 入力支援ツールバー */}
            <div className="flex items-center space-x-2">
              {/* 音声入力ボタン */}
              <Button
                variant="outline"
                size="sm"
                disabled={!isEditable}
                onClick={toggleVoiceInput}
                className={`${isVoiceRecording ? 'bg-red-50 border-red-300 text-red-600' : 'medical-border-primary hover:medical-bg-primary hover:text-white'}`}
              >
                {isVoiceRecording ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2 animate-pulse" />
                    停止
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    音声
                  </>
                )}
              </Button>

              {/* コメント機能ボタン */}
              <Popover open={showComments} onOpenChange={setShowComments}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!isEditable}
                    className="medical-border-primary hover:medical-bg-primary hover:text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    コメント
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  <div className="p-2 border-b flex items-center justify-between bg-gray-50 dark:bg-gray-900">
                    <span className="text-sm font-medium">コメント選択</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowComments(false);
                        setIsMyCommentManagementOpen(true);
                      }}
                      className="h-7 text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Myコメント管理
                    </Button>
                  </div>
                  <Tabs defaultValue="my" className="w-full">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="my">Myコメント</TabsTrigger>
                      <TabsTrigger value="patient">患者別</TabsTrigger>
                      <TabsTrigger value="department">診療科</TabsTrigger>
                    </TabsList>
                    
                    <ScrollArea className="h-[320px]">
                      {/* Myコメント */}
                      <TabsContent value="my" className="m-0 p-2">
                        <div className="space-y-1">
                          {myComments.map((comment) => (
                            <div
                              key={comment.id}
                              onClick={() => applyComment(comment)}
                              className="p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors border border-transparent hover:border-primary/20"
                            >
                              <div className="flex items-start space-x-2">
                                <MessageSquare className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">{comment.title}</div>
                                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {comment.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      {/* 患者別コメント */}
                      <TabsContent value="patient" className="m-0 p-2">
                        <div className="space-y-1">
                          {patientComments.map((comment) => (
                            <div
                              key={comment.id}
                              onClick={() => applyComment(comment)}
                              className="p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors border border-transparent hover:border-primary/20"
                            >
                              <div className="flex items-start space-x-2">
                                <MessageSquare className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">{comment.title}</div>
                                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {comment.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      {/* 診療科コメント */}
                      <TabsContent value="department" className="m-0 p-2">
                        <div className="space-y-1">
                          {departmentComments.map((comment) => (
                            <div
                              key={comment.id}
                              onClick={() => applyComment(comment)}
                              className="p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors border border-transparent hover:border-primary/20"
                            >
                              <div className="flex items-start space-x-2">
                                <MessageSquare className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">{comment.title}</div>
                                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {comment.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                </PopoverContent>
              </Popover>

              {/* テンプレートボタン */}
              <Popover open={showTemplates} onOpenChange={setShowTemplates}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!isEditable}
                    className="medical-border-primary hover:medical-bg-primary hover:text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    テンプレート
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <Command>
                    <CommandList>
                      <CommandGroup heading="SOAPテンプレート">
                        {soapTemplates.map((template) => (
                          <CommandItem
                            key={template.id}
                            onSelect={() => applyTemplate(template)}
                            className="cursor-pointer"
                          >
                            <FileText className="w-4 h-4 mr-2 text-blue-500" />
                            <div className="flex flex-col">
                              <span className="font-medium">{template.name}</span>
                              <span className="text-xs text-muted-foreground">
                                SOAP形式の{template.name}用テンプレート
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* シェーマボタン */}
              <Dialog open={isSchemaDialogOpen} onOpenChange={setIsSchemaDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!isEditable}
                    className="medical-border-primary hover:medical-bg-primary hover:text-white"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    シェーマ
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl h-[90vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Palette className="w-5 h-5 medical-text-primary" />
                      <span>シェーマ作成</span>
                    </DialogTitle>
                    <DialogDescription>
                      シェーマを作成して診察記録に追加できます。
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex-1 h-[calc(90vh-150px)]">
                    <SchemaCreation
                      isEmbedded={true}
                      onSave={handleSchemaInsert}
                      onCancel={() => setIsSchemaDialogOpen(false)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* 音声録音状態の表示 */}
          {isVoiceRecording && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <Volume2 className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-sm text-red-700">音声入力中... 話してください</span>
                
                {/* 音声レベルインジケーター */}
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 max-w-[200px] h-2 bg-red-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-100"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                  <span className="text-xs text-red-600 font-mono min-w-[40px]">
                    {Math.round(audioLevel)}%
                  </span>
                </div>

                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleVoiceInput}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <MicOff className="w-4 h-4 mr-1" />
                  停止
                </Button>
              </div>
              
              {/* 暫定テキスト表示 */}
              {interimTranscript && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="text-xs text-blue-600 font-medium mt-0.5">認識中:</div>
                    <div className="text-sm text-blue-800 italic flex-1">
                      {interimTranscript}
                      <span className="inline-block w-1 h-4 bg-blue-500 ml-1 animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 音声入力デモ版の説明 */}
          {!isVoiceRecording && (
            <div className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <Volume2 className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-blue-700">
                ※ 音声入力はデモ版です。ボタンを押すとサンプルテキストが自動で挿入されます。
              </span>
            </div>
          )}
          
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              id="soap-record"
              placeholder="SOAP形式で診察記録を記入してください

S (Subjective - 主観的情報):
・主訴：患者の主な訴えや症状
・現病歴：症状の経過、発症時期、程度の変化
・既往歴：過去の病気や手術歴
・家族歴：家族の医療歴
・社会歴：職業、生活習慣、アレルギーなど

O (Objective - 客観的情報):
・バイタルサイン：血圧、脈拍、体温、呼吸数、SpO2
・身体所見：視診、聴診、触診、打診の結果
・検査結果：血液検査、尿検査、画像検査など

A (Assessment - 評価・診断):
・診断名：疑われる疾患名
・病状評価：重症度、進行度の評価
・鑑別診断：除外すべき疾患

P (Plan - 計画・治療方針):
・治療計画：薬物療法、手術、処置など
・処方：薬剤名、用法用量、期間
・今後の方針：経過観察、次回受診、検査予定"
              value={record.soapRecord}
              onChange={(e) => handleInputChange("soapRecord", e.target.value)}
              disabled={!isEditable}
              className="min-h-[500px] font-mono text-sm focus-ring bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}