import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RightSidemenuController } from './right-sidemenu.controller';
import { RightSidemenuService } from './right-sidemenu.service';
import { RightSidemenuClient } from './right-sidemenu.client';

@Module({
  imports: [HttpModule],
  controllers: [RightSidemenuController],
  providers: [RightSidemenuService, RightSidemenuClient],
})
export class RightSidemenuModule {}
