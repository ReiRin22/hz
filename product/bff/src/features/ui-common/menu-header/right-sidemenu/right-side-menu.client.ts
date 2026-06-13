import { Injectable } from "@nestjs/common";
import { axiosClient } from "@shared/plugins/bffAxiosClient";
import { UpstreamRightSideMenuItem } from "./types/right-side-menu.type";

@Injectable()
export class RightSideMenuClient {
  async fetchItems(): Promise<UpstreamRightSideMenuItem[]> {
    const response = await axiosClient.get<{ items: UpstreamRightSideMenuItem[] }>(
      "/api/v1/right-side-menu/items",
    );
    return response.data.items;
  }
}
