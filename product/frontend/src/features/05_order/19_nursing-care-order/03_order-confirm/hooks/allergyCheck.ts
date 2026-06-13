import type { PendingOrderViewModel } from '../types/order-confirm.types';

export interface AllergyMatch {
  orderId: string;
  orderName: string;
  matchedAllergy: string;
}

/**
 * 未確定オーダーリストに対してアレルギーチェックを実行する。
 * 処方・注射オーダーの typeName / detail と患者アレルギー名を文字列一致で照合する。
 */
export function checkPendingOrderAllergies(
  pendingOrders: PendingOrderViewModel[],
  patientAllergies: string[],
): AllergyMatch[] {
  if (patientAllergies.length === 0) return [];

  const matches: AllergyMatch[] = [];
  const targetTypes = new Set(['prescription', 'injection']);

  for (const order of pendingOrders) {
    if (!targetTypes.has(order.type)) continue;
    const haystack = `${order.typeName} ${order.detail}`;
    for (const allergy of patientAllergies) {
      if (haystack.includes(allergy) || allergy.includes(order.typeName)) {
        matches.push({ orderId: order.id, orderName: order.typeName, matchedAllergy: allergy });
        break;
      }
    }
  }

  return matches;
}
