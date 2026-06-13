import { Controller, Get, Inject } from "@nestjs/common";
import { RightSideMenuService } from "./right-side-menu.service";
import { GetRightSideMenuItemsResponse } from "./types/right-side-menu.api.response";

@Controller("right-side-menu-items")
export class RightSideMenuController {
  constructor(@Inject(RightSideMenuService) private readonly service: RightSideMenuService) {}

  @Get()
  async getItems(): Promise<GetRightSideMenuItemsResponse> {
    return this.service.getItems();
  }
}
