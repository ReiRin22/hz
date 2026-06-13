'use client';

import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useGlobalHeaderStore } from '../stores/use-global-header.store';

export function useGlobalHeaderActions() {
  const darkMode = useGlobalHeaderStore((s) => s.darkMode);
  const themeColor = useGlobalHeaderStore((s) => s.themeColor);
  const autoLogoutTimeout = useGlobalHeaderStore((s) => s.autoLogoutTimeout);
  const setDarkMode = useGlobalHeaderStore((s) => s.setDarkMode);
  const setThemeColor = useGlobalHeaderStore((s) => s.setThemeColor);
  const setAutoSaveEnabled = useGlobalHeaderStore((s) => s.setAutoSaveEnabled);
  const setAlertsEnabled = useGlobalHeaderStore((s) => s.setAlertsEnabled);
  const setAutoLogoutEnabled = useGlobalHeaderStore((s) => s.setAutoLogoutEnabled);
  const setAutoLogoutTimeout = useGlobalHeaderStore((s) => s.setAutoLogoutTimeout);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const themeClasses = [
      'theme-blue', 'theme-green', 'theme-purple', 'theme-pink',
      'theme-orange', 'theme-red', 'theme-white', 'theme-black',
    ];
    themeClasses.forEach((cls) => document.documentElement.classList.remove(cls));
    document.documentElement.classList.add(`theme-${themeColor}`);
  }, [themeColor]);

  const handleDarkModeToggle = useCallback((enabled: boolean) => {
    setDarkMode(enabled);
  }, [setDarkMode]);

  const handleThemeColorChange = useCallback((color: string) => {
    setThemeColor(color);
  }, [setThemeColor]);

  const handleAutoSaveToggle = useCallback((enabled: boolean) => {
    setAutoSaveEnabled(enabled);
  }, [setAutoSaveEnabled]);

  const handleAlertsToggle = useCallback((enabled: boolean) => {
    setAlertsEnabled(enabled);
  }, [setAlertsEnabled]);

  const handleAutoLogoutToggle = useCallback((enabled: boolean) => {
    setAutoLogoutEnabled(enabled);
    if (enabled) {
      toast.success('自動ログアウト機能を有効にしました', {
        description: `${autoLogoutTimeout}分間無操作でログアウトします`,
      });
    } else {
      toast.info('自動ログアウト機能を無効にしました');
    }
  }, [autoLogoutTimeout, setAutoLogoutEnabled]);

  const handleAutoLogoutTimeoutChange = useCallback((minutes: number) => {
    setAutoLogoutTimeout(minutes);
    toast.info(`自動ログアウト時間を${minutes}分に変更しました`);
  }, [setAutoLogoutTimeout]);

  return {
    handleDarkModeToggle,
    handleThemeColorChange,
    handleAutoSaveToggle,
    handleAlertsToggle,
    handleAutoLogoutToggle,
    handleAutoLogoutTimeoutChange,
  };
}
