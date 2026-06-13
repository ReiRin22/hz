import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OnlineEligibilityController } from './online-eligibility.controller';
import { OnlineEligibilityService } from './online-eligibility.service';
import { OnlineEligibilityClient } from './online-eligibility.client';

@Module({
  imports: [HttpModule],
  controllers: [OnlineEligibilityController],
  providers: [OnlineEligibilityService, OnlineEligibilityClient],
})
export class OnlineEligibilityModule {}
