import { Controller } from '@nestjs/common';
import { AllergyCheckService } from './allergy-check.service';

@Controller('allergy-check')
export class AllergyCheckController {
  constructor(private readonly allergyCheckService: AllergyCheckService) {}

  // TODO: エンドポイントを実装
}
