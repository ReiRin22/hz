import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MedicalAdlEvalController } from './medical-adl-eval.controller';
import { MedicalAdlEvalService } from './medical-adl-eval.service';
import { MedicalAdlEvalClient } from './medical-adl-eval.client';

@Module({
  imports: [HttpModule],
  controllers: [MedicalAdlEvalController],
  providers: [MedicalAdlEvalService, MedicalAdlEvalClient],
})
export class MedicalAdlEvalModule {}
