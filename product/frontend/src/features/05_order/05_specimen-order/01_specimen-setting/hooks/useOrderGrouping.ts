'use client';

/**
 * オーダーグループ管理フック
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/hooks/useOrderGrouping.ts
 */

import { useState } from 'react';

export function useOrderGrouping() {
  const [openGroups, setOpenGroups] = useState<{[key: string]: boolean}>({});
  const [editingGroups, setEditingGroups] = useState<{[key: string]: boolean}>({});
  const [groupNotes, setGroupNotes] = useState<{[key: string]: string}>({});
  const [groupPriority, setGroupPriority] = useState<{[key: string]: string}>({});

  return {
    openGroups,
    setOpenGroups,
    editingGroups,
    setEditingGroups,
    groupNotes,
    setGroupNotes,
    groupPriority,
    setGroupPriority
  };
}
