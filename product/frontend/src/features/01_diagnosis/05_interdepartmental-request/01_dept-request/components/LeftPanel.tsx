import { useState } from 'react';
import * as React from 'react';
import { Search, Plus, Star, ChevronRight, ChevronDown } from 'lucide-react';
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
  date?: string;
  source?: 'history' | 'set' | 'search' | 'frequent';
}

interface OrderSet {
  id: string;
  name: string;
  items: OrderItem[];
}

const mockHistoryByTab: Record<string, Array<{
  date: string;
  department: string;
  complaint: string;
  orders: OrderItem[];
}>> = {
  prescription: [
    {
      date: '2024-12-15',
      department: '内科',
      complaint: '風邪症状',
      orders: [
        { id: '1', name: 'カロナール錠200mg', dosage: '200mg', usage: '1日3回食後' },
        { id: '2', name: 'ムコダイン錠250mg', dosage: '250mg', usage: '1日3回食後' },
        { id: '3', name: 'フスコデ配合錠', dosage: '1錠', usage: '1日3回食後' }
      ]
    },
    {
      date: '2024-12-10',
      department: '内科',
      complaint: '胃痛',
      orders: [
        { id: '4', name: 'ガスター錠20mg', dosage: '20mg', usage: '1日2回食後' },
        { id: '5', name: 'ムコスタ錠100mg', dosage: '100mg', usage: '1日3回食後' }
      ]
    },
    {
      date: '2024-12-05',
      department: '内科',
      complaint: '高血圧症',
      orders: [
        { id: '6', name: 'アムロジピン錠5mg', dosage: '5mg', usage: '1日1回朝食後' },
        { id: '7', name: 'アンジオテンシン変換酵素阻害薬', dosage: '5mg', usage: '1日1回朝食後' }
      ]
    }
  ],
  injection: [
    {
      date: '2024-12-14',
      department: '内科',
      complaint: '脱水症状',
      orders: [
        { id: 'inj1', name: '生理食塩液500ml', dosage: '500ml', usage: '点滴静注 100ml/h' },
        { id: 'inj2', name: 'ソルデム3A輸液500ml', dosage: '500ml', usage: '点滴静注 80ml/h' }
      ]
    },
    {
      date: '2024-12-12',
      department: '救急科',
      complaint: '急性疼痛',
      orders: [
        { id: 'inj3', name: 'ペンタジン注15mg', dosage: '15mg', usage: '筋肉内注射' },
        { id: 'inj4', name: 'アタラックス-P注25mg', dosage: '25mg', usage: '筋肉内注射' }
      ]
    },
    {
      date: '2024-12-08',
      department: '外科',
      complaint: '術前管理',
      orders: [
        { id: 'inj5', name: 'ラクテック注500ml', dosage: '500ml', usage: '点滴静注 120ml/h' },
        { id: 'inj6', name: 'メイロン注7%20ml', dosage: '20ml', usage: '静脈内注射' }
      ]
    }
  ],
  lab: [
    {
      date: '2024-12-13',
      department: '内科',
      complaint: '定期検査',
      orders: [
        { id: 'lab1', name: 'AST' },
        { id: 'lab2', name: 'ALT' },
        { id: 'lab3', name: 'γ-GTP' },
        { id: 'lab4', name: '総蛋白' },
        { id: 'lab5', name: 'アルブミン' }
      ]
    },
    {
      date: '2024-12-11',
      department: '内科',
      complaint: '貧血検査',
      orders: [
        { id: 'lab6', name: '白血球数' },
        { id: 'lab7', name: '赤血球数' },
        { id: 'lab8', name: 'ヘモグロビン' },
        { id: 'lab9', name: 'ヘマトクリット' },
        { id: 'lab10', name: '血小板数' }
      ]
    },
    {
      date: '2024-12-06',
      department: '内科',
      complaint: '感染症検査',
      orders: [
        { id: 'lab11', name: 'CRP' },
        { id: 'lab12', name: '白血球数' },
        { id: 'lab13', name: '血液培養' },
        { id: 'lab14', name: '尿培養' }
      ]
    }
  ]
};

