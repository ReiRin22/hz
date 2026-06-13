import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PredictiveInstructionController } from './predictive-instruction.controller';
import { PredictiveInstructionService } from './predictive-instruction.service';
import { PredictiveInstructionClient } from './predictive-instruction.client';

@Module({
  imports: [HttpModule],
  controllers: [PredictiveInstructionController],
  providers: [PredictiveInstructionService, PredictiveInstructionClient],
})
export class PredictiveInstructionModule {}
