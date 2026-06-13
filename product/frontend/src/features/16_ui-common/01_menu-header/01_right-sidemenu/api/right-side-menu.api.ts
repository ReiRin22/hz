import { axiosClient } from '@/shared/plugins/axiosClient';
import type { GetRightSideMenuItemsResponse } from '@/front_bff_shared/types/response/right-side-menu.response.type';

export async function getRightSideMenuItems(): Promise<GetRightSideMenuItemsResponse> {
  const response = await axiosClient.get<GetRightSideMenuItemsResponse>('/right-side-menu-items');
  return response.data;
}
