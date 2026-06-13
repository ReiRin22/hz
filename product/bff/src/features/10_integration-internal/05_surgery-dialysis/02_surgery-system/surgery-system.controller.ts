import { Controller } from '@nestjs/common';
import { SurgerySystemService } from './surgery-system.service';

@Controller('surgery-system')
export class SurgerySystemController {
  constructor(private readonly surgerySystemService: SurgerySystemService) {}

  // TODO: エンドポイントを実装
}
