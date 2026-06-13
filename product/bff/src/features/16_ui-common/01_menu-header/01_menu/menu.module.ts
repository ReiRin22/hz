import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuClient } from './menu.client';

@Module({
  imports: [HttpModule],
  controllers: [MenuController],
  providers: [MenuService, MenuClient],
})
export class MenuModule {}
