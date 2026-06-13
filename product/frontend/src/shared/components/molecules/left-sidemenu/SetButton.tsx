import { Layers } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/atoms/tooltip';
import { DialogTrigger } from '@/shared/components/atoms/dialog';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.globalMenuNav.setButton;

interface SetButtonProps {
  isCollapsed: boolean;
}

export function SetButton({ isCollapsed }: SetButtonProps) {
  return (
    <DialogTrigger asChild>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="mx-2 mb-1 p-2 rounded-lg cursor-pointer transition-colors relative text-sidebar-foreground hover:bg-sidebar-accent">
            <div className="flex items-center justify-between">
              <Layers className="w-6 h-6" />
            </div>
            <div className={`text-xs mt-1 text-center leading-tight${isCollapsed ? ' hidden' : ''}`}>
              {t.label}
            </div>
          </div>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="bg-white text-black border border-gray-200">
            <p>{t.label}</p>
            <div className="text-xs space-y-0.5 mt-2">{t.tooltipSub}</div>
          </TooltipContent>
        )}
      </Tooltip>
    </DialogTrigger>
  );
}
