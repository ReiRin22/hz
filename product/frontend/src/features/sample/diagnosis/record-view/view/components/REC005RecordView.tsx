// src/features/diagnosis/record-view/view/components/REC005RecordView.tsx
import React from 'react';

async function getSlowRecordData() {
  // 検証用に10秒の遅延を追加
  await new Promise((resolve) => setTimeout(resolve, 10000));
  
  return {
    date: "2026/03/18",
    doctor: "山田 医師",
    note: "本日は定期健診。血圧安定しており、継続処方とする。"
  };
}

// コンポーネント自体を async にします
export const REC005RecordView = async () => {
  const data = await getSlowRecordData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border min-h-full w-full break-words">
      <div className="flex items-center space-x-2 mb-6">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">REC005</span>
        <h2 className="text-xl font-bold text-slate-800">診療情報参照 (本日の診療記録)</h2>
      </div>
      <div className="grid gap-6">
        <section className="border-t pt-4">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>診療日: {data.date}</span>
            <span>担当医: {data.doctor}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded border text-slate-700 min-h-[150px]">
            {data.note}
          </div>
        </section>
      </div>
    </div>
  );
};