import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImagingOutputController } from './imaging-output.controller';
import { ImagingOutputService } from './imaging-output.service';
import { ImagingOutputClient } from './imaging-output.client';

@Module({
  imports: [HttpModule],
  controllers: [ImagingOutputController],
  providers: [ImagingOutputService, ImagingOutputClient],
})
export class ImagingOutputModule {}
