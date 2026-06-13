import type { OrderItem, OrderDetail } from '../types';

/**
 * オーダー項目のデフォルト数量を取得
 */
export const getDefaultQuantity = (item: OrderItem): string => {
  if (item.type === 'prescription') return '1錠';
  if (item.type === 'injection') return '1A';
  return '1';
};

/**
 * オーダー項目のデフォルト頻度を取得
 */
export const getDefaultFrequency = (item: OrderItem): string => {
  if (item.usage?.includes('1日3回')) return '1日3回';
  if (item.usage?.includes('1日2回')) return '1日2回';
  return '1日1回';
};

/**
 * オーダー項目のデフォルトタイミングを取得
 */
export const getDefaultTiming = (item: OrderItem): string => {
  if (item.usage?.includes('食後')) return '食後';
  if (item.usage?.includes('食前')) return '食前';
  if (item.type === 'prescription') return '朝昼夕';
  return '';
};

/**
 * 処方オーダーにRP番号を連番で振り直す
 */
export const reassignRpNumbers = (orders: OrderDetail[]): OrderDetail[] => {
  let prescriptionIndex = 1;
  
  return orders.map((order) => {
    if (order.type === 'prescription') {
      return {
        ...order,
        rpNumber: prescriptionIndex++
      };
    }
    return order;
  });
};

/**
 * 次のRP番号を計算
 */
export const calculateNextRpNumber = (orders: OrderDetail[]): number => {
  const prescriptionCount = orders.filter(o => o.type === 'prescription').length;
  return prescriptionCount + 1;
};
