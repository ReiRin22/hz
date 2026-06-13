import type { GetMenuItemsResponse } from "@/front_bff_shared/features/ui-common/menu-header/menu/types/responses/menu.response";
import { axiosClient } from "@/shared/plugins/axiosClient";

export async function getMenuItems(): Promise<GetMenuItemsResponse> {
  const res = await axiosClient.get<GetMenuItemsResponse>("/menu-items");
  return res.data;
}
