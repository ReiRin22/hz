import type { OrderItem } from '../data/types';

/**
 * オーダーアイテムのデフォルト数量を取得
 */
export function getDefaultQuantity(item: OrderItem): string {
  if (item.type === 'prescription') return '1錠';
  if (item.type === 'injection') return '1A';
  return '1';
}

/**
 * オーダーアイテムのデフォルト頻度を取得
 */
export function getDefaultFrequency(item: OrderItem): string {
  if (item.usage?.includes('1日3回')) return '1日3回';
  if (item.usage?.includes('1日2回')) return '1日2回';
  return '1日1回';
}

/**
 * オーダーアイテムのデフォルトタイミングを取得
 */
export function getDefaultTiming(item: OrderItem): string {
  if (item.usage?.includes('食後')) return '食後';
  if (item.usage?.includes('食前')) return '食前';
  if (item.type === 'prescription') return '朝昼夕';
  return '';
}
