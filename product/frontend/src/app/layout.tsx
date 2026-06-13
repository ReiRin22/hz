import type { Metadata } from "next";
import ReactQueryProvider from "./../shared/plugins/ReactQueryProvider"
import { SentryInitializer } from "./../shared/plugins/SentryInitializer";
import { AppHeader } from "@/shared/components/molecules/app-header";
import { MockProvider } from "@/shared/mocks/MockProvider";
import type { GetCurrentUserResponse } from "@/shared/types/current-user.response";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Harz',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const res = await fetch(`${process.env.BFF_INTERNAL_URL}/bff/current-user`, { cache: 'no-store' })
    console.log('[layout.tsx] fetch response status:', res.status)
    if (!res.ok) {
      throw new Error(`BFF fetch failed: ${res.status}`)
    }
    const { currentUser, userAlerts, proxyApprovalCount, hpkiRemainingTime } =
      (await res.json()) as GetCurrentUserResponse

    return (
      <html lang="ja">
        <body className="flex flex-col h-screen">
          <SentryInitializer />
          <ReactQueryProvider>
            <MockProvider>
              <AppHeader
                currentUser={currentUser}
                userAlerts={userAlerts}
                proxyApprovalCount={proxyApprovalCount}
                hpkiRemainingTime={hpkiRemainingTime}
              />
              <div className="flex-1 overflow-hidden h-full">
                {children}
              </div>
            </MockProvider>
          </ReactQueryProvider>
        </body>
      </html>
    )
  } catch (error) {
    console.error('[layout.tsx] BFF fetch error:', error)
    throw error
  }
}
