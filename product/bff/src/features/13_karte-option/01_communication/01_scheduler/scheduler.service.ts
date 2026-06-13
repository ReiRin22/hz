import { Injectable } from '@nestjs/common';
import { SchedulerClient } from './scheduler.client';

@Injectable()
export class SchedulerService {
  constructor(private readonly schedulerClient: SchedulerClient) {}

  // TODO: ビジネスロジックを実装
}
