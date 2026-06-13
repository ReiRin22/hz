import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingEvaluationController } from './nursing-evaluation.controller';
import { NursingEvaluationService } from './nursing-evaluation.service';
import { NursingEvaluationClient } from './nursing-evaluation.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingEvaluationController],
  providers: [NursingEvaluationService, NursingEvaluationClient],
})
export class NursingEvaluationModule {}
