'use client';

import type { BulletinBoardItem } from '../../types/right-side-menu.type';

interface BulletinBoardDialogProps {
  onClose: () => void;
}

const TAG_COLORS: Record<BulletinBoardItem['tagColor'], string> = {
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  purple: 'bg-purple-100 text-purple-700',
};

const MOCK_ITEMS: BulletinBoardItem[] = [
  {
    id: 'b1',
    tag: '重要',
    tagColor: 'red',
    date: '2024/12/20',
    title: '年末年始の診療体制について',
    content:
      '12月29日（金）～1月3日（水）は休診となります。救急外来は24時間対応いたします。',
    author: '事務局',
  },
  {
    id: 'b2',
    tag: 'お知らせ',
    tagColor: 'blue',
    date: '2024/12/18',
    title: '電子カルテシステムメンテナンスのお知らせ',
    content:
      '12月25日（月）22:00～24:00の間、システムメンテナンスを実施いたします。この間、電子カルテへのアクセスが一時的に制限されます。',
    author: '情報システム部',
  },
  {
    id: 'b3',
    tag: '研修',
    tagColor: 'green',
    date: '2024/12/15',
    title: '感染対策研修会の開催について',
    content:
      '1月10（水）15:00より、第3会議室にて感染対策研修会を開催します。全職員の参加をお願いいたします。',
    author: '感染管理室',
  },
  {
    id: 'b4',
    tag: '連絡',
    tagColor: 'yellow',
    date: '2024/12/12',
    title: '薬剤在庫の確認について',
    content:
      '年末に向けて、各部署の薬剤在庫の確認をお願いいたします。不足分は12月22日までに薬剤部へご連絡ください。',
    author: '薬剤部',
  },
  {
    id: 'b5',
    tag: 'イベント',
    tagColor: 'purple',
    date: '2024/12/10',
    title: 'クリスマスイベントのご案内',
    content:
      '12月24日（日）14:00より、小児病棟にてクリスマスイベントを開催いたします。ボランティアスタッフも募集中です。',
    author: '地域連携室',
  },
];

export function BulletinBoardDialog({ onClose }: BulletinBoardDialogProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg">院内掲示板</h2>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white text-neutral-900 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
          >
            閉じる
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {MOCK_ITEMS.map((item) => (
              <div
                key={item.id}
                className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded ${TAG_COLORS[item.tagColor]}`}>
                      {item.tag}
                    </span>
                    <span className="text-sm text-neutral-500">{item.date}</span>
                  </div>
                </div>
                <h3 className="mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600">{item.content}</p>
                <div className="mt-2 text-xs text-neutral-500">投稿者: {item.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
