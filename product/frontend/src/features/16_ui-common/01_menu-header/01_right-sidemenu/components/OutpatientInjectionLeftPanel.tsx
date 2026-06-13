// [SCOPE-OUT: ETC005] 関連機能追加時にコメントアウトを解除する
import { useState } from 'react';
import { Search, Plus, History, Bookmark, TrendingUp, Stethoscope } from 'lucide-react';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Badge } from '@/shared/components/atoms/badge';

interface OrderItem {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  source?: 'history' | 'set' | 'search' | 'frequent' | 'category';
}

interface OrderSet {
  id: string;
  name: string;
  items: OrderItem[];
}

interface FrequentOrderItem extends OrderItem {
  frequency: number;
}

interface OutpatientInjectionLeftPanelProps {
  onAddCandidate: (item: OrderItem & { source?: string }) => void;
  onAddMultipleCandidates: (items: (OrderItem & { source?: string })[]) => void;
  onAddToDetail: (item: OrderItem) => void;
  onAddMultipleToDetail: (items: OrderItem[]) => void;
  activeSubTab: string;
  onSubTabChange: (subTab: string) => void;
}

// 外来注射薬のモックデータ
const mockOutpatientInjectionDrugs: OrderItem[] = [
  { id: 'oinj1', name: 'ビタミンB1注射液10mg', dosage: '10mg', usage: '筋肉内注射' },
  { id: 'oinj2', name: 'ビタミンB12注射液500μg', dosage: '500μg', usage: '筋肉内注射' },
  { id: 'oinj3', name: 'デキサメタゾン注射液4mg', dosage: '4mg', usage: '筋肉内注射' },
  { id: 'oinj4', name: 'ジクロフェナク注射液25mg', dosage: '25mg', usage: '筋肉内注射' },
  { id: 'oinj5', name: 'アドレナリン注射液0.1%', dosage: '1ml', usage: '皮下注射' },
  { id: 'oinj6', name: 'インスリン（速効型）', dosage: '10単位', usage: '皮下注射' },
  { id: 'oinj7', name: 'ヒアルロン酸ナトリウム注射液', dosage: '25mg', usage: '関節内注射' },
  { id: 'oinj8', name: 'プラセンタ注射液2ml', dosage: '2ml', usage: '皮下注射' },
  { id: 'oinj9', name: 'トリガーポイント注射用キシロカイン', dosage: '5ml', usage: '局所注射' },
  { id: 'oinj10', name: 'アレルギー反応用エピペン', dosage: '0.3mg', usage: '筋肉内注射' }
];

// 外来注射履歴のモックデータ
const mockOutpatientInjectionHistory = [
  {
    date: '2024-12-10',
    department: '整形外科',
    complaint: '関節痛',
    orders: [
      { id: 'h1', name: 'ヒアルロン酸ナトリウム注射液', dosage: '25mg', usage: '関節内注射' },
      { id: 'h2', name: 'デキサメタゾン注射液4mg', dosage: '4mg', usage: '筋肉内注射' }
    ]
  },
  {
    date: '2024-12-05',
    department: '内科',
    complaint: 'ビタミン欠乏症',
    orders: [
      { id: 'h3', name: 'ビタミンB1注射液10mg', dosage: '10mg', usage: '筋肉内注射' },
      { id: 'h4', name: 'ビタミンB12注射液500μg', dosage: '500μg', usage: '筋肉内注射' }
    ]
  },
  {
    date: '2024-11-28',
    department: '内分泌科',
    complaint: '糖尿病管理',
    orders: [
      { id: 'h5', name: 'インスリン（速効型）', dosage: '8単位', usage: '皮下注射' }
    ]
  }
];

// 外来注射セットのモックデータ
const mockOutpatientInjectionSets: OrderSet[] = [
  {
    id: 'vitamin-set',
    name: 'ビタミン補給セット',
    items: [
      { id: 's1', name: 'ビタミンB1注射液10mg', dosage: '10mg', usage: '筋肉内注射' },
      { id: 's2', name: 'ビタミンB12注射液500μg', dosage: '500μg', usage: '筋肉内注射' }
    ]
  },
  {
    id: 'joint-set',
    name: '関節痛治療セット',
    items: [
      { id: 's3', name: 'ヒアルロン酸ナトリウム注射液', dosage: '25mg', usage: '関節内注射' },
      { id: 's4', name: 'デキサメタゾン注射液4mg', dosage: '4mg', usage: '筋肉内注射' }
    ]
  },
  {
    id: 'emergency-set',
    name: 'アレルギー対応セット',
    items: [
      { id: 's5', name: 'アドレナリン注射液0.1%', dosage: '1ml', usage: '皮下注射' },
      { id: 's6', name: 'デキサメタゾン注射液4mg', dosage: '4mg', usage: '筋肉内注射' }
    ]
  }
];

// 頻用外来注射薬のモックデータ
const mockFrequentOutpatientInjections: FrequentOrderItem[] = [
  { id: 'f1', name: 'ビタミンB12注射液500μg', dosage: '500μg', usage: '筋肉内注射', frequency: 45 },
  { id: 'f2', name: 'ヒアルロン酸ナトリウム注射液', dosage: '25mg', usage: '関節内注射', frequency: 32 },
  { id: 'f3', name: 'ビタミンB1注射液10mg', dosage: '10mg', usage: '筋肉内注射', frequency: 28 },
  { id: 'f4', name: 'デキサメタゾン注射液4mg', dosage: '4mg', usage: '筋肉内注射', frequency: 25 },
  { id: 'f5', name: 'インスリン（速効型）', dosage: '10単位', usage: '皮下注射', frequency: 22 },
  { id: 'f6', name: 'プラセンタ注射液2ml', dosage: '2ml', usage: '皮下注射', frequency: 18 }
];

