import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NutritionInstructionController } from './nutrition-instruction.controller';
import { NutritionInstructionService } from './nutrition-instruction.service';
import { NutritionInstructionClient } from './nutrition-instruction.client';

@Module({
  imports: [HttpModule],
  controllers: [NutritionInstructionController],
  providers: [NutritionInstructionService, NutritionInstructionClient],
})
export class NutritionInstructionModule {}
