import { Injectable } from '@nestjs/common';
import { MedicalAccountingClient } from './medical-accounting.client';

@Injectable()
export class MedicalAccountingService {
  constructor(private readonly medicalAccountingClient: MedicalAccountingClient) {}

  // TODO: ビジネスロジックを実装
}
