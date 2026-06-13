'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/components/atoms/tooltip';
import { useRightSideMenuInit } from '../../hooks/use-right-side-menu-init';
import { useRightSideMenuStore } from '../../stores/use-right-side-menu.store';
import { BulletinBoardDialog } from '../molecules/BulletinBoardDialog';
import { MemoDialog } from '../molecules/MemoDialog';
import type { RightSideMenuItemResponse } from '@/front_bff_shared/types/response/right-side-menu.response.type';

// TODO: 将来 iconKey → コンポーネントのマッピングを共通定義に移行
function MenuIcon({ iconKey }: { iconKey: string }) {
  switch (iconKey) {
    case 'map':
      return (
        <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path d="M3 6h3a2 2 0 012 2v10a2 2 0 01-2 2H3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 6h-3a2 2 0 00-2 2v10a2 2 0 002 2h3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="10" y1="10" x2="10" y2="10.01" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="14" y1="10" x2="14" y2="10.01" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="10" y1="14" x2="10" y2="14.01" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="14" y1="14" x2="14" y2="14.01" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'list':
      return (
        <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="12" x2="15" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="16" x2="15" y2="16" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="20" x2="15" y2="20" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'board':
      return (
        <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="10" x2="15" y2="10" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="14" x2="13" y2="14" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'memo':
      return (
        <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="1" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="12" x2="15" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="16" x2="15" y2="16" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'settings':
      return (
        <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 1v6m0 6v6m8.66-13.66l-4.24 4.24m-4.84 4.84l-4.24 4.24M23 12h-6m-6 0H1m18.66 8.66l-4.24-4.24m-4.84-4.84l-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'goto_menu':
      return <ArrowLeft className="w-[21px] h-[21px]" />;
    default:
      return <span className="w-[21px] h-[21px] text-xs flex items-center justify-center">{iconKey}</span>;
  }
}

const MENU_ITEM_GOTO_MENU = '__goto_menu__';

export function RightSideMenu() {
  const router = useRouter();
  // const pathname = usePathname();
  const pathname = usePathname() ?? '';
  const isReceptionList = pathname.startsWith('/reception-list');
  const { items: fetchedItems, error: menuError } = useRightSideMenuInit();

  const {
    isCollapsed,
    showBulletinDialog,
    showMemoDialog,
    toggleCollapse,
    openBulletinDialog,
    closeBulletinDialog,
    openMemoDialog,
    closeMemoDialog,
    reset,
  } = useRightSideMenuStore();

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const menuItems: RightSideMenuItemResponse[] = fetchedItems.length > 0
    ? [
        ...fetchedItems,
        { id: MENU_ITEM_GOTO_MENU, label: 'メニュー', iconKey: 'goto_menu', visible: true, sortOrder: 9999 },
      ]
    : [];

  const handleItemClick = (item: RightSideMenuItemResponse) => {
    if (item.id === MENU_ITEM_GOTO_MENU) {
      router.push('/ui-common/menu-header/menu/ETC002');
    } else if (item.iconKey === 'list') {
      router.push('/reception-list');
    } else if (item.iconKey === 'board') {
      openBulletinDialog();
    } else if (item.iconKey === 'memo') {
      openMemoDialog();
    }
  };

  return (
    <div
      className={`bg-neutral-50 border-r border-neutral-200 h-full flex flex-col transition-all duration-300 relative ${
        isCollapsed ? 'w-[52px]' : 'w-[87.5px]'
      }`}
    >
      {menuError && !isCollapsed && (
        <p className="text-[10px] text-red-500 px-2 pt-2 text-center">{menuError}</p>
      )}
      <div className="px-2">
        <Tooltip open={isCollapsed ? undefined : false}>
          <TooltipTrigger asChild>
            <button
              onClick={toggleCollapse}
              className="w-full flex flex-col items-center gap-[3.5px] mb-1 p-2 rounded-lg cursor-pointer transition-colors text-neutral-950 hover:bg-neutral-100"
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

        {menuItems
          .filter((item) => item.visible)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item) => (
            <Tooltip key={item.id} open={isCollapsed ? undefined : false}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex flex-col items-center gap-[3.5px] mb-1 p-2 rounded-lg cursor-pointer transition-colors ${
                    item.iconKey === 'list' && isReceptionList
                      ? 'bg-[#030213] text-white'
                      : 'text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <div className="h-[21px] w-full flex items-center justify-center">
                    <MenuIcon iconKey={item.iconKey} />
                  </div>
                  <div className={`h-[13.125px] w-full flex items-center justify-center ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                    <span className="text-[10.5px] leading-[13.125px]">{item.label}</span>
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
      </div>

      {showBulletinDialog && <BulletinBoardDialog onClose={closeBulletinDialog} />}
      {showMemoDialog && <MemoDialog onClose={closeMemoDialog} />}
    </div>
  );
}
