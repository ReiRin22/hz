import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BedExitDetectionController } from './bed-exit-detection.controller';
import { BedExitDetectionService } from './bed-exit-detection.service';
import { BedExitDetectionClient } from './bed-exit-detection.client';

@Module({
  imports: [HttpModule],
  controllers: [BedExitDetectionController],
  providers: [BedExitDetectionService, BedExitDetectionClient],
})
export class BedExitDetectionModule {}
