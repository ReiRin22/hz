"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/atoms/tabs";
import { BulletinBoard } from "../molecules/BulletinBoard";
import { InternalMail } from "./InternalMail";
import { MessageMemo } from "../molecules/MessageMemo";
import { BedOccupancyChart } from "../molecules/BedOccupancyChart";
import { BedManagementTable } from "../molecules/BedManagementTable";
import { StickyNotes } from "../molecules/StickyNotes";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

interface DashboardSectionProps {
  theme: ThemeColor;
}

export function DashboardSection({ theme }: DashboardSectionProps) {
  return (
    <Card style={{ 
      backgroundColor: theme.value === 'black' ? '#1A1A1A' : undefined,
      borderColor: theme.value === 'black' ? '#333333' : undefined,
      color: theme.value === 'black' ? '#E5E7EB' : undefined
    }}>
      <CardHeader style={{ backgroundColor: theme.secondary }}>
        <CardTitle style={{ color: theme.primary }}>{t.dashboardSection.title}</CardTitle>
      </CardHeader>
      <CardContent style={{
        backgroundColor: theme.value === 'black' ? '#1A1A1A' : undefined
      }}>
        <Tabs defaultValue="bulletin">
          <TabsList className="w-full" style={{
            backgroundColor: theme.value === 'black' ? '#0D0D0D' : undefined,
            borderColor: theme.value === 'black' ? '#404040' : undefined
          }}>
            <TabsTrigger value="bulletin" className={theme.value === 'black' ? 'data-[state=active]:bg-[#262626] data-[state=active]:text-white' : ''} style={{
              color: theme.value === 'black' ? '#9CA3AF' : undefined
            }}>{t.dashboard.tabs.bulletin}</TabsTrigger>
            <TabsTrigger value="sticky" className={theme.value === 'black' ? 'data-[state=active]:bg-[#262626] data-[state=active]:text-white' : ''} style={{
              color: theme.value === 'black' ? '#9CA3AF' : undefined
            }}>{t.dashboard.tabs.sticky}</TabsTrigger>
            <TabsTrigger value="mail" className={theme.value === 'black' ? 'data-[state=active]:bg-[#262626] data-[state=active]:text-white' : ''} style={{
              color: theme.value === 'black' ? '#9CA3AF' : undefined
            }}>{t.dashboard.tabs.mail}</TabsTrigger>
            <TabsTrigger value="memo" className={theme.value === 'black' ? 'data-[state=active]:bg-[#262626] data-[state=active]:text-white' : ''} style={{
              color: theme.value === 'black' ? '#9CA3AF' : undefined
            }}>{t.dashboard.tabs.memo}</TabsTrigger>
            <TabsTrigger value="beds" className={theme.value === 'black' ? 'data-[state=active]:bg-[#262626] data-[state=active]:text-white' : ''} style={{
              color: theme.value === 'black' ? '#9CA3AF' : undefined
            }}>{t.dashboard.tabs.beds}</TabsTrigger>
          </TabsList>

          <TabsContent value="bulletin">
            <BulletinBoard theme={theme} />
          </TabsContent>

          <TabsContent value="sticky">
            <StickyNotes theme={theme} />
          </TabsContent>

          <TabsContent value="mail">
            <InternalMail theme={theme} />
          </TabsContent>

          <TabsContent value="memo">
            <MessageMemo theme={theme} />
          </TabsContent>

          <TabsContent value="beds">
            <div className="space-y-4">
              <BedOccupancyChart theme={theme} />
              <BedManagementTable theme={theme} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}