"use client";
import { useCallback, useState } from "react";
import type { Notification } from "../types/notification.type";

// TODO: BFF GET /api/v1/notifications はF0bスコープ外。将来的に差し替える
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "代行入力の承認依頼",
    message: "田中医師から3件の代行入力データの承認が必要です。",
    timestamp: "2025-12-19 09:30",
    isRead: false,
    type: "warning",
  },
  {
    id: "2",
    title: "システムメンテナンスのお知らせ",
    message: "12月25日 22:00〜24:00の間、システムメンテナンスを実施します。",
    timestamp: "2025-12-19 08:00",
    isRead: false,
    type: "info",
  },
  {
    id: "3",
    title: "検査結果が更新されました",
    message: "患者ID: 12345 の血液検査結果が登録されました。",
    timestamp: "2025-12-18 16:45",
    isRead: false,
    type: "success",
  },
  {
    id: "4",
    title: "重要: データ入力エラー",
    message: "入院カルテ入力時にエラーが発生しました。システム管理者にお問い合わせください。",
    timestamp: "2025-12-18 14:20",
    isRead: false,
    type: "error",
  },
  {
    id: "5",
    title: "新機能のお知らせ",
    message: "病棟マップ機能がアップデートされました。新しいフィルター機能をご利用いただけます。",
    timestamp: "2025-12-17 10:00",
    isRead: false,
    type: "info",
  },
];

interface UseNotificationActionsReturn {
  notifications: Notification[];
  expandedNotifications: Set<string>;
  unreadCount: number;
  handleMarkAsRead: (id: string) => void;
  handleMarkAllAsRead: () => void;
  toggleNotificationExpand: (id: string) => void;
}

export function useNotificationActions(): UseNotificationActionsReturn {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const toggleNotificationExpand = useCallback((id: string) => {
    setExpandedNotifications((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return {
    notifications,
    expandedNotifications,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    toggleNotificationExpand,
  };
}
