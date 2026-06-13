import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DialysisInstructionController } from './dialysis-instruction.controller';
import { DialysisInstructionService } from './dialysis-instruction.service';
import { DialysisInstructionClient } from './dialysis-instruction.client';

@Module({
  imports: [HttpModule],
  controllers: [DialysisInstructionController],
  providers: [DialysisInstructionService, DialysisInstructionClient],
})
export class DialysisInstructionModule {}
