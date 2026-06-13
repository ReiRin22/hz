'use client';

import { useEffect, useState } from 'react';
import { getRightSideMenuItems } from '../../api/right-side-menu/right-side-menu.api';
import type { RightSideMenuItemResponse } from '@/front_bff_shared/features/ui-common/menu-header/right-sidemenu/types/responses/right-side-menu.response';

type RightSideMenuInitState = {
  items: RightSideMenuItemResponse[];
  error: string | null;
};

export function useRightSideMenuInit(): RightSideMenuInitState {
  const [items, setItems] = useState<RightSideMenuItemResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getRightSideMenuItems()
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .catch(() => {
        if (!cancelled) setError('メニューの取得に失敗しました');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, error };
}
