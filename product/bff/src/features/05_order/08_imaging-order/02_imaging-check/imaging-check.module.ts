import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImagingCheckController } from './imaging-check.controller';
import { ImagingCheckService } from './imaging-check.service';
import { ImagingCheckClient } from './imaging-check.client';

@Module({
  imports: [HttpModule],
  controllers: [ImagingCheckController],
  providers: [ImagingCheckService, ImagingCheckClient],
})
export class ImagingCheckModule {}
