import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BulletinBoardController } from './bulletin-board.controller';
import { BulletinBoardService } from './bulletin-board.service';
import { BulletinBoardClient } from './bulletin-board.client';

@Module({
  imports: [HttpModule],
  controllers: [BulletinBoardController],
  providers: [BulletinBoardService, BulletinBoardClient],
})
export class BulletinBoardModule {}
