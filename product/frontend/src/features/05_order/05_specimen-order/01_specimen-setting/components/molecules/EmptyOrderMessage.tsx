'use client';

/**
 * 空のオーダーメッセージ
 * molecules: オーダーが0件のときの表示
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/molecules/EmptyOrderMessage.tsx
 */

export function EmptyOrderMessage() {
  return (
    <div className="p-8 text-center text-muted-foreground">
      <div className="text-lg mb-2">オーダーがありません</div>
      <div className="text-sm">左パネルから薬剤・検査項目を選択してオーダーを追加</div>
    </div>
  );
}
