'use client'

import { User } from 'lucide-react'
import type { CurrentUser } from '@/shared/types/patient-types'

interface LoginUserInfoProps {
  currentUser: CurrentUser
  // TODO: 認証基盤実装後に HPKI 残り時間を API から取得して渡す
  hpkiRemainingTime?: string
}

export function LoginUserInfo({ currentUser, hpkiRemainingTime = '' }: LoginUserInfoProps) {
  return (
    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 ml-8">
      <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md">
        <User className="h-4 w-4" />
        <span className="font-medium">{currentUser.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ID: {currentUser.id}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {currentUser.role}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {currentUser.department}
        </span>
        {hpkiRemainingTime && (
          <>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {hpkiRemainingTime}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
