import { Controller } from '@nestjs/common';
import { MedicalAdlEvalService } from './medical-adl-eval.service';

@Controller('medical-adl-eval')
export class MedicalAdlEvalController {
  constructor(private readonly medicalAdlEvalService: MedicalAdlEvalService) {}

  // TODO: エンドポイントを実装
}
