import { Injectable } from '@nestjs/common';
import { BulletinBoardClient } from './bulletin-board.client';

@Injectable()
export class BulletinBoardService {
  constructor(private readonly bulletinBoardClient: BulletinBoardClient) {}

  // TODO: ビジネスロジックを実装
}
