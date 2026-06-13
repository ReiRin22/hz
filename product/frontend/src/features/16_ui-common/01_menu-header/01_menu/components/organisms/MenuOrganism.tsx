"use client";
import { MenuSection } from "./MenuSection";
import { DashboardSection } from "./DashboardSection";
import { ProxyInputSection } from "./ProxyInputSection";
import { TemporarySaveSection } from "./TemporarySaveSection";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { Settings, Bell } from "lucide-react";
import { getDoctorUnapprovedSummary } from "../../assets/proxyInputData";
import { useState } from "react";
import { useNotificationActions } from "../../hooks/useNotificationActions";
import { DoctorBadges } from "../molecules/DoctorBadges";
import { NotificationDialog } from "../molecules/NotificationDialog";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

const THEME_COLORS: ThemeColor[] = [
  { name: t.themeColors.blue, value: "blue", primary: "#3B82F6", secondary: "#DBEAFE" },
  { name: t.themeColors.green, value: "green", primary: "#10B981", secondary: "#D1FAE5" },
  { name: t.themeColors.purple, value: "purple", primary: "#8B5CF6", secondary: "#EDE9FE" },
  { name: t.themeColors.pink, value: "pink", primary: "#EC4899", secondary: "#FCE7F3" },
  { name: t.themeColors.orange, value: "orange", primary: "#F59E0B", secondary: "#FEF3C7" },
  { name: t.themeColors.red, value: "red", primary: "#EF4444", secondary: "#FEE2E2" },
  { name: t.themeColors.white, value: "white", primary: "#64748B", secondary: "#F8FAFC" },
  { name: t.themeColors.black, value: "black", primary: "#9CA3AF", secondary: "#0D0D0D" },
];

export function MenuOrganism() {
  // TODO: 医師別未承認数のAPI化はF0bスコープ外。将来的にBFF GET /api/v1/proxy/unapproved-count へ差し替える
  const doctorSummary = getDoctorUnapprovedSummary();
  const [selectedTheme, setSelectedTheme] = useState<ThemeColor>(THEME_COLORS[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const {
    notifications,
    expandedNotifications,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    toggleNotificationExpand,
  } = useNotificationActions();

  return (
    <div className="min-h-screen" style={{ backgroundColor: selectedTheme.secondary }}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h1 className="mb-0" style={{ color: selectedTheme.primary }}>{t.menuSection.title}／{t.dashboard.title}</h1>
          <div className="flex items-center gap-3">
            <DoctorBadges doctorSummary={doctorSummary} theme={selectedTheme} />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsNotificationOpen(true)}>
                <Bell className="h-5 w-5" style={{ color: selectedTheme.primary }} />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 hover:bg-red-600 text-white border-2 border-white">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
                <Settings className="h-5 w-5" style={{ color: selectedTheme.primary }} />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <MenuSection
              theme={selectedTheme}
              onThemeChange={setSelectedTheme}
              isSettingsOpen={isSettingsOpen}
              onSettingsOpenChange={setIsSettingsOpen}
            />
          </div>
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <DashboardSection theme={selectedTheme} />
            <div className="grid grid-cols-2 gap-4">
              <ProxyInputSection theme={selectedTheme} />
              <TemporarySaveSection theme={selectedTheme} />
            </div>
          </div>
        </div>
      </div>

      <NotificationDialog
        open={isNotificationOpen}
        notifications={notifications}
        expandedNotifications={expandedNotifications}
        unreadCount={unreadCount}
        theme={selectedTheme}
        onOpenChange={setIsNotificationOpen}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onToggleExpand={toggleNotificationExpand}
      />
    </div>
  );
}
