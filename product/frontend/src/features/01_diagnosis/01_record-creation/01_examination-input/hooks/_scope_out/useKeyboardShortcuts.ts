import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  hasUnsavedChanges: boolean;
  orders: any[];
  handleBulkSave: () => void;
  handleNewRecordMode: () => void;
}

export function useKeyboardShortcuts({
  hasUnsavedChanges,
  orders,
  handleBulkSave,
  handleNewRecordMode
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            if (hasUnsavedChanges || orders.length > 0) {
              handleBulkSave();
            }
            break;
          case "n":
            e.preventDefault();
            handleNewRecordMode();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [hasUnsavedChanges, orders, handleBulkSave, handleNewRecordMode]);
}