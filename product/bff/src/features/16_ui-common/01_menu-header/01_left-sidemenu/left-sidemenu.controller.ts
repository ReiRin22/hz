import { Controller } from '@nestjs/common';
import { LeftSidemenuService } from './left-sidemenu.service';

@Controller('left-sidemenu')
export class LeftSidemenuController {
  constructor(private readonly leftSidemenuService: LeftSidemenuService) {}

  // TODO: エンドポイントを実装
}
