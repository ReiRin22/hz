export interface MenuItemResponse {
  id: string;
  title: string;
  iconName: string;
  url?: string;
  visible: boolean;
  isFavorite: boolean;
  type: 'normal' | 'department' | 'departmentChild';
  sortOrder: number;
  children?: MenuItemResponse[];
  parentId?: string;
}

export interface GetMenuItemsResponse {
  items: MenuItemResponse[];
}
