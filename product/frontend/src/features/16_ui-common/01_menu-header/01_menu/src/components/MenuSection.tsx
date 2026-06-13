import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Button } from "@/shared/components/atoms/button";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/atoms/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/atoms/dialog";
import { DialogDescription } from "@/shared/components/atoms/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { Label } from "@/shared/components/atoms/label";
import { Input } from "@/shared/components/atoms/input";
import { User, Calendar, FileText, Folder, Building, Settings, ChevronDown, LogOut, ClipboardList, Image, FileEdit, Database, Map, Search, Star, Check, X, Palette, Bell, KeyRound } from "lucide-react";
import { Badge } from "@/shared/components/atoms/badge";
import { useState } from "react";

interface MenuItem {
  id: string;
  title: string;
  icon: any;
  visible: boolean;
  isFavorite: boolean;
  type?: 'normal' | 'department' | 'departmentChild';
  children?: MenuItem[];
  parentId?: string;
}

interface ThemeColor {
  name: string;
  value: string;
  primary: string;
  secondary: string;
}

interface MenuSectionProps {
  theme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
  isSettingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
}

const themeColors: ThemeColor[] = [
  { name: "ブルー", value: "blue", primary: "#3B82F6", secondary: "#DBEAFE" },
  { name: "グリーン", value: "green", primary: "#10B981", secondary: "#D1FAE5" },
  { name: "パープル", value: "purple", primary: "#8B5CF6", secondary: "#EDE9FE" },
  { name: "ピンク", value: "pink", primary: "#EC4899", secondary: "#FCE7F3" },
  { name: "オレンジ", value: "orange", primary: "#F59E0B", secondary: "#FEF3C7" },
  { name: "レッド", value: "red", primary: "#EF4444", secondary: "#FEE2E2" },
  { name: "ホワイト", value: "white", primary: "#64748B", secondary: "#F8FAFC" },
  { name: "ブラック", value: "black", primary: "#9CA3AF", secondary: "#0D0D0D" },
];

