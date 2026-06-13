import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationClient } from './notification.client';

@Module({
  imports: [HttpModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationClient],
})
export class NotificationModule {}
