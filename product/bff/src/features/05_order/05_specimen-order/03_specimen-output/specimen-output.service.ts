import { Injectable } from '@nestjs/common';
import { SpecimenOutputClient } from './specimen-output.client';

@Injectable()
export class SpecimenOutputService {
  constructor(private readonly specimenOutputClient: SpecimenOutputClient) {}

  // TODO: ビジネスロジックを実装
}
