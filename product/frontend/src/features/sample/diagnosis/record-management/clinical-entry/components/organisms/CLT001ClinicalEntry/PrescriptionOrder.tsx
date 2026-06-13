// src/features/diagnosis/record-management/clinical-entry/components/organisms/PrescriptionOrder.tsx
'use client';

import React, { useState } from 'react';

interface PrescriptionOrderProps {
  initialOrders?: string[];
}

export const PrescriptionOrder: React.FC<PrescriptionOrderProps> = ({
  initialOrders = [],
}) => {
  const [orders, setOrders] = useState(initialOrders);

  return (
    <div className="p-4 border rounded bg-slate-50">
      <span className="text-sm font-bold block mb-3 border-b pb-1">処方・オーダー</span>
      <div className="space-y-2">
        {orders.length > 0 && (
          <ul className="space-y-2">
            {orders.map((order, index) => (
              <li key={index} className="text-xs text-slate-700 bg-white p-2 rounded border">
                {order}
              </li>
            ))}
          </ul>
        )}
        <div className="p-2 flex items-center justify-center border-dashed border-2 border-slate-300 rounded text-slate-400 text-xs hover:bg-slate-100 cursor-pointer transition-colors">
          ＋ セット登録から選択
        </div>
      </div>
    </div>
  );
};
