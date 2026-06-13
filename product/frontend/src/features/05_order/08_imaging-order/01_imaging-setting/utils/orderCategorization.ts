/**
 * オーダーのカテゴリ分類関連のユーティリティ関数
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/utils/orderCategorization.ts
 */

import type { OrderDetail, CategoryInfo } from '../types/order-shared.types';

/**
 * 検査項目IDからカテゴリを判定
 */
export function getLabCategory(itemId: string): CategoryInfo | null {
  if (itemId.match(/^lab_(ast|alt|ggt|ldh|alp|tp|alb|tbil|dbil|che|bun|cre|ua|egfr|tc|hdl|ldl|tg|glu|hba1c|ga|na|k|cl|ca|mg|p|amy|cpk|nh3|lactate)/i)) {
    return { id: 'biochemistry', name: '生化学検査' };
  }
  if (itemId.match(/^lab_(wbc|rbc|hgb|hct|plt|mcv|mch|mchc|neut|lymph|mono|eos|baso|retic)/i)) {
    return { id: 'hematology', name: '血液検査' };
  }
  if (itemId.match(/^lab_(pt|ptinr|aptt|fib|ddimer|fdp|at3)/i)) {
    return { id: 'coagulation', name: '凝固検査' };
  }
  if (itemId.match(/^lab_(crp|esr|rf|ana|aslo|igg|iga|igm|ige|c3|c4|procalcitonin)/i)) {
    return { id: 'immunology', name: '免疫・炎症' };
  }
  if (itemId.match(/^lab_(tsh|ft3|ft4|t3|t4|cortisol|acth|lh|fsh|prolactin|testosterone|estradiol|insulin|cpeptide)/i)) {
    return { id: 'endocrine', name: '内泌検査' };
  }
  if (itemId.match(/^lab_(hbsag|hbsab|hcvab|hcvrna|hiv|tpha|rpr|influenza|covid|strep)/i)) {
    return { id: 'infection', name: '感染症検査' };
  }
  if (itemId.match(/^lab_(cea|afp|ca199|ca125|ca153|psa|cyfra|scc|nse|progastrin)/i)) {
    return { id: 'tumor_marker', name: '腫瘍マーカー' };
  }
  if (itemId.match(/^lab_(troponin|troponint|bnp|ntprobnp|ckmb|myoglobin)/i)) {
    return { id: 'cardiac', name: '心臓マーカー' };
  }
  if (itemId.match(/^lab_(urine_|sediment)/i)) {
    return { id: 'urine', name: '尿検査' };
  }
  if (itemId.match(/^lab_(blood_type|crossmatch|stool_occult|hp|blood_culture|urine_culture)/i)) {
    return { id: 'other', name: 'その他' };
  }
  return null;
}

/**
 * 画像検査の種別からカテゴリ名を取得
 */
export function getImagingCategory(modality: string): CategoryInfo | null {
  const modalityLower = modality.toLowerCase();

  if (modalityLower === 'ct' || modalityLower.includes('ct') || modality === 'CT検査') {
    return { id: 'ct', name: 'CT検査' };
  }
  if (modalityLower === 'mri' || modalityLower.includes('mri') || modality === 'MRI検査') {
    return { id: 'mri', name: 'MRI検査' };
  }
  if (
    modalityLower === 'xray' ||
    modalityLower === 'x線' ||
    modalityLower === 'レントゲン' ||
    modality === 'X線撮影' ||
    modalityLower.includes('単純撮影')
  ) {
    return { id: 'xray', name: 'X線撮影' };
  }
  if (
    modalityLower === 'ultrasound' ||
    modalityLower === 'us' ||
    modalityLower.includes('超音波') ||
    modalityLower.includes('エコー') ||
    modality === '超音波検査'
  ) {
    return { id: 'ultrasound', name: '超音波検査' };
  }
  if (modalityLower === 'fluoroscopy' || modalityLower.includes('透視') || modality === '透視検査') {
    return { id: 'fluoroscopy', name: '透視検査' };
  }
  if (
    modalityLower === 'angiography' ||
    modalityLower.includes('血管造影') ||
    modalityLower.includes('アンギオ') ||
    modality === '血管造影検査'
  ) {
    return { id: 'angiography', name: '血管造影検査' };
  }
  if (modalityLower === 'mammography' || modalityLower.includes('マンモ') || modality === 'マンモグラフィ') {
    return { id: 'mammography', name: 'マンモグラフィ' };
  }
  if (
    modalityLower === 'nuclear' ||
    modalityLower.includes('核医学') ||
    modalityLower.includes('シンチ') ||
    modalityLower.includes('pet') ||
    modality === '核医学検査'
  ) {
    return { id: 'nuclear', name: '核医学検査' };
  }
  if (modalityLower === 'dexa' || modalityLower.includes('骨密度') || modality === '骨密度検査') {
    return { id: 'dexa', name: '骨密度検査' };
  }

  return null;
}

/**
 * オーダーをグループごとに分類する関数
 */
export function groupOrdersByType(orders: OrderDetail[]) {
  const grouped: { [key: string]: OrderDetail[] } = {};
  const ungrouped: OrderDetail[] = [];

  orders.forEach(order => {
    if (order.type === 'lab') {
      const category = order.subcategoryName ?? order.specimenType ?? 'その他';
      const groupId = `lab-specimen-${category}`;
      if (!grouped[groupId]) grouped[groupId] = [];
      grouped[groupId].push({
        ...order,
        groupId,
        groupName: category,
        groupType: undefined,
      });
    } else if (order.type === 'imaging') {
      ungrouped.push(order);
    } else if (order.groupId) {
      if (!grouped[order.groupId]) {
        grouped[order.groupId] = [];
      }
      grouped[order.groupId].push(order);
    } else {
      ungrouped.push(order);
    }
  });

  Object.keys(grouped).forEach(groupId => {
    // lab の specimen グループは1件でもグループ表示を維持する
    if (groupId.startsWith('lab-specimen-')) return;
    if (grouped[groupId].length === 1) {
      ungrouped.push(grouped[groupId][0]);
      delete grouped[groupId];
    }
  });

  return { grouped, ungrouped };
}
