import { ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/atoms/tooltip';
import { MenuItem } from '@/shared/types/left-sidemenu/menu.types';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.globalMenuNav.menuItemButton;

interface MenuItemButtonProps {
  item: MenuItem;
  isCollapsed: boolean;
  showOrderSubmenu: boolean;
  onClick: () => void;
}

export function MenuItemButton({ item, isCollapsed, showOrderSubmenu, onClick }: MenuItemButtonProps) {
  const Icon = item.icon;
  const hasSubmenu = item.subItems && item.subItems.length > 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`mx-2 mb-1 p-2 rounded-lg cursor-pointer transition-colors relative ${item.active ? 'bg-[#030213] text-white' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
        >
          <div className="flex items-center justify-between">
            <Icon className="w-6 h-6" />
            {hasSubmenu && !isCollapsed && (
              <ChevronRight
                className={`w-3 h-3 transition-transform${showOrderSubmenu ? ' rotate-90' : ''}`}
              />
            )}
          </div>
          <div className={`text-xs mt-1 text-center leading-tight${isCollapsed ? ' hidden' : ''}`}>
            {item.label}
          </div>
        </div>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" className="bg-white text-black border border-gray-200 max-w-xs">
          <div>
            <p className="font-semibold mb-1">{item.label}</p>
            {hasSubmenu && item.subItems && (
              <div className="text-xs space-y-0.5 mt-2">
                {item.subItems.slice(0, 5).map((subItem) => (
                  <div key={subItem.id}>• {subItem.label}</div>
                ))}
                {item.subItems.length > 5 && (
                  <div className="text-gray-500">{t.moreItems(item.subItems.length - 5)}</div>
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
