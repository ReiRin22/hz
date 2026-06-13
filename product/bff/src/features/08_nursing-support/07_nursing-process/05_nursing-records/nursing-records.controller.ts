import { Controller } from '@nestjs/common';
import { NursingRecordsService } from './nursing-records.service';

@Controller('nursing-records')
export class NursingRecordsController {
  constructor(private readonly nursingRecordsService: NursingRecordsService) {}

  // TODO: エンドポイントを実装
}
