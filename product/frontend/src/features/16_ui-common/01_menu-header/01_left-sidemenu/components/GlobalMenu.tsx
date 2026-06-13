import { useState, useEffect } from 'react';
import { FileText, Calendar, Users, ClipboardList, Stethoscope, ChevronRight, TestTube, ChevronLeft, Star, Monitor, User, Layers, X, Plus } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/atoms/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Label } from '@/shared/components/atoms/label';
import { Input } from '@/shared/components/atoms/input';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/atoms/tooltip';

// Myセットのダミーデータ
const mySetData = [
  {
    id: 'myset-1',
    name: '糖尿病セット',
    description: 'HbA1c、血糖値、尿検査',
    items: ['HbA1c', '血糖値', '尿糖', '尿蛋白']
  },
  {
    id: 'myset-2',
    name: '高血圧セット',
    description: '腎機能、電解質、尿検査',
    items: ['クレアチニン', 'eGFR', 'Na', 'K', 'Cl', '尿蛋白']
  },
  {
    id: 'myset-3',
    name: '肝機能セット',
    description: '肝機能基本検査',
    items: ['AST', 'ALT', 'γ-GTP', 'ALP', 'T-Bil']
  },
  {
    id: 'myset-4',
    name: '脂質異常症セット',
    description: '脂質関連検査',
    items: ['TC', 'TG', 'HDL-C', 'LDL-C']
  },
];

// Myセット作成用のオーダーダミーデータ
const availableOrdersForMySet = [
  { id: 'order-1', name: 'アムロジピン錠5mg「サワイ」1錠', type: '処方' },
  { id: 'order-2', name: '血算（CBC）', type: '検体' },
  { id: 'order-3', name: 'インスリン注射', type: '注射' },
  { id: 'order-4', name: '胸部X線', type: '画像' },
  { id: 'order-5', name: '創傷処置（清拭・ガーゼ交換）', type: '処置' },
  { id: 'order-6', name: '心電図検査', type: '生理' },
  { id: 'order-7', name: '理学療法（PT）', type: 'リハビリ' },
  { id: 'order-8', name: '食事指導（糖尿病）', type: '指導' },
  { id: 'order-9', name: 'HbA1c', type: '検体' },
];

// セット選択ダイアログの「セット」タブ用データ
const compositeSetData = {
  prescription: [
    {
      id: 'preset-1',
      name: '糖尿病治療セット',
      description: '糖尿病の標準的な治療薬セット',
      items: ['メトホルミン 500mg', 'グリメピリド 1mg']
    },
    {
      id: 'preset-2',
      name: '高血圧治療セット',
      description: '高血圧の標準的な治療薬セット',
      items: ['アムロジピン 5mg', 'カンデサルタン 8mg']
    },
    {
      id: 'preset-3',
      name: '脂質異常症セット',
      description: '脂質異常症の標準的な治療薬セット',
      items: ['アトルバスタチン 10mg', 'エゼチミブ 10mg']
    },
    {
      id: 'preset-4',
      name: '感冒セット',
      description: '感冒症状の標準的な治療薬セット',
      items: ['カロナール 200mg', 'PL配合顆粒', 'ムコダイン 250mg']
    },
  ],
  injection: [
    {
      id: 'injset-1',
      name: '輸液基本セット',
      description: '標準的な輸液セット',
      items: ['生理食塩水 500ml']
    },
    {
      id: 'injset-2',
      name: '電解質補正セット',
      description: '電解質補正用の輸液セット',
      items: ['ソリタT3号 500ml', 'KCL 20mEq']
    },
    {
      id: 'injset-3',
      name: 'ビタミン補充セット',
      description: 'ビタミン補充用セット',
      items: ['ビタミンB1 100mg', 'ビタミンC 500mg']
    },
    {
      id: 'injset-4',
      name: '抗菌薬投与セット',
      description: '抗菌薬投与用セット',
      items: ['生理食塩水 500ml', 'セフトリアキソン 1g']
    },
  ],
  lab: [
    {
      id: 'labset-1',
      name: '糖尿病セット',
      description: 'HbA1c、血糖値、尿検査',
      items: ['HbA1c', '血糖値', '尿糖', '尿蛋白']
    },
    {
      id: 'labset-2',
      name: '高血圧セット',
      description: '腎機能、電解質、尿検査',
      items: ['クレアチニン', 'eGFR', 'Na', 'K', 'Cl', '尿蛋白']
    },
    {
      id: 'labset-3',
      name: '肝機能セット',
      description: '肝機能基本検査',
      items: ['AST', 'ALT', 'γ-GTP', 'ALP', 'T-Bil']
    },
    {
      id: 'labset-4',
      name: '脂質異常症セット',
      description: '脂質関連検査',
      items: ['TC', 'TG', 'HDL-C', 'LDL-C']
    },
  ]
};

