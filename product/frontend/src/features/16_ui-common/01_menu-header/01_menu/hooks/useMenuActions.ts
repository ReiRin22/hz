"use client";
import { useCallback, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  User, Calendar, FileText, Folder, Building, Settings,
  Image, FileEdit, Database, Map, Search, LogOut,
} from "lucide-react";
import type { MenuItem } from "../types/menu-item.type";
import type { ThemeColor } from "../types/theme.type";
import type { MenuItemResponse } from "@/front_bff_shared/features/ui-common/menu-header/menu/types/responses/menu.response";
import { useMenuItems } from "./useMenuItems";
import { toast } from "sonner";

const ICON_MAP: Record<string, LucideIcon> = {
  User, Search, Calendar, FileText, Folder, Map,
  Image, FileEdit, Building, Database, Settings, LogOut,
};

function toMenuItem(item: MenuItemResponse): MenuItem {
  return {
    id: item.id,
    title: item.title,
    icon: ICON_MAP[item.iconName] ?? Settings,
    visible: item.visible,
    isFavorite: item.isFavorite,
    type: item.type,
    url: item.url,
    children: item.children?.map(toMenuItem),
    parentId: item.parentId,
  };
}

interface UseMenuActionsReturn {
  menuItems: MenuItem[];
  tempMenuItems: MenuItem[];
  tempTheme: ThemeColor;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError: string;
  loading: boolean;
  error: Error | null;
  setTempTheme: (theme: ThemeColor) => void;
  setCurrentPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  handleOpenSettings: (currentTheme: ThemeColor) => void;
  handleToggleVisibility: (id: string) => void;
  handleToggleFavorite: (id: string) => void;
  handleMoveUp: (index: number) => void;
  handleMoveDown: (index: number) => void;
  handleMoveChildUp: (parentId: string, childIndex: number) => void;
  handleMoveChildDown: (parentId: string, childIndex: number) => void;
  handleSaveSettings: (onThemeChange: (theme: ThemeColor) => void, onClose: () => void) => void;
  handleCancelSettings: (currentTheme: ThemeColor, onClose: () => void) => void;
  handleChangePassword: () => void;
}

export function useMenuActions(): UseMenuActionsReturn {
  const { items: apiItems, loading, error } = useMenuItems();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tempMenuItems, setTempMenuItems] = useState<MenuItem[]>([]);
  const [tempTheme, setTempTheme] = useState<ThemeColor>({
    name: "ブルー", value: "blue", primary: "#3B82F6", secondary: "#DBEAFE",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (apiItems.length > 0) {
      const mapped = apiItems.map(toMenuItem);
      setMenuItems(mapped);
      setTempMenuItems(mapped);
    }
  }, [apiItems]);

  const handleOpenSettings = useCallback((currentTheme: ThemeColor) => {
    setTempMenuItems((prev) => [...prev]);
    setTempTheme(currentTheme);
  }, []);

  const handleToggleVisibility = useCallback((id: string) => {
    setTempMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, visible: !item.visible };
        }
        if (item.children) {
          const childIndex = item.children.findIndex((c) => c.id === id);
          if (childIndex !== -1) {
            const newChildren = [...item.children];
            newChildren[childIndex] = {
              ...newChildren[childIndex],
              visible: !newChildren[childIndex].visible,
            };
            return { ...item, children: newChildren };
          }
        }
        return item;
      })
    );
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setTempMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, isFavorite: !item.isFavorite };
        }
        if (item.children) {
          const childIndex = item.children.findIndex((c) => c.id === id);
          if (childIndex !== -1) {
            const newChildren = [...item.children];
            newChildren[childIndex] = {
              ...newChildren[childIndex],
              isFavorite: !newChildren[childIndex].isFavorite,
            };
            return { ...item, children: newChildren };
          }
        }
        return item;
      })
    );
  }, []);

  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return;
    setTempMenuItems((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const handleMoveDown = useCallback((index: number) => {
    setTempMenuItems((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const handleMoveChildUp = useCallback((parentId: string, childIndex: number) => {
    if (childIndex === 0) return;
    setTempMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === parentId && item.children) {
          const newChildren = [...item.children];
          [newChildren[childIndex - 1], newChildren[childIndex]] = [
            newChildren[childIndex],
            newChildren[childIndex - 1],
          ];
          return { ...item, children: newChildren };
        }
        return item;
      })
    );
  }, []);

  const handleMoveChildDown = useCallback((parentId: string, childIndex: number) => {
    setTempMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === parentId && item.children && childIndex < item.children.length - 1) {
          const newChildren = [...item.children];
          [newChildren[childIndex], newChildren[childIndex + 1]] = [
            newChildren[childIndex + 1],
            newChildren[childIndex],
          ];
          return { ...item, children: newChildren };
        }
        return item;
      })
    );
  }, []);

  const handleSaveSettings = useCallback(
    (onThemeChange: (theme: ThemeColor) => void, onClose: () => void) => {
      setMenuItems(tempMenuItems);
      onThemeChange(tempTheme);
      onClose();
    },
    [tempMenuItems, tempTheme]
  );

  const handleCancelSettings = useCallback(
    (currentTheme: ThemeColor, onClose: () => void) => {
      setTempMenuItems([...menuItems]);
      setTempTheme(currentTheme);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      onClose();
    },
    [menuItems]
  );

  const handleChangePassword = useCallback(() => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("すべての項目を入力してください");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("新しいパスワードが一致しません");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("パスワードは8文字以上で設定してください");
      return;
    }

    // TODO: BFF POST /api/v1/auth/password-change はF0bスコープ外
    toast.success("パスワードが変更されました");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  }, [currentPassword, newPassword, confirmPassword]);

  return {
    menuItems,
    tempMenuItems,
    tempTheme,
    currentPassword,
    newPassword,
    confirmPassword,
    passwordError,
    loading,
    error,
    setTempTheme,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    handleOpenSettings,
    handleToggleVisibility,
    handleToggleFavorite,
    handleMoveUp,
    handleMoveDown,
    handleMoveChildUp,
    handleMoveChildDown,
    handleSaveSettings,
    handleCancelSettings,
    handleChangePassword,
  };
}
