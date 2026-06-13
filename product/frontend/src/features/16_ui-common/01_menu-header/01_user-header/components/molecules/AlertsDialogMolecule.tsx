import { useState } from "react";
import { Bell, X, Check, AlertTriangle, Info, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import { Button } from "@shared/components/atoms/button";
import { Badge } from "@shared/components/atoms/badge";
import { Card } from "@shared/components/atoms/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/components/atoms/dialog";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import type { UserAlert } from "../types/patient-types";

const ICON_CONFIG = {
  warning: { icon: AlertTriangle, color: "text-orange-500", dismissedColor: "text-gray-400" },
  system: { icon: Info, color: "text-blue-500", dismissedColor: "text-gray-400" },
  task: { icon: CheckCircle, color: "text-green-500", dismissedColor: "text-gray-400" },
  notification: { icon: AlertCircle, color: "text-red-500", dismissedColor: "text-gray-400" },
} as const;

type AlertsDialogMoleculeProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userAlerts: UserAlert[];
  onDismissAlert?: (alertId: string) => void;
};

export function AlertsDialogMolecule({ isOpen, onOpenChange, userAlerts, onDismissAlert }: AlertsDialogMoleculeProps) {
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const unreadCount = userAlerts.filter((a) => !a.dismissed).length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span>通知一覧</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">{unreadCount}件未対応</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              <X className="h-4 w-4 mr-1" />
              <span className="text-sm">閉じる</span>
            </Button>
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            システムからの通知メッセージを表示します
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96 mt-4">
          <div className="space-y-2">
            {userAlerts.length > 0 ? (
              userAlerts.map((alert) => {
                const config = ICON_CONFIG[alert.type as keyof typeof ICON_CONFIG] || ICON_CONFIG.system;
                const IconComponent = config.icon;
                const isExpanded = expandedAlertId === alert.id;
                const isDismissed = alert.dismissed;

                return (
                  <div
                    key={alert.id}
                    className={`rounded-lg p-3 border-l-4 ${
                      isDismissed
                        ? "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                        : "bg-gray-50 dark:bg-gray-800 border-blue-500 hover:bg-gray-100 dark:hover:bg-gray-750"
                    } relative transition-colors`}
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <IconComponent className={`w-5 h-5 ${isDismissed ? config.dismissedColor : config.color}`} />
                        <span className={`text-sm ${isDismissed ? "text-gray-500 dark:text-gray-500" : "text-gray-900 dark:text-gray-100"}`}>
                          {alert.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!isDismissed && <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">未対応</Badge>}
                        <span className="text-xs text-gray-500 dark:text-gray-400">{alert.timestamp}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className={`text-sm mb-3 ${isDismissed ? "text-gray-500 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`}>
                          {alert.message}
                        </p>
                        {!isDismissed && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDismissAlert?.(alert.id);
                              setExpandedAlertId(null);
                            }}
                            className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 h-auto"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            対応済み
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <Card className="p-8">
                <div className="text-center space-y-4">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-lg mb-2">アラートはありません</h3>
                    <p className="text-sm text-muted-foreground">新しい通知があると、こちらに表示されます</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
