import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RadiologyInstructionController } from './radiology-instruction.controller';
import { RadiologyInstructionService } from './radiology-instruction.service';
import { RadiologyInstructionClient } from './radiology-instruction.client';

@Module({
  imports: [HttpModule],
  controllers: [RadiologyInstructionController],
  providers: [RadiologyInstructionService, RadiologyInstructionClient],
})
export class RadiologyInstructionModule {}
