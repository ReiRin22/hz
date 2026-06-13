"use client";
import { useEffect, useState } from "react";
import type { MenuItemResponse } from "@/front_bff_shared/features/ui-common/menu-header/menu/types/responses/menu.response";
import { BffApiError, classifyHttpError } from "@/shared/utils/bff-error";
import { getMenuItems } from "../api/getMenuItems.api";

export function useMenuItems() {
  const [items, setItems] = useState<MenuItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMenuItems()
      .then((res) => { if (!cancelled) setItems(res.items); })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof BffApiError) {
          // 初期表示失敗は画面全体が使えないため error.tsx に委譲
          setError(err);
        } else if (
          err != null &&
          typeof err === 'object' &&
          'response' in err &&
          err.response != null &&
          typeof err.response === 'object' &&
          'status' in err.response &&
          typeof err.response.status === 'number'
        ) {
          setError(classifyHttpError(err.response.status));
        } else {
          setError(new BffApiError('E999', 0, 'システムエラーが発生しました'));
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}
