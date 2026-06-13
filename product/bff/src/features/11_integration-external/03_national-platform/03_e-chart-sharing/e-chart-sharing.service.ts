import { Injectable } from '@nestjs/common';
import { EChartSharingClient } from './e-chart-sharing.client';

@Injectable()
export class EChartSharingService {
  constructor(private readonly eChartSharingClient: EChartSharingClient) {}

  // TODO: ビジネスロジックを実装
}
