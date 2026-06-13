'use client'

import { usePathname } from 'next/navigation'
import { CheckCircle, Grid3X3, BarChart3 } from 'lucide-react'
import { Tabs } from '@/shared/components/atoms/tabs'
import { MedicalTabsList, type MedicalTab } from '@/shared/components/molecules/medical-tabs-list'
import { ja } from '@/shared/i18n/ja'

const t = ja.karte.karteTabs

const TABS: MedicalTab[] = [
  { value: 'records',  label: t.records,  icon: CheckCircle },
  { value: 'overview', label: t.overview, icon: Grid3X3 },
  { value: 'stats',    label: t.stats,    icon: BarChart3 },
]

function getActiveTab(pathname: string): string {
  if (pathname.includes('/overview')) return 'overview'
  if (pathname.includes('/vitals')) return 'stats'
  return 'records'
}

export function KarteTabs() {
  const pathname = usePathname()
  const activeTab = getActiveTab(pathname)

  return (
    <Tabs value={activeTab} className="w-full shrink-0 border-b border-slate-200 bg-white p-1 flex flex-col gap-0">
      <MedicalTabsList tabs={TABS} />
    </Tabs>
  )
}