const mockOrderSets: Record<string, OrderSet[]> = {
  prescription: [
    {
      id: 'cold-set',
      name: '感冒セット',
      items: [
        { id: 'c1', name: 'カロナール錠200mg', dosage: '200mg', usage: '1日3回食後' },
        { id: 'c2', name: 'ムコダイン錠250mg', dosage: '250mg', usage: '1日3回食後' },
        { id: 'c3', name: 'フスコデ配合錠', dosage: '1錠', usage: '1日3回食後' }
      ]
    },
    {
      id: 'gastric-set',
      name: '胃潰瘍セット',
      items: [
        { id: 'g1', name: 'ガスター錠20mg', dosage: '20mg', usage: '1日2回食後' },
        { id: 'g2', name: 'ムコスタ錠100mg', dosage: '100mg', usage: '1日3回食後' }
      ]
    },
    {
      id: 'hypertension-set',
      name: '高血圧治療セット',
      items: [
        { id: 'h1', name: 'アムロジピン錠5mg', dosage: '5mg', usage: '1日1回朝食後' },
        { id: 'h2', name: 'エナラプリル錠5mg', dosage: '5mg', usage: '1日2回食後' }
      ]
    }
  ],
  injection: [
    {
      id: 'fluid-set',
      name: '基本輸液セット',
      items: [
        { id: 'i1', name: '生理食塩液500ml', dosage: '500ml', usage: '点滴静注 100ml/h' },
        { id: 'i2', name: 'ソルデム3A輸液500ml', dosage: '500ml', usage: '点滴静注 80ml/h' }
      ]
    },
    {
      id: 'pain-set',
      name: '疼痛管理セット',
      items: [
        { id: 'p1', name: 'ペンタジン注15mg', dosage: '15mg', usage: '筋肉内注射' },
        { id: 'p2', name: 'アタラックス-P注25mg', dosage: '25mg', usage: '筋肉内注射' }
      ]
    },
    {
      id: 'emergency-set',
      name: '救急輸液セット',
      items: [
        { id: 'e1', name: 'ラクテック注500ml', dosage: '500ml', usage: '点滴静注 150ml/h' },
        { id: 'e2', name: 'メイロン注7%20ml', dosage: '20ml', usage: '静脈内注射' }
      ]
    }
  ],
  lab: [
    {
      id: 'liver-set',
      name: '肝機能パネル',
      items: [
        { id: 'l1', name: 'AST' },
        { id: 'l2', name: 'ALT' },
        { id: 'l3', name: 'γ-GTP' },
        { id: 'l4', name: '総ビリルビン' },
        { id: 'l5', name: 'ALP' }
      ]
    },
    {
      id: 'cbc-set',
      name: '血算パネル',
      items: [
        { id: 'c1', name: '白血球数' },
        { id: 'c2', name: '赤血球数' },
        { id: 'c3', name: 'ヘモグロビン' },
        { id: 'c4', name: 'ヘマトクリット' },
        { id: 'c5', name: '血小板数' }
      ]
    },
    {
      id: 'infection-set',
      name: '感染症パネル',
      items: [
        { id: 'inf1', name: 'CRP' },
        { id: 'inf2', name: '白血球数' },
        { id: 'inf3', name: 'プロカルシトニン' },
        { id: 'inf4', name: '血液培養' }
      ]
    },
    {
      id: 'diabetes-set',
      name: '糖尿病パネル',
      items: [
        { id: 'd1', name: '血糖' },
        { id: 'd2', name: 'HbA1c' },
        { id: 'd3', name: 'グリコアルブミン' },
        { id: 'd4', name: '尿糖' }
      ]
    }
  ]
};

// 頻用オーダーのモックデータ（使用頻度付き）
interface FrequentOrderItem extends OrderItem {
  frequency: number; // 使用頻度（今月の使用回数）
}

// 検査項目カテゴリの定義
interface LabCategory {
  id: string;
  name: string;
  items: OrderItem[];
}

// 薬効カテゴリの定義（階層構造）
interface DrugSubcategory {
  id: string;
  name: string;
  description?: string;
  drugs: (OrderItem & { formulation?: string; route?: string; indication?: string })[];
}

interface DrugCategory {
  id: string;
  name: string;
  description?: string;
  subcategories?: DrugSubcategory[];
  drugs?: (OrderItem & { formulation?: string; route?: string; indication?: string })[];
  isExpanded?: boolean;
}

