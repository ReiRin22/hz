import { Controller, Get, Inject } from "@nestjs/common";
import { BulletinsService } from "./bulletins.service";
import type { GetBulletinsResponse } from "./types/bulletins.api.response";

@Controller("bulletins")
export class BulletinsController {
  constructor(@Inject(BulletinsService) private readonly bulletinsService: BulletinsService) {}

  @Get()
  async getBulletins(): Promise<GetBulletinsResponse> {
    return this.bulletinsService.getBulletins();
  }
}
