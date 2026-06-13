import { Controller } from '@nestjs/common';
import { NursingDegreeService } from './nursing-degree.service';

@Controller('nursing-degree')
export class NursingDegreeController {
  constructor(private readonly nursingDegreeService: NursingDegreeService) {}

  // TODO: エンドポイントを実装
}
