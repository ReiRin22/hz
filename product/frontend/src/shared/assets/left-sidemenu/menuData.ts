import { FileText, Calendar, Users, ClipboardList, Stethoscope, TestTube, Monitor } from 'lucide-react';
import { MenuItem, SetData, OrderItem, ViewType } from '../types/menu.types';

// Myセットのダミーデータ
export const mySetData: SetData[] = [
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
export const availableOrdersForMySet: OrderItem[] = [
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
export const compositeSetData: Record<string, SetData[]> = {
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

export const getMenuItems = (currentView: ViewType): MenuItem[] => [
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
  { id: 'results', label: '検査結果', icon: TestTube, active: currentView === 'results' },
  { id: 'patient', label: '患者一覧', icon: Users, active: currentView === 'patient' },
  { id: 'document', label: '文書', icon: FileText },
  { id: 'testAppointment', label: '検査予約', icon: Monitor, active: currentView === 'testAppointment' },
  { id: 'appointment', label: '診察予約', icon: Calendar, active: currentView === 'appointment' },
];
