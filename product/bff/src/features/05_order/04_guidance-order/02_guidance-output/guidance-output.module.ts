import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GuidanceOutputController } from './guidance-output.controller';
import { GuidanceOutputService } from './guidance-output.service';
import { GuidanceOutputClient } from './guidance-output.client';

@Module({
  imports: [HttpModule],
  controllers: [GuidanceOutputController],
  providers: [GuidanceOutputService, GuidanceOutputClient],
})
export class GuidanceOutputModule {}
