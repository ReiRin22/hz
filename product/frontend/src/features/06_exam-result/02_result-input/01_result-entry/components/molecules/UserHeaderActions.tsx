import { Button } from '@/shared/components/atoms/button';
import { LogOut, HelpCircle } from 'lucide-react';

interface UserHeaderActionsProps {
  onLogout?: () => void;
  onHelp?: () => void;
}

export function UserHeaderActions({ onLogout, onHelp }: UserHeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-8"
        onClick={onHelp}
      >
        <HelpCircle className="w-4 h-4 mr-1" />
        <span className="text-xs">ヘルプ</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8"
        onClick={onLogout}
      >
        <LogOut className="w-4 h-4 mr-1" />
        <span className="text-xs">ログアウト</span>
      </Button>
    </div>
  );
}