export function MenuSection({ theme, onThemeChange, isSettingsOpen, onSettingsOpenChange }: MenuSectionProps) {
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const initialMenuItems: MenuItem[] = [
    { id: "1", title: "患者基本情報", icon: User, visible: true, isFavorite: false, type: 'normal' },
    { id: "2", title: "患者検索", icon: Search, visible: true, isFavorite: false, type: 'normal' },
    { id: "3", title: "予約・受付", icon: Calendar, visible: true, isFavorite: false, type: 'normal' },
    { id: "4", title: "外来カルテ", icon: FileText, visible: true, isFavorite: true, type: 'normal' },
    { id: "5", title: "入院カルテ", icon: Folder, visible: true, isFavorite: false, type: 'normal' },
    { id: "6", title: "病棟マップ", icon: Map, visible: true, isFavorite: true, type: 'normal' },
    { id: "7", title: "検査結果／画像", icon: Image, visible: true, isFavorite: false, type: 'normal' },
    { id: "8", title: "文書作成", icon: FileEdit, visible: true, isFavorite: false, type: 'normal' },
    { 
      id: "9", 
      title: "部門", 
      icon: Building, 
      visible: true, 
      isFavorite: false, 
      type: 'department',
      children: [
        { id: "9-1", title: "臨床検査科", icon: Building, visible: true, isFavorite: false, type: 'departmentChild', parentId: "9" },
        { id: "9-2", title: "放射線科", icon: Building, visible: true, isFavorite: false, type: 'departmentChild', parentId: "9" },
        { id: "9-3", title: "内視鏡検査科", icon: Building, visible: true, isFavorite: false, type: 'departmentChild', parentId: "9" },
        { id: "9-4", title: "栄養指導科", icon: Building, visible: true, isFavorite: false, type: 'departmentChild', parentId: "9" },
      ]
    },
    { id: "10", title: "マスタ管理", icon: Database, visible: true, isFavorite: false, type: 'normal' },
    { id: "11", title: "システム設定", icon: Settings, visible: true, isFavorite: false, type: 'normal' },
    { id: "12", title: "ログアウト", icon: LogOut, visible: true, isFavorite: false, type: 'normal' },
  ];

  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [tempMenuItems, setTempMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [tempTheme, setTempTheme] = useState(theme);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Use external control if provided, otherwise use internal state
  const dialogOpen = isSettingsOpen !== undefined ? isSettingsOpen : isDialogOpen;
  const setDialogOpen = onSettingsOpenChange !== undefined ? onSettingsOpenChange : setIsDialogOpen;

  const handleOpenDialog = () => {
    setTempMenuItems([...menuItems]);
    setTempTheme(theme);
    setDialogOpen(true);
  };

  const handleToggleVisibility = (id: string) => {
    setTempMenuItems(tempMenuItems.map(item => {
      if (item.id === id) {
        // Toggle the item itself
        const newItem = { ...item, visible: !item.visible };
        // If it has children, update them with deep copy
        if (newItem.children) {
          newItem.children = newItem.children.map(child => ({ ...child }));
        }
        return newItem;
      } else if (item.children) {
        // Check if the id belongs to a child
        const childIndex = item.children.findIndex(child => child.id === id);
        if (childIndex !== -1) {
          const newItem = { ...item };
          newItem.children = [...item.children];
          newItem.children[childIndex] = { 
            ...newItem.children[childIndex], 
            visible: !newItem.children[childIndex].visible 
          };
          return newItem;
        }
      }
      return item;
    }));
  };

  const handleToggleFavorite = (id: string) => {
    setTempMenuItems(tempMenuItems.map(item => {
      if (item.id === id) {
        const newItem = { ...item, isFavorite: !item.isFavorite };
        if (newItem.children) {
          newItem.children = newItem.children.map(child => ({ ...child }));
        }
        return newItem;
      } else if (item.children) {
        const childIndex = item.children.findIndex(child => child.id === id);
        if (childIndex !== -1) {
          const newItem = { ...item };
          newItem.children = [...item.children];
          newItem.children[childIndex] = { 
            ...newItem.children[childIndex], 
            isFavorite: !newItem.children[childIndex].isFavorite 
          };
          return newItem;
        }
      }
      return item;
    }));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...tempMenuItems];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setTempMenuItems(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === tempMenuItems.length - 1) return;
    const newItems = [...tempMenuItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setTempMenuItems(newItems);
  };

  const handleMoveChildUp = (parentId: string, childIndex: number) => {
    if (childIndex === 0) return;
    setTempMenuItems(tempMenuItems.map(item => {
      if (item.id === parentId && item.children) {
        const newItem = { ...item };
        newItem.children = [...item.children];
        [newItem.children[childIndex - 1], newItem.children[childIndex]] = 
          [newItem.children[childIndex], newItem.children[childIndex - 1]];
        return newItem;
      }
      return item;
    }));
  };

  const handleMoveChildDown = (parentId: string, childIndex: number) => {
    setTempMenuItems(tempMenuItems.map(item => {
      if (item.id === parentId && item.children && childIndex < item.children.length - 1) {
        const newItem = { ...item };
        newItem.children = [...item.children];
        [newItem.children[childIndex], newItem.children[childIndex + 1]] = 
          [newItem.children[childIndex + 1], newItem.children[childIndex]];
        return newItem;
      }
      return item;
    }));
  };

  const handleSaveSettings = () => {
    setMenuItems(tempMenuItems);
    onThemeChange(tempTheme);
    setDialogOpen(false);
  };

  const handleCancelSettings = () => {
    setTempMenuItems([...menuItems]);
    setTempTheme(theme);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setDialogOpen(false);
  };

  const handleChangePassword = () => {
    setPasswordError("");
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("すべての項目を入力してください");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("新しいパスワードが一致しません");
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("パスワードは8文字以上で設定してください");
      return;
    }
    
    // パスワード変更処理（実際のアプリケーションではAPIを呼び出します）
    alert("パスワードが変更されました");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const favoriteItems = menuItems.filter(item => item.isFavorite && item.visible);
  
  // Get favorite children from department items
  const getFavoriteChildren = () => {
    const favorites: MenuItem[] = [];
    menuItems.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          if (child.isFavorite && child.visible && item.visible) {
            favorites.push(child);
          }
        });
      }
    });
    return favorites;
  };
  
  const allFavorites = [...favoriteItems, ...getFavoriteChildren()];

  return (
    <>
      <Card style={{ 
        backgroundColor: theme.value === 'black' ? '#1A1A1A' : undefined,
        borderColor: theme.value === 'black' ? '#333333' : undefined,
        color: theme.value === 'black' ? '#E5E7EB' : undefined
      }}>
        <CardHeader style={{ backgroundColor: theme.secondary }}>
          <CardTitle style={{ color: theme.primary }}>メニュー</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2" style={{
          backgroundColor: theme.value === 'black' ? '#1A1A1A' : undefined
        }}>
          {allFavorites.length > 0 && (
            <>
              <div className="pt-2">
                <Label className="text-xs flex items-center gap-1 mb-2" style={{ 
                  color: theme.value === 'black' ? '#9CA3AF' : undefined 
                }}>
                  <Star className="h-3 w-3" />
                  お気に入り
                </Label>
                <div className="space-y-1">
                  {allFavorites.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="w-full justify-start"
                      style={{ 
                        backgroundColor: theme.secondary,
                        color: theme.primary
                      }}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                      <Star className="ml-auto h-3 w-3 fill-current" />
                    </Button>
                  ))}
                </div>
              </div>
              <div className="border-t my-2 pt-2" style={{
                borderColor: theme.value === 'black' ? '#333333' : undefined
              }}></div>
            </>
          )}
          
          {menuItems.filter(item => item.visible).map((item) => {
            if (item.type === 'department') {
              return (
                <Collapsible key={item.id} open={isDepartmentOpen} onOpenChange={setIsDepartmentOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start" style={{
                      color: theme.value === 'black' ? '#E5E7EB' : undefined
                    }}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                      <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isDepartmentOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-2 mt-2">
                    {item.children?.filter(child => child.visible).map((dept) => (
                      <Button
                        key={dept.id}
                        variant="ghost"
                        className="w-full justify-start"
                        size="sm"
                        style={{
                          color: theme.value === 'black' ? '#E5E7EB' : undefined
                        }}
                      >
                        <dept.icon className="mr-2 h-4 w-4" />
                        {dept.title}
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            }
            return (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start"
                style={{
                  color: theme.value === 'black' ? '#E5E7EB' : undefined
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>メニュー設定</DialogTitle>
            <DialogDescription>メニューの表示、順序、お気に入りを設定できます</DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="theme" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="theme">
                <Palette className="h-4 w-4 mr-2" />
                テーマカラー
              </TabsTrigger>
              <TabsTrigger value="customize">
                <Settings className="h-4 w-4 mr-2" />
                メニュー表示
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Star className="h-4 w-4 mr-2" />
                お気に入り
              </TabsTrigger>
              <TabsTrigger value="password">
                <KeyRound className="h-4 w-4 mr-2" />
                パスワード
              </TabsTrigger>
            </TabsList>

            <TabsContent value="theme" className="space-y-4 mt-4">
              <div>
                <Label className="mb-3 block">カラーテーマを選択</Label>
                <div className="grid grid-cols-2 gap-3">
                  {themeColors.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => setTempTheme(theme)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        tempTheme.value === theme.value
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div
                            className="w-8 h-8 rounded"
                            style={{ backgroundColor: theme.primary }}
                          ></div>
                          <div
                            className="w-8 h-8 rounded"
                            style={{ backgroundColor: theme.secondary }}
                          ></div>
                        </div>
                        <span className="font-medium">{theme.name}</span>
                        {tempTheme.value === theme.value && (
                          <Check className="ml-auto h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="customize" className="space-y-3 mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                <p className="text-sm text-blue-700">メニューの表示/非表示と順序を設定できます</p>
              </div>
              {tempMenuItems.map((item, index) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-white">
                    <Checkbox
                      id={`menu-${item.id}`}
                      checked={item.visible}
                      onCheckedChange={() => handleToggleVisibility(item.id)}
                    />
                    <item.icon className="h-4 w-4 text-gray-600" />
                    <span className="flex-1">{item.title}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === tempMenuItems.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                  {item.children && item.children.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {item.children.map((child, childIndex) => (
                        <div key={child.id} className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                          <Checkbox
                            id={`menu-${child.id}`}
                            checked={child.visible}
                            onCheckedChange={() => handleToggleVisibility(child.id)}
                          />
                          <child.icon className="h-4 w-4 text-gray-600" />
                          <span className="flex-1">{child.title}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveChildUp(item.id, childIndex)}
                              disabled={childIndex === 0}
                              className="h-8 w-8 p-0"
                            >
                              ↑
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveChildDown(item.id, childIndex)}
                              disabled={childIndex === item.children!.length - 1}
                              className="h-8 w-8 p-0"
                            >
                              ↓
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-3 mt-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                <p className="text-sm text-yellow-700">よく使うメニューをお気に入りに登録できます</p>
              </div>
              {tempMenuItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center gap-3 p-3 border rounded-md bg-white">
                    <item.icon className="h-5 w-5 text-gray-600" />
                    <span className="flex-1">{item.title}</span>
                    <Button
                      variant={item.isFavorite ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleFavorite(item.id)}
                      className="gap-1"
                    >
                      <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                      {item.isFavorite ? 'お気に入り解除' : 'お気に入り登録'}
                    </Button>
                  </div>
                  {item.children && item.children.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {item.children.map((child) => (
                        <div key={child.id} className="flex items-center gap-3 p-3 border rounded-md bg-gray-50">
                          <child.icon className="h-5 w-5 text-gray-600" />
                          <span className="flex-1">{child.title}</span>
                          <Button
                            variant={child.isFavorite ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleToggleFavorite(child.id)}
                            className="gap-1"
                          >
                            <Star className={`h-4 w-4 ${child.isFavorite ? 'fill-current' : ''}`} />
                            {child.isFavorite ? 'お気に入り解除' : 'お気に入り登録'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="password" className="space-y-3 mt-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                <p className="text-sm text-red-700">パスワードを変更できます</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">現在のパスワード</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">新しいパスワード</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full"
                />
                {newPassword && (
                  <div className="flex items-center gap-2 text-sm">
                    {newPassword.length >= 8 ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">8文字以上</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">8文字以上</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">新しいパスワード（確認）</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              <Button
                variant="default"
                onClick={handleChangePassword}
                className="w-full"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                パスワード変更
              </Button>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancelSettings}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              キャンセル
            </Button>
            <Button
              variant="default"
              onClick={handleSaveSettings}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}