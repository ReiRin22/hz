'use client';
import { UserPlus } from "lucide-react";

interface NewPatientBadgeProps {
  show: boolean;
}

export function NewPatientBadge({ show }: NewPatientBadgeProps) {
  if (!show) return null;

  return (
    <div className="px-6 pb-2">
      <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 max-w-fit">
        <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
        <span className="text-sm font-medium text-green-800 dark:text-green-200">新患</span>
        <span className="text-xs text-green-600 dark:text-green-400">
          初診患者のため過去の記録はありません
        </span>
      </div>
    </div>
  );
}