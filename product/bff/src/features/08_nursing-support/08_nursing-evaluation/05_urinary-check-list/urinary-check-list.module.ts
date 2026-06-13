import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UrinaryCheckListController } from './urinary-check-list.controller';
import { UrinaryCheckListService } from './urinary-check-list.service';
import { UrinaryCheckListClient } from './urinary-check-list.client';

@Module({
  imports: [HttpModule],
  controllers: [UrinaryCheckListController],
  providers: [UrinaryCheckListService, UrinaryCheckListClient],
})
export class UrinaryCheckListModule {}
