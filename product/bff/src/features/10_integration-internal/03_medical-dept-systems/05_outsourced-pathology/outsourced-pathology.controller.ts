import { Controller } from '@nestjs/common';
import { OutsourcedPathologyService } from './outsourced-pathology.service';

@Controller('outsourced-pathology')
export class OutsourcedPathologyController {
  constructor(private readonly outsourcedPathologyService: OutsourcedPathologyService) {}

  // TODO: エンドポイントを実装
}
