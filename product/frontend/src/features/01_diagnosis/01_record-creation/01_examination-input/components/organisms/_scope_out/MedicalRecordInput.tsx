import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Textarea } from "./ui/textarea";
import { Input } from "@/shared/components/atoms/input";
import { Label } from "@/shared/components/atoms/label";
import { Button } from "@/shared/components/atoms/button";
import { Badge } from "@/shared/components/atoms/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/atoms/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/atoms/command";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Separator } from "@/shared/components/atoms/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
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
  Volume2,
  X,
  FolderOpen,
  Trash2,
  Clock
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import REC002Page from "../../01_schema-creation";
import { SetQuickAccess } from "./SetQuickAccess";
import { MyCommentManagementDialog, type MyComment, loadCommentsFromStorage } from "./MyCommentManagementDialog";
import { TextFormattingToolbar } from "./TextFormattingToolbar";
import { RichTextEditor, type RichTextEditorRef } from "./RichTextEditor";
import { DraggableCommentPopup } from "./DraggableCommentPopup";
import { toast } from 'sonner';

import type { RegisteredSet, SetApplyOptions } from "../types/set-registration-types";
import { saveDraft, loadDrafts, deleteDraft, type DraftRecord } from "../src/utils/draft-storage";

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
  onConfirm?: (record: any) => void;  // 新規追加時のコールバック
  onUpdate?: (recordId: string, record: any) => void;  // 更新時のコールバック
  isEditable: boolean;
  onNewRecordMode?: () => void;
  selectedRecordId?: string;
  recordCreatedDate?: string; // 既存記録の作成日時（ISO 8601形式）
  editablePeriodDays?: number; // 編集可能期間（日数、デフォルト30日）
  onRecordEdit?: () => void;
  onSetApply?: (set: RegisteredSet, options: SetApplyOptions) => void;
  onSetManagementOpen?: () => void;
  currentUser?: { id: string; name: string };
  currentPatientId?: string;
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

// コメントデータ（患者別コメント - 特定患者用）
const patientComments = [
  { id: 'pt1', content: 'ペニシリン系抗生剤: アナフィラキシー既往\n代替薬: セフェム系を使用' },
  { id: 'pt2', content: '心筋梗塞後: 2022年3月\n冠動脈ステント留置済み（LAD）\n抗血小板薬2剤併用中' },
  { id: 'pt3', content: '時々内服忘れあり\n次回来院時に服薬カレンダー提案' },
  { id: 'pt4', content: '独居、キーパーソン: 長女\n訪問看護導入検討中' },
  { id: 'pt5', content: 'HbA1c: 7.5→7.2→6.8%（改善傾向）\nLDL-C: 目標値達成' },
];

// コメントデータ（診療科コメント - 科全体の共有情報）
const departmentComments = [
  { id: 'dept1', content: 'HbA1c目標: <7.0%（高齢者は<7.5%）\n低血糖リスクに注意' },
  { id: 'dept2', content: '降圧目標: <130/80 mmHg\n75歳以上: <140/90 mmHg' },
  { id: 'dept3', content: 'LDL-C目標: 一次予防<120, 二次予防<100\nスタチン導入基準' },
  { id: 'dept4', content: 'PT-INR目標範囲の確認\n出血リスク評価必須' },
  { id: 'dept5', content: '定期検査セット: CBC, 生化学, HbA1c\n3ヶ月毎フォロー' },
];

// 記載者データ
const recorders = [
  { id: 'doc0', name: '田中 一郎', role: '医師' }, // ログインユーザー
  { id: 'doc1', name: '山田 太郎', role: '医師' },
  { id: 'doc2', name: '佐藤 花子', role: '医師' },
  { id: 'doc3', name: '田中 次郎', role: '医師' },
  { id: 'nurse1', name: '鈴木 美咲', role: '看護師' },
  { id: 'nurse2', name: '高橋 健太', role: '看護師' },
  { id: 'clerk1', name: '伊藤 愛美', role: '医療事務' },
];

