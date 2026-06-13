'use client';

import { ArrowLeft, Check, Plus } from 'lucide-react';
import { useRightSideMenuStore } from '../../stores/use-right-side-menu.store';
import type { MemoData } from '../../types/right-side-menu.type';

interface MemoDialogProps {
  onClose: () => void;
}

const DEPARTMENTS = [
  '看護部',
  '臨床検査科',
  '放射線科',
  '内視鏡検査科',
  '栄養指示科',
  '薬剤部',
  '事務',
  'リハビリテーション科',
];

// TODO: 将来 BFF GET /api/v1/memos から取得する
const RECEIVED_MEMOS: MemoData[] = [
  {
    id: 'memo1',
    title: '看護部：患者ID12345 採血追加依頼い',
    content: '患者ID12345の山田太郎様について、追加で肝機能検査の採血をお願いいたします。',
    to: '看護部',
    from: '看護部',
    datetime: '2025/10/27 11:40',
  },
  {
    id: 'memo2',
    title: '回診時刻の変更について',
    content: '本日午後の回診時刻について、15:00から16:00への変更をお願いできますでしょうか。',
    to: '外科、臨床検査科',
    from: '看護部',
    datetime: '2024/12/23 09:15',
  },
  {
    id: 'memo3',
    title: '抗生剤処方量の確認',
    content: '抗生剤の処方量について確認したい件があります。お時間のある時にご連絡ください。',
    to: '薬剤部',
    from: '薬剤部',
    datetime: '2024/12/22 16:45',
  },
  {
    id: 'memo4',
    title: '予約患者からの問い合わせ対応完了',
    content: '明日の予約患者様から問い合わせがありました。既に折り返し対応済みです。',
    to: '事務',
    from: '事務',
    datetime: '2024/12/22 14:20',
  },
  {
    id: 'memo5',
    title: '栄養指導の実施報告',
    content: '患者様への栄養指導を実施しました。詳細は電子カルテに記載済みです。',
    to: '栄養指示科、看護部',
    from: '栄養指示科',
    datetime: '2024/12/21 11:00',
  },
  {
    id: 'memo6',
    title: 'CT読影結果の確認依頼',
    content: 'CTスキャンの読影結果について、診断内容の確認をお願いします。',
    to: '放射線科',
    from: '放射線科',
    datetime: '2024/12/21 08:30',
  },
];

const SENT_MEMOS: MemoData[] = [
  {
    id: 'sent1',
    title: 'カンファレンス日程調整のお願い',
    content:
      '来週のカンファレンスの日程について、12月27日（水）15:00～で調整をお願いします。',
    to: '内視鏡検査科、外科',
    from: '医師',
    datetime: '2024/12/23 14:00',
  },
  {
    id: 'sent2',
    title: 'MRI検査の追加オーダーについて',
    content:
      '患者ID 67890のMRI検査を追加でオーダーしました。可能であれば本日中に撮影をお願いします。',
    to: '放射線科',
    from: '医師',
    datetime: '2024/12/23 11:20',
  },
  {
    id: 'sent3',
    title: '薬剤変更の連絡',
    content: '患者の状態変化により、処方内容を変更しました。新しい処方箋を送付いたします。',
    to: '薬剤部、看護部',
    from: '医師',
    datetime: '2024/12/22 17:30',
  },
  {
    id: 'sent4',
    title: '退院サマリーの提出について',
    content: '先週退院された患者様の退院サマリーを作成しました。ご確認ください。',
    to: '事務',
    from: '医師',
    datetime: '2024/12/21 16:00',
  },
  {
    id: 'sent5',
    title: 'リハビリ開始指示',
    content: '術後患者のリハビリを開始してください。歩行訓練から段階的に進めていきます。',
    to: 'リハビリテーション科',
    from: '医師',
    datetime: '2024/12/20 13:45',
  },
  {
    id: 'sent6',
    title: '特別食の対応依頼',
    content:
      '患者様のアレルギー情報を考慮した特別食の提供をお願いします。詳細は電子カルテをご確認ください。',
    to: '栄養指示科',
    from: '医師',
    datetime: '2024/12/19 10:00',
  },
];

