import { Clock, User, LogOut, Bell, Settings, AlertTriangle, Timer, Eye, EyeOff, GripVertical, ChevronDown, ChevronRight, ChevronUp, Save, StickyNote, Plus, X, Edit2, Check, FileText, Info, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@shared/components/atoms/button";
import { Badge } from "@shared/components/atoms/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@shared/components/atoms/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@shared/components/atoms/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@shared/components/atoms/tooltip";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import { Card, CardContent } from "@shared/components/atoms/card";
import { toast } from "sonner";
import type { CurrentUser, UserAlert } from "@/shared/types/user-header/patient-types";
import { SettingsPanel } from "./SettingsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/atoms/tabs";
import { Label } from "@shared/components/atoms/label";
import { RadioGroup, RadioGroupItem } from "@shared/components/atoms/radio-group";
import { Input } from "@shared/components/atoms/input";
import { Textarea } from "@shared/components/atoms/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@shared/components/atoms/collapsible";

interface GlobalHeaderProps {
  currentUser: CurrentUser;
  userAlerts: UserAlert[];
  onDismissAlert?: (alertId: string) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  autoSaveEnabled: boolean;
  onAutoSaveToggle: () => void;
  onAutoSave: () => void;
  alertsEnabled: boolean;
  onAlertsToggle: () => void;
  // 自動ログアウト関連
  autoLogoutEnabled?: boolean;
  onAutoLogoutToggle?: () => void;
  autoLogoutTimeout?: number; // 分単位
  onAutoLogoutTimeoutChange?: (minutes: number) => void;
  autoLogoutWarningTime?: number; // 秒単位
  isAutoLogoutWarningVisible?: boolean;
  autoLogoutRemainingTime?: number;
  onExtendSession?: () => void;
  onLogout?: () => void;
  // テーマカラー関連
  themeColor?: string;
  onThemeColorChange?: (color: string) => void;
}

export function GlobalHeader({
  currentUser,
  userAlerts,
  onDismissAlert,
  darkMode,
  onDarkModeToggle,
  autoSaveEnabled,
  onAutoSaveToggle,
  onAutoSave,
  alertsEnabled,
  onAlertsToggle,
  // 自動ログアウト関連
  autoLogoutEnabled = false,
  onAutoLogoutToggle,
  autoLogoutTimeout = 30,
  onAutoLogoutTimeoutChange,
  autoLogoutWarningTime = 60,
  isAutoLogoutWarningVisible = false,
  autoLogoutRemainingTime = 0,
  onExtendSession,
  onLogout,
  // テーマカラー関連
  themeColor = "blue",
  onThemeColorChange
}: GlobalHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isManualLogoutDialogOpen, setIsManualLogoutDialogOpen] = useState(false);
  const [isMenuSettingsOpen, setIsMenuSettingsOpen] = useState(false);
  const [tempColorTheme, setTempColorTheme] = useState(themeColor);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  
  // パスワード変更用state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // 左サイドメニュー編集用state
  const [menuItems, setMenuItems] = useState([
    { id: 'chart', label: 'カルテ', description: '診療記録・SOAP記録', visible: true },
    { id: 'orders', label: 'オーダー', description: '処方・注射・検査等', visible: true },
    { id: 'labTransfer', label: '検査結果', description: '検査結果送受信', visible: true },
    { id: 'patientInfo', label: '患者情報', description: '基本情報・病名・薬歴', visible: true },
    { id: 'patientList', label: '患者一覧', description: '患者検索・一覧表示', visible: true },
    { id: 'documents', label: '文書', description: '診断書・紹介状・処方箋', visible: true },
    { id: 'labSchedule', label: '検査予約', description: '検査スケジュール管理', visible: true },
    { id: 'appointmentSchedule', label: '診療予約', description: '診療スケジュール管理', visible: true },
    { id: 'menu', label: 'メニュー', description: 'その他機能メニュー', visible: true },
    { id: 'sets', label: 'セット', description: 'セット登録・管理', visible: true },
  ]);
  
  const [orderItems, setOrderItems] = useState([
    { id: 'prescription', label: '処方オーダー', visible: true },
    { id: 'injection', label: '注射オーダー', visible: true },
    { id: 'specimen', label: '検体オーダー', visible: true },
    { id: 'treatment', label: '処置オーダー', visible: true },
    { id: 'guidance', label: '指導オーダー', visible: true },
    { id: 'physiology', label: '生理検査オーダー', visible: true },
    { id: 'endoscopy', label: '内視鏡検査オーダー', visible: true },
    { id: 'imaging', label: '画像検査オーダー', visible: true },
    { id: 'pathology', label: '病理検査オーダー', visible: true },
    { id: 'bacteriology', label: '細菌検査オーダー', visible: true },
    { id: 'general', label: '汎用オーダー', visible: true },
    { id: 'composite', label: '複合オーダー', visible: true },
    { id: 'meal', label: '食事オーダー', visible: true },
    { id: 'rehabilitation', label: 'リハビリオーダー', visible: true },
    { id: 'transfusion', label: '輸血オーダー', visible: true },
    { id: 'surgery', label: '手術オーダー', visible: true },
    { id: 'dialysis', label: '透析オーダー', visible: true },
    { id: 'admission', label: '入院オーダー', visible: true },
    { id: 'discharge', label: '退院オーダー', visible: true },
    { id: 'transfer', label: '転棟転科転室オーダー', visible: true },
    { id: 'nursing', label: '看護ケアオーダー', visible: true },
  ]);
  
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOrderIndex, setDraggedOrderIndex] = useState<number | null>(null);
  
  // 一時保存データの状態
  const [isTempDataOpen, setIsTempDataOpen] = useState(false);
  const [tempDataCount, setTempDataCount] = useState(3); // モックデータ: 一時保存件数
  const [selectedTempData, setSelectedTempData] = useState<string[]>([]);
  const [tempDataList, setTempDataList] = useState([
    {
      id: "temp-1",
      patientName: "吉田 目子",
      hoursAgo: "2時間前",
      inputBy: "看護師 佐藤",
      category: "外来カルテ",
      detail: "診察所見入力途中"
    },
    {
      id: "temp-2",
      patientName: "高木 大輔",
      hoursAgo: "4時間前",
      inputBy: "看護師 森本",
      category: "処方オーダー",
      detail: "薬剤選択途中"
    },
    {
      id: "temp-3",
      patientName: "吉田 春香",
      hoursAgo: "6時間前",
      inputBy: "看護師 高橋",
      category: "検査オーダー",
      detail: "血液検査選択中"
    }
  ]);
  
  // 付箋の状態
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [stickyNotesCount, setStickyNotesCount] = useState(4); // モックデータ: 付箋件数
  const [stickyNotes, setStickyNotes] = useState([
    {
      id: "note-1",
      title: "患者対応確認",
      content: "山田太郎様の次回診察時、血圧測定を確認",
      createdAt: "2025/12/12 10:30",
      color: "yellow"
    },
    {
      id: "note-2",
      title: "カンファレンス",
      content: "12/15 14:00 病棟カンファレンス",
      createdAt: "2025/12/11 16:00",
      color: "blue"
    },
    {
      id: "note-3",
      title: "処方変更",
      content: "佐藤花子様の降圧剤を次回から変更予定",
      createdAt: "2025/12/10 09:15",
      color: "pink"
    },
    {
      id: "note-4",
      title: "検査予定",
      content: "田中一郎様のCT検査血糖値確認待ち",
      createdAt: "2025/12/09 11:00",
      color: "green"
    }
  ]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  
  // ログアウト警告ダイアログの状態
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);

  // ダミーデータ：1つ目のヘッダー用（通常の未承認のみ）
  const header1ApprovalData = {
    normal: 3,  // 通常の未承認
    overdue: 0  // 24時間超え
  };

  // ダミーデータ：2つ目のヘッダー用（24時間超えを含む）
  const header2ApprovalData = {
    normal: 2,  // 通常の未承認
    overdue: 1  // 24時間超え
  };

  // ダミーデータ：3つ目のヘッダー用（看護師・差し戻し）
  const header3RejectionData = {
    normal: 1,  // 通常の差し戻し
    overdue: 0  // 24時間超え
  };

  // ダミーデータ：看護師ユーザー情報
  const nurseUser = {
    id: "N0012",
    name: "佐藤 花子",
    role: "看護師",
    department: "内科病棟",
    loginTime: "08:30"
  };

  // 現在時刻の更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 日付フォーマット
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${year}年${month}月${day}日 (${dayOfWeek})`;
  };

  // 時刻フォーマット
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // ログアウト処理
  const handleLogout = () => {
    toast.success('ログアウトしました');
    if (onLogout) {
      onLogout();
    }
    console.log('ログアウトが実行されました');
  };

  // 未読アラート数を計算
  const unreadAlertsCount = userAlerts.filter(alert => !alert.dismissed).length;

  // 時間フォーマット（mm:ss）
  const formatRemainingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // パスワード条件をすべて満たしているかチェック
  const isPasswordValid = 
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;
  
  // パスワード条件を満たした時に自動的に変更を実行
  useEffect(() => {
    if (isPasswordValid) {
      // 少し遅延させてユーザーが確認できるようにする
      const timer = setTimeout(() => {
        toast.success('パスワードを変更しました');
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isPasswordValid]);
  
  // メニュー設定ダイアログを閉じる時のリセット処理
  const handleMenuSettingsClose = (open: boolean) => {
    setIsMenuSettingsOpen(open);
    if (!open) {
      // ダイアログを閉じる時にパスワードフィールドをリセット
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setTempColorTheme(themeColor);
    }
  };
  
  // テーマカラー保存処理
  const handleThemeColorSave = () => {
    if (onThemeColorChange) {
      onThemeColorChange(tempColorTheme);
      toast.success('テーマカラーを保存しました');
      handleMenuSettingsClose(false);
    }
  };
  
  // チェックボックスのトグル処理
  const handleToggleTempData = (id: string) => {
    setSelectedTempData(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 一時保存データの読み込み処理
  const handleLoadTempData = () => {
    if (selectedTempData.length === 0) {
      toast.error("読み込むデータを選択してください");
      return;
    }
    toast.success(`${selectedTempData.length}件のデータを読み込みました`);
    setTempDataList(prev => prev.filter(item => !selectedTempData.includes(item.id)));
    setTempDataCount(prev => prev - selectedTempData.length);
    setSelectedTempData([]);
    setIsTempDataOpen(false);
  };

  // 一時保存データの保存処理（継続保存）
  const handleSaveTempData = () => {
    toast.success("一時保存データを保持しました");
    setIsTempDataOpen(false);
  };
  
  // 付箋の削除処理
  const handleDeleteNote = (id: string) => {
    toast.success("付箋を削除しました");
    setStickyNotes(prev => prev.filter(note => note.id !== id));
    setStickyNotesCount(prev => prev - 1);
  };
  
  // 付箋の編集開始
  const handleStartEditNote = (note: any) => {
    setEditingNoteId(note.id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
  };
  
  // 付箋の編集保存
  const handleSaveEditNote = () => {
    if (!editingNoteId) return;
    
    setStickyNotes(prev => prev.map(note => 
      note.id === editingNoteId 
        ? { ...note, title: editingTitle, content: editingContent }
        : note
    ));
    setEditingNoteId(null);
    setEditingTitle("");
    setEditingContent("");
    toast.success("付箋を更新しました");
  };
  
  // 付箋の編集キャンセル
  const handleCancelEditNote = () => {
    setEditingNoteId(null);
    setEditingTitle("");
    setEditingContent("");
  };
  
  // 新しい付箋を追加
  const handleAddNote = () => {
    const colors = ["yellow", "blue", "pink", "green"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const now = new Date();
    const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newNote = {
      id: `note-${Date.now()}`,
      title: "新しい付箋",
      content: "ここに内容を入力してください",
      createdAt: formattedDate,
      color: randomColor
    };
    
    setStickyNotes(prev => [newNote, ...prev]);
    setStickyNotesCount(prev => prev + 1);
    setEditingNoteId(newNote.id);
    setEditingTitle(newNote.title);
    setEditingContent(newNote.content);
    toast.success("新しい付箋を追加しました");
  };
  
  // メニュー項目のドラッグ&ドロップハンドラー
  const handleMenuDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  const handleMenuDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newItems = [...menuItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setMenuItems(newItems);
    setDraggedIndex(index);
  };
  
  const handleMenuDragEnd = () => {
    setDraggedIndex(null);
  };
  
  // オーダー項目のドラッグ&ドロップハンドラー
  const handleOrderDragStart = (index: number) => {
    setDraggedOrderIndex(index);
  };
  
  const handleOrderDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedOrderIndex === null || draggedOrderIndex === index) return;
    
    const newItems = [...orderItems];
    const draggedItem = newItems[draggedOrderIndex];
    newItems.splice(draggedOrderIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setOrderItems(newItems);
    setDraggedOrderIndex(index);
  };
  
  const handleOrderDragEnd = () => {
    setDraggedOrderIndex(null);
  };
  
  // メニュー項目を上下に移動する関数
  const moveMenuItemUp = (index: number) => {
    if (index === 0) return; // 最初の項目は上に移動できない
    const newItems = [...menuItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setMenuItems(newItems);
  };
  
  const moveMenuItemDown = (index: number) => {
    if (index === menuItems.length - 1) return; // 最後の項目は下に移動できない
    const newItems = [...menuItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setMenuItems(newItems);
  };
  
  // オーダー項目を上下に移動する関数
  const moveOrderItemUp = (index: number) => {
    if (index === 0) return; // 最初の項目は上に移動できない
    const newItems = [...orderItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setOrderItems(newItems);
  };
  
  const moveOrderItemDown = (index: number) => {
    if (index === orderItems.length - 1) return; // 最後の項目は下に移動できない
    const newItems = [...orderItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setOrderItems(newItems);
  };

  return (
    <>
      <header className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center">
        {/* ロゴ・システム名 */}
        <div className="flex items-center">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            Harz
            {autoLogoutEnabled && (
              <Badge variant="outline" className="ml-2 text-xs">
                自動ログアウト有効
              </Badge>
            )}
          </h1>
        </div>

        {/* ユーザー情報・時刻表示 */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 ml-8">
          {/* ログインユーザー情報 */}
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md">
            <User className="h-4 w-4" />
            <span className="font-medium">{currentUser.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ID: {currentUser.id}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser.role}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser.department}
            </span>
            {/* <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ログイン: {currentUser.loginTime}
            </span> */}
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              HPKI: 残り12時間45分
            </span>
          </div>
        </div>

        {/* 代行入力未承認数 */}
        <div className="ml-auto mr-4 flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-md border border-amber-200 dark:border-amber-800">
          <Badge className="bg-amber-500 text-white animate-pulse">
            未承認
          </Badge>
          <span className="font-bold text-amber-700 dark:text-amber-400 text-lg animate-pulse">
            {header1ApprovalData.normal}
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-500">件</span>
        </div>

        {/* アラート・設定・ログアウトボタン */}
        <div className="flex items-center gap-3">
          <TooltipProvider>
            {/* 付箋ボタン */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  onClick={() => setIsNotesOpen(true)}
                >
                  <StickyNote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>付箋</p>
              </TooltipContent>
            </Tooltip>

            {/* 付箋ダイアログコンテンツは3つ目のヘッダーで一元管理 */}

            {/* 一時保存データボタン */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  onClick={() => setIsTempDataOpen(true)}
                >
                  <Save className="h-4 w-4" />
                  {tempDataCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                      {tempDataCount > 99 ? '99+' : tempDataCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>一時保存データ {tempDataCount > 0 && `(${tempDataCount})`}</p>
              </TooltipContent>
            </Tooltip>

            {/* 一時保存ダイアログコンテンツは3つ目のヘッダーで一元管理 */}

            {/* アラートボタン */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  onClick={() => setIsAlertsOpen(true)}
                >
                  <Bell className="h-4 w-4" />
                  {unreadAlertsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {unreadAlertsCount > 99 ? '99+' : unreadAlertsCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>アラート {unreadAlertsCount > 0 && `(${unreadAlertsCount})`}</p>
              </TooltipContent>
            </Tooltip>

            {/* 通知ダイアログコンテンツは3つ目のヘッダーで一元管理 */}

            {/* 設定ボタン */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>メニュー設定</p>
              </TooltipContent>
            </Tooltip>

            {/* メニュー設定ダイアログは3つ目のヘ���ダーで一元管理 */}

            {/* ログアウトボタン */}
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ログアウト</p>
                </TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ログアウト確認</AlertDialogTitle>
                  <AlertDialogDescription>
                    ログアウトしますか？保存されていないデータは失われる可能性があります。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowLogoutWarning(true)}>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">ログアウト</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TooltipProvider>
        </div>
      </header>

      {/* ログアウト警告ダイアログ */}
      <AlertDialog open={showLogoutWarning} onOpenChange={setShowLogoutWarning}>
        <AlertDialogContent className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
              <AlertDialogTitle className="text-yellow-900 dark:text-yellow-100">ログアウト警告</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-yellow-800 dark:text-yellow-200">
              あと1分後に自動ログアウトされます。セッションを延長する場合は「セッション延長」ボタンをクリックしてください。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowLogoutWarning(false);
              toast.success("セッションを延長しました");
            }} className="bg-blue-600 hover:bg-blue-700">
              セッション延長
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2つ目のヘッダー（コピー） */}
      <header className="hidden h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center">
        {/* ロゴ・システム名 */}
        <div className="flex items-center">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            Harz
            {autoLogoutEnabled && (
              <Badge variant="outline" className="ml-2 text-xs">
                自動ログアウト有効
              </Badge>
            )}
          </h1>
        </div>

        {/* ユーザー情報・時刻表示 */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 ml-8">
          {/* ログインユーザー情報 */}
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md">
            <User className="h-4 w-4" />
            <span className="font-medium">{currentUser.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ID: {currentUser.id}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser.role}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser.department}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ログイン: {currentUser.loginTime}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              HPKI: 残り12時間45分
            </span>
          </div>
        </div>

        {/* 代行入力未承認数 */}
        <div className="ml-auto mr-4 flex items-center space-x-4">
          {/* 通常の未承認（24時間以内） */}
          <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-md border border-amber-200 dark:border-amber-800">
            <Badge className="bg-amber-500 text-white animate-pulse">
              未承認
            </Badge>
            <span className="font-bold text-amber-700 dark:text-amber-400 text-lg animate-pulse">
              {header2ApprovalData.normal}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-500">件</span>
          </div>

          {/* 24時間超えの未承認 */}
          {header2ApprovalData.overdue > 0 && (
            <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/30 px-3 py-1 rounded-md border border-red-200 dark:border-red-800">
              <Badge className="bg-red-600 text-white animate-pulse">
                24h超
              </Badge>
              <span className="font-bold text-red-700 dark:text-red-400 text-lg animate-pulse">
                {header2ApprovalData.overdue}
              </span>
              <span className="text-xs text-red-600 dark:text-red-500">件</span>
            </div>
          )}
        </div>

        {/* アラート・設定・ログアウトボタン */}
        <div className="flex items-center gap-3">
          <TooltipProvider>
            {/* 一時保存ボタン（2つ目のヘッダー） */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  onClick={() => setIsTempDataOpen(true)}
                >
                  <Save className="h-4 w-4" />
                  {tempDataCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                      {tempDataCount > 99 ? '99+' : tempDataCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>一時保存データ {tempDataCount > 0 && `(${tempDataCount})`}</p>
              </TooltipContent>
            </Tooltip>

            {/* 一時保存ダイアログコンテンツは3つ目のヘッダーで一元管理 */}

            {/* 付箋ボタン（2つ目のヘッダー） */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  onClick={() => setIsNotesOpen(true)}
                >
                  <StickyNote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>付箋</p>
              </TooltipContent>
            </Tooltip>

            {/* 付箋ダイアログコンテンツは3つ目のヘッダーで一元管理 */}

            {/* アラートボタン（2つ目のヘッダー） */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  onClick={() => setIsAlertsOpen(true)}
                >
                  <Bell className="h-4 w-4" />
                  {unreadAlertsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {unreadAlertsCount > 99 ? '99+' : unreadAlertsCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>アラート {unreadAlertsCount > 0 && `(${unreadAlertsCount})`}</p>
              </TooltipContent>
            </Tooltip>

            {/* 通知ダイアログコンテンツは3つ目のヘッダーで一元管理 */}

            {/* 設定ボタン */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                    >
                      <Save className="h-4 w-4" />
                      {tempDataCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                          {tempDataCount > 99 ? '99+' : tempDataCount}
                        </Badge>
                      )}
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>一時保存データ {tempDataCount > 0 && `(${tempDataCount})`}</p>
                </TooltipContent>
              </Tooltip>
              
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Save className="w-5 h-5 medical-text-primary" />
                    <span>一時保存データ</span>
                    {tempDataCount > 0 && (
                      <Badge className="bg-orange-500 text-white text-xs">
                        {tempDataCount}件
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    途中で保存された診療記録やオーダー入力データを確認・復元できます。
                  </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="max-h-96 mt-4">
                  <div className="space-y-3">
                    {tempDataList.length > 0 ? (
                      tempDataList.map((item) => (
                        <Card key={item.id} className="border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/30">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge className="bg-orange-600 text-white text-xs">
                                    {item.type}
                                  </Badge>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {item.patientName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({item.patientId})
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {item.content}
                                </p>
                                <div className="text-xs text-muted-foreground">
                                  保存日時: {item.savedAt}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-3 pt-3 border-t">
                              <Button
                                size="sm"
                                className="flex-1 medical-primary"
                                onClick={() => handleRestoreTempData(item.id)}
                              >
                                復元
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteTempData(item.id)}
                              >
                                削除
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card className="p-8">
                        <div className="text-center space-y-4">
                          <Save className="w-12 h-12 mx-auto text-muted-foreground" />
                          <div>
                            <h3 className="font-medium text-lg mb-2">一時保存データはありません</h3>
                            <p className="text-sm text-muted-foreground">
                              診療記録やオーダー入力中に保存すると、こち���に表示されます
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* ログアウトボタン */}
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ログアウト</p>
                </TooltipContent>
              </Tooltip>
              
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ログアウト確認</AlertDialogTitle>
                  <AlertDialogDescription>
                    本当にログアウトしますか？保存していない変更は失われる可能性があります。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                    ログアウト
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TooltipProvider>
        </div>
      </header>

      {/* 3つ目のヘッダー（看護師・差し戻し） */}
      <header className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center">
        {/* ロゴ・システム名 */}
        <div className="flex items-center">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            Harz
            {autoLogoutEnabled && (
              <Badge variant="outline" className="ml-2 text-xs">
                自動ログアウト有効
              </Badge>
            )}
          </h1>
        </div>

        {/* ユーザー情報・時刻表示 */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 ml-8">
          {/* ログインユーザー情報 */}
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md">
            <User className="h-4 w-4" />
            <span className="font-medium">{nurseUser.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ID: {nurseUser.id}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {nurseUser.role}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {nurseUser.department}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ログイン: {nurseUser.loginTime}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              HPKI: 残り12時間45分
            </span>
          </div>
        </div>

        {/* 差し戻し件数 */}
        <div className="ml-auto mr-4 flex items-center space-x-4">
          {/* 通常の差し戻し */}
          {header3RejectionData.normal > 0 && (
            <div className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-950/30 px-3 py-1 rounded-md border border-purple-200 dark:border-purple-800">
              <Badge className="bg-purple-500 text-white animate-pulse">
                差し戻し
              </Badge>
              <span className="font-bold text-purple-700 dark:text-purple-400 text-lg animate-pulse">
                {header3RejectionData.normal}
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-500">件</span>
            </div>
          )}

          {/* 24時間超えの差し戻し */}
          {header3RejectionData.overdue > 0 && (
            <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/30 px-3 py-1 rounded-md border border-red-200 dark:border-red-800">
              <Badge className="bg-red-600 text-white animate-pulse">
                24h超
              </Badge>
              <span className="font-bold text-red-700 dark:text-red-400 text-lg animate-pulse">
                {header3RejectionData.overdue}
              </span>
              <span className="text-xs text-red-600 dark:text-red-500">件</span>
            </div>
          )}
        </div>

        {/* アラート・設定・ログアウトボタン */}
        <div className="flex items-center gap-3">
          <TooltipProvider>
            {/* 付箋ボタン（3つ目のヘッダー） */}
            <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                    >
                      <StickyNote className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>付箋</p>
                </TooltipContent>
              </Tooltip>
              
              <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <StickyNote className="w-5 h-5 medical-text-primary" />
                      <DialogTitle>付箋</DialogTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="medical-primary"
                        onClick={handleAddNote}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        追加
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsNotesOpen(false)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        閉じる
                      </Button>
                    </div>
                  </div>
                  <DialogDescription>
                    重要なメモや注意事項を付箋として管理できます。付箋をクリックして編集できます。
                  </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="max-h-[500px] mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {stickyNotes.length > 0 ? (
                      stickyNotes.map((note) => {
                        const isEditing = editingNoteId === note.id;
                        const colorConfig = {
                          yellow: { border: 'border-l-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-800 dark:text-yellow-200' },
                          blue: { border: 'border-l-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-800 dark:text-blue-200' },
                          pink: { border: 'border-l-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-800 dark:text-pink-200' },
                          green: { border: 'border-l-green-500', bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-800 dark:text-green-200' }
                        };
                        const config = colorConfig[note.color as keyof typeof colorConfig] || colorConfig.yellow;
                        
                        return (
                          <Card key={note.id} className={`border-l-4 ${config.border} ${config.bg} relative`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <CardContent className="p-4 pr-10">
                              {isEditing ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    className="font-medium bg-white dark:bg-gray-800"
                                    placeholder="タイトル"
                                  />
                                  <Textarea
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                    className="text-sm bg-white dark:bg-gray-800 min-h-[60px]"
                                    placeholder="内容"
                                  />
                                  <div className="text-xs text-muted-foreground mb-2">
                                    {note.createdAt}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      className="flex-1 medical-primary"
                                      onClick={handleSaveEditNote}
                                    >
                                      <Check className="w-3 h-3 mr-1" />
                                      保存
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1"
                                      onClick={handleCancelEditNote}
                                    >
                                      キャンセル
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div onClick={() => handleStartEditNote(note)} className="cursor-pointer">
                                  <h3 className={`font-medium mb-2 ${config.text}`}>
                                    {note.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">
                                    {note.content}
                                  </p>
                                  <div className="text-xs text-muted-foreground">
                                    {note.createdAt}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <Card className="p-8 col-span-2">
                        <div className="text-center space-y-4">
                          <StickyNote className="w-12 h-12 mx-auto text-muted-foreground" />
                          <div>
                            <h3 className="font-medium text-lg mb-2">付箋はありません</h3>
                            <p className="text-sm text-muted-foreground">
                              「追加」ボタンから新しい付箋を作成できます
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* 一時保存ボタン（3つ目のヘッダー） */}
            <Dialog open={isTempDataOpen} onOpenChange={setIsTempDataOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                    >
                      <Save className="h-4 w-4" />
                      {tempDataCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                          {tempDataCount > 99 ? '99+' : tempDataCount}
                        </Badge>
                      )}
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>一時保存データ {tempDataCount > 0 && `(${tempDataCount})`}</p>
                </TooltipContent>
              </Tooltip>
              
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Save className="w-5 h-5 text-blue-600" />
                    <span>一時保存データがあります</span>
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    以下のデータが一時保存されています。確認をお願いします。
                  </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="max-h-[500px] mt-4">
                  <div className="space-y-2">
                    {tempDataList.length > 0 ? (
                      tempDataList.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                          onClick={() => handleToggleTempData(item.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTempData.includes(item.id)}
                            onChange={() => handleToggleTempData(item.id)}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {item.patientName}
                              </h4>
                              <span className="text-sm text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0">
                                {item.hoursAgo}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              入力：{item.inputBy}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              {item.category} - {item.detail}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Card className="p-8">
                        <div className="text-center space-y-4">
                          <Save className="w-12 h-12 mx-auto text-muted-foreground" />
                          <div>
                            <h3 className="font-medium text-lg mb-2">一時保存データはありません</h3>
                            <p className="text-sm text-muted-foreground">
                              診療記録やオーダー入力中に保存すると、こちらに表示されます
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
                
                {tempDataList.length > 0 && (
                  <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={handleSaveTempData}
                      className="px-6"
                    >
                      キャンセル
                    </Button>
                    <Button
                      onClick={handleLoadTempData}
                      className="bg-black hover:bg-gray-800 text-white px-6"
                    >
                      読み込む
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* 通知ボタン（3つ目のヘッダー） */}
            <Dialog open={isAlertsOpen} onOpenChange={setIsAlertsOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>通知 {userAlerts.filter(alert => !alert.dismissed).length > 0 && `(${userAlerts.filter(alert => !alert.dismissed).length})`}</p>
                </TooltipContent>
              </Tooltip>
              
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      <span>通知一覧</span>
                      {unreadAlertsCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                          {unreadAlertsCount}件未対応
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAlertsOpen(false)}
                      className="h-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                    >
                      <X className="h-4 w-4 mr-1" />
                      <span className="text-sm">閉じる</span>
                    </Button>
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    システムからの通知メッセージを表示します
                  </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="max-h-96 mt-4">
                  <div className="space-y-2">
                    {userAlerts.length > 0 ? (
                      userAlerts
                        .map((alert) => {
                          const iconConfig = {
                            warning: { icon: AlertTriangle, color: "text-orange-500", dismissedColor: "text-gray-400" },
                            system: { icon: Info, color: "text-blue-500", dismissedColor: "text-gray-400" },
                            task: { icon: CheckCircle, color: "text-green-500", dismissedColor: "text-gray-400" },
                            notification: { icon: AlertCircle, color: "text-red-500", dismissedColor: "text-gray-400" }
                          };
                          const config = iconConfig[alert.type] || iconConfig.system;
                          const IconComponent = config.icon;
                          const isExpanded = expandedAlertId === alert.id;
                          const isDismissed = alert.dismissed;
                          
                          return (
                            <div
                              key={alert.id}
                              className={`rounded-lg p-3 border-l-4 ${
                                isDismissed 
                                  ? 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700' 
                                  : 'bg-gray-50 dark:bg-gray-800 border-blue-500 hover:bg-gray-100 dark:hover:bg-gray-750'
                              } relative transition-colors`}
                            >
                              <div 
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <IconComponent className={`w-5 h-5 ${isDismissed ? config.dismissedColor : config.color}`} />
                                  <span className={`text-sm ${
                                    isDismissed 
                                      ? 'text-gray-500 dark:text-gray-500' 
                                      : 'text-gray-900 dark:text-gray-100'
                                  }`}>
                                    {alert.title}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {!isDismissed && (
                                    <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                                      未対応
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {alert.timestamp}
                                  </span>
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-400 transform rotate-180 transition-transform" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400 transition-transform" />
                                  )}
                                </div>
                              </div>
                              
                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                  <p className={`text-sm mb-3 ${
                                    isDismissed 
                                      ? 'text-gray-500 dark:text-gray-500' 
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {alert.message}
                                  </p>
                                  {!isDismissed && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onDismissAlert) {
                                          onDismissAlert(alert.id);
                                          setExpandedAlertId(null);
                                        }
                                      }}
                                      className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 h-auto"
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      対応済み
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                    ) : (
                      <Card className="p-8">
                        <div className="text-center space-y-4">
                          <Bell className="w-12 h-12 mx-auto text-muted-foreground" />
                          <div>
                            <h3 className="font-medium text-lg mb-2">アラートはありません</h3>
                            <p className="text-sm text-muted-foreground">
                              新しい通知があると、こちらに表示されます
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* 設定ボタン（3つ目のヘッダー） */}
            <Dialog open={isMenuSettingsOpen} onOpenChange={handleMenuSettingsClose}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>メニュー設定</p>
                </TooltipContent>
              </Tooltip>
              
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>メニュー設定</span>
                  </DialogTitle>
                  <DialogDescription>
                    メニューの表示やカラーテーマなど、画面表示に関する設定を変更できます。
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="menu" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3 gap-4">
                    <TabsTrigger value="menu">メニュー編集</TabsTrigger>
                    <TabsTrigger value="theme">テーマカラー</TabsTrigger>
                    <TabsTrigger value="password">パスワード変更</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="theme" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-3 text-sm font-medium">テーマカラーを選択</h4>
                        <RadioGroup value={tempColorTheme} onValueChange={setTempColorTheme}>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                              <RadioGroupItem value="blue" id="theme-blue-3" />
                              <Label htmlFor="theme-blue-3" className="flex-1 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                  <div className="flex space-x-1">
                                    <div className="w-8 h-8 rounded bg-blue-600"></div>
                                    <div className="w-8 h-8 rounded bg-blue-100"></div>
                                  </div>
                                  <p className="font-medium">ブルー</p>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                              <RadioGroupItem value="green" id="theme-green-3" />
                              <Label htmlFor="theme-green-3" className="flex-1 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                  <div className="flex space-x-1">
                                    <div className="w-8 h-8 rounded bg-green-600"></div>
                                    <div className="w-8 h-8 rounded bg-green-100"></div>
                                  </div>
                                  <p className="font-medium">グリーン</p>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                              <RadioGroupItem value="purple" id="theme-purple-3" />
                              <Label htmlFor="theme-purple-3" className="flex-1 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                  <div className="flex space-x-1">
                                    <div className="w-8 h-8 rounded bg-purple-600"></div>
                                    <div className="w-8 h-8 rounded bg-purple-100"></div>
                                  </div>
                                  <p className="font-medium">パープル</p>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                              <RadioGroupItem value="pink" id="theme-pink-3" />
                              <Label htmlFor="theme-pink-3" className="flex-1 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                  <div className="flex space-x-1">
                                    <div className="w-8 h-8 rounded bg-pink-600"></div>
                                    <div className="w-8 h-8 rounded bg-pink-100"></div>
                                  </div>
                                  <p className="font-medium">ピンク</p>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                              <RadioGroupItem value="orange" id="theme-orange-3" />
                              <Label htmlFor="theme-orange-3" className="flex-1 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                  <div className="flex space-x-1">
                                    <div className="w-8 h-8 rounded bg-orange-600"></div>
                                    <div className="w-8 h-8 rounded bg-orange-100"></div>
                                  </div>
                                  <p className="font-medium">オレンジ</p>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                              <RadioGroupItem value="red" id="theme-red-3" />
                              <Label htmlFor="theme-red-3" className="flex-1 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                  <div className="flex space-x-1">
                                    <div className="w-8 h-8 rounded bg-red-600"></div>
                                    <div className="w-8 h-8 rounded bg-red-100"></div>
                                  </div>
                                  <p className="font-medium">レッド</p>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                              <RadioGroupItem value="white" id="theme-white-3" />
                              <Label htmlFor="theme-white-3" className="flex-1 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                  <div className="flex space-x-1">
                                    <div className="w-8 h-8 rounded bg-slate-600"></div>
                                    <div className="w-8 h-8 rounded bg-gray-200"></div>
                                  </div>
                                  <p className="font-medium">ホワイト</p>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                              <RadioGroupItem value="black" id="theme-black-3" />
                              <Label htmlFor="theme-black-3" className="flex-1 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                  <div className="flex space-x-1">
                                    <div className="w-8 h-8 rounded bg-gray-900"></div>
                                    <div className="w-8 h-8 rounded bg-gray-300"></div>
                                  </div>
                                  <p className="font-medium">ブラック</p>
                                </div>
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="password" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password-3" className="text-sm font-medium">
                          現在のパスワード
                        </Label>
                        <div className="relative">
                          <Input
                            id="current-password-3"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="現在のパスワードを入力"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password-3" className="text-sm font-medium">
                          新しいパスワード
                        </Label>
                        <div className="relative">
                          <Input
                            id="new-password-3"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="新しいパスワードを入力（8文字以上）"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password-3" className="text-sm font-medium">
                          新しいパスワード（確認）
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm-password-3"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="新しいパスワードを再入力"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {/* パスワード条件チェック */}
                      {(newPassword || confirmPassword) && (
                        <div className="space-y-2 mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className={`flex items-center gap-2 text-sm ${newPassword.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {newPassword.length >= 8 ? '✓' : '×'} 8文字以上
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${/[A-Z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {/[A-Z]/.test(newPassword) ? '✓' : '×'} 大文字を含む
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${/[a-z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {/[a-z]/.test(newPassword) ? '✓' : '×'} 小文字を含む
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${/[0-9]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {/[0-9]/.test(newPassword) ? '✓' : '×'} 数字を含む
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? '✓' : '×'} 記号を含む
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="menu" className="space-y-4 mt-4">
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="mb-2 text-sm font-medium">左サイドメニューの表示項目を編集</h4>
                          <p className="text-xs text-muted-foreground mb-4">
                            ドラッグして順番を変更、チェックで表示/非表示を切り替えできます。
                          </p>
                          
                          <div className="space-y-2">
                            {menuItems.map((item, index) => (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={() => handleMenuDragStart(index)}
                                onDragOver={(e) => handleMenuDragOver(e, index)}
                                onDragEnd={handleMenuDragEnd}
                                className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-move transition-all ${
                                  draggedIndex === index ? 'opacity-50 scale-95' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <GripVertical className="w-4 h-4 text-gray-400" />
                                  <input
                                    type="checkbox"
                                    id={`menu-${item.id}-3`}
                                    checked={item.visible}
                                    onChange={(e) => {
                                      const newItems = [...menuItems];
                                      newItems[index].visible = e.target.checked;
                                      setMenuItems(newItems);
                                    }}
                                    className="w-4 h-4 medical-primary rounded cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <Label htmlFor={`menu-${item.id}-3`} className="cursor-pointer font-medium">
                                    {item.label}
                                  </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  {item.id === 'orders' && (
                                    <Collapsible open={isOrdersExpanded} onOpenChange={setIsOrdersExpanded}>
                                      <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 px-2">
                                          {isOrdersExpanded ? (
                                            <ChevronDown className="w-4 h-4" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4" />
                                          )}
                                        </Button>
                                      </CollapsibleTrigger>
                                    </Collapsible>
                                  )}
                                  <div className="flex flex-col gap-0.5">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        moveMenuItemUp(index);
                                      }}
                                      disabled={index === 0}
                                    >
                                      <ChevronUp className={`w-4 h-4 ${index === 0 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        moveMenuItemDown(index);
                                      }}
                                      disabled={index === menuItems.length - 1}
                                    >
                                      <ChevronDown className={`w-4 h-4 ${index === menuItems.length - 1 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* オーダー詳細項目 */}
                            <Collapsible open={isOrdersExpanded}>
                              <CollapsibleContent className="space-y-1 pl-8 mt-2">
                                {orderItems.map((orderItem, index) => (
                                  <div
                                    key={orderItem.id}
                                    draggable
                                    onDragStart={() => handleOrderDragStart(index)}
                                    onDragOver={(e) => handleOrderDragOver(e, index)}
                                    onDragEnd={handleOrderDragEnd}
                                    className={`flex items-center space-x-3 p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-move transition-all ${
                                      draggedOrderIndex === index ? 'opacity-50 scale-95' : ''
                                    }`}
                                  >
                                    <GripVertical className="w-3 h-3 text-gray-400" />
                                    <input
                                      type="checkbox"
                                      id={`order-${orderItem.id}-3`}
                                      checked={orderItem.visible}
                                      onChange={(e) => {
                                        const newItems = [...orderItems];
                                        newItems[index].visible = e.target.checked;
                                        setOrderItems(newItems);
                                      }}
                                      className="w-3 h-3 medical-primary rounded cursor-pointer"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <Label htmlFor={`order-${orderItem.id}-3`} className="cursor-pointer text-sm flex-1">
                                      {orderItem.label}
                                    </Label>
                                    <div className="flex flex-col gap-0.5 ml-auto">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          moveOrderItemUp(index);
                                        }}
                                        disabled={index === 0}
                                      >
                                        <ChevronUp className={`w-3 h-3 ${index === 0 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          moveOrderItemDown(index);
                                        }}
                                        disabled={index === orderItems.length - 1}
                                      >
                                        <ChevronDown className={`w-3 h-3 ${index === orderItems.length - 1 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTempColorTheme(themeColor);
                      handleMenuSettingsClose(false);
                    }}
                  >
                    キャンセル
                  </Button>
                  <Button
                    className="medical-primary"
                    onClick={handleThemeColorSave}
                  >
                    保存
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* ログアウトボタン */}
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ログアウト</p>
                </TooltipContent>
              </Tooltip>
              
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ログアウト確認</AlertDialogTitle>
                  <AlertDialogDescription>
                    本当にログアウトしますか？保存していない変更は失われる可能性があります。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                    ログアウト
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TooltipProvider>
        </div>
      </header>

      {/* 自動ログアウト警告ダイアログ */}
      <AlertDialog open={isAutoLogoutWarningVisible}>
        <AlertDialogContent className="sm:max-w-[450px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span>自動ログアウト警告</span>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mb-3">
                    しばらく操作がありませんでした。セキュリティのため、まもなく自動ログアウトします。
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 text-amber-600 dark:text-amber-400">
                      <span className="text-sm">あと1分後に自動ログアウトされます</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-3">
                    セッションを継続する場合は「セッション延長」をクリックしてください。保存していない変更がある場合は、必ず保存してください。
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={onExtendSession}
              className="medical-primary hover:bg-blue-700 text-white"
            >
              セッション延長
            </AlertDialogAction>
            <AlertDialogCancel onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
              今すぐログアウト
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 手動ログアウト確認ダイアログ */}
      <AlertDialog open={isManualLogoutDialogOpen} onOpenChange={setIsManualLogoutDialogOpen}>
        <AlertDialogContent className="sm:max-w-[450px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span>ログアウト確認</span>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <div className="text-left">
                  {/* <div className="mb-3">
                    本当にログアウトしますか？保存していない変更は失われる可能性があります。
                  </div> */}
                  
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 text-amber-600 dark:text-amber-400">
                      <span className="text-sm">あと1分後に自動ログアウトされます</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-3">
                    ログアウト後は、再度ログインが必要です。
                  </div>
                  <div className="text-sm text-muted-foreground mt-3">
                    保存していない変更は失われる可能性があります。
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
              ログアウト
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}