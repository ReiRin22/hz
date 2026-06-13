import { Controller } from '@nestjs/common';
import { ResultNotificationService } from './result-notification.service';

@Controller('result-notification')
export class ResultNotificationController {
  constructor(private readonly resultNotificationService: ResultNotificationService) {}

  // TODO: エンドポイントを実装
}
