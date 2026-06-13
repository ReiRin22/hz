import { Controller } from '@nestjs/common';
import { EndoscopySystemService } from './endoscopy-system.service';

@Controller('endoscopy-system')
export class EndoscopySystemController {
  constructor(private readonly endoscopySystemService: EndoscopySystemService) {}

  // TODO: エンドポイントを実装
}
