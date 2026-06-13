import { Module } from "@nestjs/common";
import { CurrentUserController } from "./current-user.controller";
import { CurrentUserService } from "./current-user.service";
import { CurrentUserClient } from "./current-user.client";

@Module({
  controllers: [CurrentUserController],
  providers: [CurrentUserService, CurrentUserClient],
})
export class CurrentUserModule {}
