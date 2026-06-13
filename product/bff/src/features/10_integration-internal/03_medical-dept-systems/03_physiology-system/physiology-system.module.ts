import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PhysiologySystemController } from './physiology-system.controller';
import { PhysiologySystemService } from './physiology-system.service';
import { PhysiologySystemClient } from './physiology-system.client';

@Module({
  imports: [HttpModule],
  controllers: [PhysiologySystemController],
  providers: [PhysiologySystemService, PhysiologySystemClient],
})
export class PhysiologySystemModule {}
