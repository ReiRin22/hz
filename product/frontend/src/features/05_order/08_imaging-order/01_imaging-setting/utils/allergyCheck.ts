/**
 * アレルギーチェック関連のユーティリティ関数
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/utils/allergyCheck.ts
 */

import type { OrderDetail, AllergyWarning } from '../types/order-shared.types';

/**
 * オーダーリストに対してアレルギーチェックを実行
 */
export function checkAllergies(
  confirmedOrders: OrderDetail[],
  patientAllergies?: string[]
): AllergyWarning[] {
  if (!patientAllergies || patientAllergies.length === 0) {
    return [];
  }

  const warnings: AllergyWarning[] = [];

  // 処方・注射オーダーをチェック
  const medicationOrders = confirmedOrders.filter(
    order => order.type === 'prescription' || order.type === 'injection'
  );

  medicationOrders.forEach(order => {
    patientAllergies.forEach(allergy => {
      if (order.name.includes(allergy) || allergy.includes(order.name)) {
        warnings.push({ order, matchedAllergy: allergy });
      }
    });
  });

  // 検体検査オーダーをチェック
  const labOrders = confirmedOrders.filter(order => order.type === 'lab');

  labOrders.forEach(order => {
    const needsContrast =
      order.name.includes('造影') ||
      order.name.includes('CT') ||
      order.name.includes('MRI') ||
      order.name.includes('血管造影') ||
      order.contrastAgent;

    if (needsContrast) {
      patientAllergies.forEach(allergy => {
        if (allergy.includes('ヨード') || allergy.includes('造影剤')) {
          if (order.name.includes('CT') || order.name.includes('造影') || order.contrastAgent?.includes('ヨード')) {
            warnings.push({ order, matchedAllergy: allergy });
          }
        }
        if (allergy.includes('ガドリニウム')) {
          if (order.name.includes('MRI') || order.contrastAgent?.includes('ガドリニウム')) {
            warnings.push({ order, matchedAllergy: allergy });
          }
        }
      });
    }

    const isBloodTest =
      order.specimenType === '血液' ||
      order.name.includes('Hb') ||
      order.name.includes('ヘモグロビン') ||
      order.name.includes('Ht') ||
      order.name.includes('ヘマトクリット') ||
      order.name.includes('Plt') ||
      order.name.includes('血小板') ||
      order.name.includes('白血球') ||
      order.name.includes('赤血球') ||
      order.name.includes('好中球') ||
      order.name.includes('リンパ球') ||
      order.name.includes('単球') ||
      order.name.includes('好酸球') ||
      order.name.includes('好塩基球');

    if (isBloodTest) {
      patientAllergies.forEach(allergy => {
        if (allergy.includes('ラテックス')) {
          warnings.push({
            order,
            matchedAllergy: `${allergy}（採血時の手袋・駆血帯に注意）`,
          });
        }
        if (allergy.includes('アルコール') || allergy.includes('エタノール')) {
          warnings.push({
            order,
            matchedAllergy: `${allergy}（アルコール消毒の代わりにポビドンヨード使用を推奨）`,
          });
        }
        if (allergy.includes('ポビドンヨード') || allergy.includes('イソジン') || allergy.includes('ヨード')) {
          if (!needsContrast) {
            warnings.push({
              order,
              matchedAllergy: `${allergy}（消毒薬に注意、クロルヘキシジンやアルコールの使用を推奨）`,
            });
          }
        }
        if (allergy.includes('クロルヘキシジン') || allergy.includes('ヒビテン')) {
          warnings.push({
            order,
            matchedAllergy: `${allergy}（消毒薬に注意）`,
          });
        }
      });
    }
  });

  return warnings;
}

export interface ContrastAllergyMatch {
  orderId: string;
  orderName: string;
  matchedAllergy: string;
}

/**
 * 造影剤アレルギーチェック。
 * 画像オーダーに造影剤が使用される場合、患者アレルギーと照合する。
 */
export function checkContrastAllergyRisk(
  imagingOrders: OrderDetail[],
  patientAllergies: string[],
): ContrastAllergyMatch[] {
  if (patientAllergies.length === 0) return [];

  const matches: ContrastAllergyMatch[] = [];

  for (const order of imagingOrders) {
    if (order.type !== 'imaging' || !order.useContrast) continue;

    for (const allergy of patientAllergies) {
      const isIodineRisk =
        (allergy.includes('ヨード') || allergy.includes('造影剤')) &&
        (order.name.includes('CT') || order.name.includes('造影') || order.contrastAgent?.includes('ヨード'));

      const isGadoliniumRisk =
        allergy.includes('ガドリニウム') &&
        (order.name.includes('MRI') || order.contrastAgent?.includes('ガドリニウム'));

      if (isIodineRisk || isGadoliniumRisk) {
        matches.push({ orderId: order.id, orderName: order.name, matchedAllergy: allergy });
        break;
      }
    }
  }

  return matches;
}
