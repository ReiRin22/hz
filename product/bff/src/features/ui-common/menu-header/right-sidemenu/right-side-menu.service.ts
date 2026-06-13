import { Injectable, Inject } from "@nestjs/common";
import { RightSideMenuClient } from "./right-side-menu.client";
import { GetRightSideMenuItemsResponse } from "./types/right-side-menu.api.response";
import { UpstreamRightSideMenuItem } from "./types/right-side-menu.type";

@Injectable()
export class RightSideMenuService {
  constructor(@Inject(RightSideMenuClient) private readonly client: RightSideMenuClient) {}

  async getItems(): Promise<GetRightSideMenuItemsResponse> {
    const upstream = await this.client.fetchItems();
    const items = upstream.map((item: UpstreamRightSideMenuItem) => ({
      id: item.id,
      label: item.label,
      iconKey: item.iconKey,
      ...(item.url != null ? { url: item.url } : {}),
      visible: item.visible,
      sortOrder: item.sortOrder,
    }));
    return { items };
  }
}
