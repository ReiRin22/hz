'use client'

import { Badge } from '@/shared/components/atoms/badge'
import { TooltipProvider } from '@/shared/components/atoms/tooltip'
import { LoginUserInfo } from '@/shared/components/molecules/login-user-info'
import { ProxyApprovalBadge } from '@/shared/components/molecules/proxy-approval-badge'
import { StickyNotesDialog } from '@/shared/components/molecules/sticky-notes-dialog'
import { TempDataDialog } from '@/shared/components/molecules/temp-data-dialog'
import { UserAlertsDialog } from '@/shared/components/molecules/user-alerts-dialog'
import { MenuSettingsDialog } from '@/shared/components/molecules/menu-settings-dialog'
import { LogoutButton } from '@/shared/components/molecules/logout-button'
import type { CurrentUserResponse, UserAlertResponse } from '@/shared/types/current-user.response'

interface UserHeaderProps {
  currentUser: CurrentUserResponse
  userAlerts: UserAlertResponse[]
  proxyApprovalCount: number
  hpkiRemainingTime?: string
  onDismissAlert?: (alertId: string) => void
  onLogout?: () => void
  isAutoLogoutWarningVisible?: boolean
  onExtendSession?: () => void
  autoLogoutEnabled?: boolean
  themeColor?: string
  onThemeColorChange?: (color: string) => void
}

export function UserHeader({
  currentUser,
  userAlerts,
  proxyApprovalCount,
  hpkiRemainingTime,
  onDismissAlert,
  onLogout,
  isAutoLogoutWarningVisible = false,
  onExtendSession,
  autoLogoutEnabled = false,
  themeColor = 'blue',
  onThemeColorChange,
}: UserHeaderProps) {
  return (
    <header className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center">
      {/* ロゴ・システム名 */}
      <div className="flex items-center">
        <h1 className="text-lg font-medium text-gray-900 dark:text-white">
          Harz
          {autoLogoutEnabled && (
            <Badge variant="outline" className="ml-2 text-xs">
              自動ログアウト有効
            </Badge>
          )}
        </h1>
      </div>

      {/* ユーザー情報 */}
      <LoginUserInfo currentUser={currentUser} hpkiRemainingTime={hpkiRemainingTime} />

      {/* 代行入力未承認数 */}
      <ProxyApprovalBadge count={proxyApprovalCount} />

      {/* アクションボタン群 */}
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <StickyNotesDialog />
          <TempDataDialog />
          <UserAlertsDialog userAlerts={userAlerts} onDismissAlert={onDismissAlert} />
          <MenuSettingsDialog themeColor={themeColor} onThemeColorChange={onThemeColorChange} />
          <LogoutButton
            onLogout={onLogout}
            isAutoLogoutWarningVisible={autoLogoutEnabled && isAutoLogoutWarningVisible}
            onExtendSession={onExtendSession}
          />
        </TooltipProvider>
      </div>
    </header>
  )
}
