'use client'

import { Badge } from '@/shared/components/atoms/badge'

interface ProxyApprovalBadgeProps {
  count: number
}

export function ProxyApprovalBadge({ count }: ProxyApprovalBadgeProps) {
  return (
    <div className="ml-auto mr-4 flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-md border border-amber-200 dark:border-amber-800">
      <Badge className="bg-amber-500 text-white animate-pulse" aria-label={`未承認 ${count}件`}>
        未承認
      </Badge>
      <span
        className="font-bold text-amber-700 dark:text-amber-400 text-lg animate-pulse"
        aria-live="polite"
        aria-atomic="true"
      >
        {count}
      </span>
      <span className="text-xs text-amber-600 dark:text-amber-500">件</span>
    </div>
  )
}
