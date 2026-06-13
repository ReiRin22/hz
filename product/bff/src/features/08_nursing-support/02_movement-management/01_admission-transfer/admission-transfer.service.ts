import { Injectable } from '@nestjs/common';
import { AdmissionTransferClient } from './admission-transfer.client';

@Injectable()
export class AdmissionTransferService {
  constructor(private readonly admissionTransferClient: AdmissionTransferClient) {}

  // TODO: ビジネスロジックを実装
}
