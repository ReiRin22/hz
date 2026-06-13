import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LeftSidemenuController } from './left-sidemenu.controller';
import { LeftSidemenuService } from './left-sidemenu.service';
import { LeftSidemenuClient } from './left-sidemenu.client';

@Module({
  imports: [HttpModule],
  controllers: [LeftSidemenuController],
  providers: [LeftSidemenuService, LeftSidemenuClient],
})
export class LeftSidemenuModule {}
