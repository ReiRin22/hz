'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

export function MockProvider({ children }: { children: ReactNode }) {
  const [mockReady, setMockReady] = useState(!IS_DEVELOPMENT)

  useEffect(() => {
    if (!IS_DEVELOPMENT) return

    async function init() {
      const { worker } = await import('./browser')
      await worker.start({
        // 未処理のリクエストはバイパス（Next.jsページナビゲーションなど）
        onUnhandledRequest: 'bypass',
        // エラーを抑制
        quiet: false,
        // Service Workerのパス
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      })
      setMockReady(true)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- IS_DEVELOPMENT はモジュールスコープの定数・init はマウント時の1回だけ実行すればよいため依存配列から除外
  }, [])

  if (!mockReady) return null
  return <>{children}</>
}
