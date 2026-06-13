"use client";

import { useState, useEffect } from "react";
import { Settings, GripVertical, Eye, EyeOff, ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { Button } from "@shared/components/atoms/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/components/atoms/dialog";
import { Input } from "@shared/components/atoms/input";
import { Label } from "@shared/components/atoms/label";
import { RadioGroup, RadioGroupItem } from "@shared/components/atoms/radio-group";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/atoms/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@shared/components/atoms/collapsible";
import { toast } from "sonner";
import { SettingsPanel } from "../organisms/SettingsPanel";

type MenuItem = { id: string; label: string; description: string; visible: boolean };
type OrderItem = { id: string; label: string; visible: boolean };

const INITIAL_MENU_ITEMS: MenuItem[] = [
  { id: "chart", label: "カルテ", description: "診療記録・SOAP記録", visible: true },
  { id: "orders", label: "オーダー", description: "処方・注射・検査等", visible: true },
  { id: "labTransfer", label: "検査結果", description: "検査結果送受信", visible: true },
  { id: "patientInfo", label: "患者情報", description: "基本情報・病名・薬歴", visible: true },
  { id: "patientList", label: "患者一覧", description: "患者検索・一覧表示", visible: true },
  { id: "documents", label: "文書", description: "診断書・紹介状・処方箋", visible: true },
  { id: "labSchedule", label: "検査予約", description: "検査スケジュール管理", visible: true },
  { id: "appointmentSchedule", label: "診療予約", description: "診療スケジュール管理", visible: true },
  { id: "menu", label: "メニュー", description: "その他機能メニュー", visible: true },
  { id: "sets", label: "セット", description: "セット登録・管理", visible: true },
];

const INITIAL_ORDER_ITEMS: OrderItem[] = [
  { id: "prescription", label: "処方オーダー", visible: true },
  { id: "injection", label: "注射オーダー", visible: true },
  { id: "specimen", label: "検体オーダー", visible: true },
  { id: "treatment", label: "処置オーダー", visible: true },
  { id: "guidance", label: "指導オーダー", visible: true },
  { id: "physiology", label: "生理検査オーダー", visible: true },
  { id: "endoscopy", label: "内視鏡検査オーダー", visible: true },
  { id: "imaging", label: "画像検査オーダー", visible: true },
  { id: "pathology", label: "病理検査オーダー", visible: true },
  { id: "bacteriology", label: "細菌検査オーダー", visible: true },
  { id: "general", label: "汎用オーダー", visible: true },
  { id: "composite", label: "複合オーダー", visible: true },
  { id: "meal", label: "食事オーダー", visible: true },
  { id: "rehabilitation", label: "リハビリオーダー", visible: true },
  { id: "transfusion", label: "輸血オーダー", visible: true },
  { id: "surgery", label: "手術オーダー", visible: true },
  { id: "dialysis", label: "透析オーダー", visible: true },
  { id: "admission", label: "入院オーダー", visible: true },
  { id: "discharge", label: "退院オーダー", visible: true },
  { id: "transfer", label: "転棟転科転室オーダー", visible: true },
  { id: "nursing", label: "看護ケアオーダー", visible: true },
];

type MenuSettingsDialogMoleculeProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  themeColor: string;
  onThemeColorChange?: (color: string) => void;
  darkMode?: boolean;
  autoSaveEnabled?: boolean;
  alertsEnabled?: boolean;
  autoLogoutEnabled?: boolean;
  autoLogoutTimeout?: number;
  onDarkModeToggle?: (darkMode: boolean) => void;
  onAutoSaveToggle?: (enabled: boolean) => void;
  onAutoSave?: () => void;
  onAlertsToggle?: (enabled: boolean) => void;
  onAutoLogoutToggle?: (enabled: boolean) => void;
  onAutoLogoutTimeoutChange?: (minutes: number) => void;
};

