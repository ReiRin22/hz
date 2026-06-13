import { Controller } from '@nestjs/common';
import { NursingDatabaseService } from './nursing-database.service';

@Controller('nursing-database')
export class NursingDatabaseController {
  constructor(private readonly nursingDatabaseService: NursingDatabaseService) {}

  // TODO: エンドポイントを実装
}
