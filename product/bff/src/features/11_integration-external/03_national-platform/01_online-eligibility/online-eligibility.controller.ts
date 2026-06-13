import { Controller } from '@nestjs/common';
import { OnlineEligibilityService } from './online-eligibility.service';

@Controller('online-eligibility')
export class OnlineEligibilityController {
  constructor(private readonly onlineEligibilityService: OnlineEligibilityService) {}

  // TODO: エンドポイントを実装
}
