'use client';

/**
 * 画像検査サブタブナビゲーション
 * molecules: 画像検査の新規/履歴/セットタブ
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/ImagingSubTabs.tsx
 */

import { Tabs, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';

export interface ImagingSubTabsProps {
  activeSubTab: string;
  onSubTabChange: (value: string) => void;
}

export function ImagingSubTabs({
  activeSubTab,
  onSubTabChange
}: ImagingSubTabsProps) {
  return (
    <div className="p-4 pb-2 border-b border-border">
      <Tabs value={activeSubTab} onValueChange={onSubTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="sets" className="text-xs">セット</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">履歴</TabsTrigger>
          <TabsTrigger value="search" className="text-xs">新規</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
