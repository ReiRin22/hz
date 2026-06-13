/**
 * オーダー表示に関するヘルパー関数
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/utils/orderDisplayHelpers.ts
 *
 * TODO: getOrderTypeBadgeColor の戻り値は Tailwind 文字列。
 *       globals.css の @layer components にセマンティッククラスとして移行予定。
 */

/**
 * オーダー種別のバッジカラーを取得
 */
export function getOrderTypeBadgeColor(orderType: string): string {
  switch (orderType) {
    case 'prescription': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'injection': return 'bg-green-100 text-green-800 border-green-200';
    case 'lab': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'imaging': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * オーダー種別のラベルを取得
 */
export function getOrderTypeLabel(orderType: string): string {
  switch (orderType) {
    case 'prescription': return '処方';
    case 'injection': return '注射';
    case 'lab': return '検体';
    case 'imaging': return '画像';
    default: return '';
  }
}

/**
 * グループタイプのバッジ情報を取得
 * カテゴリグループ（検体検査・画像検査）の場合は null を返す
 */
export function getGroupTypeBadgeInfo(
  groupType?: string,
  groupId?: string
): { label: string } | null {
  if (groupId?.startsWith('lab-category-') || groupId?.startsWith('imaging-modality-')) {
    return null;
  }

  switch (groupType) {
    case 'set':
      return { label: 'セット' };
    case 'history':
      return { label: '履歴' };
    default:
      return null;
  }
}
