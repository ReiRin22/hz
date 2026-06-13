import { useState, useEffect } from 'react';
import * as React from 'react';
import { Search, Plus, Star, ChevronRight, ChevronDown, Info, ExternalLink } from 'lucide-react';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Badge } from '@/shared/components/atoms/badge';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Label } from '@/shared/components/atoms/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/atoms/radio-group';
import { mockFrequentDrugs } from '../src/data/mockDrugs';
import { calculateFrequentDrugs } from '../src/utils/prescriptionStorage';

interface OrderItem {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  date?: string;
  source?: 'history' | 'set' | 'search' | 'frequent';
  isRefillProhibited?: boolean;
  refillProhibitionReason?: string;
}

interface OrderSet {
  id: string;
  name: string;
  items: OrderItem[];
}

const mockHistoryByTab: Record<string, Array<{
  date: string;
  department: string;
  registeredBy: string;
  orders: OrderItem[];
}>> = {
  prescription: [
    {
      date: '2024-12-15',
      department: '内科',
      registeredBy: '田中太郎',
      orders: [
        { id: '1', name: 'カロナール錠200mg', dosage: '1錠', usage: '1日3回 朝昼夕食後', type: 'prescription' as const, route: '内服', period: '7日分' },
        { id: '2', name: 'ムコダイン錠250mg', dosage: '1錠', usage: '1日3回 朝昼夕食後', type: 'prescription' as const, route: '内服', period: '7日分' },
        { id: '3', name: 'フスコデ配合錠', dosage: '1錠', usage: '1日3回 朝昼夕食後', type: 'prescription' as const, route: '内服', period: '7日分' }
      ]
    },
    {
      date: '2024-12-10',
      department: '内科',
      registeredBy: '鈴木花子',
      orders: [
        { id: '4', name: 'ガスター錠20mg', dosage: '1錠', usage: '1日2回 朝夕食後', type: 'prescription' as const, route: '内服', period: '14日分' },
        { id: '5', name: 'ムコスタ錠100mg', dosage: '1錠', usage: '1日3回 朝昼夕食後', type: 'prescription' as const, route: '内服', period: '14日分' }
      ]
    },
    {
      date: '2024-12-05',
      department: '内科',
      registeredBy: '田中太郎',
      orders: [
        { id: '6', name: 'アムロジピン錠5mg', dosage: '1錠', usage: '1日1回 朝食後', type: 'prescription' as const, route: '内服', period: '30日分' },
        { id: '7', name: 'アンジオテンシン変換酵素阻害薬', dosage: '1錠', usage: '1日1回 朝食後', type: 'prescription' as const, route: '内服', period: '30日分' }
      ]
    }
  ],
  injection: [
    {
      date: '2024-12-14',
      department: '内科',
      registeredBy: '佐藤一郎',
      orders: [
        { id: 'inj1', name: '生理食塩液500ml', dosage: '1袋', usage: '点滴静注 100ml/h', type: 'injection' as const, route: '注射', period: '1回' },
        { id: 'inj2', name: 'ソルデム3A輸液500ml', dosage: '1袋', usage: '点滴静注 80ml/h', type: 'injection' as const, route: '注射', period: '1回' }
      ]
    },
    {
      date: '2024-12-12',
      department: '救急科',
      registeredBy: '高橋健',
      orders: [
        { id: 'inj3', name: 'ペンタジン注15mg', dosage: '1管', usage: '筋肉内注射', type: 'injection' as const, route: '注射', period: '1回' },
        { id: 'inj4', name: 'アタラックス-P注25mg', dosage: '1管', usage: '筋肉内注射', type: 'injection' as const, route: '注射', period: '1回' }
      ]
    },
    {
      date: '2024-12-08',
      department: '外科',
      registeredBy: '伊藤美咲',
      orders: [
        { id: 'inj5', name: 'ラクテック注500ml', dosage: '1袋', usage: '点滴静注 120ml/h', type: 'injection' as const, route: '注射', period: '1回' },
        { id: 'inj6', name: 'メイロン注7%20ml', dosage: '1管', usage: '静脈内注射', type: 'injection' as const, route: '注射', period: '1回' }
      ]
    }
  ],
  lab: [
    {
      date: '2024-12-13',
      department: '内科',
      registeredBy: '田中太郎',
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
      registeredBy: '鈴木花子',
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
      registeredBy: '佐藤一郎',
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

// 薬効カテゴリの定義（再帰的階層構造：最大4階層）
type DrugItem = OrderItem & { 
  formulation?: string; 
  route?: string; 
  indication?: string; 
  isAdopted?: boolean; 
  drugType?: 'oral' | 'topical' | 'injection'; 
  units?: string[]; 
  classification?: 'narcotic' | 'poison' | 'powerful' | 'psychotropic' 
};

interface DrugCategory {
  id: string;
  name: string;
  description?: string;
  subcategories?: DrugCategory[]; // 再帰的に子カテゴリを持てる
  drugs?: DrugItem[]; // 薬剤は任意の階層に配置可能
  isExpanded?: boolean;
  level?: number; // 階層レベル（1-4）
}

// 後方互換性のため
type DrugSubcategory = DrugCategory;

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
    id: 'nervous_sensory',
    name: '神経系及び感覚器官用医薬品',
    level: 1,
    isExpanded: false,
    subcategories: [
      {
        id: 'central_nervous',
        name: '中枢神経系用薬',
        level: 2,
        isExpanded: false,
        subcategories: [
          {
            id: 'general_anesthetics',
            name: '全身麻酔剤',
            level: 3,
            isExpanded: false,
            subcategories: [
              {
                id: 'halogenated_hydrocarbons',
                name: 'ハロゲン炭化水素製剤',
                level: 4,
                drugs: [
                  { id: 'drug_sevoflurane', name: 'セボフルラン吸入麻酔液', dosage: '吸入', usage: '全身麻酔時', formulation: '吸入液', route: '吸入', indication: '全身麻酔', isAdopted: true, drugType: 'oral', units: ['mL'] },
                  { id: 'drug_isoflurane', name: 'イソフルラン吸入麻酔液', dosage: '吸入', usage: '全身麻酔時', formulation: '吸入液', route: '吸入', indication: '全身麻酔', isAdopted: true, drugType: 'oral', units: ['mL'] },
                ]
              },
              {
                id: 'intravenous_anesthetics',
                name: '静脈麻酔剤',
                level: 4,
                drugs: [
                  { id: 'drug_propofol', name: 'プロポフォール注射液10mg/mL', dosage: '10mg/mL', usage: '静注', formulation: '注射液', route: '静脈注射', indication: '全身麻酔・鎮静', isAdopted: true, drugType: 'injection', units: ['mL', 'A'], classification: 'powerful' },
                ]
              }
            ]
          },
          {
            id: 'hypnotics_sedatives',
            name: '催眠鎮静剤・抗不安剤',
            level: 3,
            isExpanded: false,
            subcategories: [
              {
                id: 'benzodiazepines',
                name: 'ベンゾジアゼピン系',
                level: 4,
                drugs: [
                  { id: 'drug_diazepam', name: 'セルシン錠2mg', dosage: '2mg', usage: '1日1-3回', formulation: '錠剤', route: '経口', indication: '不安・緊張・抑うつ', isAdopted: true, drugType: 'oral', units: ['錠'], classification: 'psychotropic' },
                  { id: 'drug_lorazepam', name: 'ワイパックス錠0.5mg', dosage: '0.5mg', usage: '1日2-3回', formulation: '錠剤', route: '経口', indication: '不安・緊張・抑うつ', isAdopted: true, drugType: 'oral', units: ['錠'], classification: 'psychotropic' },
                ]
              },
              {
                id: 'nonbenzodiazepines',
                name: '非ベンゾジアゼピン系',
                level: 4,
                drugs: [
                  { id: 'drug_zolpidem', name: 'マイスリー錠5mg', dosage: '5mg', usage: '就寝直前', formulation: '錠剤', route: '経口', indication: '不眠症', isAdopted: true, drugType: 'oral', units: ['錠'], classification: 'psychotropic' },
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sensory_organs',
        name: '感覚器官用薬',
        level: 2,
        isExpanded: false,
        subcategories: [
          {
            id: 'ophthalmic',
            name: '眼科用薬',
            level: 3,
            drugs: [
              { id: 'drug_cravit_eye', name: 'クラビット点眼液0.5%', dosage: '0.5%', usage: '1日3回', formulation: '点眼液', route: '点眼', indication: '眼感染症', isAdopted: true, drugType: 'topical', units: ['mL', '本'] },
              { id: 'drug_hyalein_eye', name: 'ヒアレイン点眼液0.1%', dosage: '0.1%', usage: '1日5~6回', formulation: '点眼液', route: '点眼', indication: 'ドライアイ', isAdopted: true, drugType: 'topical', units: ['mL', '本'] },
              { id: 'drug_flumetholon_eye', name: 'フルメトロン点眼液0.1%', dosage: '0.1%', usage: '1日2~4回', formulation: '点眼液', route: '点眼', indication: '眼炎症性疾患', isAdopted: true, drugType: 'topical', units: ['mL', '本'] }
            ]
          },
          {
            id: 'otic',
            name: '耳鼻科用薬',
            level: 3,
            drugs: [
              { id: 'drug_tarivid_ear', name: 'タリビッド耳科用液0.3%', dosage: '0.3%', usage: '1日2回', formulation: '点耳液', route: '点耳', indication: '外耳炎・中耳炎', isAdopted: true, drugType: 'topical', units: ['mL', '本'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'organ_specific',
    name: '個々の器官系用医薬品',
    level: 1,
    isExpanded: false,
    subcategories: [
      {
        id: 'cardiovascular',
        name: '循環器官用薬',
        level: 2,
        isExpanded: false,
        subcategories: [
          {
            id: 'antihypertensive',
            name: '降圧薬',
            level: 3,
            subcategories: [
              {
                id: 'calcium_channel_blockers',
                name: 'カルシウム拮抗薬',
                level: 4,
                drugs: [
                  { id: 'drug_amlodipine', name: 'アムロジピン錠5mg', dosage: '5mg', usage: '1日1回朝食後', formulation: '錠剤', route: '経口', indication: '高血圧・狭心症', isAdopted: true, drugType: 'oral' },
                  { id: 'drug_nifedipine', name: 'ニフェジピン錠10mg', dosage: '10mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '高血圧・狭心症', isAdopted: true, drugType: 'oral' }
                ]
              },
              {
                id: 'arb',
                name: 'ARB',
                level: 4,
                drugs: [
                  { id: 'drug_losartan', name: 'ロサルタン錠50mg', dosage: '50mg', usage: '1日1回朝食後', formulation: '錠剤', route: '経口', indication: '高血圧', isAdopted: true, drugType: 'oral' },
                ]
              }
            ]
          },
          {
            id: 'cardiotonic',
            name: '強心薬・抗不整脈薬',
            level: 3,
            drugs: [
              { id: 'drug_digoxin', name: 'ジゴキシン錠0.25mg', dosage: '0.25mg', usage: '1日1回朝食後', formulation: '錠剤', route: '経口', indication: '心不全・心房細動', isAdopted: true, drugType: 'oral', units: ['錠'], classification: 'poison' },
            ]
          }
        ]
      },
      {
        id: 'respiratory',
        name: '呼吸器官用薬',
        level: 2,
        drugs: [
          { id: 'drug_theophylline', name: 'テオドール錠100mg', dosage: '100mg', usage: '1日2回食後', formulation: '錠剤', route: '経口', indication: '気管支喘息', isAdopted: true, drugType: 'oral', units: ['錠'], classification: 'powerful' },
        ]
      },
      {
        id: 'digestive',
        name: '消化器官用薬',
        level: 2,
        drugs: [
          { id: 'drug_famotidine', name: 'ガスター錠20mg', dosage: '20mg', usage: '1日2回食後', formulation: '錠剤', route: '経口', indication: '胃潰瘍・胃炎', isAdopted: true, drugType: 'oral', units: ['錠'] },
          { id: 'drug_rebamipide', name: 'ムコスタ錠100mg', dosage: '100mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '胃炎・胃潰瘍', isAdopted: true, drugType: 'oral', units: ['錠'] },
        ]
      },
      {
        id: 'dermatologic',
        name: '外皮用薬',
        level: 2,
        isExpanded: false,
        subcategories: [
          {
            id: 'topical_steroids',
            name: 'ステロイド外用薬',
            level: 3,
            drugs: [
              { id: 'drug_strongestclass', name: 'デルモベート軟膏0.05%', dosage: '0.05%', usage: '1日1~2回', formulation: '軟膏', route: '塗布', indication: '皮膚炎症性疾患', isAdopted: true, drugType: 'topical', units: ['g', '本'] },
              { id: 'drug_rinderon', name: 'リンデロンVG軟膏0.12%', dosage: '0.12%', usage: '1日1~数回', formulation: '軟膏', route: '塗布', indication: '湿疹・皮膚炎', isAdopted: true, drugType: 'topical', units: ['g', '本'] },
              { id: 'drug_alocom', name: 'アロコム軟膏0.1%', dosage: '0.1%', usage: '1日数回', formulation: '軟膏', route: '塗布', indication: '皮膚炎', isAdopted: true, drugType: 'topical', units: ['g', '本'] }
            ]
          },
          {
            id: 'topical_dermatologic',
            name: '皮膚科用薬（その他）',
            level: 3,
            drugs: [
              { id: 'drug_hirudoid', name: 'ヒルドイドソフト軟膏0.3%', dosage: '0.3%', usage: '1日1~数回', formulation: '軟膏', route: '塗布', indication: '皮膚保湿', isAdopted: true, drugType: 'topical', units: ['g', '本'] },
              { id: 'drug_vaseline_white', name: '白色ワセリン', dosage: '-', usage: '適宜', formulation: '軟膏', route: '塗布', indication: '皮膚保護', isAdopted: true, drugType: 'topical', units: ['g', '本'] },
              { id: 'drug_kerasal', name: 'ケラチナミンコーワ軟膏20%', dosage: '20%', usage: '1日数回', formulation: '軟膏', route: '塗布', indication: '角化症', isAdopted: true, drugType: 'topical', units: ['g', '本'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'metabolic',
    name: '代謝性医薬品',
    level: 1,
    isExpanded: false,
    subcategories: [
      {
        id: 'diabetes',
        name: '糖尿病用薬',
        level: 2,
        isExpanded: false,
        subcategories: [
          {
            id: 'biguanides',
            name: 'ビグアナイド系',
            level: 3,
            drugs: [
              { id: 'drug_metformin', name: 'メトグルコ錠250mg', dosage: '250mg', usage: '1日2~3回食後', formulation: '錠剤', route: '経口', indication: '2型糖尿病', isAdopted: true, drugType: 'oral', units: ['錠'] },
            ]
          },
          {
            id: 'sulfonylureas',
            name: 'スルホニル尿素系',
            level: 3,
            drugs: [
              { id: 'drug_glimepiride', name: 'アマリール錠1mg', dosage: '1mg', usage: '1日1~2回朝食前', formulation: '錠剤', route: '経口', indication: '2型糖尿病', isAdopted: true, drugType: 'oral', units: ['錠'] },
            ]
          }
        ]
      },
      {
        id: 'dyslipidemia',
        name: '脂質異常症用薬',
        level: 2,
        drugs: [
          { id: 'drug_atorvastatin', name: 'リピトール錠10mg', dosage: '10mg', usage: '1日1回夕食後', formulation: '錠剤', route: '経口', indication: '高コレステロール血症', isAdopted: true, drugType: 'oral', units: ['錠'] },
          { id: 'drug_pravastatin', name: 'メバロチン錠10mg', dosage: '10mg', usage: '1日1回夕食後', formulation: '錠剤', route: '経口', indication: '高コレステロール血症', isAdopted: true, drugType: 'oral', units: ['錠'] },
        ]
      }
    ]
  },
  {
    id: 'tissue_cellular',
    name: '組織細胞機能用医薬品',
    level: 1,
    isExpanded: false,
    subcategories: [
      {
        id: 'analgesics_antipyretics',
        name: '鎮痛・解熱・鎮痙薬',
        level: 2,
        isExpanded: false,
        subcategories: [
          {
            id: 'nsaids',
            name: 'NSAIDs',
            level: 3,
            drugs: [
              { id: 'drug_loxoprofen', name: 'ロキソニン錠60mg', dosage: '60mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '疼痛・発熱・炎症', isAdopted: true, drugType: 'oral', units: ['錠'] },
              { id: 'drug_aspirin', name: 'バイアスピリン錠100mg', dosage: '100mg', usage: '1日1回食後', formulation: '錠剤', route: '経口', indication: '抗血小板療法', isAdopted: true, drugType: 'oral', units: ['錠'] },
              { id: 'drug_diclofenac', name: 'ボルタレン錠25mg', dosage: '25mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '炎症・疼痛', isAdopted: true, drugType: 'oral', units: ['錠'], classification: 'powerful' }
            ]
          },
          {
            id: 'acetaminophen',
            name: 'アセトアミノフェン系',
            level: 3,
            drugs: [
              { id: 'drug_acetaminophen', name: 'カロナール錠200mg', dosage: '200mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '発熱・疼痛', isAdopted: true, drugType: 'oral', units: ['錠'] },
            ]
          },
          {
            id: 'topical_nsaids',
            name: '外用NSAIDs',
            level: 3,
            drugs: [
              { id: 'drug_loxoprofen_tape', name: 'ロキソニンテープ50mg', dosage: '50mg', usage: '1日1回', formulation: '貼付剤', route: '貼付', indication: '疼痛・炎症', isAdopted: true, drugType: 'topical', units: ['枚'], isRefillProhibited: true, refillProhibitionReason: '湿布薬' },
              { id: 'drug_loxoprofen_tape100', name: 'ロキソニンテープ100mg', dosage: '100mg', usage: '1日1回', formulation: '貼付剤', route: '貼付', indication: '疼痛・炎症', isAdopted: true, drugType: 'topical', units: ['枚'], isRefillProhibited: true, refillProhibitionReason: '湿布薬' },
              { id: 'drug_mohrus_tape', name: 'モーラステープ20mg', dosage: '20mg', usage: '1日1回', formulation: '貼付剤', route: '貼付', indication: '疼痛・炎症', isAdopted: true, drugType: 'topical', units: ['枚'], isRefillProhibited: true, refillProhibitionReason: '湿布薬' },
              { id: 'drug_voltaren_gel', name: 'ボルタレンゲル1%', dosage: '1%', usage: '1日3~4回', formulation: 'ゲル剤', route: '塗布', indication: '炎症・疼痛', isAdopted: true, drugType: 'topical', units: ['g', '本'] }
            ]
          }
        ]
      },
      {
        id: 'anticoagulants',
        name: '血液・体液用薬',
        level: 2,
        drugs: [
          { id: 'drug_warfarin', name: 'ワーファリン錠1mg', dosage: '1mg', usage: '1日1回', formulation: '錠剤', route: '経口', indication: '血栓塞栓症の予防・治療', isAdopted: true, drugType: 'oral', units: ['錠'] },
          { id: 'drug_warfarin2', name: 'ワルファリン錠1mg', dosage: '1mg', usage: '1日1回', formulation: '錠剤', route: '経口', indication: '血栓塞栓症', isAdopted: true, drugType: 'oral', units: ['錠'], classification: 'powerful', isRefillProhibited: true, refillProhibitionReason: '抗凝固薬' },
        ]
      },
      {
        id: 'antiallergic',
        name: '抗アレルギー薬',
        level: 2,
        isExpanded: false,
        subcategories: [
          {
            id: 'antihistamine',
            name: '抗ヒスタミン薬',
            level: 3,
            drugs: [
              { id: 'drug_allegra', name: 'アレグラ錠60mg', dosage: '60mg', usage: '1日2回朝夕食後', formulation: '錠剤', route: '経口', indication: 'アレルギー性鼻炎・蕁麻疹', isAdopted: true, drugType: 'oral', units: ['錠'] },
              { id: 'drug_alesion', name: 'アレジオン錠20mg', dosage: '20mg', usage: '1日1回就寝前', formulation: '錠剤', route: '経口', indication: 'アレルギー性鼻炎・蕁麻疹', isAdopted: true, drugType: 'oral', units: ['錠'] },
              { id: 'drug_claritin', name: 'クラリチン錠10mg', dosage: '10mg', usage: '1日1回食後', formulation: '錠剤', route: '経口', indication: 'アレルギー性鼻炎・蕁麻疹', isAdopted: true, drugType: 'oral', units: ['錠'] },
              { id: 'drug_zyrtec', name: 'ジルテック錠10mg', dosage: '10mg', usage: '1日1回就寝前', formulation: '錠剤', route: '経口', indication: 'アレルギー性鼻炎・蕁麻疹', isAdopted: true, drugType: 'oral', units: ['錠'] },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'herbal_kampo',
    name: '生薬及び漢方処方に基づく医薬品',
    level: 1,
    isExpanded: false,
    subcategories: [
      {
        id: 'kampo_internal',
        name: '漢方製剤（内用）',
        level: 2,
        isExpanded: false,
        subcategories: [
          {
            id: 'kampo_cold',
            name: '感冒・呼吸器疾患用',
            level: 3,
            drugs: [
              { id: 'drug_kakkonto', name: '葛根湯エキス顆粒', dosage: '1包', usage: '1日3回食前', formulation: '顆粒', route: '経口', indication: '感冒初期', isAdopted: true, drugType: 'oral', units: ['g', '包'] },
              { id: 'drug_maoto', name: '麻黄湯エキス顆粒', dosage: '1包', usage: '1日3回食前', formulation: '顆粒', route: '経口', indication: '感冒・インフルエンザ', isAdopted: true, drugType: 'oral', units: ['g', '包'] },
            ]
          },
          {
            id: 'kampo_digestive',
            name: '消化器疾患用',
            level: 3,
            drugs: [
              { id: 'drug_rikkunshito', name: '六君子湯エキス顆粒', dosage: '1包', usage: '1日3回食前', formulation: '顆粒', route: '経口', indication: '胃炎・食欲不振', isAdopted: true, drugType: 'oral', units: ['g', '包'] },
              { id: 'drug_daikenchuto', name: '大建中湯エキス顆粒', dosage: '1包', usage: '1日3回食前', formulation: '顆粒', route: '経口', indication: '腹部膨満・腸閉塞予防', isAdopted: true, drugType: 'oral', units: ['g', '包'] },
            ]
          }
        ]
      },
      {
        id: 'herbal_preparations',
        name: '生薬製剤',
        level: 2,
        drugs: [
          { id: 'drug_shakuyaku', name: '芍薬甘草湯エキス顆粒', dosage: '1包', usage: '1日3回または頓用', formulation: '顆粒', route: '経口', indication: '筋肉痙攣', isAdopted: true, drugType: 'oral', units: ['g', '包'] },
        ]
      }
    ]
  },
  {
    id: 'anti_pathogen',
    name: '病原生物に対する医薬品',
    level: 1,
    isExpanded: false,
    subcategories: [
      {
        id: 'antibiotics',
        name: '抗生物質製剤',
        level: 2,
        isExpanded: false,
        subcategories: [
          {
            id: 'penicillins',
            name: 'ペニシリン系',
            level: 3,
            drugs: [
              { id: 'drug_amoxicillin', name: 'サワシリン錠250mg', dosage: '250mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '細菌感染症', isAdopted: true, drugType: 'oral' },
            ]
          },
          {
            id: 'cephalosporins',
            name: 'セフェム系',
            level: 3,
            drugs: [
              { id: 'drug_cefdinir', name: 'セフゴン錠100mg', dosage: '100mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '細菌感染症', isAdopted: true, drugType: 'oral' },
              { id: 'drug_cefcapene', name: 'フロモックス錠100mg', dosage: '100mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '細菌感染症', isAdopted: true, drugType: 'oral' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'non_therapeutic',
    name: '治療を主目的としない医薬品',
    level: 1,
    isExpanded: false,
    subcategories: [
      {
        id: 'diagnostic',
        name: '診断用薬',
        level: 2,
        isExpanded: false,
        subcategories: [
          {
            id: 'contrast_media',
            name: '造影剤',
            level: 3,
            drugs: [
              { id: 'drug_iopamidol', name: 'イオパミロン注300', dosage: '300mgI/mL', usage: 'CT撮影時', formulation: '注射液', route: '静脈注射', indication: 'CT造影検査', isAdopted: true, drugType: 'injection', units: ['mL', 'A'] },
              { id: 'drug_gadolinium', name: 'マグネビスト注', dosage: '0.5mmol/mL', usage: 'MRI撮影時', formulation: '注射液', route: '静脈注射', indication: 'MRI造影検査', isAdopted: true, drugType: 'injection', units: ['mL', 'A'] },
            ]
          },
          {
            id: 'skin_test',
            name: '皮内反応用薬',
            level: 3,
            drugs: [
              { id: 'drug_tuberculin', name: 'ツベルクリン注', dosage: '0.1mL', usage: '皮内注射', formulation: '注射液', route: '皮内注射', indication: '結核診断', isAdopted: true, drugType: 'injection', units: ['mL', 'A'] },
            ]
          }
        ]
      },
      {
        id: 'prophylaxis',
        name: '予防用薬（ワクチン等）',
        level: 2,
        drugs: [
          { id: 'drug_influenza_vaccine', name: 'インフルエンザHAワクチン', dosage: '0.5mL', usage: '皮下注射', formulation: '注���液', route: '皮下注射', indication: 'インフルエンザ予防', isAdopted: true, drugType: 'injection', units: ['mL', 'A'] },
          { id: 'drug_pneumococcal', name: '肺炎球菌ワクチン', dosage: '0.5mL', usage: '皮下または筋注', formulation: '注射液', route: '皮下注射', indication: '肺炎球菌感染予防', isAdopted: true, drugType: 'injection', units: ['mL', 'A'] },
        ]
      }
    ]
  },
  {
    id: 'narcotics',
    name: '麻薬',
    level: 1,
    isExpanded: false,
    subcategories: [
      {
        id: 'narcotic_analgesics',
        name: '麻薬性鎮痛薬',
        level: 2,
        drugs: [
          { id: 'drug_morphine', name: 'モルヒネ塩酸塩錠10mg', dosage: '10mg', usage: '1日3回食後', formulation: '錠剤', route: '経口', indication: '中等度～高度疼痛', isAdopted: true, drugType: 'oral', units: ['錠'], isRefillProhibited: true, refillProhibitionReason: '麻薬', classification: 'narcotic' },
          { id: 'drug_oxycodone', name: 'オキシコンチン錠5mg', dosage: '5mg', usage: '1日2回', formulation: '錠剤', route: '経口', indication: '中等度～高度疼痛', isAdopted: true, drugType: 'oral', units: ['錠'], isRefillProhibited: true, refillProhibitionReason: '麻薬', classification: 'narcotic' },
        ]
      }
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

interface AllergyInfo {
  id: string;
  substance: string;
  reaction: string;
  severity: '軽度' | '中等度' | '重度';
  date: string;
}

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
  // 履歴から直接オーダーリストに追加する機能
  onAddHistoryToConfirmed?: (item: OrderItem) => void;
  onAddMultipleHistoryToConfirmed?: (items: OrderItem[]) => void;
  // 履歴選択機能
  onSelectHistory?: (history: { date: string; department: string; registeredBy: string; orders: OrderItem[] }) => void;
  // 患者アレルギー情報
  patientAllergies?: AllergyInfo[];
  // 現在ログイン中の医師ID（頻用薬剤取得用）
  currentDoctorId?: string | null;
}

export function LeftPanel({ 
  activeTab, 
  onTabChange, 
  onAddCandidate, 
  onAddMultipleCandidates, 
  onAddToDetail, 
  onAddMultipleToDetail,
  activeSubTab: externalActiveSubTab,
  onSubTabChange: externalOnSubTabChange,
  onAddHistoryToConfirmed,
  onAddMultipleHistoryToConfirmed,
  onSelectHistory,
  patientAllergies = [],
  currentDoctorId = null
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
  
  // 採用薬フィルタの状態管理
  const [isAdoptedDrugOnly, setIsAdoptedDrugOnly] = useState(false);
  
  // 薬剤タイプフィルタの状態管理
  const [drugTypeFilter, setDrugTypeFilter] = useState<'all' | 'oral' | 'topical' | 'injection'>('all');

  // 検索フォーカスの状態管理
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // 頻用薬剤データ（医師の処方履歴から動的に取得）
  const [frequentDrugs, setFrequentDrugs] = useState<DrugItem[]>([]);
  
  useEffect(() => {
    if (currentDoctorId) {
      // LocalStorageから医師の処方履歴を集計して頻用薬剤を取得
      const calculated = calculateFrequentDrugs(currentDoctorId, 10);
      setFrequentDrugs(calculated.map(drug => ({
        id: drug.id,
        name: drug.name,
        drugType: drug.drugType,
        classification: drug.classification,
        isAdopted: drug.isAdopted,
        units: drug.units
      })));
    } else {
      // 医師が選択されていない場合はモックデータを使用
      setFrequentDrugs(mockFrequentDrugs.map(drug => ({
        id: drug.id,
        name: drug.name,
        drugType: drug.drugType,
        classification: drug.classification,
        isAdopted: drug.isAdopted,
        units: drug.units
      })));
    }
  }, [currentDoctorId]);

  // アレルギーチェック関数
  const checkAllergy = (drugName: string): boolean => {
    if (!patientAllergies || patientAllergies.length === 0) return false;
    
    return patientAllergies.some(allergy => {
      const substanceLower = allergy.substance.toLowerCase();
      const drugNameLower = drugName.toLowerCase();
      
      // マッチングルール
      return (
        drugNameLower.includes(substanceLower) ||
        substanceLower.includes(drugNameLower) ||
        (substanceLower.includes('ペニシリン') && (drugNameLower.includes('アモキシシリン') || drugNameLower.includes('ペニシリン'))) ||
        (substanceLower.includes('nsaids') && (drugNameLower.includes('ロキソニン') || drugNameLower.includes('イブプロフェン') || drugNameLower.includes('ジクロフェナク') || drugNameLower.includes('ボルタレン')))
      );
    });
  };

  const handleAddItem = (item: OrderItem, source: string) => {
    // routeTypeを自動設定
    let routeType: '内服' | '外用' | '注射' | '注入' = '内服';
    const itemWithType = item as any;
    
    if (itemWithType.drugType === 'topical') {
      routeType = '外用';
    } else if (itemWithType.drugType === 'injection') {
      routeType = '注射';
    } else if (itemWithType.drugType === 'oral') {
      routeType = '内服';
    }
    
    onAddCandidate({ ...item, source, routeType });
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
      name: `${history.date} ${history.department}`,
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
  const handleAddDrugItem = (item: OrderItem & { drugType?: 'oral' | 'topical' | 'injection'; units?: string[] }) => {
    if (onAddToDetail) {
      // drugTypeに基づいてrouteTypeを設定
      let routeType: '内服' | '外用' | '注射' | '注入' | undefined;
      if (item.drugType === 'oral') {
        routeType = '内服';
      } else if (item.drugType === 'topical') {
        routeType = '外用';
      } else if (item.drugType === 'injection') {
        routeType = '注射';
      }
      
      onAddToDetail({ 
        ...item, 
        type: 'prescription',
        routeType,
        units: item.units
      });
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

  // 薬効分類の展開/折りたたみ（再帰的）
  const toggleCategoryExpansionRecursive = (categories: DrugCategory[], categoryId: string): DrugCategory[] => {
    return categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, isExpanded: !cat.isExpanded };
      }
      if (cat.subcategories) {
        return { ...cat, subcategories: toggleCategoryExpansionRecursive(cat.subcategories, categoryId) };
      }
      return cat;
    });
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setDrugCategories(prev => toggleCategoryExpansionRecursive(prev, categoryId));
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

  // カテゴリから再帰的に薬剤を取得
  const getAllDrugsFromCategory = (category: DrugCategory): DrugItem[] => {
    let drugs: DrugItem[] = category.drugs || [];
    if (category.subcategories) {
      category.subcategories.forEach(subcat => {
        drugs = [...drugs, ...getAllDrugsFromCategory(subcat)];
      });
    }
    return drugs;
  };

  // 再帰的にカテゴリツリーを描画するヘルパー関数
  const renderCategoryTree = (category: DrugCategory, depth: number = 0) => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const drugCount = category.drugs?.length || 0;
    const isSelected = selectedCategory?.id === category.id || selectedSubcategory?.id === category.id;
    
    return (
      <div key={category.id} className="mb-1">
        <div
          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors text-sm ${
            isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
          }`}
          onClick={() => {
            if (depth === 0) {
              handleCategorySelect(category);
            } else {
              handleSubcategorySelect(category);
            }
          }}
        >
          {hasSubcategories && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCategoryExpansion(category.id);
              }}
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              {category.isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasSubcategories && <div className="w-4" />}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{category.name}</div>
            {category.description && (
              <div className="text-xs text-muted-foreground truncate">
                {category.description}
                {drugCount > 0 && ` (${drugCount}剤)`}
              </div>
            )}
          </div>
        </div>

        {/* 再帰的にサブカテゴリを表示 */}
        {category.isExpanded && hasSubcategories && (
          <div className="ml-4 mt-1">
            {category.subcategories!.map((subcat) => renderCategoryTree(subcat, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // サブタブの内容をレンダリングする関数
  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'history':
        return (
          <div className="p-4">
            <h3 className="mb-3">診療履歴</h3>
            <div className="mb-2 text-xs text-muted-foreground">
              履歴をクリックして候補を表示、追加するオーダーを選択できます
            </div>
            <div className="space-y-2">
              {mockHistoryByTab[activeTab]?.map((history, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border transition-colors border-border hover:bg-accent group cursor-pointer ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                  }`}
                  onClick={() => {
                    if (onSelectHistory) {
                      onSelectHistory(history);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* ヘッダー行：日付・診療科・登録者 */}
                      <div className="flex items-center gap-2 mb-2 pb-1 border-b border-border/50">
                        <span className="text-sm font-medium">{history.date}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {history.department}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          登録: {history.registeredBy}
                        </span>
                      </div>
                      
                      {/* オーダー概要表示 */}
                      <div className="text-xs text-muted-foreground">
                        <div className="font-medium mb-1">オーダー内容:</div>
                        {history.orders.map((order, orderIndex) => (
                          <div key={order.id} className="ml-2 mb-1">
                            <div className="font-medium text-foreground">• {order.name}</div>
                            {activeTab !== 'lab' && (
                              <div className="ml-3 text-muted-foreground">
                                {order.dosage && <span>{order.dosage}</span>}
                                {order.usage && <span> {order.usage}</span>}
                                {order.period && <span> {order.period}</span>}
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="mt-2 text-primary group-hover:text-primary/80">
                          {history.orders.length}件のオーダーを候補に追加 →
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-primary" />
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
          // 採用薬フィルタを再帰的に適用
          const filterAdoptedDrugsRecursive = (category: DrugCategory): DrugCategory | null => {
            const filteredDrugs = category.drugs?.filter(drug => drug.isAdopted);
            const filteredSubcategories = category.subcategories
              ?.map(sub => filterAdoptedDrugsRecursive(sub))
              .filter((sub): sub is DrugCategory => sub !== null);
            
            // 薬剤もサブカテゴリも空なら除外
            if ((!filteredDrugs || filteredDrugs.length === 0) && 
                (!filteredSubcategories || filteredSubcategories.length === 0)) {
              return null;
            }
            
            return {
              ...category,
              drugs: filteredDrugs,
              subcategories: filteredSubcategories
            };
          };

          const filteredDrugCategories = isAdoptedDrugOnly 
            ? drugCategories.map(cat => filterAdoptedDrugsRecursive(cat))
                .filter((cat): cat is DrugCategory => cat !== null)
            : drugCategories;

          return (
            <div className="flex h-full">
              {/* 左側：薬効分類ツリー */}
              <div className="w-60 border-r border-border bg-card">
                <div className="p-3 border-b border-border">
                  <h3 className="text-sm font-medium mb-3">薬効分類</h3>
                  
                  {/* 採用薬フィルタ */}
                  <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-md border border-border">
                    <Checkbox
                      id="adopted-drug-filter-category"
                      checked={isAdoptedDrugOnly}
                      onCheckedChange={(checked) => setIsAdoptedDrugOnly(checked as boolean)}
                    />
                    <Label
                      htmlFor="adopted-drug-filter-category"
                      className="text-xs cursor-pointer"
                    >
                      院内採用薬のみ
                    </Label>
                  </div>
                </div>
                <ScrollArea className="h-full">
                  <div className="p-2">
                    {filteredDrugCategories.map((category) => renderCategoryTree(category, 0))}
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
                    {(() => {
                      // 表示する薬剤リストを取得（再帰的）
                      const drugsToDisplay = !selectedCategory 
                        ? []
                        : selectedSubcategory
                        ? getAllDrugsFromCategory(selectedSubcategory)
                        : getAllDrugsFromCategory(selectedCategory);

                      return (
                        <div className="border border-border rounded-md">
                          <div className="px-3 py-2 border-b border-border bg-muted/30">
                            <div className="flex items-center text-xs text-muted-foreground px-3">
                              <div className="flex-1">薬剤名</div>
                              <div className="w-20 text-right">単位</div>
                              <div className="w-8 ml-2"></div>
                            </div>
                          </div>
                          <div className="p-2">
                            {drugsToDisplay.length > 0 ? (
                              <div className="space-y-1">
                                {drugsToDisplay.map((drug) => (
                                  <div key={drug.id} className="group">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-auto w-full justify-start text-left px-3 py-2 hover:bg-accent"
                                      onClick={() => handleAddDrugItem({ ...drug, source: 'category' })}
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">{drug.name}</div>
                                      </div>
                                      <div className="w-20 text-right text-xs text-muted-foreground">
                                        {drug.units?.[0] || '-'}
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log('薬剤情報参照:', drug.name);
                                        }}
                                        className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                      >
                                        <Info className="w-3 h-3" />
                                      </Button>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center text-muted-foreground py-8">
                                <div className="text-sm">薬剤がありません</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
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
                  <h4 className="text-sm mb-2">薬剤一覧</h4>
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
          // 採用薬フィルタを適用
          const filteredDrugCategories = isAdoptedDrugOnly 
            ? drugCategories.map(category => ({
                ...category,
                drugs: category.drugs?.filter(drug => drug.isAdopted),
                subcategories: category.subcategories?.map(sub => ({
                  ...sub,
                  drugs: sub.drugs?.filter(drug => drug.isAdopted) || []
                })).filter(sub => sub.drugs.length > 0)
              })).filter(category => 
                (category.drugs && category.drugs.length > 0) || 
                (category.subcategories && category.subcategories.length > 0)
              )
            : drugCategories;

          // 薬剤タイプフィルタを適用（再帰的）
          const filterCategoriesByType = (categories: DrugCategory[], type: 'oral' | 'topical' | 'injection'): DrugCategory[] => {
            return categories.map(category => {
              const filteredDrugs = category.drugs?.filter(drug => drug.drugType === type) || [];
              const filteredSubcategories = category.subcategories 
                ? filterCategoriesByType(category.subcategories, type)
                : [];
              
              return {
                ...category,
                drugs: filteredDrugs.length > 0 ? filteredDrugs : undefined,
                subcategories: filteredSubcategories.length > 0 ? filteredSubcategories : undefined
              };
            }).filter(category => 
              (category.drugs && category.drugs.length > 0) || 
              (category.subcategories && category.subcategories.length > 0)
            );
          };

          const typeFilteredCategories = drugTypeFilter !== 'all'
            ? filterCategoriesByType(filteredDrugCategories, drugTypeFilter)
            : filteredDrugCategories;

          // 検索クエリによるフィルタリング（3文字以上の場合）（再帰的）
          const filterCategoriesBySearch = (categories: DrugCategory[], query: string): DrugCategory[] => {
            const lowerQuery = query.toLowerCase();
            
            return categories.map(category => {
              const filteredDrugs = category.drugs?.filter(drug => 
                drug.name.toLowerCase().includes(lowerQuery)
              ) || [];
              
              const filteredSubcategories = category.subcategories 
                ? filterCategoriesBySearch(category.subcategories, query)
                : [];
              
              return {
                ...category,
                drugs: filteredDrugs.length > 0 ? filteredDrugs : undefined,
                subcategories: filteredSubcategories.length > 0 ? filteredSubcategories : undefined
              };
            }).filter(category => 
              (category.drugs && category.drugs.length > 0) || 
              (category.subcategories && category.subcategories.length > 0)
            );
          };

          const searchFilteredCategories = searchQuery.length >= 3
            ? filterCategoriesBySearch(typeFilteredCategories, searchQuery)
            : [];

          return (
            <div className="p-4 h-full flex flex-col">
              <h3 className="mb-3 flex-shrink-0">薬剤検索</h3>
              <div className="relative mb-4 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="薬剤名を入力（3文字以上）"
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    // 少し遅延させてクリックイベントを処理できるようにする
                    setTimeout(() => setIsSearchFocused(false), 200);
                  }}
                  className="pl-10"
                />
                
                {/* フォーカス時の候補ドロップダウン（検索クエリが空の時のみ） */}
                {isSearchFocused && searchQuery.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50">
                    {/* 頻用薬剤 */}
                    <div className="p-2">
                      <div className="text-xs text-muted-foreground px-2 py-1 mb-1">頻用薬剤</div>
                      <div className="space-y-0.5">
                        {frequentDrugs.map((drug) => {
                          const drugTypeLabel = drug.drugType === 'oral' ? '内服' : 
                                               drug.drugType === 'topical' ? '外用' : 
                                               drug.drugType === 'injection' ? '注射' : '';
                          const hasAllergy = checkAllergy(drug.name);
                          
                          return (
                            <Button
                              key={drug.id}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-full grid grid-cols-[1fr_40px_24px] gap-2 items-center text-xs px-2 hover:bg-muted"
                              onClick={() => {
                                // 中央ペインで詳細入力
                                if (activeTab === 'prescription') {
                                  handleAddDrugItem({ ...drug, source: 'frequent' });
                                } else {
                                  handleAddItem(drug, 'frequent');
                                }
                                setIsSearchFocused(false);
                              }}
                            >
                              <span className="text-left truncate">{drug.name}</span>
                              <div className="flex justify-center">
                                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                                  {drugTypeLabel}
                                </Badge>
                              </div>
                              <div className="flex justify-center">
                                {hasAllergy && (
                                  <span className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] bg-pink-600 text-white">
                                    禁
                                  </span>
                                )}
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* フィルタ（1行表示） */}
              <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                {/* 薬剤タイプフィルタ */}
                <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-md border border-border">
                  <RadioGroup
                    value={drugTypeFilter}
                    onValueChange={(value: 'all' | 'oral' | 'topical' | 'injection') => setDrugTypeFilter(value)}
                    className="flex gap-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="all" id="type-all" className="h-3.5 w-3.5" />
                      <Label htmlFor="type-all" className="text-xs cursor-pointer">
                        全て
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="oral" id="type-oral" className="h-3.5 w-3.5" />
                      <Label htmlFor="type-oral" className="text-xs cursor-pointer">
                        内服
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="topical" id="type-topical" className="h-3.5 w-3.5" />
                      <Label htmlFor="type-topical" className="text-xs cursor-pointer">
                        外用
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="injection" id="type-injection" className="h-3.5 w-3.5" />
                      <Label htmlFor="type-injection" className="text-xs cursor-pointer">
                        注射
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* 採用薬フィルタ */}
                <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-md border border-border">
                  <Checkbox
                    id="adopted-drug-filter"
                    checked={isAdoptedDrugOnly}
                    onCheckedChange={(checked) => setIsAdoptedDrugOnly(checked as boolean)}
                  />
                  <Label
                    htmlFor="adopted-drug-filter"
                    className="text-xs cursor-pointer whitespace-nowrap"
                  >
                    院内採用薬のみ
                  </Label>
                </div>
              </div>
              
              {/* 薬剤一覧（常に表示） */}
              <div className="flex-1 overflow-hidden border border-border rounded-lg bg-card flex flex-col">
                <div className="flex items-center justify-between p-3 flex-shrink-0">
                  <h4 className="text-sm">薬剤一覧</h4>
                  {searchQuery.length >= 3 && (() => {
                    // 全ての薬剤をフラット化して件数を計算（再帰的）
                    const getAllDrugsRecursively = (categories: DrugCategory[]): any[] => {
                      const drugs: any[] = [];
                      for (const cat of categories) {
                        if (cat.drugs) {
                          drugs.push(...cat.drugs);
                        }
                        if (cat.subcategories) {
                          drugs.push(...getAllDrugsRecursively(cat.subcategories));
                        }
                      }
                      return drugs;
                    };
                    const allDrugs = getAllDrugsRecursively(searchFilteredCategories);
                    return (
                      <span className="text-xs text-muted-foreground">
                        {allDrugs.length}件
                      </span>
                    );
                  })()}
                </div>
                
                {/* ヘッダー行（常に表示） */}
                <div className="px-3 flex-shrink-0 mt-2">
                  <div className="grid grid-cols-[1fr_60px_50px_40px] gap-2 px-3 py-2 bg-muted/50 border-b border-border text-xs text-muted-foreground">
                    <div>薬剤名</div>
                    <div className="text-center">種別</div>
                    <div className="text-center">区分</div>
                    <div className="text-center">情報</div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                {searchQuery.length < 3 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">薬剤名を3文字以上入力してください</p>
                  </div>
                ) : (() => {
                  // 全ての薬剤をフラット化（再帰的に全階層から取得）
                  const getAllDrugsRecursively = (categories: DrugCategory[]): any[] => {
                    const drugs: any[] = [];
                    for (const cat of categories) {
                      if (cat.drugs) {
                        drugs.push(...cat.drugs);
                      }
                      if (cat.subcategories) {
                        drugs.push(...getAllDrugsRecursively(cat.subcategories));
                      }
                    }
                    return drugs;
                  };
                  
                  const allDrugs = getAllDrugsRecursively(searchFilteredCategories);
                  
                  return allDrugs.length > 0 ? (
                    <div className="space-y-0.5 px-3">
                        {allDrugs.map((item) => {
                          // 薬剤タイプを日本語に変換
                          const drugTypeLabel = item.drugType === 'oral' ? '内服' : 
                                               item.drugType === 'topical' ? '外用' : 
                                               item.drugType === 'injection' ? '注射' : '';
                          
                          // アレルギーチェック
                          const hasAllergy = checkAllergy(item.name);
                          
                          // 分類に応じた背景色とラベルを設定（アレルギーが最優先）
                          const classificationInfo = hasAllergy
                            ? { bg: 'bg-pink-50 dark:bg-pink-950/20 hover:bg-pink-100 dark:hover:bg-pink-950/30 border border-pink-300 dark:border-pink-900/50', label: '禁', labelColor: 'bg-pink-600 text-white' }
                            : item.classification === 'narcotic' 
                            ? { bg: 'bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50', label: '麻', labelColor: 'bg-red-600 text-white' }
                            : item.classification === 'poison'
                            ? { bg: 'bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50', label: '毒', labelColor: 'bg-orange-600 text-white' }
                            : item.classification === 'powerful'
                            ? { bg: 'bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50', label: '劇', labelColor: 'bg-amber-600 text-white' }
                            : item.classification === 'psychotropic'
                            ? { bg: 'hover:bg-muted', label: '向', labelColor: 'bg-blue-600 text-white' }
                            : { bg: 'hover:bg-muted', label: null, labelColor: '' };
                          
                          return (
                            <div key={item.id} className="group relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-9 w-full grid grid-cols-[1fr_60px_50px_40px] gap-2 items-center text-xs px-3 justify-items-start ${classificationInfo.bg}`}
                                onClick={() => {
                                  // 薬剤を追加
                                  isDirectMode ? handleAddDrugItem({ ...item, source: 'search' }) : handleAddItem(item, 'search');
                                }}
                              >
                                <span className="font-medium text-left truncate">{item.name}</span>
                                <div className="flex justify-center items-center w-full">
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                    {drugTypeLabel}
                                  </Badge>
                                </div>
                                <div className="flex justify-center items-center w-full">
                                  {classificationInfo.label && (
                                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] ${classificationInfo.labelColor}`}>
                                      {classificationInfo.label}
                                    </span>
                                  )}
                                </div>
                                <div 
                                  className="flex justify-center items-center w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // 外部連携：薬剤情報参照
                                    console.log('薬剤情報参照:', item.name);
                                  }}
                                >
                                  <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary cursor-pointer" />
                                </div>
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">「{searchQuery}」に一致する薬剤が見つかりません</p>
                    </div>
                  );
                })()}
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
                      </div>
                      <div className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="p-1 h-6 w-6"
                          onClick={() => {
                            // 外部連携：薬剤情報参照
                            console.log('薬剤情報参照:', item.name);
                          }}
                        >
                          <Info className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1 h-6 w-6"
                          onClick={() => handleAddItem(item, 'search')}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
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
  const panelWidth = (activeTab === 'lab' || activeTab === 'prescription') ? 'w-[750px]' : 'w-80';

  return (
    <div className={`${panelWidth} bg-card border-r border-border flex flex-col h-full`}>
      <div className="p-4 border-b border-border flex-shrink-0">
        <h2>オーダー入力</h2>
        <div className="text-sm text-muted-foreground mt-1">
          {activeTab === 'prescription' ? '処方オーダー' : 
           activeTab === 'injection' ? '注射オーダー' : 
           '検体オーダー'}
        </div>
      </div>
      
      {/* 候補種別タブ（旧第2階層を第1階層に） */}
      <div className="px-4 mt-4 flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeSubTab} onValueChange={handleSubTabChange} className="flex flex-col h-full">
          <TabsList className={`grid w-full ${activeTab === 'prescription' ? 'grid-cols-4' : 'grid-cols-4'} flex-shrink-0`}>
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

          <div className="flex-1 overflow-y-auto min-h-0">
            {renderSubTabContent()}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default LeftPanel;