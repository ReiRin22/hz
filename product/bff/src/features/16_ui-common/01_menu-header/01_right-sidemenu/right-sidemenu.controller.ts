import { Controller } from '@nestjs/common';
import { RightSidemenuService } from './right-sidemenu.service';

@Controller('right-sidemenu')
export class RightSidemenuController {
  constructor(private readonly rightSidemenuService: RightSidemenuService) {}

  // TODO: エンドポイントを実装
}
