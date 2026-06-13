import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ResultNotificationController } from './result-notification.controller';
import { ResultNotificationService } from './result-notification.service';
import { ResultNotificationClient } from './result-notification.client';

@Module({
  imports: [HttpModule],
  controllers: [ResultNotificationController],
  providers: [ResultNotificationService, ResultNotificationClient],
})
export class ResultNotificationModule {}
