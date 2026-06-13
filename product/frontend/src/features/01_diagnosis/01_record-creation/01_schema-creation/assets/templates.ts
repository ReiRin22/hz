import { TEMPLATE_COMPONENTS } from "./MedicalTemplates";

/**
 * テンプレートの型定義
 */
export interface Template {
  id: string;
  name: string;
  component: keyof typeof TEMPLATE_COMPONENTS;
}

/**
 * 身体部位の型定義
 */
export interface BodyPart {
  id: string;
  name: string;
  templates: Template[];
}

/**
 * 医療テンプレートデータ
 * 各身体部位ごとに複数のテンプレートを定義
 */
export const TEMPLATE_DATA: BodyPart[] = [
  {
    id: 'fullBody',
    name: '全身図',
    templates: [
      { id: 'fullBody1', name: '正面図', component: 'fullBody1' },
      { id: 'fullBody2', name: '背面図', component: 'fullBody2' },
      { id: 'fullBody3', name: '骨格図', component: 'fullBody3' }
    ]
  },
  {
    id: 'head',
    name: '頭部',
    templates: [
      { id: 'head1', name: '正面図', component: 'head1' },
      { id: 'head2', name: '側面図', component: 'head2' },
      { id: 'head3', name: '頭蓋骨', component: 'head3' }
    ]
  },
  {
    id: 'chest',
    name: '胸部',
    templates: [
      { id: 'chest1', name: '胸部構造', component: 'chest1' },
      { id: 'chest2', name: '心臓', component: 'chest2' },
      { id: 'chest3', name: '肺', component: 'chest3' }
    ]
  },
  {
    id: 'abdomen',
    name: '腹部',
    templates: [
      { id: 'abdomen1', name: '腹部構造', component: 'abdomen1' },
      { id: 'abdomen2', name: '消化器系', component: 'abdomen2' },
      { id: 'abdomen3', name: '肝臓', component: 'abdomen3' }
    ]
  },
  {
    id: 'limbs',
    name: '四肢',
    templates: [
      { id: 'limbs1', name: '四肢全体', component: 'limbs1' },
      { id: 'limbs2', name: '腕の骨格', component: 'limbs2' },
      { id: 'limbs3', name: '脚の筋肉', component: 'limbs3' }
    ]
  }
];
