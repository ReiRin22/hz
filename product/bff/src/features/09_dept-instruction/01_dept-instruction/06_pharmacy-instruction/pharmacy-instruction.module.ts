import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PharmacyInstructionController } from './pharmacy-instruction.controller';
import { PharmacyInstructionService } from './pharmacy-instruction.service';
import { PharmacyInstructionClient } from './pharmacy-instruction.client';

@Module({
  imports: [HttpModule],
  controllers: [PharmacyInstructionController],
  providers: [PharmacyInstructionService, PharmacyInstructionClient],
})
export class PharmacyInstructionModule {}
