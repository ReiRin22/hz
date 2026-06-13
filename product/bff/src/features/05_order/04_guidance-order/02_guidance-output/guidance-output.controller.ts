import { Controller } from '@nestjs/common';
import { GuidanceOutputService } from './guidance-output.service';

@Controller('guidance-output')
export class GuidanceOutputController {
  constructor(private readonly guidanceOutputService: GuidanceOutputService) {}

  // TODO: エンドポイントを実装
}
