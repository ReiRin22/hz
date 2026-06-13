/**
 * オーダー表示フォーマットユーティリティ
 *
 * 参照元: 【ORD032～ORD035】src/utils/orderFormatters.ts
 */

import type { OrderDetail } from '../types/order-shared.types';

/**
 * オーダー詳細を表示用の文字列にフォーマットします
 */
export function formatOrderDisplay(order: OrderDetail): string {
  if (order.type === 'prescription') {
    return `${order.name} ${order.dosage || ''} ${order.quantity || ''} ${order.frequency || ''} ${order.timing || ''}`.trim();
  } else if (order.type === 'injection') {
    return `${order.name} ${order.dosage || ''} ${order.quantity || ''} ${order.route || ''}`.trim();
  } else if (order.type === 'lab') {
    const collectionDateStr = order.collectionDate
      ? ` - 採取日: ${new Date(order.collectionDate).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}`
      : '';
    return `${order.name}${collectionDateStr}`;
  } else if (order.type === 'imaging') {
    if (order.dateUndecided || order.preferredTime === 'unscheduled') {
      const label = ['CT検査', 'MRI検査', '超音波検査'].includes(order.modality || '')
        ? '実施予定日: 枠未取得'
        : '実施予定日: 日付未定';
      return label;
    }

    let scheduledDateStr = '';
    if (order.scheduledDate) {
      const dateStr = new Date(order.scheduledDate).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
      scheduledDateStr = order.scheduledTime
        ? `実施予定日時: ${dateStr} ${order.scheduledTime}`
        : `実施予定日: ${dateStr}`;
    }

    let contrastStr = '';
    if (order.useContrast) {
      contrastStr = ' - 造影剤: あり';
      if (order.hasAllergy) {
        contrastStr += ' (アレルギーあり)';
      }
      if (order.egfrValue) {
        contrastStr += ` eGFR:${order.egfrValue} mL/min/1.73m²`;
      }
    }

    return `${scheduledDateStr}${contrastStr}` || '';
  }
  return order.name;
}

/**
 * オーダータイプに対応する色クラスを取得します
 * TODO: globals.css の @layer components にセマンティッククラスとして移行予定
 */
export function getTypeColor(type?: string): string {
  switch (type) {
    case 'prescription': return 'bg-blue-100 text-blue-800';
    case 'injection': return 'bg-green-100 text-green-800';
    case 'lab': return 'bg-purple-100 text-purple-800';
    case 'imaging': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * オーダータイプに対応する日本語ラベルを取得します
 */
export function getTypeLabel(type?: string): string {
  switch (type) {
    case 'prescription': return '処方';
    case 'injection': return '注射';
    case 'lab': return '検体';
    case 'imaging': return '画像';
    default: return '';
  }
}
