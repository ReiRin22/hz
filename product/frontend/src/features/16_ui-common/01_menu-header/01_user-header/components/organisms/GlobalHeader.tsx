"use client";

import { Clock, User, LogOut, Bell, Settings, AlertTriangle, Timer, Save, StickyNote } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@shared/components/atoms/button";
import { Badge } from "@shared/components/atoms/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@shared/components/atoms/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@shared/components/atoms/tooltip";
import { toast } from "sonner";
import type { CurrentUser, UserAlert } from "../types/patient-types";

interface GlobalHeaderProps {
  currentUser: CurrentUser;
  userAlerts: UserAlert[];
  darkMode: boolean;
  autoSaveEnabled: boolean;
  onAutoSave: () => void;
  alertsEnabled: boolean;
  autoLogoutEnabled?: boolean;
  autoLogoutTimeout?: number;
  autoLogoutWarningTime?: number;
  isAutoLogoutWarningVisible?: boolean;
  autoLogoutRemainingTime?: number;
  onExtendSession?: () => void;
  onLogout?: () => void;
  themeColor?: string;
  // Toolbar counts
  stickyNotesCount: number;
  tempDataCount: number;
  unreadAlertsCount: number;
  // Toolbar open handlers
  onNotesOpen: () => void;
  onTempDataOpen: () => void;
  onAlertsOpen: () => void;
  onMenuSettingsOpen: () => void;
}

