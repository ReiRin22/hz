import { ChevronLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/atoms/tooltip';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.globalMenuNav.collapseButton;

interface CollapseButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
}

export function CollapseButton({ isCollapsed, onClick }: CollapseButtonProps) {
  return (
    <div className="flex justify-center mb-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
            aria-label={isCollapsed ? t.expandAria : t.collapseAria}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform${isCollapsed ? ' rotate-180' : ''}`} />
          </button>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="bg-white text-black border border-gray-200">
            <p>{t.expandTooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
}
