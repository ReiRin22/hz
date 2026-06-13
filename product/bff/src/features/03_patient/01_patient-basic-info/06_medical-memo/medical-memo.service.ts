import { Injectable } from '@nestjs/common';
import { MedicalMemoClient } from './medical-memo.client';

@Injectable()
export class MedicalMemoService {
  constructor(private readonly medicalMemoClient: MedicalMemoClient) {}

  // TODO: ビジネスロジックを実装
}