export function GlobalHeader({
  currentUser,
  autoLogoutEnabled = false,
  autoLogoutTimeout = 30,
  isAutoLogoutWarningVisible = false,
  autoLogoutRemainingTime = 0,
  onExtendSession,
  onLogout,
  themeColor = "blue",
  stickyNotesCount,
  tempDataCount,
  unreadAlertsCount,
  onNotesOpen,
  onTempDataOpen,
  onAlertsOpen,
  onMenuSettingsOpen,
}: GlobalHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);

  // TODO: BFF 接続後に認証ユーザーの未承認件数を取得して置き換える（Phase 7 以降）
  const header1ApprovalData = { normal: 3, overdue: 0 };
  // TODO: BFF 接続後に削除予定（承認者ロール向けデザイン案）
  const header2ApprovalData = { normal: 2, overdue: 1 };
  // TODO: BFF 接続後に削除予定（看護師ロール向けデザイン案）
  const header3RejectionData = { normal: 1, overdue: 0 };
  // TODO: BFF 接続後に認証ユーザーの情報を使用する
  const nurseUser = { id: "N0012", name: "佐藤 花子", role: "看護師", department: "内科病棟", loginTime: "08:30" };

  useEffect(() => {
    const timer = setInterval(() => { setCurrentTime(new Date()); }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    toast.success("ログアウトしました");
    onLogout?.();
  };

  return (
    <>
      {/* 1つ目のヘッダー（通常ユーザー・未承認のみ） */}
      <header className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center">
        <div className="flex items-center">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            Harz
            {autoLogoutEnabled && (
              <Badge variant="outline" className="ml-2 text-xs">自動ログアウト有効</Badge>
            )}
          </h1>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 ml-8">
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md">
            <User className="h-4 w-4" />
            <span className="font-medium">{currentUser.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">ID: {currentUser.id}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{currentUser.department}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">HPKI: 残り12時間45分</span>
          </div>
        </div>

        <div className="ml-auto mr-4 flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-md border border-amber-200 dark:border-amber-800">
          <Badge className="bg-amber-500 text-white animate-pulse">未承認</Badge>
          <span className="font-bold text-amber-700 dark:text-amber-400 text-lg animate-pulse">{header1ApprovalData.normal}</span>
          <span className="text-xs text-amber-600 dark:text-amber-500">件</span>
        </div>

        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative" onClick={onNotesOpen}>
                  <StickyNote className="h-4 w-4" />
                  {stickyNotesCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-yellow-500 text-white text-xs">
                      {stickyNotesCount > 99 ? "99+" : stickyNotesCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>付箋</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative" onClick={onTempDataOpen}>
                  <Save className="h-4 w-4" />
                  {tempDataCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                      {tempDataCount > 99 ? "99+" : tempDataCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>一時保存データ {tempDataCount > 0 && `(${tempDataCount})`}</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative" onClick={onAlertsOpen}>
                  <Bell className="h-4 w-4" />
                  {unreadAlertsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {unreadAlertsCount > 99 ? "99+" : unreadAlertsCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>アラート {unreadAlertsCount > 0 && `(${unreadAlertsCount})`}</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700" onClick={onMenuSettingsOpen}>
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>メニュー設定</p></TooltipContent>
            </Tooltip>

            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent><p>ログアウト</p></TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ログアウト確認</AlertDialogTitle>
                  <AlertDialogDescription>ログアウトしますか？保存されていないデータは失われる可能性があります。</AlertDialogDescription>
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
            <AlertDialogAction onClick={() => { setShowLogoutWarning(false); toast.success("セッションを延長しました"); }} className="bg-blue-600 hover:bg-blue-700">
              セッション延長
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2つ目のヘッダー（非表示。将来の承認者ロール向けデザイン案。TODO: ロール判定実装後に対応する） */}
      <header className="hidden h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center">
        <div className="flex items-center">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            Harz
            {autoLogoutEnabled && (
              <Badge variant="outline" className="ml-2 text-xs">自動ログアウト有効</Badge>
            )}
          </h1>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 ml-8">
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md">
            <User className="h-4 w-4" />
            <span className="font-medium">{currentUser.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">ID: {currentUser.id}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{currentUser.department}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">ログイン: {currentUser.loginTime}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">HPKI: 残り12時間45分</span>
          </div>
        </div>

        <div className="ml-auto mr-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-md border border-amber-200 dark:border-amber-800">
            <Badge className="bg-amber-500 text-white animate-pulse">未承認</Badge>
            <span className="font-bold text-amber-700 dark:text-amber-400 text-lg animate-pulse">{header2ApprovalData.normal}</span>
            <span className="text-xs text-amber-600 dark:text-amber-500">件</span>
          </div>
          {header2ApprovalData.overdue > 0 && (
            <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/30 px-3 py-1 rounded-md border border-red-200 dark:border-red-800">
              <Badge className="bg-red-600 text-white animate-pulse">24h超</Badge>
              <span className="font-bold text-red-700 dark:text-red-400 text-lg animate-pulse">{header2ApprovalData.overdue}</span>
              <span className="text-xs text-red-600 dark:text-red-500">件</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative" onClick={onTempDataOpen}>
                  <Save className="h-4 w-4" />
                  {tempDataCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                      {tempDataCount > 99 ? "99+" : tempDataCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>一時保存データ {tempDataCount > 0 && `(${tempDataCount})`}</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative" onClick={onNotesOpen}>
                  <StickyNote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>付箋</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative" onClick={onAlertsOpen}>
                  <Bell className="h-4 w-4" />
                  {unreadAlertsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {unreadAlertsCount > 99 ? "99+" : unreadAlertsCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>アラート {unreadAlertsCount > 0 && `(${unreadAlertsCount})`}</p></TooltipContent>
            </Tooltip>

            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent><p>ログアウト</p></TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ログアウト確認</AlertDialogTitle>
                  <AlertDialogDescription>本当にログアウトしますか？保存していない変更は失われる可能性があります。</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">ログアウト</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TooltipProvider>
        </div>
      </header>

      {/* 3つ目のヘッダー（看護師・差し戻し） */}
      <header className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center">
        <div className="flex items-center">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            Harz
            {autoLogoutEnabled && (
              <Badge variant="outline" className="ml-2 text-xs">自動ログアウト有効</Badge>
            )}
          </h1>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 ml-8">
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md">
            <User className="h-4 w-4" />
            <span className="font-medium">{nurseUser.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">ID: {nurseUser.id}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{nurseUser.role}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{nurseUser.department}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">ログイン: {nurseUser.loginTime}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">HPKI: 残り12時間45分</span>
          </div>
        </div>

        <div className="ml-auto mr-4 flex items-center space-x-4">
          {header3RejectionData.normal > 0 && (
            <div className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-950/30 px-3 py-1 rounded-md border border-purple-200 dark:border-purple-800">
              <Badge className="bg-purple-500 text-white animate-pulse">差し戻し</Badge>
              <span className="font-bold text-purple-700 dark:text-purple-400 text-lg animate-pulse">{header3RejectionData.normal}</span>
              <span className="text-xs text-purple-600 dark:text-purple-500">件</span>
            </div>
          )}
          {header3RejectionData.overdue > 0 && (
            <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/30 px-3 py-1 rounded-md border border-red-200 dark:border-red-800">
              <Badge className="bg-red-600 text-white animate-pulse">24h超</Badge>
              <span className="font-bold text-red-700 dark:text-red-400 text-lg animate-pulse">{header3RejectionData.overdue}</span>
              <span className="text-xs text-red-600 dark:text-red-500">件</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative" onClick={onNotesOpen}>
                  <StickyNote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>付箋</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative" onClick={onTempDataOpen}>
                  <Save className="h-4 w-4" />
                  {tempDataCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                      {tempDataCount > 99 ? "99+" : tempDataCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>一時保存データ {tempDataCount > 0 && `(${tempDataCount})`}</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative" onClick={onAlertsOpen}>
                  <Bell className="h-4 w-4" />
                  {unreadAlertsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {unreadAlertsCount > 99 ? "99+" : unreadAlertsCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>アラート {unreadAlertsCount > 0 && `(${unreadAlertsCount})`}</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700" onClick={onMenuSettingsOpen}>
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>メニュー設定</p></TooltipContent>
            </Tooltip>

            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent><p>ログアウト</p></TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ログアウト確認</AlertDialogTitle>
                  <AlertDialogDescription>本当にログアウトしますか？保存していない変更は失われる可能性があります。</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">ログアウト</AlertDialogAction>
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
                  <div className="mb-3">しばらく操作がありませんでした。セキュリティのため、まもなく自動ログアウトします。</div>
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
            <AlertDialogAction onClick={onExtendSession} className="medical-primary hover:bg-blue-700 text-white">
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
