import { Controller } from '@nestjs/common';
import { InjectionOutputService } from './injection-output.service';

@Controller('injection-output')
export class InjectionOutputController {
  constructor(private readonly injectionOutputService: InjectionOutputService) {}

  // TODO: エンドポイントを実装
}
