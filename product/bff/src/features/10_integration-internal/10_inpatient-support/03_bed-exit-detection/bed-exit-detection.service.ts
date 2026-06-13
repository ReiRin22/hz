import { Injectable } from '@nestjs/common';
import { BedExitDetectionClient } from './bed-exit-detection.client';

@Injectable()
export class BedExitDetectionService {
  constructor(private readonly bedExitDetectionClient: BedExitDetectionClient) {}

  // TODO: ビジネスロジックを実装
}
