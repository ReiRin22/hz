import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  id: string;
  title: string;
  icon: LucideIcon;
  visible: boolean;
  isFavorite: boolean;
  type?: 'normal' | 'department' | 'departmentChild';
  url?: string;
  children?: MenuItem[];
  parentId?: string;
}
