import { Injectable } from '@nestjs/common';
import { MedicalAdlEvalClient } from './medical-adl-eval.client';

@Injectable()
export class MedicalAdlEvalService {
  constructor(private readonly medicalAdlEvalClient: MedicalAdlEvalClient) {}

  // TODO: ビジネスロジックを実装
}
