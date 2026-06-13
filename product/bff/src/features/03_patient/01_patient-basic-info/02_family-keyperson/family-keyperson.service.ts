import { Injectable } from '@nestjs/common';
import { FamilyKeypersonClient } from './family-keyperson.client';

@Injectable()
export class FamilyKeypersonService {
  constructor(private readonly familyKeypersonClient: FamilyKeypersonClient) {}

  // TODO: ビジネスロジックを実装
}
