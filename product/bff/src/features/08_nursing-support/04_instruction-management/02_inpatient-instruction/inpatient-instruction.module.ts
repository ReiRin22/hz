import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InpatientInstructionController } from './inpatient-instruction.controller';
import { InpatientInstructionService } from './inpatient-instruction.service';
import { InpatientInstructionClient } from './inpatient-instruction.client';

@Module({
  imports: [HttpModule],
  controllers: [InpatientInstructionController],
  providers: [InpatientInstructionService, InpatientInstructionClient],
})
export class InpatientInstructionModule {}
