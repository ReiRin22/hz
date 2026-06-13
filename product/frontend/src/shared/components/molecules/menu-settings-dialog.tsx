'use client'

import { useState } from 'react'
import { Settings, GripVertical, ChevronUp, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/atoms/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/atoms/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/atoms/tooltip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs'
import { ScrollArea } from '@/shared/components/atoms/scroll-area'
import { Label } from '@/shared/components/atoms/label'
import { RadioGroup, RadioGroupItem } from '@/shared/components/atoms/radio-group'
import { Input } from '@/shared/components/atoms/input'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/atoms/collapsible'
import { Checkbox } from '@/shared/components/atoms/checkbox'
import type { MenuItem, OrderItem } from '@/shared/types/user-header.type'

// TODO: BFF API 連携後はメニュー設定データを API から取得・保存する（上流 API 未実装のためモックデータで代替）
const INITIAL_MENU_ITEMS: MenuItem[] = [
  { id: 'chart', label: 'カルテ', description: '診療記録・SOAP記録', visible: true },
  { id: 'orders', label: 'オーダー', description: '処方・注射・検査等', visible: true },
  { id: 'labTransfer', label: '検査結果', description: '検査結果送受信', visible: true },
  { id: 'patientInfo', label: '患者情報', description: '基本情報・病名・薬歴', visible: true },
  { id: 'patientList', label: '患者一覧', description: '患者検索・一覧表示', visible: true },
  { id: 'documents', label: '文書', description: '診断書・紹介状・処方箋', visible: true },
  { id: 'labSchedule', label: '検査予約', description: '検査スケジュール管理', visible: true },
  { id: 'appointmentSchedule', label: '診療予約', description: '診療スケジュール管理', visible: true },
  { id: 'menu', label: 'メニュー', description: 'その他機能メニュー', visible: true },
  { id: 'sets', label: 'セット', description: 'セット登録・管理', visible: true },
]

const INITIAL_ORDER_ITEMS: OrderItem[] = [
  { id: 'prescription', label: '処方オーダー', visible: true },
  { id: 'injection', label: '注射オーダー', visible: true },
  { id: 'specimen', label: '検体オーダー', visible: true },
  { id: 'treatment', label: '処置オーダー', visible: true },
  { id: 'guidance', label: '指導オーダー', visible: true },
  { id: 'physiology', label: '生理検査オーダー', visible: true },
  { id: 'endoscopy', label: '内視鏡検査オーダー', visible: true },
  { id: 'imaging', label: '画像検査オーダー', visible: true },
  { id: 'pathology', label: '病理検査オーダー', visible: true },
  { id: 'bacteriology', label: '細菌検査オーダー', visible: true },
  { id: 'general', label: '汎用オーダー', visible: true },
  { id: 'composite', label: '複合オーダー', visible: true },
  { id: 'meal', label: '食事オーダー', visible: true },
  { id: 'rehabilitation', label: 'リハビリオーダー', visible: true },
  { id: 'transfusion', label: '輸血オーダー', visible: true },
  { id: 'surgery', label: '手術オーダー', visible: true },
  { id: 'dialysis', label: '透析オーダー', visible: true },
  { id: 'admission', label: '入院オーダー', visible: true },
  { id: 'discharge', label: '退院オーダー', visible: true },
  { id: 'transfer', label: '転棟転科転室オーダー', visible: true },
  { id: 'nursing', label: '看護ケアオーダー', visible: true },
]

interface MenuSettingsDialogProps {
  themeColor?: string
  onThemeColorChange?: (color: string) => void
}

export function MenuSettingsDialog({ themeColor = 'blue', onThemeColorChange }: MenuSettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS)
  const [orderItems, setOrderItems] = useState<OrderItem[]>(INITIAL_ORDER_ITEMS)
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [draggedOrderIndex, setDraggedOrderIndex] = useState<number | null>(null)
  const [tempColorTheme, setTempColorTheme] = useState(themeColor)

  // パスワード
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleClose = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
      setTempColorTheme(themeColor)
    }
  }

  const handleSave = () => {
    onThemeColorChange?.(tempColorTheme)
    toast.success('テーマカラーを保存しました')
    handleClose(false)
  }

  // メニュー D&D
  const handleMenuDragStart = (index: number) => setDraggedIndex(index)
  const handleMenuDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    const newItems = [...menuItems]
    const item = newItems.splice(draggedIndex, 1)[0]
    newItems.splice(index, 0, item)
    setMenuItems(newItems)
    setDraggedIndex(index)
  }
  const handleMenuDragEnd = () => setDraggedIndex(null)
  const moveMenuItemUp = (index: number) => {
    if (index === 0) return
    const newItems = [...menuItems]
    ;[newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]]
    setMenuItems(newItems)
  }
  const moveMenuItemDown = (index: number) => {
    if (index === menuItems.length - 1) return
    const newItems = [...menuItems]
    ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
    setMenuItems(newItems)
  }

  // オーダー D&D
  const handleOrderDragStart = (index: number) => setDraggedOrderIndex(index)
  const handleOrderDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedOrderIndex === null || draggedOrderIndex === index) return
    const newItems = [...orderItems]
    const item = newItems.splice(draggedOrderIndex, 1)[0]
    newItems.splice(index, 0, item)
    setOrderItems(newItems)
    setDraggedOrderIndex(index)
  }
  const handleOrderDragEnd = () => setDraggedOrderIndex(null)
  const moveOrderItemUp = (index: number) => {
    if (index === 0) return
    const newItems = [...orderItems]
    ;[newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]]
    setOrderItems(newItems)
  }
  const moveOrderItemDown = (index: number) => {
    if (index === orderItems.length - 1) return
    const newItems = [...orderItems]
    ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
    setOrderItems(newItems)
  }

  const isPasswordValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword

  const THEME_OPTIONS = [
    { value: 'blue', label: 'ブルー', bg: 'bg-blue-600', light: 'bg-blue-100' },
    { value: 'green', label: 'グリーン', bg: 'bg-green-600', light: 'bg-green-100' },
    { value: 'purple', label: 'パープル', bg: 'bg-purple-600', light: 'bg-purple-100' },
    { value: 'pink', label: 'ピンク', bg: 'bg-pink-600', light: 'bg-pink-100' },
    { value: 'orange', label: 'オレンジ', bg: 'bg-orange-600', light: 'bg-orange-100' },
    { value: 'teal', label: 'ティール', bg: 'bg-teal-600', light: 'bg-teal-100' },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>メニュー設定</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>メニュー設定</span>
          </DialogTitle>
          <DialogDescription>
            メニューの表示やカラーテーマなど、画面表示に関する設定を変更できます。
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="menu" className="mt-4">
          <TabsList className="grid w-full grid-cols-3 gap-4">
            <TabsTrigger value="menu">メニュー編集</TabsTrigger>
            <TabsTrigger value="theme">テーマカラー</TabsTrigger>
            <TabsTrigger value="password">パスワード変更</TabsTrigger>
          </TabsList>

          {/* テーマカラータブ */}
          <TabsContent value="theme" className="space-y-4 mt-4">
            <div className="space-y-4">
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
                              <div className={`w-8 h-8 rounded ${opt.bg}`} />
                              <div className={`w-8 h-8 rounded ${opt.light}`} />
                            </div>
                            <p className="font-medium">{opt.label}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>

          {/* パスワード変更タブ */}
          <TabsContent value="password" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* 現在のパスワード */}
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm font-medium">現在のパスワード</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="現在のパスワードを入力"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </Button>
                </div>
              </div>
              {/* 新しいパスワード */}
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium">新しいパスワード</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="新しいパスワードを入力（8文字以上）"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </Button>
                </div>
              </div>
              {/* 確認用パスワード */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium">新しいパスワード（確認）</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="新しいパスワードを再入力"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </Button>
                </div>
              </div>
              {/* パスワード条件チェック */}
              {(newPassword || confirmPassword) && (
                <div className="space-y-2 mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {[
                    { ok: newPassword.length >= 8, label: '8文字以上' },
                    { ok: /[A-Z]/.test(newPassword), label: '大文字を含む' },
                    { ok: /[a-z]/.test(newPassword), label: '小文字を含む' },
                    { ok: /[0-9]/.test(newPassword), label: '数字を含む' },
                    { ok: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword), label: '記号を含む' },
                  ].map(({ ok, label }) => (
                    <div key={label} className={`flex items-center gap-2 text-sm ${ok ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {ok ? '✓' : '×'} {label}
                    </div>
                  ))}
                </div>
              )}
              {isPasswordValid && (
                <Button className="w-full medical-primary" onClick={() => {
                  toast.success('パスワードを変更しました')
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                }}>
                  パスワードを変更する
                </Button>
              )}
            </div>
          </TabsContent>

          {/* メニュー編集タブ */}
          <TabsContent value="menu" className="space-y-4 mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">左サイドメニューの表示項目を編集</h4>
                  <p className="text-xs text-muted-foreground mb-4">ドラッグして順番を変更、チェックで表示/非表示を切り替えできます。</p>
                  <div className="space-y-2">
                    {menuItems.map((item, index) => (
                      <div key={item.id}>
                        <div
                          draggable
                          onDragStart={() => handleMenuDragStart(index)}
                          onDragOver={(e) => handleMenuDragOver(e, index)}
                          onDragEnd={handleMenuDragEnd}
                          className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-move transition-all ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <Checkbox
                              id={`menu-${item.id}`}
                              checked={item.visible}
                              onCheckedChange={(checked) => {
                                setMenuItems(prev => prev.map((mi, i) =>
                                  i === index ? { ...mi, visible: !!checked } : mi
                                ))
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Label htmlFor={`menu-${item.id}`} className="cursor-pointer font-medium">{item.label}</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.id === 'orders' && (
                              <Collapsible open={isOrdersExpanded} onOpenChange={setIsOrdersExpanded}>
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 px-2">
                                    {isOrdersExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                  </Button>
                                </CollapsibleTrigger>
                              </Collapsible>
                            )}
                            <div className="flex flex-col gap-0.5">
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={(e) => { e.stopPropagation(); moveMenuItemUp(index) }} disabled={index === 0}>
                                <ChevronUp className={`w-4 h-4 ${index === 0 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={(e) => { e.stopPropagation(); moveMenuItemDown(index) }} disabled={index === menuItems.length - 1}>
                                <ChevronDown className={`w-4 h-4 ${index === menuItems.length - 1 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {item.id === 'orders' && (
                          <Collapsible open={isOrdersExpanded}>
                            <CollapsibleContent>
                              <div className="ml-8 mt-1 space-y-1">
                                {orderItems.map((orderItem, oIndex) => (
                                  <div
                                    key={orderItem.id}
                                    draggable
                                    onDragStart={() => handleOrderDragStart(oIndex)}
                                    onDragOver={(e) => handleOrderDragOver(e, oIndex)}
                                    onDragEnd={handleOrderDragEnd}
                                    className={`flex items-center space-x-3 p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-move transition-all ${draggedOrderIndex === oIndex ? 'opacity-50 scale-95' : ''}`}
                                  >
                                    <GripVertical className="w-3 h-3 text-gray-400" />
                                    <Checkbox
                                      id={`order-${orderItem.id}`}
                                      checked={orderItem.visible}
                                      onCheckedChange={(checked) => {
                                        setOrderItems(prev => prev.map((oi, i) =>
                                          i === oIndex ? { ...oi, visible: !!checked } : oi
                                        ))
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <Label htmlFor={`order-${orderItem.id}`} className="cursor-pointer text-sm flex-1">{orderItem.label}</Label>
                                    <div className="flex flex-col gap-0.5 ml-auto">
                                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={(e) => { e.stopPropagation(); moveOrderItemUp(oIndex) }} disabled={oIndex === 0}>
                                        <ChevronUp className={`w-3 h-3 ${oIndex === 0 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} />
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={(e) => { e.stopPropagation(); moveOrderItemDown(oIndex) }} disabled={oIndex === orderItems.length - 1}>
                                        <ChevronDown className={`w-3 h-3 ${oIndex === orderItems.length - 1 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => handleClose(false)}>キャンセル</Button>
          <Button className="medical-primary" onClick={handleSave}>保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
