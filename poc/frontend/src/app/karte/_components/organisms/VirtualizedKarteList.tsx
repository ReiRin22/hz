"use client";

import { Virtuoso } from 'react-virtuoso';
import { KarteResponse } from '@/front_bff_shared/types/response/karte.response.type';

export default function VirtualizedKarteList({ data }: { data: KarteResponse[] }) {
  return (
    <div className="border rounded bg-white">
      <Virtuoso
        style={{ height: '500px' }}
        totalCount={data.length}
        itemContent={(index) => (
          <div className="flex items-center p-3 border-b h-[50px]">
            <span className="w-24 text-gray-400 font-mono">{data[index].id}</span>
            <span className="flex-1 truncate">{data[index].name}</span>
            <span className="flex-1 truncate">{data[index].description}</span>
            <button 
              onClick={() => alert(data[index].id)} // Client操作
              className="karte-button"
            >
              詳細
            </button>
          </div>
        )}
      />
    </div>
  );
}