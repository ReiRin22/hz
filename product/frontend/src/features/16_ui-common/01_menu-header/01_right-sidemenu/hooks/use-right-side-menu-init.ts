'use client';

import { useEffect } from 'react';
import { getRightSideMenuItems } from '../api/right-side-menu.api';
import { useRightSideMenuStore } from '../stores/use-right-side-menu.store';
import type { RightSideMenuItemResponse } from '@/front_bff_shared/types/response/right-side-menu.response.type';

type RightSideMenuInitState = {
  items: RightSideMenuItemResponse[];
  error: string | null;
};

export function useRightSideMenuInit(): RightSideMenuInitState {
  const items = useRightSideMenuStore((s) => s.items);
  const error = useRightSideMenuStore((s) => s.menuFetchError);
  const { setItems, setMenuFetchError } = useRightSideMenuStore();

  useEffect(() => {
    let cancelled = false;
    getRightSideMenuItems()
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .catch(() => {
        if (!cancelled) setMenuFetchError('メニューの取得に失敗しました');
      });
    return () => {
      cancelled = true;
    };
  }, [setItems, setMenuFetchError]);

  return { items, error };
}
