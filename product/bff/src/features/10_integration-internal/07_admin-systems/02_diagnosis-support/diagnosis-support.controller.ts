import { Controller } from '@nestjs/common';
import { DiagnosisSupportService } from './diagnosis-support.service';

@Controller('diagnosis-support')
export class DiagnosisSupportController {
  constructor(private readonly diagnosisSupportService: DiagnosisSupportService) {}

  // TODO: エンドポイントを実装
}
