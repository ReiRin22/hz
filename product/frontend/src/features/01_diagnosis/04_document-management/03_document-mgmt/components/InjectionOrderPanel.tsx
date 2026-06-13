import { useState } from 'react';
import { Save, ListPlus, FlaskConical, Clock, ChevronDown, Info, Search, Plus, Trash2, History, Package, Star, Calendar, Users, Building, Copy, X, Check } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Badge } from '@/shared/components/atoms/badge';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';
import { Input } from '@/shared/components/atoms/input';
import { toast } from 'sonner';
import { OrderDetail, OrderItem, FrequentOrderItem } from '../src/types/order';
import { 
  mockInjectionDrugs, 
  mockInjectionHistory, 
  mockInjectionSets, 
  mockFrequentInjections, 
  mockInjectionCategories,
  InjectionCategory,
  OrderSet
} from '../src/data/mockOrderData';
import { OutpatientInjectionLeftPanel } from './injection/OutpatientInjectionLeftPanel';
import { OutpatientInjectionCenterPanel } from './injection/OutpatientInjectionCenterPanel';
import { OutpatientInjectionRightPanel } from './injection/OutpatientInjectionRightPanel';
import { InjectionDetailDialog } from './injection/InjectionDetailDialog';

interface InjectionOrderPanelProps {
  onConfirmOrder?: (orders: any[]) => void;
  onAddToUnifiedOrderList?: (orders: any[]) => void;
}