// 検査項目のモックデータ
const mockLabCategories: LabCategory[] = [
  {
    id: 'biochemistry',
    name: '生化学検査',
    items: [
      { id: 'lab_ast', name: 'AST' },
      { id: 'lab_alt', name: 'ALT' },
      { id: 'lab_ggt', name: 'γ-GTP' },
      { id: 'lab_ldh', name: 'LDH' },
      { id: 'lab_alp', name: 'ALP' },
      { id: 'lab_tp', name: '総蛋白' },
      { id: 'lab_alb', name: 'アルブミン' },
      { id: 'lab_tbil', name: '総ビリルビン' },
    ]
  },
  {
    id: 'hematology',
    name: '血液検査',
    items: [
      { id: 'lab_wbc', name: '白血球数' },
      { id: 'lab_rbc', name: '赤血球数' },
      { id: 'lab_hgb', name: 'ヘモグロビン' },
      { id: 'lab_hct', name: 'ヘマトクリット' },
      { id: 'lab_plt', name: '血小板数' },
    ]
  },
  {
    id: 'immunology',
    name: '免疫検査',
    items: [
      { id: 'lab_crp', name: 'CRP' },
      { id: 'lab_rf', name: 'リウマチ因子' },
      { id: 'lab_ana', name: '抗核抗体' },
    ]
  },
  {
    id: 'endocrine',
    name: '内分泌検査',
    items: [
      { id: 'lab_tsh', name: 'TSH' },
      { id: 'lab_ft3', name: 'FT3' },
      { id: 'lab_ft4', name: 'FT4' },
      { id: 'lab_cortisol', name: 'コルチゾール' },
    ]
  },
  {
    id: 'urine',
    name: '尿検査',
    items: [
      { id: 'lab_protein', name: '尿蛋白' },
      { id: 'lab_glucose', name: '尿糖' },
      { id: 'lab_occult', name: '潜血' },
      { id: 'lab_sediment', name: '尿沈渣' },
    ]
  }
];