// 外来注射薬効カテゴリのモックデータ
const mockOutpatientInjectionCategories = [
  {
    id: 'vitamins',
    name: 'ビタミン製剤',
    description: 'ビタミン補給・欠乏症治療',
    drugs: [
      { id: 'v1', name: 'ビタミンB1注射液10mg', dosage: '10mg', usage: '筋肉内注射' },
      { id: 'v2', name: 'ビタミンB12注射液500μg', dosage: '500μg', usage: '筋肉内注射' },
      { id: 'v3', name: 'ビタミンC注射液200mg', dosage: '200mg', usage: '静脈内注射' }
    ]
  },
  {
    id: 'steroids',
    name: 'ステロイド製剤',
    description: '抗炎症・免疫抑制',
    drugs: [
      { id: 'st1', name: 'デキサメタゾン注射液4mg', dosage: '4mg', usage: '筋肉内注射' },
      { id: 'st2', name: 'プレドニゾロン注射液20mg', dosage: '20mg', usage: '筋肉内注射' }
    ]
  },
  {
    id: 'joint',
    name: '関節治療薬',
    description: '関節痛・変形性関節症',
    drugs: [
      { id: 'j1', name: 'ヒアルロン酸ナトリウム注射液', dosage: '25mg', usage: '関節内注射' },
      { id: 'j2', name: 'トリアムシノロン注射液40mg', dosage: '40mg', usage: '関節内注射' }
    ]
  },
  {
    id: 'hormones',
    name: 'ホルモン製剤',
    description: '内分泌疾患治療',
    drugs: [
      { id: 'h1', name: 'インスリン（速効型）', dosage: '10単位', usage: '皮下注射' },
      { id: 'h2', name: '成長ホルモン注射液', dosage: '4mg', usage: '皮下注射' }
    ]
  }
];

export function OutpatientInjectionLeftPanel({
  onAddCandidate,
  onAddMultipleCandidates,
  onAddToDetail,
  onAddMultipleToDetail,
  activeSubTab,
  onSubTabChange
}: OutpatientInjectionLeftPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const filteredDrugs = mockOutpatientInjectionDrugs.filter(drug =>
    drug.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = (item: OrderItem, source: string) => {
    if (activeSubTab === 'history') {
      onAddCandidate({ ...item, source });
    } else {
      onAddToDetail({ ...item, source });
    }
  };

  const handleAddMultipleItems = (items: OrderItem[], source: string) => {
    const itemsWithSource = items.map(item => ({ ...item, source }));
    if (activeSubTab === 'history') {
      onAddMultipleCandidates(itemsWithSource);
    } else {
      onAddMultipleToDetail(itemsWithSource);
    }
  };

  return (
    <div className="w-75 bg-card border-r border-border flex flex-col h-screen">
      <div className="border-b border-border p-3">
        <div className="text-sm text-muted-foreground font-medium">オーダー入力</div>
        <h2 className="font-normal">外来注射オーダー</h2>
      </div>

      <Tabs value={activeSubTab} onValueChange={onSubTabChange} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-5 mx-3 mt-2">
          <TabsTrigger value="search" className="flex items-center gap-1">
            <Search className="w-3 h-3" />
            薬剤
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="w-3 h-3" />
            履歴
          </TabsTrigger>
          <TabsTrigger value="sets" className="flex items-center gap-1">
            <Bookmark className="w-3 h-3" />
            セット
          </TabsTrigger>
          <TabsTrigger value="frequent" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            頻用
          </TabsTrigger>
          <TabsTrigger value="category" className="flex items-center gap-1">
            <Stethoscope className="w-3 h-3" />
            薬効
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="search" className="h-full m-0">
            <div className="p-3">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="外来注射薬を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <ScrollArea className="h-full">
                <div className="space-y-1">
                  {filteredDrugs.map((drug) => (
                    <div
                      key={drug.id}
                      className="p-2 rounded border border-border hover:bg-accent cursor-pointer group"
                      onClick={() => handleAddItem(drug, 'search')}
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
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {mockOutpatientInjectionHistory.map((history, index) => (
                    <div
                      key={index}
                      className="p-2 rounded border border-border hover:bg-accent cursor-pointer group"
                      onClick={() => handleAddMultipleItems(history.orders, 'history')}
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
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {mockOutpatientInjectionSets.map((set) => (
                    <div
                      key={set.id}
                      className="p-2 rounded border border-border hover:bg-accent cursor-pointer group"
                      onClick={() => handleAddMultipleItems(set.items, 'set')}
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
              <ScrollArea className="h-full">
                <div className="space-y-1">
                  {mockFrequentOutpatientInjections.map((drug) => (
                    <div
                      key={drug.id}
                      className="p-2 rounded border border-border hover:bg-accent cursor-pointer group"
                      onClick={() => handleAddItem(drug, 'frequent')}
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
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {mockOutpatientInjectionCategories.map((category) => (
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
                            onClick={() => handleAddItem(drug, 'category')}
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
    </div>
  );
}