'use client'

import { usePathname } from 'next/navigation'
import { UserHeader } from '@/shared/components/molecules/user-header'
import type { CurrentUserResponse, UserAlertResponse } from '@/shared/types/current-user.response'

const HIDDEN_PATHS = ['/ui-common/menu-header/login']

interface AppHeaderProps {
  currentUser: CurrentUserResponse
  userAlerts: UserAlertResponse[]
  proxyApprovalCount: number
  hpkiRemainingTime?: string
}

export function AppHeader(props: AppHeaderProps) {
  const pathname = usePathname()
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null
  return <UserHeader {...props} />
}
