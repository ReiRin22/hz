/**
 * 画像オーダー編集フォーム共通スタイル定数
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/styles/commonStyles.ts
 *
 * TODO: globals.css の @layer components にセマンティッククラス（imo-radio-item 等）として
 *       移行予定。現状は定数として保持する。
 */

/** ラジオボタンアイテムの共通スタイル */
export const RADIO_ITEM_CLASSES =
  'border-2 border-gray-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-50';

/** 造影剤使用時のネストされたコンテンツ領域スタイル */
export const NESTED_CONTENT_CLASSES = 'ml-6 space-y-3 border-l-2 border-blue-200 pl-3';
