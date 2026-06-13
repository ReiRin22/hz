import { FileCheck, FileX, AlertTriangle } from "lucide-react";
import { Badge } from "@shared/components/atoms/badge";

export type PrescriptionStatus = "electronic" | "paper" | "disconnected";

interface PrescriptionStatusBadgeProps {
  status: PrescriptionStatus;
  onClick?: () => void;
  className?: string;
}

export function PrescriptionStatusBadge({
  status,
  onClick,
  className = ""
}: PrescriptionStatusBadgeProps) {
  // ステータス情報の設定
  const getStatusInfo = (status: PrescriptionStatus) => {
    switch (status) {
      case "electronic":
        return {
          icon: FileCheck,
          label: "電子",
          color: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
          iconColor: "text-green-600 dark:text-green-400"
        };
      case "paper":
        return {
          icon: FileX,
          label: "紙",
          color: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
          iconColor: "text-gray-600 dark:text-gray-400"
        };
      case "disconnected":
        return {
          icon: AlertTriangle,
          label: "未連携",
          color: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
          iconColor: "text-orange-600 dark:text-orange-400"
        };
      default:
        return {
          icon: AlertTriangle,
          label: "不明",
          color: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
          iconColor: "text-gray-600 dark:text-gray-400"
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center space-x-1.5 px-2 py-0.5 border cursor-pointer hover:shadow-sm transition-shadow ${statusInfo.color} ${className}`}
      onClick={onClick}
      title={`処方箋: ${statusInfo.label}${onClick ? ' - クリックで変更' : ''}`}
    >
      <StatusIcon className={`w-3 h-3 ${statusInfo.iconColor}`} />
      <span className="text-xs font-medium">
        {statusInfo.label}
      </span>
    </Badge>
  );
}