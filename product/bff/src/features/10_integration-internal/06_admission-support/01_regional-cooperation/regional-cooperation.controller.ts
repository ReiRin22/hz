import { Controller } from '@nestjs/common';
import { RegionalCooperationService } from './regional-cooperation.service';

@Controller('regional-cooperation')
export class RegionalCooperationController {
  constructor(private readonly regionalCooperationService: RegionalCooperationService) {}

  // TODO: エンドポイントを実装
}
