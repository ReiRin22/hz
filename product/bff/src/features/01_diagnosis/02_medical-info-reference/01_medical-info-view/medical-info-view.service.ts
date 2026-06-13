import { Injectable } from '@nestjs/common';
import { MedicalInfoViewClient } from './medical-info-view.client';

@Injectable()
export class MedicalInfoViewService {
  constructor(private readonly medicalInfoViewClient: MedicalInfoViewClient) {}

  // TODO: ビジネスロジックを実装
}
