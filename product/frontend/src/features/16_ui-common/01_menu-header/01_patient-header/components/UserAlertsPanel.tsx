import { Bell, X, AlertTriangle, Info, CheckCircle, Warning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Button } from "@/shared/components/atoms/button";
import { Badge } from "@/shared/components/atoms/badge";
import { Separator } from "@/shared/components/atoms/separator";

interface UserAlert {
  id: string;
  type: 'system' | 'task' | 'notification' | 'warning';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  dismissed: boolean;
  userId: string;
}

interface UserAlertsPanelProps {
  alerts: UserAlert[];
  onDismissAlert: (alertId: string) => void;
  currentUser: any;
}

const alertTypeConfig = {
  system: {
    icon: Info,
    color: "bg-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    label: "システム"
  },
  task: {
    icon: CheckCircle,
    color: "bg-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    label: "タスク"
  },
  notification: {
    icon: Bell,
    color: "bg-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300",
    label: "通知"
  },
  warning: {
    icon: AlertTriangle,
    color: "bg-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    textColor: "text-amber-700 dark:text-amber-300",
    label: "警告"
  }
};

const priorityConfig = {
  low: { color: "bg-gray-500", label: "低" },
  medium: { color: "bg-blue-500", label: "中" },
  high: { color: "bg-orange-500", label: "高" },
  critical: { color: "bg-red-500", label: "緊急" }
};

export function UserAlertsPanel({ alerts, onDismissAlert, currentUser }: UserAlertsPanelProps) {
  const activeAlerts = alerts.filter(alert => !alert.dismissed);
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ユーザーアラート
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentUser.name}さん宛て
              </p>
            </div>
          </div>
          {activeAlerts.length > 0 && (
            <Badge className="bg-red-500 text-white shadow-md">
              {activeAlerts.length}件
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-muted-foreground">
              現在、アクティブなアラートはありません
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert, index) => {
              const typeConfig = alertTypeConfig[alert.type];
              const priorityInfo = priorityConfig[alert.priority];
              const Icon = typeConfig.icon;

              return (
                <div
                  key={alert.id}
                  className={`p-4 ${typeConfig.bgColor} ${typeConfig.borderColor} border rounded-xl backdrop-blur-sm transition-all duration-200 hover:shadow-lg fade-in-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${typeConfig.color} text-white shadow-md flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={`text-xs ${typeConfig.color} text-white shadow-sm`}>
                            {typeConfig.label}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${priorityInfo.color} text-white border-0`}
                          >
                            {priorityInfo.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                        </div>
                        <h4 className={`font-medium ${typeConfig.textColor} mb-1`}>
                          {alert.title}
                        </h4>
                        <p className={`text-sm ${typeConfig.textColor} opacity-80 leading-relaxed`}>
                          {alert.message}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismissAlert(alert.id)}
                      className="text-gray-500 hover:text-gray-700 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 flex-shrink-0 ml-2"
                      title="アラートを非表示"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}