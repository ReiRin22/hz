import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { FileText, Save, RotateCcw, Mic, MicOff, Clock, User, Lightbulb, BookOpen, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// サブコンポーネントのインポート
import { InputAssistToolbar } from "../layout/InputAssistToolbar";
import { VoiceInputControls } from "../layout/VoiceInputControls";
import { AbbreviationSuggestions } from "../layout/AbbreviationSuggestions";
import { PredictiveTextDisplay } from "../layout/PredictiveTextDisplay";
import { ContextSuggestionsPanel } from "../layout/ContextSuggestionsPanel";
import { GuidelineCheckPanel } from "../layout/GuidelineCheckPanel";
import { LearningInsights } from "../layout/LearningInsights";

// 型定義のインポート
import type { MedicalRecord } from "../../types";

interface MedicalRecordInputProps {
  currentRecord: MedicalRecord;
  onRecordChange: (record: MedicalRecord) => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  patientId: string;
}

export function MedicalRecordInput({
  currentRecord,
  onRecordChange,
  onSave,
  hasUnsavedChanges,
  patientId
}: MedicalRecordInputProps) {
  const [activeSection, setActiveSection] = useState("subjective");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [showAssistPanel, setShowAssistPanel] = useState(true);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [showAbbreviations, setShowAbbreviations] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showLearning, setShowLearning] = useState(false);

  const textareaRefs = {
    subjective: useRef<HTMLTextAreaElement>(null),
    objective: useRef<HTMLTextAreaElement>(null),
    assessment: useRef<HTMLTextAreaElement>(null),
    plan: useRef<HTMLTextAreaElement>(null)
  };

  const handleContentChange = (section: keyof typeof currentRecord.content, value: string) => {
    const updatedRecord = {
      ...currentRecord,
      content: {
        ...currentRecord.content,
        [section]: value
      }
    };
    onRecordChange(updatedRecord);
  };

  const handleVoiceToggle = () => {
    setIsVoiceRecording(!isVoiceRecording);
    if (!isVoiceRecording) {
      toast.info("音声入力を開始しました");
    } else {
      toast.info("音声入力を停止しました");
    }
  };

  const handleTemplateInsert = (template: string) => {
    const currentRef = textareaRefs[activeSection as keyof typeof textareaRefs]?.current;
    if (currentRef) {
      const start = currentRef.selectionStart;
      const end = currentRef.selectionEnd;
      const currentValue = currentRecord.content[activeSection as keyof typeof currentRecord.content] || "";
      const newValue = currentValue.substring(0, start) + template + currentValue.substring(end);
      
      handleContentChange(activeSection as keyof typeof currentRecord.content, newValue);
      
      // カーソル位置を更新
      setTimeout(() => {
        const newCursorPos = start + template.length;
        currentRef.setSelectionRange(newCursorPos, newCursorPos);
        currentRef.focus();
      }, 0);
      
      toast.success("テンプレートを挿入しました");
    }
  };

  const handleReset = () => {
    const resetRecord = {
      ...currentRecord,
      content: {
        subjective: "",
        objective: "",
        assessment: "",
        plan: ""
      }
    };
    onRecordChange(resetRecord);
    toast.info("記録をリセットしました");
  };

  const getSectionProgress = () => {
    const sections = ['subjective', 'objective', 'assessment', 'plan'];
    const completed = sections.filter(section => 
      currentRecord.content[section as keyof typeof currentRecord.content]?.trim()
    ).length;
    return (completed / sections.length) * 100;
  };

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <Card className="glass-effect border-0 shadow-lg bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 medical-primary rounded-xl text-white shadow-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold medical-text-primary">SOAP記録</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    進捗: {Math.round(getSectionProgress())}%
                  </Badge>
                  {hasUnsavedChanges && (
                    <Badge variant="destructive" className="text-xs">
                      未保存
                    </Badge>
                  )}
                </div>
              </div>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAssistPanel(!showAssistPanel)}
                className="flex items-center space-x-2"
              >
                <Lightbulb className="w-4 h-4" />
                <span>入力支援</span>
              </Button>
              
              <Button
                variant="outline" 
                size="sm"
                onClick={handleReset}
                className="flex items-center space-x-2 text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>リセット</span>
              </Button>
              
              <Button 
                onClick={onSave}
                disabled={!hasUnsavedChanges}
                className="medical-primary hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* メイン記録入力エリア */}
        <div className="xl:col-span-3 space-y-4">
          <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardContent className="p-6">
              <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="subjective" className="text-sm">
                    S (主訴)
                  </TabsTrigger>
                  <TabsTrigger value="objective" className="text-sm">
                    O (客観)
                  </TabsTrigger>
                  <TabsTrigger value="assessment" className="text-sm">
                    A (評価)
                  </TabsTrigger>
                  <TabsTrigger value="plan" className="text-sm">
                    P (計画)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="subjective" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center space-x-2">
                      <span>Subjective（主観的情報）</span>
                      <Badge variant="outline" className="text-xs">患者の訴え</Badge>
                    </Label>
                    <Textarea
                      ref={textareaRefs.subjective}
                      placeholder="患者の主訴、症状、痛みの程度、気になることなどを記録してください..."
                      value={currentRecord.content.subjective || ""}
                      onChange={(e) => handleContentChange("subjective", e.target.value)}
                      className="min-h-[200px] focus-ring bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="objective" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center space-x-2">
                      <span>Objective（客観的情報）</span>
                      <Badge variant="outline" className="text-xs">観察・検査所見</Badge>
                    </Label>
                    <Textarea
                      ref={textareaRefs.objective}
                      placeholder="バイタルサイン、身体所見、検査結果、観察事項などを記録してください..."
                      value={currentRecord.content.objective || ""}
                      onChange={(e) => handleContentChange("objective", e.target.value)}
                      className="min-h-[200px] focus-ring bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="assessment" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center space-x-2">
                      <span>Assessment（評価・診断）</span>
                      <Badge variant="outline" className="text-xs">医学的判断</Badge>
                    </Label>
                    <Textarea
                      ref={textareaRefs.assessment}
                      placeholder="診断、病状の評価、推定原因、鑑別診断などを記録してください..."
                      value={currentRecord.content.assessment || ""}
                      onChange={(e) => handleContentChange("assessment", e.target.value)}
                      className="min-h-[200px] focus-ring bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="plan" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center space-x-2">
                      <span>Plan（計画）</span>
                      <Badge variant="outline" className="text-xs">治療・方針</Badge>
                    </Label>
                    <Textarea
                      ref={textareaRefs.plan}
                      placeholder="治療計画、処方、検査指示、経過観察項目、患者指導などを記録してください..."
                      value={currentRecord.content.plan || ""}
                      onChange={(e) => handleContentChange("plan", e.target.value)}
                      className="min-h-[200px] focus-ring bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-4" />

              {/* 入力支援ツールバー */}
              <InputAssistToolbar
                onTemplateInsert={handleTemplateInsert}
                onAbbreviationToggle={() => setShowAbbreviations(!showAbbreviations)}
                onGuidelineToggle={() => setShowGuidelines(!showGuidelines)}
                onLearningToggle={() => setShowLearning(!showLearning)}
                activeSection={activeSection}
              />

              {/* 音声入力コントロール */}
              <VoiceInputControls
                isRecording={isVoiceRecording}
                onToggle={handleVoiceToggle}
                onTextInsert={(text) => handleContentChange(activeSection as keyof typeof currentRecord.content, text)}
              />
            </CardContent>
          </Card>
        </div>

        {/* サイドパネル - 入力支援 */}
        {showAssistPanel && (
          <div className="xl:col-span-1 space-y-4">
            {/* 予測変換表示 */}
            <PredictiveTextDisplay
              predictions={predictions}
              onPredictionSelect={(prediction) => {
                const currentValue = currentRecord.content[activeSection as keyof typeof currentRecord.content] || "";
                handleContentChange(activeSection as keyof typeof currentRecord.content, currentValue + prediction);
              }}
            />

            {/* 略語展開 */}
            {showAbbreviations && (
              <AbbreviationSuggestions
                currentText={currentRecord.content[activeSection as keyof typeof currentRecord.content] || ""}
                onAbbreviationExpand={(expanded) => {
                  const currentValue = currentRecord.content[activeSection as keyof typeof currentRecord.content] || "";
                  handleContentChange(activeSection as keyof typeof currentRecord.content, currentValue + expanded);
                }}
              />
            )}

            {/* コンテキスト提案 */}
            <ContextSuggestionsPanel
              patientId={patientId}
              currentSection={activeSection}
              onSuggestionApply={(suggestion) => {
                handleContentChange(activeSection as keyof typeof currentRecord.content, suggestion);
              }}
            />

            {/* ガイドライン確認 */}
            {showGuidelines && (
              <GuidelineCheckPanel
                currentRecord={currentRecord}
                onRecommendationApply={(recommendation) => {
                  toast.success("推奨事項を適用しました");
                }}
              />
            )}

            {/* 学習インサイト */}
            {showLearning && (
              <LearningInsights
                patientId={patientId}
                currentRecord={currentRecord}
                onInsightApply={(insight) => {
                  toast.success("インサイトを適用しました");
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}