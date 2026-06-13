import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LabInstructionController } from './lab-instruction.controller';
import { LabInstructionService } from './lab-instruction.service';
import { LabInstructionClient } from './lab-instruction.client';

@Module({
  imports: [HttpModule],
  controllers: [LabInstructionController],
  providers: [LabInstructionService, LabInstructionClient],
})
export class LabInstructionModule {}
