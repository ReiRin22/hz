import { Controller } from '@nestjs/common';
import { BulletinBoardService } from './bulletin-board.service';

@Controller('bulletin-board')
export class BulletinBoardController {
  constructor(private readonly bulletinBoardService: BulletinBoardService) {}

  // TODO: エンドポイントを実装
}
