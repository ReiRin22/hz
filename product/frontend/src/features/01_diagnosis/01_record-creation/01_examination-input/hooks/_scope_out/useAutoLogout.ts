import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseAutoLogoutProps {
  timeout: number; // 分単位
  warningDuration: number; // 秒単位
  enabled: boolean;
  onLogout: () => void;
}

interface UseAutoLogoutReturn {
  isWarningVisible: boolean;
  remainingTime: number;
  extendSession: () => void;
  resetTimer: () => void;
  isActive: boolean;
}

export function useAutoLogout({
  timeout,
  warningDuration,
  enabled,
  onLogout
}: UseAutoLogoutProps): UseAutoLogoutReturn {
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(warningDuration);
  const [isActive, setIsActive] = useState(enabled);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const activityListenersAddedRef = useRef<boolean>(false);

  // デバウンス用の参照
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // すべてのタイマーをクリア
  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  // セッション延長
  const extendSession = useCallback(() => {
    clearAllTimers();
    setIsWarningVisible(false);
    setRemainingTime(warningDuration);
    lastActivityRef.current = Date.now();
    
    toast.success('セッションを延長しました');
    
    if (enabled) {
      startMainTimer();
    }
  }, [enabled, warningDuration]);

  // カウントダウンタイマー開始
  const startCountdown = useCallback(() => {
    setIsWarningVisible(true);
    setRemainingTime(warningDuration);
    
    countdownRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearAllTimers();
          setIsWarningVisible(false);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [warningDuration, onLogout, clearAllTimers]);

  // メインタイマー開始
  const startMainTimer = useCallback(() => {
    if (!enabled) return;
    
    clearAllTimers();
    
    // 警告前のタイマー（タイムアウト時間 - 警告時間）
    const warningDelay = (timeout * 60 - warningDuration) * 1000;
    
    timeoutRef.current = setTimeout(() => {
      startCountdown();
    }, Math.max(warningDelay, 1000)); // 最低1秒は確保
  }, [enabled, timeout, warningDuration, startCountdown, clearAllTimers]);

  // デバウンス付きのタイマーリセット
  const resetTimer = useCallback(() => {
    if (!enabled || isWarningVisible) return;
    
    lastActivityRef.current = Date.now();
    
    // デバウンス処理：100ms以内の連続した操作は無視
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      startMainTimer();
    }, 100);
  }, [enabled, isWarningVisible, startMainTimer]);

  // ユーザー操作の検知（デバウンス付き）
  const handleUserActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // 有効化状態の変更に対応
  useEffect(() => {
    if (!enabled) {
      setIsActive(false);
      clearAllTimers();
      setIsWarningVisible(false);
      
      // イベントリスナーの削除
      if (activityListenersAddedRef.current) {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, { passive: true } as any);
        });
        activityListenersAddedRef.current = false;
      }
      return;
    }

    setIsActive(true);
    
    // イベントリスナーの追加（まだ追加されていない場合のみ）
    if (!activityListenersAddedRef.current) {
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, { passive: true });
      });
      activityListenersAddedRef.current = true;
    }

    // 初期タイマー開始
    startMainTimer();

    return () => {
      clearAllTimers();
    };
  }, [enabled, handleUserActivity, startMainTimer, clearAllTimers]);

  // コンポーネントのアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      clearAllTimers();
      
      if (activityListenersAddedRef.current) {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, { passive: true } as any);
        });
        activityListenersAddedRef.current = false;
      }
    };
  }, [clearAllTimers, handleUserActivity]);

  return {
    isWarningVisible,
    remainingTime,
    extendSession,
    resetTimer,
    isActive
  };
}