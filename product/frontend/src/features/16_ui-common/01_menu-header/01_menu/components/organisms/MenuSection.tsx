"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Button } from "@/shared/components/atoms/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/atoms/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { Settings, Star, Palette, KeyRound, Check, X } from "lucide-react";
import { useMenuActions } from "../../hooks/useMenuActions";
import { FavoriteMenus } from "../molecules/FavoriteMenus";
import { MenuItemList } from "../molecules/MenuItemList";
import { ThemeColorTab } from "../molecules/ThemeColorTab";
import { MenuVisibilityTab } from "../molecules/MenuVisibilityTab";
import { FavoritesTab } from "../molecules/FavoritesTab";
import { PasswordTab } from "../molecules/PasswordTab";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

interface MenuSectionProps {
  theme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
  isSettingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
}

export function MenuSection({ theme, onThemeChange, isSettingsOpen, onSettingsOpenChange }: MenuSectionProps) {
  const {
    menuItems,
    tempMenuItems,
    tempTheme,
    currentPassword,
    newPassword,
    confirmPassword,
    passwordError,
    loading,
    error,
    setTempTheme,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    handleOpenSettings,
    handleToggleVisibility,
    handleToggleFavorite,
    handleMoveUp,
    handleMoveDown,
    handleMoveChildUp,
    handleMoveChildDown,
    handleSaveSettings,
    handleCancelSettings,
    handleChangePassword,
  } = useMenuActions();

  const dialogOpen = isSettingsOpen !== undefined ? isSettingsOpen : false;
  const setDialogOpen = onSettingsOpenChange ?? (() => {});

  const handleOpenDialog = () => {
    handleOpenSettings(theme);
    setDialogOpen(true);
  };

  const favoriteItems = menuItems.filter((item) => item.isFavorite && item.visible);
  const favoriteChildren = menuItems.flatMap((item) =>
    item.visible && item.children ? item.children.filter((child) => child.isFavorite && child.visible) : []
  );
  const allFavorites = [...favoriteItems, ...favoriteChildren];

  if (loading) return <p className="p-4 text-sm text-gray-500">{i18n.common.status.loading}</p>;
  if (error) return <p className="p-4 text-sm text-red-500">{t.menuSection.loading}</p>;

  return (
    <>
      <Card style={{
        backgroundColor: theme.value === "black" ? "#1A1A1A" : undefined,
        borderColor: theme.value === "black" ? "#333333" : undefined,
        color: theme.value === "black" ? "#E5E7EB" : undefined,
      }}>
        <CardHeader style={{ backgroundColor: theme.secondary }}>
          <CardTitle style={{ color: theme.primary }}>{t.menuSection.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2" style={{ backgroundColor: theme.value === "black" ? "#1A1A1A" : undefined }}>
          <FavoriteMenus favorites={allFavorites} theme={theme} />
          <MenuItemList items={menuItems} theme={theme} />
          <div className="pt-2 border-t" style={{ borderColor: theme.value === "black" ? "#333333" : undefined }}>
            <Button variant="ghost" className="w-full justify-start" style={{ color: theme.value === "black" ? "#E5E7EB" : undefined }} onClick={handleOpenDialog}>
              <Settings className="mr-2 h-4 w-4" />
              {t.menuSection.settings}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.menuSection.settingsDialog.title}</DialogTitle>
            <DialogDescription>{t.menuSection.settingsDialog.description}</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="theme" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="theme"><Palette className="h-4 w-4 mr-2" />{t.menuSection.tabs.theme}</TabsTrigger>
              <TabsTrigger value="customize"><Settings className="h-4 w-4 mr-2" />{t.menuSection.tabs.customize}</TabsTrigger>
              <TabsTrigger value="favorites"><Star className="h-4 w-4 mr-2" />{t.menuSection.tabs.favorites}</TabsTrigger>
              <TabsTrigger value="password"><KeyRound className="h-4 w-4 mr-2" />{t.menuSection.tabs.password}</TabsTrigger>
            </TabsList>
            <TabsContent value="theme" className="space-y-4 mt-4">
              <ThemeColorTab tempTheme={tempTheme} onThemeSelect={setTempTheme} />
            </TabsContent>
            <TabsContent value="customize" className="space-y-3 mt-4">
              <MenuVisibilityTab
                tempMenuItems={tempMenuItems}
                onToggleVisibility={handleToggleVisibility}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onMoveChildUp={handleMoveChildUp}
                onMoveChildDown={handleMoveChildDown}
              />
            </TabsContent>
            <TabsContent value="favorites" className="space-y-3 mt-4">
              <FavoritesTab tempMenuItems={tempMenuItems} onToggleFavorite={handleToggleFavorite} />
            </TabsContent>
            <TabsContent value="password" className="space-y-3 mt-4">
              <PasswordTab
                currentPassword={currentPassword}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                passwordError={passwordError}
                onCurrentPasswordChange={setCurrentPassword}
                onNewPasswordChange={setNewPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onChangePassword={handleChangePassword}
              />
            </TabsContent>
          </Tabs>
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => handleCancelSettings(theme, () => setDialogOpen(false))} className="flex-1">
              <X className="h-4 w-4 mr-2" />{i18n.common.buttons.cancel}
            </Button>
            <Button variant="default" onClick={() => handleSaveSettings(onThemeChange, () => setDialogOpen(false))} className="flex-1">
              <Check className="h-4 w-4 mr-2" />{i18n.common.buttons.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
