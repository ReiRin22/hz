import { Controller } from '@nestjs/common';
import { AdmissionTransferService } from './admission-transfer.service';

@Controller('admission-transfer')
export class AdmissionTransferController {
  constructor(private readonly admissionTransferService: AdmissionTransferService) {}

  // TODO: エンドポイントを実装
}
