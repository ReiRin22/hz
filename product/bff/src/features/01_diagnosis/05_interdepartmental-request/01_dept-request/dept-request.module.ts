import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DeptRequestController } from './dept-request.controller';
import { DeptRequestService } from './dept-request.service';
import { DeptRequestClient } from './dept-request.client';

@Module({
  imports: [HttpModule],
  controllers: [DeptRequestController],
  providers: [DeptRequestService, DeptRequestClient],
})
export class DeptRequestModule {}
