import { Injectable } from '@nestjs/common';
import { ResultNotificationClient } from './result-notification.client';

@Injectable()
export class ResultNotificationService {
  constructor(private readonly resultNotificationClient: ResultNotificationClient) {}

  // TODO: ビジネスロジックを実装
}
