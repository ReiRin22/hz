import { Controller } from '@nestjs/common';
import { EPrescriptionMgmtService } from './e-prescription-mgmt.service';

@Controller('e-prescription-mgmt')
export class EPrescriptionMgmtController {
  constructor(private readonly ePrescriptionMgmtService: EPrescriptionMgmtService) {}

  // TODO: エンドポイントを実装
}
