import { Button } from '@/shared/components/atoms/button';
import { Search, ChevronLeft, ChevronRight, Bell, Settings } from 'lucide-react';

export function PatientHeaderActions() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" className="h-8 px-2">
        <Search className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" className="h-8 px-2">
        <span className="text-xs">検査履歴</span>
      </Button>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" className="h-8 px-2">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <Button variant="ghost" size="sm" className="h-8 px-2 relative">
        <Bell className="w-4 h-4" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2">
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
}