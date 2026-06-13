import { Module } from '@nestjs/common';
import { DeptInstructionController } from './dept-instruction.controller';
import { DeptInstructionService } from './dept-instruction.service';
import { DeptInstructionClient } from './dept-instruction.client';

@Module({
  controllers: [DeptInstructionController],
  providers: [DeptInstructionService, DeptInstructionClient],
})
export class DeptInstructionModule {}
