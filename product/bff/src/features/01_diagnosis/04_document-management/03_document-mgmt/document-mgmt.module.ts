import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DocumentMgmtController } from './document-mgmt.controller';
import { DocumentMgmtService } from './document-mgmt.service';
import { DocumentMgmtClient } from './document-mgmt.client';

@Module({
  imports: [HttpModule],
  controllers: [DocumentMgmtController],
  providers: [DocumentMgmtService, DocumentMgmtClient],
})
export class DocumentMgmtModule {}
