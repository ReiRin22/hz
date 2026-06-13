import { Controller } from '@nestjs/common';
import { EndoscopyOutputService } from './endoscopy-output.service';

@Controller('endoscopy-output')
export class EndoscopyOutputController {
  constructor(private readonly endoscopyOutputService: EndoscopyOutputService) {}

  // TODO: エンドポイントを実装
}
