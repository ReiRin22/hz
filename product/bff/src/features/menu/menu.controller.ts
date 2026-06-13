import { Controller, Get, Inject } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { GetMenuItemsResponse } from "./types/menu.api.response";

@Controller("menu-items")
export class MenuController {
  constructor(@Inject(MenuService) private readonly service: MenuService) {}

  @Get()
  async getMenuItems(): Promise<GetMenuItemsResponse> {
    return this.service.getMenuItems();
  }
}
