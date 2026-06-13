import { Controller } from '@nestjs/common';
import { OutsourcedBacteriaService } from './outsourced-bacteria.service';

@Controller('outsourced-bacteria')
export class OutsourcedBacteriaController {
  constructor(private readonly outsourcedBacteriaService: OutsourcedBacteriaService) {}

  // TODO: エンドポイントを実装
}