const getMenuItems = (currentView: string) => [
  { id: 'chart', label: 'カルテ', icon: Stethoscope, active: currentView === 'chart' },
  { 
    id: 'order', 
    label: 'オーダー', 
    icon: ClipboardList, 
    active: currentView === 'order',
    subItems: [
      { id: 'prescription', label: '処方オーダー' },
      { id: 'injection', label: '注射オーダー' },
      { id: 'lab', label: '検体オーダー' },
      { id: 'treatment', label: '処置オーダー' },
      { id: 'guidance', label: '指導オーダー' },
      { id: 'physiology', label: '生理検査オーダー' },
      { id: 'endoscopy', label: '内視鏡検査オーダー' },
      { id: 'imaging', label: '画像検査オーダー' },
      { id: 'pathology', label: '病理検査オーダー' },
      { id: 'bacteriology', label: '細菌検査オーダー' },
      { id: 'general', label: '汎用オーダー' },
      { id: 'composite', label: '複合オーダー' },
      { id: 'meal', label: '食事オーダー' },
      { id: 'rehabilitation', label: 'リハビリオーダー' },
      { id: 'transfusion', label: '輸血オーダー' },
      { id: 'surgery', label: '手術オーダー' },
      { id: 'dialysis', label: '透析オーダー' },
      { id: 'admission', label: '入院オーダー' },
      { id: 'discharge', label: '退院オーダー' },
      { id: 'transfer', label: '転棟転科転室オーダー' },
      { id: 'nursingCare', label: '看護ケアオーダー' }
    ]
  },
  { id: 'results', label: '検査結果', icon: TestTube },
  { id: 'patient', label: '患者一覧', icon: Users, active: currentView === 'patient' },
  { id: 'document', label: '文書', icon: FileText },
  { id: 'testAppointment', label: '検査予約', icon: Monitor },
  { id: 'appointment', label: '診察予約', icon: Calendar, active: currentView === 'appointment' },
  { id: 'mymenu', label: 'メニュー', icon: Star },
];

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
  allergies?: string[];
}

interface GlobalMenuProps {
  activeOrderType?: string;
  onOrderTypeChange?: (type: string) => void;
  onMenuClick?: (menuId: string) => void;
  currentView?: 'order' | 'patient' | 'appointment' | 'chart';
  currentPatient?: CurrentPatient;
  onAddSetOrders?: (setData: { id: string; name: string; items: string[]; type: 'my-set' | 'composite-set' }) => void;
}

