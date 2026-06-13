import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeneralOutputController } from './general-output.controller';
import { GeneralOutputService } from './general-output.service';
import { GeneralOutputClient } from './general-output.client';

@Module({
  imports: [HttpModule],
  controllers: [GeneralOutputController],
  providers: [GeneralOutputService, GeneralOutputClient],
})
export class GeneralOutputModule {}
