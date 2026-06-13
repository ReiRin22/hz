import { Injectable, Inject } from "@nestjs/common";
import { MenuClient } from "./menu.client";
import { GetMenuItemsResponse } from "./types/menu.api.response";

@Injectable()
export class MenuService {
  constructor(@Inject(MenuClient) private readonly client: MenuClient) {}

  async getMenuItems(): Promise<GetMenuItemsResponse> {
    const items = await this.client.fetchMenuItems();
    return { items };
  }
}
