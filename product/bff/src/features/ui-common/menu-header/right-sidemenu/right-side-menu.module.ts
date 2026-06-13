import { Module } from "@nestjs/common";
import { RightSideMenuController } from "./right-side-menu.controller";
import { RightSideMenuService } from "./right-side-menu.service";
import { RightSideMenuClient } from "./right-side-menu.client";

@Module({
  controllers: [RightSideMenuController],
  providers: [RightSideMenuService, RightSideMenuClient],
})
export class RightSideMenuModule {}
