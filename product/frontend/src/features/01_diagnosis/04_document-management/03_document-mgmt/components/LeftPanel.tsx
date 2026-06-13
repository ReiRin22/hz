import React, { useState } from 'react';
import { History, Star, Package, Search, FileText, ChevronDown, ChevronRight, TrendingUp, Plus, Clock, Calendar, CalendarDays } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Badge } from '@/shared/components/atoms/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';
import { Label } from '@/shared/components/atoms/label';
import { OrderItem, FrequentOrderItem } from '../src/types/order';
import { 
  DrugCategory, 
  DrugSubcategory, 
  LabCategory, 
  OrderSet,
  mockDrugCategories,
  mockLabCategories,
  mockHistoryByTab,
  mockOrderSets,
  mockFrequentOrders
} from '../src/data/mockOrderData';

interface LeftPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddCandidate: (item: OrderItem & { source?: string }) => void;
  onAddMultipleCandidates: (items: (OrderItem & { source?: string })[]) => void;
  // 検体オーダー用の直接追加機能
  onAddToDetail?: (item: OrderItem) => void;
  onAddMultipleToDetail?: (items: OrderItem[]) => void;
  // サブタブの外部状態管理
  activeSubTab?: string;
  onSubTabChange?: (subTab: string) => void;
}

