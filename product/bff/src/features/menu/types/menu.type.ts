export interface UpstreamMenuItem {
  id: string;
  title: string;
  iconName: string;
  url?: string;
  visible: boolean;
  isFavorite: boolean;
  type: 'normal' | 'department' | 'departmentChild';
  sortOrder: number;
  children?: UpstreamMenuItem[];
  parentId?: string;
}
