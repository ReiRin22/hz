'use client';

import { useKarte } from '@/app/karte/_api/karte.api'; 
import VirtualizedKarteList from '@/app/karte/_components/organisms/VirtualizedKarteList';
import { useStore } from '@shared/stores/use.store'; // Zustandをインポート
import Link from 'next/link';

export default function KartePage() {
  const { data, isLoading } = useKarte();
  const { selectedKarteId, setSelectedKarteId } = useStore(); // Zustandから呼び出し

  if (isLoading) return <div className="p-8">読み込み中...</div>;

  return (
    <div className="p-8">
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <p>現在Zustandに保存されているID: <strong>{selectedKarteId || '未選択'}</strong></p>
        {/* 修正箇所：href を selectedKarteId に連動させる */}

          <Link href={`/zustand-test`} className="text-blue-600 underline text-sm block mt-2">
            → 詳細ページ(/user/{selectedKarteId})へ移動して確認
          </Link>

      </div>

      <h1 className="text-2xl font-bold mb-4">カルテ履歴検証</h1>
      
      {/* ボタン押下でZustandのステートを更新 */}
      <button 
        onClick={() => setSelectedKarteId('999')} // ID: 999を選択したと仮定
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        ID: 999 を選択（Zustandへ保存）
      </button>

      <button 
        onClick={() => setSelectedKarteId(null)} 
        className="bg-gray-500 text-white px-4 py-2 rounded"
       >
        選択解除（リセット）
       </button>

      <div className="border rounded shadow-lg">
        {data && <VirtualizedKarteList data={data} />}
      </div>
    </div>
  );
}