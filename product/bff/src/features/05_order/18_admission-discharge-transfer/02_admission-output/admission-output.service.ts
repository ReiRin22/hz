import { Injectable } from '@nestjs/common';
import { AdmissionOutputClient } from './admission-output.client';

@Injectable()
export class AdmissionOutputService {
  constructor(private readonly admissionOutputClient: AdmissionOutputClient) {}

  // TODO: ビジネスロジックを実装
}