export function GlobalMenu({ 
  activeOrderType = 'prescription', 
  onOrderTypeChange,
  onMenuClick,
  currentView = 'order',
  currentPatient,
  onAddSetOrders
}: GlobalMenuProps) {
  const [showOrderSubmenu, setShowOrderSubmenu] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [patientInfoOpen, setPatientInfoOpen] = useState(false);
  const [setDialogOpen, setSetDialogOpen] = useState(false);
  const [selectedSetOrderType, setSelectedSetOrderType] = useState<'prescription' | 'injection' | 'lab'>('prescription');
  const [activeSetTab, setActiveSetTab] = useState<'my-set' | 'set'>('my-set');
  const [addMySetDialogOpen, setAddMySetDialogOpen] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [mySetOrderType, setMySetOrderType] = useState<'prescription' | 'injection' | 'lab' | 'imaging' | 'treatment' | 'rehabilitation' | 'physiology' | 'guidance'>('lab');
  
  // カルテ表示時はオーダーメニューを展開状態にする
  useEffect(() => {
    if (currentView === 'chart') {
      setShowOrderSubmenu(true);
    }
  }, [currentView]);
  
  return (
    <div className={`bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-25'}`}>
      <TooltipProvider delayDuration={300}>
        <nav className="flex-1 py-4">
          {/* 折りたたみボタン */}
          <div className="flex justify-center mb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
                  aria-label={isCollapsed ? 'メニューを展開' : 'メニューを折りたたむ'}
                >
                  <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-white text-black border border-gray-200">
                  <p>展開</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
          
          {getMenuItems(currentView).map((item) => {
            const Icon = item.icon;
            const hasSubmenu = item.subItems && item.subItems.length > 0;
            
            return (
              <div key={item.id}>
                {/* 患者一覧の前に患者基本情報ボタンを表示 */}
                {item.id === 'patient' && currentPatient && (
                  <Dialog open={patientInfoOpen} onOpenChange={setPatientInfoOpen}>
                    <DialogTrigger asChild>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="mx-2 mb-1 p-2 rounded-lg cursor-pointer transition-colors group relative text-sidebar-foreground hover:bg-sidebar-accent"
                          >
                            <div className="flex items-center justify-between">
                              <User className="w-6 h-6" />
                            </div>
                            <div className={`text-xs mt-1 text-center leading-tight ${isCollapsed ? 'hidden' : ''}`}>
                              患者情報
                            </div>
                          </div>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right" className="bg-white text-black border border-gray-200">
                            <p>患者情報</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>患者基本情報</DialogTitle>
                        <DialogDescription>
                          現在選択中の患者の基本情報
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">患者ID</div>
                            <div>{currentPatient.patientNumber}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">診察日</div>
                            <div>{currentPatient.visitDate}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">氏名</div>
                            <div>{currentPatient.name}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">年齢・性別</div>
                            <div>{currentPatient.age}歳 {currentPatient.gender === 'male' ? '男性' : '女性'}</div>
                          </div>
                        </div>
                        {currentPatient.allergies && currentPatient.allergies.length > 0 && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">アレルギー情報</div>
                            <div className="flex flex-wrap gap-1">
                              {currentPatient.allergies.map((allergy, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded bg-destructive/10 text-destructive text-xs">
                                  {allergy}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        mx-2 mb-1 p-2 rounded-lg cursor-pointer transition-colors
                        group relative
                        ${item.active 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                        }
                      `}
                      onClick={() => {
                        if (item.id === 'order') {
                          setShowOrderSubmenu(!showOrderSubmenu);
                          onMenuClick?.('order');
                        } else if (item.id === 'patient') {
                          onMenuClick?.('patient');
                        } else if (item.id === 'appointment') {
                          onMenuClick?.('appointment');
                        } else if (item.id === 'chart') {
                          onMenuClick?.('chart');
                        } else {
                          onMenuClick?.(item.id);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="w-6 h-6" />
                        {hasSubmenu && !isCollapsed && (
                          <ChevronRight 
                            className={`w-3 h-3 transition-transform ${showOrderSubmenu ? 'rotate-90' : ''}`} 
                          />
                        )}
                      </div>
                      <div className={`text-xs mt-1 text-center leading-tight ${isCollapsed ? 'hidden' : ''}`}>
                        {item.label}
                      </div>
                    </div>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="bg-white text-black border border-gray-200 max-w-xs">
                      <div>
                        <p className="font-semibold mb-1">{item.label}</p>
                        {hasSubmenu && item.subItems && (
                          <div className="text-xs space-y-0.5 mt-2">
                            {item.subItems.slice(0, 5).map((subItem) => (
                              <div key={subItem.id}>• {subItem.label}</div>
                            ))}
                            {item.subItems.length > 5 && (
                              <div className="text-gray-500">...他{item.subItems.length - 5}件</div>
                            )}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
                
                {/* オーダーサブメニュー */}
                {item.id === 'order' && showOrderSubmenu && item.subItems && (currentView === 'order' || currentView === 'chart') && !isCollapsed && (
                  <div className="mx-2 mb-2 bg-sidebar-accent rounded-lg overflow-hidden">
                    {item.subItems.map((subItem) => (
                      <div
                        key={subItem.id}
                        className={`
                          px-3 py-2 text-xs cursor-pointer transition-colors
                          ${activeOrderType === subItem.id && currentView !== 'chart'
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-sidebar-foreground hover:bg-sidebar-accent'
                          }
                        `}
                        onClick={() => onOrderTypeChange?.(subItem.id)}
                      >
                        {subItem.label}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* メニューボタンの後にセットボタンを表示 */}
                {item.id === 'mymenu' && (
                  <Dialog open={setDialogOpen} onOpenChange={setSetDialogOpen}>
                    <DialogTrigger asChild>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="mx-2 mb-1 p-2 rounded-lg cursor-pointer transition-colors group relative text-sidebar-foreground hover:bg-sidebar-accent"
                          >
                            <div className="flex items-center justify-between">
                              <Layers className="w-6 h-6" />
                            </div>
                            <div className={`text-xs mt-1 text-center leading-tight ${isCollapsed ? 'hidden' : ''}`}>
                              セット
                            </div>
                          </div>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right" className="bg-white text-black border border-gray-200">
                            <p>セット</p>
                            <div className="text-xs mt-1 text-gray-500">Myセット・セットを選択</div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <DialogTitle>セット選択</DialogTitle>
                            <DialogDescription>
                              Myセットまたはセットを選択してください
                            </DialogDescription>
                          </div>
                          <div className="flex gap-2">
                            {activeSetTab === 'my-set' && (
                              <Button
                                variant="default"
                                size="sm"
                                className="gap-1"
                                onClick={() => {
                                  setAddMySetDialogOpen(true);
                                }}
                              >
                                <Plus className="h-4 w-4" />
                                追加
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1"
                              onClick={() => setSetDialogOpen(false)}
                            >
                              <X className="h-4 w-4" />
                              閉じる
                            </Button>
                          </div>
                        </div>
                      </DialogHeader>
                      <Tabs defaultValue="my-set" className="w-full" value={activeSetTab} onValueChange={setActiveSetTab}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="my-set">Myセット</TabsTrigger>
                          <TabsTrigger value="set">セット</TabsTrigger>
                        </TabsList>
                        <TabsContent value="my-set" className="mt-4">
                          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                            {mySetData.map((set) => (
                              <div
                                key={set.id}
                                className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                                onClick={() => {
                                  if (onAddSetOrders) {
                                    onAddSetOrders({ id: set.id, name: set.name, items: set.items, type: 'my-set' });
                                  }
                                  setSetDialogOpen(false);
                                }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="text-sm mb-1">{set.name}</div>
                                    <div className="text-xs text-muted-foreground mb-2">
                                      {set.description}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {set.items.map((item, index) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary"
                                        >
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value="set" className="mt-4">
                          <div className="mb-4">
                            <Label htmlFor="order-type-select" className="text-sm mb-2 block">オーダー種別</Label>
                            <Select 
                              value={selectedSetOrderType} 
                              onValueChange={(value: 'prescription' | 'injection' | 'lab') => setSelectedSetOrderType(value)}
                            >
                              <SelectTrigger id="order-type-select">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="prescription">処方オーダー</SelectItem>
                                <SelectItem value="injection">注射オーダー</SelectItem>
                                <SelectItem value="lab">検体オーダー</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                            {compositeSetData[selectedSetOrderType].map((set) => (
                              <div
                                key={set.id}
                                className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                                onClick={() => {
                                  if (onAddSetOrders) {
                                    onAddSetOrders({ id: set.id, name: set.name, items: set.items, type: 'composite-set' });
                                  }
                                  setSetDialogOpen(false);
                                }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="text-sm mb-1">{set.name}</div>
                                    <div className="text-xs text-muted-foreground mb-2">
                                      {set.description}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {set.items.map((item, index) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary/50 text-secondary-foreground"
                                        >
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            );
          })}
        </nav>
      </TooltipProvider>
      
      {/* Myセット追加ダイアログ */}
      <Dialog open={addMySetDialogOpen} onOpenChange={setAddMySetDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Myセット追加</DialogTitle>
            <DialogDescription>
              新しいMyセットを作成します
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="set-name" className="text-sm mb-2 block">セット名 <span className="text-destructive">*</span></Label>
              <Input
                id="set-name"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                placeholder="セット名を入力してください"
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">オーダー選択</Label>
              <div className="border rounded-lg p-2 max-h-[40vh] overflow-y-auto space-y-2">
                {availableOrdersForMySet.map((order) => (
                  <div key={order.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={order.id}
                      checked={selectedItems.includes(order.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems([...selectedItems, order.name]);
                        } else {
                          setSelectedItems(selectedItems.filter(item => item !== order.name));
                        }
                      }}
                    />
                    <label
                      htmlFor={order.id}
                      className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                    >
                      <span>{order.name}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ml-2 ${
                        order.type === '処方' ? 'bg-blue-100 text-blue-700' :
                        order.type === '検体' ? 'bg-green-100 text-green-700' :
                        order.type === '注射' ? 'bg-purple-100 text-purple-700' :
                        order.type === '画像' ? 'bg-cyan-100 text-cyan-700' :
                        order.type === '処置' ? 'bg-orange-100 text-orange-700' :
                        order.type === '生理' ? 'bg-pink-100 text-pink-700' :
                        order.type === 'リハビリ' ? 'bg-yellow-100 text-yellow-700' :
                        order.type === '指導' ? 'bg-red-100 text-red-700' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {order.type}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {selectedItems.length > 0 && (
              <div>
                <Label className="text-sm mb-2 block">選択中のオーダー ({selectedItems.length}件)</Label>
                <div className="flex flex-wrap gap-1 p-2 border rounded-lg max-h-[10vh] overflow-y-auto">
                  {selectedItems.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setAddMySetDialogOpen(false);
                  setNewSetName('');
                  setNewSetDescription('');
                  setSelectedItems([]);
                }}
              >
                キャンセル
              </Button>
              <Button
                onClick={() => {
                  // TODO: Myセットの保存処理を実装
                  console.log('新しいMyセット:', { 
                    name: newSetName, 
                    description: newSetDescription,
                    items: selectedItems
                  });
                  setAddMySetDialogOpen(false);
                  setNewSetName('');
                  setNewSetDescription('');
                  setSelectedItems([]);
                }}
                disabled={!newSetName || selectedItems.length === 0}
              >
                登録
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}