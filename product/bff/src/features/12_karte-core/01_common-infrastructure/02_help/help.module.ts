import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HelpController } from './help.controller';
import { HelpService } from './help.service';
import { HelpClient } from './help.client';

@Module({
  imports: [HttpModule],
  controllers: [HelpController],
  providers: [HelpService, HelpClient],
})
export class HelpModule {}
