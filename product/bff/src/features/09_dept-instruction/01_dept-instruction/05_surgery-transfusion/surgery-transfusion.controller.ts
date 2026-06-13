import { Controller } from '@nestjs/common';
import { SurgeryTransfusionService } from './surgery-transfusion.service';

@Controller('surgery-transfusion')
export class SurgeryTransfusionController {
  constructor(private readonly surgeryTransfusionService: SurgeryTransfusionService) {}

  // TODO: エンドポイントを実装
}
