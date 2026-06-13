import { TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';
import type { LucideIcon } from 'lucide-react';

export interface MedicalTab {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface MedicalTabsListProps {
  tabs: MedicalTab[];
}

export function MedicalTabsList({ tabs }: MedicalTabsListProps) {
  return (
    <TabsList className="!w-full !grid !grid-cols-3 !h-10 rounded-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <TabsTrigger key={tab.value} value={tab.value} className="flex items-center justify-center gap-1.5 text-sm">
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
