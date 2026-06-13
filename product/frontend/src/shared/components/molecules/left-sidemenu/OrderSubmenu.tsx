import { MenuSubItem } from '@/shared/types/left-sidemenu/menu.types';

interface OrderSubmenuProps {
  subItems: MenuSubItem[];
  activeOrderType: string;
  onOrderTypeChange?: (type: string) => void;
}

export function OrderSubmenu({ subItems, activeOrderType, onOrderTypeChange }: OrderSubmenuProps) {
  return (
    <div className="mx-2 mb-2 bg-sidebar-accent rounded-lg overflow-hidden">
      {subItems.map((subItem) => (
        <div
          key={subItem.id}
          className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
            activeOrderType === subItem.id
              ? 'bg-[#030213] text-white'
              : 'text-sidebar-foreground hover:bg-sidebar-accent'
          }`}
          onClick={() => onOrderTypeChange?.(subItem.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOrderTypeChange?.(subItem.id); }}
        >
          {subItem.label}
        </div>
      ))}
    </div>
  );
}
