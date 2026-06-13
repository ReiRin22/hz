import { Controller } from '@nestjs/common';
import { HomeMgmtService } from './home-mgmt.service';

@Controller('home-mgmt')
export class HomeMgmtController {
  constructor(private readonly homeMgmtService: HomeMgmtService) {}

  // TODO: エンドポイントを実装
}