export function InjectionOrderPanel({ onConfirmOrder, onAddToUnifiedOrderList }: InjectionOrderPanelProps) {
  // 外来・入院タブの状態管理
  const [patientType, setPatientType] = useState<'outpatient' | 'inpatient'>('outpatient');
  
  // 入院用の既存状態
  const [activeTab, setActiveTab] = useState('drugs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrugs, setSelectedDrugs] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  // スケジュールマトリクス用の状態
  const [scheduleMatrix, setScheduleMatrix] = useState<{ [drugId: string]: { [date: string]: boolean } }>({});
  
  // 詳細設定ダイアログ用の状態
  const [injectionDialogOpen, setInjectionDialogOpen] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<OrderItem | null>(null);
  
  // 外来用の状態管理
  const [outpatientCandidates, setOutpatientCandidates] = useState<OrderItem[]>([]);
  const [outpatientConfirmedOrders, setOutpatientConfirmedOrders] = useState<any[]>([]);
  const [outpatientActiveFilter, setOutpatientActiveFilter] = useState('all');
  const [outpatientActiveSubTab, setOutpatientActiveSubTab] = useState('search');
  
  // 日付の生成（今日から7日間）
  const generateScheduleDays = (): ScheduleDay[] => {
    const days: ScheduleDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      days.push({
        date: dateString,
        displayDate: `${date.getMonth() + 1}/${date.getDate()}`,
        dayOfWeek,
        isWeekend
      });
    }
    
    return days;
  };

  const scheduleDays = generateScheduleDays();

  // 薬剤を選択薬剤リストに追加（薬剤・薬効タブは詳細設定ダイアログを表示）
  const handleAddDrug = (drug: OrderItem) => {
    if (!selectedDrugs.find(d => d.name === drug.name)) {
      // 薬剤・薬効タブの場合は詳細設定ダイアログを表示
      if (activeTab === 'drugs' || activeTab === 'category') {
        setSelectedDrug(drug);
        setInjectionDialogOpen(true);
      } else {
        // その他のタブは直接追加
        const uniqueId = `${drug.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newDrug = { ...drug, id: uniqueId, source: activeTab as const };
        setSelectedDrugs(prev => [...prev, newDrug]);
        // 新しい薬剤のスケジュールマトリクス初期化
        setScheduleMatrix(prev => ({
          ...prev,
          [uniqueId]: {}
        }));
      }
    }
  };

  // セットを選択薬剤リストに追加
  const handleAddSet = (set: OrderSet) => {
    const newDrugs = set.items.filter(item => !selectedDrugs.find(d => d.name === item.name))
      .map(item => {
        const uniqueId = `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return { ...item, id: uniqueId, source: 'set' as const };
      });
    
    if (newDrugs.length > 0) {
      setSelectedDrugs(prev => [...prev, ...newDrugs]);
      // 新しい薬剤のスケジュールマトリクス初期化
      const newMatrix = { ...scheduleMatrix };
      newDrugs.forEach(drug => {
        newMatrix[drug.id] = {};
      });
      setScheduleMatrix(newMatrix);
    }
  };

  // 履歴を選択薬剤リストに追加
  const handleAddHistory = (history: typeof mockInjectionHistory[0]) => {
    const newDrugs = history.orders.filter(item => !selectedDrugs.find(d => d.name === item.name))
      .map(item => {
        const uniqueId = `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return { ...item, id: uniqueId, source: 'history' as const };
      });
    
    if (newDrugs.length > 0) {
      setSelectedDrugs(prev => [...prev, ...newDrugs]);
      // 新しい薬剤のスケジュールマトリクス初期化
      const newMatrix = { ...scheduleMatrix };
      newDrugs.forEach(drug => {
        newMatrix[drug.id] = {};
      });
      setScheduleMatrix(newMatrix);
    }
  };

  // 頻用薬剤を選択薬剤リストに追加
  const handleAddFrequent = (drug: FrequentOrderItem) => {
    if (!selectedDrugs.find(d => d.name === drug.name)) {
      const uniqueId = `${drug.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newDrug = { ...drug, id: uniqueId, source: 'frequent' as const };
      setSelectedDrugs(prev => [...prev, newDrug]);
      // 新しい薬剤のスケジュールマトリクス初期化
      setScheduleMatrix(prev => ({
        ...prev,
        [uniqueId]: {}
      }));
    }
  };

  // 薬効カテゴリから薬剤を追加（詳細設定ダイアログを表示）
  const handleAddCategoryDrug = (drug: OrderItem) => {
    if (!selectedDrugs.find(d => d.name === drug.name)) {
      setSelectedDrug(drug);
      setInjectionDialogOpen(true);
    }
  };

  // 詳細設定ダイアログからの薬剤追加処理
  const handleInjectionDetailConfirm = (orderDetail: any) => {
    if (patientType === 'outpatient') {
      // 外来の場合は統一オーダーリストに追加
      const detailOrder = {
        ...orderDetail,
        id: `outpatient-injection-${Date.now()}-${Math.random()}`,
        type: 'injection',
        administrationDate: orderDetail.startDate,
        route: orderDetail.route,
        timing: orderDetail.timing,
        frequency: orderDetail.frequency,
        infusionRate: orderDetail.infusionRate,
        period: orderDetail.period,
        notes: orderDetail.notes,
        isAsNeeded: orderDetail.isAsNeeded
      };
      
      if (onAddToUnifiedOrderList) {
        onAddToUnifiedOrderList([detailOrder]);
      } else {
        setOutpatientConfirmedOrders(prev => [...prev, detailOrder]);
        toast.success(`${orderDetail.name} をオーダーリストに追加しました`);
      }
    } else {
      // 入院の場合は既存処理
      // より一意性の高いIDを生成
      const uniqueId = `injection-${orderDetail.name.replace(/\s+/g, '_')}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newDrug = {
        id: uniqueId,
        name: orderDetail.name,
        dosage: orderDetail.dosage,
        usage: `${orderDetail.route} ${orderDetail.infusionRate} ${orderDetail.timing} ${orderDetail.frequency}`,
        source: activeTab as 'drugs' | 'category'
      };
      
      setSelectedDrugs(prev => [...prev, newDrug]);
      // 新しい薬剤のスケジュールマトリクス初期化
      setScheduleMatrix(prev => ({
        ...prev,
        [newDrug.id]: {}
      }));
    }
  };

  // 選択薬剤を削除
  const handleRemoveDrug = (drugId: string) => {
    setSelectedDrugs(prev => prev.filter(d => d.id !== drugId));
    setScheduleMatrix(prev => {
      const newMatrix = { ...prev };
      delete newMatrix[drugId];
      return newMatrix;
    });
  };

  // スケジュールマトリクスのセルをトグル
  const toggleScheduleCell = (drugId: string, date: string) => {
    setScheduleMatrix(prev => ({
      ...prev,
      [drugId]: {
        ...prev[drugId],
        [date]: !prev[drugId]?.[date]
      }
    }));
  };

  // 全日選択
  const handleSelectAllDays = (drugId: string) => {
    setScheduleMatrix(prev => {
      const newSchedule = { ...prev[drugId] };
      scheduleDays.forEach(day => {
        newSchedule[day.date] = true;
      });
      return {
        ...prev,
        [drugId]: newSchedule
      };
    });
  };

  // 全クリア
  const handleClearAll = (drugId: string) => {
    setScheduleMatrix(prev => ({
      ...prev,
      [drugId]: {}
    }));
  };

  // スケジュールコピー（最初の薬剤のスケジュールを他の薬剤にコピー）
  const handleCopySchedule = () => {
    if (selectedDrugs.length === 0) return;
    
    const firstDrugId = selectedDrugs[0].id;
    const firstSchedule = scheduleMatrix[firstDrugId] || {};
    
    setScheduleMatrix(prev => {
      const newMatrix = { ...prev };
      selectedDrugs.forEach(drug => {
        if (drug.id !== firstDrugId) {
          newMatrix[drug.id] = { ...firstSchedule };
        }
      });
      return newMatrix;
    });
  };

  // オーダー確定
  const handleConfirmAllOrders = () => {
    const orders = selectedDrugs.map(drug => {
      const schedule = scheduleMatrix[drug.id] || {};
      const scheduledDates = Object.entries(schedule)
        .filter(([_, isScheduled]) => isScheduled)
        .map(([date, _]) => date);
      
      return {
        id: `injection-${drug.id}-${Date.now()}`,
        name: drug.name,
        dosage: drug.dosage,
        usage: drug.usage,
        type: 'injection',
        scheduledDates,
        startDate: scheduledDates[0] || new Date().toISOString().split('T')[0],
        notes: `${scheduledDates.length}日間のスケジュール注射`
      };
    });
    
    if (orders.length > 0) {
      if (onAddToUnifiedOrderList) {
        onAddToUnifiedOrderList(orders);
      } else if (onConfirmOrder) {
        onConfirmOrder(orders);
      }
      // リセット
      setSelectedDrugs([]);
      setScheduleMatrix({});
    }
  };

  const filteredDrugs = mockInjectionDrugs.filter(drug =>
    drug.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 外来用のハンドラー
  const handleOutpatientAddCandidate = (item: OrderItem & { source?: string }) => {
    const newItem = {
      ...item,
      id: `${item.id}-${Date.now()}-${Math.random()}`,
      type: 'injection' as 'prescription' | 'injection' | 'lab',
      source: item.source
    };
    setOutpatientCandidates(prev => [...prev, newItem]);
    toast.success(`${item.name} を候補に追加しました`);
  };

  const handleOutpatientAddMultipleCandidates = (items: (OrderItem & { source?: string })[]) => {
    const newItems = items.map(item => ({
      ...item,
      id: `${item.id}-${Date.now()}-${Math.random()}`,
      type: 'injection' as 'prescription' | 'injection' | 'lab',
      source: item.source
    }));
    setOutpatientCandidates(prev => [...prev, ...newItems]);
    toast.success(`${items.length}件のオーダーを候補に追加しました`);
  };

  const handleOutpatientAddToDetail = (item: OrderItem) => {
    // 薬剤・薬効タブからの場合は詳細設定ダイアログを表示
    if (item.source === 'search' || item.source === 'category') {
      setSelectedDrug(item);
      setInjectionDialogOpen(true);
      return;
    }

    // その他のタブは統一オーダーリストに直接追加
    const detailOrder = {
      ...item,
      id: `outpatient-injection-${Date.now()}-${Math.random()}`,
      type: 'injection',
      administrationDate: new Date().toISOString().split('T')[0],
      route: '筋肉内注射',
      timing: '即時実施',
      frequency: '1回のみ',
      injectionSite: '上腕部'
    };
    
    if (onAddToUnifiedOrderList) {
      onAddToUnifiedOrderList([detailOrder]);
    } else {
      setOutpatientConfirmedOrders(prev => [...prev, detailOrder]);
      toast.success(`${item.name} をオーダーリストに追加しました`);
    }
  };

  const handleOutpatientAddMultipleToDetail = (items: OrderItem[]) => {
    if (items.length === 0) return;
    
    const detailOrders = items.map((item, index) => ({
      ...item,
      id: `outpatient-injection-${Date.now()}-${Math.random()}-${index}`,
      type: 'injection',
      administrationDate: new Date().toISOString().split('T')[0],
      route: '筋肉内注射',
      timing: '即時実施',
      frequency: '1回のみ',
      injectionSite: '上腕部'
    }));
    
    if (onAddToUnifiedOrderList) {
      onAddToUnifiedOrderList(detailOrders);
    } else {
      setOutpatientConfirmedOrders(prev => [...prev, ...detailOrders]);
      toast.success(`${items.length}件のオーダーをオーダーリストに追加しました`);
    }
  };

  const handleOutpatientUpdateOrder = (order: any) => {
    setOutpatientConfirmedOrders(prev => 
      prev.map(o => o.id === order.id ? order : o)
    );
  };

  const handleOutpatientRemoveOrder = (id: string) => {
    const removedOrder = outpatientConfirmedOrders.find(o => o.id === id);
    setOutpatientConfirmedOrders(prev => prev.filter(o => o.id !== id));
    
    if (removedOrder) {
      toast.success(`${removedOrder.name} をオーダーリストから削除しました`);
    }
  };

  const handleOutpatientConfirmAllOrders = () => {
    if (outpatientConfirmedOrders.length === 0) {
      toast.error('確定するオーダーがありません');
      return;
    }
    
    onConfirmOrder(outpatientConfirmedOrders);
    
    // オーダーリストをクリア
    setOutpatientConfirmedOrders([]);
    setOutpatientCandidates([]);
  };

  if (patientType === 'outpatient') {
    return (
      <div className="flex-1 bg-background flex flex-col h-screen">
        {/* 外来・入院タブ切り替え */}
        <div className="border-b border-border bg-card">
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-sm text-muted-foreground font-medium">オーダー入力</div>
                <h2 className="font-normal">注射オーダー</h2>
              </div>
            </div>
            
            <Tabs value={patientType} onValueChange={(value) => setPatientType(value as 'outpatient' | 'inpatient')} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="outpatient" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  外来
                </TabsTrigger>
                <TabsTrigger value="inpatient" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  入院
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* 外来3ペイン構成 */}
        <div className="flex flex-1 h-full">
          <OutpatientInjectionLeftPanel 
            onAddCandidate={handleOutpatientAddCandidate}
            onAddMultipleCandidates={handleOutpatientAddMultipleCandidates}
            onAddToDetail={handleOutpatientAddToDetail}
            onAddMultipleToDetail={handleOutpatientAddMultipleToDetail}
            activeSubTab={outpatientActiveSubTab}
            onSubTabChange={setOutpatientActiveSubTab}
          />
          
          {outpatientActiveSubTab === 'history' && (
            <OutpatientInjectionCenterPanel 
              candidates={outpatientCandidates}
              onAddToDetail={handleOutpatientAddToDetail}
              onAddMultipleToDetail={handleOutpatientAddMultipleToDetail}
              activeFilter={outpatientActiveFilter}
              onFilterChange={setOutpatientActiveFilter}
            />
          )}
          
          {/* 統一オーダーリストを使用しない場合のみ独自RightPanelを表示 */}
          {!onAddToUnifiedOrderList && (
            <OutpatientInjectionRightPanel 
              confirmedOrders={outpatientConfirmedOrders}
              onUpdateOrder={handleOutpatientUpdateOrder}
              onRemoveOrder={handleOutpatientRemoveOrder}
              onConfirmAllOrders={handleOutpatientConfirmAllOrders}
            />
          )}
        </div>

        {/* 外来用注射詳細設定ダイアログ */}
        <InjectionDetailDialog
          isOpen={injectionDialogOpen}
          onClose={() => setInjectionDialogOpen(false)}
          drug={selectedDrug}
          onConfirm={handleInjectionDetailConfirm}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background flex flex-col h-screen">
      {/* 外来・入院タブ切り替え */}
      <div className="border-b border-border bg-card">
        <div className="p-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-sm text-muted-foreground font-medium">オーダー入力</div>
              <h2 className="font-normal">注射オーダー</h2>
            </div>
            <Button
              onClick={handleConfirmAllOrders}
              disabled={selectedDrugs.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Calendar className="w-4 h-4 mr-2" />
              オーダー確定
            </Button>
          </div>
          
          <Tabs value={patientType} onValueChange={(value) => setPatientType(value as 'outpatient' | 'inpatient')} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="outpatient" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                外来
              </TabsTrigger>
              <TabsTrigger value="inpatient" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                入院
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 入院用の既存構成 */}
      <div className="flex-1 bg-background border-r border-border flex flex-col">
        {/* 上半分：薬剤選択エリア */}
        <div className="flex-1 max-h-96 border-b border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 mx-3 mt-2">
              <TabsTrigger value="drugs">薬剤</TabsTrigger>
              <TabsTrigger value="history">履歴</TabsTrigger>
              <TabsTrigger value="sets">セット</TabsTrigger>
              <TabsTrigger value="frequent">頻用</TabsTrigger>
              <TabsTrigger value="category">薬効</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="drugs" className="h-full m-0">
                <div className="p-3">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="注射薬を検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <ScrollArea className="h-48">
                    <div className="space-y-1">
                      {filteredDrugs.map((drug) => (
                        <div
                          key={drug.id}
                          className="p-2 rounded border border-border hover:bg-accent cursor-pointer group"
                          onClick={() => handleAddDrug(drug)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="text-sm">{drug.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {drug.dosage} - {drug.usage}
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="history" className="h-full m-0">
                <div className="p-3">
                  <ScrollArea className="h-56">
                    <div className="space-y-2">
                      {mockInjectionHistory.map((history, index) => (
                        <div
                          key={index}
                          className="p-2 rounded border border-border hover:bg-accent cursor-pointer group"
                          onClick={() => handleAddHistory(history)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">{history.date}</span>
                                <span className="text-xs text-muted-foreground">{history.department}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">{history.complaint}</div>
                              <div className="text-xs text-muted-foreground">
                                {history.orders.map((order, orderIndex) => (
                                  <div key={order.id} className="ml-2">
                                    • {order.name} ({order.dosage})
                                  </div>
                                ))}
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="sets" className="h-full m-0">
                <div className="p-3">
                  <ScrollArea className="h-56">
                    <div className="space-y-2">
                      {mockInjectionSets.map((set) => (
                        <div
                          key={set.id}
                          className="p-2 rounded border border-border hover:bg-accent cursor-pointer group"
                          onClick={() => handleAddSet(set)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="text-sm">{set.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {set.items.length}項目のセット
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="frequent" className="h-full m-0">
                <div className="p-3">
                  <ScrollArea className="h-56">
                    <div className="space-y-1">
                      {mockFrequentInjections.map((drug) => (
                        <div
                          key={drug.id}
                          className="p-2 rounded border border-border hover:bg-accent cursor-pointer group"
                          onClick={() => handleAddFrequent(drug)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{drug.name}</span>
                                <Badge variant="secondary">{drug.frequency}回</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {drug.dosage} - {drug.usage}
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="category" className="h-full m-0">
                <div className="p-3">
                  <ScrollArea className="h-56">
                    <div className="space-y-3">
                      {mockInjectionCategories.map((category) => (
                        <div key={category.id}>
                          <div className="text-sm font-medium mb-2 text-primary">
                            {category.name}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {category.description}
                          </div>
                          <div className="ml-2 space-y-1">
                            {category.drugs.map((drug) => (
                              <div
                                key={drug.id}
                                className="p-2 rounded border border-border hover:bg-accent cursor-pointer group"
                                onClick={() => handleAddCategoryDrug(drug)}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="text-xs">{drug.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {drug.dosage} - {drug.usage}
                                    </div>
                                  </div>
                                  <Plus className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* 選択薬剤リスト */}
          {selectedDrugs.length > 0 && (
            <div className="border-t border-border p-3 bg-muted/50">
              <h4 className="text-sm font-medium mb-2">選択薬剤リスト ({selectedDrugs.length}件)</h4>
              <div className="flex flex-wrap gap-1">
                {selectedDrugs.map((drug) => (
                  <div
                    key={drug.id}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                  >
                    <span>{drug.name}</span>
                    <button
                      onClick={() => handleRemoveDrug(drug.id)}
                      className="hover:bg-primary/20 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 下半分：スケジュールマトリクスエリア */}
        <div className="flex-1 min-h-80">
          <div className="border-b border-border p-3 bg-muted/30">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground font-medium">選択済みオーダーリスト</div>
                <h2 className="font-normal">注射オーダー</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopySchedule}
                  disabled={selectedDrugs.length < 2}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  スケジュールコピー
                </Button>
              </div>
            </div>
          </div>

          <div className="p-3 h-full overflow-auto">
            {selectedDrugs.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                <div className="text-center">
                  <div className="text-lg mb-2">薬剤を選択してください</div>
                  <div className="text-sm">上部のタブから注射薬を選択すると、こちらにスケジュールマトリクスが表示されます</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 日付ヘッダー */}
                <div className="grid gap-2 mb-4" style={{gridTemplateColumns: '250px 120px repeat(7, 1fr)'}}>
                  <div className="text-sm font-medium text-primary">薬剤名・用法用量</div>
                  <div className="text-sm font-medium text-center">操作</div>
                  {scheduleDays.map((day) => (
                    <div key={day.date} className="text-center">
                      <div className={`text-sm font-medium ${day.isWeekend ? 'text-red-600' : 'text-foreground'}`}>
                        {day.displayDate}
                      </div>
                      <div className={`text-xs ${day.isWeekend ? 'text-red-600' : 'text-muted-foreground'}`}>
                        ({day.dayOfWeek})
                      </div>
                    </div>
                  ))}
                </div>

                {/* 薬剤別スケジュール行 */}
                <div className="space-y-3">
                  {selectedDrugs.map((drug) => (
                    <div key={drug.id} className="bg-card rounded-lg border border-border p-3">
                      <div className="grid gap-2 items-center" style={{gridTemplateColumns: '250px 120px repeat(7, 1fr)'}}>
                        <div className="text-sm">
                          <div className="font-medium text-foreground">{drug.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {drug.dosage && <span>{drug.dosage} </span>}
                            {drug.usage && <span>- {drug.usage}</span>}
                          </div>
                          <button
                            onClick={() => handleRemoveDrug(drug.id)}
                            className="text-xs text-destructive hover:text-destructive/80 mt-1"
                          >
                            薬剤を削除
                          </button>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelectAllDays(drug.id)}
                            className="text-xs h-7"
                          >
                            全日選択
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleClearAll(drug.id)}
                            className="text-xs h-7"
                          >
                            クリア
                          </Button>
                        </div>

                        {scheduleDays.map((day) => (
                          <div key={day.date} className="flex justify-center">
                            <div
                              className={`w-10 h-10 border-2 rounded-lg cursor-pointer flex items-center justify-center transition-all hover:scale-105 ${
                                scheduleMatrix[drug.id]?.[day.date]
                                  ? 'bg-primary border-primary text-primary-foreground shadow-md'
                                  : 'border-muted-foreground/30 hover:border-primary hover:bg-primary/5'
                              }`}
                              onClick={() => toggleScheduleCell(drug.id, day.date)}
                            >
                              {scheduleMatrix[drug.id]?.[day.date] && (
                                <Check className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* サマリー情報 */}
                <div className="mt-6 p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{selectedDrugs.length}種類</span> の注射薬が選択されています。
                    スケジュールを設定して右上の「オーダー確定」ボタンをクリックしてください。
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 注射薬詳細設定ダイアログ */}
        <InjectionDetailDialog
          isOpen={injectionDialogOpen}
          onClose={() => setInjectionDialogOpen(false)}
          drug={selectedDrug}
          onConfirm={handleInjectionDetailConfirm}
        />
      </div>
    </div>
  );
}