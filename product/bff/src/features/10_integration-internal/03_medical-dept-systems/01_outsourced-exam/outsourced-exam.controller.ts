import { Controller } from '@nestjs/common';
import { OutsourcedExamService } from './outsourced-exam.service';

@Controller('outsourced-exam')
export class OutsourcedExamController {
  constructor(private readonly outsourcedExamService: OutsourcedExamService) {}

  // TODO: エンドポイントを実装
}
