import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, FileText, Calendar, User, ClipboardList, Stethoscope, TestTube, Building2, Users, Pill, Syringe, FlaskConical } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/components/atoms/tooltip';

type ViewType = 'chart' | 'order' | 'prescription' | 'injection' | 'lab' | 'treatment' | 'guidance' | 'physiology' | 'endoscopy' | 'imaging' | 'pathology' | 'bacteriology' | 'general' | 'composite' | 'meal' | 'rehabilitation' | 'transfusion' | 'surgery' | 'dialysis' | 'admission' | 'discharge' | 'transfer' | 'nursingCare' | 'results' | 'external-info' | 'consultation' | 'patient' | 'document' | 'appointment';

interface LeftSideMenuProps {
  onViewChange?: (view: ViewType) => void;
  currentView?: ViewType;
  activeOrderType?: string;
}

export function LeftSideMenu({ onViewChange, currentView = 'chart', activeOrderType = 'prescription' }: LeftSideMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showOrderSubmenu, setShowOrderSubmenu] = useState(false);

  // オーダービューの時はサブメニューを展開
  useEffect(() => {
    if (currentView === 'order' || currentView === 'prescription' || currentView === 'injection' || currentView === 'lab' ||
        currentView === 'treatment' || currentView === 'guidance' || currentView === 'physiology' ||
        currentView === 'endoscopy' || currentView === 'imaging' || currentView === 'pathology' ||
        currentView === 'bacteriology' || currentView === 'general' || currentView === 'composite' ||
        currentView === 'meal' || currentView === 'rehabilitation' || currentView === 'transfusion' ||
        currentView === 'surgery' || currentView === 'dialysis' || currentView === 'admission' ||
        currentView === 'discharge' || currentView === 'transfer' || currentView === 'nursingCare') {
      setShowOrderSubmenu(true);
    }
  }, [currentView]);

  const handleMenuClick = (view: ViewType) => {
    if (view === 'order') {
      setShowOrderSubmenu(!showOrderSubmenu);
      // オーダーメニューをクリックした時は処方を表示
      if (onViewChange) {
        onViewChange('prescription');
      }
    } else {
      if (onViewChange) {
        onViewChange(view);
      }
      // オーダー以外をクリックした時はサブメニューを閉じる
      const orderViews: ViewType[] = ['prescription', 'injection', 'lab', 'treatment', 'guidance', 'physiology', 'endoscopy', 'imaging', 'pathology', 'bacteriology', 'general', 'composite', 'meal', 'rehabilitation', 'transfusion', 'surgery', 'dialysis', 'admission', 'discharge', 'transfer', 'nursingCare'];
      if (!orderViews.includes(view)) {
        setShowOrderSubmenu(false);
      }
    }
  };

  const menuItems = [
    { id: 'chart', label: 'カルテ', icon: Stethoscope },
    {
      id: 'order',
      label: 'オーダー',
      icon: ClipboardList,
      subItems: [
        { id: 'prescription', label: '処方オーダー', icon: Pill },
        { id: 'injection', label: '注射オーダー', icon: Syringe },
        { id: 'lab', label: '検体オーダー', icon: FlaskConical },
        { id: 'treatment', label: '処置オーダー', icon: ClipboardList },
        { id: 'guidance', label: '指導オーダー', icon: ClipboardList },
        { id: 'physiology', label: '生理検査オーダー', icon: TestTube },
        { id: 'endoscopy', label: '内視鏡検査オーダー', icon: ClipboardList },
        { id: 'imaging', label: '画像検査オーダー', icon: ClipboardList },
        { id: 'pathology', label: '病理検査オーダー', icon: ClipboardList },
        { id: 'bacteriology', label: '細菌検査オーダー', icon: ClipboardList },
        { id: 'general', label: '汎用オーダー', icon: ClipboardList },
        { id: 'composite', label: '複合オーダー', icon: ClipboardList },
        { id: 'meal', label: '食事オーダー', icon: ClipboardList },
        { id: 'rehabilitation', label: 'リハビリオーダー', icon: ClipboardList },
        { id: 'transfusion', label: '輸血オーダー', icon: ClipboardList },
        { id: 'surgery', label: '手術オーダー', icon: ClipboardList },
        { id: 'dialysis', label: '透析オーダー', icon: ClipboardList },
        { id: 'admission', label: '入院オーダー', icon: ClipboardList },
        { id: 'discharge', label: '退院オーダー', icon: ClipboardList },
        { id: 'transfer', label: '転棟転科転室オーダー', icon: ClipboardList },
        { id: 'nursingCare', label: '看護ケアオーダー', icon: ClipboardList }
      ]
    },
    { id: 'results', label: '検査結果', icon: TestTube },
    { id: 'external-info', label: '他院情報', icon: Building2 },
    { id: 'consultation', label: '他科依頼', icon: Users },
    { id: 'patient', label: '患者情報', icon: User },
    { id: 'document', label: '文書', icon: FileText },
    { id: 'appointment', label: '予約', icon: Calendar },
  ];

  const isOrderView = currentView === 'order' || currentView === 'prescription' || currentView === 'injection' || currentView === 'lab' ||
    currentView === 'treatment' || currentView === 'guidance' || currentView === 'physiology' ||
    currentView === 'endoscopy' || currentView === 'imaging' || currentView === 'pathology' ||
    currentView === 'bacteriology' || currentView === 'general' || currentView === 'composite' ||
    currentView === 'meal' || currentView === 'rehabilitation' || currentView === 'transfusion' ||
    currentView === 'surgery' || currentView === 'dialysis' || currentView === 'admission' ||
    currentView === 'discharge' || currentView === 'transfer' || currentView === 'nursingCare';

  return (
    <div
      className={`bg-neutral-50 border-r border-neutral-200 h-screen flex flex-col transition-all duration-300 relative overflow-y-auto ${
        isCollapsed ? 'w-[52px]' : 'w-[87.5px]'
      }`}
    >
      {/* メニュー項目のコンテナ */}
      <div className="py-2">
        {/* 折りたたみボタン */}
        <Tooltip open={isCollapsed ? undefined : false}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex flex-col items-center gap-[3.5px] mb-[3.5px] px-[7px] pt-[7px] pb-0 transition-colors text-neutral-950 hover:bg-neutral-100"
              style={{ height: '51.625px' }}
            >
              <div className="h-[21px] w-full flex items-center justify-center">
                {isCollapsed ? (
                  <ChevronRight className="w-[21px] h-[21px]" />
                ) : (
                  <ChevronLeft className="w-[21px] h-[21px]" />
                )}
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? '展開' : '折りたたむ'}
          </TooltipContent>
        </Tooltip>

        {/* メニュー項目 */}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === currentView || (item.id === 'order' && isOrderView);
          const hasSubmenu = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.id}>
              {/* メインメニュー項目 */}
              <Tooltip open={isCollapsed ? undefined : false}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleMenuClick(item.id as ViewType)}
                    className={`w-full flex flex-col items-center gap-[3.5px] mb-[3.5px] px-[7px] pt-[7px] pb-0 transition-colors relative ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-neutral-950 hover:bg-neutral-100'
                    }`}
                    style={{ height: '51.625px' }}
                  >
                    <div className="h-[21px] w-full flex items-center justify-center relative">
                      <Icon className="w-[21px] h-[21px]" />
                      {hasSubmenu && (
                        <ChevronDown
                          className={`w-3 h-3 absolute right-1 top-1 transition-transform ${
                            showOrderSubmenu ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </div>
                    <div
                      className={`h-[13.125px] w-full flex items-center justify-center ${
                        isCollapsed ? 'opacity-0' : 'opacity-100'
                      } transition-opacity duration-300`}
                    >
                      <span className={`text-[10.5px] leading-[13.125px] ${isActive ? 'font-medium' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>

              {/* サブメニュー（オーダー） */}
              {hasSubmenu && showOrderSubmenu && !isCollapsed && item.subItems && (
                <div className="mx-2 mb-2 bg-neutral-100 rounded-lg overflow-hidden">
                  {item.subItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = currentView === subItem.id;

                    return (
                      <button
                        key={subItem.id}
                        onClick={() => handleMenuClick(subItem.id as ViewType)}
                        className={`w-full px-2 py-2 text-xs cursor-pointer transition-colors flex items-center gap-2 ${
                          isSubActive
                            ? 'bg-blue-500 text-white'
                            : 'text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        <SubIcon className="w-4 h-4" />
                        <span className={isSubActive ? 'font-medium' : ''}>{subItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
