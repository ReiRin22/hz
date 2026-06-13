'use client';

import { useState } from 'react';
import type { CreateMySetRequest } from '@/front_bff_shared/features/ui-common/left-sidemenu/order-sets/types/requests/order-sets.request';

interface UseAddMySetDialogOptions {
  createMySet: (req: CreateMySetRequest) => Promise<void>;
}

export function useAddMySetDialog({ createMySet }: UseAddMySetDialogOptions) {
  const [addMySetDialogOpen, setAddMySetDialogOpen] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const resetDialog = () => {
    setNewSetName('');
    setNewSetDescription('');
    setSelectedItems([]);
  };

  const handleSave = async () => {
    try {
      await createMySet({ name: newSetName, description: newSetDescription, items: selectedItems });
      setAddMySetDialogOpen(false);
      resetDialog();
    } catch {
      // エラー時はダイアログを閉じない（useOrderSets 側で errorMessage にセット済み）
    }
  };

  const handleCancel = () => {
    setAddMySetDialogOpen(false);
    resetDialog();
  };

  return {
    addMySetDialogOpen,
    setAddMySetDialogOpen,
    newSetName,
    setNewSetName,
    newSetDescription,
    setNewSetDescription,
    selectedItems,
    setSelectedItems,
    handleSave,
    handleCancel,
  };
}
