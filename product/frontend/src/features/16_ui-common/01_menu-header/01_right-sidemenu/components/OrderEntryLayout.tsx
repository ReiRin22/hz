// [SCOPE-OUT: ETC005] 関連機能追加時にコメントアウトを解除する
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';

export function OrderEntryLayout() {
  const [activeTab, setActiveTab] = useState('drug');

  const tabs = [
    { id: 'drug', label: '薬剤' },
    { id: 'history', label: '履歴' },
    { id: 'set', label: 'セット' },
    { id: 'frequent', label: '頻用' },
    { id: 'efficacy', label: '薬効' },
  ];

  const drugCategories = [
    '降圧薬',
    '抗血栓薬',
    '糖尿病治療薬',
    '脂質異常症治療薬',
  ];

  const drugList = [
    { id: 1, name: 'エナラプリル錠5mg', dosage: '5mg 1日2回食後', category: '降圧薬' },
    { id: 2, name: 'カプトプリル錠25mg', dosage: '25mg 1日3回食後', category: '降圧薬' },
    { id: 3, name: 'アムロジピン錠5mg', dosage: '5mg 1日1回朝食後', category: '降圧薬' },
    { id: 4, name: 'セフゾン錠100mg', dosage: '100mg 1日3回食後', category: '降圧薬' },
    { id: 5, name: 'ニフェジピン錠10mg', dosage: '10mg 1日2回食後', category: '降圧薬' },
    { id: 6, name: 'ヒドロクロロチアジド錠25mg', dosage: '25mg 1日1回朝食後', category: '降圧薬' },
    { id: 7, name: 'ロサルタン錠50mg', dosage: '50mg 1日1回朝食後', category: '降圧薬' },
    { id: 8, name: 'クロキサゾラム錠100mg', dosage: '100mg 1日3回食後', category: '降圧薬' },
    { id: 9, name: 'ワルファリン錠5mg', dosage: '5mg 1日1回夕食後', category: '抗血栓薬' },
    { id: 10, name: 'クロピドグレル錠75mg', dosage: '75mg 1日1回朝食後', category: '抗血栓薬' },
    { id: 11, name: 'シロスタゾール錠200mg', dosage: '200mg 1日2回朝夕食後', category: '外抗血栓薬' },
  ];

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      {/* 左ペイン (300px) */}
      <div className="w-[300px] border-r border-border bg-background flex flex-col">
        {/* タブリスト */}
        <div className="p-[14px] pb-[10.5px]">
          <div className="bg-[#ececf0] rounded-[12.75px] p-[3.5px] grid grid-cols-5 gap-[3px]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  rounded-[12.75px] px-2 py-[4.5px] text-[10.5px] leading-[14px]
                  transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-white text-neutral-950' 
                    : 'text-neutral-950 hover:bg-white/50'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 検索エリア */}
        <div className="px-[14px] pb-[10.5px] space-y-[10.5px]">
          <h3 className="text-[14px] leading-[21px]">薬剤検索</h3>
          <div className="relative">
            <Search className="absolute left-[10.5px] top-[8.75px] w-[14px] h-[14px] text-[#717182]" />
            <Input 
              placeholder="薬剤名を入力（3文字以上）"
              className="pl-[35px] bg-[#f3f3f5] border-0 h-[31.5px] text-[12.25px] rounded-[6.75px]"
            />
          </div>
        </div>

        {/* 薬剤一覧 */}
        <div className="px-[14px] pb-[7px]">
          <h4 className="text-[12.25px] leading-[17.5px] mb-[7px]">薬剤一覧</h4>
        </div>

        {/* スクロール可能なリスト */}
        <div className="flex-1 overflow-y-auto">
          {drugCategories.map((category) => (
            <div key={category}>
              <div className="bg-[rgba(236,236,240,0.3)] border-b border-[rgba(0,0,0,0.1)] px-[10.5px] py-[10.5px]">
                <h5 className="text-[12.25px] leading-[17.5px]">{category}</h5>
              </div>
              {drugList
                .filter(drug => drug.category === category)
                .map((drug) => (
                  <button
                    key={drug.id}
                    className="w-full border-b border-[rgba(0,0,0,0.1)] px-[10.5px] py-[10.5px] hover:bg-muted/50 text-left transition-colors"
                  >
                    <div className="grid grid-cols-[1fr_auto] gap-2 items-start mb-1">
                      <div className="text-[10.5px] leading-[14px]">{drug.name}</div>
                      <button className="text-[10.5px] text-primary hover:underline">
                        詳細
                      </button>
                    </div>
                    <div className="text-[10.5px] leading-[14px] text-[#717182]">
                      {drug.dosage}
                    </div>
                  </button>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* 中央ペイン (450px) */}
      <div className="w-[450px] border-r border-border bg-background flex flex-col">
        <div className="border-b border-[rgba(0,0,0,0.1)] px-[14px] pt-[14px] pb-[7px]">
          <h2 className="text-[14px] leading-[21px] mb-[3.5px]">候補一覧</h2>
          <p className="text-[12.25px] leading-[17.5px] text-[#717182]">
            左ペインから薬剤やセットを選択してください
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#717182] text-sm">候補がありません</p>
        </div>
      </div>

      {/* 右ペイン (500px) */}
      <div className="flex-1 bg-background flex flex-col">
        <div className="border-b border-[rgba(0,0,0,0.1)] px-[14px] pt-[14px] pb-[7px]">
          <div className="flex items-center justify-between mb-[3.5px]">
            <h2 className="text-[14px] leading-[21px]">選択済みオーダーリスト</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                一時保存
              </Button>
              <Button size="sm" className="h-7 text-xs">
                オーダー確定
              </Button>
            </div>
          </div>
          <p className="text-[12.25px] leading-[17.5px] text-[#717182]">
            全種類のオーダーを表示 (0件)
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-[#717182] mb-2">オーダーがありません</p>
          <p className="text-[#717182] text-sm">
            左ペインから薬剤・検体検査を選択し、オーダーを追加
          </p>
        </div>
      </div>
    </div>
  );
}
