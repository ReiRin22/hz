import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AcpInfoController } from './acp-info.controller';
import { AcpInfoService } from './acp-info.service';
import { AcpInfoClient } from './acp-info.client';

@Module({
  imports: [HttpModule],
  controllers: [AcpInfoController],
  providers: [AcpInfoService, AcpInfoClient],
})
export class AcpInfoModule {}
