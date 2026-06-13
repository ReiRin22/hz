import { Controller } from '@nestjs/common';
import { MedicalMemoService } from './medical-memo.service';

@Controller('medical-memo')
export class MedicalMemoController {
  constructor(private readonly medicalMemoService: MedicalMemoService) {}

  // TODO: エンドポイントを実装
}
