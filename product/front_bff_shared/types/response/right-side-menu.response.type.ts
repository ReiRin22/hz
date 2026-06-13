export interface RightSideMenuItemResponse {
  id: string;
  label: string;
  iconKey: string;
  url?: string;
  visible: boolean;
  sortOrder: number;
}

export interface GetRightSideMenuItemsResponse {
  items: RightSideMenuItemResponse[];
}
