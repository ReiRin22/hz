'use client';
import { FileCheck, FileX, AlertTriangle } from "lucide-react";
import { Badge } from "@/shared/components/atoms/badge";

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
          color: "bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-blue-300 dark:border-blue-600",
          iconColor: "text-blue-600 dark:text-blue-400"
        };
      case "paper":
        return {
          icon: FileX,
          label: "紙",
          color: "bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-blue-300 dark:border-blue-600",
          iconColor: "text-blue-600 dark:text-blue-400"
        };
      case "disconnected":
        return {
          icon: AlertTriangle,
          label: "未連携",
          color: "bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-blue-300 dark:border-blue-600",
          iconColor: "text-blue-600 dark:text-blue-400"
        };
      default:
        return {
          icon: AlertTriangle,
          label: "不明",
          color: "bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-blue-300 dark:border-blue-600",
          iconColor: "text-blue-600 dark:text-blue-400"
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 border cursor-pointer hover:shadow-sm transition-shadow ${statusInfo.color} ${className}`}
      onClick={onClick}
      title={`処方箋: ${statusInfo.label}${onClick ? ' - クリックで変更' : ''}`}
    >
      <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.iconColor}`} />
      <span className="text-sm font-medium">
        {statusInfo.label}
      </span>
    </Badge>
  );
}