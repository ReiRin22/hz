import { Controller } from '@nestjs/common';
import { ShiftSystemService } from './shift-system.service';

@Controller('shift-system')
export class ShiftSystemController {
  constructor(private readonly shiftSystemService: ShiftSystemService) {}

  // TODO: エンドポイントを実装
}
