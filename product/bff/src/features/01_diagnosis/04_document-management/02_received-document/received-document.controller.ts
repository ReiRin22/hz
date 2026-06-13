import { Controller } from '@nestjs/common';
import { ReceivedDocumentService } from './received-document.service';

@Controller('received-document')
export class ReceivedDocumentController {
  constructor(private readonly receivedDocumentService: ReceivedDocumentService) {}

  // TODO: エンドポイントを実装
}