export function MedicalRecordInput({
  record,
  onRecordChange,
  onSave,
  onConfirm,
  onUpdate,
  isEditable,
  onNewRecordMode,
  selectedRecordId,
  recordCreatedDate,
  editablePeriodDays = 30,
  onRecordEdit,
  onSetApply,
  onSetManagementOpen,
  currentUser,
  currentPatientId
}: MedicalRecordInputProps) {
  // 編集可能期間チェック
  const isWithinEditablePeriod = () => {
    // 新規入力モード（記録未選択）の場合は常に編集可能
    if (!selectedRecordId || !recordCreatedDate) {
      return true;
    }

    // 記録作成日時と現在日時を比較
    const createdDate = new Date(recordCreatedDate);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    return diffInDays <= editablePeriodDays;
  };

  // 実際の編集可否（isEditableと編集可能期間の両方を考慮）
  const actuallyEditable = isEditable && isWithinEditablePeriod();

  // 編集可能期間超過時の通知（初回のみ）
  useEffect(() => {
    if (selectedRecordId && recordCreatedDate && isEditable && !isWithinEditablePeriod()) {
      toast.warning("編集可能期間を超過しています", {
        description: `この記録は編集可能期間（${editablePeriodDays}日）を超過しているため、閲覧のみ可能です。`,
      });
    }
  }, [selectedRecordId, recordCreatedDate, isEditable, editablePeriodDays]);

  // UI状態管理
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSchemaDialogOpen, setIsSchemaDialogOpen] = useState(false);
  const [schemaPosition, setSchemaPosition] = useState({ x: 100, y: 100 });
  const [isSchemasDragging, setIsSchemasDragging] = useState(false);
  const [schemaDragOffset, setSchemaDragOffset] = useState({ x: 0, y: 0 });
  const schemaPopupRef = useRef<HTMLDivElement>(null);
  const [isMyCommentManagementOpen, setIsMyCommentManagementOpen] = useState(false);
  const [myComments, setMyComments] = useState<MyComment[]>([]);
  const [showComments, setShowComments] = useState(false);
  
  // テキスト入力関連
  const [autoCompleteWords, setAutoCompleteWords] = useState<string[]>([]);
  const [prediction, setPrediction] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  
  // 音声入力関連
  const [isRecording, setIsRecording] = useState(false);
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  
  // その他
  const [selectedWriter, setSelectedWriter] = useState("山田太郎");
  const [selectedRecorder, setSelectedRecorder] = useState("doc0");
  const [recordDate, setRecordDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [drafts, setDrafts] = useState<DraftRecord[]>([]);
  const [showDraftsDropdown, setShowDraftsDropdown] = useState(false);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const richTextEditorRef = useRef<RichTextEditorRef>(null);
  const soapContainerRef = useRef<HTMLDivElement>(null); // SOAPコンテナのref

  // LocalStorageからMyコメントを読み込む
  useEffect(() => {
    const loadedComments = loadCommentsFromStorage();
    setMyComments(loadedComments);
  }, []);

  // 下書き一覧を読み込む
  useEffect(() => {
    if (currentUser && currentPatientId) {
      const loaded = loadDrafts(currentUser.id, currentPatientId);
      setDrafts(loaded);
    }
  }, [currentUser, currentPatientId]);

  // 一時保存ハンドラー
  const handleTempSave = () => {
    if (!currentUser || !currentPatientId) {
      toast.error("ユーザー情報または患者情報が取得できません");
      return;
    }

    saveDraft(currentUser.id, currentPatientId, {
      recordDate: record.recordDate,
      soapRecord: record.soapRecord,
      vitalSigns: record.vitalSigns
    });

    // 下書き一覧を再読み込み
    const updated = loadDrafts(currentUser.id, currentPatientId);
    setDrafts(updated);

    onSave();
    toast.success("一時保存しました（下書き）");
  };

  // 確定ハンドラー
  const handleConfirmSave = () => {
    if (!currentUser || !currentPatientId) {
      toast.error("ユーザー情報または患者情報が取得できません");
      return;
    }

    // SOAP記録が空の場合は何も処理しない
    if (!record.soapRecord || record.soapRecord.trim() === "") {
      toast.warning("診察記録が入力されていません");
      return;
    }

    // E001: 記載日が未来日でないか検証
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(record.recordDate);
    inputDate.setHours(0, 0, 0, 0);
    if (inputDate > today) {
      setConfirmError("記載日は未来日を指定できません。正しい日付を入力してください。");
      return;
    }

    // E002: 禁則文字（<>）が含まれていないか検証
    if (/[<>]/.test(record.soapRecord)) {
      setConfirmError("診療記録本文に不正な文字が含まれています。＜＞などの特殊文字は使用できません。");
      return;
    }

    setConfirmError(null);
    setIsConfirmDisabled(true);

    const selectedRecorderInfo = recorders.find(r => r.id === selectedRecorder);
    const recordData = {
      ...record,
      type: "progress", // デフォルトの記録タイプを設定
      title: record.soapRecord.split('\n')[0].substring(0, 50) || "診察記録", // 最初の行をタイトルとして使用（最大50文字）
      content: record.soapRecord, // SOAP記録全体をcontentとして保存
      author: selectedRecorderInfo?.name || currentUser.name,
      department: "診療科", // 必要に応じて動的に設定
      isImportant: false, // デフォルトでは重要フラグをオフ
    };

    // 既存記録の編集か新規追加かを判定
    try {
      if (selectedRecordId && onUpdate) {
        onUpdate(selectedRecordId, recordData);
        toast.success("記録を更新しました");
        if (onNewRecordMode) {
          onNewRecordMode();
        }
        onRecordChange({
          recordDate: new Date().toISOString().slice(0, 10),
          soapRecord: "",
          vitalSigns: {
            bloodPressure: "",
            pulse: "",
            temperature: "",
            respiratoryRate: "",
            oxygenSaturation: "",
          },
        });
      } else if (onConfirm) {
        onConfirm(recordData);
        onRecordChange({
          recordDate: new Date().toISOString().slice(0, 10),
          soapRecord: "",
          vitalSigns: {
            bloodPressure: "",
            pulse: "",
            temperature: "",
            respiratoryRate: "",
            oxygenSaturation: "",
          },
        });
        toast.success("記録を確定しました");
      }
    } catch {
      // APIエラー時のみ確定ボタンを再活性化
      setIsConfirmDisabled(false);
      toast.error("確定処理に失敗しました。再度お試しください。");
    }
  };

  // 下書きから復元
  const handleLoadDraft = (draft: DraftRecord) => {
    onRecordChange({
      recordDate: draft.recordDate,
      soapRecord: draft.soapRecord,
      vitalSigns: draft.vitalSigns
    });

    setShowDraftsDropdown(false);
    toast.success("下書きを復元しました");
  };

  // 下書きを削除
  const handleDeleteDraft = (draftId: string) => {
    if (!currentUser || !currentPatientId) return;

    deleteDraft(currentUser.id, currentPatientId, draftId);
    
    // 下書き一覧を再読み込み
    const updated = loadDrafts(currentUser.id, currentPatientId);
    setDrafts(updated);

    toast.success("下書きを削除しました");
  };

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

  // ダミー音声入力のサンプ���テキスト
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
    const trimmedValue = field === 'soapRecord' && value.length > 1000
      ? value.slice(0, 1000)
      : value;
    const newRecord = { ...record, [field]: trimmedValue };
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
  const applyComment = (comment: { id: string; content: string }) => {
    // コメントを挿入
    const commentText = `\n${comment.content}\n`;
    
    // RichTextEditorにテキストを挿入
    if (richTextEditorRef.current) {
      richTextEditorRef.current.insertText(commentText);
      richTextEditorRef.current.focus();
    }
    
    toast.success(`コメントを挿入しました`);
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
    // シェーマIDを生成してLocalStorageに保存
    const schemaId = Date.now();
    localStorage.setItem(`schema_${schemaId}`, imageData);
    
    // リッチテキストエディタのカーソル位置にシェーマを挿入
    if (richTextEditorRef.current) {
      richTextEditorRef.current.insertSchema(schemaId);
    }
    
    setIsSchemaDialogOpen(false);
    toast.success("シェーマをカーソル位置に挿入しました");
  };

  // シェーマポップアップ ドラッグ
  const handleSchemaDragStart = (e: React.MouseEvent) => {
    if (schemaPopupRef.current) {
      const rect = schemaPopupRef.current.getBoundingClientRect();
      setSchemaDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsSchemasDragging(true);
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isSchemasDragging) {
        setSchemaPosition({ x: e.clientX - schemaDragOffset.x, y: e.clientY - schemaDragOffset.y });
      }
    };
    const onUp = () => setIsSchemasDragging(false);
    if (isSchemasDragging) {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    }
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isSchemasDragging, schemaDragOffset]);

  // 文字装飾の適用
  const handleFormatApply = (formatType: string) => {
    // リッチテキストエディタに委譲
    if (richTextEditorRef.current) {
      richTextEditorRef.current.applyFormat(formatType);
    }
  };

  return (
    <>
      {/* Myコメント管理ダイアログ */}
      <MyCommentManagementDialog
        open={isMyCommentManagementOpen}
        onOpenChange={setIsMyCommentManagementOpen}
        onCommentsUpdate={handleMyCommentsUpdate}
      />

      {/* ドラッグ可能なシェーマポップアップ */}
      {isSchemaDialogOpen && (
        <div
          ref={schemaPopupRef}
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-2xl flex flex-col overflow-auto"
          style={{
            left: schemaPosition.x,
            top: schemaPosition.y,
            width: "900px",
            height: "640px",
            minWidth: "480px",
            minHeight: "360px",
            resize: "both",
            cursor: isSchemasDragging ? "grabbing" : "default",
          }}
        >
          {/* タイトルバー（ドラッグハンドル） */}
          <div
            className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b rounded-t-lg cursor-grab select-none"
            onMouseDown={handleSchemaDragStart}
          >
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">シェーマ作成</span>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 p-1 rounded"
              onClick={() => setIsSchemaDialogOpen(false)}
            >
              ✕
            </button>
          </div>
          {/* REC002 コンテンツ */}
          <div className="flex-1 overflow-hidden">
            <REC002Page
              onSave={(imageData) => handleSchemaInsert(imageData)}
              onCancel={() => setIsSchemaDialogOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ドラッグ可能なコメントポップアップ */}
      <DraggableCommentPopup
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        myComments={myComments}
        patientComments={patientComments}
        departmentComments={departmentComments}
        onCommentSelect={applyComment}
        onMyCommentManagementOpen={() => setIsMyCommentManagementOpen(true)}
        soapContainerRef={soapContainerRef}
      />

      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>記録入力</span>
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
              onClick={handleTempSave}
              variant="outline"
              size="sm"
              disabled={!actuallyEditable}
            >
              <Save className="w-4 h-4 mr-1" />
              一時保存
            </Button>
            <Button
              onClick={handleConfirmSave}
              variant="default"
              size="sm"
              disabled={!actuallyEditable || isConfirmDisabled}
              className="medical-primary"
            >
              <Check className="w-4 h-4 mr-1" />
              確定
            </Button>
          </div>
        </div>
        {confirmError && (
          <p className="text-sm text-red-600 mt-1">{confirmError}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* 日付と記載者入力 */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Label htmlFor="record-date" className="text-sm font-medium">
              記載日
            </Label>
            <Input
              id="record-date"
              type="date"
              value={record.recordDate}
              onChange={(e) => {
                // 空文字列の場合は変更を無視（削除を防ぐ）
                if (e.target.value) {
                  handleInputChange("recordDate", e.target.value);
                }
              }}
              disabled={!actuallyEditable}
              required
              className="mt-1 [&::-webkit-clear-button]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>
          
          <div className="flex-1">
            <Label htmlFor="recorder" className="text-sm font-medium">
              記載者
            </Label>
            <Select 
              value={selectedRecorder} 
              onValueChange={setSelectedRecorder}
              disabled={!actuallyEditable}
            >
              <SelectTrigger id="recorder" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>医師</SelectLabel>
                  <SelectItem value="doc0">田中 一郎</SelectItem>
                  <SelectItem value="doc1">山田 太郎</SelectItem>
                  <SelectItem value="doc2">佐藤 花子</SelectItem>
                  <SelectItem value="doc3">田中 次郎</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>看護師</SelectLabel>
                  <SelectItem value="nurse1">鈴木 美咲</SelectItem>
                  <SelectItem value="nurse2">高橋 健太</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>医療事務</SelectLabel>
                  <SelectItem value="clerk1">伊藤 愛美</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* SOAP記録入力エリア */}
        <div className="space-y-4 flex-1" ref={soapContainerRef}>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="soap-record" className="text-base font-medium">
                診察記録（SOAP形式）
              </Label>
              
              {/* 下書き復元ドロップダウン */}
              {drafts.length > 0 && (
                <Popover open={showDraftsDropdown} onOpenChange={setShowDraftsDropdown}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <FolderOpen className="w-3 h-3 mr-1" />
                      下書き ({drafts.length}件)
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-2" align="end">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                        保存された下書き
                      </div>
                      <Separator />
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-1">
                          {drafts.map((draft) => (
                            <div
                              key={draft.id}
                              className="flex items-start gap-2 p-2 hover:bg-accent rounded-md group"
                            >
                              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleLoadDraft(draft)}>
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(draft.savedAt).toLocaleString('ja-JP', {
                                      year: 'numeric',
                                      month: 'numeric',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm line-clamp-2">
                                  {draft.soapRecord.substring(0, 100)}
                                  {draft.soapRecord.length > 100 && '...'}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDraft(draft.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            
            {/* 入力支援ツールバー */}
            <div className="flex items-center space-x-2">
              {/* 音声入力ボタン */}
              <Button
                variant="outline"
                size="sm"
                disabled={!actuallyEditable}
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
              <Button
                variant="outline"
                size="sm"
                disabled={!actuallyEditable}
                onClick={() => setShowComments(true)}
                className="medical-border-primary hover:medical-bg-primary hover:text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                コメント
              </Button>

              {/* テンプレートボタン */}
              <Popover open={showTemplates} onOpenChange={setShowTemplates}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!actuallyEditable}
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
              <Button
                variant="outline"
                size="sm"
                disabled={!actuallyEditable}
                className="medical-border-primary hover:medical-bg-primary hover:text-white"
                onClick={() => setIsSchemaDialogOpen(true)}
              >
                <Palette className="w-4 h-4 mr-2" />
                シェーマ
              </Button>
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

          {/* 文字装飾ツールバー */}
          <TextFormattingToolbar
            onFormatApply={handleFormatApply}
            disabled={!actuallyEditable}
            activeFormats={activeFormats}
          />
          
          {/* ッチテキストエディタ */}
          <div className="relative flex-1">
            <RichTextEditor
              ref={richTextEditorRef}
              value={record.soapRecord}
              onChange={(value) => handleInputChange("soapRecord", value)}
              onActiveFormatsChange={setActiveFormats}
              disabled={!actuallyEditable}
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
            />
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}