export function MemoDialog({ onClose }: MemoDialogProps) {
  const {
    memoTab,
    selectedMemoId,
    isCreatingMemo,
    selectedDepartments,
    confirmedMemos,
    setMemoTab,
    selectMemo,
    clearSelectedMemo,
    startCreatingMemo,
    cancelCreatingMemo,
    toggleDepartment,
    clearDepartments,
    confirmMemo,
  } = useRightSideMenuStore();

  const allMemos = memoTab === 'received' ? RECEIVED_MEMOS : SENT_MEMOS;
  const selectedMemo = selectedMemoId ? allMemos.find((m) => m.id === selectedMemoId) ?? null : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <MemoDialogHeader
          selectedMemoId={selectedMemoId}
          isCreatingMemo={isCreatingMemo}
          onBack={clearSelectedMemo}
          onStartCreating={startCreatingMemo}
          onCancelCreating={cancelCreatingMemo}
          onClose={onClose}
        />
        <div className="p-6 overflow-y-auto flex-1">
          {selectedMemoId && selectedMemo ? (
            <MemoDetail
              memo={selectedMemo}
              memoTab={memoTab}
              confirmedMemos={confirmedMemos}
              onConfirm={confirmMemo}
            />
          ) : isCreatingMemo ? (
            <MemoCreateForm
              selectedDepartments={selectedDepartments}
              onToggleDepartment={toggleDepartment}
              onCancel={() => {
                cancelCreatingMemo();
                clearDepartments();
              }}
              onSubmit={() => {
                cancelCreatingMemo();
                clearDepartments();
              }}
            />
          ) : (
            <MemoList
              memoTab={memoTab}
              memos={allMemos}
              confirmedMemos={confirmedMemos}
              onSelectTab={setMemoTab}
              onSelectMemo={selectMemo}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function MemoDialogHeader({
  selectedMemoId,
  isCreatingMemo,
  onBack,
  onStartCreating,
  onCancelCreating,
  onClose,
}: {
  selectedMemoId: string | null;
  isCreatingMemo: boolean;
  onBack: () => void;
  onStartCreating: () => void;
  onCancelCreating: () => void;
  onClose: () => void;
}) {
  if (selectedMemoId) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">戻る</span>
          </button>
          <h2 className="text-lg">伝言詳細</h2>
        </div>
      </div>
    );
  }
  if (isCreatingMemo) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 flex-shrink-0">
        <h2 className="text-lg">新規伝言メモ作成</h2>
        <button
          onClick={onCancelCreating}
          className="px-6 py-2 bg-white text-neutral-900 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
        >
          一覧に戻る
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between p-4 border-b border-neutral-200 flex-shrink-0">
      <h2 className="text-lg">伝言メモ</h2>
      <div className="flex items-center gap-3">
        <button
          onClick={onStartCreating}
          className="px-6 py-2 bg-white text-neutral-900 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          追加
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-white text-neutral-900 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}

function MemoList({
  memoTab,
  memos,
  confirmedMemos,
  onSelectTab,
  onSelectMemo,
}: {
  memoTab: 'received' | 'sent';
  memos: MemoData[];
  confirmedMemos: Record<string, boolean>;
  onSelectTab: (tab: 'received' | 'sent') => void;
  onSelectMemo: (id: string) => void;
}) {
  return (
    <>
      <div className="flex gap-2 mb-4 border-b border-neutral-200">
        {(['received', 'sent'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`px-4 py-2 text-sm transition-colors relative ${
              memoTab === tab
                ? 'text-blue-600'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {tab === 'received' ? '受信' : '送信'}
            {memoTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {memos.map((memo) => (
          <div
            key={memo.id}
            onClick={() => onSelectMemo(memo.id)}
            className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-1">
                {memoTab === 'received' && confirmedMemos[memo.id] && (
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                )}
                <h3 className="text-sm flex-1">{memo.title}</h3>
              </div>
              <span className="text-xs text-neutral-500 ml-2 flex-shrink-0">{memo.datetime}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function MemoDetail({
  memo,
  memoTab,
  confirmedMemos,
  onConfirm,
}: {
  memo: MemoData;
  memoTab: 'received' | 'sent';
  confirmedMemos: Record<string, boolean>;
  onConfirm: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-neutral-500 mb-1">タイトル</div>
        <div className="text-base">{memo.title}</div>
      </div>
      <div>
        <div className="text-xs text-neutral-500 mb-1">内容</div>
        <div className="text-sm text-neutral-700">{memo.content}</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-neutral-500 mb-1">送信者</div>
          <div className="text-sm">{memo.from}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500 mb-1">日時</div>
          <div className="text-sm">{memo.datetime}</div>
        </div>
      </div>
      {memoTab === 'received' && (
        <div className="pt-4 border-t border-neutral-200">
          <button
            onClick={() => onConfirm(memo.id)}
            disabled={confirmedMemos[memo.id]}
            className={`w-full py-3 rounded transition-colors flex items-center justify-center gap-2 ${
              confirmedMemos[memo.id]
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Check className="w-4 h-4" />
            確認
          </button>
        </div>
      )}
    </div>
  );
}

function MemoCreateForm({
  selectedDepartments,
  onToggleDepartment,
  onCancel,
  onSubmit,
}: {
  selectedDepartments: string[];
  onToggleDepartment: (dept: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-2">宛先</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          placeholder="例: 看護部"
        />
        <div className="flex flex-wrap gap-2">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => onToggleDepartment(dept)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                selectedDepartments.includes(dept)
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
        {selectedDepartments.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
            <span className="text-sm text-blue-700">
              選択中: {selectedDepartments.join('、')}
            </span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm mb-2">タイトル</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: 患者検査結果の確認依頼"
        />
      </div>
      <div>
        <label className="block text-sm mb-2">メモ内容</label>
        <textarea
          rows={6}
          className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="伝言内容を入力してください"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          送信
        </button>
      </div>
    </div>
  );
}
