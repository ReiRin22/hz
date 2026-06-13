import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChartReferenceController } from './chart-reference.controller';
import { ChartReferenceService } from './chart-reference.service';
import { ChartReferenceClient } from './chart-reference.client';

@Module({
  imports: [HttpModule],
  controllers: [ChartReferenceController],
  providers: [ChartReferenceService, ChartReferenceClient],
})
export class ChartReferenceModule {}
