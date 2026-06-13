import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingRecordsController } from './nursing-records.controller';
import { NursingRecordsService } from './nursing-records.service';
import { NursingRecordsClient } from './nursing-records.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingRecordsController],
  providers: [NursingRecordsService, NursingRecordsClient],
})
export class NursingRecordsModule {}
