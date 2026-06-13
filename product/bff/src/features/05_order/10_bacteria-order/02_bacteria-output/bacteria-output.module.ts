import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BacteriaOutputController } from './bacteria-output.controller';
import { BacteriaOutputService } from './bacteria-output.service';
import { BacteriaOutputClient } from './bacteria-output.client';

@Module({
  imports: [HttpModule],
  controllers: [BacteriaOutputController],
  providers: [BacteriaOutputService, BacteriaOutputClient],
})
export class BacteriaOutputModule {}
