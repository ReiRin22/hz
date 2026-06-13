import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingDegreeController } from './nursing-degree.controller';
import { NursingDegreeService } from './nursing-degree.service';
import { NursingDegreeClient } from './nursing-degree.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingDegreeController],
  providers: [NursingDegreeService, NursingDegreeClient],
})
export class NursingDegreeModule {}
