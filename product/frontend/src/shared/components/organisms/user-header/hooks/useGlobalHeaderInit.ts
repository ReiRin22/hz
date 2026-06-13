'use client';

import { useEffect } from 'react';
import { useGlobalHeaderStore } from '../stores/use-global-header.store';
import { fetchGlobalHeaderData } from '../repository/globalHeader.repository';

export function useGlobalHeaderInit() {
  const setCurrentUser = useGlobalHeaderStore((s) => s.setCurrentUser);
  const setUserAlerts = useGlobalHeaderStore((s) => s.setUserAlerts);
  const setIsLoading = useGlobalHeaderStore((s) => s.setIsLoading);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchGlobalHeaderData()
      .then((data) => {
        if (cancelled) return;
        setCurrentUser(data.currentUser);
        setUserAlerts(data.userAlerts);
      })
      .catch((err: unknown) => {
        // 初期表示失敗は画面全体が使えないため error.tsx に委譲
        throw err;
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setCurrentUser, setUserAlerts, setIsLoading]);
}
