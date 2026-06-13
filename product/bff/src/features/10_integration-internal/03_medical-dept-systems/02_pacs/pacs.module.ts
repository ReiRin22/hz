import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PacsController } from './pacs.controller';
import { PacsService } from './pacs.service';
import { PacsClient } from './pacs.client';

@Module({
  imports: [HttpModule],
  controllers: [PacsController],
  providers: [PacsService, PacsClient],
})
export class PacsModule {}
