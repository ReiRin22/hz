import { Injectable } from "@nestjs/common";
import { axiosClient } from "@shared/plugins/bffAxiosClient";
import { UpstreamMenuItem } from "./types/menu.type";

@Injectable()
export class MenuClient {
  async fetchMenuItems(): Promise<UpstreamMenuItem[]> {
    const response = await axiosClient.get<{ items: UpstreamMenuItem[] }>(
      "/api/v1/menu/items",
    );
    return response.data.items;
  }
}
