import { Controller, Get, Inject } from "@nestjs/common";
import { CurrentUserService } from "./current-user.service";
import type { GetCurrentUserResponse } from "./types/current-user.api.response";

@Controller("current-user")
export class CurrentUserController {
  constructor(@Inject(CurrentUserService) private readonly currentUserService: CurrentUserService) {}

  /** GET /bff/currentUser */
  @Get()
  async getCurrentUser(): Promise<GetCurrentUserResponse> {
    return this.currentUserService.getCurrentUser();
  }
}
