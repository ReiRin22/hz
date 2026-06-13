import { LucideIcon } from 'lucide-react';

interface MenuIconProps {
  Icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

export function MenuIcon({ Icon, label, isCollapsed }: MenuIconProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <Icon className="w-6 h-6" />
      </div>
      <div className={`text-xs mt-1 text-center leading-tight${isCollapsed ? ' hidden' : ''}`}>
        {label}
      </div>
    </>
  );
}
