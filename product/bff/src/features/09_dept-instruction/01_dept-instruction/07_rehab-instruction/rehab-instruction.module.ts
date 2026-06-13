import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RehabInstructionController } from './rehab-instruction.controller';
import { RehabInstructionService } from './rehab-instruction.service';
import { RehabInstructionClient } from './rehab-instruction.client';

@Module({
  imports: [HttpModule],
  controllers: [RehabInstructionController],
  providers: [RehabInstructionService, RehabInstructionClient],
})
export class RehabInstructionModule {}
