import { useState } from 'react';
import { ChevronRight, ChevronLeft, X, ChevronDown, Check, ArrowLeft, Plus } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/components/atoms/tooltip';

interface MemoData {
  id: string;
  title: string;
  content: string;
  to: string;
  from: string;
  datetime: string;
}

export function LeftSideMenu() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showBulletinDialog, setShowBulletinDialog] = useState(false);
  const [showMemoDialog, setShowMemoDialog] = useState(false);
  const [isCreatingMemo, setIsCreatingMemo] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [confirmedMemos, setConfirmedMemos] = useState<{ [key: string]: boolean }>({});
  const [memoTab, setMemoTab] = useState<'received' | 'sent'>('received');
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null);

  const departments = [
    '看護部',
    '臨床検査科',
    '放射線科',
    '内視鏡検査科',
    '栄養指示科',
    '薬剤部',
    '事務',
    'リハビリテーション科'
  ];

  const receivedMemos: MemoData[] = [
    {
      id: 'memo1',
      title: '看護部：患者ID12345 採血追加依頼い',
      content: '患者ID12345の山田太郎様について、追加で肝機能検査の採血をお願いいたします。',
      to: '看護部',
      from: '看護部',
      datetime: '2025/10/27 11:40'
    },
    {
      id: 'memo2',
      title: '回診時刻の変更について',
      content: '本日午後の回診時刻について、15:00から16:00への変更をお願いできますでしょうか。',
      to: '外科、臨床検査科',
      from: '看護部',
      datetime: '2024/12/23 09:15'
    },
    {
      id: 'memo3',
      title: '抗生剤処方量の確認',
      content: '抗生剤の処方量について確認したい件があります。お時間のある時にご連絡ください。',
      to: '薬剤部',
      from: '薬剤部',
      datetime: '2024/12/22 16:45'
    },
    {
      id: 'memo4',
      title: '予約患者からの問い合わせ対応完了',
      content: '明日の予約患者様から問い合わせがありました。既に折り返し対応済みです。',
      to: '事務',
      from: '事務',
      datetime: '2024/12/22 14:20'
    },
    {
      id: 'memo5',
      title: '栄養指導の実施報告',
      content: '患者様への栄養指導を実施しました。詳細は電子カルテに記載済みです。',
      to: '栄養指示科、看護部',
      from: '栄養指示科',
      datetime: '2024/12/21 11:00'
    },
    {
      id: 'memo6',
      title: 'CT読影結果の確認依頼',
      content: 'CTスキャンの読影結果について、診断内容の確認をお願いします。',
      to: '放射線科',
      from: '放射線科',
      datetime: '2024/12/21 08:30'
    }
  ];

  const sentMemos: MemoData[] = [
    {
      id: 'sent1',
      title: 'カンファレンス日程調整のお願い',
      content: '来週のカンファレンスの日程について、12月27日（水）15:00～で調整をお願いします。',
      to: '内視鏡検査科、外科',
      from: '医師',
      datetime: '2024/12/23 14:00'
    },
    {
      id: 'sent2',
      title: 'MRI検査の追加オーダーについて',
      content: '患者ID 67890のMRI検査を追加でオーダーしました。可能であれば本日中に撮影をお願いします。',
      to: '放射線科',
      from: '医師',
      datetime: '2024/12/23 11:20'
    },
    {
      id: 'sent3',
      title: '薬剤変更の連絡',
      content: '患者の状態変化により、処方内容を変更しました。新しい処方箋を送付いたします。',
      to: '薬剤部、看護部',
      from: '医師',
      datetime: '2024/12/22 17:30'
    },
    {
      id: 'sent4',
      title: '退院サマリーの提出について',
      content: '先週退院された患者様の退院サマリーを作成しました。ご確認ください。',
      to: '事務',
      from: '医師',
      datetime: '2024/12/21 16:00'
    },
    {
      id: 'sent5',
      title: 'リハビリ開始指示',
      content: '術後患者のリハビリを開始してください。歩行訓練から段階的に進めていきます。',
      to: 'リハビリテーション科',
      from: '医師',
      datetime: '2024/12/20 13:45'
    },
    {
      id: 'sent6',
      title: '特別食の対応依頼',
      content: '患者様のアレルギー情報を考慮した特別食の提供をお願いします。詳細は電子カルテをご確認ください。',
      to: '栄養指示科',
      from: '医師',
      datetime: '2024/12/19 10:00'
    }
  ];

  const toggleDepartment = (dept: string) => {
    if (selectedDepartments.includes(dept)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
    } else {
      setSelectedDepartments([...selectedDepartments, dept]);
    }
  };

  const confirmMemo = (key: string) => {
    setConfirmedMemos(prev => ({
      ...prev,
      [key]: true
    }));
    setSelectedMemoId(null);
  };

  const getSelectedMemo = (): MemoData | null => {
    if (!selectedMemoId) return null;
    const allMemos = memoTab === 'received' ? receivedMemos : sentMemos;
    return allMemos.find(m => m.id === selectedMemoId) || null;
  };

  const selectedMemo = getSelectedMemo();

  return (
    <div 
      className={`bg-neutral-50 border-r border-neutral-200 h-screen flex flex-col transition-all duration-300 relative ${
        isCollapsed ? 'w-[52px]' : 'w-[87.5px]'
      }`}
    >
      {/* メニュー項目のコンテナ */}
      <div>
      {/* 折りたたみボタン */}
      <Tooltip open={isCollapsed ? undefined : false}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex flex-col items-center gap-[3.5px] mb-[3.5px] px-[7px] pt-[14px] pb-0 transition-colors text-neutral-950 hover:bg-neutral-100"
            style={{ height: '51.625px' }}
          >
            <div className="h-[21px] w-full flex items-center justify-center">
              {isCollapsed ? (
                <ChevronLeft className="w-[21px] h-[21px]" />
              ) : (
                <ChevronRight className="w-[21px] h-[21px]" />
              )}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isCollapsed ? '展開' : '折りたたむ'}
        </TooltipContent>
      </Tooltip>

      {/* 病棟マップ */}
      <Tooltip open={isCollapsed ? undefined : false}>
        <TooltipTrigger asChild>
          <button className="w-full flex flex-col items-center gap-[3.5px] mb-[3.5px] px-[7px] pt-[7px] pb-0 transition-colors text-neutral-950 hover:bg-neutral-100" style={{ height: '51.625px' }}>
            <div className="h-[21px] w-full flex items-center justify-center">
              <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path d="M3 6h3a2 2 0 012 2v10a2 2 0 01-2 2H3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 6h-3a2 2 0 00-2 2v10a2 2 0 002 2h3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="10" y1="10" x2="10" y2="10.01" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="14" y1="10" x2="14" y2="10.01" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="10" y1="14" x2="10" y2="14.01" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="14" y1="14" x2="14" y2="14.01" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`h-[13.125px] w-full flex items-center justify-center ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <span className="text-[10.5px] leading-[13.125px]">病棟マップ</span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          病棟マップ
        </TooltipContent>
      </Tooltip>

      {/* 受付一覧 */}
      <Tooltip open={isCollapsed ? undefined : false}>
        <TooltipTrigger asChild>
          <button className="w-full flex flex-col items-center gap-[3.5px] mb-[3.5px] px-[7px] pt-[7px] pb-0 transition-colors text-neutral-950 hover:bg-neutral-100" style={{ height: '51.625px' }}>
            <div className="h-[21px] w-full flex items-center justify-center">
              <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="12" x2="15" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="16" x2="15" y2="16" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="20" x2="15" y2="20" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`h-[13.125px] w-full flex items-center justify-center ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <span className="text-[10.5px] leading-[13.125px]">受診者一覧</span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          受診者一覧
        </TooltipContent>
      </Tooltip>

      {/* 院内掲示板 */}
      <Tooltip open={isCollapsed ? undefined : false}>
        <TooltipTrigger asChild>
          <button 
            onClick={() => setShowBulletinDialog(true)}
            className="w-full flex flex-col items-center gap-[3.5px] mb-[3.5px] px-[7px] pt-[7px] pb-0 transition-colors text-neutral-950 hover:bg-neutral-100" 
            style={{ height: '51.625px' }}
          >
            <div className="h-[21px] w-full flex items-center justify-center">
              <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="10" x2="15" y2="10" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="14" x2="13" y2="14" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`h-[13.125px] w-full flex items-center justify-center ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <span className="text-[10.5px] leading-[13.125px]">院内掲示板</span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          院内掲示板
        </TooltipContent>
      </Tooltip>

      {/* 付箋 */}
      <Tooltip open={isCollapsed ? undefined : false}>
        <TooltipTrigger asChild>
          <button 
            onClick={() => setShowMemoDialog(true)}
            className="w-full flex flex-col items-center gap-[3.5px] mb-[3.5px] px-[7px] pt-[7px] pb-0 transition-colors text-neutral-950 hover:bg-neutral-100" 
            style={{ height: '51.625px' }}
          >
            <div className="h-[21px] w-full flex items-center justify-center">
              <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="9" y="1" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="12" x2="15" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="16" x2="15" y2="16" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`h-[13.125px] w-full flex items-center justify-center ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <span className="text-[10.5px] leading-[13.125px]">伝言メモ</span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          伝言メモ
        </TooltipContent>
      </Tooltip>

      {/* システム設定 */}
      <Tooltip open={isCollapsed ? undefined : false}>
        <TooltipTrigger asChild>
          <button className="w-full flex flex-col items-center gap-[3.5px] mb-[3.5px] px-[7px] pt-[7px] pb-0 transition-colors text-neutral-950 hover:bg-neutral-100" style={{ height: '51.625px' }}>
            <div className="h-[21px] w-full flex items-center justify-center">
              <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 1v6m0 6v6m8.66-13.66l-4.24 4.24m-4.84 4.84l-4.24 4.24M23 12h-6m-6 0H1m18.66 8.66l-4.24-4.24m-4.84-4.84l-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`h-[13.125px] w-full flex items-center justify-center ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <span className="text-[10.5px] leading-[13.125px]">システム設定</span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          システム設定
        </TooltipContent>
      </Tooltip>
      </div>

      {/* 院内掲示板ダイアログ */}
      {showBulletinDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBulletinDialog(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="text-lg">院内掲示板</h2>
              <button
                onClick={() => setShowBulletinDialog(false)}
                className="px-6 py-2 bg-white text-neutral-900 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
              >
                閉じる
              </button>
            </div>
            
            {/* コンテンツ */}
            <div className="p-6">
              <div className="space-y-4">
                {/* 掲示項目1 */}
                <div className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">重要</span>
                      <span className="text-sm text-neutral-500">2024/12/20</span>
                    </div>
                  </div>
                  <h3 className="mb-2">年末年始の診療体制について</h3>
                  <p className="text-sm text-neutral-600">12月29日（金）～1月3日（水）は休診となります。救急外来は24時間対応いたします。</p>
                  <div className="mt-2 text-xs text-neutral-500">投稿者: 事務局</div>
                </div>

                {/* 掲示項目2 */}
                <div className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">お知らせ</span>
                      <span className="text-sm text-neutral-500">2024/12/18</span>
                    </div>
                  </div>
                  <h3 className="mb-2">電子カルテシステムメンテナンスのお知らせ</h3>
                  <p className="text-sm text-neutral-600">12月25日（月）22:00～24:00の間、システムメンテナンスを実施いたします。この間、電子カルテへのアクセスが一時的に制限されます。</p>
                  <div className="mt-2 text-xs text-neutral-500">投稿者: 情報システム部</div>
                </div>

                {/* 掲示項目3 */}
                <div className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">研修</span>
                      <span className="text-sm text-neutral-500">2024/12/15</span>
                    </div>
                  </div>
                  <h3 className="mb-2">感染対策研修会の開催について</h3>
                  <p className="text-sm text-neutral-600">1月10（水）15:00より、第3会議室にて感染対策研修会を開催します。全職員の参加をお願いいたします。</p>
                  <div className="mt-2 text-xs text-neutral-500">投稿者: 感染管理室</div>
                </div>

                {/* 掲示項目4 */}
                <div className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">連絡</span>
                      <span className="text-sm text-neutral-500">2024/12/12</span>
                    </div>
                  </div>
                  <h3 className="mb-2">薬剤在庫の確認について</h3>
                  <p className="text-sm text-neutral-600">年末に向けて、各部署の薬剤在庫の確認をお願いいたします。不足分は12月22日までに薬剤部へご連絡ください。</p>
                  <div className="mt-2 text-xs text-neutral-500">投稿者: 薬剤部</div>
                </div>

                {/* 掲示項目5 */}
                <div className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">イベント</span>
                      <span className="text-sm text-neutral-500">2024/12/10</span>
                    </div>
                  </div>
                  <h3 className="mb-2">クリスマスイベントのご案内</h3>
                  <p className="text-sm text-neutral-600">12月24日（日）14:00より、小児病棟にてクリスマスイベントを開催いたします。ボランティアスタッフも募集中です。</p>
                  <div className="mt-2 text-xs text-neutral-500">投稿者: 地域連携室</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 伝言メモダイアログ */}
      {showMemoDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowMemoDialog(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 flex-shrink-0">
              {selectedMemoId ? (
                <>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedMemoId(null)}
                      className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm">戻る</span>
                    </button>
                    <h2 className="text-lg">伝言詳細</h2>
                  </div>
                </>
              ) : isCreatingMemo ? (
                <>
                  <h2 className="text-lg">新規伝言メモ作成</h2>
                  <button
                    onClick={() => setIsCreatingMemo(false)}
                    className="px-6 py-2 bg-white text-neutral-900 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
                  >
                    一覧に戻る
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-lg">伝言メモ</h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsCreatingMemo(true)}
                      className="px-6 py-2 bg-white text-neutral-900 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      追加
                    </button>
                    <button
                      onClick={() => setShowMemoDialog(false)}
                      className="px-6 py-2 bg-white text-neutral-900 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
                    >
                      閉じる
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* コンテンツ */}
            <div className="p-6 overflow-y-auto flex-1">
              {selectedMemoId && selectedMemo ? (
                // 詳細表示
                <div className="space-y-6">
                  {/* タイトル */}
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">タイトル</div>
                    <div className="text-base">{selectedMemo.title}</div>
                  </div>

                  {/* 内容 */}
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">内容</div>
                    <div className="text-sm text-neutral-700">{selectedMemo.content}</div>
                  </div>

                  {/* 送信者と日時 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">送信者</div>
                      <div className="text-sm">{selectedMemo.from}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">日時</div>
                      <div className="text-sm">{selectedMemo.datetime}</div>
                    </div>
                  </div>

                  {/* 確認ボタン（受信の場合のみ） */}
                  {memoTab === 'received' && (
                    <div className="pt-4 border-t border-neutral-200">
                      <button
                        onClick={() => confirmMemo(selectedMemo.id)}
                        disabled={confirmedMemos[selectedMemo.id]}
                        className={`w-full py-3 rounded transition-colors flex items-center justify-center gap-2 ${
                          confirmedMemos[selectedMemo.id]
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
              ) : isCreatingMemo ? (
                // 新規作成フォーム
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">宛先</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                      placeholder="例: 看護部"
                    />
                    
                    {/* 診療科ボタン */}
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => toggleDepartment(dept)}
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
                        <span className="text-sm text-blue-700">選択中: {selectedDepartments.join('、')}</span>
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
                      onClick={() => {
                        setIsCreatingMemo(false);
                        setSelectedDepartments([]);
                      }}
                      className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => {
                        // ここで登録処理を行う
                        setIsCreatingMemo(false);
                        setSelectedDepartments([]);
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      送信
                    </button>
                  </div>
                </div>
              ) : (
                // 一覧表示
                <>
                  {/* タブ切り替え */}
                  <div className="flex gap-2 mb-4 border-b border-neutral-200">
                    <button
                      onClick={() => setMemoTab('received')}
                      className={`px-4 py-2 text-sm transition-colors relative ${
                        memoTab === 'received'
                          ? 'text-blue-600'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      受信
                      {memoTab === 'received' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setMemoTab('sent')}
                      className={`px-4 py-2 text-sm transition-colors relative ${
                        memoTab === 'sent'
                          ? 'text-blue-600'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      送信
                      {memoTab === 'sent' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                      )}
                    </button>
                  </div>

                  {/* メモ一覧 */}
                  <div className="space-y-3">
                    {(memoTab === 'received' ? receivedMemos : sentMemos).map((memo) => (
                      <div
                        key={memo.id}
                        onClick={() => setSelectedMemoId(memo.id)}
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}