import { Injectable } from '@nestjs/common';
import { SpecimenSystemClient } from './specimen-system.client';

@Injectable()
export class SpecimenSystemService {
  constructor(private readonly specimenSystemClient: SpecimenSystemClient) {}

  // TODO: ビジネスロジックを実装
}
