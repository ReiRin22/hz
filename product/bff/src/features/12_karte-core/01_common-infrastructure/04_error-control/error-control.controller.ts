import { Controller } from '@nestjs/common';
import { ErrorControlService } from './error-control.service';

@Controller('error-control')
export class ErrorControlController {
  constructor(private readonly errorControlService: ErrorControlService) {}

  // TODO: エンドポイントを実装
}
