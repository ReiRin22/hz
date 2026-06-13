import { Controller } from '@nestjs/common';
import { DocumentMgmtService } from './document-mgmt.service';

@Controller('document-mgmt')
export class DocumentMgmtController {
  constructor(private readonly documentMgmtService: DocumentMgmtService) {}

  // TODO: エンドポイントを実装
}
