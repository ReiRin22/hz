import { Injectable } from '@nestjs/common';
import { NotificationClient } from './notification.client';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationClient: NotificationClient) {}

  // TODO: ビジネスロジックを実装
}
