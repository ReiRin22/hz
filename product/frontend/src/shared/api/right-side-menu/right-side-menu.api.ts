import { axiosClient } from '@/shared/plugins/axiosClient';
import type { GetRightSideMenuItemsResponse } from '@/front_bff_shared/features/ui-common/menu-header/right-sidemenu/types/responses/right-side-menu.response';

export async function getRightSideMenuItems(): Promise<GetRightSideMenuItemsResponse> {
  const response = await axiosClient.get<GetRightSideMenuItemsResponse>('/right-side-menu-items');
  return response.data;
}
