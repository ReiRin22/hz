import { Controller } from '@nestjs/common';
import { RegionalNetworkService } from './regional-network.service';

@Controller('regional-network')
export class RegionalNetworkController {
  constructor(private readonly regionalNetworkService: RegionalNetworkService) {}

  // TODO: エンドポイントを実装
}
