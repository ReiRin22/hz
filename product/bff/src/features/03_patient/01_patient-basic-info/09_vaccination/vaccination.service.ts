import { Injectable } from '@nestjs/common';
import { VaccinationClient } from './vaccination.client';

@Injectable()
export class VaccinationService {
  constructor(private readonly vaccinationClient: VaccinationClient) {}

  // TODO: ビジネスロジックを実装
}
