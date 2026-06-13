import { Users, Calendar, FileText, BarChart3, Package, Monitor, Upload } from 'lucide-react';

interface SystemMenuProps {
  onMenuClick?: (menuId: string) => void;
}

const systemMenuItems = [
  { id: 'patients', label: '患者一覧', icon: Users },
  { id: 'reception', label: '受付一覧', icon: Calendar },
  { id: 'examination', label: '検査予約', icon: Monitor },
  { id: 'document-upload', label: '文書取込', icon: Upload },
  { id: 'statistics', label: 'レポート', icon: BarChart3 },
  { id: 'inventory', label: '在庫管理', icon: Package },
];

export function SystemMenu({ onMenuClick }: SystemMenuProps) {
  const handleClick = (menuId: string) => {
    if (onMenuClick) {
      onMenuClick(menuId);
    }
  };

  return (
    <div className="w-20 bg-sidebar border-l border-sidebar-border flex flex-col">
      <nav className="flex-1 py-4">
        {systemMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="mx-2 mb-2 p-2 rounded-lg cursor-pointer transition-colors group relative text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => handleClick(item.id)}
            >
              <Icon className="w-6 h-6 mx-auto" />
              <div className="text-xs mt-1 text-center leading-tight">
                {item.label}
              </div>
              <div className="absolute right-full mr-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
