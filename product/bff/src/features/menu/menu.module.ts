import { Module } from "@nestjs/common";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";
import { MenuClient } from "./menu.client";

@Module({
  controllers: [MenuController],
  providers: [MenuService, MenuClient],
})
export class MenuModule {}
