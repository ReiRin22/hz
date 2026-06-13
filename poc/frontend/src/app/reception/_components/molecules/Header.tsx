import { useState, useEffect } from 'react';
import { Button } from '../atoms/button';
import { Badge } from '../atoms/badge';
import { 
  Bell, 
  Settings, 
  LogOut
} from 'lucide-react';

interface HeaderProps {
  userName?: string;
  jobTitle?: string;
  department?: string;
  loginTime?: string;
  onLogout?: () => void;
  onSettings?: () => void;
  alertCount?: number;
}

export function Header({ 
  userName = "高見", 
  jobTitle = "医師",
  department = "内科",
  loginTime,
  onLogout,
  onSettings,
  alertCount = 1
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // 現在時刻を更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 1秒ごとに更新
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatLoginTime = (loginTime?: string) => {
    if (loginTime) return loginTime;
    // デフォルトは8:30にログインしたとする
    return '08:30';
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('ログアウト処理');
      alert('ログアウトしました');
    }
  };

  const handleSettings = () => {
    if (onSettings) {
      onSettings();
    } else {
      console.log('システム設定画面を開く');
      alert('システム設定画面（未実装）');
    }
  };

  const handleAlerts = () => {
    console.log('アラート画面を開く');
    alert('アラート一覧画面（未実装）');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* 左側：Harzロゴ */}
        <div className="flex items-center">
          <h1 className="text-base font-medium text-gray-900">Harz</h1>
        </div>

        {/* 右側：日時・ユーザー情報・アイコン */}
        <div className="flex items-center space-x-4 text-sm text-gray-700">
          {/* 現在時刻 */}
          <span className="font-mono" suppressHydrationWarning>
            {formatDateTime(currentTime)}
          </span>
          
          {/* ユーザー情報（4つの要素） */}
          <div className="flex items-center space-x-2">
            <span className="font-medium">{userName}</span>
            <span>{jobTitle}</span>
            <span>{department}</span>
            <span>ログイン時間: {formatLoginTime(loginTime)}</span>
          </div>

          {/* アイコンボタン群 */}
          <div className="flex items-center space-x-2">
            {/* アラートボタン */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAlerts}
              className="relative h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Bell className="h-4 w-4 text-gray-600" />
              {alertCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {alertCount}
                </Badge>
              )}
            </Button>

            {/* 設定ボタン */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSettings}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Settings className="h-4 w-4 text-gray-600" />
            </Button>

            {/* ログアウトボタン */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}