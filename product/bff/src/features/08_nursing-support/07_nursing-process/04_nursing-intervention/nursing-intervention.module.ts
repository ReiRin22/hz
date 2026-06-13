import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingInterventionController } from './nursing-intervention.controller';
import { NursingInterventionService } from './nursing-intervention.service';
import { NursingInterventionClient } from './nursing-intervention.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingInterventionController],
  providers: [NursingInterventionService, NursingInterventionClient],
})
export class NursingInterventionModule {}