export function MenuSettingsDialogMolecule({
  isOpen,
  onOpenChange,
  themeColor,
  onThemeColorChange,
  darkMode = false,
  autoSaveEnabled = true,
  alertsEnabled = true,
  autoLogoutEnabled = false,
  autoLogoutTimeout = 30,
  onDarkModeToggle,
  onAutoSaveToggle,
  onAutoSave,
  onAlertsToggle,
  onAutoLogoutToggle,
  onAutoLogoutTimeoutChange,
}: MenuSettingsDialogMoleculeProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(INITIAL_ORDER_ITEMS);
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(false);
  const [draggedMenuIndex, setDraggedMenuIndex] = useState<number | null>(null);
  const [draggedOrderIndex, setDraggedOrderIndex] = useState<number | null>(null);
  const [tempColorTheme, setTempColorTheme] = useState(themeColor);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setTempColorTheme(themeColor);
  }, [themeColor]);

  const isPasswordValid =
    currentPassword.length > 0 && newPassword.length >= 8 && confirmPassword.length > 0 && newPassword === confirmPassword;

  useEffect(() => {
    if (!isPasswordValid) return;
    const timer = setTimeout(() => {
      toast.success("パスワードを変更しました");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setShowCurrentPassword(false); setShowNewPassword(false); setShowConfirmPassword(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [isPasswordValid]);

  const resetPasswordFields = () => {
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setShowCurrentPassword(false); setShowNewPassword(false); setShowConfirmPassword(false);
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) { resetPasswordFields(); setTempColorTheme(themeColor); }
  };

  const handleSave = () => {
    onThemeColorChange?.(tempColorTheme);
    toast.success("テーマカラーを保存しました");
    handleClose(false);
  };

  const moveMenuItemUp = (index: number) => {
    if (index === 0) return;
    const items = [...menuItems];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    setMenuItems(items);
  };

  const moveMenuItemDown = (index: number) => {
    if (index === menuItems.length - 1) return;
    const items = [...menuItems];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    setMenuItems(items);
  };

  const moveOrderItemUp = (index: number) => {
    if (index === 0) return;
    const items = [...orderItems];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    setOrderItems(items);
  };

  const moveOrderItemDown = (index: number) => {
    if (index === orderItems.length - 1) return;
    const items = [...orderItems];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    setOrderItems(items);
  };

  const handleMenuDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedMenuIndex === null || draggedMenuIndex === index) return;
    const items = [...menuItems];
    const dragged = items[draggedMenuIndex];
    items.splice(draggedMenuIndex, 1);
    items.splice(index, 0, dragged);
    setMenuItems(items);
    setDraggedMenuIndex(index);
  };

  const handleOrderDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedOrderIndex === null || draggedOrderIndex === index) return;
    const items = [...orderItems];
    const dragged = items[draggedOrderIndex];
    items.splice(draggedOrderIndex, 1);
    items.splice(index, 0, dragged);
    setOrderItems(items);
    setDraggedOrderIndex(index);
  };

  const THEME_OPTIONS = [
    { value: "blue", label: "ブルー", primary: "bg-blue-600", secondary: "bg-blue-100" },
    { value: "green", label: "グリーン", primary: "bg-green-600", secondary: "bg-green-100" },
    { value: "purple", label: "パープル", primary: "bg-purple-600", secondary: "bg-purple-100" },
    { value: "pink", label: "ピンク", primary: "bg-pink-600", secondary: "bg-pink-100" },
    { value: "orange", label: "オレンジ", primary: "bg-orange-600", secondary: "bg-orange-100" },
    { value: "red", label: "レッド", primary: "bg-red-600", secondary: "bg-red-100" },
    { value: "white", label: "ホワイト", primary: "bg-slate-600", secondary: "bg-gray-200" },
    { value: "black", label: "ブラック", primary: "bg-gray-900", secondary: "bg-gray-300" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>メニュー設定</span>
          </DialogTitle>
          <DialogDescription>メニューの表示やカラーテーマなど、画面表示に関する設定を変更できます。</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="menu" className="mt-4">
          <TabsList className="grid w-full grid-cols-4 gap-4">
            <TabsTrigger value="menu">メニュー編集</TabsTrigger>
            <TabsTrigger value="theme">テーマカラー</TabsTrigger>
            <TabsTrigger value="password">パスワード変更</TabsTrigger>
            <TabsTrigger value="system">システム設定</TabsTrigger>
          </TabsList>

          <TabsContent value="theme" className="space-y-4 mt-4">
            <div>
              <h4 className="mb-3 text-sm font-medium">テーマカラーを選択</h4>
              <RadioGroup value={tempColorTheme} onValueChange={setTempColorTheme}>
                <div className="grid grid-cols-2 gap-3">
                  {THEME_OPTIONS.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <RadioGroupItem value={opt.value} id={`theme-${opt.value}`} />
                      <Label htmlFor={`theme-${opt.value}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className={`w-8 h-8 rounded ${opt.primary}`} />
                            <div className={`w-8 h-8 rounded ${opt.secondary}`} />
                          </div>
                          <p className="font-medium">{opt.label}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="password" className="space-y-4 mt-4">
            <div className="space-y-4">
              {[
                { id: "current-password", label: "現在のパスワード", value: currentPassword, setValue: setCurrentPassword, show: showCurrentPassword, setShow: setShowCurrentPassword, placeholder: "現在のパスワードを入力" },
                { id: "new-password", label: "新しいパスワード", value: newPassword, setValue: setNewPassword, show: showNewPassword, setShow: setShowNewPassword, placeholder: "新しいパスワードを入力（8文字以上）" },
                { id: "confirm-password", label: "新しいパスワード（確認）", value: confirmPassword, setValue: setConfirmPassword, show: showConfirmPassword, setShow: setShowConfirmPassword, placeholder: "新しいパスワードを再入力" },
              ].map(({ id, label, value, setValue, show, setShow, placeholder }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
                  <div className="relative">
                    <Input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} className="pr-10" />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShow(!show)}>
                      {show ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                    </Button>
                  </div>
                </div>
              ))}
              {(newPassword || confirmPassword) && (
                <div className="space-y-2 mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {[
                    { ok: newPassword.length >= 8, label: "8文字以上" },
                    { ok: /[A-Z]/.test(newPassword), label: "大文字を含む" },
                    { ok: /[a-z]/.test(newPassword), label: "小文字を含む" },
                    { ok: /[0-9]/.test(newPassword), label: "数字を含む" },
                    { ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(newPassword), label: "記号を含む" },
                  ].map(({ ok, label }) => (
                    <div key={label} className={`flex items-center gap-2 text-sm ${ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {ok ? "✓" : "×"} {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4 mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">左サイドメニューの表示項目を編集</h4>
                  <p className="text-xs text-muted-foreground mb-4">ドラッグして順番を変更、チェックで表示/非表示を切り替えできます。</p>
                  <div className="space-y-2">
                    {menuItems.map((item, index) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => setDraggedMenuIndex(index)}
                        onDragOver={(e) => handleMenuDragOver(e, index)}
                        onDragEnd={() => setDraggedMenuIndex(null)}
                        className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-move transition-all ${draggedMenuIndex === index ? "opacity-50 scale-95" : ""}`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <input
                            type="checkbox"
                            id={`menu-${item.id}`}
                            checked={item.visible}
                            onChange={(e) => {
                              const items = [...menuItems];
                              items[index] = { ...items[index], visible: e.target.checked };
                              setMenuItems(items);
                            }}
                            className="w-4 h-4 medical-primary rounded cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Label htmlFor={`menu-${item.id}`} className="cursor-pointer font-medium">{item.label}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.id === "orders" && (
                            <Collapsible open={isOrdersExpanded} onOpenChange={setIsOrdersExpanded}>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 px-2">
                                  {isOrdersExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </Button>
                              </CollapsibleTrigger>
                            </Collapsible>
                          )}
                          <div className="flex flex-col gap-0.5">
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={(e) => { e.stopPropagation(); moveMenuItemUp(index); }} disabled={index === 0}>
                              <ChevronUp className={`w-4 h-4 ${index === 0 ? "text-gray-300" : "text-gray-600 dark:text-gray-400"}`} />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={(e) => { e.stopPropagation(); moveMenuItemDown(index); }} disabled={index === menuItems.length - 1}>
                              <ChevronDown className={`w-4 h-4 ${index === menuItems.length - 1 ? "text-gray-300" : "text-gray-600 dark:text-gray-400"}`} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Collapsible open={isOrdersExpanded}>
                      <CollapsibleContent className="space-y-1 pl-8 mt-2">
                        {orderItems.map((orderItem, index) => (
                          <div
                            key={orderItem.id}
                            draggable
                            onDragStart={() => setDraggedOrderIndex(index)}
                            onDragOver={(e) => handleOrderDragOver(e, index)}
                            onDragEnd={() => setDraggedOrderIndex(null)}
                            className={`flex items-center space-x-3 p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-move transition-all ${draggedOrderIndex === index ? "opacity-50 scale-95" : ""}`}
                          >
                            <GripVertical className="w-3 h-3 text-gray-400" />
                            <input
                              type="checkbox"
                              id={`order-${orderItem.id}`}
                              checked={orderItem.visible}
                              onChange={(e) => {
                                const items = [...orderItems];
                                items[index] = { ...items[index], visible: e.target.checked };
                                setOrderItems(items);
                              }}
                              className="w-3 h-3 medical-primary rounded cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Label htmlFor={`order-${orderItem.id}`} className="cursor-pointer text-sm flex-1">{orderItem.label}</Label>
                            <div className="flex flex-col gap-0.5 ml-auto">
                              <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={(e) => { e.stopPropagation(); moveOrderItemUp(index); }} disabled={index === 0}>
                                <ChevronUp className={`w-3 h-3 ${index === 0 ? "text-gray-300" : "text-gray-600 dark:text-gray-400"}`} />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={(e) => { e.stopPropagation(); moveOrderItemDown(index); }} disabled={index === orderItems.length - 1}>
                                <ChevronDown className={`w-3 h-3 ${index === orderItems.length - 1 ? "text-gray-300" : "text-gray-600 dark:text-gray-400"}`} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="system" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <SettingsPanel
                darkMode={darkMode}
                onDarkModeToggle={onDarkModeToggle ?? (() => {})}
                autoSaveEnabled={autoSaveEnabled}
                onAutoSaveToggle={onAutoSaveToggle ?? (() => {})}
                onAutoSave={onAutoSave ?? (() => {})}
                alertsEnabled={alertsEnabled}
                onAlertsToggle={onAlertsToggle ?? (() => {})}
                autoLogoutEnabled={autoLogoutEnabled}
                onAutoLogoutToggle={onAutoLogoutToggle ?? (() => {})}
                autoLogoutTimeout={autoLogoutTimeout}
                onAutoLogoutTimeoutChange={onAutoLogoutTimeoutChange}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => { setTempColorTheme(themeColor); handleClose(false); }}>
            キャンセル
          </Button>
          <Button className="medical-primary" onClick={handleSave}>
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
