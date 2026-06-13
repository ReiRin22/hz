'use client'

import { LogOut, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/atoms/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/shared/components/atoms/alert-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/atoms/tooltip'

interface LogoutButtonProps {
  onLogout?: () => void
  isAutoLogoutWarningVisible?: boolean
  onExtendSession?: () => void
}

export function LogoutButton({
  onLogout,
  isAutoLogoutWarningVisible = false,
  onExtendSession,
}: LogoutButtonProps) {
  const handleLogout = () => {
    toast.success('ログアウトしました')
    onLogout?.()
  }

  return (
    <>
      {/* 手動ログアウトボタン＋確認ダイアログ */}
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>ログアウト</p>
          </TooltipContent>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ログアウト確認</AlertDialogTitle>
            <AlertDialogDescription>
              本当にログアウトしますか？保存していない変更は失われる可能性があります。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
              ログアウト
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 自動ログアウト警告ダイアログ */}
      {/* Escape キーや背景クリックでの閉鎖を意図的に無効化（セッション延長orログアウトのいずれかで閉じる） */}
      <AlertDialog open={isAutoLogoutWarningVisible} onOpenChange={() => {}}>
        <AlertDialogContent className="sm:max-w-[450px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span>自動ログアウト警告</span>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mb-3">
                    しばらく操作がありませんでした。セキュリティのため、まもなく自動ログアウトします。
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 text-amber-600 dark:text-amber-400">
                      {/* TODO: 認証基盤実装後に autoLogoutRemainingTime prop を使った動的表示に変更する */}
                      <span className="text-sm">あと1分後に自動ログアウトされます</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-3">
                    セッションを継続する場合は「セッション延長」をクリックしてください。保存していない変更がある場合は、必ず保存してください。
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={onExtendSession}
              className="medical-primary hover:bg-blue-700 text-white"
            >
              セッション延長
            </AlertDialogAction>
            <AlertDialogCancel onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
              今すぐログアウト
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