export function LeftPanel({ 
  activeTab, 
  onTabChange, 
  onAddCandidate, 
  onAddMultipleCandidates, 
  onAddToDetail, 
  onAddMultipleToDetail,
  activeSubTab: externalActiveSubTab,
  onSubTabChange: externalOnSubTabChange
}: LeftPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  
  // 外部からactiveSubTabが渡される場合はそれを使用、そうでなければ内部状態を使用
  const [internalActiveSubTab, setInternalActiveSubTab] = useState('history');
  const activeSubTab = externalActiveSubTab ?? internalActiveSubTab;
  const setActiveSubTab = externalOnSubTabChange ?? setInternalActiveSubTab;

  // 薬効分類の状態管理
  const [drugCategories, setDrugCategories] = useState<DrugCategory[]>(mockDrugCategories);
  const [selectedCategory, setSelectedCategory] = useState<DrugCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<DrugSubcategory | null>(null);

  const handleAddItem = (item: OrderItem, source: string) => {
    onAddCandidate({ ...item, source });
  };

  const handleAddSet = (set: OrderSet) => {
    // セットを1つのグループとして候補に追加
    const groupItem = {
      id: `set-group-${set.id}-${Date.now()}`,
      name: set.name,
      type: activeTab as 'prescription' | 'injection' | 'lab',
      source: 'set' as const,
      groupItems: set.items.map(item => ({ ...item, source: 'set' }))
    };
    onAddCandidate(groupItem);
  };

  const handleAddHistory = (history: typeof mockHistoryByTab.prescription[0]) => {
    // 履歴を1つのグループとして候補に追加
    const filteredOrders = history.orders.filter(order => {
      return true;
    });
    const groupItem = {
      id: `history-group-${history.date}-${Date.now()}`,
      name: `${history.date} ${history.complaint}`,
      type: activeTab as 'prescription' | 'injection' | 'lab',
      source: 'history' as const,
      groupItems: filteredOrders.map(order => ({ ...order, source: 'history' }))
    };
    onAddCandidate(groupItem);
  };

  const handleSubTabChange = (newSubTab: string) => {
    setActiveSubTab(newSubTab);
    // サブタブ変更時に状態をリセット
    setSearchQuery('');
    setSelectedHistory(null);
  };

  // オーダー種別に応じたデフォルトタブを設定
  const getDefaultSubTab = () => {
    if (activeTab === 'lab') {
      return 'search'; // 検査項目を最初に表示
    } else if (activeTab === 'prescription') {
      return 'search'; // 薬剤を最初に表示
    }
    return 'history';
  };

  // アクティブタブが変更されたときにサブタブもリセット
  React.useEffect(() => {
    setActiveSubTab(getDefaultSubTab());
  }, [activeTab]);

  // 検体オーダー用の検査項目直接追加
  const handleAddLabItem = (item: OrderItem) => {
    if (onAddToDetail) {
      onAddToDetail({ ...item, type: 'lab' });
    }
  };

  // 検体オーダー用のセット直接追加
  const handleAddLabSet = (set: OrderSet) => {
    if (onAddMultipleToDetail) {
      const labItems = set.items.map(item => ({ ...item, type: 'lab' as const }));
      onAddMultipleToDetail(labItems);
    }
  };

  // 検体オーダー用の頻用項目直接追加
  const handleAddLabFrequentItem = (item: FrequentOrderItem) => {
    if (onAddToDetail) {
      onAddToDetail({ ...item, type: 'lab' });
    }
  };

  // 処方オーダー用の薬剤直接追加
  const handleAddDrugItem = (item: OrderItem) => {
    if (onAddToDetail) {
      onAddToDetail({ ...item, type: 'prescription' });
    }
  };

  // 処方オーダー用のセット直接追加
  const handleAddDrugSet = (set: OrderSet) => {
    if (onAddMultipleToDetail) {
      const drugItems = set.items.map(item => ({ ...item, type: 'prescription' as const }));
      onAddMultipleToDetail(drugItems);
    }
  };

  // 処方オーダー用の頻用項目直接追加
  const handleAddDrugFrequentItem = (item: FrequentOrderItem) => {
    if (onAddToDetail) {
      onAddToDetail({ ...item, type: 'prescription' });
    }
  };

  // 薬効分類の展開/折りたたみ
  const toggleCategoryExpansion = (categoryId: string) => {
    setDrugCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  // 薬効分類選択
  const handleCategorySelect = (category: DrugCategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  // サブカテゴリ選択
  const handleSubcategorySelect = (subcategory: DrugSubcategory) => {
    setSelectedSubcategory(subcategory);
  };

  // サブタブの内容をレンダリングする関数
  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'history':
        return (
          <div className="p-4">
            <h3 className="mb-3">診療履歴</h3>
            <div className="mb-2 text-xs text-muted-foreground">
              履歴をクリックでグループを候補に追加
            </div>
            <div className="space-y-2">
              {mockHistoryByTab[activeTab]?.map((history, index) => (
                <div
                  key={index}
                  className="p-2 rounded border cursor-pointer transition-colors border-border hover:bg-accent group"
                  onClick={() => handleAddHistory(history)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">{history.date}</span>
                        <span className="text-xs text-muted-foreground">{history.department}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">{history.complaint}</div>
                      
                      {/* オーダー概要表示 */}
                      <div className="text-xs text-muted-foreground">
                        <div className="font-medium mb-1">オーダー内容:</div>
                        {history.orders.map((order, orderIndex) => (
                          <div key={order.id} className="ml-2">
                            • {order.name} {order.dosage && activeTab !== 'lab' ? `(${order.dosage})` : ''}
                          </div>
                        ))}
                        <div className="mt-2 text-primary group-hover:text-primary/80">
                          {history.orders.length}件のオーダーを候補に追加
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'sets':
        return (
          <div className="p-4">
            <h3 className="mb-3">オーダーセット</h3>
            <div className="mb-2 text-xs text-muted-foreground">
              {isDirectMode ? 'セットをクリックで直接オーダーリストに追加' : 'セットをクリックでグループを候補に追加'}
            </div>
            <div className={`${isDirectMode ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
              {mockOrderSets[activeTab]?.map((set) => (
                <div 
                  key={set.id} 
                  className="p-2 rounded border border-border hover:bg-accent cursor-pointer group"
                  onClick={() => isDirectMode ? (activeTab === 'lab' ? handleAddLabSet(set) : handleAddDrugSet(set)) : handleAddSet(set)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm">{set.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {set.items.length}項目のセット
                      </div>
                      <div className="text-xs text-primary group-hover:text-primary/80 mt-1">
                        {isDirectMode ? `${set.items.length}件を直接オーダーリストに追加` : `${set.items.length}件のオーダーを候補に追加`}
                      </div>
                    </div>
                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'category':
        // 処方オーダーの薬効検索機能（2エリア構成）
        if (activeTab === 'prescription') {
          return (
            <div className="flex h-full">
              {/* 左側：薬効分類ツリー */}
              <div className="w-60 border-r border-border bg-card">
                <div className="p-3 border-b border-border">
                  <h3 className="text-sm font-medium">薬効分類</h3>
                </div>
                <ScrollArea className="h-full">
                  <div className="p-2">
                    {drugCategories.map((category) => (
                      <div key={category.id} className="mb-2">
                        <div
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors text-sm ${
                            selectedCategory?.id === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                          }`}
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category.subcategories && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategoryExpansion(category.id);
                              }}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {category.isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{category.name}</div>
                            <div className="text-xs text-muted-foreground">{category.description}</div>
                          </div>
                        </div>

                        {/* サブカテゴリ */}
                        {category.isExpanded && category.subcategories && (
                          <div className="ml-6 mt-1 space-y-1">
                            {category.subcategories.map((subcategory) => (
                              <div
                                key={subcategory.id}
                                className={`p-2 rounded cursor-pointer transition-colors text-xs ${
                                  selectedSubcategory?.id === subcategory.id 
                                    ? 'bg-primary/20 text-primary' 
                                    : 'hover:bg-accent'
                                }`}
                                onClick={() => handleSubcategorySelect(subcategory)}
                              >
                                <div className="font-medium">{subcategory.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {subcategory.description} ({subcategory.drugs.length}剤)
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* 右側：薬剤一覧 */}
              <div className="flex-1 bg-background">
                <div className="p-3 border-b border-border">
                  <h3 className="text-sm font-medium">薬剤一覧</h3>
                  {selectedSubcategory ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedCategory?.name} &gt; {selectedSubcategory.name}
                    </p>
                  ) : selectedCategory ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedCategory.name}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      左側の薬効分類から選択してください
                    </p>
                  )}
                </div>
                <ScrollArea className="h-full">
                  <div className="p-3">
                    {!selectedCategory ? (
                      <div className="text-center text-muted-foreground py-8">
                        <div className="text-sm">薬効分類を選択してください</div>
                      </div>
                    ) : selectedSubcategory ? (
                      // サブカテゴリが選択された場合はその薬剤を表示
                      <div className="space-y-3">
                        {selectedSubcategory.drugs.map((drug) => (
                          <div
                            key={drug.id}
                            className="p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="text-sm font-medium">{drug.name}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {selectedSubcategory.name}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <div>規格: {drug.dosage}</div>
                                  <div>剤形: {drug.formulation}</div>
                                  <div>用法: {drug.usage}</div>
                                  <div>経路: {drug.route}</div>
                                  <div className="col-span-2">適応: {drug.indication}</div>
                                </div>
                              </div>
                              
                              <Button
                                size="sm"
                                onClick={() => handleAddDrugItem({ ...drug, source: 'category' })}
                                className="ml-4"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                追加
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // カテゴリのみ選択された場合
                      <div className="space-y-4">
                        {selectedCategory.subcategories ? (
                          // サブカテゴリがある場合は全サブカテゴリの薬剤を表示
                          selectedCategory.subcategories.map((subcategory) => (
                            <div key={subcategory.id}>
                              <h4 className="text-sm font-medium mb-2 text-primary">
                                {subcategory.name} ({subcategory.drugs.length}剤)
                              </h4>
                              <div className="space-y-2">
                                {subcategory.drugs.map((drug) => (
                                  <div
                                    key={drug.id}
                                    className="p-2 border border-border rounded hover:bg-accent transition-colors"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="text-sm font-medium">{drug.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {drug.dosage} - {drug.usage} - {drug.route}
                                        </div>
                                        <div className="text-xs text-blue-600 mt-1">
                                          {drug.indication}
                                        </div>
                                      </div>
                                      
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAddDrugItem({ ...drug, source: 'category' })}
                                        className="ml-2"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : selectedCategory.drugs ? (
                          // 直接薬剤がある場合
                          <div className="space-y-2">
                            {selectedCategory.drugs.map((drug) => (
                              <div
                                key={drug.id}
                                className="p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">{drug.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {drug.dosage} - {drug.usage} - {drug.route}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">
                                      {drug.indication}
                                    </div>
                                  </div>
                                  
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddDrugItem({ ...drug, source: 'category' })}
                                    className="ml-4"
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    追加
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          );
        }
        return null;

      case 'search':
        // 検体オーダーの場合は検査項目パネル表示
        if (activeTab === 'lab') {
          return (
            <div className="p-4">
              <h3 className="mb-3">検査項目</h3>
              
              {/* 検索フィールド */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="検査名を入力"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* 検索結果（入力時） */}
              {searchQuery.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm mb-2">検索結果</h4>
                  <div className={`${isDirectMode ? 'grid grid-cols-3 gap-2' : 'space-y-2'}`}>
                    {[
                      { id: 'search-1', name: `${searchQuery}` },
                      { id: 'search-2', name: `${searchQuery}定量` },
                      { id: 'search-3', name: `${searchQuery}定性` }
                    ].map((item, index) => (
                      <div key={index} className="p-2 rounded border border-border hover:bg-accent group">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-sm">{item.name}</div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="ml-2 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleAddLabItem({ ...item, source: 'search' })}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 検査項目カテゴリ別パネル */}
              <div className="space-y-4">
                <h4 className="text-sm">検査項目一覧</h4>
                <div className={`gap-4 ${isDirectMode ? 'grid grid-cols-2' : 'space-y-4'}`}>
                  {mockLabCategories.map((category) => (
                    <div key={category.id} className="border rounded-lg">
                      <div className="p-3 bg-muted/30 border-b">
                        <h5 className="text-sm">{category.name}</h5>
                      </div>
                      <div className={`p-2 grid gap-2 grid-cols-2`}>
                        {category.items.map((item) => (
                          <Button
                            key={item.id}
                            variant="ghost"
                            size="sm"
                            className="h-8 justify-start text-xs hover:bg-primary hover:text-primary-foreground"
                            onClick={() => handleAddLabItem({ ...item, source: 'search' })}
                          >
                            {item.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // 処方オーダーの場合は直接入力モード対応
        if (activeTab === 'prescription') {
          return (
            <div className="p-4">
              <h3 className="mb-3">薬剤検索</h3>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="薬剤名を入力（3文字以上）"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* 検索結果（入力時） */}
              {searchQuery.length >= 3 && (
                <div className="mb-4">
                  <h4 className="text-sm mb-2">検索結果</h4>
                  <div className={`${isDirectMode ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
                    {[
                      { id: 'search-1', name: `${searchQuery}錠200mg`, dosage: '200mg', usage: '1日3回食後' },
                      { id: 'search-2', name: `${searchQuery}散50%`, dosage: '0.5g', usage: '1日2回食後' },
                      { id: 'search-3', name: `${searchQuery}注射液10mg`, dosage: '10mg', usage: '静脈内投与' },
                      { id: 'search-4', name: `${searchQuery}カプセル100mg`, dosage: '100mg', usage: '1日2回食後' },
                      { id: 'search-5', name: `${searchQuery}シロップ1%`, dosage: '5ml', usage: '1日3回食後' },
                      { id: 'search-6', name: `${searchQuery}貼付剤40mg`, dosage: '40mg', usage: '1日1回貼付' }
                    ].map((item, index) => (
                      <div key={index} className="p-2 rounded border border-border hover:bg-accent group">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-sm">{item.name}</div>
                            {item.dosage && (
                              <div className="text-xs text-muted-foreground">
                                {item.dosage} {item.usage}
                              </div>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="ml-2 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => isDirectMode ? handleAddDrugItem({ ...item, source: 'search' }) : handleAddItem(item, 'search')}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 薬剤一覧（常時表示） */}
              <div className="space-y-4">
                <h4 className="text-sm">薬剤一覧</h4>
                <div className={`gap-4 ${isDirectMode ? 'grid grid-cols-2' : 'space-y-4'}`}>
                  {drugCategories.map((category) => (
                    <div key={category.id} className="border rounded-lg">
                      <div className="p-3 bg-muted/30 border-b">
                        <h5 className="text-sm">{category.name}</h5>
                      </div>
                      <div className="p-2 grid gap-2 grid-cols-1">
                        {(category.drugs || (category.subcategories?.flatMap(sub => sub.drugs) || [])).map((item) => (
                          <Button
                            key={item.id}
                            variant="ghost"
                            size="sm"
                            className="h-10 justify-start text-xs hover:bg-primary hover:text-primary-foreground flex flex-col items-start p-2"
                            onClick={() => isDirectMode ? handleAddDrugItem({ ...item, source: 'search' }) : handleAddItem(item, 'search')}
                          >
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.dosage} {item.usage}</div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // 注射オーダーの場合は従来の検索
        return (
          <div className="p-4">
            <h3 className="mb-3">薬剤検索</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="薬剤名を入力（3文字以上）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery.length >= 3 && (
              <div className="space-y-2">
                {/* リアルタイム検索結果をシミュレート */}
                {[
                  { id: 'search-1', name: `${searchQuery}注射液10mg`, dosage: '10mg', usage: '静脈内投与' },
                  { id: 'search-2', name: `${searchQuery}点滴500ml`, dosage: '500ml', usage: '点滴静注' },
                  { id: 'search-3', name: `${searchQuery}バイアル5mg`, dosage: '5mg', usage: '筋肉内注射' }
                ].map((item, index) => (
                  <div key={index} className="p-2 rounded border border-border hover:bg-accent group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm">{item.name}</div>
                        {item.dosage && (
                          <div className="text-xs text-muted-foreground">
                            {item.dosage} {item.usage}
                          </div>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="ml-2 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleAddItem(item, 'search')}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'frequent':
        return (
          <div className="p-4">
            <h3 className="mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              頻用オーダー
            </h3>
            <div className="mb-2 text-xs text-muted-foreground">
              {isDirectMode ? '今月の使用回数順（直接オーダーリストに追加）' : '今月の使用回数順'}
            </div>
            <div className={`${isDirectMode ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
              {mockFrequentOrders[activeTab]?.map((item, index) => (
                <div key={item.id} className="p-2 rounded border border-border hover:bg-accent group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <div className="text-sm">{item.name}</div>
                      </div>
                      {item.dosage && item.usage && (
                        <div className="text-xs text-muted-foreground ml-7">
                          {item.dosage} {item.usage}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground ml-7">
                        使用回数: {item.frequency}回
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-2 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        if (isDirectMode) {
                          if (activeTab === 'lab') {
                            handleAddLabFrequentItem(item);
                          } else if (activeTab === 'prescription') {
                            handleAddDrugFrequentItem(item);
                          }
                        } else {
                          handleAddItem(item, 'frequent');
                        }
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 直接入力モードかどうかを判定（処方・検体オーダーで履歴以外のタブ）
  const isDirectMode = (activeTab === 'lab' || activeTab === 'prescription') && activeSubTab !== 'history';
  const panelWidth = isDirectMode ? 'w-[750px]' : 'w-80';

  return (
    <div className={`${panelWidth} bg-card border-r border-border flex flex-col`}>
      <div className="p-4 border-b border-border">
        <h2>オーダー入力</h2>
        <div className="text-sm text-muted-foreground mt-1">
          {activeTab === 'prescription' ? '処方オーダー' : 
           activeTab === 'injection' ? '注射オーダー' : 
           '検体オーダー'}
        </div>
      </div>
      
      {/* 候補種別タブ（旧第2階層を第1階層に） */}
      <div className="px-4 mt-4">
        <Tabs value={activeSubTab} onValueChange={handleSubTabChange} className="flex-1 flex flex-col">
          <TabsList className={`grid w-full ${activeTab === 'prescription' ? 'grid-cols-5' : 'grid-cols-4'}`}>
            {activeTab === 'lab' ? (
              <>
                <TabsTrigger value="search" className="text-xs">検査項目</TabsTrigger>
                <TabsTrigger value="history" className="text-xs">履歴</TabsTrigger>
                <TabsTrigger value="sets" className="text-xs">セット</TabsTrigger>
                <TabsTrigger value="frequent" className="text-xs">頻用</TabsTrigger>
              </>
            ) : activeTab === 'prescription' ? (
              <>
                <TabsTrigger value="search" className="text-xs">薬剤</TabsTrigger>
                <TabsTrigger value="history" className="text-xs">履歴</TabsTrigger>
                <TabsTrigger value="sets" className="text-xs">セット</TabsTrigger>
                <TabsTrigger value="frequent" className="text-xs">頻用</TabsTrigger>
                <TabsTrigger value="category" className="text-xs">薬効</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="history" className="text-xs">履歴</TabsTrigger>
                <TabsTrigger value="sets" className="text-xs">セット</TabsTrigger>
                <TabsTrigger value="search" className="text-xs">薬剤</TabsTrigger>
                <TabsTrigger value="frequent" className="text-xs">頻用</TabsTrigger>
              </>
            )}
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {renderSubTabContent()}
          </div>
        </Tabs>
      </div>
    </div>
  );
}