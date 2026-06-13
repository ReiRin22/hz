import { Injectable } from '@nestjs/common';
import { UrinaryCheckListClient } from './urinary-check-list.client';

@Injectable()
export class UrinaryCheckListService {
  constructor(private readonly urinaryCheckListClient: UrinaryCheckListClient) {}

  // TODO: ビジネスロジックを実装
}
