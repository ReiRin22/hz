import { Clock, User, LogOut, Bell, Settings, AlertTriangle, Timer } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/atoms/button";
import { Badge } from "@/shared/components/atoms/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/atoms/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/atoms/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/atoms/tooltip";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Card, CardContent } from "@/shared/components/atoms/card";
import { toast } from 'sonner';
import type { CurrentUser, UserAlert } from "../types/patient-types";
import { SettingsPanel } from "./SettingsPanel";

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
  // フォントサイズ設定
  fontSize?: string;
  onFontSizeChange?: (size: string) => void;
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
  // フォントサイズ設定
  fontSize = 'normal',
  onFontSizeChange
}: GlobalHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  return (
    <>
      <header className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between">
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
        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
          {/* 現在日時 */}
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{formatDate(currentTime)}</span>
            <span className="font-mono">{formatTime(currentTime)}</span>
          </div>

          {/* ログインユーザー情報 */}
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md">
            <User className="h-4 w-4" />
            <span className="font-medium">{currentUser.name}</span>
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
          </div>

          {/* アラート・設定・ログアウトボタン */}
          <TooltipProvider>
            {/* アラートボタン */}
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
                      {unreadAlertsCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                          {unreadAlertsCount > 99 ? '99+' : unreadAlertsCount}
                        </Badge>
                      )}
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>アラート {unreadAlertsCount > 0 && `(${unreadAlertsCount})`}</p>
                </TooltipContent>
              </Tooltip>
              
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 medical-text-primary" />
                    <span>システムアラート</span>
                    {unreadAlertsCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {unreadAlertsCount}件
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    システムからの重要な通知とアラートを確認できます。
                  </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="max-h-96 mt-4">
                  <div className="space-y-3">
                    {userAlerts.length > 0 ? (
                      userAlerts
                        .filter(alert => !alert.dismissed)
                        .map((alert) => {
                          const alertTypeConfig = {
                            system: { color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950" },
                            task: { color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950" },
                            notification: { color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950" },
                            warning: { color: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950" }
                          };
                          const typeConfig = alertTypeConfig[alert.type];
                          
                          return (
                            <Card key={alert.id} className={`border-l-4 border-l-blue-500 ${typeConfig.bgColor}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                      {alert.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {alert.message}
                                    </p>
                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                      <span>{alert.timestamp}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {alert.type}
                                      </Badge>
                                      {alert.priority === 'high' && (
                                        <Badge variant="destructive" className="text-xs">
                                          重要
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  {onDismissAlert && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => onDismissAlert(alert.id)}
                                      className="h-auto w-auto p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                      ×
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
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

            {/* 設定ボタン */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
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
                  <p>システム設定</p>
                </TooltipContent>
              </Tooltip>
              
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>システム設定</span>
                  </DialogTitle>
                  <DialogDescription>
                    システム全体の動作に関する設定を変更できます。表示設定、自動保存、アラート機能、自動ログアウトの設定が可能です。
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <SettingsPanel
                    darkMode={darkMode}
                    onDarkModeToggle={onDarkModeToggle}
                    autoSaveEnabled={autoSaveEnabled}
                    onAutoSaveToggle={onAutoSaveToggle}
                    onAutoSave={onAutoSave}
                    alertsEnabled={alertsEnabled}
                    onAlertsToggle={onAlertsToggle}
                    autoLogoutEnabled={autoLogoutEnabled}
                    onAutoLogoutToggle={onAutoLogoutToggle}
                    autoLogoutTimeout={autoLogoutTimeout}
                    onAutoLogoutTimeoutChange={onAutoLogoutTimeoutChange}
                    fontSize={fontSize}
                    onFontSizeChange={onFontSizeChange}
                  />
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
                    <div className="flex items-center justify-center space-x-2 text-lg font-mono text-amber-600 dark:text-amber-400">
                      <Timer className="w-5 h-5" />
                      <span>{formatRemainingTime(autoLogoutRemainingTime)}</span>
                    </div>
                    <div className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                      残り時間
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
    </>
  );
}