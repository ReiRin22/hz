'use client';

import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { resetAllStores } from '../stores/storeRegistry';

// harz:tenant は tenantStore 永続化方針確定後（残件#5）に追加判定。
// harz:auth は authStore が persist なしのため対象外。
const LOGOUT_STORAGE_KEY_PREFIXES = ['harz:theme'];

function clearLogoutLocalStorage(): void {
  if (LOGOUT_STORAGE_KEY_PREFIXES.length === 0) {
    return;
  }

  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && LOGOUT_STORAGE_KEY_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

export interface UseTenantCleanupReturn {
  cleanup: (redirectTo?: string) => void;
}

export function useTenantCleanup(): UseTenantCleanupReturn {
  const queryClient = useQueryClient();

  const cleanup = useCallback((redirectTo = '/login'): void => {
    // TODO: refs #11435 Step 0: WebSocket接続を切断する（08.リアルタイム通信実装後に追加）
    // リセット前に切断しないと新着データがリセット後のストアに書き込まれるリスクがある。

    try {
      // Step 1: React Query キャッシュを全削除
      queryClient.clear();

      // Step 2: 全 Zustand Store を初期化（②の直後にpersistが初期値をLocalStorageに書き込む）
      resetAllStores();

      // Step 3: 対象キーの LocalStorage を削除（②の後に実行することでpersistの再書き込みごと削除）
      // プライベートブラウジング等で SecurityError が発生する可能性があるため独立した try-catch で囲う
      try {
        clearLogoutLocalStorage();
      } catch (error: unknown) {
        console.error('[useTenantCleanup] localStorage clear failed:', error);
        // TODO: Sentry への記録（Sentry実装後に追加）
      }
    } catch (error: unknown) {
      console.error('[useTenantCleanup] cleanup step failed:', error);
      // TODO: Sentry への記録（Sentry実装後に追加）
      // ①〜③の部分的な失敗は④のハードリダイレクトでJSランタイムごとリセットされるため続行する
    } finally {
      // Step 4: ハードリダイレクト（React 内部状態ごとリセット）
      // 設計書「④は例外なく必ず実行する」に従い finally で確実に実行する
      // next/router ではなく window.location.href を使うことでJSヒープ上の残存状態を完全にリセットする
      window.location.href = redirectTo;
    }
  }, [queryClient]);

  return { cleanup };
}
