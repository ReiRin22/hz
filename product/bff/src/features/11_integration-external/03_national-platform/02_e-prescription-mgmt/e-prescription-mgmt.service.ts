import { Injectable } from '@nestjs/common';
import { EPrescriptionMgmtClient } from './e-prescription-mgmt.client';

@Injectable()
export class EPrescriptionMgmtService {
  constructor(private readonly ePrescriptionMgmtClient: EPrescriptionMgmtClient) {}

  // TODO: ビジネスロジックを実装
}
