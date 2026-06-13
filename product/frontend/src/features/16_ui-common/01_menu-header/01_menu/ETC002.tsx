"use client";
import { MenuSection } from "./src/components/MenuSection";
import { DashboardSection } from "./src/components/DashboardSection";
import { ProxyInputSection } from "./src/components/ProxyInputSection";
import { TemporarySaveSection } from "./src/components/TemporarySaveSection";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { Settings, Bell, Check, X, AlertCircle, Info, CheckCircle, AlertTriangle, ChevronDown } from "lucide-react";
import { getDoctorUnapprovedSummary } from "./src/data/proxyInputData";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/atoms/dialog";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";

interface ThemeColor {
  name: string;
  value: string;
  primary: string;
  secondary: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

const themeColors = [
  { name: "ブルー", value: "blue", primary: "#3B82F6", secondary: "#DBEAFE" },
  { name: "グリーン", value: "green", primary: "#10B981", secondary: "#D1FAE5" },
  { name: "パープル", value: "purple", primary: "#8B5CF6", secondary: "#EDE9FE" },
  { name: "ピンク", value: "pink", primary: "#EC4899", secondary: "#FCE7F3" },
  { name: "オレンジ", value: "orange", primary: "#F59E0B", secondary: "#FEF3C7" },
  { name: "レッド", value: "red", primary: "#EF4444", secondary: "#FEE2E2" },
  { name: "ホワイト", value: "white", primary: "#64748B", secondary: "#F8FAFC" },
  { name: "ブラック", value: "black", primary: "#9CA3AF", secondary: "#0D0D0D" },
];

export default function ETC002Page() {
  const doctorSummary = getDoctorUnapprovedSummary();
  const [selectedTheme, setSelectedTheme] = useState<ThemeColor>(themeColors[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: '1', 
      title: '代行入力の承認依頼', 
      message: '田中医師から3件の代行入力データの承認が必要です。', 
      timestamp: '2025-12-19 09:30', 
      isRead: false, 
      type: 'warning' 
    },
    { 
      id: '2', 
      title: 'システムメンテナンスのお知らせ', 
      message: '12月25日 22:00〜24:00の間、システムメンテナンスを実施します。', 
      timestamp: '2025-12-19 08:00', 
      isRead: false, 
      type: 'info' 
    },
    { 
      id: '3', 
      title: '検査結果が更新されました', 
      message: '患者ID: 12345 の血液検査結果が登録されました。', 
      timestamp: '2025-12-18 16:45', 
      isRead: false, 
      type: 'success' 
    },
    { 
      id: '4', 
      title: '重要: データ入力エラー', 
      message: '入院カルテ入力時にエラーが発生しました。システム管理者にお問い合わせください。', 
      timestamp: '2025-12-18 14:20', 
      isRead: false, 
      type: 'error' 
    },
    { 
      id: '5', 
      title: '新機能のお知らせ', 
      message: '病棟マップ機能がアップデートされました。新しいフィルター機能をご利用いただけます。', 
      timestamp: '2025-12-17 10:00', 
      isRead: false, 
      type: 'info' 
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const toggleNotificationExpand = (id: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return '#FEE2E2';
      case 'warning':
        return '#FEF3C7';
      case 'success':
        return '#D1FAE5';
      case 'info':
      default:
        return '#DBEAFE';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: selectedTheme.secondary }}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h1 className="mb-0" style={{ color: selectedTheme.primary }}>メニュー／ダッシュボード</h1>
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-lg border-2 shadow-sm"
              style={{ 
                backgroundColor: selectedTheme.value === 'black' ? '#1A1A1A' : 'white',
                borderColor: selectedTheme.primary
              }}
            >
              <span className="font-semibold" style={{ color: selectedTheme.primary }}>医師別未承認:</span>
              {doctorSummary.map((doctor) => (
                <div 
                  key={doctor.doctorId} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border"
                  style={{
                    background: selectedTheme.value === 'black' ? '#262626' : `linear-gradient(to right, ${selectedTheme.secondary}, ${selectedTheme.secondary})`,
                    borderColor: selectedTheme.primary,
                    color: selectedTheme.value === 'black' ? '#E5E7EB' : undefined
                  }}
                >
                  <span className="font-medium" style={{
                    color: selectedTheme.value === 'black' ? '#E5E7EB' : '#1F2937'
                  }}>{doctor.doctorName}</span>
                  <Badge 
                    variant={doctor.unapprovedCount > 0 ? "destructive" : "secondary"} 
                    className={doctor.unapprovedCount > 0 ? "bg-red-600 hover:bg-red-700 text-white font-semibold px-2.5 py-0.5" : ""}
                  >
                    {doctor.unapprovedCount}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Bell className="h-5 w-5" style={{ color: selectedTheme.primary }} />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 hover:bg-red-600 text-white border-2 border-white"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
                <Settings className="h-5 w-5" style={{ color: selectedTheme.primary }} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <MenuSection 
              theme={selectedTheme} 
              onThemeChange={setSelectedTheme}
              isSettingsOpen={isSettingsOpen}
              onSettingsOpenChange={setIsSettingsOpen}
            />
          </div>
          
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <DashboardSection theme={selectedTheme} />
            
            <div className="grid grid-cols-2 gap-4">
              <ProxyInputSection theme={selectedTheme} />
              <TemporarySaveSection theme={selectedTheme} />
            </div>
          </div>
        </div>
      </div>

      {/* 通知ダイアログ */}
      <Dialog open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>通知一覧</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-600 text-white">
                  未読 {unreadCount}件
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>システムからの通知を確認できます</DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end mb-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="h-4 w-4 mr-2" />
              すべて既読にする
            </Button>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  通知はありません
                </div>
              ) : (
                notifications.map((notification) => {
                  const isExpanded = expandedNotifications.has(notification.id);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`rounded-lg border-2 transition-all cursor-pointer ${
                        notification.isRead ? 'opacity-60' : 'shadow-md'
                      }`}
                      style={{
                        backgroundColor: notification.isRead ? '#F9FAFB' : getNotificationBgColor(notification.type),
                        borderColor: notification.isRead ? '#E5E7EB' : selectedTheme.primary
                      }}
                    >
                      {/* 1行サマリー表示 */}
                      <div 
                        className="flex items-center gap-3 p-3 hover:bg-black/5 transition-colors"
                        onClick={() => toggleNotificationExpand(notification.id)}
                      >
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0 flex items-center gap-3">
                          <span className="font-semibold text-gray-900 truncate">
                            {notification.title}
                          </span>
                          {!notification.isRead && (
                            <Badge className="bg-red-600 text-white text-xs flex-shrink-0">新着</Badge>
                          )}
                          <span className="text-xs text-gray-500 ml-auto flex-shrink-0">{notification.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="h-7 px-2"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <ChevronDown 
                            className={`h-4 w-4 text-gray-500 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* 詳細メッセージ（開閉式） */}
                      {isExpanded && (
                        <div className="px-3 pb-3 pt-0 border-t border-gray-200">
                          <p className="text-sm text-gray-700 mt-3">{notification.message}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="default"
              onClick={() => setIsNotificationOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}