import { Button } from "@/shared/components/atoms/button";
import { Badge } from "@/shared/components/atoms/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/atoms/dialog";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Check, X } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import type { Notification } from "../../types/notification.type";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

type NotificationDialogProps = {
  open: boolean;
  notifications: Notification[];
  expandedNotifications: Set<string>;
  unreadCount: number;
  theme: ThemeColor;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onToggleExpand: (id: string) => void;
};

export function NotificationDialog({
  open,
  notifications,
  expandedNotifications,
  unreadCount,
  theme,
  onOpenChange,
  onMarkAsRead,
  onMarkAllAsRead,
  onToggleExpand,
}: NotificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t.notificationDialog.title}</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-600 text-white">{t.notificationDialog.unread}{unreadCount}{t.notificationDialog.unreadSuffix}</Badge>
            )}
          </DialogTitle>
          <DialogDescription>{t.notificationDialog.description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mb-3">
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            {t.notificationDialog.markAllRead}
          </Button>
        </div>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">{t.notificationDialog.noNotifications}</div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  isExpanded={expandedNotifications.has(notification.id)}
                  theme={theme}
                  onToggleExpand={onToggleExpand}
                  onMarkAsRead={onMarkAsRead}
                />
              ))
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4 border-t">
          <Button variant="default" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            {i18n.common.buttons.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
