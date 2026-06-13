import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Button } from "@/shared/components/atoms/button";
import { Switch } from "@/shared/components/atoms/switch";
import { Label } from "@/shared/components/atoms/label";
import { Badge } from "@/shared/components/atoms/badge";
import { Separator } from "@/shared/components/atoms/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { Settings, Moon, Sun, Shield, Bell, Save, Keyboard, Timer, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface SettingsPanelProps {
  onDarkModeToggle: (darkMode: boolean) => void;
  darkMode: boolean;
  autoSaveEnabled: boolean;
  onAutoSaveToggle: (enabled: boolean) => void;
  onAutoSave: () => void;
  alertsEnabled: boolean;
  onAlertsToggle: (enabled: boolean) => void;
  // 自動ログアウト関連
  autoLogoutEnabled?: boolean;
  onAutoLogoutToggle?: (enabled: boolean) => void;
  autoLogoutTimeout?: number; // 分単位
  onAutoLogoutTimeoutChange?: (minutes: number) => void;
}

export function SettingsPanel({
  darkMode,
  onDarkModeToggle,
  autoSaveEnabled,
  onAutoSaveToggle,
  onAutoSave,
  alertsEnabled,
  onAlertsToggle,
  autoLogoutEnabled = false,
  onAutoLogoutToggle,
  autoLogoutTimeout = 30,
  onAutoLogoutTimeoutChange,
}: SettingsPanelProps) {
  const [lastAutoSave, setLastAutoSave] = useState<string | null>(null);

  // 自動保存実行時の処理
  useEffect(() => {
    if (autoSaveEnabled) {
      const interval = setInterval(() => {
        onAutoSave?.();
        setLastAutoSave(new Date().toLocaleTimeString());
      }, 60000); // 1分間隔

      return () => clearInterval(interval);
    }
  }, [autoSaveEnabled, onAutoSave]);

  const keyboardShortcuts = [
    { key: "Ctrl + S", action: "保存" },
    { key: "Ctrl + N", action: "新規記録" },
    { key: "Ctrl + F", action: "検索" },
    { key: "Ctrl + /", action: "ショートカット表示" },
  ];

  // 自動ログアウト時間のオプション
  const timeoutOptions = [
    { value: 5, label: "5分" },
    { value: 10, label: "10分" },
    { value: 15, label: "15分" },
    { value: 30, label: "30分" },
    { value: 60, label: "1時間" },
    { value: 120, label: "2時間" },
  ];

  return (
    <div className="space-y-6">
      {/* 表示設定 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">表示設定</Label>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="text-sm">ダークモード</span>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={onDarkModeToggle}
          />
        </div>
      </div>

      <Separator />

      {/* 自動保存設定 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">自動保存</Label>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span className="text-sm">1分間隔で自動保存</span>
          </div>
          <Switch
            checked={autoSaveEnabled}
            onCheckedChange={onAutoSaveToggle}
          />
        </div>
        {autoSaveEnabled && lastAutoSave && (
          <div className="text-xs text-muted-foreground">
            最終自動保存: {lastAutoSave}
          </div>
        )}
      </div>

      <Separator />

      {/* 自動ログアウト設定 */}
      <div className="space-y-4">
        <Label className="text-sm font-medium flex items-center space-x-2">
          <Timer className="w-4 h-4" />
          <span>自動ログアウト</span>
        </Label>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">無操作時の自動ログアウト</span>
          </div>
          <Switch
            checked={autoLogoutEnabled}
            onCheckedChange={onAutoLogoutToggle}
          />
        </div>

        {autoLogoutEnabled && (
          <div className="space-y-3 pl-6 border-l-2 border-blue-200 dark:border-blue-800">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                タイムアウト時間
              </Label>
              <Select
                value={autoLogoutTimeout.toString()}
                onValueChange={(value) => onAutoLogoutTimeoutChange?.(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeoutOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                <p className="font-medium">自動ログアウトについて</p>
                <p>・設定時間無操作でログアウト前に警告を表示</p>
                <p>・警告表示後60秒でログアウト実行</p>
                <p>・マウス、キーボード、タッチ操作で時間リセット</p>
                <p>・セキュリティ向上のための機能です</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* アラート設定 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">医療アラート</Label>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm">薬剤相互作用・アレルギー警告</span>
          </div>
          <Switch
            checked={alertsEnabled}
            onCheckedChange={onAlertsToggle}
          />
        </div>
      </div>

      <Separator />

      {/* キーボードショートカット */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center space-x-2">
          <Keyboard className="w-4 h-4" />
          <span>キーボードショートカット</span>
        </Label>
        <div className="space-y-2">
          {keyboardShortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{shortcut.action}</span>
              <Badge variant="outline" className="text-xs font-mono">
                {shortcut.key}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* システム情報 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">システム情報</Label>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>バージョン: v2.1.0</div>
          <div>最終更新: 2024/12/27</div>
          <div>セッション: {new Date().toLocaleDateString()}</div>
          {autoLogoutEnabled && (
            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
              <Timer className="w-3 h-3" />
              <span>自動ログアウト: {autoLogoutTimeout}分で有効</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}