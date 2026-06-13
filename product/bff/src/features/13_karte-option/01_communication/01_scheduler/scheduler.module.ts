import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { SchedulerClient } from './scheduler.client';

@Module({
  imports: [HttpModule],
  controllers: [SchedulerController],
  providers: [SchedulerService, SchedulerClient],
})
export class SchedulerModule {}
