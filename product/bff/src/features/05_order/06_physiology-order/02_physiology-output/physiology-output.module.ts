import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PhysiologyOutputController } from './physiology-output.controller';
import { PhysiologyOutputService } from './physiology-output.service';
import { PhysiologyOutputClient } from './physiology-output.client';

@Module({
  imports: [HttpModule],
  controllers: [PhysiologyOutputController],
  providers: [PhysiologyOutputService, PhysiologyOutputClient],
})
export class PhysiologyOutputModule {}
