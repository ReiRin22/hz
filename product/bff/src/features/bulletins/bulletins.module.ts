import { Module } from "@nestjs/common";
import { BulletinsController } from "./bulletins.controller";
import { BulletinsService } from "./bulletins.service";
import { BulletinsClient } from "./bulletins.client";

@Module({
  controllers: [BulletinsController],
  providers: [BulletinsService, BulletinsClient],
})
export class BulletinsModule {}
