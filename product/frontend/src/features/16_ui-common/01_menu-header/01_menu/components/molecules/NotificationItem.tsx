import { Button } from "@/shared/components/atoms/button";
import { Badge } from "@/shared/components/atoms/badge";
import { AlertCircle, AlertTriangle, CheckCircle, Info, ChevronDown, Check } from "lucide-react";
import type { Notification } from "../../types/notification.type";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "error": return <AlertCircle className="h-5 w-5 text-red-600" />;
    case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case "success": return <CheckCircle className="h-5 w-5 text-green-600" />;
    default: return <Info className="h-5 w-5 text-blue-600" />;
  }
}

function getNotificationBgColor(type: Notification["type"]) {
  switch (type) {
    case "error": return "#FEE2E2";
    case "warning": return "#FEF3C7";
    case "success": return "#D1FAE5";
    default: return "#DBEAFE";
  }
}

type NotificationItemProps = {
  notification: Notification;
  isExpanded: boolean;
  theme: ThemeColor;
  onToggleExpand: (id: string) => void;
  onMarkAsRead: (id: string) => void;
};

export function NotificationItem({
  notification,
  isExpanded,
  theme,
  onToggleExpand,
  onMarkAsRead,
}: NotificationItemProps) {
  return (
    <div
      className={`rounded-lg border-2 transition-all cursor-pointer ${notification.isRead ? "opacity-60" : "shadow-md"}`}
      style={{
        backgroundColor: notification.isRead ? "#F9FAFB" : getNotificationBgColor(notification.type),
        borderColor: notification.isRead ? "#E5E7EB" : theme.primary,
      }}
    >
      <div
        className="flex items-center gap-3 p-3 hover:bg-black/5 transition-colors"
        onClick={() => onToggleExpand(notification.id)}
      >
        <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <span className="font-semibold text-gray-900 truncate">{notification.title}</span>
          {!notification.isRead && (
            <Badge className="bg-red-600 text-white text-xs flex-shrink-0">{t.notificationDialog.newBadge}</Badge>
          )}
          <span className="text-xs text-gray-500 ml-auto flex-shrink-0">{notification.timestamp}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onMarkAsRead(notification.id); }}
              className="h-7 px-2"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </div>
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 border-t border-gray-200">
          <p className="text-sm text-gray-700 mt-3">{notification.message}</p>
        </div>
      )}
    </div>
  );
}
