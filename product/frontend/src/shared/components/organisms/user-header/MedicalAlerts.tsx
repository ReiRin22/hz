import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/atoms/card";
import { Alert, AlertDescription } from "@shared/components/atoms/alert";
import { Badge } from "@shared/components/atoms/badge";
import { Button } from "@shared/components/atoms/button";
import { Separator } from "@shared/components/atoms/separator";
import { AlertTriangle, Shield, X, Pill, Activity, Calendar } from "lucide-react";
import { useState } from "react";

interface MedicalAlert {
  id: string;
  type: "critical" | "warning" | "info";
  category: "allergy" | "interaction" | "vital" | "lab" | "schedule" | "system" | "documentation" | "workflow";
  title: string;
  message: string;
  timestamp: string;
  dismissed?: boolean;
}

interface MedicalAlertsProps {
  alerts: MedicalAlert[];
  onDismissAlert: (alertId: string) => void;
  enabled: boolean;
}

const alertConfig = {
  critical: { 
    color: "destructive", 
    icon: AlertTriangle, 
    bgColor: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800" 
  },
  warning: { 
    color: "default", 
    icon: Shield, 
    bgColor: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800" 
  },
  info: { 
    color: "secondary", 
    icon: Activity, 
    bgColor: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800" 
  },
};

const categoryConfig = {
  allergy: { label: "アレルギー", icon: Shield },
  interaction: { label: "薬剤相互作用", icon: Pill },
  vital: { label: "バイタル異常", icon: Activity },
  lab: { label: "検査異常値", icon: Activity },
  schedule: { label: "スケジュール", icon: Calendar },
  // 新患用カテゴリ
  system: { label: "システム", icon: Activity },
  documentation: { label: "書類確認", icon: Shield },
  workflow: { label: "ワークフロー", icon: Activity },
};

// カテゴリ設定を安全に取得する関数
const getCategoryConfig = (category: string) => {
  return categoryConfig[category as keyof typeof categoryConfig] || { 
    label: category, 
    icon: Activity 
  };
};

export function MedicalAlerts({ alerts, onDismissAlert, enabled }: MedicalAlertsProps) {
  const [collapsed, setCollapsed] = useState(false);
  
  if (!enabled) {
    return null;
  }

  const activeAlerts = alerts.filter(alert => !alert.dismissed);
  const criticalAlerts = activeAlerts.filter(alert => alert.type === "critical");
  const warningAlerts = activeAlerts.filter(alert => alert.type === "warning");
  const infoAlerts = activeAlerts.filter(alert => alert.type === "info");

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>医療アラート</span>
            <Badge variant="destructive" className="text-xs">
              {activeAlerts.length}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? "+" : "−"}
          </Button>
        </div>
      </CardHeader>
      
      {!collapsed && (
        <CardContent className="space-y-4">
          {/* 重要アラート */}
          {criticalAlerts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">緊急</span>
                <Badge variant="destructive" className="text-xs">
                  {criticalAlerts.length}
                </Badge>
              </div>
              {criticalAlerts.map((alert) => (
                <Alert key={alert.id} className={alertConfig[alert.type].bgColor}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryConfig(alert.category).label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </span>
                      </div>
                      <AlertDescription className="text-sm font-medium">
                        {alert.title}
                      </AlertDescription>
                      <AlertDescription className="text-xs mt-1">
                        {alert.message}
                      </AlertDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismissAlert(alert.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {criticalAlerts.length > 0 && warningAlerts.length > 0 && <Separator />}

          {/* 警告アラート */}
          {warningAlerts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-600">警告</span>
                <Badge variant="secondary" className="text-xs">
                  {warningAlerts.length}
                </Badge>
              </div>
              {warningAlerts.map((alert) => (
                <Alert key={alert.id} className={alertConfig[alert.type].bgColor}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryConfig(alert.category).label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </span>
                      </div>
                      <AlertDescription className="text-sm font-medium">
                        {alert.title}
                      </AlertDescription>
                      <AlertDescription className="text-xs mt-1">
                        {alert.message}
                      </AlertDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismissAlert(alert.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {(warningAlerts.length > 0 || criticalAlerts.length > 0) && infoAlerts.length > 0 && <Separator />}

          {/* 情報アラート */}
          {infoAlerts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">情報</span>
                <Badge variant="secondary" className="text-xs">
                  {infoAlerts.length}
                </Badge>
              </div>
              {infoAlerts.map((alert) => (
                <Alert key={alert.id} className={alertConfig[alert.type].bgColor}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryConfig(alert.category).label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </span>
                      </div>
                      <AlertDescription className="text-sm font-medium">
                        {alert.title}
                      </AlertDescription>
                      <AlertDescription className="text-xs mt-1">
                        {alert.message}
                      </AlertDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismissAlert(alert.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}