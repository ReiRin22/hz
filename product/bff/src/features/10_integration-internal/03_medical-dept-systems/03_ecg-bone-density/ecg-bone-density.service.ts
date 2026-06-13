import { Injectable } from '@nestjs/common';
import { EcgBoneDensityClient } from './ecg-bone-density.client';

@Injectable()
export class EcgBoneDensityService {
  constructor(private readonly ecgBoneDensityClient: EcgBoneDensityClient) {}

  // TODO: ビジネスロジックを実装
}