// 薬効カテゴリのモックデータ（階層構造）
const mockDrugCategories: DrugCategory[] = [
  {
    id: 'antihypertensive',
    name: '降圧薬',
    description: '高血圧症の治療',
    isExpanded: false,
    subcategories: [
      {
        id: 'ace_inhibitors',
        name: 'ACE阻害薬',
        description: 'アンジオテンシン変換酵素阻害薬',
        drugs: [
          { id: 'drug_enalapril', name: 'エナラプリル錠5mg', dosage: '5mg', usage: '1日2回食後', formulation: '錠剤', route: '経口', indication: '高血圧・心不全' },
          { id: 'drug_captopril', name: 'カプトプリル錠25mg', dosage: '25mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '高血圧・心不全' }
        ]
      },
      {
        id: 'calcium_channel_blockers',
        name: 'カルシウム拮抗薬',
        description: 'カルシウムチャネル阻害薬',
        drugs: [
          { id: 'drug_amlodipine', name: 'アムロジピン錠5mg', dosage: '5mg', usage: '1日1回朝食後', formulation: '錠剤', route: '経口', indication: '高血圧・狭心症' },
          { id: 'drug_nifedipine', name: 'ニフェジピン錠10mg', dosage: '10mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '高血圧・狭心症' }
        ]
      },
      {
        id: 'arb',
        name: 'ARB',
        description: 'アンジオテンシンII受容体拮抗薬',
        drugs: [
          { id: 'drug_losartan', name: 'ロサルタン錠50mg', dosage: '50mg', usage: '1日1回朝食後', formulation: '錠剤', route: '経口', indication: '高血圧' },
          { id: 'drug_valsartan', name: 'バルサルタン錠80mg', dosage: '80mg', usage: '1日1回朝食後', formulation: '錠剤', route: '経口', indication: '高血圧' }
        ]
      }
    ]
  },
  {
    id: 'antibiotics',
    name: '抗菌薬',
    description: '細菌感染症の治療',
    isExpanded: false,
    subcategories: [
      {
        id: 'penicillins',
        name: 'ペニシリン系',
        description: 'ペニシリン系抗菌薬',
        drugs: [
          { id: 'drug_amoxicillin', name: 'サワシリン錠250mg', dosage: '250mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '細菌感染症' },
          { id: 'drug_ampicillin', name: 'アンピシリン錠250mg', dosage: '250mg', usage: '1日4回食間', formulation: '錠剤', route: '経口', indication: '細菌感染症' }
        ]
      },
      {
        id: 'cephalosporins',
        name: 'セフェム系',
        description: 'セフェム系抗菌薬',
        drugs: [
          { id: 'drug_cefdinir', name: 'セフゾン錠100mg', dosage: '100mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '細菌感染症' },
          { id: 'drug_cefcapene', name: 'フロモックス錠100mg', dosage: '100mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '細菌感染症' }
        ]
      },
      {
        id: 'quinolones',
        name: 'キノロン系',
        description: 'キノロン系抗菌薬',
        drugs: [
          { id: 'drug_levofloxacin', name: 'クラビット錠500mg', dosage: '500mg', usage: '1日1回食後', formulation: '錠剤', route: '経口', indication: '細菌感染症' },
          { id: 'drug_ciprofloxacin', name: 'シプロキサン錠200mg', dosage: '200mg', usage: '1日2回食後', formulation: '錠剤', route: '経口', indication: '細菌感染症' }
        ]
      }
    ]
  },
  {
    id: 'analgesics',
    name: '鎮痛薬',
    description: '疼痛・発熱の治療',
    isExpanded: false,
    subcategories: [
      {
        id: 'nsaids',
        name: 'NSAIDs',
        description: '非ステロイド性抗炎症薬',
        drugs: [
          { id: 'drug_loxoprofen', name: 'ロキソニン錠60mg', dosage: '60mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '疼痛・発熱・炎症' },
          { id: 'drug_diclofenac', name: 'ボルタレン錠25mg', dosage: '25mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '炎症・疼痛' }
        ]
      },
      {
        id: 'acetaminophen',
        name: 'アセトアミノフェン系',
        description: 'アセトアミノフェン製剤',
        drugs: [
          { id: 'drug_acetaminophen', name: 'カロナール錠200mg', dosage: '200mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '発熱・疼痛' },
          { id: 'drug_acetaminophen_500', name: 'カロナール錠500mg', dosage: '500mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '発熱・疼痛' }
        ]
      }
    ]
  },
  {
    id: 'gastric',
    name: '消化器用薬',
    description: '胃腸症状の改善',
    isExpanded: false,
    drugs: [
      { id: 'drug_famotidine', name: 'ガスター錠20mg', dosage: '20mg', usage: '1日2回食後', formulation: '錠剤', route: '経口', indication: '胃潰瘍・胃炎' },
      { id: 'drug_rebamipide', name: 'ムコスタ錠100mg', dosage: '100mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '胃炎・胃潰瘍' },
      { id: 'drug_lansoprazole', name: 'タケプロン錠30mg', dosage: '30mg', usage: '1日1回朝食前', formulation: '錠剤', route: '経口', indication: '胃潰瘍・逆流性食道炎' }
    ]
  },
  {
    id: 'diabetes',
    name: '糖尿病用薬',
    description: '血糖コントロール',
    isExpanded: false,
    drugs: [
      { id: 'drug_metformin', name: 'メトグルコ錠250mg', dosage: '250mg', usage: '1日2回食後', formulation: '錠剤', route: '経口', indication: '2型糖尿病' },
      { id: 'drug_glimepiride', name: 'アマリール錠1mg', dosage: '1mg', usage: '1日1回朝食前', formulation: '錠剤', route: '経口', indication: '2型糖尿病' }
    ]
  }
];

const mockFrequentOrders: Record<string, FrequentOrderItem[]> = {
  prescription: [
    { id: 'f1', name: 'カロナール錠200mg', dosage: '200mg', usage: '1日3回食後', frequency: 45 },
    { id: 'f2', name: 'ロキソニン錠60mg', dosage: '60mg', usage: '1日3回食後', frequency: 38 },
    { id: 'f3', name: 'ガスター錠20mg', dosage: '20mg', usage: '1日2回食後', frequency: 32 },
    { id: 'f4', name: 'アムロジピン錠5mg', dosage: '5mg', usage: '1日1回朝食後', frequency: 28 },
    { id: 'f5', name: 'フロモックス錠100mg', dosage: '100mg', usage: '1日3回食後', frequency: 24 },
    { id: 'f6', name: 'ムコダイン錠250mg', dosage: '250mg', usage: '1日3回食後', frequency: 20 }
  ],
  injection: [
    { id: 'fi1', name: '生理食塩液500ml', dosage: '500ml', usage: '点滴静注 100ml/h', frequency: 52 },
    { id: 'fi2', name: 'ソルデム3A輸液500ml', dosage: '500ml', usage: '点滴静注 80ml/h', frequency: 38 },
    { id: 'fi3', name: 'ラクテック注500ml', dosage: '500ml', usage: '点滴静注 120ml/h', frequency: 28 },
    { id: 'fi4', name: 'ペンタジン注15mg', dosage: '15mg', usage: '筋肉内注射', frequency: 22 },
    { id: 'fi5', name: 'メイロン注7%20ml', dosage: '20ml', usage: '静脈内注射', frequency: 16 },
    { id: 'fi6', name: 'アタラックス-P注25mg', dosage: '25mg', usage: '筋肉内注射', frequency: 12 }
  ],
  lab: [
    { id: 'fl1', name: 'CRP', frequency: 68 },
    { id: 'fl2', name: '白血球数', frequency: 65 },
    { id: 'fl3', name: 'AST', frequency: 58 },
    { id: 'fl4', name: 'ALT', frequency: 58 },
    { id: 'fl5', name: 'ヘモグロビン', frequency: 52 },
    { id: 'fl6', name: '血小板数', frequency: 48 },
    { id: 'fl7', name: '血糖', frequency: 42 },
    { id: 'fl8', name: 'γ-GTP', frequency: 35 }
  ]
};

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